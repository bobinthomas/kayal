"use client";

import FindingUs from "@/components/FindingUs";
import SectionHeading from "@/components/SectionHeading";
import SectionScene from "@/components/motion/SectionScene";

export default function FindingSection() {
  return (
    <SectionScene
      id="finding-block"
      aria-labelledby="finding-heading"
      intensity="subtle"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      parallaxLayers={[
        {
          speed: 0.3,
          className: "left-0 top-0 h-32 w-full bg-gradient-to-b from-turmeric/5 to-transparent",
          node: <div className="h-full w-full" />,
        },
      ]}
    >
      <SectionHeading
        id="finding-heading"
        eyebrow="Finding us"
        title={
          <>
            Look for the{" "}
            <span className="italic text-clay">white house</span>
          </>
        }
        subtitle="No big sign — just warm lights and the smell of curry leaves on Nuwarra Road."
      />
      <div className="mt-12">
        <FindingUs />
      </div>
    </SectionScene>
  );
}
