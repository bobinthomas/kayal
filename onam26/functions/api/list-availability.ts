/**
 * Cloudflare Pages Function: public list of current availability blocks
 * (dates/dine-in slots pulled from sale by the admin). Public — the booking
 * wizard needs this before the dashboard password is ever entered. Write
 * access (block/unblock) is password-gated, see block-availability.ts and
 * unblock-availability.ts.
 */
interface Env {
  DB: D1Database;
}

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT id, service_type, event_date, time_slot FROM availability_blocks`,
  ).all();

  return json({ ok: true, blocks: results });
};
