import { formatPrice, type MenuItem } from "@/data/menu";

export default function SpecialCard({
  item,
  bold = false,
}: {
  item: MenuItem;
  bold?: boolean;
}) {
  return (
    <article
      className={`signature-card group flex h-full flex-col ${
        bold ? "signature-card-dark text-cream" : ""
      }`}
    >
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-display text-xl font-semibold leading-tight"
            style={{ fontVariationSettings: '"WONK" 0.6' }}
          >
            {item.name}
          </h3>
          {item.price != null && (
            <p
              className={`price-underline shrink-0 font-display text-xl font-bold tabular-nums ${
                bold ? "text-turmeric" : "text-clay"
              }`}
            >
              {formatPrice(item.price)}
            </p>
          )}
        </div>
        {item.desc && (
          <p
            className={`mt-3 text-sm leading-relaxed ${
              bold ? "text-cream/75" : "text-ink/65"
            }`}
          >
            {item.desc}
          </p>
        )}
        <p className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {item.tags?.includes("signature") && (
            <span className="rounded-full bg-turmeric px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
              Signature
            </span>
          )}
          {item.tags?.includes("spicy") && (
            <span className="rounded-full bg-chilli px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cream">
              Spicy
            </span>
          )}
          {item.tags?.includes("availability") && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                bold
                  ? "border border-turmeric/40 text-turmeric/90"
                  : "border border-clay/30 text-clay"
              }`}
            >
              As per availability
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
