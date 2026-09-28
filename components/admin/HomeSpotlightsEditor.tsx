"use client";

import { useRef, useState } from "react";
import { useAdminContent } from "./useAdminContent";
import { uploadImage } from "./adminApi";
import { resizeImageFile } from "./resizeImage";
import SaveBar from "./SaveBar";
import type { HomeSpotlightsFile } from "@/lib/content/schemas";

type Card = HomeSpotlightsFile["cards"][number];

const MAX_CARDS = 6;

const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  unsupported_type: "That file type isn't supported — use JPEG, PNG, or WebP.",
  too_large: "That image is too large even after resizing.",
  github_auth: "The GitHub token is invalid or expired — can't upload right now.",
  github_error: "GitHub couldn't be reached — try again in a moment.",
  network_error: "Couldn't reach the server — check your connection and try again.",
};

function Input({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
      />
    </label>
  );
}

function CardPhoto({
  image,
  password,
  onChange,
}: {
  image: string;
  password: string;
  onChange: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileSelect(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const { dataBase64, contentType } = await resizeImageFile(file);
      const result = await uploadImage(password, dataBase64, contentType);
      if (result.ok && result.path) {
        onChange(result.path);
      } else {
        setUploadError(UPLOAD_ERROR_MESSAGES[result.error ?? "upload_failed"] ?? "Upload failed — try again.");
      }
    } catch {
      setUploadError("Couldn't process that image — try a different file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-neutral-500">Photo</span>
      <div className="flex gap-3">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-fit rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            Replace photo
          </button>
          <span className="text-xs text-neutral-400">JPEG/PNG/WebP, resized automatically. Shown 16:10.</span>
        </div>
      </div>
      {uploadError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{uploadError}</div>}
    </div>
  );
}

export default function HomeSpotlightsEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<HomeSpotlightsFile>("home-spotlights", password, onUnauthorized);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) {
    return (
      <p className="p-4 text-red-600">
        Could not load the home spotlights{error ? ` — ${error}` : " (no content/home-spotlights.json found yet)"}.
      </p>
    );
  }

  const current = data;

  function updateCard(index: number, patch: Partial<Card>) {
    const cards = current.cards.slice();
    cards[index] = { ...cards[index], ...patch };
    setData({ ...current, cards });
  }

  function moveCard(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= current.cards.length) return;
    const cards = current.cards.slice();
    [cards[index], cards[target]] = [cards[target], cards[index]];
    setData({ ...current, cards });
  }

  function removeCard(index: number) {
    setData({ ...current, cards: current.cards.filter((_, i) => i !== index) });
  }

  function addCard() {
    const card: Card = {
      id: `card-${Date.now()}`,
      category: "New",
      image: "/images/home-figma/special-1.png",
      title: "New card title",
      body: "Short description shown under the title.",
      href: "/menu/",
    };
    setData({ ...current, cards: [...current.cards, card] });
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-5 p-4">
        <p className="text-sm text-neutral-500">
          The &ldquo;From the Kitchen&rdquo; cards on the home page. Three cards fit the layout best.
        </p>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.enabled}
            onChange={(e) => setData({ ...data, enabled: e.target.checked })}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium text-neutral-700">Show this section on the home page</span>
        </label>

        <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-semibold text-neutral-700">Section heading</legend>
          <Input
            label="Small label above the heading"
            value={data.eyebrow}
            maxLength={40}
            onChange={(v) => setData({ ...data, eyebrow: v })}
          />
          <Input
            label="Heading"
            value={data.heading}
            maxLength={80}
            onChange={(v) => setData({ ...data, heading: v })}
          />
        </fieldset>

        {data.cards.map((card, i) => (
          <fieldset key={card.id} className="space-y-3 rounded-xl border border-neutral-200 p-4">
            <legend className="px-1 text-sm font-semibold text-neutral-700">Card {i + 1}</legend>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => moveCard(i, -1)}
                disabled={i === 0}
                className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold disabled:opacity-40"
              >
                ← Move earlier
              </button>
              <button
                type="button"
                onClick={() => moveCard(i, 1)}
                disabled={i === data.cards.length - 1}
                className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold disabled:opacity-40"
              >
                Move later →
              </button>
              <button
                type="button"
                onClick={() => removeCard(i)}
                disabled={data.cards.length <= 1}
                className="ml-auto rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-red-600 disabled:opacity-40"
              >
                Remove card
              </button>
            </div>
            <CardPhoto image={card.image} password={password} onChange={(path) => updateCard(i, { image: path })} />
            <Input
              label="Category tag (e.g. Heritage)"
              value={card.category}
              maxLength={24}
              onChange={(v) => updateCard(i, { category: v })}
            />
            <Input label="Title" value={card.title} maxLength={80} onChange={(v) => updateCard(i, { title: v })} />
            <label className="block space-y-1">
              <span className="text-xs font-medium text-neutral-500">Description (max 240 characters)</span>
              <textarea
                value={card.body}
                onChange={(e) => updateCard(i, { body: e.target.value })}
                maxLength={240}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
              />
            </label>
            <Input
              label="Link (where “Read More” goes)"
              value={card.href}
              placeholder="/menu/#rice or https://…"
              onChange={(v) => updateCard(i, { href: v })}
            />
          </fieldset>
        ))}

        <button
          type="button"
          onClick={addCard}
          disabled={data.cards.length >= MAX_CARDS}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
        >
          + Add card
        </button>
      </div>
    </div>
  );
}
