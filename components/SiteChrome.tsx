"use client";

import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBanner from "@/components/BookingBanner";
import MobileActionBar from "@/components/MobileActionBar";
import MotionShell from "@/components/motion/MotionShell";

export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <MotionShell />
      <Header />
      <main id="main" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <BookingBanner />
      <MobileActionBar />
    </>
  );
}
