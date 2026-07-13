/**
 * Shared dashboard-password check for list-bookings.ts and
 * update-booking-status.ts. Leading underscore excludes this file from
 * Cloudflare Pages Functions routing (it's a helper module, not a route).
 */
export interface DashboardEnv {
  DASHBOARD_PASSWORD: string;
}

export function checkDashboardAuth(request: Request, env: DashboardEnv): boolean {
  if (!env.DASHBOARD_PASSWORD) return false;
  const header = request.headers.get("X-Dashboard-Password") || "";
  return header === env.DASHBOARD_PASSWORD;
}
