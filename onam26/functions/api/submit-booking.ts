/**
 * Cloudflare Pages Function: public Onam Sadhya 2026 booking intake.
 * Spam defence: honeypot field ("website"), same pattern as the main
 * kayal.com.au site's functions/api/contact.ts.
 * Storage: inserts a 'pending' row into D1 (binding `DB`); the owner
 * reviews and confirms/declines from the /dashboard page.
 * Delivery: Resend (mail.kayal.com.au, verified domain) — one email to the
 * owner, one "request received" confirmation to the customer if they gave
 * an email.
 *
 * Environment variables (set in the Cloudflare Pages dashboard):
 *   DASHBOARD_PASSWORD   — required by list-bookings.ts / update-booking-status.ts, unused here
 *   RESEND_API_KEY        — required; Resend API key for mail.kayal.com.au
 *   ONAM_TO_EMAIL         — optional override; defaults to hello@kayal.com.au
 *   TURNSTILE_SECRET_KEY  — optional; enables Turnstile verification
 * D1 binding:
 *   DB — the kayal-onam26-db database (see wrangler.toml / migrations/)
 */
import {
  computePriceCents,
  formatCents,
  formatEventDate,
  formatTimeSlot,
  isValidDateForService,
  isValidDineInTimeSlot,
  onamEvent,
  packageSizes,
  type PackageSize,
  type PaymentMethod,
  type ServiceType,
} from "../../data/onam-event";
import { sendMail } from "./_mail";

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  ONAM_TO_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const TO_EMAIL_DEFAULT = "hello@kayal.com.au";

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type BookingPayload = {
  website?: string;
  serviceType?: ServiceType;
  eventDate?: string;
  timeSlot?: string;
  guests?: number;
  packageSize?: PackageSize;
  paymentMethod?: PaymentMethod;
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
  receiptKey?: string;
  paymentReference?: string;
  "cf-turnstile-response"?: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: BookingPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  // Honeypot: real users never fill this in.
  if (String(payload.website || "").trim() !== "") {
    return json({ ok: true, id: crypto.randomUUID() });
  }

  const serviceType = payload.serviceType;
  const eventDate = String(payload.eventDate || "").trim();
  const paymentMethod = payload.paymentMethod;
  const name = String(payload.name || "").trim();
  const phone = String(payload.phone || "").trim();
  const email = String(payload.email || "").trim();
  const notes = String(payload.notes || "").trim();
  const receiptKey = String(payload.receiptKey || "").trim();
  const paymentReference = String(payload.paymentReference || "").trim();

  if (serviceType !== "dine_in" && serviceType !== "takeaway") {
    return json({ ok: false, error: "Invalid service type." }, 400);
  }
  if (!isValidDateForService(serviceType, eventDate)) {
    return json({ ok: false, error: "That date isn't available for this service." }, 400);
  }
  if (paymentMethod !== "whatsapp_cash" && paymentMethod !== "card") {
    return json({ ok: false, error: "Invalid payment method." }, 400);
  }
  if (!name || !phone) {
    return json({ ok: false, error: "Name and phone are required." }, 400);
  }
  if (!receiptKey && !paymentReference) {
    return json(
      { ok: false, error: "Please upload a payment receipt or enter a reference number." },
      400,
    );
  }

  let guests: number | null = null;
  let packageSize: PackageSize | null = null;
  let timeSlot: string | null = null;

  if (serviceType === "dine_in") {
    guests = Number(payload.guests);
    if (!Number.isInteger(guests) || guests < 1) {
      return json({ ok: false, error: "Enter a valid number of guests." }, 400);
    }
    timeSlot = String(payload.timeSlot || "").trim();
    if (!isValidDineInTimeSlot(eventDate, timeSlot)) {
      return json({ ok: false, error: "Invalid time slot." }, 400);
    }
  } else {
    const size = Number(payload.packageSize) as PackageSize;
    if (!packageSizes.includes(size)) {
      return json({ ok: false, error: "Invalid package size." }, 400);
    }
    packageSize = size;
  }

  // Optional Turnstile verification.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = String(payload["cf-turnstile-response"] || "");
    if (!token) return json({ ok: false, error: "Verification required." }, 403);
    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: request.headers.get("CF-Connecting-IP"),
        }),
      },
    );
    const outcome = (await verify.json()) as { success: boolean };
    if (!outcome.success) {
      return json({ ok: false, error: "Verification failed." }, 403);
    }
  }

  // Price is always recomputed server-side — never trust a client-sent price.
  const priceTotal = computePriceCents({
    serviceType,
    guests: guests ?? undefined,
    packageSize: packageSize ?? undefined,
    paymentMethod,
  });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO bookings
      (id, created_at, updated_at, service_type, event_date, time_slot, guests, package_size,
       payment_method, price_total, customer_name, customer_phone, customer_email, notes,
       receipt_key, payment_reference, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
  )
    .bind(
      id,
      now,
      now,
      serviceType,
      eventDate,
      timeSlot,
      guests,
      packageSize,
      paymentMethod,
      priceTotal,
      name,
      phone,
      email || null,
      notes || null,
      receiptKey || null,
      paymentReference || null,
    )
    .run();

  const summaryLines = [
    `Service: ${serviceType === "dine_in" ? "Dine-in" : "Takeaway"}`,
    serviceType === "dine_in"
      ? `Date: ${formatEventDate(eventDate)} at ${formatTimeSlot(timeSlot!)}`
      : `Date: ${formatEventDate(eventDate)} (${onamEvent.timeWindow.open}–${onamEvent.timeWindow.close})`,
    serviceType === "dine_in" ? `Guests: ${guests}` : `Package: ${packageSize} people`,
    `Payment method: ${paymentMethod === "whatsapp_cash" ? "WhatsApp Members Special Price" : "Card / Non-WhatsApp"}`,
    `Total: ${formatCents(priceTotal)}`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    email && `Email: ${email}`,
    notes && `Notes: ${notes}`,
    receiptKey && "Payment receipt: uploaded (view in dashboard)",
    paymentReference && `Payment reference: ${paymentReference}`,
    serviceType === "dine_in" && onamEvent.dineInFootnote,
  ].filter(Boolean) as string[];

  // Best-effort emails — booking is already saved regardless of delivery outcome.
  await sendMail(
    env.RESEND_API_KEY,
    env.ONAM_TO_EMAIL || TO_EMAIL_DEFAULT,
    "Kayal Foods",
    `New Onam booking request — pending review (${formatEventDate(eventDate)})`,
    summaryLines,
    email ? { email, name } : undefined,
  ).catch(() => false);

  if (email) {
    await sendMail(
      env.RESEND_API_KEY,
      email,
      name,
      "We've received your Onam Sadhya booking request",
      [
        `Hi ${name},`,
        "",
        "Thanks for your Onam Sadhya 2026 booking request. We're now verifying your payment —",
        "we'll confirm by phone, WhatsApp or email shortly.",
        "",
        ...summaryLines,
        "",
        `Questions? Call us on ${onamEvent.contact.phone.display}.`,
      ],
    ).catch(() => false);
  }

  return json({ ok: true, id });
};
