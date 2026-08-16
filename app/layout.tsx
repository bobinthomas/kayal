import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import JsonLd from "@/components/JsonLd";
import { buildRestaurantSchema } from "@/lib/schema";
import { restaurant } from "@/data/restaurant";
import { neuton, outfit, googleSansFlex, cormorantBold } from "./home-figma/fonts";

// Self-hosted variable fonts (subsetted from the official google/fonts sources) —
// zero external font requests, zero layout shift, and no build-time dependency on
// fonts.gstatic.com (which next/font/google needs, and which Cloudflare's Workers
// Builds environment can't reach).
const cormorant = localFont({
  src: "./fonts/cormorant-garamond-variable.woff2",
  variable: "--font-cormorant",
  weight: "300 700",
  display: "swap",
});

const fraunces = localFont({
  src: "./fonts/fraunces-variable.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
});

const manrope = localFont({
  src: "./fonts/manrope-variable.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

const notoMalayalam = localFont({
  src: "./fonts/noto-sans-malayalam-variable.woff2",
  variable: "--font-noto-malayalam",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(restaurant.url),
  title: {
    default: "Kayal Foods — Authentic Kerala Restaurant in Moorebank, Sydney",
    template: "%s · Kayal Foods",
  },
  description:
    "Kerala's village table, in Sydney. Naadan cooking — chatti choru, kizhi porotta, toddy and game meats — in Moorebank. Dine-in by booking: (02) 9734 9634.",
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: restaurant.name,
    url: restaurant.url,
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Kayal Foods — Kerala restaurant, Moorebank Sydney" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${cormorant.variable} ${fraunces.variable} ${manrope.variable} ${notoMalayalam.variable} ${neuton.variable} ${outfit.variable} ${googleSansFlex.variable} ${cormorantBold.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-cream text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={buildRestaurantSchema()} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
