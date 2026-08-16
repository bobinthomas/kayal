import Image from "next/image";
import Link from "next/link";
import { hfBentoDishes, formatPrice } from "@/data/home-figma";
import HfReveal from "./HfReveal";

const featured = ["kizhi-porotta", "meen-pollichathu", "thalassery-biryani", "kerala-fish-curry"];

export default function HfSignatures() {
  const dishes = featured.map((id) => hfBentoDishes.find(({ item }) => item.id === id)!);

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-16">
        <HfReveal as="div" className="flex max-w-[320px] flex-col gap-3 lg:shrink-0">
          <p className="text-xs font-bold uppercase tracking-widest text-hf-red">Signature Dishes</p>
          <p className="font-hf-heading text-3xl text-hf-ink sm:text-4xl">
            Naadan flavors, crafted to delight every sense
          </p>
        </HfReveal>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {dishes.map(({ item, image }, i) => (
            <HfReveal key={item.id} as="div" variant="up" delayMs={i * 100}>
              <Link href="/menu/" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    src={image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.price != null && (
                    <span
                      className="absolute right-0 top-0 rounded-tr-2xl bg-white px-3.5 py-2 text-sm font-semibold text-hf-ink"
                      style={{
                        WebkitMaskImage:
                          "radial-gradient(circle 14px at 0 100%, transparent 99%, black 100%)",
                        maskImage:
                          "radial-gradient(circle 14px at 0 100%, transparent 99%, black 100%)",
                      }}
                    >
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
                <p className="mt-4 font-hf-heading text-lg font-semibold text-hf-ink">{item.name}</p>
                {item.desc && (
                  <p className="mt-1 text-sm leading-relaxed text-hf-body">{item.desc}</p>
                )}
              </Link>
            </HfReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
