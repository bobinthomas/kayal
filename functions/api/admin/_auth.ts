/**
 * Shared admin-password check, mirroring onam26/functions/api/_auth.ts
 * (shared secret sent as a request header, checked server-side — no
 * cookies/sessions) with two hardenings: constant-time comparison instead
 * of `===`, and a per-IP rate limit, since this Function also holds a
 * repo-write GitHub token behind the same password.
 *
 * Leading underscore excludes this file from Cloudflare Pages Functions
 * routing — it's a helper module, not a route.
 */
import type { RateLimit } from "@cloudflare/workers-types";

export interface AdminEnv {
  ADMIN_PASSWORD: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  ADMIN_RATE_LIMITER: RateLimit;
}

async function sha256(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

export async function checkAdminAuth(request: Request, env: AdminEnv): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;

  // 30 req/min per IP across all admin endpoints — generous for the editor
  // UI's own polling, tight enough to make password brute-forcing impractical.
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const { success } = await env.ADMIN_RATE_LIMITER.limit({ key: ip });
  if (!success) return false;

  const candidate = request.headers.get("X-Admin-Password") ?? "";
  if (!candidate) return false;
  const [a, b] = await Promise.all([sha256(candidate), sha256(env.ADMIN_PASSWORD)]);
  return crypto.subtle.timingSafeEqual(a, b);
}

export function unauthorized(): Response {
  return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
