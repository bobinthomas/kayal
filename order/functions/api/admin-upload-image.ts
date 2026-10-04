/**
 * Admin: upload a dish photo. The dashboard resizes the image in the browser
 * first, so files arriving here are small. Stored in the RECEIPTS R2 bucket
 * under the "menu-images/" prefix (receipts stay private — only that prefix is
 * ever served publicly, by menu-image/[name].ts).
 *   POST multipart { file } -> { ok, url }
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { json } from "./_util";

interface Env extends AdminEnv {
  RECEIPTS: R2Bucket;
}

const MAX_BYTES = 3 * 1024 * 1024;

function sniff(b: Uint8Array): { type: string; ext: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8) return { type: "image/jpeg", ext: "jpg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { type: "image/png", ext: "png" };
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50)
    return { type: "image/webp", ext: "webp" };
  return null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid upload." }, 400);
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return json({ ok: false, error: "No photo provided." }, 400);
  if (file.size > MAX_BYTES) return json({ ok: false, error: "Photo is too large (max 3 MB)." }, 400);

  const kind = sniff(new Uint8Array(await file.slice(0, 12).arrayBuffer()));
  if (!kind) return json({ ok: false, error: "Use a JPG, PNG or WebP photo." }, 400);

  const name = `${crypto.randomUUID()}.${kind.ext}`;
  await env.RECEIPTS.put(`menu-images/${name}`, file, { httpMetadata: { contentType: kind.type } });
  return json({ ok: true, url: `/api/menu-image/${name}` });
};
