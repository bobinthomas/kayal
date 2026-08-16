import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { restaurant } from "@/data/restaurant";
import { reviews, type Review } from "@/data/reviews";
import HfReveal from "./HfReveal";

const RATING = 4.1;

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 text-hf-amber ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-current" />
      ))}
    </div>
  );
}

function BrandCard({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col justify-between rounded-3xl bg-hf-green p-7 text-white ${className}`}>
      <p className="font-hf-heading text-2xl">Kayal Foods</p>
      <p className="mt-4 text-sm leading-relaxed text-white/75">{restaurant.tagline}</p>
    </div>
  );
}

function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 16vw, 90vw" className="object-cover" />
    </div>
  );
}

function QuoteCard({ review, className = "" }: { review: Review; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 rounded-3xl bg-hf-green p-7 text-white ${className}`}>
      <Quote className="h-6 w-6 text-white/30" aria-hidden="true" />
      <Stars />
      <blockquote className="flex-1 text-[15px] leading-relaxed">&ldquo;{review.quote}&rdquo;</blockquote>
      <figcaption className="text-sm font-bold">
        {review.author}
        <span className="block text-xs font-normal text-white/60">via {review.source}</span>
      </figcaption>
    </div>
  );
}

function RatingCard() {
  return (
    <div className="flex flex-col justify-center gap-2 rounded-3xl bg-hf-red p-7 text-white">
      <p className="font-hf-heading text-4xl">{RATING}</p>
      <Stars />
      <p className="text-xs text-white/75">Rated on Google</p>
    </div>
  );
}

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

        <HfReveal
          as="div"
          className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-none lg:grid-rows-2"
        >
          <BrandCard className="lg:row-span-2" />
          <Photo src="/images/home-figma/dish-fish-tikka.png" alt="Fish tikka" className="min-h-[220px] lg:row-span-2" />
          <QuoteCard review={reviews[0]} />
          <RatingCard />
          <QuoteCard review={reviews[1]} className="lg:row-span-2" />
          <Photo src="/images/home-figma/mango-avial.png" alt="Avial" className="min-h-[220px] lg:row-span-2" />
          <QuoteCard review={reviews[2]} />
          <RatingCard />
        </HfReveal>
      </div>
    </section>
  );
}
