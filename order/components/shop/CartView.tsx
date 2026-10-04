"use client";

import { money } from "@/lib/api";
import type { CartLine, Location, Totals } from "@/lib/totals";
import { CircleButton, Icon, PrimaryButton, Stepper, Thumb } from "./ui";

export default function CartView({
  lines,
  totals,
  location,
  change,
  onBack,
  onCheckout,
}: {
  lines: CartLine[];
  totals: Totals;
  location: Location;
  change: (id: string, delta: number) => void;
  onBack: () => void;
  onCheckout: () => void;
}) {
  return (
    <main className="min-h-dvh bg-white pb-10">
      <div className="mx-auto max-w-md px-5 pt-6 md:max-w-lg">
        <ScreenHeader title="My Cart" onBack={onBack} />

        {lines.length === 0 ? (
          <div className="mt-20 text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-surface text-night/40">{Icon.bag}</span>
            <p className="mt-5 text-lg font-semibold text-night">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted">Add a few dishes to get started.</p>
            <div className="mx-auto mt-6 max-w-xs">
              <PrimaryButton onClick={onBack}>Browse the menu</PrimaryButton>
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {lines.map(({ item, qty }) => (
                <li key={item.id} className="flex items-center gap-3.5 rounded-3xl bg-surface p-3">
                  <Thumb src={item.image_url} categoryId={item.category_id} alt={item.name} size={72} />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-semibold leading-snug text-night">{item.name}</h2>
                    <p className="text-xs text-muted">{money(item.price_cents)} each</p>
                    <p className="mt-1 font-bold text-night">{money(item.price_cents * qty)}</p>
                  </div>
                  <Stepper dark qty={qty} label={item.name} onDec={() => change(item.id, -1)} onInc={() => change(item.id, 1)} />
                </li>
              ))}
            </ul>

            {location.fulfilment === "delivery" && totals.zone && <FreeDeliveryMeter totals={totals} />}

            <section className="mt-5 rounded-3xl border border-line p-5 text-sm">
              <Row label="Subtotal" value={money(totals.subtotal)} />
              <Row
                label={location.fulfilment === "pickup" ? "Pickup" : `Delivery · ${totals.zone?.name ?? ""}`}
                value={location.fulfilment === "pickup" || totals.fee === 0 ? "Free" : money(totals.fee)}
              />
              {totals.tax > 0 && <Row label="GST" value={money(totals.tax)} />}
              <div className="my-3 border-t border-dashed border-line" />
              <Row label="Total" value={money(totals.total)} strong />
            </section>

            <div className="mt-6">
              <PrimaryButton onClick={onCheckout}>Checkout · {money(totals.total)}</PrimaryButton>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center">
      <CircleButton label="Back" onClick={onBack}>
        {Icon.back}
      </CircleButton>
      <h1 className="text-center text-lg font-bold text-night">{title}</h1>
      <span aria-hidden="true" />
    </header>
  );
}

export function FreeDeliveryMeter({ totals }: { totals: Totals }) {
  const threshold = totals.zone?.free_over_cents ?? 0;
  if (!threshold) return null;
  const pct = Math.min(100, Math.round((totals.subtotal / threshold) * 100));
  return (
    <div className="mt-5 rounded-3xl bg-brand-soft p-4 text-sm">
      <p className="font-semibold text-brand-dark">
        {totals.freeUnlocked ? "🎉 You've unlocked free delivery!" : `Add ${money(totals.toFree)} more to unlock free delivery`}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <p className={`flex justify-between gap-4 py-1 ${strong ? "text-base font-bold text-night" : "text-muted"}`}>
      <span className="truncate">{label}</span>
      <span className={strong ? "" : "font-medium text-night"}>{value}</span>
    </p>
  );
}
