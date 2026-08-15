"use client";

import { formatPrice } from "@/data/menu";
import { menuFeaturedSpotlights } from "@/data/menu-meta";
import { scrollToSection } from "@/lib/scrollToSection";

export default function MenuFeaturedSpotlights() {
  return (
    <section
      aria-labelledby="menu-spotlights-heading"
      className="menu-spotlights"
    >
      <h2 id="menu-spotlights-heading" className="sr-only">
        Featured menu experiences
      </h2>
      <div className="menu-spotlights-grid">
        {menuFeaturedSpotlights.map((spotlight) => (
          <article key={spotlight.id} className="menu-spotlight-card">
            <p className="menu-spotlight-eyebrow">{spotlight.eyebrow}</p>
            <div className="menu-spotlight-heading-row">
              <h3 className="menu-spotlight-title">{spotlight.title}</h3>
              {"price" in spotlight && spotlight.price != null && (
                <p className="menu-spotlight-price">{formatPrice(spotlight.price)}</p>
              )}
            </div>
            {"subtitle" in spotlight && spotlight.subtitle && (
              <p className="menu-spotlight-subtitle">{spotlight.subtitle}</p>
            )}
            <p className="menu-spotlight-desc">{spotlight.description}</p>

            {"steps" in spotlight && spotlight.steps && (
              <ol className="menu-spotlight-steps">
                {spotlight.steps.map((step) => (
                  <li key={step.title} className="menu-spotlight-step">
                    <span className="menu-spotlight-step-label" aria-hidden="true">
                      {step.label}
                    </span>
                    <div>
                      <p className="menu-spotlight-step-title">{step.title}</p>
                      <p className="menu-spotlight-step-detail">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {"choiceGroups" in spotlight && spotlight.choiceGroups && (
              <div className="menu-choice-groups">
                {spotlight.choiceGroups.map((group, groupIndex) => (
                  <div
                    key={`${spotlight.id}-${group.label}-${groupIndex}`}
                    className="menu-choice-group"
                  >
                    <p className="menu-choice-group-label">{group.label}</p>
                    <ul className="menu-choice-list">
                      {group.options.map((opt) => (
                        <li key={opt}>{opt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {"href" in spotlight && spotlight.href && (
              <a
                href={spotlight.href}
                className="menu-text-link"
                onClick={(event) => {
                  const href = spotlight.href ?? "";
                  const id = href.replace(/^#/, "");
                  if (!id) return;
                  event.preventDefault();
                  scrollToSection(id);
                  window.history.replaceState(null, "", href);
                }}
              >
                Browse on menu →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
