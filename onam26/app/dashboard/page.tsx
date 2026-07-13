"use client";

import { useEffect, useState } from "react";
import { fetchBookings, type Booking } from "@/lib/api";
import PasswordGate from "@/components/dashboard/PasswordGate";
import SummaryCounts from "@/components/dashboard/SummaryCounts";
import BookingsTable from "@/components/dashboard/BookingsTable";

export default function DashboardPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!unlocked) return;
    fetchBookings().then((result) => {
      if (result.ok) setBookings(result.bookings);
    });
  }, [unlocked]);

  if (!unlocked) {
    return <PasswordGate onUnlocked={() => setUnlocked(true)} />;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-semibold text-2xl text-leaf">Onam Sadhya 2026 — Bookings</h1>

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
        </div>
      )}
    </main>
  );
}
