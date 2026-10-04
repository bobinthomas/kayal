"use client";

import { useRef, useState } from "react";
import { uploadMenuImage } from "@/lib/api";

/**
 * Thumbnail + upload/replace/remove. Uploads straight away (the photo is
 * shrunk in the browser first) and reports the stored URL, or null on remove.
 */
export default function PhotoPicker({
  url,
  hint,
  onChange,
  compact = false,
}: {
  url: string | null;
  hint?: string;
  onChange: (url: string | null) => Promise<unknown> | void;
  compact?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    const r = await uploadMenuImage(file);
    if (r.ok) await onChange(r.url);
    else setError(r.error);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const size = compact ? "h-14 w-14" : "h-20 w-20";
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className={`${size} shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-leaf/25 bg-white`}
        aria-label={url ? "Change photo" : "Add photo"}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an arbitrary uploaded URL
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center text-xl text-ink/40">📷</span>
        )}
      </button>
      <div className="min-w-0 space-y-1">
        {hint && <p className="text-ink/60">{hint}</p>}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-full bg-leaf px-3 py-1 font-medium text-cream disabled:opacity-60"
          >
            {busy ? "Uploading…" : url ? "Change photo" : "Add photo"}
          </button>
          {url && !busy && (
            <button type="button" onClick={() => onChange(null)} className="rounded-full border px-3 py-1">
              Remove
            </button>
          )}
        </div>
        {error && <p className="font-medium text-chilli">{error}</p>}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}
