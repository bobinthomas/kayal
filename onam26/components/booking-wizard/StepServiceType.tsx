import { hasBookableDateForService, type ServiceType } from "@/data/onam-event";

export default function StepServiceType({
  dineInBlockedDates,
  onSelect,
}: {
  dineInBlockedDates: Set<string>;
  onSelect: (serviceType: ServiceType) => void;
}) {
  const dineInAvailable = hasBookableDateForService("dine_in", dineInBlockedDates);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">How would you like your Sadhya?</h2>
      <p className="mt-1 text-ink/70">
        {dineInAvailable ? "Choose dine-in or takeaway to see available dates." : "Takeaway is available — see dates below."}
      </p>
      <div className={`mt-6 grid gap-4 ${dineInAvailable ? "sm:grid-cols-2" : ""}`}>
        {dineInAvailable && (
          <button
            type="button"
            onClick={() => onSelect("dine_in")}
            className="step-card rounded-2xl border-2 border-leaf/20 bg-white p-6 text-left hover:border-leaf"
          >
            <span className="text-lg font-semibold text-leaf">Dine-in</span>
            <p className="mt-1 text-sm text-ink/70">$40 per person. 12pm–3pm.</p>
          </button>
        )}
        <button
          type="button"
          onClick={() => onSelect("takeaway")}
          className="step-card rounded-2xl border-2 border-leaf/20 bg-white p-6 text-left hover:border-leaf"
        >
          <span className="text-lg font-semibold text-leaf">Takeaway</span>
          <p className="mt-1 text-sm text-ink/70">Packages for 2, 4, 10 or 20 people. 12pm–3pm.</p>
        </button>
      </div>
    </div>
  );
}
