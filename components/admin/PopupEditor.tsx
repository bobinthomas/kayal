"use client";

import { useRef, useState } from "react";
import { useAdminContent } from "./useAdminContent";
import { uploadImage } from "./adminApi";
import { resizeImageFile } from "./resizeImage";
import SaveBar from "./SaveBar";
import type { PopupFile } from "@/lib/content/schemas";

const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  unsupported_type: "That file type isn't supported — use JPEG, PNG, or WebP.",
  too_large: "That image is too large even after resizing.",
  github_auth: "The GitHub token is invalid or expired — can't upload right now.",
  github_error: "GitHub couldn't be reached — try again in a moment.",
  network_error: "Couldn't reach the server — check your connection and try again.",
};

export default function PopupEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<PopupFile>("popup", password, onUnauthorized);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) {
    return (
      <p className="p-4 text-red-600">
        Could not load the homepage popup{error ? ` — ${error}` : " (no content/popup.json found yet)"}.
      </p>
    );
  }

  const canEnable = Boolean(data.image || data.text);

  async function handleFileSelect(file: File | undefined) {
    if (!file || !data) return;
    setUploadError(null);
    setUploading(true);
    try {
      const { dataBase64, contentType } = await resizeImageFile(file);
      const result = await uploadImage(password, dataBase64, contentType);
      if (result.ok && result.path) {
        setData({ ...data, image: result.path });
      } else {
        const code = result.error ?? "upload_failed";
        setUploadError(UPLOAD_ERROR_MESSAGES[code] ?? "Upload failed — try again.");
      }
    } catch {
      setUploadError("Couldn't process that image — try a different file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-5 p-4">
        <p className="text-sm text-neutral-500">
          A one-time popup shown to visitors when they open the home page (once per browser session).
          Add an image and/or text — whatever you fill in is shown. Optionally link it to a page, e.g.{" "}
          <code>/specials/</code> or a full URL.
        </p>

        {uploadError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{uploadError}</div>}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.enabled}
            disabled={!canEnable}
            onChange={(e) => setData({ ...data, enabled: e.target.checked })}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium text-neutral-700">
            Show this popup on the home page
          </span>
        </label>
        {!canEnable && (
          <p className="-mt-3 text-xs text-neutral-400">Add an image or text below before enabling.</p>
        )}

        <div className="space-y-2">
          <span className="text-xs font-medium text-neutral-500">Image (optional)</span>
          <div className="flex gap-3">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              {data.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.image} alt="" className="h-full w-full object-cover" />
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
                  Uploading…
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-fit rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
                >
                  {data.image ? "Replace photo" : "Upload photo"}
                </button>
                {data.image && (
                  <button
                    type="button"
                    onClick={() => setData({ ...data, image: undefined })}
                    disabled={uploading}
                    className="w-fit rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-40"
                  >
                    Remove
                  </button>
                )}
              </div>
              <span className="text-xs text-neutral-400">JPEG/PNG/WebP, resized automatically</span>
            </div>
          </div>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-neutral-500">Text (optional, max 280 characters)</span>
          <textarea
            value={data.text ?? ""}
            onChange={(e) => setData({ ...data, text: e.target.value })}
            maxLength={280}
            rows={4}
            placeholder="e.g. Book early for Onam weekend — tables fill fast."
            className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-neutral-500">Link (optional)</span>
          <input
            value={data.linkUrl ?? ""}
            onChange={(e) => setData({ ...data, linkUrl: e.target.value })}
            placeholder="/specials/ or https://…"
            className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
          />
          <span className="text-xs text-neutral-400">
            If set, the whole popup (image and text) becomes clickable.
          </span>
        </label>
      </div>
    </div>
  );
}
