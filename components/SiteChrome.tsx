"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BookingBanner from "@/components/BookingBanner";
import MobileActionBar from "@/components/MobileActionBar";
import MotionShell from "@/components/motion/MotionShell";

const FULL_BLEED_PREVIEWS = ["/home-douze", "/admin"];

function isFullBleedPreview(pathname: string | null) {
  if (!pathname) return false;
  const normalized = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return FULL_BLEED_PREVIEWS.includes(normalized);
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullBleedPreview = isFullBleedPreview(pathname);
  const isHome = pathname === "" || pathname === "/";
  // Home keeps its full-bleed hero: no bottom padding, and no mobile
  // action bar / booking banner stacked under a floating (not in-flow) nav.
  const showMobileChrome = !fullBleedPreview && !isHome;

  return (
    <>
      <MotionShell />
      {!fullBleedPreview && <SiteHeader />}
      <main
        id="main"
        className={fullBleedPreview || isHome ? "flex-1" : "flex-1 pb-20 md:pb-0"}
      >
        {children}
      </main>
      {!fullBleedPreview && <SiteFooter />}
      {showMobileChrome && <BookingBanner />}
      {showMobileChrome && <MobileActionBar />}
    </>
  );
}
