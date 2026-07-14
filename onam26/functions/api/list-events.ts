/**
 * Cloudflare Pages Function: password-gated list of all analytics events
 * for the /dashboard page's funnel/click summary. Auth: X-Dashboard-Password
 * header compared against the DASHBOARD_PASSWORD secret (see _auth.ts).
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
    `SELECT * FROM analytics_events ORDER BY created_at ASC`,
  ).all();

  return json({ ok: true, events: results });
};
