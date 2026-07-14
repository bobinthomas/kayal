import { onamEvent, type ServiceType } from "@/data/onam-event";
import { track } from "@/lib/analytics";

export default function StepConfirmation({
  serviceType,
  onReset,
}: {
  serviceType: ServiceType | null;
  onReset: () => void;
}) {
  const waMessage = encodeURIComponent(
    "Hi Kayal! I've just submitted an Onam Sadhya 2026 booking request.",
  );

  return (
    <div className="rounded-2xl bg-curryleaf/15 p-8 text-center ring-1 ring-curryleaf/40">
      <p className="font-semibold text-2xl text-leaf">Request received!</p>
      <p className="mt-2 text-ink/80">
        Your Onam Sadhya 2026 booking request is pending review. We&apos;ll confirm by phone or
        WhatsApp shortly — no payment has been taken.
      </p>

      {serviceType === "dine_in" && (
        <p className="mt-4 text-sm font-bold text-chilli">{onamEvent.dineInFootnote}</p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={`tel:${onamEvent.contact.phone.tel}`}
          onClick={() => track("call_click", { step: "done" })}
          className="inline-flex min-h-11 items-center rounded-full border border-leaf px-6 text-sm font-semibold text-leaf hover:bg-leaf hover:text-cream"
        >
          Call {onamEvent.contact.phone.display}
        </a>
        <a
          href={`https://wa.me/${onamEvent.contact.whatsapp.number}?text=${waMessage}`}
          onClick={() => track("whatsapp_click", { step: "done" })}
          className="inline-flex min-h-11 items-center rounded-full bg-leaf px-6 text-sm font-semibold text-cream hover:bg-banana-dark"
        >
          Message us on WhatsApp
        </a>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-semibold text-leaf hover:underline"
      >
        Make another booking
      </button>
    </div>
  );
}
