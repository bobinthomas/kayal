import type { Metadata } from "next";
import HfShell from "@/components/home-figma/HfShell";
import HfHero from "@/components/home-figma/HfHero";
import HfSignatures from "@/components/home-figma/HfSignatures";
import HfMangoHero from "@/components/home-figma/HfMangoHero";
import HfVisit from "@/components/home-figma/HfVisit";
import HfPhilosophy from "@/components/home-figma/HfPhilosophy";
import HfSpotlights from "@/components/home-figma/HfSpotlights";
import HfTestimonials from "@/components/home-figma/HfTestimonials";
import HfNewsletter from "@/components/home-figma/HfNewsletter";
import { neuton, outfit, googleSansFlex, cormorantBold } from "./home-figma/fonts";

export const metadata: Metadata = {
  title: "Kayal Foods — Authentic Kerala Restaurant in Moorebank, Sydney",
  description:
    "Kerala's village table, in Sydney. Chatti choru, kizhi porotta, toddy & game meats in Moorebank. Dine-in by booking — call (02) 9734 9634.",
  alternates: { canonical: "/" },
  openGraph: { images: [{ url: "/og/home.png", width: 1200, height: 630 }] },
};

export default function HomePage() {
  return (
    <div className={`${neuton.variable} ${outfit.variable} ${googleSansFlex.variable} ${cormorantBold.variable}`}>
      <HfShell>
        <HfHero />
        <HfSignatures />
        <HfMangoHero />
        <HfVisit />
        <HfPhilosophy />
        <HfSpotlights />
        <HfTestimonials />
        <HfNewsletter />
      </HfShell>
    </div>
  );
}
