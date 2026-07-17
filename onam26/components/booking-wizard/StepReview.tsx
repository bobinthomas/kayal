import {
  computePriceCents,
  formatCents,
  formatEventDate,
  formatTimeSlot,
} from "@/data/onam-event";
import type { WizardState } from "./types";

type EditableStep = "service" | "date" | "timeslot" | "details" | "contact";

export default function StepReview({
  state,
  onEdit,
  onContinue,
}: {
  state: WizardState;
  onEdit: (step: EditableStep) => void;
  onContinue: () => void;
}) {
  const price = computePriceCents({
    serviceType: state.serviceType!,
    guests: state.guests,
    packageSize: state.packageSize ?? undefined,
    paymentMethod: state.paymentMethod!,
  });

  const row = (label: string, value: string, step: EditableStep) => (
    <div className="flex items-center justify-between border-b border-leaf/10 py-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</p>
        <p className="font-medium text-ink">{value}</p>
      </div>
      <button type="button" onClick={() => onEdit(step)} className="text-sm font-semibold text-leaf hover:underline">
        Edit
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">Review your booking</h2>

      <div className="mt-6 rounded-2xl border border-leaf/15 bg-white p-6">
        {row("Service", state.serviceType === "dine_in" ? "Dine-in" : "Takeaway", "service")}
        {row("Date", formatEventDate(state.eventDate!), "date")}
        {state.serviceType === "dine_in" && row("Time", formatTimeSlot(state.timeSlot!), "timeslot")}
        {row(
          state.serviceType === "dine_in" ? "Guests" : "Package",
          state.serviceType === "dine_in" ? `${state.guests} people` : `${state.packageSize} people`,
          "details",
        )}
        {row(
          "Payment method",
          state.paymentMethod === "whatsapp_cash"
            ? "WhatsApp Members Special Price"
            : "Card / Non-WhatsApp",
          "details",
        )}
        {row("Name", state.name, "contact")}
        {row("Phone", state.phone, "contact")}
        <div className="flex items-center justify-between pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Total</p>
          <p className="text-xl font-semibold text-clay">{formatCents(price)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-chilli px-8 font-semibold text-cream hover:bg-clay"
      >
        Continue to payment
      </button>
      <p className="mt-3 text-sm text-ink/60">
        Next, we&apos;ll show you the advance payment details to confirm your booking.
      </p>
    </div>
  );
}
