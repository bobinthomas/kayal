import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Parallax from "@/components/motion/Parallax";
import SectionScene from "@/components/motion/SectionScene";
import { legacyPhoto } from "@/data/legacy-site";
import { formatPrice } from "@/data/menu";

type Signature = {
  name: string;
  malayalam?: string;
  price?: number;
  image: string;
  alt: string;
  blurb: string;
  badge: string;
  featured?: boolean;
};

const signatures: Signature[] = [
  {
    name: "Chatti Choru",
    malayalam: "ചട്ടി ചോർ",
    price: 25.0,
    image: legacyPhoto(0).src,
    alt: "Chatti choru — rice and curries served in a wide earthen pot",
    blurb:
      "Rice and a parade of curries in a wide earthen pot — our best seller, and the closest thing to a Kerala home kitchen this side of the ocean.",
    badge: "Best seller",
    featured: true,
  },
  {
    name: "Kizhi Porotta",
    malayalam: "കിഴി പൊറോട്ട",
    price: 25.0,
    image: legacyPhoto(1).src,
    alt: "Kizhi porotta — banana leaf parcel tied with a knot",
    blurb:
      "Porotta and fried curry meat, wrapped in banana leaf and tied like an ayurveda herb bundle — steamed, then charred on the skillet with coconut oil.",
    badge: "Signature",
  },
  {
    name: "Kallu · Toddy",
    price: undefined,
    image: legacyPhoto(2).src,
    alt: "Kallu toddy served in a traditional clay cup",
    blurb:
      "Yes — toddy in Sydney. The village pour that built a thousand shappu lunches, alongside the food it was always meant to meet.",
    badge: "Only here",
  },
];

export default function SignatureShowcase() {
  return (
    <SectionScene
      id="signatures-block"
      aria-labelledby="signatures-heading"
      intensity="bold"
      className="overflow-hidden px-4 py-20 sm:px-6 sm:py-28"
      parallaxLayers={[
        {
          speed: 0.4,
          className: "right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(111,168,75,0.12),transparent_60%)]",
          node: <div className="h-full w-full" />,
        },
      ]}
    >
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          id="signatures-heading"
          eyebrow="Signatures"
          title={
            <>
              <span className="block">The dishes that</span>
              <span className="block italic text-clay">built the house</span>
            </>
          }
          subtitle="Three plates that tell you everything about who we are — before you've ordered a thing."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-12 md:grid-rows-2 md:gap-6">
          {signatures.map((dish, i) => {
            const isFeatured = dish.featured;
            return (
              <Parallax
                key={dish.name}
                speed={isFeatured ? 0.2 : 0.35 + i * 0.05}
                className={`section-stagger-card signature-card group flex flex-col ${
                  isFeatured ? "signature-card-dark md:col-span-7 md:row-span-2" : "md:col-span-5"
                } ${i === 2 ? "md:col-start-8" : ""}`}
              >
                <article className="flex h-full flex-col">
                  <div className={`relative overflow-hidden ${isFeatured ? "h-64 md:h-[55%]" : "h-44"}`}>
                    <Image
                      src={dish.image}
                      alt={dish.alt}
                      width={800}
                      height={600}
                      className="signature-img h-full w-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 ${
                        isFeatured
                          ? "bg-gradient-to-t from-banana-dark via-banana-dark/20 to-transparent"
                          : "bg-gradient-to-t from-ink/50 via-transparent to-transparent"
                      }`}
                    />
                    <span
                      className={`absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                        isFeatured
                          ? "bg-turmeric text-ink"
                          : "bg-chilli/90 text-cream backdrop-blur-sm"
                      }`}
                    >
                      {dish.badge}
                    </span>
                  </div>

                  <div className={`flex flex-1 flex-col p-6 sm:p-8 ${isFeatured ? "md:p-10" : ""}`}>
                    {dish.malayalam && (
                      <p
                        className={`text-sm tracking-wide ${
                          isFeatured ? "text-turmeric/70" : "text-leaf/50"
                        }`}
                        lang="ml"
                      >
                        {dish.malayalam}
                      </p>
                    )}
                    <div className="mt-1 flex items-baseline justify-between gap-3">
                      <h3
                        className={`font-display font-semibold leading-tight ${
                          isFeatured ? "text-3xl sm:text-4xl" : "text-2xl"
                        }`}
                        style={{ fontVariationSettings: '"WONK" 1' }}
                      >
                        {dish.name}
                      </h3>
                      {dish.price && (
                        <span
                          className={`price-underline shrink-0 font-display text-xl font-bold tabular-nums ${
                            isFeatured ? "text-turmeric" : "text-clay"
                          }`}
                        >
                          {formatPrice(dish.price)}
                        </span>
                      )}
                    </div>
                    <p
                      className={`mt-3 flex-1 text-sm leading-relaxed sm:text-[15px] ${
                        isFeatured ? "text-cream/75 md:max-w-md" : "text-ink/65"
                      }`}
                    >
                      {dish.blurb}
                    </p>
                    {isFeatured && (
                      <Link
                        href="/menu#specials"
                        className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-turmeric transition-colors hover:text-cream"
                      >
                        See on the menu
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                </article>
              </Parallax>
            );
          })}
        </div>
      </div>
    </SectionScene>
  );
}
