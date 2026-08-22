"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ADMIN_PASSWORD_KEY, checkSession } from "./adminApi";
import HeroEditor from "./HeroEditor";
import ShowcaseEditor from "./ShowcaseEditor";
import MenuEditor from "./MenuEditor";
import MenuMetaEditor from "./MenuMetaEditor";
import SpecialsEditor from "./SpecialsEditor";
import RestaurantEditor from "./RestaurantEditor";
import ReviewsEditor from "./ReviewsEditor";
import CopyEditor from "./CopyEditor";
import PopupEditor from "./PopupEditor";
import TrackingEditor from "./TrackingEditor";

const TABS = [
  { id: "hero", label: "Home hero" },
  { id: "showcase", label: "Dish photos" },
  { id: "menu", label: "Menu" },
  { id: "menu-meta", label: "Menu page" },
  { id: "specials", label: "Featured specials" },
  { id: "restaurant", label: "Restaurant info" },
  { id: "reviews", label: "Reviews" },
  { id: "copy", label: "Site copy" },
  { id: "popup", label: "Homepage popup" },
  { id: "tracking", label: "Tracking" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function PasswordGate({ onUnlocked }: { onUnlocked: (password: string) => void }) {
  const [password, setPassword] = useState("");
  // Starts false unconditionally (matching the static-export prerendered
  // HTML, which never sees sessionStorage) — checking a stored password is
  // deferred to the effect below so hydration never observes a mismatch
  // between the build-time render and a browser that already has one.
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
    if (!stored) return;
    checkSession(stored).then((ok) => {
      if (ok) {
        onUnlocked(stored);
      } else {
        sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    const ok = await checkSession(password);
    setChecking(false);
    if (ok) {
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
      onUnlocked(password);
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-semibold text-neutral-900">Kayal Foods admin</h1>
      {checking ? (
        <p className="mt-6 text-neutral-500">Checking…</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-xl border border-neutral-300 px-4 py-3"
          />
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={!password}
            className="inline-flex min-h-12 items-center rounded-full bg-emerald-800 px-8 font-semibold text-white disabled:opacity-60"
          >
            Enter
          </button>
        </form>
      )}
    </div>
  );
}

export default function AdminApp() {
  const [password, setPassword] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("menu");

  const handleUnauthorized = useCallback(() => {
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
    setPassword(null);
  }, []);

  if (!password) {
    return <PasswordGate onUnlocked={setPassword} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 bg-white px-4 py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
              tab === t.id ? "bg-emerald-800 text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleUnauthorized}
          className="ml-auto whitespace-nowrap px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-700"
        >
          Log out
        </button>
      </nav>

      {tab === "hero" && <HeroEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "showcase" && <ShowcaseEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "menu" && <MenuEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "menu-meta" && <MenuMetaEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "specials" && <SpecialsEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "restaurant" && <RestaurantEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "reviews" && <ReviewsEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "copy" && <CopyEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "popup" && <PopupEditor password={password} onUnauthorized={handleUnauthorized} />}
      {tab === "tracking" && <TrackingEditor password={password} onUnauthorized={handleUnauthorized} />}
    </div>
  );
}
