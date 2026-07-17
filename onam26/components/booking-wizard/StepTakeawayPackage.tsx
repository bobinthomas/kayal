import {
  formatCents,
  onamEvent,
  packageSizes,
  type PackageSize,
  type PaymentMethod,
} from "@/data/onam-event";

export default function StepTakeawayPackage({
  packageSize,
  paymentMethod,
  onPackageChange,
  onPaymentMethodChange,
  onNext,
}: {
  packageSize: PackageSize | null;
  paymentMethod: PaymentMethod | null;
  onPackageChange: (size: PackageSize) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onNext: () => void;
}) {
  const price =
    packageSize && paymentMethod ? onamEvent.takeawayPackages[packageSize][paymentMethod] : null;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">Choose a takeaway package</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {packageSizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onPackageChange(size)}
            className={`step-card rounded-xl border-2 px-4 py-4 text-center font-semibold hover:border-leaf ${
              packageSize === size ? "border-leaf bg-leaf/10 text-leaf" : "border-leaf/20 bg-white text-leaf"
            }`}
          >
            {size} people
          </button>
        ))}
      </div>

      <h3 className="mt-8 font-semibold text-lg text-leaf">How will you pay?</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onPaymentMethodChange("whatsapp_cash")}
          className={`step-card rounded-xl border-2 px-4 py-4 text-left hover:border-leaf ${
            paymentMethod === "whatsapp_cash" ? "border-leaf bg-leaf/10" : "border-leaf/20 bg-white"
          }`}
        >
          <span className="font-semibold text-leaf">WhatsApp Members Special Price</span>
          {packageSize && (
            <p className="mt-1 text-sm text-ink/70">
              {formatCents(onamEvent.takeawayPackages[packageSize].whatsapp_cash)}
            </p>
          )}
        </button>
        <button
          type="button"
          onClick={() => onPaymentMethodChange("card")}
          className={`step-card rounded-xl border-2 px-4 py-4 text-left hover:border-leaf ${
            paymentMethod === "card" ? "border-leaf bg-leaf/10" : "border-leaf/20 bg-white"
          }`}
        >
          <span className="font-semibold text-leaf">Card / Non-WhatsApp</span>
          {packageSize && (
            <p className="mt-1 text-sm text-ink/70">
              {formatCents(onamEvent.takeawayPackages[packageSize].card)}
            </p>
          )}
        </button>
      </div>

      {price !== null && (
        <p className="mt-6 text-lg font-semibold text-clay">Total: {formatCents(price)}</p>
      )}

      <button
        type="button"
        disabled={!packageSize || !paymentMethod}
        onClick={onNext}
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-leaf px-8 font-semibold text-cream hover:bg-banana-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
