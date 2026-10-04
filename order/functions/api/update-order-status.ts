/**
 * Admin: move an order to a new status. Rejects transitions not allowed by
 * TRANSITIONS, then notifies the customer. Payment verification goes through
 * verify-payment.ts so proofs and status stay in step.
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { notifyOrder, type NotifyEnv, type OrderEvent } from "./_notify";
import { json, STATUSES, TRANSITIONS, type OrderRow, type OrderStatus } from "./_util";

interface Env extends AdminEnv, NotifyEnv {}

const EVENT_FOR: Partial<Record<OrderStatus, OrderEvent>> = {
  confirmed: "confirmed",
  payment_received: "payment_received",
  payment_failed: "payment_failed",
  ready: "ready",
  declined: "declined",
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);

  const body = (await request.json().catch(() => ({}))) as { id?: string; status?: string };
  const next = body.status as OrderStatus;
  if (!body.id || !STATUSES.includes(next)) return json({ ok: false, error: "Bad request." }, 400);
  // Payment states only move via verify-payment (keeps proofs consistent).
  if (next === "payment_received" || next === "payment_failed") {
    return json({ ok: false, error: "Use verify-payment for payment states." }, 400);
  }

  const order = await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`)
    .bind(body.id)
    .first<OrderRow>();
  if (!order) return json({ ok: false, error: "Order not found." }, 404);
  if (!TRANSITIONS[order.status].includes(next)) {
    return json({ ok: false, error: `Cannot move from ${order.status} to ${next}.` }, 409);
  }

  await env.DB.prepare(`UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(next, order.id)
    .run();

  const event = EVENT_FOR[next];
  if (event) await notifyOrder(env, { ...order, status: next }, event, new URL(request.url).origin);
  return json({ ok: true });
};
