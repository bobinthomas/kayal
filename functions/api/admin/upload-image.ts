/**
 * Accepts a single base64-encoded image from the admin UI (already resized
 * client-side) and commits it to public/images/home-figma/uploads/ under a
 * server-generated filename — the client never controls the path, matching
 * the same security boundary as content/[key].ts.
 */
import type { PagesFunction } from "@cloudflare/workers-types";
import { checkAdminAuth, unauthorized, type AdminEnv } from "./_auth";
import { putBinaryFile, GitHubConflictError, GitHubAuthError } from "./_github";

const UPLOAD_DIR = "public/images/home-figma/uploads";
const MAX_BYTES = 4 * 1024 * 1024;

const EXT_FOR_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function decodedByteLength(base64: string): number {
  const clean = base64.replace(/\s/g, "");
  const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return (clean.length / 4) * 3 - padding;
}

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return unauthorized();

  if (request.headers.get("Content-Type") !== "application/json") {
    return json({ ok: false, error: "invalid_content_type" }, 400);
  }

  let body: { dataBase64?: string; contentType?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const { dataBase64, contentType } = body;
  if (!dataBase64 || !contentType) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }

  const ext = EXT_FOR_TYPE[contentType];
  if (!ext) {
    return json({ ok: false, error: "unsupported_type" }, 400);
  }

  if (decodedByteLength(dataBase64) > MAX_BYTES) {
    return json({ ok: false, error: "too_large" }, 400);
  }

  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = `${UPLOAD_DIR}/${filename}`;

  try {
    await putBinaryFile(env, path, dataBase64, `Upload ${filename} via admin`);
    return json({ ok: true, path: `/images/home-figma/uploads/${filename}` });
  } catch (err) {
    if (err instanceof GitHubConflictError) {
      return json({ ok: false, error: "conflict" }, 409);
    }
    if (err instanceof GitHubAuthError) {
      return json({ ok: false, error: "github_auth" }, 502);
    }
    return json({ ok: false, error: "github_error" }, 502);
  }
};
