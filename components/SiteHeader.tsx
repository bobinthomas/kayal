"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { legacySite } from "@/data/legacy-site";
import { restaurant } from "@/data/restaurant";
import { hfNavLinks } from "@/data/home-figma";
import { track } from "@/lib/analytics";
import { useMobileNav } from "@/components/landing/useMobileNav";

/** Site-wide header — same brand/nav/CTA everywhere. Home keeps the
 * floating glass pill over the hero (fixed, doesn't reserve layout space);
 * every other page gets a flush sticky bar sized to `--site-header-height`
 * so it lines up with the offsets that already depend on that variable
 * (menu category nav, anchor scroll padding). */
export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const { menuOpen, onMenuToggle, onMenuClose } = useMobileNav();

  const isActive = (href: string) =>
    pathname === href || pathname === href.replace(/\/$/, "") || pathname?.startsWith(href);

  const linkClass = (href: string) => (isActive(href) ? "text-hf-ink" : "hover:text-hf-ink");

  const NavLinks = (
    <>
      {hfNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={linkClass(link.href)}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  const BookCta = (
    <a
      href={`tel:${restaurant.phone.tel}`}
      onClick={() => track("call_tap", { placement: "site_nav" })}
      className="hidden shrink-0 items-center justify-center rounded-full bg-hf-red px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] lg:inline-flex"
    >
      Book a Table
    </a>
  );

  const MenuToggle = (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full p-2 text-hf-ink lg:hidden"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      aria-controls="site-mobile-nav"
      onClick={onMenuToggle}
    >
      {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );

  const MobileLinks = (
    <ul className="flex flex-col gap-1 p-4 text-sm font-semibold text-hf-body">
      {hfNavLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={`block rounded-xl px-3 py-2.5 hover:bg-hf-bg hover:text-hf-ink ${
              isActive(link.href) ? "text-hf-ink" : ""
            }`}
            onClick={onMenuClose}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li className="pt-1">
        <a
          href={`tel:${restaurant.phone.tel}`}
          className="block rounded-full bg-hf-red px-3 py-2.5 text-center text-white"
          onClick={() => {
            track("call_tap", { placement: "site_nav_mobile" });
            onMenuClose();
          }}
        >
          Book a Table
        </a>
      </li>
    </ul>
  );

  const Logo = (
    <Link href="/" aria-label="Kayal Foods home" className="shrink-0" onClick={onMenuClose}>
      <Image
        src={legacySite.assets.logo}
        alt="Kayal Foods"
        width={86}
        height={54}
        className="h-10 w-auto lg:h-[54px]"
        priority
      />
    </Link>
  );

  if (isHome) {
    return (
      <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6 lg:left-1/2 lg:right-auto lg:top-10 lg:w-[min(1280px,calc(100vw-64px))] lg:-translate-x-1/2">
        <div className="flex h-16 items-center justify-between rounded-full border border-hf-border bg-white/90 px-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur lg:h-[90px] lg:px-10">
          {Logo}
          <nav className="hidden items-center gap-10 font-hf-body text-sm font-semibold text-hf-body lg:flex" aria-label="Main">
            {NavLinks}
          </nav>
          {BookCta}
          {MenuToggle}
        </div>

        <nav
          id="site-mobile-nav"
          className={`mt-2 overflow-hidden rounded-3xl border border-hf-border bg-white shadow-lg transition-[max-height,opacity] duration-300 lg:hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-label="Mobile"
          aria-hidden={!menuOpen}
        >
          {MobileLinks}
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-hf-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[var(--site-header-height)] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {Logo}
        <nav className="hidden items-center gap-10 font-hf-body text-sm font-semibold text-hf-body lg:flex" aria-label="Main">
          {NavLinks}
        </nav>
        {BookCta}
        {MenuToggle}
      </div>

      <nav
        id="site-mobile-nav"
        className={`absolute inset-x-0 top-full mx-4 mt-2 overflow-hidden rounded-3xl border border-hf-border bg-white shadow-lg transition-[max-height,opacity] duration-300 sm:mx-6 lg:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        {MobileLinks}
      </nav>
    </header>
  );
}
