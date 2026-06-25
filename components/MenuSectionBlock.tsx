import type { MenuSection } from "@/data/menu";
import MenuItemRow from "@/components/MenuItemRow";

export default function MenuSectionBlock({ section }: { section: MenuSection }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="menu-section"
    >
      <h2 id={`${section.id}-heading`} className="menu-section-title">
        {section.title}
      </h2>
      <p className="menu-section-blurb">{section.blurb}</p>
      <div className="menu-section-items">
        {section.items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
