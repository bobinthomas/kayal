/**
 * Resend email sender (same verified sender domain as onam26).
 * Leading underscore excludes this file from Pages Functions routing.
 */
const FROM_EMAIL = "no-reply@mail.kayal.com.au";
const FROM_NAME = "Kayal Foods";

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
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
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
  } catch {
    return false;
  }
}
