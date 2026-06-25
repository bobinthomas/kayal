import { formatPrice, type MenuItem, type MenuTag } from "@/data/menu";

const tagLabels: Record<MenuTag, string> = {
  veg: "Veg",
  spicy: "Spicy",
  signature: "Signature",
  availability: "As per availability",
};

export default function MenuItemRow({ item }: { item: MenuItem }) {
  const isVeg = item.tags?.includes("veg");

  return (
    <article className="menu-item">
      <h3 className="menu-item-name">
        {item.name}
        {isVeg && <span className="menu-item-veg"> (V)</span>}
      </h3>
      {item.mal && (
        <p className="menu-item-mal" lang="ml">
          {item.mal}
        </p>
      )}
      {item.price != null && (
        <p className="menu-item-price">{formatPrice(item.price)}</p>
      )}
      {item.desc && <p className="menu-item-desc">{item.desc}</p>}
      {item.tags && item.tags.filter((t) => t !== "veg").length > 0 && (
        <p className="menu-item-tags">
          {item.tags
            .filter((t) => t !== "veg")
            .map((tag) => (
              <span key={tag}>{tagLabels[tag]}</span>
            ))}
        </p>
      )}
    </article>
  );
}
