"use client";

import { useCallback, useSyncExternalStore } from "react";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "kayal-booking-banner-dismissed";
const CHANGE_EVENT = "kayal:booking-banner";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getDismissed(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Dismissible booking reminder — matches the old site's sticky red bar. */
export default function BookingBanner() {
  const dismissed = useSyncExternalStore(subscribe, getDismissed, () => false);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      /* ignore */
    }
  }, []);

  if (dismissed) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="booking-banner fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-[45] md:bottom-0"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 bg-chilli px-4 py-3 text-cream shadow-lg shadow-black/25 sm:px-6 md:rounded-none">
        <p className="flex-1 text-center text-sm leading-snug sm:text-[15px]">
          Dine-in is by booking only — please call{" "}
          <a
            href={`tel:${restaurant.phone.tel}`}
            onClick={() => track("call_tap", { placement: "booking_banner" })}
            className="font-semibold underline underline-offset-2 hover:text-turmeric"
          >
            {restaurant.phone.display}
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-banana-dark/30 text-cream transition-colors hover:bg-banana-dark/50"
          aria-label="Dismiss booking reminder"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3 3l8 8M11 3L3 11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
