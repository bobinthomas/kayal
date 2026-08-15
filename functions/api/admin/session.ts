/**
 * Cheap auth check the admin UI calls on load to decide whether to show
 * the password gate or the editor shell, without a GitHub round-trip.
 */
import type { PagesFunction } from "@cloudflare/workers-types";
import { checkAdminAuth, type AdminEnv } from "./_auth";

export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => {
  const authenticated = await checkAdminAuth(request, env);
  return new Response(JSON.stringify({ authenticated }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
