"use client";

import { useEffect, useRef, useState } from "react";
import { useAdminContent } from "./useAdminContent";
import { fetchContent, uploadImage } from "./adminApi";
import { resizeImageFile } from "./resizeImage";
import SaveBar from "./SaveBar";
import type { HomeHeroFile, HomeHeroSlide, MenuFile } from "@/lib/content/schemas";

const DEFAULT_IMAGE = "/images/home-figma/hero-bg.jpg";

const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  unsupported_type: "That file type isn't supported — use JPEG, PNG, or WebP.",
  too_large: "That image is too large even after resizing.",
  github_auth: "The GitHub token is invalid or expired — can't upload right now.",
  github_error: "GitHub couldn't be reached — try again in a moment.",
  network_error: "Couldn't reach the server — check your connection and try again.",
};

function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "slide";
}

function emptySlide(existingIds: string[], firstItemId: string): HomeHeroSlide {
  let id = slugify("new-slide");
  let n = 2;
  while (existingIds.includes(id)) {
    id = `${slugify("new-slide")}-${n++}`;
  }
  return { id, theme: "dark", heroWord: "flavour", image: DEFAULT_IMAGE, kind: "dish", menuItemId: firstItemId };
}

export default function HeroEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, dirty, conflict, setData, reload, save } =
    useAdminContent<HomeHeroFile>("home-hero", password, onUnauthorized);
  const [allItems, setAllItems] = useState<{ id: string; name: string; section: string }[] | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchContent<MenuFile>("menu", password).then((result) => {
      if (result.ok && result.data) {
        setAllItems(
          result.data.sections.flatMap((section) =>
            section.items.map((item) => ({ id: item.id, name: item.name, section: section.title })),
          ),
        );
      }
    });
  }, [password]);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) {
    return (
      <p className="p-4 text-red-600">
        Could not load the home page hero{error ? ` — ${error}` : " (no content/home-hero.json found yet)"}.
      </p>
    );
  }

  const slides = data.slides;

  // Common fields (id/theme/heroWord/image) are shared by both slide kinds,
  // so a shallow merge is safe here even though slides is a discriminated
  // union — this never crosses from one kind's fields into the other.
  function update(index: number, patch: Record<string, unknown>) {
    const next = slides.slice();
    next[index] = { ...next[index], ...patch } as HomeHeroSlide;
    setData({ slides: next });
  }

  function setKind(index: number, kind: "dish" | "custom") {
    const slide = slides[index];
    if (slide.kind === kind) return;
    const common = { id: slide.id, theme: slide.theme, heroWord: slide.heroWord, image: slide.image };
    const next = slides.slice();
    next[index] =
      kind === "dish"
        ? { ...common, kind: "dish", menuItemId: allItems?.[0]?.id ?? "" }
        : { ...common, kind: "custom", description: "", linkUrl: "", linkLabel: "Learn more" };
    setData({ slides: next });
  }

  function remove(index: number) {
    if (slides.length <= 1) return;
    if (!window.confirm("Delete this hero slide?")) return;
    setData({ slides: slides.filter((_, i) => i !== index) });
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    const next = slides.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setData({ slides: next });
  }

  function add() {
    if (slides.length >= 6) return;
    setData({ slides: [...slides, emptySlide(slides.map((s) => s.id), allItems?.[0]?.id ?? "")] });
  }

  async function handleFileSelect(index: number, file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setUploadingIndex(index);
    try {
      const { dataBase64, contentType } = await resizeImageFile(file);
      const result = await uploadImage(password, dataBase64, contentType);
      if (result.ok && result.path) {
        update(index, { image: result.path });
      } else {
        const code = result.error ?? "upload_failed";
        setUploadError(UPLOAD_ERROR_MESSAGES[code] ?? "Upload failed — try again.");
      }
    } catch {
      setUploadError("Couldn't process that image — try a different file.");
    } finally {
      setUploadingIndex(null);
    }
  }

  const nameFor = (id: string) => allItems?.find((i) => i.id === id)?.name;

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <p className="text-sm text-neutral-500">
          The home page hero carousel (top of the site) — order, headline word, and photo for each slide.
          A <strong>Dish</strong> slide pulls its description and price from a linked menu item automatically.
          A <strong>Custom</strong> slide has no dish — write your own description and pick where its button
          links (e.g. an event or promo page).
        </p>
        {uploadError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{uploadError}</div>}
        {slides.map((slide, i) => (
          <div key={slide.id} className="space-y-3 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Slide {i + 1}</span>
              <div className="flex gap-2 text-sm">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === slides.length - 1}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  disabled={slides.length <= 1}
                  className="text-red-600 disabled:opacity-30"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image} alt="" className="h-full w-full object-cover" />
                {uploadingIndex === i && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
                    Uploading…
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center gap-2">
                <input
                  ref={(el) => {
                    fileInputRefs.current[i] = el;
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(i, e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[i]?.click()}
                  disabled={uploadingIndex !== null}
                  className="w-fit rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
                >
                  Replace photo
                </button>
                <span className="text-xs text-neutral-400">JPEG/PNG/WebP, resized automatically</span>
              </div>
            </div>

            <div className="flex gap-2">
              <label className="flex-1 space-y-1">
                <span className="text-xs font-medium text-neutral-500">Theme</span>
                <select
                  value={slide.theme}
                  onChange={(e) => update(i, { theme: e.target.value as "light" | "dark" })}
                  className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                >
                  <option value="light">Light (dish on white)</option>
                  <option value="dark">Dark (full-bleed photo)</option>
                </select>
              </label>
              <label className="flex-1 space-y-1">
                <span className="text-xs font-medium text-neutral-500">Headline word</span>
                <input
                  value={slide.heroWord}
                  onChange={(e) => update(i, { heroWord: e.target.value })}
                  placeholder="e.g. taste"
                  className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                />
              </label>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-neutral-500">Slide type</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setKind(i, "dish")}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                    slide.kind === "dish"
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-neutral-300 text-neutral-600"
                  }`}
                >
                  Dish
                </button>
                <button
                  type="button"
                  onClick={() => setKind(i, "custom")}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                    slide.kind === "custom"
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-neutral-300 text-neutral-600"
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {slide.kind === "dish" ? (
              <label className="block space-y-1">
                <span className="text-xs font-medium text-neutral-500">Featured dish</span>
                <select
                  value={slide.menuItemId}
                  onChange={(e) => update(i, { menuItemId: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                >
                  {!nameFor(slide.menuItemId) && allItems && (
                    <option value={slide.menuItemId}>Unknown item ({slide.menuItemId})</option>
                  )}
                  {allItems?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {item.section}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-neutral-500">Description</span>
                  <textarea
                    value={slide.description}
                    onChange={(e) => update(i, { description: e.target.value })}
                    maxLength={200}
                    rows={3}
                    placeholder="e.g. Onam Sadhya bookings are open — 20-item feast, limited seats."
                    className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                  />
                </label>
                <div className="flex gap-2">
                  <label className="flex-1 space-y-1">
                    <span className="text-xs font-medium text-neutral-500">Button label</span>
                    <input
                      value={slide.linkLabel}
                      onChange={(e) => update(i, { linkLabel: e.target.value })}
                      placeholder="e.g. Book now"
                      className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                    />
                  </label>
                  <label className="flex-1 space-y-1">
                    <span className="text-xs font-medium text-neutral-500">Link</span>
                    <input
                      value={slide.linkUrl}
                      onChange={(e) => update(i, { linkUrl: e.target.value })}
                      placeholder="/specials/ or https://…"
                      className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
        {slides.length < 6 && (
          <button
            type="button"
            onClick={add}
            className="w-full rounded-xl border border-dashed border-neutral-300 py-3 text-sm text-neutral-500 hover:border-neutral-400"
          >
            + Add slide
          </button>
        )}
      </div>
    </div>
  );
}
