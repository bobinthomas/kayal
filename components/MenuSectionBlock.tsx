import type { MenuSection } from "@/data/menu";
import MenuItemRow from "@/components/MenuItemRow";

export default function MenuSectionBlock({ section }: { section: MenuSection }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-32">
      <div className="flex items-baseline gap-4">
        <h2
          id={`${section.id}-heading`}
          className="font-display text-2xl font-semibold text-leaf sm:text-3xl"
        >
          {section.title}
        </h2>
        <div className="gold-rule mb-1 flex-1" aria-hidden="true" />
      </div>
      {section.note && (
        <p className="mt-1 text-sm font-medium italic text-clay">{section.note}</p>
      )}
      <div className="mt-2 divide-y divide-ink/10">
        {section.items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
