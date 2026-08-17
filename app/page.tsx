import type { Metadata } from "next";
import HfHero from "@/components/home-figma/HfHero";
import HfDishMarquee from "@/components/home-figma/HfDishMarquee";
import HfHeritage from "@/components/home-figma/HfHeritage";
import HfSignatures from "@/components/home-figma/HfSignatures";
import HfVisit from "@/components/home-figma/HfVisit";
import HfPhilosophy from "@/components/home-figma/HfPhilosophy";
import HfSpotlights from "@/components/home-figma/HfSpotlights";
import HfTestimonials from "@/components/home-figma/HfTestimonials";
import HfNewsletter from "@/components/home-figma/HfNewsletter";

export const metadata: Metadata = {
  title: "Kayal Foods — Authentic Kerala Restaurant in Moorebank, Sydney",
  description:
    "Kerala's village table, in Sydney. Chatti choru, kizhi porotta, toddy & game meats in Moorebank. Dine-in by booking — call (02) 9734 9634.",
  alternates: { canonical: "/" },
  openGraph: { images: [{ url: "/og/home.png", width: 1200, height: 630 }] },
};

export default function HomePage() {
  return (
    <div className="hf-page bg-hf-bg font-hf-body text-hf-ink">
      <HfHero />
      <HfHeritage />
      <HfSignatures />
      <HfDishMarquee />
      <HfVisit />
      <HfPhilosophy />
      <HfSpotlights />
      <HfTestimonials />
      <HfNewsletter />
    </div>
  );
}
