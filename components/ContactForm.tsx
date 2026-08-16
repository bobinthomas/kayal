"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Contact / catering enquiry form. Posts to the Cloudflare Pages Function at
 * /api/contact. Spam defence: honeypot field + (optional) Turnstile widget.
 * Inline success/failure states — no redirect.
 */
export default function ContactForm({
  variant = "contact",
}: {
  variant?: "contact" | "catering";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const nextErrors: Record<string, string> = {};
    if (!String(data.get("name") || "").trim()) {
      nextErrors.name = "Please tell us your name.";
    }
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    if (!phone && !email) {
      nextErrors.contact = "Add a phone number or email so we can reach you.";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "That email doesn't look right.";
    }
    if (variant === "catering" && !String(data.get("eventDate") || "").trim()) {
      nextErrors.eventDate = "Let us know your event date (rough is fine).";
    }
    if (!String(data.get("message") || "").trim()) {
      nextErrors.message =
        variant === "catering"
          ? "Tell us a little about the event."
          : "Please add a message.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      track(variant === "catering" ? "catering_enquiry" : "booking_form_submit");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-hf-border bg-white px-4 py-3 text-hf-ink placeholder:text-hf-body/60 focus:border-hf-ink focus:outline-2 focus:outline-offset-1 focus:outline-hf-amber";
  const labelClass = "block text-sm font-semibold text-hf-ink";
  const errorClass = "mt-1 text-sm font-medium text-hf-red";

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl bg-hf-badge-bg p-8 text-center ring-1 ring-hf-amber/40"
      >
        <p className="font-hf-heading text-2xl font-semibold text-hf-ink">
          Got it — the pot&apos;s on.
        </p>
        <p className="mt-2 text-hf-body">
          We&apos;ve received your {variant === "catering" ? "catering enquiry" : "message"} and
          will get back to you shortly. In a hurry? Call us directly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 inline-flex min-h-11 items-center rounded-full border border-hf-ink px-6 text-sm font-semibold text-hf-ink hover:bg-hf-ink hover:text-white"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <input type="hidden" name="subject" value={variant} />
      {/* Honeypot — hidden from humans, irresistible to bots. */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor={`${variant}-name`} className={labelClass}>
          Name
        </label>
        <input
          id={`${variant}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${variant}-name-error` : undefined}
          className={inputClass}
        />
        {errors.name && (
          <p id={`${variant}-name-error`} className={errorClass}>
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${variant}-phone`} className={labelClass}>
            Phone
          </label>
          <input
            id={`${variant}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${variant}-email`} className={labelClass}>
            Email
          </label>
          <input
            id={`${variant}-email`}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${variant}-email-error` : undefined}
            className={inputClass}
          />
          {errors.email && (
            <p id={`${variant}-email-error`} className={errorClass}>
              {errors.email}
            </p>
          )}
        </div>
      </div>
      {errors.contact && <p className={errorClass}>{errors.contact}</p>}

      {variant === "catering" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="catering-date" className={labelClass}>
              Event date
            </label>
            <input
              id="catering-date"
              name="eventDate"
              type="date"
              aria-invalid={Boolean(errors.eventDate)}
              aria-describedby={errors.eventDate ? "catering-date-error" : undefined}
              className={inputClass}
            />
            {errors.eventDate && (
              <p id="catering-date-error" className={errorClass}>
                {errors.eventDate}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="catering-guests" className={labelClass}>
              Number of guests
            </label>
            <input
              id="catering-guests"
              name="guests"
              type="number"
              min={1}
              inputMode="numeric"
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${variant}-message`} className={labelClass}>
          {variant === "catering" ? "Tell us about your event" : "Message"}
        </label>
        <textarea
          id={`${variant}-message`}
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${variant}-message-error` : undefined}
          className={inputClass}
        />
        {errors.message && (
          <p id={`${variant}-message-error`} className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="lazyOnload"
          />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
        </>
      )}

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-hf-red/10 px-4 py-3 text-sm font-medium text-hf-red">
          Something went wrong sending your message. Please try again, or call us
          directly — we&apos;d love to hear from you.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-12 items-center rounded-full bg-hf-red px-8 font-semibold text-white transition-transform hover:scale-[1.03] disabled:opacity-60"
      >
        {status === "submitting"
          ? "Sending…"
          : variant === "catering"
            ? "Request a quote"
            : "Send message"}
      </button>
    </form>
  );
}
