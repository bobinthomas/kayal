import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onam Sadhya 2026 — Kayal Foods",
  description:
    "Book your Onam Sadhya 2026 dine-in or takeaway with Kayal Foods, Moorebank. Booking only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className="h-full antialiased">
      <body className="min-h-full bg-cream text-ink">{children}</body>
    </html>
  );
}
