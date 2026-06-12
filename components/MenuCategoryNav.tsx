"use client";

import { useEffect, useState } from "react";
import { menuSections } from "@/data/menu";

const shortLabels: Record<string, string> = {
  "starters-veg": "Starters – Veg",
  "starters-nonveg": "Starters – Non-Veg",
  "mains-veg": "Mains – Vegetarian",
  ocean: "From the Ocean",
  meat: "Meat & Poultry",
  "rice-breads": "Rice & Breads",
  "sides-desserts": "Sides & Desserts",
  drinks: "Drinks",
  specials: "Specials",
};

/** Sticky in-page category nav with scroll-spy; horizontal scroll on mobile. */
export default function MenuCategoryNav() {
  const [active, setActive] = useState<string>(menuSections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const section of menuSections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Menu sections"
      className="no-print sticky top-[60px] z-40 -mx-4 border-b border-leaf/10 bg-cream/95 px-4 backdrop-blur sm:-mx-6 sm:px-6"
    >
      <ul className="flex gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menuSections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
                active === section.id
                  ? "bg-leaf text-cream"
                  : "text-leaf hover:bg-leaf/10"
              }`}
            >
              {shortLabels[section.id] ?? section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
