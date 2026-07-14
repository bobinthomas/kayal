import { formatCents, formatTimeSlot, onamEvent, packageSizes } from "@/data/onam-event";
import type { Booking } from "@/lib/api";

const SESSION_LABEL: Record<"lunch" | "dinner", string> = { lunch: "Lunch", dinner: "Dinner" };

function sessionForSlot(timeSlot: string): "lunch" | "dinner" {
  return (onamEvent.dineInLunchTimeSlots as readonly string[]).includes(timeSlot)
    ? "lunch"
    : "dinner";
}

function BookingRow({ booking }: { booking: Booking }) {
  const count = booking.service_type === "dine_in" ? booking.guests : booking.package_size;
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink/10 py-2 last:border-0">
      <span className="font-medium text-ink">{booking.customer_name}</span>
      <span className="text-ink/70">
        {count} {booking.service_type === "dine_in" ? "guests" : "people"}
        <span className="text-ink/40"> · {booking.customer_phone}</span>
        <span className="text-ink/40">
          {" "}
          · {booking.payment_method === "whatsapp_cash" ? "WhatsApp cash" : "Card"}
        </span>
      </span>
      {booking.notes && <span className="w-full text-sm italic text-chilli">Note: {booking.notes}</span>}
    </li>
  );
}

function Section({
  title,
  bookings,
  countLabel,
}: {
  title: string;
  bookings: Booking[];
  countLabel: string;
}) {
  const total = bookings.reduce(
    (sum, b) => sum + (b.service_type === "dine_in" ? b.guests || 0 : b.package_size || 0),
    0,
  );
  return (
    <div className="rounded-xl border border-leaf/15 bg-white p-4 print:rounded-none print:border-ink/30">
      <div className="flex items-baseline justify-between">
        <h4 className="font-semibold text-leaf print:text-ink">{title}</h4>
        <p className="text-sm font-semibold text-clay print:text-ink">
          {bookings.length} bookings · {total} {countLabel}
        </p>
      </div>
      <ul className="mt-3">
        {bookings.map((b) => (
          <BookingRow key={b.id} booking={b} />
        ))}
      </ul>
    </div>
  );
}

function Category({
  title,
  totalBookings,
  totalCount,
  countLabel,
  children,
}: {
  title: string;
  totalBookings: number;
  totalCount: number;
  countLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-leaf/25 bg-cream/40 p-5 print:rounded-none print:border-ink">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-xl text-leaf print:text-ink">{title}</h3>
        <p className="text-sm font-semibold text-ink/70">
          {totalBookings} bookings · {totalCount} {countLabel}
        </p>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

export default function KitchenDayView({ bookings }: { bookings: Booking[] }) {
  const dineIn = bookings.filter((b) => b.service_type === "dine_in");
  const takeaway = bookings.filter((b) => b.service_type === "takeaway");

  const slots = [...new Set(dineIn.map((b) => b.time_slot!))].sort();
  const bySlot = slots.map((slot) => ({
    slot,
    session: sessionForSlot(slot),
    bookings: dineIn.filter((b) => b.time_slot === slot),
  }));

  const byPackage = packageSizes
    .map((size) => ({ size, bookings: takeaway.filter((b) => b.package_size === size) }))
    .filter((group) => group.bookings.length > 0);

  const dineInTotal = dineIn.reduce((sum, b) => sum + (b.guests || 0), 0);
  const takeawayTotal = takeaway.reduce((sum, b) => sum + (b.package_size || 0), 0);
  const totalPrice = bookings.reduce((sum, b) => sum + b.price_total, 0);

  if (bookings.length === 0) {
    return <p className="text-ink/50">No confirmed bookings for this date yet.</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-ink/70">
        {bookings.length} confirmed bookings · {dineInTotal + takeawayTotal} people total ·{" "}
        {formatCents(totalPrice)}
      </p>

      {dineIn.length > 0 && (
        <Category title="Dine-in" totalBookings={dineIn.length} totalCount={dineInTotal} countLabel="guests">
          {bySlot.map(({ slot, session, bookings: slotBookings }) => (
            <Section
              key={slot}
              title={`${SESSION_LABEL[session]} — ${formatTimeSlot(slot)}`}
              bookings={slotBookings}
              countLabel="guests"
            />
          ))}
        </Category>
      )}

      {takeaway.length > 0 && (
        <Category
          title="Takeaway"
          totalBookings={takeaway.length}
          totalCount={takeawayTotal}
          countLabel="people"
        >
          {byPackage.map(({ size, bookings: sizeBookings }) => (
            <Section
              key={size}
              title={`${size}-person package`}
              bookings={sizeBookings}
              countLabel="people"
            />
          ))}
        </Category>
      )}
    </div>
  );
}
