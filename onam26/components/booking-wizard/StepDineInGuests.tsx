import { formatCents, onamEvent, type PaymentMethod } from "@/data/onam-event";

export default function StepDineInGuests({
  guests,
  paymentMethod,
  onChange,
  onPaymentMethodChange,
  onNext,
}: {
  guests: number;
  paymentMethod: PaymentMethod | null;
  onChange: (guests: number) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onNext: () => void;
}) {
  const price = guests * onamEvent.dineInPricePerHeadCents;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">How many guests?</h2>
      <p className="mt-1 text-ink/70">$40 per person, dine-in.</p>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, guests - 1))}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-leaf/30 text-xl font-semibold text-leaf hover:border-leaf"
          aria-label="Decrease guests"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
          className="w-20 rounded-xl border border-leaf/25 bg-white px-4 py-3 text-center text-lg font-semibold"
        />
        <button
          type="button"
          onClick={() => onChange(guests + 1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-leaf/30 text-xl font-semibold text-leaf hover:border-leaf"
          aria-label="Increase guests"
        >
          +
        </button>
      </div>

      <h3 className="mt-8 font-semibold text-lg text-leaf">How will you pay on the day?</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onPaymentMethodChange("whatsapp_cash")}
          className={`step-card rounded-xl border-2 px-4 py-4 text-left hover:border-leaf ${
            paymentMethod === "whatsapp_cash" ? "border-leaf bg-leaf/10" : "border-leaf/20 bg-white"
          }`}
        >
          <span className="font-semibold text-leaf">WhatsApp Members Special Price</span>
        </button>
        <button
          type="button"
          onClick={() => onPaymentMethodChange("card")}
          className={`step-card rounded-xl border-2 px-4 py-4 text-left hover:border-leaf ${
            paymentMethod === "card" ? "border-leaf bg-leaf/10" : "border-leaf/20 bg-white"
          }`}
        >
          <span className="font-semibold text-leaf">Card / Non-WhatsApp</span>
        </button>
      </div>

      <p className="mt-6 text-lg font-semibold text-clay">Total: {formatCents(price)}</p>

      <button
        type="button"
        disabled={!paymentMethod}
        onClick={onNext}
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-leaf px-8 font-semibold text-cream hover:bg-banana-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
