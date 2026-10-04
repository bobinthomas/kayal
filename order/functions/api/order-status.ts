/**
 * Public: customer order page data. Guarded by the unguessable access token
 * from the invoice link. GET /api/order-status?id=&t=
 */
import { getSetting, json, type OrderRow } from "./_util";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  const token = url.searchParams.get("t") ?? "";

  const order = await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`)
    .bind(id)
    .first<OrderRow>();
  if (!order || !token || order.access_token !== token) {
    return json({ ok: false, error: "Order not found." }, 404);
  }

  const proofs = await env.DB.prepare(
    `SELECT txn_ref, status, admin_note, created_at, receipt_key IS NOT NULL AS has_file FROM payment_proofs WHERE order_id = ? ORDER BY created_at`,
  )
    .bind(id)
    .all();
  const payment = await getSetting(env.DB, "payment", {
    instructions: "",
    bank: { accountName: "", bsb: "", accountNumber: "" },
    payid: "",
  });

  return json({
    ok: true,
    order: {
      id: order.id,
      created_at: order.created_at,
      customer_name: order.customer_name,
      fulfilment: order.fulfilment,
      address: order.address,
      items: JSON.parse(order.items_json),
      subtotal_cents: order.subtotal_cents,
      discount_cents: order.discount_cents,
      fee_cents: order.fee_cents,
      tax_cents: order.tax_cents,
      total_cents: order.total_cents,
      status: order.status,
    },
    proofs: proofs.results,
    payment,
  });
};
