import { reviews } from "@/data/reviews";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function ReviewStrip() {
  return (
    <section aria-labelledby="reviews-heading" className="relative overflow-hidden bg-leaf py-20 text-cream sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(233,180,76,0.12),transparent_40%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal variant="blur">
          <SectionHeading
            id="reviews-heading"
            eyebrow="From the table"
            title={
              <>
                Word from those{" "}
                <span className="italic text-turmeric">who&apos;ve eaten</span>
              </>
            }
            tone="light"
            align="center"
          />
        </Reveal>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal as="li" key={i} variant="scale" delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
              <figure className="review-card flex h-full flex-col rounded-2xl bg-banana-dark/50 p-8 ring-1 ring-turmeric/15 backdrop-blur-sm">
                <div
                  aria-hidden="true"
                  className="font-display text-5xl leading-none text-turmeric/40"
                  style={{ fontVariationSettings: '"WONK" 1.5' }}
                >
                  &ldquo;
                </div>
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-cream/90">
                  {review.quote}
                </blockquote>
                <figcaption className="mt-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-turmeric/70">
                  {review.author}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
