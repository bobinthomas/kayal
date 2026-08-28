import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RippleDivider from "@/components/RippleDivider";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { about } from "@/data/about";

// "11 years" is genuine — confirmed live at components/home-figma/HfHeritage.tsx:16
// ("For over 11 years, Kayal Foods has brought Kerala's village table to
// Sydney"), not the same claim as the chef's "seventeen years of cooking in
// Kerala" further down this page (his personal experience, still unconfirmed).
const TITLE = "About Kayal Foods | 11 Years of Naadan Kerala Cooking";
const DESCRIPTION =
  "Eleven years of naadan Kerala cooking in Moorebank, Sydney. The story behind Kayal Foods, our clay-pot kitchen and the village recipes we cook from.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: "/og/about.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og/about.png"] },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: about.hero.title, path: "/about/" },
        ])}
      />
      <div className="relative isolate overflow-hidden bg-hf-footer text-white">
        <Image
          src={about.hero.image}
          alt=""
          role="presentation"
          fill
          priority
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">
            {about.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl font-hf-heading text-4xl font-semibold leading-tight sm:text-6xl">
            {about.hero.title}
          </h1>
        </div>
      </div>

      <section aria-labelledby="origin-heading" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 id="origin-heading" className="font-hf-heading text-3xl font-semibold text-hf-ink">
          {about.origin.heading}
        </h2>
        <p className="mt-5 leading-relaxed text-hf-body">{about.origin.intro}</p>
        <p className="mt-4 leading-relaxed text-hf-body">{about.origin.aboutParagraph}</p>
        <p className="mt-4 leading-relaxed text-hf-body">{about.origin.chefBio}</p>
      </section>

      <div className="text-hf-green">
        <RippleDivider />
      </div>

      <section aria-labelledby="kizhi-heading" className="bg-hf-green py-16 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <Reveal>
            <h2 id="kizhi-heading" className="font-hf-heading text-3xl font-semibold text-hf-amber">
              {about.kizhiPorotta.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">{about.kizhiPorotta.story}</p>
          </Reveal>
          <Reveal>
            <Image
              src={about.kizhiPorotta.photo.image}
              alt={about.kizhiPorotta.photo.alt}
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
              {about.chattiChoru.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-hf-body">{about.chattiChoru.story}</p>
            <p className="mt-3 leading-relaxed text-hf-body">{about.chattiChoru.bestSellerLine}</p>
          </Reveal>
          <Reveal className="md:order-1">
            <Image
              src={about.chattiChoru.photo.image}
              alt={about.chattiChoru.photo.alt}
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
            {about.miniMart.heading}
          </h2>
          <p className="mt-2 leading-relaxed text-hf-body">{about.miniMart.text}</p>
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
