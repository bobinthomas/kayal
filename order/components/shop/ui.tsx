"use client";

import Image from "next/image";
import type { ReactNode } from "react";

// Emoji stand-ins for category art (keyed by category id from the seed;
// admin-created categories fall back to the plate).
const CATEGORY_EMOJI: Record<string, string> = {
  starters: "🥟",
  vegetarian: "🥗",
  "chicken-meat": "🍗",
  "main-course-meat": "🍖",
  seafood: "🦐",
  rice: "🍚",
  specials: "⭐",
  "seafood-specials": "🦞",
  "sides-pickles": "🫙",
  "desserts-drinks": "🍮",
  custom: "✨",
};
export const categoryEmoji = (id: string) => CATEGORY_EMOJI[id] ?? "🍽️";

/** Full-width, short (16:10) dish photo for menu tiles; soft emoji tile without a photo. */
export function SquarePhoto({ src, categoryId, alt }: { src: string | null; categoryId: string; alt: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-brand-soft">
      {src ? (
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 20vw, 45vw" className="object-cover" />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-3xl">
          {categoryEmoji(categoryId)}
        </span>
      )}
    </div>
  );
}

/** Square, rounded dish thumbnail (flat), or a soft tile with the category emoji. */
export function Thumb({
  src,
  categoryId,
  alt,
  size,
}: {
  src: string | null;
  categoryId: string;
  alt: string;
  size: number;
}) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-2xl bg-brand-soft" style={{ width: size, height: size }}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-hidden="true" className="grid h-full w-full place-items-center" style={{ fontSize: size * 0.42 }}>
          {categoryEmoji(categoryId)}
        </span>
      )}
    </div>
  );
}

/**
 * Photo card with the title on a dark fade (reference "Popular Recipes").
 * Dishes without a photo get a dark tile with the category emoji so the
 * white text stays readable.
 */
export function PhotoCard({
  src,
  categoryId,
  title,
  meta,
  badge,
  className = "",
}: {
  src: string | null;
  categoryId: string;
  title: string;
  meta: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-night ${className}`}>
      {src ? (
        <Image src={src} alt={title} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center pb-10 text-6xl opacity-90">
          {categoryEmoji(categoryId)}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      {badge && <div className="absolute right-3 top-3">{badge}</div>}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug">{title}</h3>
        <div className="mt-1 text-xs text-white/80">{meta}</div>
      </div>
    </div>
  );
}

export function Stepper({
  qty,
  onDec,
  onInc,
  label,
  dark = false,
  full = false,
  small = false,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
  label: string;
  dark?: boolean;
  /** Stretch across the card (grid cards). */
  full?: boolean;
  /** Compact size for the 3-across menu tiles. */
  small?: boolean;
}) {
  const btn = small ? "h-6 w-6 text-base" : "h-8 w-8 text-lg";
  return (
    <div
      className={`flex ${small ? "h-7" : "h-9"} shrink-0 items-center rounded-full p-0.5 ${dark ? "bg-white" : "bg-surface"} ${
        full ? "w-full justify-between" : ""
      }`}
    >
      <button
        type="button"
        onClick={onDec}
        aria-label={`Remove one ${label}`}
        className={`grid ${btn} place-items-center rounded-full text-night active:scale-90`}
      >
        −
      </button>
      <span className={`${small ? "w-4 text-xs" : "w-6 text-sm"} text-center font-semibold tabular-nums text-night`} aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        aria-label={`Add one ${label}`}
        className={`grid ${btn} place-items-center rounded-full bg-brand text-white active:scale-90`}
      >
        +
      </button>
    </div>
  );
}

export function AddButton({ onClick, label, small = false }: { onClick: () => void; label: string; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add ${label} to cart`}
      className={`grid shrink-0 place-items-center bg-brand leading-none text-white transition hover:bg-brand-dark active:scale-90 ${
        small ? "h-7 w-7 rounded-lg text-lg" : "h-9 w-9 rounded-xl text-xl"
      }`}
    >
      +
    </button>
  );
}

export function CircleButton({ onClick, label, children }: { onClick?: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface text-night transition active:scale-95"
    >
      {children}
    </button>
  );
}

/** Black "Breakfast"-style pill when active, grey otherwise. */
export function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-11 shrink-0 whitespace-nowrap rounded-full px-5 text-sm font-semibold transition ${
        active ? "bg-night text-white" : "bg-surface text-night/70"
      }`}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-base font-semibold text-white transition hover:bg-brand-dark active:scale-[0.99] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

const svg = (d: ReactNode, size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

export const Icon = {
  back: svg(<path d="M19 12H5m6-6l-6 6 6 6" />, 20),
  home: svg(<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />),
  search: svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>,
  ),
  bag: svg(
    <>
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>,
  ),
  receipt: svg(
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6" />
    </>,
  ),
  info: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>,
  ),
  chevron: svg(<path d="M6 9l6 6 6-6" />, 16),
  pin: svg(
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
    16,
  ),
  leaf: svg(
    <>
      <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
      <path d="M5 19l7-7" />
    </>,
    20,
  ),
  truck: svg(
    <>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </>,
    20,
  ),
  clock: svg(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>,
    20,
  ),
  store: svg(
    <>
      <path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16" />
      <path d="M10 20v-5h4v5" />
    </>,
    20,
  ),
};
