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
  const isFeatured = item.tags?.includes("signature") ?? false;
  // The featured box's own label already says "chef recommend", so the
  // signature pill would just repeat that — only show the other tags.
  const pillTags = isFeatured ? item.tags?.filter((tag) => tag !== "signature") : item.tags;

  const body = (
    <>
      <div className="menu-item-head">
        <h3 className="menu-item-name">{item.name}</h3>
        {item.price != null && <p className="menu-item-price">{formatPrice(item.price)}</p>}
      </div>
      {item.mal && (
        <p className="menu-item-mal" lang="ml">
          {item.mal}
        </p>
      )}
      {pillTags && pillTags.length > 0 && (
        <p className="menu-item-tags">
          {pillTags.map((tag) => {
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
      {item.desc && <p className="menu-item-desc">{item.desc}</p>}
    </>
  );

  if (isFeatured) {
    return (
      <article className="menu-item menu-item--featured">
        <p className="menu-item-featured-label">Chef Recommend</p>
        <div className="menu-item-featured-body">{body}</div>
      </article>
    );
  }

  return <article className="menu-item">{body}</article>;
}
