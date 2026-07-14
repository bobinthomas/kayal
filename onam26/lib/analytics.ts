/**
 * Self-hosted funnel/click tracking — no third-party service. Events are
 * fire-and-forget beacons to /api/track-event, stored in D1, and surfaced
 * in the password-gated /dashboard (see components/dashboard/AnalyticsSummary.tsx).
 */
const SESSION_KEY = "onam-session-id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function track(eventName: string, opts?: { step?: string; detail?: string }): void {
  if (typeof window === "undefined") return;
  const sessionId = getSessionId();
  if (!sessionId) return;

  const payload = JSON.stringify({
    session_id: sessionId,
    event_name: eventName,
    step: opts?.step,
    detail: opts?.detail,
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track-event", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics must never break the booking flow.
  }
}
