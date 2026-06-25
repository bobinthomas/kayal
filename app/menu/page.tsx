import type { Metadata } from "next";
import MenuPageHero from "@/components/menu/MenuPageHero";
import MenuCategoryNav from "@/components/MenuCategoryNav";
import MenuIntro from "@/components/menu/MenuIntro";
import MenuFeaturedSpotlights from "@/components/menu/MenuFeaturedSpotlights";
import MenuSectionBlock from "@/components/MenuSectionBlock";
import JsonLd from "@/components/JsonLd";
import WhatsAppCta from "@/components/WhatsAppCta";
import { buildMenuSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { menuSections, menuDisclaimer, tagLegend } from "@/data/menu";

export const metadata: Metadata = {
  title: "Menu — Kerala Woodfire Kitchen",
  description:
    "Full Kayal Foods menu: starters, dosa & appam, seafood, biryani, breads, and naadan signatures. Moorebank, Sydney.",
  alternates: { canonical: "/menu" },
  openGraph: { images: [{ url: "/images/og.jpg", width: 1200, height: 630 }] },
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

      <div className="menu-page">
        <MenuPageHero />
        <MenuCategoryNav />

        <MenuIntro />
        <MenuFeaturedSpotlights />

        <div className="menu-page-body">
        {menuSections.map((section) => (
          <MenuSectionBlock key={section.id} section={section} />
        ))}

        <aside className="menu-legend" aria-labelledby="tag-legend-heading">
          <h2 id="tag-legend-heading" className="menu-legend-title">
            Dietary key
          </h2>
          <ul className="menu-legend-list">
            {tagLegend.map(({ tag, label }) => (
              <li key={tag}>{label}</li>
            ))}
          </ul>
        </aside>

        <footer className="menu-page-footer">
          <p className="menu-disclaimer">{menuDisclaimer}</p>
          <WhatsAppCta placement="menu_footer" label="Book on WhatsApp" />
        </footer>
      </div>
      </div>
    </>
  );
}
