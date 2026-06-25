"use client";

import Image from "next/image";
import Link from "next/link";
import { legacyPhoto } from "@/data/legacy-site";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";

export default function DouzeHero() {
  const heroImg = legacyPhoto(4);

  return (
    <section className="douze-hero" aria-label="Welcome">
      <div className="douze-hero-grid">
        <div className="douze-hero-copy">
          <h1 className="douze-hero-title">
            <span className="douze-hero-line">Chatti Choru</span>
            <span className="douze-hero-line douze-hero-italic">&amp; Kizhi Porotta.</span>
            <span className="douze-hero-line douze-hero-sub">
              <em>Kerala&apos;s village table.</em>
            </span>
          </h1>

          <div className="douze-hero-actions">
            <a
              href={`tel:${restaurant.phone.tel}`}
              onClick={() => track("call_tap", { placement: "douze_hero" })}
              className="douze-btn douze-btn--fill"
            >
              Book a table
            </a>
            <Link href="/menu/" className="douze-btn douze-btn--ghost">
              See the menu
            </Link>
          </div>
        </div>

        <div className="douze-hero-visual">
          <Image
            src={heroImg.src}
            alt={heroImg.alt}
            width={900}
            height={1100}
            priority
            className="douze-hero-img"
          />
        </div>
      </div>
    </section>
  );
}
