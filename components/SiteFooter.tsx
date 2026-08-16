import { restaurant, formatSessions } from "@/data/restaurant";
import { hfFooterMenuLinks, formatPrice } from "@/data/home-figma";
import Link from "next/link";

/** Site-wide footer — same on every page. */
export default function SiteFooter() {
  return (
    <footer className="bg-hf-footer px-6 pb-10 pt-20 text-white sm:px-10 lg:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <div className="flex w-full max-w-[340px] flex-col gap-5">
            <div className="font-hf-heading">
              <p className="text-2xl font-bold text-white">Kayal Foods</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-hf-amber">
                Kerala&apos;s Village Table
              </p>
            </div>
            <p className="text-sm leading-relaxed text-white/60">{restaurant.positioning}</p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold uppercase text-white">Opening Hours</p>
            <div className="flex flex-col gap-2 text-[13px]">
              <p className="text-white/60">Monday – Friday</p>
              {restaurant.hours.monday.sessions.map((s) => (
                <p key={`${s.open}-${s.close}`} className="text-white">
                  {formatSessions([s])}
                </p>
              ))}
              <p className="pt-1 text-white/60">Sat – Sun</p>
              {restaurant.hours.saturday.sessions.map((s) => (
                <p key={`${s.open}-${s.close}`} className="text-white">
                  {formatSessions([s])}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold uppercase text-white">From Menu</p>
            <div className="flex flex-col gap-2 text-[13px] text-white/60">
              {hfFooterMenuLinks.map((item) => (
                <Link key={item.id} href="/menu/" className="hover:text-white">
                  {item.name} — {item.price ? formatPrice(item.price) : ""}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full max-w-[260px] flex-col gap-4">
            <p className="text-sm font-bold uppercase text-white">Address</p>
            <div className="flex flex-col gap-2.5 text-[13px]">
              <p className="text-white/60">{restaurant.address.full}</p>
              <a href={`tel:${restaurant.phone.tel}`} className="text-white hover:text-hf-amber">
                {restaurant.phone.display}
              </a>
              <a href={`mailto:${restaurant.email}`} className="text-white hover:text-hf-amber">
                {restaurant.email}
              </a>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-white/50 hover:text-white">
              Privacy policy
            </Link>
            <a href={restaurant.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/60 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
              </svg>
            </a>
            <a href={restaurant.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 2.16c-3.15 0-3.5.01-4.73.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.74-.35.34-.56.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.96.2 1.48.34 1.83.18.46.39.79.74 1.13.34.35.67.56 1.13.74.35.14.87.3 1.83.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.74.35-.34.56-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.83a3.05 3.05 0 0 0-.74-1.13 3.05 3.05 0 0 0-1.13-.74c-.35-.14-.87-.3-1.83-.34-1.23-.06-1.58-.07-4.73-.07Zm0 3.68a5.99 5.99 0 1 1 0 11.98 5.99 5.99 0 0 1 0-11.98Zm0 2.16a3.83 3.83 0 1 0 0 7.66 3.83 3.83 0 0 0 0-7.66Zm6.23-2.4a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
