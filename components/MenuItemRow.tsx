import { Leaf, Flame, Star, Clock } from "lucide-react";
import { formatPrice, tagLegend, type MenuItem, type MenuTag } from "@/data/menu";

const tagLabels: Record<MenuTag, string> = Object.fromEntries(
  tagLegend.map(({ tag, label }) => [tag, label]),
) as Record<MenuTag, string>;

const tagIcons: Record<MenuTag, typeof Leaf> = {
  veg: Leaf,
  spicy: Flame,
  signature: Star,
  availability: Clock,
};

export default function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <article className="menu-item">
      <h3 className="menu-item-name">{item.name}</h3>
      {item.mal && (
        <p className="menu-item-mal" lang="ml">
          {item.mal}
        </p>
      )}
      {item.price != null && (
        <p className="menu-item-price">{formatPrice(item.price)}</p>
      )}
      {item.desc && <p className="menu-item-desc">{item.desc}</p>}
      {item.tags && item.tags.length > 0 && (
        <p className="menu-item-tags">
          {item.tags.map((tag) => {
            const Icon = tagIcons[tag];
            return (
              <span key={tag} className="menu-item-tag">
                <Icon aria-hidden="true" />
                {tagLabels[tag]}
              </span>
            );
          })}
        </p>
      )}
    </article>
  );
}
