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

const TITLE = "Menu & Prices | Kerala Restaurant Moorebank | Kayal Foods";
// $18.50 is the lowest-priced biryani menu-wide (veg biryani; content/menu.json
// "veg-biriyani") — not $19.90 (chicken biryani), since this sentence doesn't
// specify "chicken". Keep this in sync with content/menu.json if prices change.
const DESCRIPTION =
  "Full Kerala menu with prices — biryani from $18.50, chatti choru, kizhi porotta, meen pollichathu and rotating specials. Moorebank, Sydney. Book by phone.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/menu" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: "/og/menu.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og/menu.png"] },
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
        <div className="menu-page-body-inner">
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
      </div>
    </>
  );
}
