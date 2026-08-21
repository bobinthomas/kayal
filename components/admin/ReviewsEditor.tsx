"use client";

import { useAdminContent } from "./useAdminContent";
import SaveBar from "./SaveBar";
import type { ReviewsFile } from "@/lib/content/schemas";

function emptyReview() {
  return { quote: "", author: "Google review", source: "Google" };
}

export default function ReviewsEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<ReviewsFile>("reviews", password, onUnauthorized);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) return <p className="p-4 text-red-600">Could not load reviews.</p>;

  const reviews = data.reviews;

  function update(index: number, patch: Partial<(typeof reviews)[number]>) {
    const next = reviews.slice();
    next[index] = { ...next[index], ...patch };
    setData({ reviews: next });
  }

  function remove(index: number) {
    if (!window.confirm("Delete this review?")) return;
    setData({ reviews: reviews.filter((_, i) => i !== index) });
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= reviews.length) return;
    const next = reviews.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setData({ reviews: next });
  }

  function add() {
    setData({ reviews: [...reviews, emptyReview()] });
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        {reviews.map((review, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Review {i + 1}</span>
              <div className="flex gap-2 text-sm">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === reviews.length - 1}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button type="button" onClick={() => remove(i)} className="text-red-600">
                  Delete
                </button>
              </div>
            </div>
            <textarea
              value={review.quote}
              onChange={(e) => update(i, { quote: e.target.value })}
              rows={3}
              placeholder="Quote"
              className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
            />
            <div className="flex gap-2">
              <input
                value={review.author}
                onChange={(e) => update(i, { author: e.target.value })}
                placeholder="Author"
                className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
              />
              <input
                value={review.source}
                onChange={(e) => update(i, { source: e.target.value })}
                placeholder="Source"
                className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="w-full rounded-xl border border-dashed border-neutral-300 py-3 text-sm text-neutral-500 hover:border-neutral-400"
        >
          + Add review
        </button>
      </div>
    </div>
  );
}
