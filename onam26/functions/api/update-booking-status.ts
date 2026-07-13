/**
 * Cloudflare Pages Function: password-gated confirm/decline action for a
 * single booking, used by the /dashboard page's BookingsTable.
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

  const result = await env.DB.prepare(
    `UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?`,
  )
    .bind(status, new Date().toISOString(), id)
    .run();

  if (result.meta.changes === 0) {
    return json({ ok: false, error: "Booking not found." }, 404);
  }

  return json({ ok: true });
};
