"use client";

import { useEffect, useState } from "react";
import { submitBooking, uploadReceipt } from "@/lib/api";
import { track } from "@/lib/analytics";
import StepServiceType from "./booking-wizard/StepServiceType";
import StepDate from "./booking-wizard/StepDate";
import StepDineInTimeSlot from "./booking-wizard/StepDineInTimeSlot";
import StepDineInGuests from "./booking-wizard/StepDineInGuests";
import StepTakeawayPackage from "./booking-wizard/StepTakeawayPackage";
import StepContactDetails from "./booking-wizard/StepContactDetails";
import StepReview from "./booking-wizard/StepReview";
import StepPayment from "./booking-wizard/StepPayment";
import StepConfirmation from "./booking-wizard/StepConfirmation";
import { initialWizardState, stepsForService, type Step, type WizardState } from "./booking-wizard/types";

const STEP_LABEL: Record<Step, string> = {
  service: "Service",
  date: "Date",
  timeslot: "Time",
  details: "Package",
  contact: "Your details",
  review: "Review",
  payment: "Payment",
  done: "Done",
};

export default function BookingWizard() {
  const [step, setStep] = useState<Step>("service");
  const [state, setState] = useState<WizardState>(initialWizardState);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function patch(update: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...update }));
  }

  useEffect(() => {
    track("step_view", { step });
  }, [step]);

  async function handleSubmit(file: File | null) {
    setSubmitStatus("submitting");
    setSubmitError(null);

    let receiptKey: string | undefined;
    if (file) {
      const uploadResult = await uploadReceipt(file);
      if (!uploadResult.ok) {
        setSubmitStatus("error");
        setSubmitError(uploadResult.error);
        return;
      }
      receiptKey = uploadResult.key;
    }

    const result = await submitBooking({
      website: state.website,
      serviceType: state.serviceType!,
      eventDate: state.eventDate!,
      timeSlot: state.serviceType === "dine_in" ? state.timeSlot! : undefined,
      guests: state.serviceType === "dine_in" ? state.guests : undefined,
      packageSize: state.serviceType === "takeaway" ? state.packageSize! : undefined,
      paymentMethod: state.paymentMethod!,
      name: state.name,
      phone: state.phone,
      email: state.email || undefined,
      notes: state.notes || undefined,
      receiptKey,
      paymentReference: state.paymentReference.trim() || undefined,
    });
    if (result.ok) {
      track("booking_submitted", { step: "payment", detail: state.serviceType! });
      setSubmitStatus("idle");
      setStep("done");
    } else {
      track("booking_submit_failed", { step: "payment", detail: result.error });
      setSubmitStatus("error");
      setSubmitError(result.error);
    }
  }

  function reset() {
    setState(initialWizardState);
    setSubmitStatus("idle");
    setSubmitError(null);
    setStep("service");
  }

  const order = stepsForService(state.serviceType);
  const stepIndex = order.indexOf(step);
  const showProgress = step !== "done";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {showProgress && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Step {stepIndex + 1} of {order.length - 1} — {STEP_LABEL[step]}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-leaf/10">
            <div
              className="h-full rounded-full bg-leaf transition-all"
              style={{ width: `${((stepIndex + 1) / (order.length - 1)) * 100}%` }}
            />
          </div>
          {step !== "service" && (
            <button
              type="button"
              onClick={() => setStep(order[Math.max(0, stepIndex - 1)])}
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
            track("service_selected", { step: "service", detail: serviceType });
            patch({ serviceType, eventDate: null });
            setStep("date");
          }}
        />
      )}

      {step === "date" && state.serviceType && (
        <StepDate
          serviceType={state.serviceType}
          onSelect={(eventDate) => {
            track("date_selected", { step: "date", detail: eventDate });
            patch({ eventDate });
            setStep(state.serviceType === "dine_in" ? "timeslot" : "details");
          }}
        />
      )}

      {step === "timeslot" && state.serviceType === "dine_in" && (
        <StepDineInTimeSlot
          eventDate={state.eventDate!}
          timeSlot={state.timeSlot}
          onSelect={(timeSlot) => {
            track("time_slot_selected", { step: "timeslot", detail: timeSlot });
            patch({ timeSlot });
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
          onNext={() => {
            track("details_selected", {
              step: "details",
              detail: `${state.guests} guests / ${state.paymentMethod}`,
            });
            setStep("contact");
          }}
        />
      )}

      {step === "details" && state.serviceType === "takeaway" && (
        <StepTakeawayPackage
          packageSize={state.packageSize}
          paymentMethod={state.paymentMethod}
          onPackageChange={(packageSize) => patch({ packageSize })}
          onPaymentMethodChange={(paymentMethod) => patch({ paymentMethod })}
          onNext={() => {
            track("details_selected", {
              step: "details",
              detail: `${state.packageSize} people / ${state.paymentMethod}`,
            });
            setStep("contact");
          }}
        />
      )}

      {step === "contact" && (
        <StepContactDetails
          state={state}
          onChange={patch}
          onNext={() => {
            track("contact_details_submitted", { step: "contact" });
            setStep("review");
          }}
        />
      )}

      {step === "review" && (
        <StepReview
          state={state}
          onEdit={(target) => setStep(target)}
          onContinue={() => {
            track("review_continued", { step: "review" });
            setStep("payment");
          }}
        />
      )}

      {step === "payment" && (
        <StepPayment
          state={state}
          onReferenceChange={(paymentReference) => patch({ paymentReference })}
          status={submitStatus === "submitting" ? "submitting" : submitStatus === "error" ? "error" : "idle"}
          error={submitError}
          onSubmit={handleSubmit}
        />
      )}

      {step === "done" && <StepConfirmation serviceType={state.serviceType} onReset={reset} />}
    </div>
  );
}
