import Image from "next/image";
import Link from "next/link";
import { restaurant } from "@/data/restaurant";
import HfReveal from "./HfReveal";

export default function HfPhilosophy() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col-reverse items-center gap-12 px-6 sm:px-10 lg:flex-row lg:justify-between lg:px-16">
      <HfReveal as="div" variant="left" className="relative h-[420px] w-full max-w-[600px] lg:h-[500px]">
        <div className="absolute left-0 top-0 h-[380px] w-[320px] overflow-hidden rounded-3xl sm:h-[460px] sm:w-[400px]">
          <Image
            src="/images/home-figma/prep-main.png"
            alt="Preparing dishes in the Kayal Foods kitchen"
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-0 right-0 h-[260px] w-[260px] overflow-hidden rounded-3xl sm:h-[340px] sm:w-[340px]">
          <Image
            src="/images/home-figma/prep-overlap.png"
            alt=""
            fill
            sizes="340px"
            className="object-cover"
          />
        </div>
      </HfReveal>

      <HfReveal as="div" variant="right" delayMs={120} className="flex w-full max-w-[520px] flex-col gap-6">
        <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">Quality &amp; Naadan Cooking</p>
        <p className="font-hf-heading text-3xl font-bold leading-tight text-hf-ink sm:text-4xl">
          Our Food Philosophy
        </p>
        <p className="text-[15px] leading-relaxed text-hf-body">
          {restaurant.policies.lastOrders} {restaurant.policies.sitting}
        </p>
        <Link
          href="/about/"
          className="inline-flex h-[46px] w-fit items-center justify-center rounded-full bg-hf-green px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
        >
          Read More
        </Link>
      </HfReveal>
      </div>
    </section>
  );
}
