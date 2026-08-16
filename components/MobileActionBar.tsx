"use client";

import Link from "next/link";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";

/** Sticky bottom bar on mobile: Call · WhatsApp · Menu (PRD §6 global elements). */
export default function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-hf-border bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={`tel:${restaurant.phone.tel}`}
        onClick={() => track("call_tap", { placement: "sticky_bar" })}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold text-hf-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Call
      </a>
      <a
        href={`https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(restaurant.whatsapp.bookingMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_tap", { placement: "sticky_bar" })}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 border-x border-hf-border text-xs font-semibold text-hf-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        WhatsApp
      </a>
      <Link
        href="/menu"
        onClick={() => track("menu_view", { placement: "sticky_bar" })}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold text-hf-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        Menu
      </Link>
    </nav>
  );
}
