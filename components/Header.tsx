"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { legacySite } from "@/data/legacy-site";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";
import { useScrolled } from "@/lib/useScrolled";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/specials", label: "Specials" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled(32);

  return (
    <header
      className={`header-glass sticky top-0 z-50 text-cream ${scrolled ? "is-scrolled" : ""}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="group block shrink-0 transition-opacity hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          <Image
            src={legacySite.assets.logo}
            alt="Kayal Foods"
            width={140}
            height={48}
            priority
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link-luxury text-[13px] font-medium tracking-wide transition-colors ${
                  active ? "text-turmeric" : "text-cream/85 hover:text-cream"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${restaurant.phone.tel}`}
            onClick={() => track("call_tap", { placement: "header" })}
            className="btn-luxury hidden min-h-11 items-center rounded-full bg-clay px-6 text-[13px] font-semibold tracking-wide text-cream sm:inline-flex"
          >
            Book a Table
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-turmeric/50 hover:bg-cream/5 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-turmeric/15 bg-banana-dark/95 px-4 py-4 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block min-h-12 rounded-lg px-3 py-3 font-display text-xl text-cream transition-colors hover:bg-cream/5 hover:text-turmeric"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-cream/10 pt-3">
              <a
                href={`tel:${restaurant.phone.tel}`}
                onClick={() => {
                  setOpen(false);
                  track("call_tap", { placement: "mobile_nav" });
                }}
                className="btn-luxury flex min-h-12 items-center justify-center rounded-full bg-clay font-semibold text-cream"
              >
                Book a Table
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
