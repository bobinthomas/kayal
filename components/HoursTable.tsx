import {
  restaurant,
  dayLabels,
  dayOrder,
  formatSessions,
} from "@/data/restaurant";

/** Semantic hours table — renders only from data/restaurant.ts. */
export default function HoursTable({ compact = false }: { compact?: boolean }) {
  return (
    <table className={`w-full border-collapse ${compact ? "text-sm" : ""}`}>
      <caption className="sr-only">
        Opening hours for {restaurant.name}
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Hours</th>
        </tr>
      </thead>
      <tbody>
        {dayOrder.map((day) => {
          const { sessions, highlight } = restaurant.hours[day];
          return (
            <tr
              key={day}
              className={`border-b border-current/10 last:border-0 ${
                highlight ? "font-semibold text-turmeric" : ""
              }`}
            >
              <th scope="row" className="py-1.5 pr-4 text-left font-medium">
                {dayLabels[day]}
                {highlight && (
                  <span className="sr-only"> (weekend hours)</span>
                )}
              </th>
              <td className="py-1.5 text-right tabular-nums">
                {sessions.length ? formatSessions(sessions) : "Closed"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
