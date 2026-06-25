"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBanner from "@/components/BookingBanner";
import MobileActionBar from "@/components/MobileActionBar";
import MotionShell from "@/components/motion/MotionShell";

function isDouzePreview(pathname: string | null) {
  return pathname === "/home-douze" || pathname === "/home-douze/";
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const douzePreview = isDouzePreview(pathname);

  return (
    <>
      <MotionShell />
      {!douzePreview && <Header />}
      <main
        id="main"
        className={douzePreview ? "flex-1" : "flex-1 pb-20 md:pb-0"}
      >
        {children}
      </main>
      {!douzePreview && <Footer />}
      {!douzePreview && <BookingBanner />}
      {!douzePreview && <MobileActionBar />}
    </>
  );
}
