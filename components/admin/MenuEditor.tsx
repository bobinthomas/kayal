"use client";

import { useAdminContent } from "./useAdminContent";
import SaveBar from "./SaveBar";
import type { MenuFile } from "@/lib/content/schemas";
import type { MenuTag } from "@/data/menu";

type Section = MenuFile["sections"][number];
type Item = Section["items"][number];

const ALL_TAGS: MenuTag[] = ["veg", "spicy", "signature", "availability"];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function emptyItem(): Item {
  return { id: `new-item-${Date.now()}`, name: "New item" };
}

function emptySection(): Section {
  return { id: `new-section-${Date.now()}`, title: "New section", blurb: "", items: [] };
}

export default function MenuEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<MenuFile>("menu", password, onUnauthorized);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) return <p className="p-4 text-red-600">Could not load the menu.</p>;

  function updateSection(index: number, patch: Partial<Section>) {
    if (!data) return;
    const sections = data.sections.slice();
    sections[index] = { ...sections[index], ...patch };
    setData({ ...data, sections });
  }

  function moveSection(index: number, dir: -1 | 1) {
    if (!data) return;
    const target = index + dir;
    if (target < 0 || target >= data.sections.length) return;
    const sections = data.sections.slice();
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setData({ ...data, sections });
  }

  function removeSection(index: number) {
    if (!data) return;
    if (!window.confirm(`Delete the "${data.sections[index].title}" section and all its items?`)) return;
    setData({ ...data, sections: data.sections.filter((_, i) => i !== index) });
  }

  function addSection() {
    if (!data) return;
    setData({ ...data, sections: [...data.sections, emptySection()] });
  }

  function updateItem(sectionIndex: number, itemIndex: number, patch: Partial<Item>) {
    if (!data) return;
    const items = data.sections[sectionIndex].items.slice();
    items[itemIndex] = { ...items[itemIndex], ...patch };
    updateSection(sectionIndex, { items });
  }

  function moveItem(sectionIndex: number, itemIndex: number, dir: -1 | 1) {
    if (!data) return;
    const items = data.sections[sectionIndex].items.slice();
    const target = itemIndex + dir;
    if (target < 0 || target >= items.length) return;
    [items[itemIndex], items[target]] = [items[target], items[itemIndex]];
    updateSection(sectionIndex, { items });
  }

  function removeItem(sectionIndex: number, itemIndex: number) {
    if (!data) return;
    const item = data.sections[sectionIndex].items[itemIndex];
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    updateSection(sectionIndex, { items: data.sections[sectionIndex].items.filter((_, i) => i !== itemIndex) });
  }

  function addItem(sectionIndex: number) {
    if (!data) return;
    updateSection(sectionIndex, { items: [...data.sections[sectionIndex].items, emptyItem()] });
  }

  function toggleTag(sectionIndex: number, itemIndex: number, tag: MenuTag) {
    if (!data) return;
    const item = data.sections[sectionIndex].items[itemIndex];
    const tags = item.tags ?? [];
    const nextTags = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
    updateItem(sectionIndex, itemIndex, { tags: nextTags.length > 0 ? nextTags : undefined });
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-3xl space-y-4 p-4">
        <label className="block space-y-1 rounded-xl border border-neutral-200 p-4">
          <span className="text-sm font-semibold text-neutral-700">Menu disclaimer</span>
          <textarea
            value={data.disclaimer}
            onChange={(e) => setData({ ...data, disclaimer: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
          />
        </label>

        {data.sections.map((section, sIndex) => (
          <details key={section.id} className="rounded-xl border border-neutral-200" open={sIndex === 0}>
            <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-neutral-700">
              {section.title}{" "}
              <span className="font-normal text-neutral-400">({section.items.length} items)</span>
            </summary>
            <div className="space-y-4 border-t border-neutral-100 p-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => moveSection(sIndex, -1)} disabled={sIndex === 0} className="text-sm disabled:opacity-30">
                  ↑ Move up
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(sIndex, 1)}
                  disabled={sIndex === data.sections.length - 1}
                  className="text-sm disabled:opacity-30"
                >
                  ↓ Move down
                </button>
                <button type="button" onClick={() => removeSection(sIndex)} className="ml-auto text-sm text-red-600">
                  Delete section
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-neutral-500">Title</span>
                  <input
                    value={section.title}
                    onChange={(e) => updateSection(sIndex, { title: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-neutral-500">Section id (used in nav links — avoid changing after launch)</span>
                  <input
                    value={section.id}
                    onChange={(e) => updateSection(sIndex, { id: slugify(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                  />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-neutral-500">Blurb</span>
                <input
                  value={section.blurb}
                  onChange={(e) => updateSection(sIndex, { blurb: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                />
              </label>

              <div className="space-y-3">
                {section.items.map((item, iIndex) => (
                  <div key={item.id} className="space-y-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(sIndex, iIndex, { name: e.target.value })}
                        placeholder="Name"
                        className="w-full rounded-lg border border-neutral-300 p-2 text-sm font-medium"
                      />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price ?? ""}
                        onChange={(e) =>
                          updateItem(sIndex, iIndex, { price: e.target.value === "" ? undefined : Number(e.target.value) })
                        }
                        placeholder="Price"
                        className="w-28 rounded-lg border border-neutral-300 p-2 text-sm"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={item.mal ?? ""}
                        lang="ml"
                        onChange={(e) => updateItem(sIndex, iIndex, { mal: e.target.value || undefined })}
                        placeholder="Malayalam name (optional)"
                        className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                      />
                      <input
                        value={item.id}
                        onChange={(e) => updateItem(sIndex, iIndex, { id: slugify(e.target.value) })}
                        placeholder="id"
                        className="w-full rounded-lg border border-neutral-300 p-2 text-xs text-neutral-500"
                      />
                    </div>
                    <textarea
                      value={item.desc ?? ""}
                      onChange={(e) => updateItem(sIndex, iIndex, { desc: e.target.value || undefined })}
                      placeholder="Description"
                      rows={2}
                      className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      {ALL_TAGS.map((tag) => (
                        <label key={tag} className="flex items-center gap-1 text-xs text-neutral-600">
                          <input
                            type="checkbox"
                            checked={item.tags?.includes(tag) ?? false}
                            onChange={() => toggleTag(sIndex, iIndex, tag)}
                          />
                          {tag}
                        </label>
                      ))}
                      <div className="ml-auto flex items-center gap-2 text-sm">
                        <button type="button" onClick={() => moveItem(sIndex, iIndex, -1)} disabled={iIndex === 0} className="disabled:opacity-30">
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(sIndex, iIndex, 1)}
                          disabled={iIndex === section.items.length - 1}
                          className="disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button type="button" onClick={() => removeItem(sIndex, iIndex)} className="text-red-600">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem(sIndex)}
                  className="w-full rounded-lg border border-dashed border-neutral-300 py-2 text-sm text-neutral-500 hover:border-neutral-400"
                >
                  + Add item to {section.title}
                </button>
              </div>
            </div>
          </details>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="w-full rounded-xl border border-dashed border-neutral-300 py-3 text-sm text-neutral-500 hover:border-neutral-400"
        >
          + Add section
        </button>
      </div>
    </div>
  );
}
