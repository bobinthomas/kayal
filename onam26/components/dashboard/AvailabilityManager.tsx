"use client";

import { useEffect, useState } from "react";
import {
  blockAvailability,
  fetchAvailability,
  unblockAvailability,
  type AvailabilityBlock,
} from "@/lib/api";
import {
  dineInSessionsForDate,
  formatEventDate,
  formatTimeSlot,
  onamEvent,
  type ServiceType,
} from "@/data/onam-event";

function findBlock(
  blocks: AvailabilityBlock[],
  serviceType: ServiceType,
  eventDate: string,
  timeSlot: string,
): AvailabilityBlock | undefined {
  return blocks.find(
    (b) => b.service_type === serviceType && b.event_date === eventDate && b.time_slot === timeSlot,
  );
}

function ToggleButton({
  blocked,
  busy,
  onClick,
  size = "md",
}: {
  blocked: boolean;
  busy: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}) {
  const padding = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs";
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={`rounded-full font-semibold text-white disabled:opacity-50 ${padding} ${
        blocked ? "bg-chilli hover:bg-clay" : "bg-curryleaf hover:bg-leaf"
      }`}
    >
      {blocked ? "Closed" : "Open"}
    </button>
  );
}

export default function AvailabilityManager() {
  const [blocks, setBlocks] = useState<AvailabilityBlock[] | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability().then((result) => {
      if (result.ok) setBlocks(result.blocks);
    });
  }, []);

  async function toggle(serviceType: ServiceType, eventDate: string, timeSlot: string, key: string) {
    if (!blocks) return;
    setBusyKey(key);
    const existing = findBlock(blocks, serviceType, eventDate, timeSlot);
    if (existing) {
      const ok = await unblockAvailability(existing.id);
      if (ok) setBlocks((prev) => prev!.filter((b) => b.id !== existing.id));
    } else {
      const ok = await blockAvailability(serviceType, eventDate, timeSlot);
      if (ok) {
        const refreshed = await fetchAvailability();
        if (refreshed.ok) setBlocks(refreshed.blocks);
      }
    }
    setBusyKey(null);
  }

  if (blocks === null) {
    return <p className="text-ink/60">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-lg text-leaf">Dine-in dates</h3>
        <div className="mt-3 divide-y divide-leaf/10 rounded-2xl border border-leaf/15 bg-white">
          {onamEvent.dineInDates.map((date) => {
            const dateBlocked = Boolean(findBlock(blocks, "dine_in", date, ""));
            const isExpanded = expandedDate === date;
            return (
              <div key={date} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setExpandedDate(isExpanded ? null : date)}
                    className="flex items-center gap-2 text-left font-semibold text-ink"
                  >
                    <span className={`inline-block transition-transform ${isExpanded ? "rotate-90" : ""}`}>▸</span>
                    {formatEventDate(date)}
                  </button>
                  <ToggleButton
                    blocked={dateBlocked}
                    busy={busyKey === `dine_in|${date}|`}
                    onClick={() => toggle("dine_in", date, "", `dine_in|${date}|`)}
                  />
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-3 pl-6">
                    {dineInSessionsForDate(date).map((group) => (
                      <div key={group.session}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                          {group.session === "lunch" ? "Lunch" : "Dinner"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {group.slots.map((slot) => {
                            const slotBlocked = Boolean(findBlock(blocks, "dine_in", date, slot));
                            const key = `dine_in|${date}|${slot}`;
                            return (
                              <div
                                key={slot}
                                className="flex items-center gap-2 rounded-xl border border-leaf/10 px-3 py-2"
                              >
                                <span className="text-sm font-medium text-ink">{formatTimeSlot(slot)}</span>
                                <ToggleButton
                                  blocked={slotBlocked}
                                  busy={busyKey === key}
                                  onClick={() => toggle("dine_in", date, slot, key)}
                                  size="sm"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-leaf">Takeaway dates</h3>
        <div className="mt-3 divide-y divide-leaf/10 rounded-2xl border border-leaf/15 bg-white">
          {onamEvent.takeawayDates.map((date) => {
            const dateBlocked = Boolean(findBlock(blocks, "takeaway", date, ""));
            return (
              <div key={date} className="flex items-center justify-between gap-4 p-4">
                <span className="font-semibold text-ink">{formatEventDate(date)}</span>
                <ToggleButton
                  blocked={dateBlocked}
                  busy={busyKey === `takeaway|${date}|`}
                  onClick={() => toggle("takeaway", date, "", `takeaway|${date}|`)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
