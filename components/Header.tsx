"use client";

import VideoHeroNav from "@/components/landing/VideoHeroNav";
import { useMobileNav } from "@/components/landing/useMobileNav";
import { siteNavLinks } from "@/data/landing";

/** Site-wide header — glass pill nav + slide drawer (matches home hero). */
export default function Header() {
  const { menuOpen, onMenuToggle, onMenuClose } = useMobileNav();

  return (
    <VideoHeroNav
      links={siteNavLinks}
      menuOpen={menuOpen}
      onMenuToggle={onMenuToggle}
      onMenuClose={onMenuClose}
    />
  );
}
