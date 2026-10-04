"use client";

import type { ReactNode } from "react";
import { money } from "@/lib/api";
import { Icon } from "./ui";

export type Tab = "menu" | "search" | "orders" | "info";

/**
 * Flat bottom tab bar with a black centre cart button (reference style).
 * When the cart has items, a slim green summary bar sits above it.
 */
export default function BottomNav({
  active,
  count,
  subtotal,
  hint,
  onTab,
  onCart,
}: {
  active: Tab;
  count: number;
  subtotal: number;
  hint: string;
  onTab: (t: Tab) => void;
  onCart: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30">
      {count > 0 && (
        <div className="mx-auto max-w-md px-4 pb-2 md:max-w-lg">
          <button
            type="button"
            onClick={onCart}
            className="animate-rise flex h-14 w-full items-center justify-between rounded-2xl bg-brand px-5 text-white"
          >
            <span className="text-left leading-tight">
              <span className="block text-sm font-semibold">
                {count} item{count === 1 ? "" : "s"} · {money(subtotal)}
              </span>
              {hint && <span className="block text-[11px] text-white/80">{hint}</span>}
            </span>
            <span className="text-sm font-semibold">View cart →</span>
          </button>
        </div>
      )}
      <nav className="border-t border-line bg-white pb-[env(safe-area-inset-bottom)]" aria-label="Main">
        <ul className="mx-auto grid h-16 max-w-md grid-cols-5 items-center md:max-w-lg">
          <NavItem label="Home" active={active === "menu"} onClick={() => onTab("menu")}>
            {Icon.home}
          </NavItem>
          <NavItem label="Search" active={active === "search"} onClick={() => onTab("search")}>
            {Icon.search}
          </NavItem>
          <li className="flex justify-center">
            <button
              type="button"
              onClick={onCart}
              aria-label={`Cart, ${count} items`}
              className="relative -mt-7 grid h-14 w-14 place-items-center rounded-2xl bg-night text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] active:scale-95"
            >
              {Icon.bag}
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold">
                  {count}
                </span>
              )}
            </button>
          </li>
          <NavItem label="Orders" active={active === "orders"} onClick={() => onTab("orders")}>
            {Icon.receipt}
          </NavItem>
          <NavItem label="Info" active={active === "info"} onClick={() => onTab("info")}>
            {Icon.info}
          </NavItem>
        </ul>
      </nav>
    </div>
  );
}

function NavItem({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <li className="flex justify-center">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${active ? "text-brand" : "text-night/50"}`}
      >
        {children}
        <span>{label}</span>
      </button>
    </li>
  );
}
