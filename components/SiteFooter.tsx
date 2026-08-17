import { restaurant, formatSessions } from "@/data/restaurant";
import { hfNavLinks } from "@/data/home-figma";
import Link from "next/link";
import CallCta from "@/components/CallCta";
import WhatsAppCta from "@/components/WhatsAppCta";

const [exploreLinks, visitLinks] = [
  hfNavLinks.slice(0, 3),
  [...hfNavLinks.slice(3), { href: "/privacy", label: "Privacy policy" }],
];

/** Site-wide footer — same on every page. */
export default function SiteFooter() {
  return (
    <div className="bg-hf-bg px-3 pt-3 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
    <footer className="relative overflow-hidden rounded-[1.5rem] bg-hf-green px-6 pb-10 pt-16 text-white sm:rounded-[2rem] sm:px-10 lg:px-20">
      {/* Backwater ripples — "kayal" means lagoon */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute -bottom-10 left-[-10%] w-[130%] text-hf-green-dark/60 blur-2xl"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0 110c160-40 320-40 480 0s320 40 480 0 320-40 480 0v90H0z" />
        </svg>
        <svg
          className="absolute -bottom-16 left-[-5%] w-[120%] text-black/25 blur-3xl"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0 130c180-50 360-50 540 0s360 50 540 0 360-50 360 0v90H0z" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(226,149,36,0.10),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-14">
        {/* Reservation band */}
        <div className="flex flex-wrap items-start justify-between gap-10">
          <h2 className="max-w-md font-hf-display text-[clamp(1.85rem,4vw,3rem)] font-light leading-[1.12]">
            Taste Kerala&apos;s village table — book your visit today
          </h2>
          <div className="flex flex-col items-start gap-3">
            <a
              href={`mailto:${restaurant.email}`}
              className="text-base font-medium text-hf-amber underline underline-offset-4 hover:text-white"
            >
              {restaurant.email}
            </a>
            <a href={`tel:${restaurant.phone.tel}`} className="text-sm text-white/70 hover:text-white">
              {restaurant.phone.display}
            </a>
            <p className="text-sm text-white/70">{restaurant.address.full}</p>
            <div className="mt-2">
              <CallCta placement="footer_reserve" label="Reserve a table" />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/15" />

        {/* Signup + hours + links */}
        <div className="flex flex-wrap items-start justify-between gap-12">
          <div className="flex w-full max-w-[280px] flex-col gap-4">
            <p className="text-sm text-white/80">
              Join our WhatsApp group for offers and updates.
            </p>
            <WhatsAppCta
              placement="footer_signup"
              message={restaurant.whatsapp.joinMessage}
              label="Join our WhatsApp group"
            />
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
            <p className="text-sm font-bold uppercase text-white">Explore</p>
            <div className="flex flex-col gap-2 text-[13px] text-white/60">
              {exploreLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold uppercase text-white">Visit</p>
            <div className="flex flex-col gap-2 text-[13px] text-white/60">
              {visitLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wordmark + copyright */}
        <div className="flex flex-col gap-6">
          <p
            lang="ml"
            className="font-[family-name:var(--font-malayalam)] text-[clamp(3rem,11vw,7rem)] leading-[0.95] text-white"
          >
            കായൽ
          </p>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:pr-40">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-white/50 hover:text-white">
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating socials panel — pinned to the footer's bottom-right corner.
          Only the top-left corner is rounded; the footer's own
          `overflow-hidden` + corner radius clips the other two edges to match. */}
      <div className="absolute bottom-0 right-0 z-10 flex h-[95px] w-full max-w-[180px] items-center justify-start gap-5 rounded-tl-[24px] bg-white pl-5">
        <a
          href={restaurant.socials.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hf-green text-hf-green transition-colors hover:bg-hf-green hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
          </svg>
        </a>
        <a
          href={restaurant.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hf-green text-hf-green transition-colors hover:bg-hf-green hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.15" cy="6.85" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </footer>
    </div>
  );
}
