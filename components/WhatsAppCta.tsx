"use client";

import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";

export default function WhatsAppCta({
  placement,
  message,
  label = "WhatsApp us",
}: {
  placement: string;
  message?: string;
  label?: string;
}) {
  const text = message ?? restaurant.whatsapp.bookingMessage;
  return (
    <a
      href={`https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_tap", { placement })}
      className="inline-flex min-h-12 items-center rounded-full bg-curryleaf px-7 font-semibold text-ink transition-colors hover:bg-turmeric focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
    >
      {label}
    </a>
  );
}
