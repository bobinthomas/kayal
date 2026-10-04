/**
 * Order notifications. Best-effort: a failed send is logged to
 * notification_logs and never blocks the order flow. Channel = email for v1;
 * WhatsApp is a wa.me link built in the dashboard. New channels (SMS,
 * WhatsApp API) plug in here later.
 * Leading underscore excludes this file from Pages Functions routing.
 */
import { sendMail } from "./_mail";
import { getSetting, money, type OrderItem, type OrderRow } from "./_util";

export interface NotifyEnv {
  DB: D1Database;
  RESEND_API_KEY?: string;
  ORDER_TO_EMAIL?: string;
}

export type OrderEvent =
  | "placed"
  | "confirmed"
  | "payment_received"
  | "payment_failed"
  | "ready"
  | "declined";

interface PaymentSettings {
  instructions: string;
  bank: { accountName: string; bsb: string; accountNumber: string };
  payid?: string;
}

function invoiceLines(order: OrderRow, payment: PaymentSettings, orderUrl: string): string[] {
  const items = JSON.parse(order.items_json) as OrderItem[];
  const lines = [
    `KAYAL ORDER #${order.id}`,
    `Date: ${order.created_at.slice(0, 10)}`,
    "",
    `Customer: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    order.fulfilment === "delivery" ? `Delivery: ${order.address}` : "Pickup",
    "",
    "---",
    ...items.map(
      (i) => `${i.name}  x${i.qty}  ${money(i.unit_cents)} = ${money(i.unit_cents * i.qty)}`,
    ),
    "---",
    `Subtotal: ${money(order.subtotal_cents)}`,
  ];
  if (order.discount_cents) lines.push(`WhatsApp member discount: -${money(order.discount_cents)}`);
  if (order.fee_cents) lines.push(`Delivery fee: ${money(order.fee_cents)}`);
  if (order.tax_cents) lines.push(`Tax: ${money(order.tax_cents)}`);
  lines.push(`TOTAL DUE: ${money(order.total_cents)}`, "", "PAYMENT", payment.instructions);
  lines.push(
    `Account name: ${payment.bank.accountName}`,
    `BSB: ${payment.bank.bsb}`,
    `Account number: ${payment.bank.accountNumber}`,
  );
  if (payment.payid) lines.push(`PayID: ${payment.payid}`);
  lines.push(
    `Use ${order.id} as the payment reference.`,
    "",
    "Once paid, upload your receipt or enter the transaction reference here:",
    orderUrl,
  );
  return lines;
}

async function log(
  db: D1Database,
  orderId: string,
  event: OrderEvent,
  ok: boolean,
  error?: string,
) {
  await db
    .prepare(
      `INSERT INTO notification_logs (id, order_id, channel, event, status, error) VALUES (?, ?, 'email', ?, ?, ?)`,
    )
    .bind(crypto.randomUUID(), orderId, event, ok ? "sent" : "failed", error ?? null)
    .run();
}

export async function notifyOrder(
  env: NotifyEnv,
  order: OrderRow,
  event: OrderEvent,
  origin: string,
) {
  try {
    const orderUrl = `${origin}/order/?id=${encodeURIComponent(order.id)}&t=${order.access_token}`;
    const restaurant = await getSetting<{ email?: string }>(env.DB, "restaurant", {});
    const ownerTo = env.ORDER_TO_EMAIL || restaurant.email || "hello@kayal.com.au";

    if (!env.RESEND_API_KEY) {
      await log(env.DB, order.id, event, false, "RESEND_API_KEY not set");
      return;
    }

    if (event === "placed") {
      const payment = await getSetting<PaymentSettings>(env.DB, "payment", {
        instructions: "",
        bank: { accountName: "", bsb: "", accountNumber: "" },
      });
      const lines = invoiceLines(order, payment, orderUrl);
      const ownerOk = await sendMail(
        env.RESEND_API_KEY,
        ownerTo,
        "Kayal Foods",
        `New order ${order.id} — ${money(order.total_cents)}`,
        [
          `New order from ${order.customer_name} (${order.customer_phone}).`,
          order.whatsapp_member
            ? "Says they're in the WhatsApp group."
            : "NOT in the WhatsApp group — add them, then mark added in the dashboard.",
          "",
          ...lines,
        ],
        order.customer_email
          ? { email: order.customer_email, name: order.customer_name }
          : undefined,
      );
      await log(env.DB, order.id, event, ownerOk, ownerOk ? undefined : "owner email failed");
      if (order.customer_email) {
        const ok = await sendMail(
          env.RESEND_API_KEY,
          order.customer_email,
          order.customer_name,
          `Your Kayal order ${order.id}`,
          lines,
          { email: ownerTo, name: "Kayal Foods" },
        );
        await log(env.DB, order.id, event, ok, ok ? undefined : "customer email failed");
      }
      return;
    }

    if (!order.customer_email) return;
    const messages: Record<Exclude<OrderEvent, "placed">, [string, string]> = {
      confirmed: [
        "Order confirmed",
        "Your order is confirmed. Please complete payment and upload your receipt.",
      ],
      payment_received: [
        "Payment received",
        "We have verified your payment. Your order is being prepared.",
      ],
      payment_failed: [
        "Payment needs attention",
        "We couldn't match your payment to the order total. Please resubmit your receipt or reply to this email.",
      ],
      ready: [
        "Order ready",
        order.fulfilment === "delivery"
          ? "Your order is ready and on its way."
          : "Your order is ready for pickup.",
      ],
      declined: ["Order declined", "Sorry, we can't fulfil this order. Please contact us for details."],
    };
    const [subject, body] = messages[event];
    const ok = await sendMail(
      env.RESEND_API_KEY,
      order.customer_email,
      order.customer_name,
      `${subject} — ${order.id}`,
      [`Hi ${order.customer_name},`, "", body, "", `Order ${order.id}: ${orderUrl}`],
      { email: ownerTo, name: "Kayal Foods" },
    );
    await log(env.DB, order.id, event, ok, ok ? undefined : "email failed");
  } catch (e) {
    console.error("notifyOrder failed", e);
  }
}
