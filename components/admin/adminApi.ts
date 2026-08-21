"use client";

export const ADMIN_PASSWORD_KEY = "kayal-admin-password";

export class AdminUnauthorizedError extends Error {}

async function adminFetch(path: string, password: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: {
      ...init?.headers,
      "X-Admin-Password": password,
    },
  });
  if (res.status === 401) throw new AdminUnauthorizedError();
  return res;
}

export async function checkSession(password: string): Promise<boolean> {
  try {
    const res = await adminFetch("/api/admin/session", password);
    if (!res.ok) return false;
    const body = (await res.json()) as { authenticated: boolean };
    return body.authenticated;
  } catch {
    return false;
  }
}

export interface ContentGetResult<T> {
  ok: boolean;
  data: T | null;
  sha: string | null;
  error?: string;
}

export async function fetchContent<T>(key: string, password: string): Promise<ContentGetResult<T>> {
  const res = await adminFetch(`/api/admin/content/${key}`, password);
  return res.json();
}

export interface ContentPutResult {
  ok: boolean;
  sha?: string;
  commitUrl?: string;
  error?: string;
  issues?: unknown[];
}

export interface UploadImageResult {
  ok: boolean;
  path?: string;
  error?: string;
}

export async function uploadImage(
  password: string,
  dataBase64: string,
  contentType: string,
): Promise<UploadImageResult> {
  const res = await adminFetch("/api/admin/upload-image", password, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataBase64, contentType }),
  });
  return res.json();
}

export async function saveContent<T>(
  key: string,
  password: string,
  data: T,
  sha: string | null,
  message?: string,
): Promise<ContentPutResult> {
  const res = await adminFetch(`/api/admin/content/${key}`, password, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, sha, message }),
  });
  return res.json();
}
