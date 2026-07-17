import { useState } from "react";
import {
  computePriceCents,
  formatCents,
  formatEventDate,
  formatTimeLong,
  formatTimeSlot,
  onamEvent,
} from "@/data/onam-event";
import type { WizardState } from "./types";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_BYTES = 8 * 1024 * 1024;

export default function StepPayment({
  state,
  onReferenceChange,
  status,
  error,
  onSubmit,
}: {
  state: WizardState;
  onReferenceChange: (reference: string) => void;
  status: "idle" | "submitting" | "error";
  error: string | null;
  onSubmit: (file: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const price = computePriceCents({
    serviceType: state.serviceType!,
    guests: state.guests,
    packageSize: state.packageSize ?? undefined,
    paymentMethod: state.paymentMethod!,
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      setFileError(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setFile(null);
      setFileError("Please upload a JPG, PNG, WEBP, or PDF file.");
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setFile(null);
      setFileError("File is too large — please keep it under 8MB.");
      return;
    }
    setFile(selected);
    setFileError(null);
  }

  const hasProof = Boolean(file) || state.paymentReference.trim().length > 0;
  const canSubmit = hasProof && status !== "submitting";

  return (
    <div>
      <h2 className="font-semibold text-2xl text-leaf">Confirm with an advance payment</h2>

      <div className="mt-6 rounded-2xl border border-leaf/15 bg-white p-6">
        <p>Hello {state.name},</p>
        <p className="mt-2">Thank you for your booking for Onam Sadya 2026 at Kayal.</p>

        <p className="mt-4 font-semibold text-leaf">Here are your order details:</p>
        <dl className="mt-2 space-y-1 text-ink">
          <div>
            <dt className="inline font-semibold">Type: </dt>
            <dd className="inline">{state.serviceType === "dine_in" ? "Dine-in" : "Takeaway"}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Date: </dt>
            <dd className="inline">{formatEventDate(state.eventDate!)}</dd>
          </div>
          <div>
            <dt className="inline font-semibold">Time: </dt>
            <dd className="inline">
              {state.serviceType === "dine_in"
                ? formatTimeSlot(state.timeSlot!)
                : `${formatTimeLong(onamEvent.timeWindow.open)} – ${formatTimeLong(onamEvent.timeWindow.close)}`}
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold">
              {state.serviceType === "dine_in" ? "No. of people: " : "Package: "}
            </dt>
            <dd className="inline">
              {state.serviceType === "dine_in" ? state.guests : `${state.packageSize} people`}
            </dd>
          </div>
        </dl>

        {state.serviceType === "dine_in" && (
          <p className="mt-4 text-sm font-bold text-chilli">{onamEvent.dineInFootnote}</p>
        )}

        <p className="mt-4">
          To confirm your order, kindly make an advance payment of{" "}
          <strong>{formatCents(price)}</strong> and share the payment receipt with us once the
          transfer is completed.
        </p>

        <div className="mt-4 rounded-xl bg-leaf/5 p-4">
          <p>
            <span className="font-semibold">Account Name:</span> {onamEvent.bankDetails.accountName}
          </p>
          <p>
            <span className="font-semibold">BSB:</span> {onamEvent.bankDetails.bsb}
          </p>
          <p>
            <span className="font-semibold">Acc. No.:</span> {onamEvent.bankDetails.accountNumber}
          </p>
        </div>

        <p className="mt-4">Thank you, and we look forward to serving you!</p>
        <p className="mt-2">
          Best regards,
          <br />
          Kayal Team 😊
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-leaf" htmlFor="receipt-file">
            Upload payment receipt (image or PDF)
          </label>
          <input
            id="receipt-file"
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileChange}
            className="mt-1 w-full rounded-xl border border-leaf/25 bg-white px-4 py-3 text-sm"
          />
          {fileError && <p className="mt-1 text-sm font-medium text-chilli">{fileError}</p>}
        </div>

        <p className="text-center text-sm font-semibold text-ink/40">— or —</p>

        <div>
          <label className="block text-sm font-semibold text-leaf" htmlFor="payment-reference">
            Bank transfer reference number
          </label>
          <input
            id="payment-reference"
            type="text"
            value={state.paymentReference}
            onChange={(e) => onReferenceChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-leaf/25 bg-white px-4 py-3"
          />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-xl bg-chilli/10 px-4 py-3 text-sm font-medium text-chilli">
          {error || "Something went wrong submitting your request. Please try again, or call us directly."}
        </p>
      )}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => onSubmit(file)}
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-chilli px-8 font-semibold text-cream hover:bg-clay disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Submit booking"}
      </button>
      <p className="mt-3 text-sm text-ink/60">
        Upload a receipt or enter a reference number so we can verify your payment.
      </p>
    </div>
  );
}
