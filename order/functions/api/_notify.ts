/**
 * Order notifications. Best-effort: a failed send is logged to
 * notification_logs and never blocks the order flow. Channel = email for v1;
 * WhatsApp is a wa.me link built in the dashboard. New channels (SMS,
 * WhatsApp API) plug in here later.
 * Leading underscore excludes this file from Pages Functions routing.
 */
import { sendMail } from "./_mail";
import { getSetting, isGrocery, lineTotal, money, type OrderItem, type OrderRow } from "./_util";

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

const qtyText = (q: number) => String(Math.round(q * 1000) / 1000);

/** What the admin changed when confirming, e.g. "Bananas: 2 → 2.2". */
function changeLines(order: OrderRow): string[] {
  if (!order.original_items_json) return [];
  const before = JSON.parse(order.original_items_json) as OrderItem[];
  const after = JSON.parse(order.items_json) as OrderItem[];
  const afterById = new Map(after.map((i) => [i.id, i]));
  const out: string[] = [];
  for (const b of before) {
    const a = afterById.get(b.id);
    if (!a) out.push(`- ${b.name}: not available, removed`);
    else if (a.qty !== b.qty || a.unit_cents !== b.unit_cents)
      out.push(
        `- ${b.name}: ${qtyText(b.qty)} → ${qtyText(a.qty)}` +
          (a.unit_cents !== b.unit_cents ? ` (price ${money(b.unit_cents)} → ${money(a.unit_cents)})` : ""),
      );
  }
  const beforeIds = new Set(before.map((i) => i.id));
  for (const a of after) if (!beforeIds.has(a.id)) out.push(`- ${a.name}: added (${qtyText(a.qty)})`);
  return out;
}

/**
 * Invoice text. "estimate" goes out when the order is placed (pay only after
 * we confirm); "final" goes out when the admin confirms, with any changes.
 */
function invoiceLines(order: OrderRow, payment: PaymentSettings, orderUrl: string, kind: "estimate" | "final"): string[] {
  const items = JSON.parse(order.items_json) as OrderItem[];
  const lines = [
    kind === "final" ? `FINAL INVOICE — KAYAL ORDER #${order.id}` : `KAYAL ORDER #${order.id} — ESTIMATE`,
    `Date: ${order.created_at.slice(0, 10)}`,
    "",
    `Customer: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    order.fulfilment === "delivery" ? `Delivery: ${order.address}` : "Pickup",
  ];
  if (kind === "final") {
    const changes = changeLines(order);
    if (changes.length) lines.push("", "We adjusted your order to what's fresh and available:", ...changes);
    if (order.adjustment_note) lines.push("", `Note from Kayal: ${order.adjustment_note}`);
  }
  const foods = items.filter((i) => !isGrocery(i.id));
  const groceries = items.filter((i) => isGrocery(i.id));
  const itemLine = (i: OrderItem) => `${i.name}  x${qtyText(i.qty)}  ${money(i.unit_cents)} = ${money(lineTotal(i))}`;
  const sum = (rows: OrderItem[]) => rows.reduce((t, i) => t + lineTotal(i), 0);
  lines.push("", "---");
  if (foods.length && groceries.length) {
    lines.push("FOODS", ...foods.map(itemLine), `Foods subtotal: ${money(sum(foods))}`, "", "GROCERIES", ...groceries.map(itemLine), `Groceries subtotal: ${money(sum(groceries))}`, "---");
  } else {
    lines.push(...items.map(itemLine), "---");
  }
  lines.push(`Subtotal: ${money(order.subtotal_cents)}`);
  if (order.discount_cents) lines.push(`WhatsApp member discount: -${money(order.discount_cents)}`);
  if (order.fee_cents) lines.push(`Delivery fee: ${money(order.fee_cents)}`);
  if (order.tax_cents) lines.push(`Tax: ${money(order.tax_cents)}`);

  if (kind === "estimate") {
    lines.push(
      `ESTIMATED TOTAL: ${money(order.total_cents)}`,
      "",
      "WHAT HAPPENS NEXT",
      "We'll confirm the actual quantities and send your final invoice shortly.",
      "Please wait for our confirmation before paying.",
      "",
      "PAYMENT DETAILS (for when we confirm)",
    );
  } else {
    lines.push(`TOTAL DUE: ${money(order.total_cents)}`, "", "PAYMENT", payment.instructions);
  }
  lines.push(
    `Account name: ${payment.bank.accountName}`,
    `BSB: ${payment.bank.bsb}`,
    `Account number: ${payment.bank.accountNumber}`,
  );
  if (payment.payid) lines.push(`PayID: ${payment.payid}`);
  lines.push(`Use ${order.id} as the payment reference.`, "");
  lines.push(
    kind === "final"
      ? "Once paid, upload your receipt or enter the transaction reference here:"
      : "Track your order and see the final invoice here:",
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
      const lines = invoiceLines(order, payment, orderUrl, "estimate");
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
          `Order received — ${order.id} (we'll confirm the final amount)`,
          lines,
          { email: ownerTo, name: "Kayal Foods" },
        );
        await log(env.DB, order.id, event, ok, ok ? undefined : "customer email failed");
      }
      return;
    }

    if (!order.customer_email) return;

    if (event === "confirmed") {
      const payment = await getSetting<PaymentSettings>(env.DB, "payment", {
        instructions: "",
        bank: { accountName: "", bsb: "", accountNumber: "" },
      });
      const ok = await sendMail(
        env.RESEND_API_KEY,
        order.customer_email,
        order.customer_name,
        `Final invoice — ${order.id} — ${money(order.total_cents)} to pay`,
        [`Hi ${order.customer_name},`, "", "Your order is confirmed. Here's your final invoice.", "", ...invoiceLines(order, payment, orderUrl, "final")],
        { email: ownerTo, name: "Kayal Foods" },
      );
      await log(env.DB, order.id, event, ok, ok ? undefined : "email failed");
      return;
    }

    const messages: Record<Exclude<OrderEvent, "placed" | "confirmed">, [string, string]> = {
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
