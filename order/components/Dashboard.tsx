"use client";

import { useEffect, useState, type FormEvent } from "react";
import DeliveryManager from "@/components/DeliveryManager";
import MenuManager from "@/components/MenuManager";
import OrdersBoard from "@/components/OrdersBoard";
import SettingsManager from "@/components/SettingsManager";
import { DASHBOARD_PASSWORD_KEY, fetchAdminOrders } from "@/lib/api";

export default function Dashboard() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <Gate onUnlocked={() => setUnlocked(true)} />;
  return <Tabs />;
}

const TABS = [
  { key: "orders", label: "Orders" },
  { key: "menu", label: "Menu" },
  { key: "delivery", label: "Delivery" },
  { key: "settings", label: "Settings" },
] as const;

function Tabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("orders");
  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 pt-4">
          <p className="text-sm font-bold text-night">
            Kayal <span className="font-medium text-muted">admin</span>
          </p>
        </div>
        <nav className="no-scrollbar mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 pb-3 pt-3" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={`h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                tab === t.key ? "bg-night text-white" : "text-night/60 hover:bg-surface"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-5">
        {tab === "orders" && <OrdersBoard />}
        {tab === "menu" && <MenuManager />}
        {tab === "delivery" && <DeliveryManager />}
        {tab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
}

function Gate({ onUnlocked }: { onUnlocked: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem(DASHBOARD_PASSWORD_KEY)) return;
    fetchAdminOrders().then((r) => {
      if (r.ok) onUnlocked();
      else sessionStorage.removeItem(DASHBOARD_PASSWORD_KEY);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    sessionStorage.setItem(DASHBOARD_PASSWORD_KEY, password);
    const r = await fetchAdminOrders();
    setBusy(false);
    if (r.ok) onUnlocked();
    else {
      sessionStorage.removeItem(DASHBOARD_PASSWORD_KEY);
      setError("Incorrect password.");
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-white px-5">
      <div className="w-full max-w-sm">
        <p className="text-sm font-bold text-night">
          Kayal <span className="font-medium text-muted">admin</span>
        </p>
        <h1 className="mt-2 text-2xl font-bold text-night">Sign in</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Dashboard password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-2xl bg-surface px-4 text-night placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30"
            autoFocus
          />
          {error && <p className="text-sm font-medium text-chilli">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="h-12 w-full rounded-full bg-brand font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
