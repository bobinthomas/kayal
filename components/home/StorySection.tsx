"use client";

import Image from "next/image";
import Link from "next/link";
import { legacyPhoto } from "@/data/legacy-site";
import SectionHeading from "@/components/SectionHeading";
import MistClouds from "@/components/motion/MistClouds";
import Parallax from "@/components/motion/Parallax";
import SectionScene from "@/components/motion/SectionScene";

export default function StorySection() {
  return (
    <SectionScene
      id="story-block"
      aria-labelledby="story-heading"
      intensity="bold"
      className="overflow-hidden bg-banana-dark py-20 text-cream sm:py-28"
      parallaxLayers={[
        {
          speed: 0.7,
          className: "-right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-turmeric/10 blur-3xl",
          node: <div className="h-full w-full rounded-full bg-turmeric/20" />,
        },
        {
          speed: 0.35,
          className: "-left-16 bottom-0 h-48 w-72 rounded-full bg-leaf/20 blur-2xl",
          node: <div className="h-full w-full rounded-full bg-curryleaf/30" />,
        },
      ]}
    >
      <MistClouds />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="story-heading"
            eyebrow="Our story"
            title={
              <>
                Kayal means{" "}
                <span className="italic text-turmeric">backwater.</span>
              </>
            }
            subtitle="The lagoons where the kettuvallam drift, where the fish is pulled straight into the chatti, where lunch comes wrapped in banana leaf."
            tone="light"
          />
          <p className="mt-6 leading-relaxed text-cream/75">
            That&apos;s the table we set in Moorebank — rabbit, quail, buffalo,
            wild venison, cooked the way the village cooks it.
          </p>
          <Link
            href="/about"
            className="btn-ghost-luxury mt-8 inline-flex min-h-12 items-center rounded-full border border-turmeric/50 px-8 text-sm font-semibold tracking-wide text-turmeric"
          >
            Read our story
          </Link>
        </div>

        <Parallax speed={0.45} className="relative">
          <div className="story-frame">
            <Image
              src={legacyPhoto(3).src}
              alt={legacyPhoto(3).alt}
              width={800}
              height={500}
              className="relative z-10 w-full rounded-2xl shadow-2xl shadow-black/40"
            />
          </div>
        </Parallax>
      </div>
    </SectionScene>
  );
}
