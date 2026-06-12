"use client";

import Image from "next/image";
import { legacyPhoto } from "@/data/legacy-site";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";
import Parallax from "@/components/motion/Parallax";

export default function FindingUs({ full = false }: { full?: boolean }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <Parallax speed={0.4}>
        <figure className="overflow-hidden rounded-3xl ring-1 ring-leaf/15">
          <Image
            src={legacyPhoto(4).src}
            alt="Kayal Foods at 128 Nuwarra Road, Moorebank"
            width={800}
            height={600}
            className="aspect-[4/3] h-auto w-full object-cover"
          />
          <figcaption className="bg-banana-dark px-5 py-3 text-sm font-medium text-cream">
            Look for the white house — that&apos;s us.
          </figcaption>
        </figure>
      </Parallax>
      <Parallax speed={0.15}>
        <div>
          <h2 className="font-display text-3xl font-semibold text-leaf">
            {restaurant.findingUs.headline}
          </h2>
          <p className="mt-3 leading-relaxed text-ink/80">{restaurant.findingUs.blurb}</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-turmeric">◆</span>
              {restaurant.address.full}
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-turmeric">◆</span>
              {restaurant.findingUs.parkingNote}
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-turmeric">◆</span>
              Entrance at the front of the house — we&apos;ll see you coming.
            </li>
          </ul>
          <a
            href={restaurant.maps.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("directions_tap")}
            className="mt-6 inline-flex min-h-12 items-center rounded-full bg-clay px-7 font-semibold text-cream transition-colors hover:bg-chilli"
          >
            Get directions
          </a>
          {full && (
            <p className="mt-4 text-sm text-ink/60">
              Still circling? Call us on{" "}
              <a
                href={`tel:${restaurant.phone.tel}`}
                onClick={() => track("call_tap", { placement: "finding_us" })}
                className="font-semibold text-clay underline-offset-2 hover:underline"
              >
                {restaurant.phone.display}
              </a>{" "}
              and we&apos;ll talk you in.
            </p>
          )}
        </div>
      </Parallax>
    </div>
  );
}
