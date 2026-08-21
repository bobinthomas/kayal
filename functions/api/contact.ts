/**
 * Cloudflare Pages Function: handles contact + catering form submissions.
 * Spam defence: honeypot field ("website") + optional Turnstile verification.
 * Delivery: Resend (https://resend.com) → hello@kayal.com.au.
 *
 * Previously used MailChannels' free unauthenticated Workers endpoint, which
 * MailChannels shut down permanently on 2024-08-31 — every submission was
 * silently failing with a 502 until this was caught in an audit.
 *
 * Environment variables (set via `wrangler secret put` / the dashboard):
 *   RESEND_API_KEY        — required; from resend.com, domain must be verified
 *   TURNSTILE_SECRET_KEY  — optional; enables Turnstile verification
 *   CONTACT_TO_EMAIL      — optional override; defaults to hello@kayal.com.au
 */

interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO_EMAIL?: string;
}

const TO_EMAIL_DEFAULT = "hello@kayal.com.au";
const FROM_EMAIL = "no-reply@kayal.com.au";

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid form data." }, 400);
  }

  // Honeypot: real users never fill this in.
  if (String(form.get("website") || "").trim() !== "") {
    // Pretend success so bots don't adapt.
    return json({ ok: true });
  }

  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();
  const subject = String(form.get("subject") || "contact").trim();
  const eventDate = String(form.get("eventDate") || "").trim();
  const guests = String(form.get("guests") || "").trim();

  if (!name || !message || (!phone && !email)) {
    return json({ ok: false, error: "Missing required fields." }, 400);
  }

  // Optional Turnstile verification.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = String(form.get("cf-turnstile-response") || "");
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

  const toEmail = env.CONTACT_TO_EMAIL || TO_EMAIL_DEFAULT;
  const isCatering = subject === "catering";
  const subjectLine = isCatering
    ? `Catering enquiry from ${name}`
    : `Website message from ${name}`;

  const lines = [
    `Name: ${name}`,
    phone && `Phone: ${phone}`,
    email && `Email: ${email}`,
    isCatering && eventDate && `Event date: ${eventDate}`,
    isCatering && guests && `Guests: ${guests}`,
    "",
    message,
  ].filter(Boolean) as string[];

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "Mail delivery is not configured." }, 502);
  }

  const mail = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `kayal.com.au website <${FROM_EMAIL}>`,
      to: [toEmail],
      reply_to: email || undefined,
      subject: subjectLine,
      text: lines.join("\n"),
      html: `<pre style="font-family:sans-serif">${escapeHtml(lines.join("\n"))}</pre>`,
    }),
  });

  if (!mail.ok) {
    return json({ ok: false, error: "Mail delivery failed." }, 502);
  }
  return json({ ok: true });
};
