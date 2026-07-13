/**
 * Cloudflare Pages Function: password-gated list of all Onam Sadhya bookings
 * for the /dashboard page. Auth: X-Dashboard-Password header compared
 * against the DASHBOARD_PASSWORD secret (see functions/api/_auth.ts).
 */
import { checkDashboardAuth, type DashboardEnv } from "./_auth";

interface Env extends DashboardEnv {
  DB: D1Database;
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

  const { results } = await env.DB.prepare(
    `SELECT * FROM bookings ORDER BY event_date ASC, created_at ASC`,
  ).all();

  return json({ ok: true, bookings: results });
};
