import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SpecialCard from "@/components/SpecialCard";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { gameSpecials, nonGameSpecials } from "@/data/specials";
import { restaurant } from "@/data/restaurant";
import PageHero from "@/components/PageHero";
import CallCta from "@/components/CallCta";

export const metadata: Metadata = {
  title: "Naadan Specials — Game Meats, Chatti & Kizhi Porotta",
  description:
    "Availability-based Kerala specials in Sydney: kizhi porotta, chatti choru, meen pollichathu, rabbit, quail, buffalo and wild venison. Call to check today's pot.",
  alternates: { canonical: "/specials" },
  openGraph: { images: [{ url: "/og/specials.png", width: 1200, height: 630 }] },
};

export default function SpecialsPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Specials", path: "/specials/" },
        ])}
      />
      <PageHero
        eyebrow="As per availability"
        title={
          <>
            From the village,{" "}
            <span className="italic text-hf-amber">when we can get it.</span>
          </>
        }
        subtitle="These dishes follow the catch, the season and the supplier's ute. If it's on this page, it's worth a phone call."
      >
        <CallCta placement="specials_hero" label={`Call to check today's pot — ${restaurant.phone.display}`} />
      </PageHero>

      <section aria-labelledby="game-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="game-heading" className="font-hf-heading text-3xl font-semibold text-hf-red">
          Rabbit. Quail. Buffalo. Wild venison.
        </h2>
        <p className="mt-2 max-w-xl text-hf-body">
          Cooked the way the village cooks it — dry-roasted ularthiyathu, black
          pepper, coconut slivers, curry leaves.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gameSpecials.map((item) => (
            <Reveal key={item.id}>
              <SpecialCard item={item} bold />
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="all-specials-heading" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 id="all-specials-heading" className="font-hf-heading text-3xl font-semibold text-hf-ink">
          The rest of the pot
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nonGameSpecials.map((item) => (
            <Reveal key={item.id}>
              <SpecialCard item={item} />
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-sm italic text-hf-body">
          All specials are as per availability and prices are subject to change.
        </p>
      </section>
    </>
  );
}
