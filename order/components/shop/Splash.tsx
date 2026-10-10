"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { money, type MenuData } from "@/lib/api";
import { Icon, PrimaryButton } from "./ui";

/**
 * Welcome screen (once per session; `/?welcome` always shows it, for previews).
 * Badge, headline, text, button and photo are edited in dashboard → Settings → Home screen.
 */
export default function Splash({
  menu,
  hasOrders,
  onStart,
  onOrders,
}: {
  menu: MenuData;
  hasOrders: boolean;
  onStart: () => void;
  onOrders: () => void;
}) {
  const home = menu.home;
  const freeFrom = menu.zones.find((z) => z.free_over_cents > 0)?.free_over_cents;
  // Quick facts come from live settings, so they stay true as delivery changes.
  const facts: { icon: ReactNode; text: string }[] = [];
  if (menu.delivery.deliveryEnabled && menu.zones.length > 0) {
    facts.push({ icon: Icon.truck, text: `${menu.zones.length} delivery suburbs` });
  }
  if (freeFrom) facts.push({ icon: Icon.bag, text: `Free delivery over ${money(freeFrom).replace(".00", "")}` });
  if (menu.delivery.pickupEnabled) facts.push({ icon: Icon.store, text: "Pickup available" });
  facts.push({ icon: Icon.clock, text: "Cooked fresh to order" });

  return (
    <main className="min-h-dvh bg-white md:grid md:grid-cols-2">
      <div className="relative h-[52dvh] md:h-dvh">
        <Image
          src={home.imageUrl}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="relative -mt-8 rounded-t-[2rem] bg-white px-6 pb-10 pt-8 md:mt-0 md:flex md:flex-col md:justify-center md:rounded-none md:px-14">
        <div className="mx-auto w-full max-w-md animate-rise">
          {home.badge && (
            <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
              {home.badge}
            </span>
          )}
          <h1 className="mt-4 text-[1.9rem] font-bold leading-tight text-night md:text-5xl">{home.headline}</h1>
          {home.text && <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-muted">{home.text}</p>}

          {facts.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-5">
              {facts.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-night">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-night">{f.icon}</span>
                  <span className="leading-tight">{f.text}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7">
            <PrimaryButton onClick={onStart}>{home.buttonLabel}</PrimaryButton>
          </div>
          {hasOrders && (
            <p className="mt-4 text-center text-sm text-muted">
              Already ordered?{" "}
              <button type="button" onClick={onOrders} className="font-semibold text-brand">
                Track your order
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
