import {
  computePriceCents,
  formatCents,
  formatEventDate,
} from "@/data/onam-event";
import type { WizardState } from "./types";

export default function StepReview({
  state,
  status,
  onEdit,
  onSubmit,
}: {
  state: WizardState;
  status: "idle" | "submitting" | "error";
  onEdit: (step: "service" | "date" | "details" | "contact") => void;
  onSubmit: () => void;
}) {
  const price = computePriceCents({
    serviceType: state.serviceType!,
    guests: state.guests,
    packageSize: state.packageSize ?? undefined,
    paymentMethod: state.paymentMethod!,
  });

  const row = (label: string, value: string, step: "service" | "date" | "details" | "contact") => (
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
        {row(
          state.serviceType === "dine_in" ? "Guests" : "Package",
          state.serviceType === "dine_in" ? `${state.guests} people` : `${state.packageSize} people`,
          "details",
        )}
        {row(
          "Payment method",
          state.paymentMethod === "whatsapp_cash" ? "WhatsApp Members Cash" : "Card / Non-WhatsApp",
          "details",
        )}
        {row("Name", state.name, "contact")}
        {row("Phone", state.phone, "contact")}
        <div className="flex items-center justify-between pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Total</p>
          <p className="text-xl font-semibold text-clay">{formatCents(price)}</p>
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-xl bg-chilli/10 px-4 py-3 text-sm font-medium text-chilli">
          Something went wrong submitting your request. Please try again, or call us directly.
        </p>
      )}

      <button
        type="button"
        disabled={status === "submitting"}
        onClick={onSubmit}
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-chilli px-8 font-semibold text-cream hover:bg-clay disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit booking request"}
      </button>
      <p className="mt-3 text-sm text-ink/60">
        No payment is taken now — this is a booking request. We&apos;ll confirm by phone or WhatsApp.
      </p>
    </div>
  );
}
