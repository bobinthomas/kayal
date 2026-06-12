"use client";

import LoadCurtain from "@/components/motion/LoadCurtain";
import ScrollProgress from "@/components/motion/ScrollProgress";
import SmoothScroll from "@/components/motion/SmoothScroll";

/** Site-wide motion layer — smooth scroll, progress bar, load curtain. */
export default function MotionShell() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <LoadCurtain />
    </>
  );
}
