"use client";

import { useAdminContent } from "./useAdminContent";
import SaveBar from "./SaveBar";
import type { CopyFile } from "@/lib/content/schemas";

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

export default function CopyEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<CopyFile>("copy", password, onUnauthorized);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) return <p className="p-4 text-red-600">Could not load copy.</p>;

  function updateCategory(index: number, patch: Partial<{ title: string; blurb: string }>) {
    if (!data) return;
    const next = data.cateringCategories.slice();
    next[index] = { ...next[index], ...patch };
    setData({ ...data, cateringCategories: next });
  }

  function removeCategory(index: number) {
    if (!data) return;
    if (!window.confirm("Delete this catering category?")) return;
    setData({ ...data, cateringCategories: data.cateringCategories.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-6 p-4">
        <Field
          label="Marquee dishes (one per line)"
          rows={8}
          value={data.marqueeDishes.join("\n")}
          onChange={(v) =>
            setData({ ...data, marqueeDishes: v.split("\n").map((s) => s.trim()).filter(Boolean) })
          }
        />

        <div className="space-y-3">
          <span className="text-sm font-medium text-neutral-700">Catering categories</span>
          {data.cateringCategories.map((category, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-neutral-200 p-3">
              <div className="flex items-center justify-between">
                <input
                  value={category.title}
                  onChange={(e) => updateCategory(i, { title: e.target.value })}
                  placeholder="Title"
                  className="w-full rounded-lg border border-neutral-300 p-2 text-sm font-medium"
                />
                <button type="button" onClick={() => removeCategory(i)} className="ml-2 text-sm text-red-600">
                  Delete
                </button>
              </div>
              <textarea
                value={category.blurb}
                onChange={(e) => updateCategory(i, { blurb: e.target.value })}
                rows={2}
                placeholder="Blurb"
                className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setData({ ...data, cateringCategories: [...data.cateringCategories, { title: "", blurb: "" }] })}
            className="w-full rounded-xl border border-dashed border-neutral-300 py-2 text-sm text-neutral-500 hover:border-neutral-400"
          >
            + Add category
          </button>
        </div>
      </div>
    </div>
  );
}
