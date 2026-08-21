/**
 * Lightweight, cookieless event tracking.
 * Cloudflare Web Analytics handles pageviews (beacon added via the Cloudflare
 * Pages dashboard). Booking-intent events are dispatched as CustomEvents so
 * any collector (Zaraz, a Pages Function endpoint, etc.) can pick them up.
 */

export type AnalyticsEvent =
  | "call_tap"
  | "whatsapp_tap"
  | "booking_form_submit"
  | "menu_view"
  | "directions_tap"
  | "catering_enquiry"
  | "hero_link_tap";

export function track(event: AnalyticsEvent, detail?: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("kayal:event", { detail: { event, ...detail } }));
    // sendBeacon keeps taps non-blocking; the endpoint is a Pages Function (no-op locally).
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/event",
        new Blob([JSON.stringify({ event, ...detail, ts: Date.now() })], {
          type: "application/json",
        }),
      );
    }
  } catch {
    // Analytics must never break the UX.
  }
}
