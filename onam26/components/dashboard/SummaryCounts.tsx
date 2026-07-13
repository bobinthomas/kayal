import { formatEventDate } from "@/data/onam-event";
import type { Booking } from "@/lib/api";

export default function SummaryCounts({ bookings }: { bookings: Booking[] }) {
  const byStatus = { pending: 0, confirmed: 0, declined: 0 };
  const coversByDate = new Map<string, number>();

  for (const b of bookings) {
    byStatus[b.status]++;
    const covers = b.service_type === "dine_in" ? b.guests || 0 : b.package_size || 0;
    coversByDate.set(b.event_date, (coversByDate.get(b.event_date) || 0) + covers);
  }

  const sortedDates = [...coversByDate.keys()].sort();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-leaf/15 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">By status</p>
        <div className="mt-2 flex gap-4 text-sm">
          <span className="font-semibold text-turmeric">{byStatus.pending} pending</span>
          <span className="font-semibold text-curryleaf">{byStatus.confirmed} confirmed</span>
          <span className="font-semibold text-chilli">{byStatus.declined} declined</span>
        </div>
      </div>
      <div className="rounded-2xl border border-leaf/15 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Covers by date</p>
        <div className="mt-2 space-y-1 text-sm">
          {sortedDates.length === 0 && <p className="text-ink/50">No bookings yet.</p>}
          {sortedDates.map((date) => (
            <div key={date} className="flex justify-between">
              <span>{formatEventDate(date)}</span>
              <span className="font-semibold">{coversByDate.get(date)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
