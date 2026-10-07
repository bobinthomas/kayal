"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bySection, money, type MenuData, type MenuItem } from "@/lib/api";
import type { Location } from "@/lib/totals";
import {
  categoryIcon,
  dishBadge,
  KayalLogo,
  MaskIcon,
  QtyPill,
  Sheet,
  SPECIALS_ICON,
  specialBadge,
  UiIcon,
} from "./menuKit";
import { categoryEmoji } from "./ui";

type Filters = { veg: boolean; spicy: boolean; signature: boolean };
const NO_FILTERS: Filters = { veg: false, spicy: false, signature: false };
const FILTER_OPTIONS: { key: keyof Filters; label: string; tag: string }[] = [
  { key: "veg", label: "Vegetarian only", tag: "veg" },
  { key: "spicy", label: "Spicy", tag: "spicy" },
  { key: "signature", label: "Chef signature", tag: "signature" },
];

/** Jump targets for the chip row and the Menu Categories sheet. */
type NavEntry = { id: string; name: string; short: string; blurb: string | null; count: number };
const SPECIALS_ID = "todays-specials";
const sectionDomId = (id: string) => `sec-${id}`;
const shortName = (name: string) => name.replace(/^Main Course\s*-?\s*/, "");

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MenuHome({
  menu,
  cart,
  change,
  location,
  setLocation,
  focusSearch,
  basketVisible,
}: {
  menu: MenuData;
  cart: Record<string, number>;
  change: (id: string, delta: number) => void;
  location: Location;
  setLocation: (l: Location) => void;
  /** Bumped by the bottom bar's Explore tab to focus the search box. */
  focusSearch: number;
  /** The basket bar is showing, so the Browse Menu pill sits above it. */
  basketVisible: boolean;
}) {
  const [section, setSection] = useState<"foods" | "groceries">("foods");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [sheet, setSheet] = useState<null | "categories" | "filters">(null);
  const [active, setActive] = useState<string>(SPECIALS_ID);
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusSearch) searchRef.current?.focus();
  }, [focusSearch]);

  const grocery = section === "groceries";
  const split = useMemo(() => bySection(menu.items, (i) => i.id), [menu.items]);
  const filterCount = Object.values(filters).filter(Boolean).length;

  const matches = useCallback(
    (i: MenuItem) => {
      const q = query.trim().toLowerCase();
      if (q && !i.name.toLowerCase().includes(q) && !(i.description ?? "").toLowerCase().includes(q)) return false;
      if (grocery) return true;
      return FILTER_OPTIONS.every((f) => !filters[f.key] || i.tags.includes(f.tag));
    },
    [query, filters, grocery],
  );

  const browsing = !query.trim() && filterCount === 0;

  // Today's Specials: dishes the admin marked popular; until any are marked,
  // fall back to dishes with photos.
  const specials = useMemo(() => {
    const marked = split.foods.filter((i) => i.tags.includes("popular"));
    if (marked.length > 0) return marked;
    return split.foods.filter((i) => i.image_url).slice(0, 6);
  }, [split.foods]);

  const sections = useMemo(
    () =>
      menu.categories
        .map((c) => ({ category: c, items: split.foods.filter((i) => i.category_id === c.id && matches(i)) }))
        .filter((s) => s.items.length > 0),
    [menu.categories, split.foods, matches],
  );
  const groceries = useMemo(() => split.groceries.filter(matches), [split.groceries, matches]);
  const shownCount = grocery ? groceries.length : sections.reduce((n, s) => n + s.items.length, 0);

  const showSpecials = !grocery && browsing && specials.length > 0;
  const nav: NavEntry[] = useMemo(
    () => [
      ...(showSpecials
        ? [{ id: SPECIALS_ID, name: "Today's Specials", short: "Today's Specials", blurb: "Picked by the kitchen today", count: specials.length }]
        : []),
      ...sections.map(({ category: c, items }) => ({ id: c.id, name: c.name, short: shortName(c.name), blurb: c.blurb, count: items.length })),
    ],
    [showSpecials, specials.length, sections],
  );
  const current = nav.some((n) => n.id === active) ? active : (nav[0]?.id ?? "");

  // Scroll-spy: the active chip follows the section under the sticky chip row.
  useEffect(() => {
    if (grocery || nav.length === 0) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 12;
        let id = nav[0].id;
        for (const n of nav) {
          const el = document.getElementById(sectionDomId(n.id));
          if (el && el.getBoundingClientRect().top <= line) id = n.id;
        }
        setActive(id);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [grocery, nav]);

  // Keep the active chip in view inside the horizontal row.
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-chip="${current}"]`);
    if (!row || !chip) return;
    row.scrollTo({ left: chip.offsetLeft - 16, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [current]);

  const jumpTo = useCallback((id: string) => {
    setSheet(null);
    setActive(id);
    // Measure after an open sheet has closed: it hides the page scrollbar,
    // and the reflow when it returns would shift the target.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = document.getElementById(sectionDomId(id));
        if (!el) return;
        const offset = (navRef.current?.offsetHeight ?? 0) + 4;
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - offset,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }),
    );
  }, []);

  const switchSection = (s: "foods" | "groceries") => {
    setSection(s);
    setFilters(NO_FILTERS);
    setQuery("");
  };

  const sectionsTotal = sections.length + (showSpecials ? 1 : 0);
  const browseBottom = basketVisible
    ? "calc(155px + env(safe-area-inset-bottom))"
    : "calc(85px + env(safe-area-inset-bottom))";

  return (
    <main className="min-h-dvh overflow-x-clip bg-k-bg pb-48 text-k-ink">
      <div className="mx-auto max-w-md md:max-w-3xl">
        <Header
          menu={menu}
          location={location}
          setLocation={setLocation}
          section={section}
          setSection={switchSection}
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
          dishCount={grocery ? split.groceries.length : split.foods.length}
          filterCount={filterCount}
          onFilters={() => setSheet("filters")}
        />

        {/* Sticky single-row category navigation */}
        {!grocery && nav.length > 0 && (
          <nav
            ref={navRef}
            aria-label="Menu sections"
            className="sticky top-0 z-20 border-t border-k-outline/20 bg-k-bg/95 px-4 pb-2 pt-[9px] shadow-[0_2px_12px_0_rgba(15,81,50,0.05)] backdrop-blur-[6px]"
          >
            <div ref={chipsRef} className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
              {nav.map((n) => {
                const on = n.id === current;
                return (
                  <button
                    key={n.id}
                    type="button"
                    data-chip={n.id}
                    onClick={() => jumpTo(n.id)}
                    aria-current={on ? "true" : undefined}
                    className={`flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-xs tracking-[0.24px] transition ${
                      on ? "bg-k-green font-semibold text-white" : "bg-k-tint font-medium text-k-text"
                    }`}
                  >
                    {n.short}
                    <span className="text-[11px] font-normal opacity-75">{n.count}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {menu.items.length === 0 && (
          <p className="mx-4 mt-10 rounded-xl bg-k-tint p-8 text-center text-k-text">Our menu is being updated — please check back soon.</p>
        )}

        {!browsing && (
          <p className="px-4 pt-3 text-xs font-semibold tracking-[0.24px] text-k-text">
            {shownCount} {grocery ? "item" : "dish"}
            {shownCount === 1 ? "" : grocery ? "s" : "es"} found
          </p>
        )}
        {!browsing && shownCount === 0 && (
          <p className="mx-4 mt-3 rounded-xl bg-k-tint p-6 text-center text-k-text">Nothing matches — try another search or clear filters.</p>
        )}

        {grocery ? (
          <MenuSection
            id="groceries"
            title="Groceries"
            blurb={null}
            items={groceries}
            cart={cart}
            change={change}
            unit="Items"
          />
        ) : (
          <>
            {showSpecials && (
              <SpecialsStrip items={specials} cart={cart} change={change} catName={(id) => shortName(menu.categories.find((c) => c.id === id)?.name ?? "")} />
            )}
            {sections.map(({ category, items }) => (
              <MenuSection key={category.id} id={category.id} title={category.name} blurb={category.blurb} items={items} cart={cart} change={change} />
            ))}
          </>
        )}
        {grocery && browsing && groceries.length === 0 && (
          <p className="mx-4 mt-3 rounded-xl bg-k-tint p-6 text-center text-k-text">No grocery items yet — check back soon.</p>
        )}

        {/* Trust card */}
        <div className="px-4 pb-4 pt-4">
          <div className="flex items-center gap-3 rounded-xl border border-k-outline/30 bg-k-tint p-[15px]">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-k-green">
              <UiIcon name="verified" w={18.333} h={17.5} />
            </span>
            <h4 className="text-sm font-bold tracking-[0.14px] text-k-ink">Delivery Everyday 5 pm to 9 pm</h4>
          </div>
        </div>
      </div>

      {/* Floating "Browse Menu" pill */}
      {!grocery && sectionsTotal > 1 && (
        <div className="pointer-events-none fixed inset-x-0 z-30" style={{ bottom: browseBottom }}>
          <div className="mx-auto flex max-w-md justify-end px-4 md:max-w-lg">
            <button
              type="button"
              onClick={() => setSheet("categories")}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-[rgba(176,241,199,0.2)] bg-k-deep px-[17px] py-[11px] drop-shadow-[0_8px_12px_rgba(15,81,50,0.4)] transition active:scale-95"
            >
              <UiIcon name="book" w={16.5} h={12} />
              <span className="text-xs font-bold tracking-[0.24px] text-white">Browse Menu</span>
              <span className="rounded-full bg-k-orange px-1.5 py-0.5 text-[10px] font-bold leading-[14px] tracking-[0.4px] text-white">{sectionsTotal}</span>
            </button>
          </div>
        </div>
      )}

      <CategoriesSheet open={sheet === "categories"} onClose={() => setSheet(null)} nav={nav} current={current} onPick={jumpTo} dishTotal={shownCount} />

      <FiltersSheet
        open={sheet === "filters"}
        onClose={() => setSheet(null)}
        filters={filters}
        setFilters={setFilters}
        resultCount={(f) =>
          split.foods.filter((i) => FILTER_OPTIONS.every((o) => !f[o.key] || i.tags.includes(o.tag))).length
        }
      />
    </main>
  );
}

function Header({
  menu,
  location,
  setLocation,
  section,
  setSection,
  query,
  setQuery,
  searchRef,
  dishCount,
  filterCount,
  onFilters,
}: {
  menu: MenuData;
  location: Location;
  setLocation: (l: Location) => void;
  section: "foods" | "groceries";
  setSection: (s: "foods" | "groceries") => void;
  query: string;
  setQuery: (q: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  dishCount: number;
  filterCount: number;
  onFilters: () => void;
}) {
  const pickup = location.fulfilment === "pickup";
  const canDeliver = menu.delivery.deliveryEnabled && menu.zones.length > 0;
  const zone = menu.zones.find((z) => z.id === location.zoneId);
  const place = pickup ? "Pickup at Kayal" : (zone?.name ?? "Choose area");

  const setMode = (m: "delivery" | "pickup") =>
    setLocation(
      m === "pickup"
        ? { fulfilment: "pickup", zoneId: location.zoneId }
        : { fulfilment: "delivery", zoneId: zone?.id ?? menu.zones[0]?.id ?? "" },
    );

  const modes = [
    ...(canDeliver ? (["delivery"] as const) : []),
    ...(menu.delivery.pickupEnabled ? (["pickup"] as const) : []),
  ];

  return (
    <header className="flex flex-col gap-2.5 bg-k-bg px-4 pb-2.5 pt-2">
      {/* Logo | location · Delivery/Pickup */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <KayalLogo />
          <span className="h-4 w-[0.42px] shrink-0 bg-k-outline/40" aria-hidden="true" />
          <label className="relative flex min-w-0 items-center gap-1">
            <UiIcon name="pin" w={11.333} h={14.167} />
            <span className="truncate text-xs font-bold tracking-[0.24px] text-k-ink">{place}</span>
            {!pickup && canDeliver && (
              <>
                <UiIcon name="chevron-down" w={8} h={4.933} />
                <select
                  aria-label="Delivery area"
                  value={location.zoneId}
                  onChange={(e) => setLocation({ fulfilment: "delivery", zoneId: e.target.value })}
                  className="absolute inset-0 cursor-pointer opacity-0"
                >
                  {menu.zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </label>
        </div>
        {modes.length > 1 && (
          <div className="flex shrink-0 items-center rounded-full bg-k-tint p-0.5" role="radiogroup" aria-label="Delivery or pickup">
            {modes.map((m) => {
              const on = location.fulfilment === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setMode(m)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold leading-[14px] tracking-[0.4px] transition ${
                    on ? "bg-k-green text-white" : "text-k-text"
                  }`}
                >
                  {m === "delivery" ? "Delivery" : "Pickup"}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Foods | Groceries */}
      <div className="grid grid-cols-2 rounded-full bg-k-tint p-0.5" role="tablist" aria-label="Menu section">
        {(["foods", "groceries"] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={section === s}
            onClick={() => setSection(s)}
            className={`h-8 rounded-full text-xs font-semibold tracking-[0.24px] transition ${
              section === s ? "bg-k-green text-white" : "text-k-text"
            }`}
          >
            {s === "foods" ? "Foods" : "Groceries"}
          </button>
        ))}
      </div>

      {/* Search + single filter trigger */}
      <div className="flex items-center gap-2">
        <label className="relative flex h-10 min-w-0 flex-1 items-center rounded-full border border-[#6b7280] bg-k-tint focus-within:ring-2 focus-within:ring-k-green/30">
          <UiIcon name="search" w={14.25} h={14.25} className="absolute left-[16.38px]" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={section === "groceries" ? `Search ${dishCount} grocery items...` : `Search ${dishCount} Kerala dishes...`}
            aria-label="Search the menu"
            className="h-full w-full rounded-full bg-transparent pl-10 pr-4 text-[13px] text-k-ink placeholder:text-k-text/70 focus:outline-none"
          />
        </label>
        {section === "foods" && (
          <button
            type="button"
            onClick={onFilters}
            aria-label={filterCount ? `Filters, ${filterCount} on` : "Filters"}
            className={`flex h-10 shrink-0 items-center gap-1 rounded-full border px-[13px] text-xs font-medium tracking-[0.24px] text-k-text ${
              filterCount ? "border-k-green bg-k-green/10" : "border-k-outline/30 bg-k-tint"
            }`}
          >
            <UiIcon name="filter" w={13.5} h={13.5} />
            Filters
            {filterCount > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-k-green px-1 text-[10px] font-bold text-white">{filterCount}</span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}

function SpecialsStrip({
  items,
  cart,
  change,
  catName,
}: {
  items: MenuItem[];
  cart: Record<string, number>;
  change: (id: string, delta: number) => void;
  catName: (id: string) => string;
}) {
  return (
    <section id={sectionDomId(SPECIALS_ID)} className="flex flex-col gap-2 px-4 pt-3" aria-labelledby="specials-title">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h2 id="specials-title" className="text-xl font-bold leading-7 tracking-[-0.5px] text-k-ink">
            Today&apos;s Specials
          </h2>
          <span className="rounded-full bg-k-peach px-2 py-0.5 text-[10px] font-bold uppercase leading-[14px] tracking-[0.5px] text-k-peach-ink">
            Naadan
          </span>
        </div>
        <span className="text-xs font-semibold tracking-[0.24px] text-k-text">
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 py-1">
        {items.map((i) => {
          const badge = specialBadge(i);
          const qty = cart[i.id] ?? 0;
          return (
            <article
              key={i.id}
              className="flex w-[270px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-k-outline/20 bg-white p-px shadow-[0_2px_8px_-2px_rgba(17,24,39,0.06),0_1px_3px_0_rgba(15,81,50,0.04)]"
            >
              <div className="relative h-36 w-full overflow-hidden bg-k-tint">
                {i.image_url ? (
                  <Image src={i.image_url} alt={i.name} fill sizes="270px" className="object-cover" />
                ) : (
                  <span aria-hidden="true" className="absolute inset-0 grid place-items-center pb-6 text-5xl">
                    {categoryEmoji(i.category_id)}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,56,32,0.8)] via-[rgba(0,56,32,0)] via-50% to-[rgba(0,56,32,0)]" />
                {badge && (
                  <span
                    className={`absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold leading-[14px] tracking-[0.4px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${badge.className}`}
                  >
                    {badge.star && <span aria-hidden="true">★</span>}
                    {badge.label}
                  </span>
                )}
                <div className="absolute inset-x-2.5 bottom-2 flex items-center justify-between gap-2">
                  <span className="truncate rounded bg-k-green/80 px-2 py-0.5 text-[10px] font-semibold leading-[14px] tracking-[0.4px] text-white">
                    {catName(i.category_id)}
                  </span>
                  <span className="shrink-0 text-base font-bold leading-6 tracking-[-0.16px] text-k-mint">{money(i.price_cents)}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-1 p-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className="line-clamp-1 text-base font-semibold leading-6 tracking-[-0.16px] text-k-ink">{i.name}</h3>
                  {i.description && <p className="line-clamp-2 min-h-9 text-[13px] leading-[18px] text-k-text">{i.description}</p>}
                </div>
                <div className="flex items-center justify-between pt-1">
                  {i.tags.includes("spicy") ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold leading-[14px] tracking-[0.4px] text-k-text">
                      <UiIcon name="flame" w={10} h={11.875} />
                      Hot
                    </span>
                  ) : i.tags.includes("veg") ? (
                    <span className="text-[10px] font-bold leading-[14px] tracking-[0.4px] text-k-sea">Vegetarian</span>
                  ) : (
                    <span />
                  )}
                  <QtyPill solid qty={qty} label={i.name} onDec={() => change(i.id, -1)} onInc={() => change(i.id, 1)} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MenuSection({
  id,
  title,
  blurb,
  items,
  cart,
  change,
  unit = "Dishes",
}: {
  id: string;
  title: string;
  blurb: string | null;
  items: MenuItem[];
  cart: Record<string, number>;
  change: (id: string, delta: number) => void;
  unit?: string;
}) {
  return (
    <section id={sectionDomId(id)} className="flex flex-col gap-2 px-4 pt-4" aria-label={title}>
      <div className="flex items-start justify-between gap-3 border-b border-k-outline/15 pb-2">
        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-7 tracking-[-0.3px] text-k-ink">{title}</h2>
          {blurb && <p className="text-[13px] leading-[18px] text-k-text">{blurb}</p>}
        </div>
        <span className="mt-[9px] shrink-0 whitespace-nowrap rounded-full bg-k-tint px-2 py-0.5 text-[10px] font-medium leading-[14px] tracking-[0.4px] text-k-text">
          {items.length} {items.length === 1 ? unit.replace(/e?s$/, "") : unit}
        </span>
      </div>
      <ul className="grid gap-2 md:grid-cols-2">
        {items.map((i) => (
          <DishRow key={i.id} item={i} qty={cart[i.id] ?? 0} change={change} />
        ))}
      </ul>
    </section>
  );
}

function DishRow({ item, qty, change }: { item: MenuItem; qty: number; change: (id: string, delta: number) => void }) {
  const badge = dishBadge(item);
  return (
    <li className="flex items-center gap-3 rounded-xl border border-k-outline/20 bg-white p-[13px]">
      <div className="flex min-w-0 flex-1 flex-col pr-1">
        {badge && (
          <p className="flex items-center gap-1.5 pb-1">
            <span className={`size-2 shrink-0 rounded-full ${badge.dot}`} />
            <span className={`text-[10px] font-semibold leading-[14px] tracking-[0.4px] ${badge.text}`}>{badge.label}</span>
          </p>
        )}
        <h3 className="line-clamp-2 text-base font-semibold leading-6 tracking-[-0.16px] text-k-ink">{item.name}</h3>
        {item.description && <p className="line-clamp-2 pt-0.5 text-[13px] leading-[18px] text-k-text">{item.description}</p>}
        <p className="pt-2 text-base font-bold leading-6 tracking-[-0.16px] text-k-ink">{money(item.price_cents)}</p>
      </div>
      <div className="relative size-24 shrink-0">
        <div className="relative size-full overflow-hidden rounded-xl bg-k-tint">
          {item.image_url ? (
            <Image src={item.image_url} alt={item.name} fill sizes="96px" className="object-cover" />
          ) : (
            <span aria-hidden="true" className="grid size-full place-items-center pb-3 text-4xl">
              {categoryEmoji(item.category_id)}
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 -bottom-2 flex justify-center">
          <QtyPill qty={qty} label={item.name} onDec={() => change(item.id, -1)} onInc={() => change(item.id, 1)} />
        </div>
      </div>
    </li>
  );
}

function SheetHeader({ icon, title, subtitle, onClose }: { icon: React.ReactNode; title: string; subtitle: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-k-outline/15 bg-[rgba(241,243,255,0.6)] px-4 pb-[13px] pt-3">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-k-green text-white">{icon}</span>
        <div>
          <h3 className="text-base font-bold leading-6 tracking-[-0.16px] text-k-ink">{title}</h3>
          <p className="text-[10px] font-medium leading-[14px] tracking-[0.4px] text-k-text">{subtitle}</p>
        </div>
      </div>
      <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full bg-k-tint">
        <UiIcon name="close" w={11.667} h={11.667} />
      </button>
    </div>
  );
}

function CategoriesSheet({
  open,
  onClose,
  nav,
  current,
  onPick,
  dishTotal,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavEntry[];
  current: string;
  onPick: (id: string) => void;
  dishTotal: number;
}) {
  const [q, setQ] = useState("");
  const list = nav.filter((n) => n.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <Sheet open={open} onClose={onClose} label="Menu categories">
      <SheetHeader
        icon={<UiIcon name="sheet-menu" w={15} h={15} />}
        title="Menu Categories"
        subtitle={`${nav.length} sections • ${dishTotal} dishes total`}
        onClose={onClose}
      />
      <div className="border-b border-k-outline/15 bg-k-bg px-4 pb-[11px] pt-2.5">
        <label className="relative flex h-9 items-center rounded-full border border-[#6b7280] bg-k-tint">
          <UiIcon name="sheet-search" w={13.5} h={13.5} className="absolute left-[14.25px]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to category..."
            aria-label="Jump to category"
            className="h-full w-full rounded-full bg-transparent pl-9 pr-3 text-[13px] text-k-ink placeholder:text-k-text/70 focus:outline-none"
          />
        </label>
      </div>
      <ul className="flex flex-col gap-2 overflow-y-auto p-3">
        {list.map((n) => {
          const on = n.id === current;
          const icon = n.id === SPECIALS_ID ? SPECIALS_ICON : categoryIcon(n.id);
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => onPick(n.id)}
                aria-current={on ? "true" : undefined}
                className={`flex w-full items-center justify-between gap-3 rounded-xl text-left ${
                  on ? "bg-k-green p-3" : "border border-k-outline/20 bg-white p-[13px]"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className={`grid w-[18.333px] shrink-0 place-items-center ${on ? "text-k-mint" : "text-k-green"}`}>
                    <MaskIcon name={icon.name} w={icon.w} h={icon.h} />
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-sm font-semibold leading-[17.5px] tracking-[0.14px] ${on ? "text-white" : "text-k-ink"}`}>
                      {n.name}
                    </span>
                    {n.blurb && (
                      <span className={`block truncate text-[11px] leading-[16.5px] ${on ? "text-k-mint" : "text-k-text"}`}>{n.blurb}</span>
                    )}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] leading-[14px] tracking-[0.4px] ${
                      on ? "bg-k-orange font-bold text-white" : "bg-k-tint font-semibold text-k-text"
                    }`}
                  >
                    {n.count} item{n.count === 1 ? "" : "s"}
                  </span>
                  <UiIcon name={on ? "chevron-right-light" : "chevron-right"} w={5.55} h={9} />
                </span>
              </button>
            </li>
          );
        })}
        {list.length === 0 && <li className="p-6 text-center text-sm text-k-text">No section matches “{q}”.</li>}
      </ul>
    </Sheet>
  );
}

function FiltersSheet({
  open,
  onClose,
  filters,
  setFilters,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  resultCount: (f: Filters) => number;
}) {
  const n = resultCount(filters);
  return (
    <Sheet open={open} onClose={onClose} label="Filters">
      <SheetHeader
        icon={<MaskIcon name="filter" w={13.5} h={13.5} />}
        title="Filters"
        subtitle="Narrow the menu by dish type"
        onClose={onClose}
      />
      <ul className="flex flex-col gap-2 p-3">
        {FILTER_OPTIONS.map((o) => {
          const on = filters[o.key];
          return (
            <li key={o.key}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => setFilters({ ...filters, [o.key]: !on })}
                className="flex w-full items-center justify-between rounded-xl border border-k-outline/20 bg-white p-[13px] text-left"
              >
                <span className="text-sm font-semibold tracking-[0.14px] text-k-ink">{o.label}</span>
                <span className={`relative h-6 w-10 rounded-full transition ${on ? "bg-k-green" : "bg-k-tint"}`}>
                  <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex gap-2 px-3 pt-1">
        <button
          type="button"
          onClick={() => setFilters(NO_FILTERS)}
          className="h-12 rounded-full bg-k-tint px-5 text-sm font-semibold text-k-text"
        >
          Clear
        </button>
        <button type="button" onClick={onClose} className="h-12 flex-1 rounded-full bg-k-green text-sm font-bold text-white">
          Show {n} dish{n === 1 ? "" : "es"}
        </button>
      </div>
    </Sheet>
  );
}
