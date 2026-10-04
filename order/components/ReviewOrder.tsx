"use client";

import { useMemo, useState } from "react";
import {
  confirmOrder,
  lineTotal,
  memberDiscount,
  money,
  qtyText,
  type AdminMenuItem,
  type AdminOrder,
  type OrderItem,
  type Settings,
} from "@/lib/api";

/**
 * "Review & confirm" for a new order: adjust what's actually supplied
 * (quantities incl. decimals, unit prices, remove/add dishes, delivery fee),
 * leave a note, see old → new total, then confirm and send the final invoice.
 * The server recomputes everything; the preview here mirrors it.
 */
type Line = { id: string; name: string; qty: string; price: string; orig?: OrderItem };

const toLine = (i: OrderItem): Line => ({
  id: i.id,
  name: i.name,
  qty: qtyText(i.qty),
  price: (i.unit_cents / 100).toFixed(2),
  orig: i,
});

export default function ReviewOrder({
  order: o,
  pricing,
  menu,
  act,
}: {
  order: AdminOrder;
  pricing: Pick<Settings, "tax" | "whatsapp"> | null;
  menu: AdminMenuItem[];
  act: (p: Promise<{ ok: boolean; error?: string }>) => Promise<boolean>;
}) {
  const placed = useMemo(() => JSON.parse(o.items_json) as OrderItem[], [o.items_json]);
  const [lines, setLines] = useState<Line[]>(() => placed.map(toLine));
  const [fee, setFee] = useState((o.fee_cents / 100).toFixed(2));
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = lines.map((l) => ({ ...l, q: parseFloat(l.qty), cents: Math.round(parseFloat(l.price) * 100) }));
  const invalid = parsed.find((l) => !(l.q > 0) || !(l.cents >= 0));
  const feeCents = o.fulfilment === "delivery" ? Math.round(parseFloat(fee || "0") * 100) : 0;

  const subtotal = parsed.reduce((s, l) => s + (invalid ? 0 : lineTotal({ qty: l.q, unit_cents: l.cents })), 0);
  let total = o.total_cents;
  if (pricing && !invalid && Number.isFinite(feeCents)) {
    const discount = memberDiscount(pricing.whatsapp, !!o.whatsapp_member, subtotal);
    const taxable = subtotal - discount + feeCents;
    total = taxable + (pricing.tax.inclusive ? 0 : Math.round((taxable * pricing.tax.rateBps) / 10000));
  }

  const changed =
    lines.length !== placed.length ||
    parsed.some((l) => !l.orig || l.q !== l.orig.qty || l.cents !== l.orig.unit_cents) ||
    feeCents !== o.fee_cents;
  const diff = total - o.total_cents;

  const addable = menu.filter((m) => m.listed && m.available && !lines.some((l) => l.id === m.id));

  const set = (id: string, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  async function submit(asIs: boolean) {
    setError(null);
    if (!asIs && invalid) return setError(`Check the quantity and price for "${invalid.name}".`);
    if (!asIs && lines.length === 0) return setError("The order needs at least one item.");
    if (!asIs && !Number.isFinite(feeCents)) return setError("Check the delivery fee.");
    setBusy(true);
    await act(
      asIs
        ? confirmOrder(o.id)
        : confirmOrder(o.id, {
            items: parsed.map((l) => ({ id: l.id, qty: l.q, unit_cents: l.cents })),
            feeCents,
            note,
          }),
    );
    setBusy(false);
  }

  const field = "h-9 rounded-lg bg-surface px-2 text-right text-sm tabular-nums text-night focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div className="rounded-2xl border border-line p-3">
      <p className="font-semibold text-night">Review &amp; confirm</p>
      <p className="mt-0.5 text-xs text-muted">Adjust to what you can actually supply, then send the final invoice.</p>

      <ul className="mt-3 space-y-2">
        {parsed.map((l) => {
          const edited = !l.orig || l.q !== l.orig.qty || l.cents !== l.orig.unit_cents;
          return (
            <li key={l.id} className={`rounded-xl p-2 ${edited ? "bg-turmeric/20" : "bg-surface/60"}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-medium leading-snug text-night">
                  {l.name}
                  {!l.orig && <span className="ml-1.5 text-[11px] font-semibold text-brand-dark">added</span>}
                  {l.orig && edited && (
                    <span className="ml-1.5 text-[11px] text-night/60">
                      was {qtyText(l.orig.qty)} × {money(l.orig.unit_cents)}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))}
                  aria-label={`Remove ${l.name}`}
                  className="shrink-0 rounded-full px-2 text-xs text-muted hover:text-chilli"
                >
                  Remove
                </button>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-sm">
                <label className="flex items-center gap-1">
                  <span className="sr-only">Quantity for {l.name}</span>
                  <input inputMode="decimal" value={l.qty} onChange={(e) => set(l.id, { qty: e.target.value })} className={`${field} w-16`} />
                </label>
                <span className="text-muted">×</span>
                <label className="flex items-center gap-1">
                  <span className="text-muted">$</span>
                  <span className="sr-only">Unit price for {l.name}</span>
                  <input inputMode="decimal" value={l.price} onChange={(e) => set(l.id, { price: e.target.value })} className={`${field} w-20`} />
                </label>
                <span className="ml-auto font-semibold tabular-nums text-night">
                  {l.q > 0 && l.cents >= 0 ? money(lineTotal({ qty: l.q, unit_cents: l.cents })) : "—"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {addable.length > 0 && (
        <div className="mt-2 flex gap-2">
          <select value={adding} onChange={(e) => setAdding(e.target.value)} className="h-9 min-w-0 flex-1 rounded-lg bg-surface px-2 text-sm text-night">
            <option value="">+ Add a dish…</option>
            {addable.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {money(m.price_cents)}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!adding}
            onClick={() => {
              const m = menu.find((x) => x.id === adding);
              if (m) setLines((ls) => [...ls, { id: m.id, name: m.name, qty: "1", price: (m.price_cents / 100).toFixed(2) }]);
              setAdding("");
            }}
            className="h-9 rounded-lg bg-night px-3 text-xs font-semibold text-white disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}

      {o.fulfilment === "delivery" && (
        <label className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-night/80">Delivery fee</span>
          <span className="flex items-center gap-1">
            <span className="text-muted">$</span>
            <input inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} className={`${field} w-20`} />
          </span>
        </label>
      )}

      <label className="mt-3 block">
        <span className="sr-only">Note to the customer</span>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note to the customer (optional) — e.g. Bananas came to 2.2 kg"
          className="w-full rounded-xl bg-surface px-3 py-2 text-sm text-night placeholder:text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </label>

      <div className="mt-3 flex items-baseline justify-between rounded-xl bg-brand-soft px-3 py-2.5">
        <span className="text-sm text-night/80">{changed ? "Final total" : "Total"}</span>
        <span className="text-right">
          {changed && <span className="mr-2 text-xs text-muted line-through">{money(o.total_cents)}</span>}
          <span className="font-bold tabular-nums text-night">{money(total)}</span>
          {changed && diff !== 0 && (
            <span className={`block text-[11px] font-semibold ${diff > 0 ? "text-night/70" : "text-brand-dark"}`}>
              {diff > 0 ? "+" : "−"}
              {money(Math.abs(diff))} vs order
            </span>
          )}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted">GST and any member discount are recalculated when you confirm.</p>

      {error && <p className="mt-2 text-sm font-medium text-chilli">{error}</p>}

      <button
        type="button"
        disabled={busy}
        onClick={() => submit(!changed && !note.trim())}
        className="mt-3 h-12 w-full rounded-full bg-brand text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {busy ? "Sending…" : changed ? `Confirm & send final invoice · ${money(total)}` : "Confirm & send invoice (no changes)"}
      </button>
    </div>
  );
}
