"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import type { MenuItem } from "@/lib/api";

const UI = "/images/ui";

/**
 * A single-colour icon from the design, drawn as a mask so it takes the
 * current text colour (active/inactive states). Width/height are the asset's
 * own dimensions.
 */
export function MaskIcon({ name, w, h, className = "" }: { name: string; w: number; h: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`mask-icon ${className}`}
      style={{ width: w, height: h, "--icon": `url(${UI}/${name}.svg)` } as CSSProperties}
    />
  );
}

/** Plain design asset at its native size. */
export function UiIcon({ name, w, h, className = "" }: { name: string; w: number; h: number; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${UI}/${name}.svg`} alt="" aria-hidden="true" width={w} height={h} className={`shrink-0 ${className}`} style={{ width: w, height: h }} />;
}

/** Kayal Foods logo lock-up (mark + LAGOON + FOODS), 30×19 as in the design. */
export function KayalLogo() {
  return (
    <span className="relative block h-[19px] w-[30px] shrink-0" role="img" aria-label="Kayal Foods">
      <UiIcon name="logo-mark" w={30} h={19} className="absolute inset-0" />
      <span className="absolute inset-[27.38%_38.07%_67.86%_43.38%]">
        <UiIcon name="logo-lagoon" w={5.565} h={0.904} className="absolute inset-0 !h-full !w-full" />
      </span>
      <span className="absolute inset-[77.74%_72.04%_14.52%_3.16%]">
        <UiIcon name="logo-foods" w={7.44} h={1.47} className="absolute inset-0 !h-full !w-full" />
      </span>
    </span>
  );
}

// Section icons from the "Menu Categories" sheet, keyed by category id
// (seed ids; admin-created categories fall back to the meal icon).
type IconSpec = { name: string; w: number; h: number };
const CATEGORY_ICON: Record<string, IconSpec> = {
  specials: { name: "cat-specials", w: 16.667, h: 15.833 },
  starters: { name: "cat-starters", w: 17.083, h: 18.333 },
  vegetarian: { name: "cat-vegetarian", w: 16.667, h: 16.667 },
  "chicken-meat": { name: "cat-poultry", w: 16.667, h: 15 },
  "main-course-meat": { name: "cat-curries", w: 17.75, h: 14.167 },
  seafood: { name: "cat-seafood", w: 18.333, h: 15.813 },
  "seafood-specials": { name: "cat-seafood", w: 18.333, h: 15.813 },
  rice: { name: "cat-rice", w: 16.667, h: 16.667 },
  "sides-pickles": { name: "cat-sides", w: 15, h: 15 },
  "desserts-drinks": { name: "cat-drinks", w: 15, h: 15 },
  desserts: { name: "cat-desserts", w: 15, h: 18.333 },
};
const FALLBACK_ICON: IconSpec = { name: "cat-lunch", w: 16.667, h: 14.167 };
export const SPECIALS_ICON = CATEGORY_ICON.specials;
export const categoryIcon = (id: string) => CATEGORY_ICON[id] ?? FALLBACK_ICON;

/** Coloured dish label (dot + text), derived from the dish's admin tags. */
export type Badge = { label: string; dot: string; text: string };
export function dishBadge(item: MenuItem): Badge | null {
  const t = item.tags;
  if (t.includes("signature")) return { label: "Chef Signature", dot: "bg-k-red", text: "text-k-amber" };
  if (t.includes("popular")) return { label: "Today's Special", dot: "bg-k-orange", text: "text-k-amber" };
  if (t.includes("spicy")) return { label: "Spicy", dot: "bg-k-red", text: "text-k-red" };
  if (t.includes("veg")) return { label: "Vegetarian", dot: "bg-k-green", text: "text-k-sea" };
  return null;
}

/** Badge on a Today's Specials photo. */
export function specialBadge(item: MenuItem): { label: string; className: string; star?: boolean } | null {
  const t = item.tags;
  if (t.includes("signature")) return { label: "Chef Special", className: "bg-k-orange text-white", star: true };
  if (t.includes("spicy")) return { label: "Spicy", className: "bg-k-red text-white" };
  if (t.includes("veg")) return { label: "Vegetarian", className: "bg-k-sea text-k-seafoam" };
  return null;
}

/** "+ ADD" pill that turns into a − qty + stepper once the dish is in the basket. */
export function QtyPill({
  qty,
  label,
  onDec,
  onInc,
  solid = false,
}: {
  qty: number;
  label: string;
  onDec: () => void;
  onInc: () => void;
  /** Filled green (Specials cards) instead of white with green text (list rows). */
  solid?: boolean;
}) {
  const shell = solid
    ? "h-8 bg-k-green text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
    : "h-7 border border-k-green/20 bg-white text-k-green shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]";
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={onInc}
        aria-label={`Add ${label} to basket`}
        className={`flex items-center gap-1 rounded-full px-3 text-xs tracking-[0.24px] transition active:scale-95 ${shell} ${
          solid ? "font-semibold" : "font-bold"
        }`}
      >
        {solid ? <UiIcon name="plus" w={9.333} h={9.333} /> : "+"}
        <span>ADD</span>
      </button>
    );
  }
  return (
    <div className={`flex items-center rounded-full text-xs font-bold ${shell}`}>
      <button type="button" onClick={onDec} aria-label={`Remove one ${label}`} className="grid h-full w-7 place-items-center text-base leading-none active:scale-90">
        −
      </button>
      <span className="min-w-4 text-center tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button type="button" onClick={onInc} aria-label={`Add one ${label}`} className="grid h-full w-7 place-items-center text-base leading-none active:scale-90">
        +
      </button>
    </div>
  );
}

/** Bottom sheet over a dimmed page. Closes on backdrop tap and Escape. */
export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="animate-sheet mx-auto flex max-h-[80dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border-t border-k-outline/30 bg-k-bg pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:max-w-lg"
      >
        <div className="flex justify-center pb-2 pt-3">
          <span className="h-1 w-10 rounded-full bg-k-outline/60" />
        </div>
        {children}
      </div>
    </div>
  );
}
