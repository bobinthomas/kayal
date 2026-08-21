/**
 * Cloudflare Pages Function: password-gated removal of an availability
 * block, used by the /dashboard page's AvailabilityManager.
 * Auth: X-Dashboard-Password header compared against DASHBOARD_PASSWORD.
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkDashboardAuth(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  if (!body.id) {
    return json({ ok: false, error: "Missing id." }, 400);
  }

  await env.DB.prepare(`DELETE FROM availability_blocks WHERE id = ?`).bind(body.id).run();

  return json({ ok: true });
};
