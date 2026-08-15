/**
 * Thin wrapper over GitHub's Contents API — reads/writes a single file at
 * a time, using the sha returned by GET as the optimistic-concurrency
 * token for PUT. This is the content backend: a save here is a real git
 * commit, which triggers Cloudflare Pages' Git-integration rebuild.
 *
 * Leading underscore excludes this file from Cloudflare Pages Functions
 * routing — it's a helper module, not a route.
 */
import type { AdminEnv } from "./_auth";

const API_BASE = "https://api.github.com";

function githubHeaders(env: AdminEnv): HeadersInit {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "kayal-admin-cms",
  };
}

// atob/btoa operate on Latin1 byte strings — a naive round-trip corrupts
// the Malayalam (mal) fields in menu.json. Go through UTF-8 bytes explicitly.
function encodeUtf8Base64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeUtf8Base64(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

export class GitHubConflictError extends Error {
  constructor() {
    super("GitHub Contents API sha conflict");
  }
}

export class GitHubAuthError extends Error {}

interface GetFileResult {
  sha: string;
  content: string;
}

export async function getFile(env: AdminEnv, path: string): Promise<GetFileResult | null> {
  const url = `${API_BASE}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}?ref=${env.GITHUB_BRANCH}`;
  const res = await fetch(url, { headers: githubHeaders(env) });
  if (res.status === 404) return null;
  if (res.status === 401 || res.status === 403) {
    throw new GitHubAuthError(await res.text());
  }
  if (!res.ok) {
    throw new Error(`GitHub GET ${path} failed: ${res.status} ${await res.text()}`);
  }
  const body = await res.json<{ content: string; sha: string }>();
  return { sha: body.sha, content: decodeUtf8Base64(body.content) };
}

interface PutFileResult {
  sha: string;
  commitUrl: string;
}

export async function putFile(
  env: AdminEnv,
  path: string,
  content: string,
  sha: string | null,
  message: string,
): Promise<PutFileResult> {
  return putRaw(env, path, encodeUtf8Base64(content), sha, message);
}

// Images arrive from the client already base64-encoded (read via
// FileReader/canvas), so this skips the UTF-8 text encoding step putFile
// uses — running that again would double-base64-encode binary content.
export async function putBinaryFile(
  env: AdminEnv,
  path: string,
  base64Content: string,
  message: string,
): Promise<PutFileResult> {
  return putRaw(env, path, base64Content, null, message);
}

async function putRaw(
  env: AdminEnv,
  path: string,
  base64Content: string,
  sha: string | null,
  message: string,
): Promise<PutFileResult> {
  const url = `${API_BASE}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...githubHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: env.GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
      committer: { name: "Kayal Admin", email: "admin@kayal.com.au" },
    }),
  });
  if (res.status === 409) throw new GitHubConflictError();
  if (res.status === 401 || res.status === 403) {
    throw new GitHubAuthError(await res.text());
  }
  if (!res.ok) {
    throw new Error(`GitHub PUT ${path} failed: ${res.status} ${await res.text()}`);
  }
  const body = await res.json<{ content: { sha: string }; commit: { html_url: string } }>();
  return { sha: body.content.sha, commitUrl: body.commit.html_url };
}
