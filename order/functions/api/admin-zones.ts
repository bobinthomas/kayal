/**
 * Admin: delivery areas.
 *   GET  -> all areas (active or not)
 *   POST -> { action: "create" | "update" | "delete", id?, name, areas,
 *             feeCents, freeOverCents, etaMinutes, active }
 * Each area charges feeCents, waived when the order subtotal reaches
 * freeOverCents (0 = never free). Deleting an area doesn't touch past
 * orders (they keep their zone_id and the fee they were charged).
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { json } from "./_util";

interface Env extends AdminEnv {
  DB: D1Database;
}

interface Body {
  action?: string;
  id?: string;
  name?: string;
  areas?: string;
  feeCents?: number;
  freeOverCents?: number;
  etaMinutes?: number | null;
  active?: boolean;
}

// Must be a real number: NaN from a blank field arrives as JSON null and is
// rejected rather than silently becoming 0.
const cents = (v: unknown) => {
  if (typeof v !== "number") return null;
  const n = Math.round(v);
  return Number.isFinite(n) && n >= 0 && n <= 100000 ? n : null;
};

function validate(b: Body) {
  const name = (b.name ?? "").trim().slice(0, 80);
  const fee = cents(b.feeCents);
  const freeOver = cents(b.freeOverCents ?? 0);
  const eta =
    b.etaMinutes == null || (b.etaMinutes as unknown) === ""
      ? null
      : Math.round(Number(b.etaMinutes));
  if (!name) return "Area name is required.";
  if (fee === null) return "Enter a valid delivery fee.";
  if (freeOver === null) return "Enter a valid free-delivery amount (0 for never free).";
  if (eta !== null && (!Number.isFinite(eta) || eta < 0 || eta > 1440)) return "Enter a valid time estimate.";
  return {
    name,
    areas: (b.areas ?? "").trim().slice(0, 500) || null,
    fee,
    freeOver,
    eta,
    active: b.active === false ? 0 : 1,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);
  const zones = await env.DB.prepare(
    `SELECT id, name, areas, fee_cents, free_over_cents, eta_minutes, active FROM zones ORDER BY sort, name`,
  ).all();
  return json({ ok: true, zones: zones.results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);
  const b = (await request.json().catch(() => ({}))) as Body;
  const db = env.DB;

  if (b.action === "delete") {
    if (!b.id) return json({ ok: false, error: "Missing area id." }, 400);
    await db.prepare(`DELETE FROM zones WHERE id = ?`).bind(b.id).run();
    return json({ ok: true });
  }

  if (b.action !== "create" && b.action !== "update") {
    return json({ ok: false, error: "Unknown action." }, 400);
  }
  const v = validate(b);
  if (typeof v === "string") return json({ ok: false, error: v }, 400);

  if (b.action === "create") {
    const id = `zone-${crypto.randomUUID().slice(0, 8)}`;
    await db
      .prepare(
        `INSERT INTO zones (id, name, areas, fee_cents, free_over_cents, eta_minutes, active, sort)
         VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM zones))`,
      )
      .bind(id, v.name, v.areas, v.fee, v.freeOver, v.eta, v.active)
      .run();
    return json({ ok: true, id });
  }

  if (!b.id) return json({ ok: false, error: "Missing area id." }, 400);
  const res = await db
    .prepare(
      `UPDATE zones SET name = ?, areas = ?, fee_cents = ?, free_over_cents = ?, eta_minutes = ?, active = ? WHERE id = ?`,
    )
    .bind(v.name, v.areas, v.fee, v.freeOver, v.eta, v.active, b.id)
    .run();
  if (!res.meta.changes) return json({ ok: false, error: "Area not found." }, 404);
  return json({ ok: true });
};
