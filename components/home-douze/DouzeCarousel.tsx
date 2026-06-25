"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

export default function DouzeCarousel({ slides }: { slides: readonly Slide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index]!;

  const prev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="douze-carousel">
      <p className="douze-carousel-eyebrow">{slide.eyebrow}</p>
      <h3 className="douze-carousel-title">{slide.title}</h3>
      <p className="douze-carousel-body">{slide.body}</p>

      <div className="douze-carousel-controls">
        <button
          type="button"
          className="douze-carousel-btn"
          onClick={prev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        <span className="douze-carousel-dots" aria-hidden="true">
          {slides.map((s, i) => (
            <span key={s.id} className={i === index ? "is-active" : ""} />
          ))}
        </span>
        <button
          type="button"
          className="douze-carousel-btn"
          onClick={next}
          aria-label="Next slide"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
