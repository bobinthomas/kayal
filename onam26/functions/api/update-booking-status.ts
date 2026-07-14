/**
 * Cloudflare Pages Function: password-gated confirm/decline action for a
 * single booking, used by the /dashboard page's BookingsTable.
 * Auth: X-Dashboard-Password header compared against DASHBOARD_PASSWORD.
 * On status change, emails the customer (if they gave an email) that
 * their booking was confirmed or declined — best-effort, via Resend.
 */
import { checkDashboardAuth, type DashboardEnv } from "./_auth";
import { sendMail } from "./_mail";
import {
  formatCents,
  formatEventDate,
  formatTimeSlot,
  onamEvent,
  type PackageSize,
  type PaymentMethod,
  type ServiceType,
} from "../../data/onam-event";

interface Env extends DashboardEnv {
  DB: D1Database;
  RESEND_API_KEY: string;
}

type BookingRow = {
  id: string;
  service_type: ServiceType;
  event_date: string;
  time_slot: string | null;
  guests: number | null;
  package_size: PackageSize | null;
  payment_method: PaymentMethod;
  price_total: number;
  customer_name: string;
  customer_email: string | null;
};

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function bookingSummaryLines(row: BookingRow): string[] {
  return [
    `Service: ${row.service_type === "dine_in" ? "Dine-in" : "Takeaway"}`,
    row.service_type === "dine_in"
      ? `Date: ${formatEventDate(row.event_date)} at ${formatTimeSlot(row.time_slot!)}`
      : `Date: ${formatEventDate(row.event_date)} (${onamEvent.timeWindow.open}–${onamEvent.timeWindow.close})`,
    row.service_type === "dine_in" ? `Guests: ${row.guests}` : `Package: ${row.package_size} people`,
    `Payment method: ${row.payment_method === "whatsapp_cash" ? "WhatsApp Members Cash" : "Card / Non-WhatsApp"}`,
    `Total: ${formatCents(row.price_total)}`,
  ];
}

async function notifyCustomer(
  apiKey: string,
  row: BookingRow,
  status: "confirmed" | "declined",
): Promise<void> {
  if (!row.customer_email) return;

  const summaryLines = bookingSummaryLines(row);

  if (status === "confirmed") {
    await sendMail(
      apiKey,
      row.customer_email,
      row.customer_name,
      "Your Onam Sadhya 2026 booking is confirmed!",
      [
        `Hi ${row.customer_name},`,
        "",
        "Great news — your Onam Sadhya 2026 booking has been confirmed.",
        "",
        ...summaryLines,
        "",
        ...(row.service_type === "dine_in" ? [onamEvent.dineInFootnote, ""] : []),
        `Questions? Call us on ${onamEvent.contact.phone.display}.`,
      ],
    ).catch(() => false);
  } else {
    await sendMail(
      apiKey,
      row.customer_email,
      row.customer_name,
      "About your Onam Sadhya 2026 booking request",
      [
        `Hi ${row.customer_name},`,
        "",
        "Sorry — we're unable to accommodate your Onam Sadhya 2026 booking request for the",
        "slot below this time.",
        "",
        ...summaryLines,
        "",
        `Please call or WhatsApp us on ${onamEvent.contact.phone.display} and we'll help find`,
        "another date/time that works, or answer any questions.",
        "",
        "Sorry for the inconvenience — we hope to see you at Kayal Foods soon.",
      ],
    ).catch(() => false);
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkDashboardAuth(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const { id, status } = body;
  if (!id || (status !== "confirmed" && status !== "declined")) {
    return json({ ok: false, error: "Invalid id or status." }, 400);
  }

  const row = await env.DB.prepare(
    `UPDATE bookings SET status = ?, updated_at = ? WHERE id = ? RETURNING *`,
  )
    .bind(status, new Date().toISOString(), id)
    .first<BookingRow>();

  if (!row) {
    return json({ ok: false, error: "Booking not found." }, 404);
  }

  await notifyCustomer(env.RESEND_API_KEY, row, status);

  return json({ ok: true });
};
