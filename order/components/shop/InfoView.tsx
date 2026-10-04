"use client";

import { money, type MenuData } from "@/lib/api";
import { Icon } from "./ui";

/** Info tab: where we deliver, what it costs, pickup and contact. */
export default function InfoView({ menu }: { menu: MenuData }) {
  const phone = menu.restaurant.phone.trim();
  return (
    <main className="min-h-dvh bg-white pb-28">
      <div className="mx-auto max-w-md px-5 pt-6 md:max-w-lg">
        <h1 className="text-[1.75rem] font-bold text-night">Delivery &amp; info</h1>

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

        <section className="mt-6 flex items-start gap-3 rounded-3xl bg-surface p-4 text-sm">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-night">{Icon.bag}</span>
          <span>
            <span className="block font-semibold text-night">How payment works</span>
            <span className="text-muted">
              Place your order, pay by bank transfer, then upload the receipt on your order page. We confirm once it&apos;s
              verified.
            </span>
          </span>
        </section>

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
