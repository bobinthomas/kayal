"use client";

import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";

export default function DouzeNewsletter() {
  return (
    <section className="douze-newsletter" aria-labelledby="douze-newsletter-heading">
      <div className="douze-newsletter-inner">
        <p className="douze-newsletter-eyebrow">Kayal offers</p>
        <h2 id="douze-newsletter-heading" className="douze-newsletter-title">
          First to know, <em>first to feast.</em>
        </h2>
        <p className="douze-newsletter-lede">
          Weekend combos, Onam sadya, Christmas roasts — our WhatsApp group hears it first.
        </p>
        <a
          href={`https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(restaurant.whatsapp.joinMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_tap", { placement: "douze_newsletter" })}
          className="douze-btn douze-btn--fill"
        >
          Join the offers group
        </a>
        <p className="douze-newsletter-consent">{restaurant.whatsapp.consentCopy}</p>
      </div>
    </section>
  );
}
