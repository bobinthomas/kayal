"use client";

import type { ReactNode } from "react";
import { money, type MenuData } from "@/lib/api";
import { Icon } from "./ui";

const stroke = (d: ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

// Order → We confirm → You pay → We prepare
const STEPS: { title: string; text: string; icon: ReactNode; iconLabel: string }[] = [
  {
    title: "Place your order",
    text: "Choose the items and quantities you need.",
    iconLabel: "Shopping basket",
    icon: stroke(
      <>
        <path d="M4 10h16l-1.6 8.4a2 2 0 0 1-2 1.6H7.6a2 2 0 0 1-2-1.6z" />
        <path d="M8.5 10l3-6M15.5 10l-3-6M9.5 14v2.5M14.5 14v2.5" />
      </>,
    ),
  },
  {
    title: "We confirm your order",
    text: "We adjust quantities for natural weights and send you the final invoice.",
    iconLabel: "Checked invoice",
    icon: stroke(
      <>
        <path d="M7 3h10a1 1 0 0 1 1 1v16l-3-1.8-3 1.8-3-1.8L6 20V4a1 1 0 0 1 1-1z" />
        <path d="M9 11l2 2 4-4" />
      </>,
    ),
  },
  {
    title: "You pay",
    text: "Pay the final amount by bank transfer and upload your payment receipt.",
    iconLabel: "Bank card",
    icon: stroke(
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </>,
    ),
  },
  {
    title: "We prepare",
    text: "Once your payment is verified, we prepare your order.",
    iconLabel: "Packed order",
    icon: stroke(
      <>
        <path d="M4 8l8-4 8 4v8l-8 4-8-4z" />
        <path d="M4 8l8 4 8-4M12 12v8" />
      </>,
    ),
  },
];

/** Info tab: how ordering works, where we deliver, pickup and contact. */
export default function InfoView({ menu }: { menu: MenuData }) {
  const phone = menu.restaurant.phone.trim();
  return (
    <main className="min-h-dvh bg-white pb-28">
      <div className="mx-auto max-w-md px-5 pt-6 md:max-w-4xl">
        <h1 className="text-[1.75rem] font-bold text-night">Delivery &amp; info</h1>

        <HowOrderingWorks />

        <div className="md:mt-2 md:grid md:grid-cols-2 md:items-start md:gap-6">
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
                        <span className="block font-semibold text-brand-dark">Free over {money(z.free_over_cents)}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div>
            {menu.delivery.pickupEnabled && (
              <section className="mt-6 flex items-start gap-3 rounded-3xl bg-surface p-4 text-sm md:mt-[3.25rem]">
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
        </div>
      </div>
    </main>
  );
}

function HowOrderingWorks() {
  return (
    <section aria-labelledby="how-ordering" className="mt-5 rounded-3xl bg-brand-soft p-4 sm:p-5 md:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-dark">Simple &amp; fresh</p>
      <h2 id="how-ordering" className="mt-1 text-xl font-bold text-night md:text-2xl">
        How Ordering Works
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-night/75">
        Order what you need. We confirm the actual quantity and price, then prepare your order once payment is received.
      </p>

      <ol className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5 md:mt-6 md:grid-cols-4 md:gap-5">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="relative flex flex-col rounded-[20px] bg-white p-3 shadow-[0_1px_3px_rgba(20,20,20,0.06)] sm:p-3.5 md:p-5"
          >
            <span className="relative shrink-0">
              <span role="img" aria-label={s.iconLabel} className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand-dark md:h-11 md:w-11">
                {s.icon}
              </span>
              <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-white ring-2 ring-white">
                {i + 1}
              </span>
            </span>
            <span className="mt-3 min-w-0 md:mt-4">
              <span className="block text-sm font-semibold leading-snug text-night md:text-[15px]">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </span>
              <span className="mt-1 block text-xs leading-snug text-night/65 md:mt-1.5 md:text-[13px]">{s.text}</span>
            </span>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -right-[18px] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-brand-soft text-brand-dark md:grid"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Reassurance, not a step: no number, calmer styling */}
      <div className="mt-4 flex items-start gap-3 rounded-[20px] bg-white/60 px-4 py-3.5 md:mt-5 md:items-center md:px-5">
        <span role="img" aria-label="Leaf" className="mt-0.5 shrink-0 text-brand-dark md:mt-0">
          {Icon.leaf}
        </span>
        <p className="text-[13px] leading-snug text-night/75">
          <span className="font-semibold text-night">Freshness adjustment · </span>
          Fresh produce comes in natural sizes and weights. Your final invoice reflects the actual quantity supplied. For
          example, a 2 kg banana order may weigh 2.2 kg. No cutting or wasting — just fresh items.
        </p>
      </div>
    </section>
  );
}
