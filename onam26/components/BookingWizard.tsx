"use client";

import { useState } from "react";
import { submitBooking } from "@/lib/api";
import StepServiceType from "./booking-wizard/StepServiceType";
import StepDate from "./booking-wizard/StepDate";
import StepDineInGuests from "./booking-wizard/StepDineInGuests";
import StepTakeawayPackage from "./booking-wizard/StepTakeawayPackage";
import StepContactDetails from "./booking-wizard/StepContactDetails";
import StepReview from "./booking-wizard/StepReview";
import StepConfirmation from "./booking-wizard/StepConfirmation";
import { initialWizardState, type Step, type WizardState } from "./booking-wizard/types";

const STEP_ORDER: Step[] = ["service", "date", "details", "contact", "review", "done"];
const STEP_LABEL: Record<Step, string> = {
  service: "Service",
  date: "Date",
  details: "Package",
  contact: "Your details",
  review: "Review",
  done: "Done",
};

export default function BookingWizard() {
  const [step, setStep] = useState<Step>("service");
  const [state, setState] = useState<WizardState>(initialWizardState);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "error">("idle");

  function patch(update: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...update }));
  }

  async function handleSubmit() {
    setSubmitStatus("submitting");
    const result = await submitBooking({
      website: state.website,
      serviceType: state.serviceType!,
      eventDate: state.eventDate!,
      guests: state.serviceType === "dine_in" ? state.guests : undefined,
      packageSize: state.serviceType === "takeaway" ? state.packageSize! : undefined,
      paymentMethod: state.paymentMethod!,
      name: state.name,
      phone: state.phone,
      email: state.email || undefined,
      notes: state.notes || undefined,
    });
    if (result.ok) {
      setSubmitStatus("idle");
      setStep("done");
    } else {
      setSubmitStatus("error");
    }
  }

  function reset() {
    setState(initialWizardState);
    setSubmitStatus("idle");
    setStep("service");
  }

  const stepIndex = STEP_ORDER.indexOf(step);
  const showProgress = step !== "done";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {showProgress && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Step {stepIndex + 1} of {STEP_ORDER.length - 1} — {STEP_LABEL[step]}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-leaf/10">
            <div
              className="h-full rounded-full bg-leaf transition-all"
              style={{ width: `${((stepIndex + 1) / (STEP_ORDER.length - 1)) * 100}%` }}
            />
          </div>
          {step !== "service" && (
            <button
              type="button"
              onClick={() => setStep(STEP_ORDER[Math.max(0, stepIndex - 1)])}
              className="mt-4 text-sm font-semibold text-leaf hover:underline"
            >
              ← Back
            </button>
          )}
        </div>
      )}

      {step === "service" && (
        <StepServiceType
          onSelect={(serviceType) => {
            patch({ serviceType, eventDate: null });
            setStep("date");
          }}
        />
      )}

      {step === "date" && state.serviceType && (
        <StepDate
          serviceType={state.serviceType}
          onSelect={(eventDate) => {
            patch({ eventDate });
            setStep("details");
          }}
        />
      )}

      {step === "details" && state.serviceType === "dine_in" && (
        <StepDineInGuests
          guests={state.guests}
          paymentMethod={state.paymentMethod}
          onChange={(guests) => patch({ guests })}
          onPaymentMethodChange={(paymentMethod) => patch({ paymentMethod })}
          onNext={() => setStep("contact")}
        />
      )}

      {step === "details" && state.serviceType === "takeaway" && (
        <StepTakeawayPackage
          packageSize={state.packageSize}
          paymentMethod={state.paymentMethod}
          onPackageChange={(packageSize) => patch({ packageSize })}
          onPaymentMethodChange={(paymentMethod) => patch({ paymentMethod })}
          onNext={() => setStep("contact")}
        />
      )}

      {step === "contact" && (
        <StepContactDetails state={state} onChange={patch} onNext={() => setStep("review")} />
      )}

      {step === "review" && (
        <StepReview
          state={state}
          status={submitStatus === "submitting" ? "submitting" : submitStatus === "error" ? "error" : "idle"}
          onEdit={(target) => setStep(target)}
          onSubmit={handleSubmit}
        />
      )}

      {step === "done" && <StepConfirmation onReset={reset} />}
    </div>
  );
}
