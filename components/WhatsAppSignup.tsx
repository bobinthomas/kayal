"use client";

import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";

export default function WhatsAppSignup() {
  return (
    <section
      aria-labelledby="whatsapp-heading"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-curryleaf/20 via-cream to-turmeric/10 p-8 ring-1 ring-turmeric/25 sm:p-12 md:flex md:items-center md:justify-between md:gap-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-turmeric/20 blur-3xl"
        />
        <div className="relative max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-leaf/60">
            WhatsApp offers
          </p>
          <h2
            id="whatsapp-heading"
            className="mt-2 font-display text-3xl font-semibold text-leaf sm:text-4xl"
            style={{ fontVariationSettings: '"WONK" 0.8' }}
          >
            First to know,{" "}
            <span className="italic text-clay">first to feast.</span>
          </h2>
          <p className="mt-3 text-ink/75">
            Weekend combos, Onam and Vishu sadya, Christmas roasts — our WhatsApp
            group hears it first.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">
            {restaurant.whatsapp.consentCopy}
          </p>
        </div>
        <a
          href={`https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(restaurant.whatsapp.joinMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_tap", { placement: "signup_block" })}
          className="btn-luxury relative mt-8 inline-flex min-h-12 shrink-0 items-center rounded-full bg-leaf px-9 text-sm font-semibold tracking-wide text-cream md:mt-0"
        >
          Join the offers group
        </a>
      </div>
    </section>
  );
}
