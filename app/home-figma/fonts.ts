import localFont from "next/font/local";

// Self-hosted (see app/layout.tsx for why: Cloudflare's Workers Builds
// container can't reach fonts.gstatic.com at build time, so next/font/google
// isn't usable here). Files are the official Google Fonts latin-subset woff2s,
// downloaded directly — Neuton and Google Sans Flex aren't mirrored in the
// community google/fonts repo, so these came straight from fonts.googleapis.com.
export const neuton = localFont({
  src: [
    { path: "./fonts/neuton-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/neuton-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-hf-neuton",
  display: "swap",
});

export const outfit = localFont({
  src: "./fonts/outfit-variable.woff2",
  variable: "--font-hf-outfit",
  weight: "100 900",
  display: "swap",
});

// The Figma file's body/UI text is set in "Google Sans Flex".
export const googleSansFlex = localFont({
  src: "./fonts/google-sans-flex-variable.woff2",
  variable: "--font-hf-gsans",
  weight: "100 900",
  display: "swap",
});

// Reuses the same self-hosted Cormorant Garamond file as the root layout
// (already spans weight 300-700) — this design just needs 700 for headings.
export const cormorantBold = localFont({
  src: "../fonts/cormorant-garamond-variable.woff2",
  weight: "700",
  variable: "--font-hf-cormorant-bold",
  display: "swap",
});
