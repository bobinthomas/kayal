"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMenu, money, type MenuData } from "@/lib/api";
import { orderHref, readRecentOrders, saveRecentOrder } from "@/lib/recentOrders";
import { computeTotals, type Location } from "@/lib/totals";
import BottomNav, { type Tab } from "./shop/BottomNav";
import CartView from "./shop/CartView";
import CheckoutView from "./shop/CheckoutView";
import InfoView from "./shop/InfoView";
import MenuHome from "./shop/MenuHome";
import OrdersView from "./shop/OrdersView";
import Splash from "./shop/Splash";

type View = "splash" | "menu" | "cart" | "checkout" | "orders" | "info";
const HASH_VIEWS: View[] = ["cart", "checkout", "orders", "info"];

const CART_KEY = "kayal-order-cart";
const LOCATION_KEY = "kayal-order-location";
const SPLASH_KEY = "kayal-order-splash-seen";

// Storage can be unavailable (private mode, blocked site data) — never let
// that break ordering.
function readJson<T>(store: Storage | undefined, key: string): T | null {
  try {
    const raw = store?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function writeJson(store: Storage | undefined, key: string, value: unknown) {
  try {
    store?.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const viewFromHash = (): View => {
  const h = window.location.hash.slice(1) as View;
  return HASH_VIEWS.includes(h) ? h : "menu";
};

export default function Shop() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [view, setViewState] = useState<View | null>(null);
  const [location, setLocationState] = useState<Location>({ fulfilment: "delivery", zoneId: "" });
  const [hasOrders, setHasOrders] = useState(false);
  const [focusSearch, setFocusSearch] = useState(0);

  // Restore session state after mount (static export: no window during prerender).
  useEffect(() => {
    const t = setTimeout(() => {
      const seen = readJson<boolean>(window.sessionStorage, SPLASH_KEY);
      const preview = new URLSearchParams(window.location.search).has("welcome");
      setViewState(seen && !preview ? viewFromHash() : "splash");
      const saved = readJson<Record<string, number>>(window.localStorage, CART_KEY);
      if (saved) setCart(saved);
      setHasOrders(readRecentOrders().length > 0);
    }, 0);
    fetchMenu().then((r) => {
      if (!r.ok) return setLoadError(r.error);
      setMenu(r);
      const saved = readJson<Location>(window.localStorage, LOCATION_KEY);
      const zoneOk = saved && r.zones.some((z) => z.id === saved.zoneId);
      const deliveryOk = r.delivery.deliveryEnabled && r.zones.length > 0;
      if (saved && saved.fulfilment === "pickup" && r.delivery.pickupEnabled) {
        setLocationState({ fulfilment: "pickup", zoneId: zoneOk ? saved.zoneId : (r.zones[0]?.id ?? "") });
      } else if (deliveryOk) {
        setLocationState({ fulfilment: "delivery", zoneId: zoneOk ? saved!.zoneId : r.zones[0].id });
      } else {
        setLocationState({ fulfilment: "pickup", zoneId: "" });
      }
    });
    const onPop = () => setViewState(viewFromHash());
    window.addEventListener("popstate", onPop);
    return () => {
      clearTimeout(t);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // Each screen gets a history entry so the phone's back button works.
  const go = useCallback((next: View) => {
    if (next !== "splash") window.history.pushState(null, "", next === "menu" ? "#" : `#${next}`);
    setViewState(next);
    window.scrollTo({ top: 0 });
  }, []);

  const enter = useCallback(
    (next: View) => {
      writeJson(window.sessionStorage, SPLASH_KEY, true);
      go(next);
    },
    [go],
  );

  const setLocation = useCallback((l: Location) => {
    setLocationState(l);
    writeJson(window.localStorage, LOCATION_KEY, l);
  }, []);

  const change = useCallback((id: string, delta: number) => {
    setCart((c) => {
      const qty = Math.max(0, Math.min(50, (c[id] ?? 0) + delta));
      const next = { ...c };
      if (qty === 0) delete next[id];
      else next[id] = qty;
      writeJson(window.localStorage, CART_KEY, next);
      return next;
    });
  }, []);

  // Drops cart entries for dishes no longer on the menu.
  const lines = useMemo(
    () => (menu ? menu.items.filter((i) => cart[i.id]).map((item) => ({ item, qty: cart[item.id] })) : []),
    [menu, cart],
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const totals = menu ? computeTotals(menu, lines, location) : null;

  // Wait for the menu so the welcome screen shows the admin's content, not a default.
  if (view === "splash" && menu) {
    return <Splash menu={menu} hasOrders={hasOrders} onStart={() => enter("menu")} onOrders={() => enter("orders")} />;
  }

  if (loadError) {
    return (
      <main className="grid min-h-dvh place-items-center bg-white px-6 text-center">
        <p className="text-night">
          Couldn&apos;t load the menu. Please refresh.
          <span className="mt-1 block text-sm text-muted">{loadError}</span>
        </p>
      </main>
    );
  }

  if (!menu || !totals || view === null) {
    return (
      <main className="grid min-h-dvh place-items-center bg-white">
        <p className="font-semibold text-muted">Loading menu…</p>
      </main>
    );
  }

  if (view === "cart") {
    return (
      <CartView
        lines={lines}
        totals={totals}
        location={location}
        change={change}
        onBack={() => go("menu")}
        onCheckout={() => go("checkout")}
      />
    );
  }

  if (view === "checkout" && lines.length > 0) {
    return (
      <CheckoutView
        menu={menu}
        lines={lines}
        location={location}
        setLocation={setLocation}
        onBack={() => go("cart")}
        onPlaced={(id, token, total) => {
          writeJson(window.localStorage, CART_KEY, {});
          saveRecentOrder({ id, token, total, placedAt: new Date().toISOString() });
          window.location.href = orderHref({ id, token });
        }}
      />
    );
  }

  const tab: Tab = view === "orders" ? "orders" : view === "info" ? "info" : "menu";
  const hint = totals.freeUnlocked
    ? "Free delivery unlocked"
    : totals.toFree > 0
      ? `Add ${money(totals.toFree)} for free delivery`
      : "";

  return (
    <>
      {view === "orders" ? (
        <OrdersView />
      ) : view === "info" ? (
        <InfoView menu={menu} />
      ) : (
        <MenuHome
          menu={menu}
          cart={cart}
          change={change}
          location={location}
          setLocation={setLocation}
          focusSearch={focusSearch}
          basketVisible={count > 0}
        />
      )}
      <BottomNav
        active={tab}
        count={count}
        subtotal={totals.subtotal}
        hint={hint}
        onCart={() => go("cart")}
        onTab={(t) => {
          if (t === "search") {
            if (view !== "menu") go("menu");
            setFocusSearch((n) => n + 1);
            return;
          }
          go(t);
        }}
      />
    </>
  );
}
