"use client";

import type { ReactNode } from "react";
import { money } from "@/lib/api";
import { MaskIcon, UiIcon } from "./menuKit";

export type Tab = "menu" | "search" | "orders" | "info";

/**
 * Bottom tab bar (Order / Explore / Orders / Info). When the basket has
 * items, a floating basket pill sits above it.
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
    <div className="fixed inset-x-0 bottom-0 z-30 font-jakarta">
      {count > 0 && (
        <div className="mx-auto max-w-md px-4 pb-3 md:max-w-lg">
          <button
            type="button"
            onClick={onCart}
            aria-label={`View basket, ${count} item${count === 1 ? "" : "s"}, ${money(subtotal)}`}
            className="animate-rise flex h-[58px] w-full items-center justify-between rounded-full bg-gradient-to-r from-k-deep to-k-green px-4 py-2.5 text-left drop-shadow-[0_8px_12px_rgba(15,81,50,0.4)] backdrop-blur-[6px]"
          >
            <span className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-k-orange text-xs font-extrabold tracking-[0.24px] text-white shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]">
                {count}
              </span>
              <span className="flex flex-col">
                <span className="text-base font-bold leading-6 tracking-[-0.16px] text-k-mint">{money(subtotal)}</span>
                {hint && <span className="text-[10px] font-bold leading-[14px] tracking-[0.4px] text-white/80">{hint}</span>}
              </span>
            </span>
            <span className="flex items-center gap-1 pl-2 text-xs font-bold tracking-[0.24px] text-white">
              View Basket
              <UiIcon name="arrow-right" w={12} h={12} />
            </span>
          </button>
        </div>
      )}
      <nav
        className="border-t border-k-outline/20 bg-k-bg/95 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_0_rgba(15,81,50,0.06)] backdrop-blur-[12px]"
        aria-label="Main"
      >
        <ul className="mx-auto grid h-14 max-w-md grid-cols-4 items-center px-2 md:max-w-lg">
          <NavItem label="Order" active={active === "menu"} onClick={() => onTab("menu")}>
            <MaskIcon name="nav-order" w={13.75} h={18.333} />
          </NavItem>
          <NavItem label="Explore" active={active === "search"} onClick={() => onTab("search")}>
            <MaskIcon name="nav-explore" w={16.5} h={16.5} />
          </NavItem>
          <NavItem label="Orders" active={active === "orders"} onClick={() => onTab("orders")}>
            <MaskIcon name="nav-orders" w={16.5} h={18.333} />
          </NavItem>
          <NavItem label="Info" active={active === "info"} onClick={() => onTab("info")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M12 11v5.5M12 7.5h.01" />
            </svg>
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
        aria-current={active ? "page" : undefined}
        className={`flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 px-2 py-[3px] text-[10px] font-bold leading-[14px] tracking-[0.4px] ${
          active ? "text-k-green" : "text-k-text"
        }`}
      >
        <span className="grid h-[18.333px] place-items-center">{children}</span>
        <span>{label}</span>
      </button>
    </li>
  );
}
