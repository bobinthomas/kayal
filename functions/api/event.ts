/**
 * Cloudflare Pages Function: collects booking-intent event beacons
 * (call_tap, whatsapp_tap, booking_form_submit, …) sent via sendBeacon.
 * Events appear in Cloudflare's Workers/Pages logs; wire to a store later
 * if deeper analysis is needed.
 */
export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const payload = await request.json();
    console.log("kayal-event", JSON.stringify(payload));
  } catch {
    // Ignore malformed beacons.
  }
  return new Response(null, { status: 204 });
};
