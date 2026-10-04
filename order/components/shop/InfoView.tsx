"use client";

import { money, type MenuData } from "@/lib/api";
import { Icon } from "./ui";

const STEPS = ["Place your order", "We adjust for freshness", "Final invoice sent", "You pay", "We prepare"];

/** Info tab: how ordering works, where we deliver, pickup and contact. */
export default function InfoView({ menu }: { menu: MenuData }) {
  const phone = menu.restaurant.phone.trim();
  return (
    <main className="min-h-dvh bg-white pb-28">
      <div className="mx-auto max-w-md px-5 pt-6 md:max-w-lg">
        <h1 className="text-[1.75rem] font-bold text-night">Delivery &amp; info</h1>

        {/* How Ordering Works — first section */}
        <section className="mt-6 rounded-3xl bg-brand-soft p-5">
          <h2 className="text-lg font-bold text-night">How Ordering Works</h2>
          <p className="mt-2 text-sm leading-relaxed text-night/80">
            You order what you need, we adjust for what is available. We send you the final invoice, you pay, and we
            prepare your order.
          </p>

          <ol className="mt-5 space-y-0" aria-label="Ordering steps">
            {STEPS.map((step, i) => (
              <li key={step} className="relative flex items-center gap-3 pb-4 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5 bg-brand/30" />
                )}
                <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-night">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 rounded-2xl bg-white p-4 text-sm">
            <h3 className="font-bold text-night">Why we adjust</h3>
            <p className="mt-1 leading-relaxed text-muted">
              Fresh items come in natural bunches and weights. If you order 2kg of bananas but the bunch is 2.2kg, we
              adjust to that. No cutting or wasting. Just fresh items.
            </p>
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4 text-sm">
            <h3 className="font-bold text-night">Payment</h3>
            <p className="mt-1 leading-relaxed text-muted">
              You get the final invoice with exact quantities and price. Pay by bank transfer and upload the receipt. We
              verify and start preparing your order.
            </p>
          </div>
        </section>

        {menu.delivery.deliveryEnabled && menu.zones.length > 0 && (
          <section className="mt-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-night">
              <span className="text-brand">{Icon.truck}</span> We deliver to
            </h2>
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-3xl bg-surface">
              {menu.zones.map((z) => (
                <li key={z.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="font-medium text-night">{z.name}</span>
                  <span className="text-right text-xs text-muted">
                    {money(z.fee_cents)}
                    {z.free_over_cents > 0 && (
                      <span className="block font-semibold text-brand">Free over {money(z.free_over_cents)}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {menu.delivery.pickupEnabled && (
          <section className="mt-6 flex items-start gap-3 rounded-3xl bg-surface p-4 text-sm">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-night">{Icon.store}</span>
            <span>
              <span className="block font-semibold text-night">Pickup available</span>
              <span className="text-muted">Choose “Pickup from Kayal” at the top of the menu or at checkout.</span>
            </span>
          </section>
        )}

        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="mt-6 flex h-14 items-center justify-center rounded-full bg-night text-base font-semibold text-white"
          >
            Call {menu.restaurant.name} · {phone}
          </a>
        )}
      </div>
    </main>
  );
}
