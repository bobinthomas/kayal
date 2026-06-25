"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Plus } from "lucide-react";
import { menuSections } from "@/data/menu";
import { menuNavLabels } from "@/data/menu-meta";
import { scrollToSection } from "@/lib/scrollToSection";

export default function MenuCategoryNav() {
  const [active, setActive] = useState(menuSections[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-32% 0px -58% 0px" },
    );
    for (const section of menuSections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash || !menuSections.some((s) => s.id === hash)) return;
    const id = requestAnimationFrame(() => scrollToSection(hash));
    return () => cancelAnimationFrame(id);
  }, []);

  const goTo = (id: string, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileOpen(false);
    setActive(id);
    scrollToSection(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="menu-category-shell no-print">
      <div className="menu-category-inner">
        <div className="menu-category-mobile-bar lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="menu-category-toggle u-focus"
            aria-expanded={mobileOpen}
            aria-controls="menu-category-list"
          >
            Categories
            <Plus
              className={`menu-category-plus ${mobileOpen ? "is-open" : ""}`}
              aria-hidden="true"
            />
          </button>
          <span className="menu-category-active-label">
            {menuNavLabels[active] ?? "Menu"}
          </span>
        </div>

        <nav
          id="menu-category-list"
          aria-label="Menu categories"
          className={`menu-category-nav ${mobileOpen ? "is-open" : ""}`}
        >
          <ul className="menu-category-list">
            {menuSections.map((section) => {
              const label = menuNavLabels[section.id] ?? section.title;
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => goTo(section.id, event)}
                    aria-current={isActive ? "true" : undefined}
                    className={`menu-category-link u-focus ${isActive ? "is-active" : ""}`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
