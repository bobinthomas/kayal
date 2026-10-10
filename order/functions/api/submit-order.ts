/**
 * Public: create an order. Prices, delivery fee and tax are ALWAYS recomputed
 * from D1 here; client-sent amounts are ignored. Inserts a `pending` order,
 * then sends the invoice email best-effort.
 */
import { notifyOrder, type NotifyEnv } from "./_notify";
import {
  deliveryFee,
  getSetting,
  json,
  priceOrder,
  randomToken,
  type OrderItem,
  type OrderRow,
} from "./_util";

interface Env extends NotifyEnv {
  TURNSTILE_SECRET_KEY?: string;
}

interface Payload {
  website?: string; // honeypot
  idempotencyKey?: string;
  turnstileToken?: string;
  name?: string;
  phone?: string;
  email?: string;
  fulfilment?: string;
  address?: string;
  zoneId?: string;
  notes?: string;
  whatsappMember?: boolean;
  items?: { id?: string; qty?: number }[];
}

const MAX_LINES = 60;
const MAX_QTY = 50;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let p: Payload;
  try {
    p = (await request.json()) as Payload;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: pretend success so bots don't retry.
  if (p.website) return json({ ok: true, id: "KYL-000000-00000", token: "" });

  if (env.TURNSTILE_SECRET_KEY) {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", p.turnstileToken ?? "");
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const verdict = (await res.json()) as { success: boolean };
    if (!verdict.success) return json({ ok: false, error: "Bot check failed." }, 400);
  }

  const name = (p.name ?? "").trim().slice(0, 100);
  const phone = (p.phone ?? "").trim().slice(0, 30);
  const email = (p.email ?? "").trim().slice(0, 200);
  const notes = (p.notes ?? "").trim().slice(0, 500) || null;
  if (!name) return json({ ok: false, error: "Name is required." }, 400);
  if (!/^[+\d][\d\s()-]{6,}$/.test(phone)) {
    return json({ ok: false, error: "A valid phone number is required." }, 400);
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: "Email looks invalid." }, 400);
  }
  if (p.fulfilment !== "delivery" && p.fulfilment !== "pickup") {
    return json({ ok: false, error: "Choose delivery or pickup." }, 400);
  }

  const delivery = await getSetting(env.DB, "delivery", { pickupEnabled: true, deliveryEnabled: true });
  if (p.fulfilment === "pickup" && !delivery.pickupEnabled) {
    return json({ ok: false, error: "Pickup is not available." }, 400);
  }
  if (p.fulfilment === "delivery" && !delivery.deliveryEnabled) {
    return json({ ok: false, error: "Delivery is not available." }, 400);
  }

  const idemKey = (p.idempotencyKey ?? "").slice(0, 64) || null;
  if (idemKey) {
    const existing = await env.DB.prepare(
      `SELECT id, access_token FROM orders WHERE idempotency_key = ?`,
    )
      .bind(idemKey)
      .first<{ id: string; access_token: string }>();
    if (existing) return json({ ok: true, id: existing.id, token: existing.access_token });
  }

  // Merge duplicate lines, validate quantities.
  const qtyById = new Map<string, number>();
  for (const line of p.items ?? []) {
    const qty = Math.floor(Number(line.qty));
    if (!line.id || !Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) {
      return json({ ok: false, error: "Invalid item quantity." }, 400);
    }
    qtyById.set(line.id, Math.min(MAX_QTY, (qtyById.get(line.id) ?? 0) + qty));
  }
  if (qtyById.size === 0 || qtyById.size > MAX_LINES) {
    return json({ ok: false, error: "Add at least one item." }, 400);
  }

  const ids = [...qtyById.keys()];
  const rows = await env.DB.prepare(
    `SELECT id, name, price_cents, available, listed FROM menu_items WHERE id IN (${ids.map(() => "?").join(",")})`,
  )
    .bind(...ids)
    .all<{ id: string; name: string; price_cents: number; available: number; listed: number }>();
  const byId = new Map(rows.results.map((r) => [r.id, r]));

  const items: OrderItem[] = [];
  for (const [id, qty] of qtyById) {
    const row = byId.get(id);
    if (!row || !row.available || !row.listed) {
      return json({ ok: false, error: `"${row?.name ?? id}" is no longer available.` }, 400);
    }
    items.push({ id, name: row.name, qty, unit_cents: row.price_cents });
  }
  const subtotal = items.reduce((s, i) => s + i.unit_cents * i.qty, 0);

  let fee = 0;
  let zoneId: string | null = null;
  let address: string | null = null;
  if (p.fulfilment === "delivery") {
    address = (p.address ?? "").trim().slice(0, 300);
    if (!address) return json({ ok: false, error: "Delivery address is required." }, 400);
    type ZoneRow = { id: string; fee_cents: number; free_over_cents: number };
    // The storefront matches the typed postcode to a suburb. Outside our
    // suburbs there is no zone: charge the first zone's (standard) fee and
    // leave zone_id empty so the kitchen checks the address when confirming.
    const zone = await env.DB.prepare(`SELECT id, fee_cents, free_over_cents FROM zones WHERE id = ? AND active = 1`)
      .bind(p.zoneId ?? "")
      .first<ZoneRow>();
    const pricing =
      zone ??
      (await env.DB.prepare(`SELECT id, fee_cents, free_over_cents FROM zones WHERE active = 1 ORDER BY sort LIMIT 1`).first<ZoneRow>());
    if (!pricing) return json({ ok: false, error: "Delivery isn't available right now — please choose pickup." }, 400);
    zoneId = zone?.id ?? null;
    fee = deliveryFee(pricing, subtotal);
  }

  // Self-declared WhatsApp group member (trust-based, like onam26). The
  // free-delivery threshold above uses the pre-discount subtotal.
  const whatsappMember = p.whatsappMember === true;
  const { discount, tax: taxCents, total } = await priceOrder(env.DB, subtotal, fee, whatsappMember);

  // Order number KYL-YYYYMM-NNNNN, atomic per-month counter.
  const month = new Date().toISOString().slice(0, 7).replace("-", "");
  const counter = await env.DB.prepare(
    `INSERT INTO counters (name, n) VALUES (?, 1) ON CONFLICT(name) DO UPDATE SET n = n + 1 RETURNING n`,
  )
    .bind(`order-${month}`)
    .first<{ n: number }>();
  const id = `KYL-${month}-${String(counter!.n).padStart(5, "0")}`;
  const token = randomToken();

  await env.DB.prepare(
    `INSERT INTO orders (id, access_token, customer_name, customer_phone, customer_email, fulfilment, address, zone_id, notes, items_json, subtotal_cents, fee_cents, tax_cents, total_cents, idempotency_key, whatsapp_member, discount_cents)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      token,
      name,
      phone,
      email || null,
      p.fulfilment,
      address,
      zoneId,
      notes,
      JSON.stringify(items),
      subtotal,
      fee,
      taxCents,
      total,
      idemKey,
      whatsappMember ? 1 : 0,
      discount,
    )
    .run();

  const order = await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(id).first<OrderRow>();
  if (order) await notifyOrder(env, order, "placed", new URL(request.url).origin);

  return json({ ok: true, id, token });
};
