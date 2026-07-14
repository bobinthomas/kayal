import { dineInSessionsForDate, formatTimeSlot, onamEvent } from "@/data/onam-event";

const SESSION_LABEL = { lunch: "Lunch", dinner: "Dinner" } as const;

export default function StepDineInTimeSlot({
  eventDate,
  timeSlot,
  onSelect,
}: {
  eventDate: string;
  timeSlot: string | null;
  onSelect: (timeSlot: string) => void;
}) {
  const sessions = dineInSessionsForDate(eventDate);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">Which time slot?</h2>

      {sessions.map((group) => (
        <div key={group.session} className="mt-6">
          {sessions.length > 1 && (
            <h3 className="mb-3 font-semibold text-sm uppercase tracking-wide text-ink/50">
              {SESSION_LABEL[group.session]}
            </h3>
          )}
          <div className="grid grid-cols-3 gap-3">
            {group.slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onSelect(slot)}
                className={`step-card rounded-xl border-2 px-4 py-4 text-center font-semibold hover:border-leaf ${
                  timeSlot === slot ? "border-leaf bg-leaf/10 text-leaf" : "border-leaf/20 bg-white text-leaf"
                }`}
              >
                {formatTimeSlot(slot)}
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className="mt-6 text-sm font-bold text-chilli">{onamEvent.dineInFootnote}</p>
    </div>
  );
}
