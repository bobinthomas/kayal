import { datesForService, formatEventDate, onamEvent, type ServiceType } from "@/data/onam-event";

export default function StepDate({
  serviceType,
  blockedDates,
  onSelect,
}: {
  serviceType: ServiceType;
  blockedDates: Set<string>;
  onSelect: (eventDate: string) => void;
}) {
  const dates = datesForService(serviceType).filter((date) => !blockedDates.has(date));

  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">
        Which date{" "}
        {serviceType === "dine_in" ? "for dine-in" : "for takeaway"}?
      </h2>
      <p className="mt-1 text-ink/70">12pm–3pm on the day.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {dates.map((date) => {
          const hasDinner =
            serviceType === "dine_in" &&
            (onamEvent.dineInDinnerDates as readonly string[]).includes(date);
          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelect(date)}
              className="step-card rounded-xl border-2 border-leaf/20 bg-white px-4 py-4 text-center font-semibold text-leaf hover:border-leaf"
            >
              {formatEventDate(date)}
              {hasDinner && (
                <span className="mt-1 block text-xs font-normal text-ink/50">Lunch &amp; Dinner</span>
              )}
            </button>
          );
        })}
      </div>
      {serviceType === "takeaway" && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Take away closed for 23rd August. Contact us on 0297349634 if you want to book.
        </p>
      )}
    </div>
  );
}
