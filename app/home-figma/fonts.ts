import localFont from "next/font/local";

// Self-hosted (see app/layout.tsx for why: Cloudflare's Workers Builds
// container can't reach fonts.gstatic.com at build time, so next/font/google
// isn't usable here). Google Sans Flex isn't mirrored in the community
// google/fonts repo, so it came straight from fonts.googleapis.com.
// The Figma file's body/UI text is set in "Google Sans Flex".
export const googleSansFlex = localFont({
  src: "./fonts/google-sans-flex-variable.woff2",
  variable: "--font-hf-gsans",
  weight: "100 900",
  display: "swap",
});

// Google serves the same underlying variable file for every static weight
// request on a VF-only family like Newsreader — each @font-face entry below
// just points the browser at a fixed instance (Light, Regular) within it,
// same technique Google Fonts itself uses.
export const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-variable.woff2", weight: "300", style: "normal" },
    { path: "./fonts/newsreader-variable.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-hf-newsreader",
  display: "swap",
});
