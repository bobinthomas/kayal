"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { restaurant } from "@/data/restaurant";
import { legacyPhoto } from "@/data/legacy-site";
import { HERO_VIDEO } from "@/data/landing";
import { track } from "@/lib/analytics";
import BoomerangVideoBg from "@/components/motion/BoomerangVideoBg";

const headlineLines = ["Kerala's village", "table, crafted", "for Sydney."];

const trustItems = ["Woodfire Kitchen", "Fresh Spices", "Moorebank"];

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerReducedMotion() {
  return false;
}

export default function Hero() {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  useEffect(() => {
    const el = document.querySelector(".home-cafe-hero");
    if (!el) return;
    if (reduced) {
      el.classList.add("is-ready");
      return;
    }
    const id = requestAnimationFrame(() => el.classList.add("is-ready"));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  const floatA = legacyPhoto(4);
  const floatB = legacyPhoto(5);

  return (
    <section className="home-cafe-hero" aria-label="Welcome">
      <div className="home-cafe-hero-botanical" aria-hidden="true">
        <svg className="home-cafe-hero-botanical-a" viewBox="0 0 200 320" fill="none">
          <path
            d="M100 20c-40 60-70 120-70 180 0 35 20 60 50 70"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </div>
      <div className="home-cafe-hero-grain" aria-hidden="true" />

      <div className="home-cafe-hero-grid">
        <div className="home-cafe-hero-copy">
          <p className="home-cafe-hero-eyebrow">
            Authentic naadan cooking · Moorebank
          </p>

          <h1 className="home-cafe-hero-title">
            {headlineLines.map((line, i) => (
              <span key={line} className="home-cafe-hero-line-mask">
                <span
                  className="home-cafe-hero-line"
                  style={{ animationDelay: `${320 + i * 110}ms` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="home-cafe-hero-lede">
            Chatti choru in earthen pots. Porotta parcels in charred banana leaf.
            Toddy, game meats and the recipes the village never wrote down.
          </p>

          <div className="home-cafe-hero-actions">
            <a
              href={`tel:${restaurant.phone.tel}`}
              onClick={() => track("call_tap", { placement: "hero" })}
              className="home-cafe-btn home-cafe-btn--primary u-focus"
            >
              Book a Table
            </a>
            <Link
              href="/menu/"
              onClick={() => track("menu_view", { placement: "hero" })}
              className="home-cafe-btn home-cafe-btn--outline u-focus"
            >
              See the Menu
            </Link>
          </div>

          <ul className="home-cafe-hero-trust" aria-label="Highlights">
            {trustItems.map((item, i) => (
              <li key={item} className="home-cafe-hero-trust-item">
                <Leaf className="home-cafe-hero-trust-icon" aria-hidden="true" strokeWidth={1.5} />
                <span>{item}</span>
                {i < trustItems.length - 1 && (
                  <span className="home-cafe-hero-trust-dot" aria-hidden="true">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="home-cafe-hero-visual" aria-hidden="true">
          <div className="home-cafe-hero-visual-main">
            <BoomerangVideoBg
              src={HERO_VIDEO}
              className="home-cafe-hero-video absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="home-cafe-hero-float home-cafe-hero-float--1">
            <Image
              src={floatA.src}
              alt=""
              width={280}
              height={320}
              className="home-cafe-hero-img"
            />
          </div>
          <div className="home-cafe-hero-float home-cafe-hero-float--2">
            <Image
              src={floatB.src}
              alt=""
              width={260}
              height={300}
              className="home-cafe-hero-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
