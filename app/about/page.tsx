import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RippleDivider from "@/components/RippleDivider";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { legacyPhoto } from "@/data/legacy-site";
import { kizhiPorottaStory, chattiChoruStory, aboutParagraph } from "@/data/copy";

export const metadata: Metadata = {
  title: "Our Story — The Backwater That Raised Our Kitchen",
  description:
    "Kayal means backwater — Kerala's lagoons where the kettuvallam drift. Our story, the chatti, the kizhi porotta and the village kitchen behind Kayal Foods, Moorebank.",
  alternates: { canonical: "/about" },
  openGraph: { images: [{ url: "/og/about.png", width: 1200, height: 630 }] },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about/" },
        ])}
      />
      <div className="relative isolate overflow-hidden bg-hf-footer text-white">
        <Image
          src={legacyPhoto(3).src}
          alt=""
          fill
          priority
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">
            Our story
          </p>
          <h1 className="mt-4 max-w-2xl font-hf-heading text-4xl font-semibold leading-tight sm:text-6xl">
            Kayal means backwater. It&apos;s where our food comes from.
          </h1>
        </div>
      </div>

      <section aria-labelledby="origin-heading" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 id="origin-heading" className="font-hf-heading text-3xl font-semibold text-hf-ink">
          The lagoon and the table
        </h2>
        <p className="mt-5 leading-relaxed text-hf-body">
          In Kerala, the <em>kayal</em> is the slow water between the rice paddies
          and the sea — home of the kettuvallam houseboats, the toddy shops on
          stilts, and the kind of cooking that never needed a recipe book. Fish
          straight off the line into the clay pot. Tapioca and beef on a rainy
          afternoon. Lunch tied up in a banana leaf.
        </p>
        <p className="mt-4 leading-relaxed text-hf-body">{aboutParagraph}</p>
        <p className="mt-4 leading-relaxed text-hf-body">
          Our kitchen is led by a chef with around seventeen years of cooking in
          Kerala before bringing the village table to Sydney.
          {/* ◻ Owner to confirm chef name, years and hometown (PRD §11.6). */}
        </p>
      </section>

      <div className="text-hf-green">
        <RippleDivider />
      </div>

      <section aria-labelledby="kizhi-heading" className="bg-hf-green py-16 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <Reveal>
            <h2 id="kizhi-heading" className="font-hf-heading text-3xl font-semibold text-hf-amber">
              The Kizhi Porotta
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">{kizhiPorottaStory}</p>
          </Reveal>
          <Reveal>
            <Image
              src={legacyPhoto(1).src}
              alt={legacyPhoto(1).alt}
              width={600}
              height={450}
              className="aspect-[4/3] w-full rounded-3xl object-cover ring-1 ring-hf-amber/30"
            />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="chatti-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal className="md:order-2">
            <h2 id="chatti-heading" className="font-hf-heading text-3xl font-semibold text-hf-red">
              The Chatti Choru
            </h2>
            <p className="mt-4 leading-relaxed text-hf-body">{chattiChoruStory}</p>
            <p className="mt-3 leading-relaxed text-hf-body">
              It&apos;s our best seller for a reason: the clay holds the heat, the heat
              holds the flavour, and the flavour holds the memory.
            </p>
          </Reveal>
          <Reveal className="md:order-1">
            <Image
              src={legacyPhoto(0).src}
              alt={legacyPhoto(0).alt}
              width={600}
              height={450}
              className="aspect-[4/3] w-full rounded-3xl object-cover ring-1 ring-hf-red/30"
            />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="minimart-heading" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-hf-badge-bg p-8 ring-1 ring-hf-amber/30">
          <h2 id="minimart-heading" className="font-hf-heading text-2xl font-semibold text-hf-ink">
            Take Kerala home
          </h2>
          <p className="mt-2 leading-relaxed text-hf-body">
            Our grocery corner stocks the essentials — matta rice, spice mixes,
            pickles and the things a Kerala pantry can&apos;t do without. Ask us on
            your way out.
            {/* ◻ Owner to confirm mini-mart is still operating (PRD §11.5). */}
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-hf-green px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Visit us
          </Link>
        </div>
      </section>
    </>
  );
}
