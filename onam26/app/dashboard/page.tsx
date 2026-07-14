"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchBookings, fetchEvents, type AnalyticsEvent, type Booking } from "@/lib/api";
import PasswordGate from "@/components/dashboard/PasswordGate";
import SummaryCounts from "@/components/dashboard/SummaryCounts";
import BookingsTable from "@/components/dashboard/BookingsTable";
import AnalyticsSummary from "@/components/dashboard/AnalyticsSummary";

export default function DashboardPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[] | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  function handleUnlocked() {
    setUnlocked(true);
    fetchBookings().then((result) => {
      if (result.ok) setBookings(result.bookings);
    });
  }

  function toggleAnalytics() {
    const next = !showAnalytics;
    setShowAnalytics(next);
    if (next && events === null) {
      setEventsLoading(true);
      fetchEvents().then((result) => {
        if (result.ok) setEvents(result.events);
        setEventsLoading(false);
      });
    }
  }

  if (!unlocked) {
    return <PasswordGate onUnlocked={handleUnlocked} />;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl text-leaf">Onam Sadhya 2026 — Bookings</h1>
        <Link href="/kitchen/" className="text-sm font-semibold text-leaf hover:underline">
          Kitchen view →
        </Link>
      </div>

      {bookings === null && <p className="mt-6 text-ink/60">Loading…</p>}

      {bookings !== null && (
        <div className="mt-6 space-y-6">
          <SummaryCounts bookings={bookings} />
          <BookingsTable
            bookings={bookings}
            onStatusChange={(id, status) =>
              setBookings((prev) =>
                prev ? prev.map((b) => (b.id === id ? { ...b, status } : b)) : prev,
              )
            }
          />

          <div className="border-t border-leaf/10 pt-6">
            <button
              type="button"
              onClick={toggleAnalytics}
              className="flex items-center gap-2 text-sm font-semibold text-leaf hover:underline"
            >
              <span className={`inline-block transition-transform ${showAnalytics ? "rotate-90" : ""}`}>
                ▸
              </span>
              {showAnalytics ? "Hide" : "Show"} clicks &amp; drop-offs
            </button>

            {showAnalytics && (
              <div className="mt-4">
                {eventsLoading && <p className="text-ink/60">Loading…</p>}
                {events !== null && <AnalyticsSummary events={events} />}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
