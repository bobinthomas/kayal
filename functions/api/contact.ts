/**
 * Cloudflare Pages Function: handles contact + catering form submissions.
 * Spam defence: honeypot field ("website") + optional Turnstile verification.
 * Delivery: MailChannels (free on Workers) → hello@kayal.com.au.
 *
 * Environment variables (set in the Cloudflare Pages dashboard):
 *   TURNSTILE_SECRET_KEY  — optional; enables Turnstile verification
 *   CONTACT_TO_EMAIL      — optional override; defaults to hello@kayal.com.au
 */

interface Env {
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

  const mail = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: toEmail, name: "Kayal Foods" }] }],
      from: { email: FROM_EMAIL, name: "kayal.com.au website" },
      reply_to: email ? { email, name } : undefined,
      subject: subjectLine,
      content: [
        { type: "text/plain", value: lines.join("\n") },
        {
          type: "text/html",
          value: `<pre style="font-family:sans-serif">${escapeHtml(lines.join("\n"))}</pre>`,
        },
      ],
    }),
  });

  if (!mail.ok && mail.status !== 202) {
    return json({ ok: false, error: "Mail delivery failed." }, 502);
  }
  return json({ ok: true });
};
