import { formatTimeSlot, onamEvent } from "@/data/onam-event";

export default function StepDineInTimeSlot({
  timeSlot,
  onSelect,
}: {
  timeSlot: string | null;
  onSelect: (timeSlot: string) => void;
}) {
  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">Which time slot?</h2>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {onamEvent.dineInTimeSlots.map((slot) => (
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

      <p className="mt-6 text-sm text-ink/60">{onamEvent.dineInFootnote}</p>
    </div>
  );
}
