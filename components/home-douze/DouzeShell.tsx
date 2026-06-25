"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { legacySite } from "@/data/legacy-site";
import { restaurant } from "@/data/restaurant";
import { siteNavLinks } from "@/data/landing";
import { douzeAnnouncement } from "@/data/home-douze";
import { track } from "@/lib/analytics";

export default function DouzeShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="douze-page">
      <p className="douze-announce">
        <span>{douzeAnnouncement}</span>
      </p>

      <header className={`douze-header ${scrolled ? "is-solid" : ""}`}>
        <div className="douze-header-inner">
          <Link href="/" className="douze-logo" aria-label="Kayal Foods home">
            <Image
              src={legacySite.assets.logo}
              alt=""
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <nav className="douze-nav-desktop" aria-label="Main">
            {siteNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="douze-nav-link">
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${restaurant.phone.tel}`}
              onClick={() => track("call_tap", { placement: "douze_nav" })}
              className="douze-nav-cta"
            >
              Book a Table
            </a>
          </nav>

          <button
            type="button"
            className="douze-menu-btn lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <nav
        className={`douze-mobile-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        <ul className="douze-mobile-list">
          {siteNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="douze-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={`tel:${restaurant.phone.tel}`}
              className="douze-mobile-cta"
              onClick={() => {
                track("call_tap", { placement: "douze_mobile" });
                setMenuOpen(false);
              }}
            >
              Book a Table
            </a>
          </li>
        </ul>
      </nav>

      {children}

      <footer className="douze-footer">
        <div className="douze-footer-inner">
          <p className="douze-footer-brand">Kayal Foods</p>
          <p className="douze-footer-address">{restaurant.address.full}</p>
          <div className="douze-footer-links">
            <Link href="/">Current home</Link>
            <Link href="/menu/">Menu</Link>
            <Link href="/contact/">Contact</Link>
          </div>
          <p className="douze-footer-note">
            Layout inspired by{" "}
            <a href="https://drinkdouze.com/" target="_blank" rel="noopener noreferrer">
              Douze
            </a>
            . Kayal content &amp; branding.
          </p>
        </div>
      </footer>
    </div>
  );
}
