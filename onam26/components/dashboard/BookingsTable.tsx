"use client";

import { useMemo, useState } from "react";
import { formatCents, formatEventDate, formatTimeSlot } from "@/data/onam-event";
import { openReceipt, updateBookingStatus, type Booking } from "@/lib/api";

type StatusFilter = "all" | "pending" | "confirmed" | "declined";
type ServiceFilter = "all" | "dine_in" | "takeaway";

// 'YYYY-MM-DD' in Sydney local time, used to group/filter by booked-on date.
function bookedDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
}

function formatBookedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-AU", {
    timeZone: "Australia/Sydney",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatBookedDateOption(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function BookingsTable({
  bookings,
  onStatusChange,
}: {
  bookings: Booking[];
  onStatusChange: (id: string, status: "confirmed" | "declined") => void;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [bookedDateFilter, setBookedDateFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const bookedDateOptions = useMemo(
    () => [...new Set(bookings.map((b) => bookedDateKey(b.created_at)))].sort().reverse(),
    [bookings],
  );

  const filtered = useMemo(
    () =>
      bookings.filter(
        (b) =>
          (statusFilter === "all" || b.status === statusFilter) &&
          (serviceFilter === "all" || b.service_type === serviceFilter) &&
          (bookedDateFilter === "all" || bookedDateKey(b.created_at) === bookedDateFilter),
      ),
    [bookings, statusFilter, serviceFilter, bookedDateFilter],
  );

  async function handleAction(id: string, status: "confirmed" | "declined") {
    setUpdatingId(id);
    const ok = await updateBookingStatus(id, status);
    setUpdatingId(null);
    if (ok) onStatusChange(id, status);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-leaf/25 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="declined">Declined</option>
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value as ServiceFilter)}
          className="rounded-lg border border-leaf/25 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All services</option>
          <option value="dine_in">Dine-in</option>
          <option value="takeaway">Takeaway</option>
        </select>
        <select
          value={bookedDateFilter}
          onChange={(e) => setBookedDateFilter(e.target.value)}
          className="rounded-lg border border-leaf/25 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All booked dates</option>
          {bookedDateOptions.map((dateKey) => (
            <option key={dateKey} value={dateKey}>
              Booked {formatBookedDateOption(dateKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-leaf/15 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-leaf/10 text-xs font-semibold uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Event date</th>
              <th className="px-4 py-3">Booked on</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Proof</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-leaf/10 last:border-0">
                <td className="px-4 py-3">
                  {formatEventDate(b.event_date)}
                  {b.time_slot && <span className="text-ink/60"> · {formatTimeSlot(b.time_slot)}</span>}
                </td>
                <td className="px-4 py-3 text-ink/70">{formatBookedAt(b.created_at)}</td>
                <td className="px-4 py-3">{b.service_type === "dine_in" ? "Dine-in" : "Takeaway"}</td>
                <td className="px-4 py-3">
                  {b.service_type === "dine_in" ? `${b.guests} guests` : `${b.package_size} people`}
                </td>
                <td className="px-4 py-3">
                  {b.payment_method === "whatsapp_cash" ? "WhatsApp Special" : "Card"}
                </td>
                <td className="px-4 py-3 font-semibold text-clay">{formatCents(b.price_total)}</td>
                <td className="px-4 py-3">
                  {b.receipt_key && (
                    <button
                      type="button"
                      onClick={() => openReceipt(b.id)}
                      className="text-sm font-semibold text-leaf hover:underline"
                    >
                      View receipt
                    </button>
                  )}
                  {!b.receipt_key && b.payment_reference && (
                    <span className="text-sm text-ink/70">Ref: {b.payment_reference}</span>
                  )}
                  {!b.receipt_key && !b.payment_reference && <span className="text-ink/40">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div>{b.customer_name}</div>
                  <div className="text-ink/60">{b.customer_phone}</div>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={b.status} />
                </td>
                <td className="px-4 py-3">
                  {b.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={updatingId === b.id}
                        onClick={() => handleAction(b.id, "confirmed")}
                        className="rounded-full bg-curryleaf px-3 py-1.5 text-xs font-semibold text-white hover:bg-leaf disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === b.id}
                        onClick={() => handleAction(b.id, "declined")}
                        className="rounded-full bg-chilli px-3 py-1.5 text-xs font-semibold text-white hover:bg-clay disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-ink/50">
                  No bookings match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    pending: "bg-turmeric/20 text-turmeric",
    confirmed: "bg-curryleaf/20 text-curryleaf",
    declined: "bg-chilli/20 text-chilli",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
