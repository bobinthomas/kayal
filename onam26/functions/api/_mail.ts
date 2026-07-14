/**
 * Shared Resend email sender for submit-booking.ts and
 * update-booking-status.ts. Leading underscore excludes this file from
 * Cloudflare Pages Functions routing (it's a helper module, not a route).
 *
 * Sends from the mail.kayal.com.au domain, verified in Resend (SPF/DKIM
 * DNS records added at Bluehost, scoped to that subdomain only — the root
 * kayal.com.au domain's existing email is untouched).
 */
const FROM_EMAIL = "no-reply@mail.kayal.com.au";
const FROM_NAME = "Onam Sadhya 2026 — Kayal Foods";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendMail(
  apiKey: string,
  to: string,
  toName: string,
  subject: string,
  lines: string[],
  replyTo?: { email: string; name: string },
): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [`${toName} <${to}>`],
      reply_to: replyTo ? `${replyTo.name} <${replyTo.email}>` : undefined,
      subject,
      text: lines.join("\n"),
      html: `<pre style="font-family:sans-serif">${escapeHtml(lines.join("\n"))}</pre>`,
    }),
  });
  return res.ok;
}
