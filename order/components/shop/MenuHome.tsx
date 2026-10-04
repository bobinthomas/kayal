"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { money, type MenuData, type MenuItem } from "@/lib/api";
import type { Location } from "@/lib/totals";
import PopularCarousel from "./PopularCarousel";
import { AddButton, Icon, Pill, SquarePhoto, Stepper } from "./ui";

export default function MenuHome({
  menu,
  cart,
  change,
  location,
  setLocation,
  focusSearch,
}: {
  menu: MenuData;
  cart: Record<string, number>;
  change: (id: string, delta: number) => void;
  location: Location;
  setLocation: (l: Location) => void;
  /** Bumped by the bottom bar's Search tab to focus the search box. */
  focusSearch: number;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [vegOnly, setVegOnly] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (focusSearch) searchRef.current?.focus();
  }, [focusSearch]);

  const catName = (id: string) => menu.categories.find((c) => c.id === id)?.name ?? "";
  const categories = menu.categories.filter((c) => menu.items.some((i) => i.category_id === c.id));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.items.filter(
      (i) =>
        (category === "all" || i.category_id === category) &&
        (!vegOnly || i.tags.includes("veg")) &&
        (!q || i.name.toLowerCase().includes(q) || (i.description ?? "").toLowerCase().includes(q)),
    );
  }, [menu.items, query, category, vegOnly]);

  // "Popular" carousel: signature dishes first, then dishes with a photo,
  // topped up from the rest of the menu so it always has a few slides.
  const popular = useMemo(() => {
    const sig = menu.items.filter((i) => i.tags.includes("signature"));
    const withPhoto = menu.items.filter((i) => i.image_url && !sig.includes(i));
    const rest = menu.items.filter((i) => !sig.includes(i) && !withPhoto.includes(i));
    return [...sig, ...withPhoto, ...rest].slice(0, 6);
  }, [menu.items]);

  const browsing = !query && category === "all" && !vegOnly;
  const locValue = location.fulfilment === "pickup" ? "pickup" : location.zoneId;

  return (
    <main className="min-h-dvh overflow-x-clip bg-white pb-44">
      <div className="mx-auto max-w-md px-5 pt-1 md:max-w-5xl">
        {/* Location */}
        <label className="block">
          <span className="text-xs text-muted">{location.fulfilment === "pickup" ? "Collecting from" : "Deliver to"}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[15px] font-semibold text-night">
            <span className="text-brand">{Icon.pin}</span>
            <span className="relative inline-flex items-center">
              <select
                value={locValue}
                onChange={(e) =>
                  setLocation(
                    e.target.value === "pickup"
                      ? { fulfilment: "pickup", zoneId: location.zoneId }
                      : { fulfilment: "delivery", zoneId: e.target.value },
                  )
                }
                className="cursor-pointer appearance-none bg-transparent pr-6 focus:outline-none"
              >
                {menu.delivery.deliveryEnabled &&
                  menu.zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                {menu.delivery.pickupEnabled && <option value="pickup">Pickup from Kayal</option>}
              </select>
              <span className="pointer-events-none absolute right-0">{Icon.chevron}</span>
            </span>
          </span>
        </label>

        {/* Search + veg filter */}
        <div className="mt-3 flex items-center gap-2">
          <label className="flex h-10 flex-1 items-center gap-2 rounded-full bg-surface px-4 text-muted focus-within:ring-2 focus-within:ring-brand/30">
            {Icon.search}
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-sm text-night placeholder:text-muted focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setVegOnly((v) => !v)}
            aria-pressed={vegOnly}
            className={`flex h-10 items-center gap-1 rounded-full px-3 text-xs font-semibold transition ${
              vegOnly ? "bg-brand text-white" : "bg-surface text-night/70"
            }`}
          >
            {Icon.leaf}
            <span className="hidden sm:inline">Veg</span>
          </button>
        </div>

        {/* Category pills */}
        <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          <Pill active={category === "all"} onClick={() => setCategory("all")}>
            All
          </Pill>
          {categories.map((c) => (
            <Pill key={c.id} active={category === c.id} onClick={() => setCategory(category === c.id ? "all" : c.id)}>
              {c.name.replace(/^Main Course /, "")}
            </Pill>
          ))}
        </div>

        {menu.items.length === 0 && (
          <p className="mt-10 rounded-3xl bg-surface p-8 text-center text-muted">
            Our menu is being updated — please check back soon.
          </p>
        )}

        {/* Popular */}
        {browsing && popular.length > 0 && (
          <section className="mt-7">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-night">Popular Dishes</h2>
              <button
                type="button"
                onClick={() => listRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm font-semibold text-brand"
              >
                View All
              </button>
            </div>
            <PopularCarousel items={popular} cart={cart} catName={catName} onAdd={(id) => change(id, 1)} />
          </section>
        )}

        {/* Full menu */}
        <section ref={listRef} className="mt-7 scroll-mt-4">
          <h2 className="text-lg font-bold text-night">
            {browsing ? "Full Menu" : `${filtered.length} dish${filtered.length === 1 ? "" : "es"}`}
          </h2>
          {!browsing && filtered.length === 0 && (
            <p className="mt-3 rounded-3xl bg-surface p-6 text-center text-muted">Nothing matches — try another search.</p>
          )}
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((i) => (
              <DishCard key={i.id} item={i} qty={cart[i.id] ?? 0} change={change} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

/** 2-across menu tile: short photo strip, readable name and price, add / stepper. */
function DishCard({
  item,
  qty,
  change,
}: {
  item: MenuItem;
  qty: number;
  change: (id: string, delta: number) => void;
}) {
  const veg = item.tags.includes("veg");
  const spicy = item.tags.includes("spicy");
  return (
    <li className="flex min-w-0 flex-col rounded-2xl bg-surface p-2">
      <SquarePhoto src={item.image_url} categoryId={item.category_id} alt={item.name} />
      <div className="flex flex-1 flex-col px-1 pt-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-night">{item.name}</h3>
        {(veg || spicy) && (
          <p className="mt-0.5 flex gap-2 text-xs font-medium">
            {veg && <span className="text-brand">● Veg</span>}
            {spicy && <span className="text-chilli">🌶 Spicy</span>}
          </p>
        )}
        <div className="mt-auto pt-2">
          {qty > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[15px] font-bold text-night">{money(item.price_cents)}</p>
              <Stepper full dark qty={qty} label={item.name} onDec={() => change(item.id, -1)} onInc={() => change(item.id, 1)} />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="text-[15px] font-bold text-night">{money(item.price_cents)}</p>
              <AddButton label={item.name} onClick={() => change(item.id, 1)} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
