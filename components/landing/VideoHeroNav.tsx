"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserPlus, X } from "lucide-react";
import { legacySite } from "@/data/legacy-site";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";

type NavLink = { href: string; label: string };

type Props = {
  links: readonly NavLink[];
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
};

function isHash(href: string) {
  return href.startsWith("#");
}

export default function VideoHeroNav({
  links,
  menuOpen,
  onMenuToggle,
  onMenuClose,
}: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

  const linkClass = (href: string) => {
    const active =
      !isHash(href) &&
      (pathname === href ||
        pathname === href.replace(/\/$/, "") ||
        (href !== "/" && pathname?.startsWith(href)));
    return `px-3 py-2 text-sm transition-colors ${
      active
        ? "font-semibold text-leaf"
        : "font-medium text-ink/70 hover:text-leaf"
    }`;
  };

  return (
    <>
      <header
        className={
          isHome
            ? "absolute left-0 right-0 top-0 z-50"
            : "sticky top-0 z-50"
        }
      >
        <nav
          aria-label="Main"
          className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-10"
        >
          <Link
            href="/"
            className="block shrink-0 transition-opacity hover:opacity-90"
            onClick={onMenuClose}
          >
            <Image
              src={legacySite.assets.logo}
              alt="Kayal Foods"
              width={130}
              height={44}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-white/60 bg-white/70 py-1 pl-6 pr-1 shadow-sm backdrop-blur-md lg:flex">
            {links.map((link) => {
              const className = linkClass(link.href);
              return isHash(link.href) ? (
                <a key={link.href} href={link.href} className={className}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className={className}>
                  {link.label}
                </Link>
              );
            })}
            <a
              href={`tel:${restaurant.phone.tel}`}
              onClick={() => track("call_tap", { placement: "site_nav" })}
              className="ml-2 rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-banana-dark"
            >
              Book a Table
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/contact/"
              className="hidden items-center gap-2 text-sm font-medium text-banana-dark transition-opacity hover:opacity-80 sm:flex"
            >
              <UserPlus className="h-4 w-4" />
              Enquire
            </Link>
            <button
              type="button"
              onClick={onMenuToggle}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-leaf backdrop-blur-md transition-all duration-300 hover:bg-white/90 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="site-mobile-nav"
            >
              <Menu
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  menuOpen
                    ? "scale-50 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                }`}
              />
              <X
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  menuOpen
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-50 -rotate-90 opacity-0"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onMenuClose}
        role="presentation"
      >
        <div className="absolute inset-0 bg-banana-dark/40 backdrop-blur-sm" />
      </div>

      <nav
        id="site-mobile-nav"
        aria-label="Mobile"
        className={`fixed bottom-0 right-0 top-0 z-40 w-[85%] max-w-sm bg-cream/95 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-8 pb-8 pt-24">
          <div className="flex flex-col gap-1">
            {links.map((link, i) => {
              const className = `border-b border-leaf/10 py-4 text-2xl font-semibold text-leaf transition-all duration-500 ${
                menuOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`;
              const style = {
                transitionDelay: menuOpen ? `${150 + i * 70}ms` : "0ms",
              };
              return isHash(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onMenuClose}
                  className={className}
                  style={style}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onMenuClose}
                  className={className}
                  style={style}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div
            className={`mt-8 flex flex-col gap-4 transition-all duration-500 ${
              menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? "400ms" : "0ms" }}
          >
            <Link
              href="/contact/"
              onClick={onMenuClose}
              className="flex items-center gap-2 text-sm font-medium text-banana-dark"
            >
              <UserPlus className="h-4 w-4" />
              Enquire
            </Link>
            <a
              href={`tel:${restaurant.phone.tel}`}
              onClick={() => track("call_tap", { placement: "mobile_drawer" })}
              className="mt-2 rounded-full bg-leaf px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-banana-dark"
            >
              Book a Table
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
