import { Star, Quote } from "lucide-react";
import { reviews } from "@/data/reviews";
import HfReveal from "./HfReveal";

export default function HfTestimonials() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-6 sm:px-10 lg:px-16">
      <HfReveal as="div" className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">Guest Testimonials</p>
        <p className="font-hf-heading text-3xl font-bold text-hf-ink sm:text-4xl">
          What Our Guests Are Saying
        </p>
      </HfReveal>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        {reviews.map((review, i) => (
          <HfReveal
            key={review.quote}
            as="figure"
            delayMs={i * 100}
            className="flex flex-col gap-6 rounded-3xl border border-hf-border p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-hf-amber" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
              <Quote className="h-5 w-5 text-hf-border" aria-hidden="true" />
            </div>
            <blockquote className="text-[15px] italic leading-relaxed text-hf-body">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="text-sm font-bold text-hf-ink">
              {review.author}
              <span className="block text-xs font-normal text-hf-body">via {review.source}</span>
            </figcaption>
          </HfReveal>
        ))}
      </div>
      </div>
    </section>
  );
}
