import type { Metadata } from "next";
import MenuCategoryNav from "@/components/MenuCategoryNav";
import MenuSectionBlock from "@/components/MenuSectionBlock";
import JsonLd from "@/components/JsonLd";
import { buildMenuSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { menuSections, menuDisclaimer } from "@/data/menu";
import PageHero from "@/components/PageHero";
import { restaurant } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Menu — Kerala Curries, Biriyani & Naadan Specials",
  description:
    "The full Kayal Foods menu: Kerala fish curry, beef ularthiyathu, biriyani, chatti choru, kizhi porotta and naadan specials. Moorebank, Sydney.",
  alternates: { canonical: "/menu" },
  openGraph: { images: [{ url: "/og/menu.png", width: 1200, height: 630 }] },
};

export default function MenuPage() {
  return (
    <>
      <JsonLd
        data={[
          buildMenuSchema(),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Menu", path: "/menu/" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Naadan · Tandoor · Ocean"
        title={
          <>
            The <span className="italic text-turmeric">Menu</span>
          </>
        }
        subtitle={`Naadan curries, tandoor classics and the specials the village would recognise. Dine-in by booking — ${restaurant.phone.display}.`}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MenuCategoryNav />
        <div className="space-y-14 py-10">
          {menuSections.map((section) => (
            <MenuSectionBlock key={section.id} section={section} />
          ))}
        </div>
        <p className="border-t border-ink/10 py-8 text-sm italic text-ink/60">
          {menuDisclaimer}
        </p>
      </div>
    </>
  );
}
