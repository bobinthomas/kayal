/** Admin: list recent orders with their payment proofs. */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { json } from "./_util";

interface Env extends AdminEnv {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);

  const orders = await env.DB.prepare(
    `SELECT id, created_at, customer_name, customer_phone, customer_email, fulfilment, address, zone_id, notes, items_json, subtotal_cents, discount_cents, fee_cents, tax_cents, total_cents, status, whatsapp_member, whatsapp_added,
            original_items_json, original_total_cents, adjustment_note
     FROM orders ORDER BY created_at DESC LIMIT 300`,
  ).all();
  const proofs = await env.DB.prepare(
    `SELECT id, order_id, txn_ref, status, admin_note, created_at, receipt_key IS NOT NULL AS has_file
     FROM payment_proofs ORDER BY created_at`,
  ).all();

  return json({ ok: true, orders: orders.results, proofs: proofs.results });
};
