/**
 * Admin: confirm a new order and send the final invoice.
 *
 * The admin can adjust what's actually being supplied — quantities (including
 * fractional, e.g. 2 -> 2.2 kg), unit prices, removed lines, dishes added from
 * the menu — plus the delivery fee and a note to the customer. Member discount,
 * GST and the total are recomputed here (same rules as checkout). The order as
 * the customer placed it is kept in original_items_json / original_total_cents.
 *
 *   POST { id, items?: [{ id, qty, unit_cents }], feeCents?, note? }
 *   (omit items/feeCents to confirm the order exactly as placed)
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { notifyOrder, type NotifyEnv } from "./_notify";
import { json, lineTotal, priceOrder, type OrderItem, type OrderRow } from "./_util";

interface Env extends AdminEnv, NotifyEnv {}

interface Body {
  id?: string;
  items?: { id?: string; qty?: number; unit_cents?: number }[];
  feeCents?: number;
  note?: string;
}

const MAX_LINES = 60;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);
  const b = (await request.json().catch(() => ({}))) as Body;
  if (!b.id) return json({ ok: false, error: "Missing order id." }, 400);

  const order = await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(b.id).first<OrderRow>();
  if (!order) return json({ ok: false, error: "Order not found." }, 404);
  if (order.status !== "pending") {
    return json({ ok: false, error: "Only new orders can be confirmed." }, 409);
  }

  const placed = JSON.parse(order.items_json) as OrderItem[];
  let items: OrderItem[] = placed;

  if (b.items) {
    if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > MAX_LINES) {
      return json({ ok: false, error: "The order needs at least one item." }, 400);
    }
    const placedById = new Map(placed.map((i) => [i.id, i]));
    // Names for dishes added by the admin come from the menu, never the client.
    const newIds = b.items.map((l) => l.id ?? "").filter((id) => id && !placedById.has(id));
    const menuNames = new Map<string, string>();
    if (newIds.length) {
      const rows = await env.DB.prepare(
        `SELECT id, name FROM menu_items WHERE id IN (${newIds.map(() => "?").join(",")})`,
      )
        .bind(...newIds)
        .all<{ id: string; name: string }>();
      rows.results.forEach((r) => menuNames.set(r.id, r.name));
    }

    const seen = new Set<string>();
    items = [];
    for (const l of b.items) {
      const id = l.id ?? "";
      const qty = typeof l.qty === "number" ? Math.round(l.qty * 1000) / 1000 : NaN;
      const unit = typeof l.unit_cents === "number" ? Math.round(l.unit_cents) : NaN;
      const name = placedById.get(id)?.name ?? menuNames.get(id);
      if (!name) return json({ ok: false, error: "Unknown dish in the order." }, 400);
      if (seen.has(id)) return json({ ok: false, error: `"${name}" is listed twice.` }, 400);
      if (!Number.isFinite(qty) || qty <= 0 || qty > 999) {
        return json({ ok: false, error: `Check the quantity for "${name}".` }, 400);
      }
      if (!Number.isFinite(unit) || unit < 0 || unit > 500000) {
        return json({ ok: false, error: `Check the price for "${name}".` }, 400);
      }
      seen.add(id);
      items.push({ id, name, qty, unit_cents: unit });
    }
  }

  let fee = order.fee_cents;
  if (b.feeCents !== undefined) {
    if (typeof b.feeCents !== "number" || !Number.isFinite(b.feeCents) || b.feeCents < 0 || b.feeCents > 100000) {
      return json({ ok: false, error: "Check the delivery fee." }, 400);
    }
    fee = order.fulfilment === "delivery" ? Math.round(b.feeCents) : 0;
  }

  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const { discount, tax, total } = await priceOrder(env.DB, subtotal, fee, !!order.whatsapp_member);
  const note = (b.note ?? "").trim().slice(0, 500) || null;
  const changed = JSON.stringify(items) !== order.items_json || fee !== order.fee_cents;

  await env.DB.prepare(
    `UPDATE orders SET
       original_items_json = ?, original_total_cents = ?,
       items_json = ?, subtotal_cents = ?, discount_cents = ?, fee_cents = ?, tax_cents = ?, total_cents = ?,
       adjustment_note = ?, status = 'confirmed', confirmed_at = datetime('now'), updated_at = datetime('now')
     WHERE id = ? AND status = 'pending'`,
  )
    .bind(
      changed ? order.items_json : null,
      changed ? order.total_cents : null,
      JSON.stringify(items),
      subtotal,
      discount,
      fee,
      tax,
      total,
      note,
      order.id,
    )
    .run();

  const updated = await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(order.id).first<OrderRow>();
  if (updated) await notifyOrder(env, updated, "confirmed", new URL(request.url).origin);
  return json({ ok: true, total_cents: total, changed });
};
