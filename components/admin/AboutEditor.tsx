"use client";

import { useRef, useState } from "react";
import { useAdminContent } from "./useAdminContent";
import { uploadImage } from "./adminApi";
import { resizeImageFile } from "./resizeImage";
import SaveBar from "./SaveBar";
import type { AboutFile } from "@/lib/content/schemas";

const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  unsupported_type: "That file type isn't supported — use JPEG, PNG, or WebP.",
  too_large: "That image is too large even after resizing.",
  github_auth: "The GitHub token is invalid or expired — can't upload right now.",
  github_error: "GitHub couldn't be reached — try again in a moment.",
  network_error: "Couldn't reach the server — check your connection and try again.",
};

function Field({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
      />
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
      />
    </label>
  );
}

function PhotoRow({
  label,
  image,
  alt,
  onAltChange,
  uploading,
  onFile,
}: {
  label: string;
  image: string;
  alt?: string;
  onAltChange?: (alt: string) => void;
  uploading: boolean;
  onFile: (file: File | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-200 p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-white">
            Uploading…
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        {onAltChange && (
          <input
            value={alt ?? ""}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Alt text (describes the photo)"
            className="w-full rounded-lg border border-neutral-300 p-2 text-xs"
          />
        )}
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

export default function AboutEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<AboutFile>("about", password, onUnauthorized);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) {
    return <p className="p-4 text-red-600">Could not load the About page{error ? ` — ${error}` : ""}.</p>;
  }

  async function handleFileSelect(uploadKey: string, apply: (path: string) => void, file: File | undefined) {
    if (!file || !data) return;
    setUploadError(null);
    setUploadingKey(uploadKey);
    try {
      const { dataBase64, contentType } = await resizeImageFile(file);
      const result = await uploadImage(password, dataBase64, contentType);
      if (result.ok && result.path) {
        apply(result.path);
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
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-8 p-4">
        {uploadError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{uploadError}</div>}

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">Hero</h2>
          <TextInput
            label="Eyebrow"
            value={data.hero.eyebrow}
            onChange={(v) => setData({ ...data, hero: { ...data.hero, eyebrow: v } })}
          />
          <Field
            label="Title"
            rows={2}
            value={data.hero.title}
            onChange={(v) => setData({ ...data, hero: { ...data.hero, title: v } })}
          />
          <PhotoRow
            label="Background photo"
            image={data.hero.image}
            uploading={uploadingKey === "hero.image"}
            onFile={(file) =>
              handleFileSelect("hero.image", (path) => setData({ ...data, hero: { ...data.hero, image: path } }), file)
            }
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">The lagoon and the table</h2>
          <TextInput
            label="Heading"
            value={data.origin.heading}
            onChange={(v) => setData({ ...data, origin: { ...data.origin, heading: v } })}
          />
          <Field
            label="Intro paragraph"
            value={data.origin.intro}
            onChange={(v) => setData({ ...data, origin: { ...data.origin, intro: v } })}
          />
          <Field
            label="About paragraph"
            value={data.origin.aboutParagraph}
            onChange={(v) => setData({ ...data, origin: { ...data.origin, aboutParagraph: v } })}
          />
          <Field
            label="Chef bio"
            value={data.origin.chefBio}
            onChange={(v) => setData({ ...data, origin: { ...data.origin, chefBio: v } })}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">The Kizhi Porotta</h2>
          <TextInput
            label="Heading"
            value={data.kizhiPorotta.heading}
            onChange={(v) => setData({ ...data, kizhiPorotta: { ...data.kizhiPorotta, heading: v } })}
          />
          <Field
            label="Story"
            value={data.kizhiPorotta.story}
            onChange={(v) => setData({ ...data, kizhiPorotta: { ...data.kizhiPorotta, story: v } })}
          />
          <PhotoRow
            label="Photo"
            image={data.kizhiPorotta.photo.image}
            alt={data.kizhiPorotta.photo.alt}
            onAltChange={(alt) =>
              setData({ ...data, kizhiPorotta: { ...data.kizhiPorotta, photo: { ...data.kizhiPorotta.photo, alt } } })
            }
            uploading={uploadingKey === "kizhiPorotta.photo"}
            onFile={(file) =>
              handleFileSelect(
                "kizhiPorotta.photo",
                (path) =>
                  setData({
                    ...data,
                    kizhiPorotta: { ...data.kizhiPorotta, photo: { ...data.kizhiPorotta.photo, image: path } },
                  }),
                file,
              )
            }
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">The Chatti Choru</h2>
          <TextInput
            label="Heading"
            value={data.chattiChoru.heading}
            onChange={(v) => setData({ ...data, chattiChoru: { ...data.chattiChoru, heading: v } })}
          />
          <Field
            label="Story"
            value={data.chattiChoru.story}
            onChange={(v) => setData({ ...data, chattiChoru: { ...data.chattiChoru, story: v } })}
          />
          <Field
            label="Best-seller line"
            rows={2}
            value={data.chattiChoru.bestSellerLine}
            onChange={(v) => setData({ ...data, chattiChoru: { ...data.chattiChoru, bestSellerLine: v } })}
          />
          <PhotoRow
            label="Photo"
            image={data.chattiChoru.photo.image}
            alt={data.chattiChoru.photo.alt}
            onAltChange={(alt) =>
              setData({ ...data, chattiChoru: { ...data.chattiChoru, photo: { ...data.chattiChoru.photo, alt } } })
            }
            uploading={uploadingKey === "chattiChoru.photo"}
            onFile={(file) =>
              handleFileSelect(
                "chattiChoru.photo",
                (path) =>
                  setData({
                    ...data,
                    chattiChoru: { ...data.chattiChoru, photo: { ...data.chattiChoru.photo, image: path } },
                  }),
                file,
              )
            }
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">Take Kerala home</h2>
          <TextInput
            label="Heading"
            value={data.miniMart.heading}
            onChange={(v) => setData({ ...data, miniMart: { ...data.miniMart, heading: v } })}
          />
          <Field
            label="Text"
            rows={3}
            value={data.miniMart.text}
            onChange={(v) => setData({ ...data, miniMart: { ...data.miniMart, text: v } })}
          />
        </section>
      </div>
    </div>
  );
}
