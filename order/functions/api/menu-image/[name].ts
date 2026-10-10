/**
 * Public: serve an uploaded dish photo from R2. Only names minted by
 * admin-upload-image.ts (uuid + image extension) under "menu-images/" are
 * reachable, so receipts in the same bucket can never be fetched here.
 *   GET /api/menu-image/<uuid>.<jpg|png|webp>
 */
interface Env {
  RECEIPTS: R2Bucket;
}

const NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export const onRequestGet: PagesFunction<Env, "name"> = async ({ params, env }) => {
  const name = String(params.name ?? "");
  if (!NAME.test(name)) return new Response("Not found", { status: 404 });

  const object = await env.RECEIPTS.get(`menu-images/${name}`);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
      // Names are unique per upload, so the file never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
