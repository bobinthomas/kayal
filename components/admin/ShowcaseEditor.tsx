"use client";

import { useRef, useState } from "react";
import { useAdminContent } from "./useAdminContent";
import { uploadImage } from "./adminApi";
import { resizeImageFile } from "./resizeImage";
import SaveBar from "./SaveBar";
import type { HomeShowcaseFile } from "@/lib/content/schemas";

const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  unsupported_type: "That file type isn't supported — use JPEG, PNG, or WebP.",
  too_large: "That image is too large even after resizing.",
  github_auth: "The GitHub token is invalid or expired — can't upload right now.",
  github_error: "GitHub couldn't be reached — try again in a moment.",
  network_error: "Couldn't reach the server — check your connection and try again.",
};

const SIGNATURE_DISHES = [
  { key: "kizhi-porotta", label: "Kizhi Porotta" },
  { key: "meen-pollichathu", label: "Meen Pollichathu" },
  { key: "thalassery-biryani", label: "Thalassery Biryani" },
  { key: "kerala-fish-curry", label: "Kerala Fish Curry" },
  { key: "fish-tikka", label: "Fish Tikka" },
] as const;

const MANGO_SLIDES = [
  { key: "chatti-choru", label: "Chatti Choru" },
  { key: "kappa-biryani", label: "Kappa Biryani" },
  { key: "thalassery-biryani", label: "Thalassery Biryani" },
  { key: "avial", label: "Avial" },
] as const;

type Group = "signatureDishes" | "mangoSlides";

function PhotoRow({
  label,
  image,
  uploading,
  onFile,
}: {
  label: string;
  image: string;
  uploading: boolean;
  onFile: (file: File | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-white">
            Uploading…
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-fit rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
        >
          Replace photo
        </button>
      </div>
    </div>
  );
}

export default function ShowcaseEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, dirty, conflict, setData, reload, save } =
    useAdminContent<HomeShowcaseFile>("home-showcase", password, onUnauthorized);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) {
    return (
      <p className="p-4 text-red-600">
        Could not load the showcase photos{error ? ` — ${error}` : ""}.
      </p>
    );
  }

  async function handleFileSelect(group: Group, key: string, file: File | undefined) {
    if (!file || !data) return;
    const uploadKey = `${group}.${key}`;
    setUploadError(null);
    setUploadingKey(uploadKey);
    try {
      const { dataBase64, contentType } = await resizeImageFile(file);
      const result = await uploadImage(password, dataBase64, contentType);
      if (result.ok && result.path) {
        setData({ ...data, [group]: { ...data[group], [key]: result.path } });
      } else {
        const code = result.error ?? "upload_failed";
        setUploadError(UPLOAD_ERROR_MESSAGES[code] ?? "Upload failed — try again.");
      }
    } catch {
      setUploadError("Couldn't process that image — try a different file.");
    } finally {
      setUploadingKey(null);
    }
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-6 p-4">
        <p className="text-sm text-neutral-500">
          Photos for the "Signature Dishes" bento grid and the mango-slide showcase on the home page. Everything
          else about those sections (layout, wordmark, dish name, price) is fixed in code — only the photo changes
          here.
        </p>
        {uploadError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{uploadError}</div>}

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-neutral-900">Signature Dishes</h2>
          <div className="space-y-2">
            {SIGNATURE_DISHES.map(({ key, label }) => (
              <PhotoRow
                key={key}
                label={label}
                image={data.signatureDishes[key]}
                uploading={uploadingKey === `signatureDishes.${key}`}
                onFile={(file) => handleFileSelect("signatureDishes", key, file)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-neutral-900">Mango slider</h2>
          <div className="space-y-2">
            {MANGO_SLIDES.map(({ key, label }) => (
              <PhotoRow
                key={key}
                label={label}
                image={data.mangoSlides[key]}
                uploading={uploadingKey === `mangoSlides.${key}`}
                onFile={(file) => handleFileSelect("mangoSlides", key, file)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
