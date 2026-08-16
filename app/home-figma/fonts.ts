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

// Reuses the same self-hosted Besley file as the root layout (already spans
// weight 400-900) — this design just needs 700 for headings.
export const besleyBold = localFont({
  src: "../fonts/besley-variable.woff2",
  weight: "700",
  variable: "--font-hf-besley-bold",
  display: "swap",
});
