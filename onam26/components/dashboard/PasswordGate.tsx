"use client";

import { useEffect, useState, type FormEvent } from "react";
import { DASHBOARD_PASSWORD_KEY, fetchBookings } from "@/lib/api";

function hasStoredPassword(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(sessionStorage.getItem(DASHBOARD_PASSWORD_KEY));
}

export default function PasswordGate({
  onUnlocked,
}: {
  onUnlocked: () => void;
}) {
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(hasStoredPassword);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checking) return;
    fetchBookings().then((result) => {
      if (result.ok) {
        onUnlocked();
      } else {
        sessionStorage.removeItem(DASHBOARD_PASSWORD_KEY);
        setChecking(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    sessionStorage.setItem(DASHBOARD_PASSWORD_KEY, password);
    const result = await fetchBookings();
    setChecking(false);
    if (result.ok) {
      onUnlocked();
    } else {
      sessionStorage.removeItem(DASHBOARD_PASSWORD_KEY);
      setError("Incorrect password.");
    }
  }

  if (checking) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24">
        <p className="text-ink/60">Checking…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-semibold text-2xl text-leaf">Onam bookings dashboard</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Dashboard password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-leaf/25 bg-white px-4 py-3"
          autoFocus
        />
        {error && <p className="text-sm font-medium text-chilli">{error}</p>}
        <button
          type="submit"
          disabled={checking || !password}
          className="inline-flex min-h-12 items-center rounded-full bg-leaf px-8 font-semibold text-cream hover:bg-banana-dark disabled:opacity-60"
        >
          {checking ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
