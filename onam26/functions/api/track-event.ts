/**
 * Cloudflare Pages Function: public analytics intake for the booking wizard.
 * Receives fire-and-forget beacons from lib/analytics.ts (sendBeacon or
 * fetch keepalive) and stores them in D1 (binding `DB`). Aggregated and
 * shown in the password-gated /dashboard via list-events.ts.
 */
interface Env {
  DB: D1Database;
}

type EventPayload = {
  session_id?: string;
  event_name?: string;
  step?: string;
  detail?: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: EventPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response(null, { status: 204 });
  }

  const sessionId = String(payload.session_id || "").trim();
  const eventName = String(payload.event_name || "").trim();
  if (!sessionId || !eventName) {
    return new Response(null, { status: 204 });
  }

  const step = payload.step ? String(payload.step).trim() : null;
  const detail = payload.detail ? String(payload.detail).trim().slice(0, 200) : null;

  await env.DB.prepare(
    `INSERT INTO analytics_events (id, created_at, session_id, event_name, step, detail)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(crypto.randomUUID(), new Date().toISOString(), sessionId, eventName, step, detail)
    .run()
    .catch(() => {
      // Analytics failures must never surface to the client.
    });

  return new Response(null, { status: 204 });
};
