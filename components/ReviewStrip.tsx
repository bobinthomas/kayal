import { reviews } from "@/data/reviews";
import SectionHeading from "@/components/SectionHeading";
import SectionScene from "@/components/motion/SectionScene";

export default function ReviewStrip() {
  return (
    <SectionScene
      id="reviews-block"
      aria-labelledby="reviews-heading"
      intensity="medium"
      className="overflow-hidden bg-leaf py-20 text-cream sm:py-28"
      parallaxLayers={[
        {
          speed: 0.55,
          className: "right-0 top-0 h-80 w-80 rounded-full bg-turmeric/10 blur-3xl",
          node: <div className="h-full w-full rounded-full bg-turmeric/15" />,
        },
      ]}
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
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
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <li
              key={i}
              className="section-stagger-card"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
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
            </li>
          ))}
        </ul>
      </div>
    </SectionScene>
  );
}
