/**
 * Admin: read and update business settings (restaurant contact, payment
 * details, tax, home screen, WhatsApp member discount, delivery/pickup toggles). Only whitelisted keys are
 * accepted, and each value is rebuilt field by field, so arbitrary JSON
 * can't be stored.
 *   GET  -> { settings: { restaurant, payment, tax, home, whatsapp, delivery } }
 *   POST -> { key, value }
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { HOME_DEFAULTS, json } from "./_util";

interface Env extends AdminEnv {
  DB: D1Database;
}

type Raw = Record<string, unknown>;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bool = (v: unknown) => v === true;

const SANITIZE: Record<string, (v: Raw) => object | string> = {
  restaurant: (v) => {
    const email = str(v.email, 200);
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Restaurant email looks invalid.";
    return { name: str(v.name, 100), phone: str(v.phone, 30), email };
  },
  payment: (v) => {
    const bank = (v.bank ?? {}) as Raw;
    return {
      instructions: str(v.instructions, 1000),
      bank: {
        accountName: str(bank.accountName, 80),
        bsb: str(bank.bsb, 20),
        accountNumber: str(bank.accountNumber, 30),
      },
      payid: str(v.payid, 100),
    };
  },
  tax: (v) => {
    const rateBps = typeof v.rateBps === "number" ? Math.round(v.rateBps) : NaN;
    if (!Number.isFinite(rateBps) || rateBps < 0 || rateBps > 3000) return "Tax rate must be 0–30%.";
    return { rateBps, inclusive: bool(v.inclusive) };
  },
  home: (v) => {
    const imageUrl = str(v.imageUrl, 500);
    if (imageUrl && !/^(\/[^/]|https:\/\/)/.test(imageUrl)) return "Photo must be an uploaded photo or https:// link.";
    const headline = str(v.headline, 90);
    if (!headline) return "The headline can't be empty.";
    return {
      badge: str(v.badge, 40),
      headline,
      text: str(v.text, 280),
      buttonLabel: str(v.buttonLabel, 24) || HOME_DEFAULTS.buttonLabel,
      imageUrl: imageUrl || HOME_DEFAULTS.imageUrl,
    };
  },
  whatsapp: (v) => {
    const discountPercent = typeof v.discountPercent === "number" ? v.discountPercent : NaN;
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 50) {
      return "Member discount must be 0–50%.";
    }
    return { discountEnabled: bool(v.discountEnabled), discountPercent: Math.round(discountPercent * 100) / 100 };
  },
  delivery: (v) => {
    const out = { pickupEnabled: bool(v.pickupEnabled), deliveryEnabled: bool(v.deliveryEnabled) };
    if (!out.pickupEnabled && !out.deliveryEnabled) return "Enable at least one of pickup or delivery.";
    return out;
  },
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);
  const rows = await env.DB.prepare(`SELECT key, value_json FROM settings`).all<{
    key: string;
    value_json: string;
  }>();
  const settings: Record<string, unknown> = { home: HOME_DEFAULTS };
  for (const r of rows.results) {
    if (r.key in SANITIZE) settings[r.key] = JSON.parse(r.value_json);
  }
  return json({ ok: true, settings });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);
  const body = (await request.json().catch(() => ({}))) as { key?: string; value?: Raw };
  const sanitize = body.key ? SANITIZE[body.key] : undefined;
  if (!sanitize || typeof body.value !== "object" || body.value === null) {
    return json({ ok: false, error: "Unknown setting." }, 400);
  }
  const value = sanitize(body.value);
  if (typeof value === "string") return json({ ok: false, error: value }, 400);

  await env.DB.prepare(
    `INSERT INTO settings (key, value_json) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json`,
  )
    .bind(body.key, JSON.stringify(value))
    .run();
  return json({ ok: true });
};
