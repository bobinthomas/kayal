"use client";

import Image from "next/image";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";
import HfReveal from "./HfReveal";

export default function HfNewsletter() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-16">
      <HfReveal
        as="div"
        variant="scale"
        className="flex flex-col overflow-hidden rounded-3xl bg-hf-green shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:flex-row"
      >
        <div className="relative h-[220px] w-full sm:h-auto sm:flex-1">
          <Image
            src="/images/home-figma/newsletter.png"
            alt="Naadan sadya spread on a banana leaf at Kayal Foods"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-6 p-8 sm:p-12">
          <div className="flex flex-col gap-2 text-white">
            <p className="font-hf-heading text-[28px] font-bold">
              Join Our WhatsApp Group
            </p>
            <p className="text-sm text-white/90">
              {restaurant.whatsapp.consentCopy}
            </p>
          </div>
          <a
            href={`https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(restaurant.whatsapp.joinMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_tap", { placement: "hf_newsletter" })}
            className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-hf-ink transition-transform hover:scale-[1.03]"
          >
            Join on WhatsApp
          </a>
        </div>
      </HfReveal>
      </div>
    </section>
  );
}
