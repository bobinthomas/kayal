import { useMemo } from "react";
import type { AnalyticsEvent } from "@/lib/api";

const FUNNEL_STEPS: { step: string; label: string }[] = [
  { step: "service", label: "Service type" },
  { step: "date", label: "Date" },
  { step: "timeslot", label: "Time slot (dine-in only)" },
  { step: "details", label: "Package / guests" },
  { step: "contact", label: "Contact details" },
  { step: "review", label: "Review" },
  { step: "done", label: "Confirmation" },
];

const EVENT_LABEL: Record<string, string> = {
  service_selected: "Service type chosen",
  date_selected: "Date chosen",
  time_slot_selected: "Time slot chosen",
  details_selected: "Package/guests + payment chosen",
  contact_details_submitted: "Contact details submitted",
  booking_submitted: "Booking submitted",
  booking_submit_failed: "Booking submission failed",
  call_click: "Call button clicked",
  whatsapp_click: "WhatsApp button clicked",
};

export default function AnalyticsSummary({ events }: { events: AnalyticsEvent[] }) {
  const funnel = useMemo(() => {
    return FUNNEL_STEPS.map(({ step, label }) => {
      const sessions = new Set(
        events
          .filter((e) => e.event_name === "step_view" && e.step === step)
          .map((e) => e.session_id),
      );
      return { step, label, count: sessions.size };
    });
  }, [events]);

  const maxCount = Math.max(1, ...funnel.map((f) => f.count));

  const clickGroups = useMemo(() => {
    const groups = new Map<string, Map<string, Set<string>>>();
    for (const e of events) {
      if (e.event_name === "step_view") continue;
      const detailKey = e.detail || "—";
      if (!groups.has(e.event_name)) groups.set(e.event_name, new Map());
      const detailMap = groups.get(e.event_name)!;
      if (!detailMap.has(detailKey)) detailMap.set(detailKey, new Set());
      detailMap.get(detailKey)!.add(e.session_id);
    }
    return [...groups.entries()].map(([eventName, detailMap]) => ({
      eventName,
      details: [...detailMap.entries()]
        .map(([detail, sessions]) => ({ detail, count: sessions.size }))
        .sort((a, b) => b.count - a.count),
    }));
  }, [events]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-leaf/15 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          Wizard funnel — sessions reaching each step
        </p>
        <div className="mt-3 space-y-2">
          {funnel.map((f) => (
            <div key={f.step}>
              <div className="flex justify-between text-sm">
                <span>{f.label}</span>
                <span className="font-semibold">{f.count}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-leaf/10">
                <div
                  className="h-full rounded-full bg-leaf"
                  style={{ width: `${(f.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink/50">
          Time slot only applies to dine-in bookings, so its count is naturally lower than
          Service/Date.
        </p>
      </div>

      <div className="rounded-2xl border border-leaf/15 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          Clicks &amp; choices (by session)
        </p>
        <div className="mt-3 space-y-4">
          {clickGroups.length === 0 && <p className="text-sm text-ink/50">No click events yet.</p>}
          {clickGroups.map((g) => (
            <div key={g.eventName}>
              <p className="text-sm font-semibold text-leaf">
                {EVENT_LABEL[g.eventName] || g.eventName}
              </p>
              <div className="mt-1 space-y-1 text-sm">
                {g.details.map((d) => (
                  <div key={d.detail} className="flex justify-between gap-4">
                    <span className="truncate text-ink/70">{d.detail}</span>
                    <span className="shrink-0 font-semibold">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
