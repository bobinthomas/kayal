"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBanner from "@/components/BookingBanner";
import MobileActionBar from "@/components/MobileActionBar";
import MotionShell from "@/components/motion/MotionShell";

const FULL_BLEED_PREVIEWS = ["", "/home-douze", "/admin"];

function isFullBleedPreview(pathname: string | null) {
  if (!pathname) return false;
  const normalized = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return FULL_BLEED_PREVIEWS.includes(normalized);
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullBleedPreview = isFullBleedPreview(pathname);

  return (
    <>
      <MotionShell />
      {!fullBleedPreview && <Header />}
      <main
        id="main"
        className={fullBleedPreview ? "flex-1" : "flex-1 pb-20 md:pb-0"}
      >
        {children}
      </main>
      {!fullBleedPreview && <Footer />}
      {!fullBleedPreview && <BookingBanner />}
      {!fullBleedPreview && <MobileActionBar />}
    </>
  );
}
