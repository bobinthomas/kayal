"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, Heart, Users } from "lucide-react";
import { legacyPhoto } from "@/data/legacy-site";
import HomeCafeReveal from "@/components/home/HomeCafeReveal";

const values = [
  {
    id: "woodfire",
    icon: Flame,
    title: "Woodfire Kitchen",
    description: "Curries, fish and porotta cooked over flame — naadan style.",
  },
  {
    id: "care",
    icon: Heart,
    title: "Village Recipes",
    description: "Dishes passed down and prepared with the care of home.",
  },
  {
    id: "gather",
    icon: Users,
    title: "Gather at the Table",
    description: "Chatti service and shared plates meant for long lunches.",
  },
] as const;

export default function StorySection() {
  return (
    <section
      id="story-block"
      className="home-cafe-story"
      aria-labelledby="story-heading"
    >
      <div className="home-cafe-story-grid">
        <HomeCafeReveal className="home-cafe-story-media-wrap">
          <div className="home-cafe-story-media">
            <Image
              src={legacyPhoto(3).src}
              alt={legacyPhoto(3).alt}
              width={720}
              height={900}
              className="home-cafe-story-img"
            />
          </div>
          <aside className="home-cafe-story-badge" aria-label="Kayal Foods Moorebank">
            <span className="home-cafe-story-badge-label">Est.</span>
            <span className="home-cafe-story-badge-year">Moorebank</span>
            <span className="home-cafe-story-badge-line">Serving</span>
            <span className="home-cafe-story-badge-line">Kerala&apos;s Table</span>
            <span className="home-cafe-story-badge-line">Daily</span>
          </aside>
        </HomeCafeReveal>

        <div className="home-cafe-story-copy">
          <HomeCafeReveal>
            <p className="home-cafe-story-eyebrow">Our story</p>
          </HomeCafeReveal>

          <HomeCafeReveal delay={80}>
            <h2 id="story-heading" className="home-cafe-story-title">
              <span className="home-cafe-story-title-line">
                Kayal means backwater.
              </span>
              <span className="home-cafe-story-title-line">
                Spaces that connect.
              </span>
            </h2>
          </HomeCafeReveal>

          <HomeCafeReveal delay={140}>
            <p className="home-cafe-story-p">
              The lagoons where the kettuvallam drift, where the fish is pulled
              straight into the chatti, where lunch comes wrapped in banana leaf.
            </p>
          </HomeCafeReveal>
          <HomeCafeReveal delay={200}>
            <p className="home-cafe-story-p">
              That&apos;s the table we set in Moorebank — rabbit, quail, buffalo,
              wild venison, cooked the way the village cooks it.
            </p>
          </HomeCafeReveal>

          <ul className="home-cafe-values">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <li key={value.id}>
                  <HomeCafeReveal delay={260 + i * 80}>
                    <article className="home-cafe-value-card">
                      <span className="home-cafe-value-icon" aria-hidden="true">
                        <Icon strokeWidth={1.5} />
                      </span>
                      <h3 className="home-cafe-value-title">{value.title}</h3>
                      <p className="home-cafe-value-desc">{value.description}</p>
                    </article>
                  </HomeCafeReveal>
                </li>
              );
            })}
          </ul>

          <HomeCafeReveal delay={500}>
            <Link href="/about/" className="home-cafe-story-cta u-focus">
              Read our story
              <span className="home-cafe-story-cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </HomeCafeReveal>
        </div>
      </div>
    </section>
  );
}
