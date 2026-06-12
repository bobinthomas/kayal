import Link from "next/link";
import { restaurant } from "@/data/restaurant";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl font-bold text-turmeric">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-leaf sm:text-4xl">
        This pot&apos;s empty.
      </h1>
      <p className="mt-3 max-w-md text-ink/75">
        The page you&apos;re after isn&apos;t on the stove. The menu, though, is
        very much on.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/menu"
          className="inline-flex min-h-12 items-center rounded-full bg-clay px-7 font-semibold text-cream transition-colors hover:bg-chilli"
        >
          See the Menu
        </Link>
        <a
          href={`tel:${restaurant.phone.tel}`}
          className="inline-flex min-h-12 items-center rounded-full border-2 border-leaf px-7 font-semibold text-leaf transition-colors hover:bg-leaf hover:text-cream"
        >
          Book a Table
        </a>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-full px-7 font-semibold text-leaf underline-offset-4 hover:underline"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
