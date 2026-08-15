import Image from "next/image";
import Link from "next/link";
import { hfBentoDishes } from "@/data/home-figma";
import HfReveal from "./HfReveal";

export default function HfSignatures() {
  const [row1, row2] = [hfBentoDishes.slice(0, 2), hfBentoDishes.slice(2, 5)];

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 sm:px-10 lg:px-16">
        <HfReveal
          as="div"
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="flex max-w-[500px] flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">Visual Journeys</p>
            <p className="font-hf-heading text-3xl text-hf-ink sm:text-4xl">
              A visual journey through our signature dishes
            </p>
          </div>
          <Link
            href="/menu/"
            className="inline-flex shrink-0 items-center rounded-full border border-hf-ink px-6 py-3 text-sm font-semibold text-hf-ink hover:bg-hf-ink hover:text-white"
          >
            See More
          </Link>
        </HfReveal>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {row1.map(({ item, image }, i) => (
              <DishTile
                key={item.id}
                name={item.name}
                image={image}
                className="h-[280px] sm:h-[360px]"
                delayMs={i * 100}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {row2.map(({ item, image }, i) => (
              <DishTile
                key={item.id}
                name={item.name}
                image={image}
                className="h-[280px] sm:h-[400px]"
                delayMs={i * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DishTile({
  name,
  image,
  className,
  delayMs,
}: {
  name: string;
  image: string;
  className: string;
  delayMs: number;
}) {
  return (
    <HfReveal
      as="div"
      variant="up"
      delayMs={delayMs}
      className={`relative overflow-hidden rounded-3xl ${className}`}
    >
      <Link href="/menu/" className="group absolute inset-0 block">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
          <p className="font-hf-heading text-lg text-white">{name}</p>
        </div>
      </Link>
    </HfReveal>
  );
}
