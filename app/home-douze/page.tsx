import type { Metadata } from "next";
import DouzeShell from "@/components/home-douze/DouzeShell";
import DouzeHero from "@/components/home-douze/DouzeHero";
import { DouzeBenefitsMarquee, DouzePerksMarquee } from "@/components/home-douze/DouzeMarquee";
import DouzeSignatures from "@/components/home-douze/DouzeSignatures";
import DouzeEditorial from "@/components/home-douze/DouzeEditorial";
import DouzeCommitments from "@/components/home-douze/DouzeCommitments";
import DouzeTestimonials from "@/components/home-douze/DouzeTestimonials";
import DouzeFindUs from "@/components/home-douze/DouzeFindUs";
import DouzeNewsletter from "@/components/home-douze/DouzeNewsletter";

export const metadata: Metadata = {
  title: "Kayal Foods — Douze-style home preview",
  description:
    "Alternate home layout for Kayal Foods — editorial premium style inspired by Douze, with authentic Kerala restaurant content.",
  robots: { index: false, follow: false },
};

export default function HomeDouzePage() {
  return (
    <DouzeShell>
      <DouzeHero />
      <DouzeBenefitsMarquee />
      <DouzeSignatures />
      <DouzePerksMarquee />
      <DouzeEditorial />
      <DouzeCommitments />
      <DouzeTestimonials />
      <DouzeFindUs />
      <DouzeNewsletter />
    </DouzeShell>
  );
}
