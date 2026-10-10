/**
 * Admin: record that a non-member customer has been added to the WhatsApp
 * group (the add itself happens in the WhatsApp app — there's no API for
 * ordinary groups). Marks every order from the same phone number, so the
 * customer isn't flagged again on older orders.
 *   POST { id, added }
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { json, normalizePhone } from "./_util";

interface Env extends AdminEnv {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);
  const b = (await request.json().catch(() => ({}))) as { id?: string; added?: boolean };
  if (!b.id) return json({ ok: false, error: "Missing order id." }, 400);

  const order = await env.DB.prepare(`SELECT customer_phone FROM orders WHERE id = ?`)
    .bind(b.id)
    .first<{ customer_phone: string }>();
  if (!order) return json({ ok: false, error: "Order not found." }, 404);

  // Match the same customer however they typed the number (spaces, +61…).
  const target = normalizePhone(order.customer_phone);
  const all = await env.DB.prepare(`SELECT id, customer_phone FROM orders`).all<{
    id: string;
    customer_phone: string;
  }>();
  const ids = all.results.filter((r) => normalizePhone(r.customer_phone) === target).map((r) => r.id);
  const value = b.added === false ? 0 : 1;
  await env.DB.batch(
    ids.map((id) => env.DB.prepare(`UPDATE orders SET whatsapp_added = ? WHERE id = ?`).bind(value, id)),
  );
  return json({ ok: true, updated: ids.length });
};
