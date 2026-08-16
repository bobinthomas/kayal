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
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-transform duration-300 hover:-translate-y-1 ${
        bold ? "border-hf-footer bg-hf-footer text-white" : "border-hf-border bg-white"
      }`}
    >
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-hf-heading text-xl font-semibold leading-tight">
            {item.name}
          </h3>
          {item.price != null && (
            <p
              className={`shrink-0 font-hf-heading text-xl font-bold tabular-nums ${
                bold ? "text-hf-amber" : "text-hf-red"
              }`}
            >
              {formatPrice(item.price)}
            </p>
          )}
        </div>
        {item.desc && (
          <p
            className={`mt-3 text-sm leading-relaxed ${
              bold ? "text-white/75" : "text-hf-body"
            }`}
          >
            {item.desc}
          </p>
        )}
        <p className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {item.tags?.includes("signature") && (
            <span className="rounded-full bg-hf-amber px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-hf-ink">
              Signature
            </span>
          )}
          {item.tags?.includes("spicy") && (
            <span className="rounded-full bg-hf-red px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Spicy
            </span>
          )}
          {item.tags?.includes("availability") && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                bold
                  ? "border border-hf-amber/40 text-hf-amber/90"
                  : "border border-hf-red/30 text-hf-red"
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
