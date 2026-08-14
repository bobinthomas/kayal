"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchBookings, type Booking } from "@/lib/api";
import { allEventDates, formatEventDate, nextEventDate } from "@/data/onam-event";
import PasswordGate from "@/components/dashboard/PasswordGate";
import KitchenDayView from "@/components/kitchen/KitchenDayView";

export default function KitchenPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => nextEventDate());

  useEffect(() => {
    if (!unlocked) return;
    fetchBookings().then((result) => {
      if (result.ok) setBookings(result.bookings);
    });
  }, [unlocked]);

  // Union with actual booking dates so a date removed from the event config
  // (e.g. a takeaway day pulled after bookings were already taken) doesn't
  // strand existing bookings with no way to select their day here.
  const dates = useMemo(() => {
    const bookedDates = (bookings ?? []).map((b) => b.event_date);
    return [...new Set([...allEventDates(), ...bookedDates])].sort();
  }, [bookings]);

  const dayBookings = useMemo(
    () =>
      (bookings ?? []).filter((b) => b.event_date === selectedDate && b.status === "confirmed"),
    [bookings, selectedDate],
  );

  if (!unlocked) {
    return <PasswordGate onUnlocked={() => setUnlocked(true)} />;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="font-semibold text-2xl text-leaf">Kitchen prep — Onam Sadhya 2026</h1>
        <Link href="/dashboard/" className="text-sm font-semibold text-leaf hover:underline">
          Bookings dashboard →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap gap-2">
          {dates.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                date === selectedDate
                  ? "bg-leaf text-cream"
                  : "border border-leaf/25 bg-white text-leaf hover:border-leaf"
              }`}
            >
              {formatEventDate(date)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full border border-leaf/25 bg-white px-4 py-2 text-sm font-semibold text-leaf hover:border-leaf"
        >
          Print
        </button>
      </div>

      <h2 className="mt-6 font-semibold text-xl text-ink print:mt-0">
        {formatEventDate(selectedDate)}
      </h2>

      <div className="mt-4">
        {bookings === null ? (
          <p className="text-ink/60">Loading…</p>
        ) : (
          <KitchenDayView bookings={dayBookings} />
        )}
      </div>
    </main>
  );
}
