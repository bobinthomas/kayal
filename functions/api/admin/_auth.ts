/**
 * Shared admin-password check, mirroring onam26/functions/api/_auth.ts
 * (shared secret sent as a request header, checked server-side — no
 * cookies/sessions) with one hardening: constant-time comparison instead
 * of `===`, since this Function also holds a repo-write GitHub token
 * behind the same password.
 *
 * Leading underscore excludes this file from Cloudflare Pages Functions
 * routing — it's a helper module, not a route.
 */
export interface AdminEnv {
  ADMIN_PASSWORD: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
}

async function sha256(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

export async function checkAdminAuth(request: Request, env: AdminEnv): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
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
