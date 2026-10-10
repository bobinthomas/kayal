/**
 * Admin: stream a payment proof file from R2. Receipts are never public.
 * GET /api/receipt?proof=<proofId>
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { json } from "./_util";

interface Env extends AdminEnv {
  DB: D1Database;
  RECEIPTS: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);

  const proofId = new URL(request.url).searchParams.get("proof");
  if (!proofId) return json({ ok: false, error: "Missing proof id." }, 400);

  const row = await env.DB.prepare(`SELECT receipt_key FROM payment_proofs WHERE id = ?`)
    .bind(proofId)
    .first<{ receipt_key: string | null }>();
  if (!row?.receipt_key) return json({ ok: false, error: "No file for this proof." }, 404);

  const object = await env.RECEIPTS.get(row.receipt_key);
  if (!object) return json({ ok: false, error: "Receipt file not found." }, 404);

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
};
