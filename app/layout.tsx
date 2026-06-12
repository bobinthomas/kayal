import type { Metadata } from "next";
import { Fraunces, Manrope, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import JsonLd from "@/components/JsonLd";
import { buildRestaurantSchema } from "@/lib/schema";
import { restaurant } from "@/data/restaurant";

// Self-hosted via next/font — zero external font requests, zero layout shift.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  weight: ["400", "600"],
  variable: "--font-noto-malayalam",
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
      className={`${fraunces.variable} ${manrope.variable} ${notoMalayalam.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-cream text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={buildRestaurantSchema()} />
        <Header />
        <main id="main" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}
