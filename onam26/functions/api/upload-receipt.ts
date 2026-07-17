/**
 * Cloudflare Pages Function: public receipt upload for the booking wizard's
 * payment step. Accepts multipart/form-data with a `file` field, stores it
 * in R2 (binding `RECEIPTS`), and returns a key referenced later by
 * submit-booking.ts and viewed by the dashboard via receipt.ts.
 *
 * R2 binding:
 *   RECEIPTS — the kayal-onam26-receipts bucket (see wrangler.toml)
 */
interface Env {
  RECEIPTS: R2Bucket;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_BYTES = 8 * 1024 * 1024;

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid upload." }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return json({ ok: false, error: "No file provided." }, 400);
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return json({ ok: false, error: "Unsupported file type." }, 400);
  }
  if (file.size > MAX_FILE_BYTES) {
    return json({ ok: false, error: "File is too large (max 8MB)." }, 400);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  const key = `${crypto.randomUUID()}-${safeName}`;

  await env.RECEIPTS.put(key, file, {
    httpMetadata: { contentType: file.type },
  });

  return json({ ok: true, key });
};
