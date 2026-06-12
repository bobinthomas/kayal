import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import RippleDivider from "@/components/RippleDivider";
import WhatsAppSignup from "@/components/WhatsAppSignup";
import ReviewStrip from "@/components/ReviewStrip";
import SignatureShowcase from "@/components/SignatureShowcase";
import ScrollGallery from "@/components/motion/ScrollGallery";
import StorySection from "@/components/home/StorySection";
import SpecialsStrip from "@/components/home/SpecialsStrip";
import HoursSection from "@/components/home/HoursSection";
import FindingSection from "@/components/home/FindingSection";

export const metadata: Metadata = {
  title: "Kayal Foods — Authentic Kerala Restaurant in Moorebank, Sydney",
  description:
    "Kerala's village table, in Sydney. Chatti choru, kizhi porotta, toddy & game meats in Moorebank. Dine-in by booking — call (02) 9734 9634.",
  alternates: { canonical: "/" },
  openGraph: { images: [{ url: "/og/home.png", width: 1200, height: 630 }] },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ScrollGallery />
      <SignatureShowcase />

      <div className="text-banana-dark">
        <RippleDivider />
      </div>
      <StorySection />
      <div className="rotate-180 text-banana-dark">
        <RippleDivider />
      </div>

      <SpecialsStrip />
      <HoursSection />
      <FindingSection />
      <WhatsAppSignup />
      <ReviewStrip />
    </>
  );
}
