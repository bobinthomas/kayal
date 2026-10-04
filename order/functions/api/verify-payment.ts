/**
 * Admin: verify / reject / query a payment proof. Verifying moves the order
 * to payment_received; rejecting moves it to payment_failed (customer is
 * asked to resubmit); "clarify" only records a note on the proof.
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { notifyOrder, type NotifyEnv } from "./_notify";
import { json, TRANSITIONS, type OrderRow } from "./_util";

interface Env extends AdminEnv, NotifyEnv {}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);

  const body = (await request.json().catch(() => ({}))) as {
    proofId?: string;
    action?: string;
    note?: string;
  };
  if (!body.proofId || !["verify", "reject", "clarify"].includes(body.action ?? "")) {
    return json({ ok: false, error: "Bad request." }, 400);
  }
  const note = (body.note ?? "").trim().slice(0, 500) || null;

  const proof = await env.DB.prepare(`SELECT id, order_id FROM payment_proofs WHERE id = ?`)
    .bind(body.proofId)
    .first<{ id: string; order_id: string }>();
  if (!proof) return json({ ok: false, error: "Proof not found." }, 404);

  const order = await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`)
    .bind(proof.order_id)
    .first<OrderRow>();
  if (!order) return json({ ok: false, error: "Order not found." }, 404);

  const proofStatus =
    body.action === "verify" ? "verified" : body.action === "reject" ? "rejected" : "clarify";
  const nextStatus =
    body.action === "verify" ? "payment_received" : body.action === "reject" ? "payment_failed" : null;

  if (nextStatus && !TRANSITIONS[order.status].includes(nextStatus)) {
    return json({ ok: false, error: `Order is ${order.status}; confirm it first.` }, 409);
  }

  await env.DB.prepare(`UPDATE payment_proofs SET status = ?, admin_note = ? WHERE id = ?`)
    .bind(proofStatus, note, proof.id)
    .run();

  if (nextStatus) {
    await env.DB.prepare(`UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(nextStatus, order.id)
      .run();
    await notifyOrder(
      env,
      { ...order, status: nextStatus },
      nextStatus === "payment_received" ? "payment_received" : "payment_failed",
      new URL(request.url).origin,
    );
  }
  return json({ ok: true });
};
