"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { douzeTestimonials } from "@/data/home-douze";

export default function DouzeTestimonials() {
  const [index, setIndex] = useState(0);
  const t = douzeTestimonials[index]!;

  const prev = () =>
    setIndex((i) => (i === 0 ? douzeTestimonials.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === douzeTestimonials.length - 1 ? 0 : i + 1));

  return (
    <section className="douze-testimonials" aria-labelledby="douze-testimonials-heading">
      <h2 id="douze-testimonials-heading" className="douze-testimonials-label">
        Kayal <em>&amp; you</em>
      </h2>

      <blockquote className="douze-testimonial-quote">&ldquo;{t.quote}&rdquo;</blockquote>
      <p className="douze-testimonial-author">{t.author}</p>

      <div className="douze-carousel-controls douze-testimonial-controls">
        <button
          type="button"
          className="douze-carousel-btn"
          onClick={prev}
          aria-label="Previous review"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="douze-carousel-dots" aria-hidden="true">
          {douzeTestimonials.map((_, i) => (
            <span key={i} className={i === index ? "is-active" : ""} />
          ))}
        </span>
        <button
          type="button"
          className="douze-carousel-btn"
          onClick={next}
          aria-label="Next review"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
