/**
 * Cloudflare Pages Function: password-gated creation of an availability
 * block, used by the /dashboard page's AvailabilityManager. A block with
 * an empty timeSlot closes the whole date for that service type; a
 * non-empty timeSlot closes just that dine-in slot.
 * Auth: X-Dashboard-Password header compared against DASHBOARD_PASSWORD.
 */
import { checkDashboardAuth, type DashboardEnv } from "./_auth";
import { isValidDateForService, type ServiceType } from "../../data/onam-event";

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

  let body: { serviceType?: ServiceType; eventDate?: string; timeSlot?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const { serviceType, eventDate } = body;
  const timeSlot = String(body.timeSlot || "").trim();

  if (serviceType !== "dine_in" && serviceType !== "takeaway") {
    return json({ ok: false, error: "Invalid service type." }, 400);
  }
  if (!eventDate || !isValidDateForService(serviceType, eventDate)) {
    return json({ ok: false, error: "Invalid event date." }, 400);
  }
  if (timeSlot && serviceType !== "dine_in") {
    return json({ ok: false, error: "Time slots only apply to dine-in." }, 400);
  }

  const row = await env.DB.prepare(
    `INSERT INTO availability_blocks (id, created_at, service_type, event_date, time_slot)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (service_type, event_date, time_slot) DO UPDATE SET service_type = service_type
     RETURNING id`,
  )
    .bind(crypto.randomUUID(), new Date().toISOString(), serviceType, eventDate, timeSlot)
    .first<{ id: string }>();

  return json({ ok: true, id: row!.id });
};
