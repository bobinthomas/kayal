"use client";

import { useEffect, useState } from "react";
import { useAdminContent } from "./useAdminContent";
import { fetchContent } from "./adminApi";
import SaveBar from "./SaveBar";
import type { MenuFile, SpecialsFile } from "@/lib/content/schemas";

export default function SpecialsEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<SpecialsFile>("specials", password, onUnauthorized);
  const [allItems, setAllItems] = useState<{ id: string; name: string; section: string }[] | null>(null);

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
  if (!data) return <p className="p-4 text-red-600">Could not load specials.</p>;

  const nameFor = (id: string) => allItems?.find((i) => i.id === id)?.name ?? id;

  function remove(index: number) {
    if (!data) return;
    setData({ featuredSpecialIds: data.featuredSpecialIds.filter((_, i) => i !== index) });
  }

  function move(index: number, dir: -1 | 1) {
    if (!data) return;
    const target = index + dir;
    if (target < 0 || target >= data.featuredSpecialIds.length) return;
    const next = data.featuredSpecialIds.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setData({ featuredSpecialIds: next });
  }

  function addItem(id: string) {
    if (!data || !id || data.featuredSpecialIds.includes(id)) return;
    if (data.featuredSpecialIds.length >= 8) return;
    setData({ featuredSpecialIds: [...data.featuredSpecialIds, id] });
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <p className="text-sm text-neutral-500">
          The home page featured specials strip shows these, in this order (max 8).
        </p>
        <div className="space-y-2">
          {data.featuredSpecialIds.map((id, i) => (
            <div key={id} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-2">
              <span className="flex-1 text-sm">{nameFor(id)}</span>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-sm disabled:opacity-30">
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === data.featuredSpecialIds.length - 1}
                className="text-sm disabled:opacity-30"
              >
                ↓
              </button>
              <button type="button" onClick={() => remove(i)} className="text-sm text-red-600">
                Remove
              </button>
            </div>
          ))}
        </div>
        {allItems && data.featuredSpecialIds.length < 8 && (
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-500">Add a menu item</span>
            <select
              value=""
              onChange={(e) => addItem(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
            >
              <option value="">Choose an item…</option>
              {allItems
                .filter((item) => !data.featuredSpecialIds.includes(item.id))
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.section}
                  </option>
                ))}
            </select>
          </label>
        )}
      </div>
    </div>
  );
}
