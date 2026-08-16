"use client";

import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";

export default function CallCta({
  placement,
  label,
}: {
  placement: string;
  label?: string;
}) {
  return (
    <a
      href={`tel:${restaurant.phone.tel}`}
      onClick={() => track("call_tap", { placement })}
      className="inline-flex min-h-12 items-center rounded-full bg-hf-red px-7 font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hf-amber"
    >
      {label ?? `Call ${restaurant.phone.display}`}
    </a>
  );
}
