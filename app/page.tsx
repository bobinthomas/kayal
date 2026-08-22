import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildRestaurantSchema } from "@/lib/schema";
import HfHero from "@/components/home-figma/HfHero";
import HfDishMarquee from "@/components/home-figma/HfDishMarquee";
import HfHeritage from "@/components/home-figma/HfHeritage";
import HfSignatures from "@/components/home-figma/HfSignatures";
import HfVisit from "@/components/home-figma/HfVisit";
import HfPhilosophy from "@/components/home-figma/HfPhilosophy";
import HfSpotlights from "@/components/home-figma/HfSpotlights";
import HfTestimonials from "@/components/home-figma/HfTestimonials";
import HfNewsletter from "@/components/home-figma/HfNewsletter";
import PromoPopup from "@/components/PromoPopup";

const TITLE = "Kerala Restaurant Moorebank, Sydney | Kayal Foods";
const DESCRIPTION =
  "Authentic Kerala food in Moorebank, minutes from Liverpool. Chatti choru, kizhi porotta and naadan specials. Dine-in by booking — call (02) 9734 9634.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: "/og/home.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og/home.png"] },
};

export default function HomePage() {
  return (
    <div className="hf-page bg-hf-bg font-hf-body text-hf-ink">
      <JsonLd data={buildRestaurantSchema()} />
      <HfHero />
      <HfHeritage />
      <HfSignatures />
      <HfDishMarquee />
      <HfVisit />
      <HfPhilosophy />
      <HfSpotlights />
      <HfTestimonials />
      <HfNewsletter />
      <PromoPopup />
    </div>
  );
}
