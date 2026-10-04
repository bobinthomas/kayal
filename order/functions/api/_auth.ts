/**
 * Admin-password check: header secret, constant-time compare, and an
 * optional per-IP rate limit (ADMIN_RATE_LIMITER binding, same pattern as
 * the main kayal site's functions/api/admin/_auth.ts; skipped when the
 * binding isn't configured, e.g. on Pages or local dev).
 *
 * Leading underscore excludes this file from Pages Functions routing.
 */
export interface AdminEnv {
  DASHBOARD_PASSWORD: string;
  ADMIN_RATE_LIMITER?: RateLimit;
}

async function sha256(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

export async function checkAdminAuth(request: Request, env: AdminEnv): Promise<boolean> {
  if (!env.DASHBOARD_PASSWORD) return false;

  if (env.ADMIN_RATE_LIMITER) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.ADMIN_RATE_LIMITER.limit({ key: ip });
    if (!success) return false;
  }

  const candidate = request.headers.get("X-Dashboard-Password") ?? "";
  if (!candidate) return false;
  const [a, b] = await Promise.all([sha256(candidate), sha256(env.DASHBOARD_PASSWORD)]);
  return crypto.subtle.timingSafeEqual(a, b);
}
