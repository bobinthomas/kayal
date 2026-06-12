import { formatPrice, type MenuItem } from "@/data/menu";

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "signature" | "availability" | "veg" | "spicy" | "game";
}) {
  const tones: Record<string, string> = {
    signature: "bg-turmeric text-ink",
    availability: "bg-cream text-clay border border-clay/40",
    veg: "bg-curryleaf/15 text-leaf border border-curryleaf/40",
    spicy: "bg-chilli/10 text-chilli border border-chilli/30",
    game: "bg-banana-dark text-turmeric",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <div className="group py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-medium leading-snug">
          {item.name}
          {item.qtyNote && (
            <span className="ml-1.5 font-sans text-sm font-normal text-ink/60">
              {item.qtyNote}
            </span>
          )}
        </h3>
        <span
          aria-hidden="true"
          className="mx-1 hidden flex-1 border-b border-dotted border-ink/25 sm:block"
        />
        <p className="shrink-0 font-display text-lg font-semibold tabular-nums text-clay">
          {item.variants?.length ? (
            <span className="flex flex-col items-end gap-0.5 text-base sm:flex-row sm:gap-3">
              {item.variants.map((v) => (
                <span key={v.label} className="price-underline whitespace-nowrap">
                  {v.label} {formatPrice(v.price)}
                </span>
              ))}
            </span>
          ) : (
            <span className="price-underline">{formatPrice(item.price)}</span>
          )}
        </p>
      </div>
      {item.description && (
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/70">
          {item.description}
        </p>
      )}
      {item.tags && item.tags.length > 0 && (
        <p className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.includes("signature") && <Badge tone="signature">Signature</Badge>}
          {item.tags.includes("availability") && (
            <Badge tone="availability">As per availability</Badge>
          )}
          {item.tags.includes("veg") && <Badge tone="veg">Veg</Badge>}
          {item.tags.includes("spicy") && <Badge tone="spicy">🌶 Spicy</Badge>}
          {item.tags.includes("game") && <Badge tone="game">Game meat</Badge>}
        </p>
      )}
    </div>
  );
}
