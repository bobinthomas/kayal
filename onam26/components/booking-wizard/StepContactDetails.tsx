import { useState } from "react";
import type { WizardState } from "./types";

const inputClass =
  "mt-1 w-full rounded-xl border border-leaf/25 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-leaf focus:outline-2 focus:outline-offset-1 focus:outline-turmeric";
const labelClass = "block text-sm font-semibold text-leaf";
const errorClass = "mt-1 text-sm font-medium text-chilli";

export default function StepContactDetails({
  state,
  onChange,
  onNext,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleContinue() {
    const nextErrors: Record<string, string> = {};
    if (!state.name.trim()) nextErrors.name = "Please tell us your name.";
    if (!state.phone.trim()) nextErrors.phone = "Please add a phone number so we can confirm.";
    if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      nextErrors.email = "That email doesn't look right.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  }

  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">Your details</h2>
      <p className="mt-1 text-ink/70">So we can confirm your booking.</p>

      {/* Honeypot — hidden from humans, irresistible to bots. */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label>
          Leave this field empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={state.website}
            onChange={(e) => onChange({ website: e.target.value })}
          />
        </label>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className={labelClass} htmlFor="wizard-name">
            Name
          </label>
          <input
            id="wizard-name"
            type="text"
            autoComplete="name"
            value={state.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="wizard-phone">
              Phone
            </label>
            <input
              id="wizard-phone"
              type="tel"
              autoComplete="tel"
              value={state.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={inputClass}
            />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="wizard-email">
              Email (optional)
            </label>
            <input
              id="wizard-email"
              type="email"
              autoComplete="email"
              value={state.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={inputClass}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="wizard-notes">
            Notes (optional)
          </label>
          <textarea
            id="wizard-notes"
            rows={3}
            value={state.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-leaf px-8 font-semibold text-cream hover:bg-banana-dark"
      >
        Continue
      </button>
    </div>
  );
}
