import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hfSpotlights } from "@/data/home-figma";
import HfReveal from "./HfReveal";

export default function HfSpotlights() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-6 sm:px-10 lg:px-16">
      <HfReveal as="div" className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">From the Kitchen</p>
        <p className="font-hf-heading text-3xl font-bold text-hf-ink sm:text-4xl">
          Notes on Naadan Cooking
        </p>
      </HfReveal>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        {hfSpotlights.map((s, i) => (
          <HfReveal key={s.id} as="div" delayMs={i * 100}>
            <Link
              href={s.href}
              className="group flex flex-col gap-5 rounded-3xl border border-hf-border p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.15)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit items-center rounded-md bg-hf-badge-bg px-2.5 py-1 text-[11px] font-semibold uppercase text-hf-amber">
                  {s.category}
                </span>
                <p className="font-hf-heading text-[22px] font-semibold text-hf-ink">
                  {s.title}
                </p>
                <p className="text-sm leading-relaxed text-hf-body">{s.body}</p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-hf-ink">
                  Read More <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </HfReveal>
        ))}
      </div>
      </div>
    </section>
  );
}
