/**
 * Cloudflare Pages Function: password-gated receipt viewer for the
 * dashboard. Looks up a booking's receipt_key in D1, then streams the
 * matching object from R2 (binding `RECEIPTS`) — receipts are never
 * public, only reachable with the dashboard password.
 *
 * Usage: GET /api/receipt?id=<bookingId>
 */
import { checkDashboardAuth, type DashboardEnv } from "./_auth";

interface Env extends DashboardEnv {
  DB: D1Database;
  RECEIPTS: R2Bucket;
}

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkDashboardAuth(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return json({ ok: false, error: "Missing id." }, 400);
  }

  const row = await env.DB.prepare(`SELECT receipt_key FROM bookings WHERE id = ?`)
    .bind(id)
    .first<{ receipt_key: string | null }>();

  if (!row || !row.receipt_key) {
    return json({ ok: false, error: "No receipt for this booking." }, 404);
  }

  const object = await env.RECEIPTS.get(row.receipt_key);
  if (!object) {
    return json({ ok: false, error: "Receipt file not found." }, 404);
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
};
