import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import CallCta from "@/components/CallCta";
import WhatsAppCta from "@/components/WhatsAppCta";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import { restaurant } from "@/data/restaurant";

const TITLE = "Onam Sadya Sydney 2026 | The King's Sadhya | Kayal Foods";
const DESCRIPTION =
  "Book the 2026 Onam Sadya at Kayal Foods, Moorebank — a 20-dish banana-leaf feast. Dine-in $40pp, takeaway packages from $60. Limited dates in August.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/onam-sadya" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: "/og/home.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og/home.png"] },
};

// The leaf, left to right as served — from the promo currently live at
// content/popup.json's image. Update this list alongside that graphic each
// year (see content/popup.json for the current campaign asset).
const SADYA_ITEMS = [
  { mal: "ഉപ്പ്", en: "Uppu — salt" },
  { mal: "പപ്പടം", en: "Pappadam" },
  { mal: "കായ വറുത്തത്", en: "Kaya varuthathu — fried banana chips" },
  { mal: "ശർക്കര പുരട്ടിയത്", en: "Sharkara varatti — jaggery-coated banana chips" },
  { mal: "കൊണ്ടാട്ടം മുളക്", en: "Kondattam mulak — sun-dried fried chillies" },
  { mal: "ചോറ്", en: "Choru — rice" },
  { mal: "നെയ്യ്", en: "Neyyu — ghee" },
  { mal: "പരിപ്പ്", en: "Parippu — dal curry" },
  { mal: "സാമ്പാർ", en: "Sambar" },
  { mal: "കാളൻ", en: "Kaalan" },
  { mal: "അവിയൽ", en: "Avial" },
  { mal: "ഓലൻ", en: "Olan" },
  { mal: "പച്ചടി", en: "Pachadi" },
  { mal: "കൂട്ടുകറി", en: "Koottukari" },
  { mal: "തോരൻ", en: "Thoran" },
  { mal: "നാരങ്ങ കറി", en: "Naranga curry — lime pickle" },
  { mal: "മാങ്ങ കറി", en: "Manga curry — mango pickle" },
  { mal: "പുളിയിഞ്ചി", en: "Puliyinji — tamarind-ginger chutney" },
  { mal: "പ്രഥമൻ", en: "Pradhaman — payasam" },
  { mal: "മോര്", en: "Moru — spiced buttermilk" },
] as const;

// Takeaway dates carry both a takeaway window and, on some dates, dine-in
// lunch/dinner sittings — mirrors the currently-live promo image exactly.
const DATES = [
  { date: "Sat 15 Aug", takeaway: true, dineLunch: false, dineDinner: false },
  { date: "Sun 16 Aug", takeaway: true, dineLunch: true, dineDinner: false },
  { date: "Sat 22 Aug", takeaway: true, dineLunch: true, dineDinner: false },
  { date: "Sun 23 Aug", takeaway: true, dineLunch: true, dineDinner: false },
  { date: "Wed 26 Aug", takeaway: true, dineLunch: true, dineDinner: true },
  { date: "Sat 29 Aug", takeaway: true, dineLunch: true, dineDinner: true },
  { date: "Sun 30 Aug", takeaway: true, dineLunch: true, dineDinner: true },
] as const;

const TAKEAWAY_PACKAGES = [
  { people: 2, member: 60, nonMember: 75 },
  { people: 4, member: 110, nonMember: 150 },
  { people: 10, member: 250, nonMember: 300 },
  { people: 20, member: 500, nonMember: 600 },
] as const;

const FAQS = [
  {
    question: "How much does the Onam Sadya cost?",
    answer:
      "Dine-in is $40 per person. Takeaway packages start at $60 for 2 people (WhatsApp members price; $75 non-members) up to $500 for 20 people ($600 non-members).",
  },
  {
    question: "What dates is the 2026 Onam Sadya available?",
    answer:
      "Takeaway is available 12–3pm on Sat 15, Sun 16, Sat 22, Sun 23, Wed 26, Sat 29 and Sun 30 August. Dine-in lunch (12–3pm) runs on all dates except 15 August; dine-in dinner (6–9pm) runs on 26, 29 and 30 August.",
  },
  {
    question: "Do I need to book in advance?",
    answer: "Yes — the Onam Sadya is by booking only, through the link on this page.",
  },
  {
    question: "What's included in the sadya?",
    answer:
      "A full 20-dish banana-leaf feast — rice, sambar, avial, olan, thoran, kaalan, pachadi, payasam and more. See the full leaf below.",
  },
] as const;

export default function OnamSadyaPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Onam Sadya Sydney 2026", path: "/onam-sadya/" },
          ]),
          buildFaqSchema(FAQS.map((f) => ({ question: f.question, answer: f.answer }))),
          {
            "@context": "https://schema.org",
            "@type": "FoodEvent",
            name: "Onam Sadya 2026 at Kayal Foods",
            description: "A 20-dish banana-leaf Onam feast — dine-in and takeaway, Moorebank.",
            startDate: "2026-08-15",
            endDate: "2026-08-30",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: {
              "@type": "Place",
              name: restaurant.name,
              address: {
                "@type": "PostalAddress",
                streetAddress: restaurant.address.street,
                addressLocality: restaurant.address.suburb,
                addressRegion: restaurant.address.state,
                postalCode: restaurant.address.postcode,
                addressCountry: restaurant.address.country,
              },
            },
            organizer: { "@id": `${restaurant.url}/#restaurant` },
            offers: {
              "@type": "Offer",
              price: "40.00",
              priceCurrency: "AUD",
              availability: "https://schema.org/InStock",
              url: "https://onam.kayal.com.au/",
            },
          },
        ]}
      />

      <PageHero
        eyebrow="The King's Sadhya is back"
        title="Onam Sadya 2026, Sydney"
        subtitle="A full 20-dish banana-leaf feast, served the naadan way — rice, curries, pickles and payasam, exactly as it's served across Kerala for Onam. Moorebank, by booking only."
        image={{ src: "/images/home-figma/newsletter.png", alt: "Full Onam sadya banana-leaf feast at Kayal Foods, Moorebank" }}
      >
        <div className="mt-2 flex flex-wrap gap-3">
          <a
            href="https://onam.kayal.com.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center rounded-full bg-hf-green px-7 font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Book the Onam Sadya
          </a>
          <WhatsAppCta placement="onam_sadya_hero" message="Hi Kayal! I'd like to book the Onam Sadya." />
        </div>
      </PageHero>

      <section aria-labelledby="onam-pricing" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="onam-pricing" className="font-hf-heading text-3xl font-semibold text-hf-ink">
          Dates &amp; pricing
        </h2>
        <p className="mt-3 leading-relaxed text-hf-body">
          Dine-in is <strong>$40 per person</strong>. Takeaway is by package, with a
          member and non-member price:
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-hf-border text-left">
                <th className="py-2 pr-4 font-semibold text-hf-ink">People</th>
                <th className="py-2 pr-4 font-semibold text-hf-ink">WhatsApp members</th>
                <th className="py-2 font-semibold text-hf-ink">Non-members</th>
              </tr>
            </thead>
            <tbody>
              {TAKEAWAY_PACKAGES.map((pkg) => (
                <tr key={pkg.people} className="border-b border-hf-border/60">
                  <td className="py-2 pr-4 text-hf-body">{pkg.people} people</td>
                  <td className="py-2 pr-4 text-hf-body">${pkg.member}</td>
                  <td className="py-2 text-hf-body">${pkg.nonMember}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-10 font-hf-heading text-xl font-semibold text-hf-ink">Available dates</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-hf-border text-left">
                <th className="py-2 pr-4 font-semibold text-hf-ink">Date</th>
                <th className="py-2 pr-4 font-semibold text-hf-ink">Takeaway (12–3pm)</th>
                <th className="py-2 pr-4 font-semibold text-hf-ink">Dine-in lunch</th>
                <th className="py-2 font-semibold text-hf-ink">Dine-in dinner</th>
              </tr>
            </thead>
            <tbody>
              {DATES.map((d) => (
                <tr key={d.date} className="border-b border-hf-border/60">
                  <td className="py-2 pr-4 text-hf-body">{d.date}</td>
                  <td className="py-2 pr-4 text-hf-body">{d.takeaway ? "✓" : "—"}</td>
                  <td className="py-2 pr-4 text-hf-body">{d.dineLunch ? "✓" : "—"}</td>
                  <td className="py-2 text-hf-body">{d.dineDinner ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-hf-body">
          Dine-in dinner runs 6–9pm on the dates marked above. By booking only.
        </p>
      </section>

      <section aria-labelledby="onam-leaf" className="bg-hf-bg py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="onam-leaf" className="font-hf-heading text-3xl font-semibold text-hf-ink">
            What&apos;s on the leaf
          </h2>
          <p className="mt-3 leading-relaxed text-hf-body">
            All 20 dishes, served the traditional way on a banana leaf:
          </p>
          <ol className="mt-6 grid list-decimal gap-x-8 gap-y-2 pl-5 sm:grid-cols-2">
            {SADYA_ITEMS.map((item) => (
              <li key={item.en} className="text-hf-body">
                <span className="font-medium text-hf-ink">{item.en}</span>{" "}
                <span className="text-hf-body/70">({item.mal})</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="onam-faq" className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 id="onam-faq" className="font-hf-heading text-3xl font-semibold text-hf-ink">
          Onam Sadya FAQ
        </h2>
        <dl className="mt-8 space-y-6">
          {FAQS.map((faq) => (
            <Reveal key={faq.question} className="border-b border-hf-border pb-6 last:border-0">
              <dt className="font-hf-heading text-lg font-semibold text-hf-ink">{faq.question}</dt>
              <dd className="mt-2 leading-relaxed text-hf-body">{faq.answer}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section aria-labelledby="onam-book" className="bg-hf-footer py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 id="onam-book" className="font-hf-heading text-3xl font-semibold">
            Book your Onam Sadya
          </h2>
          <p className="mt-3 leading-relaxed text-white/80">
            Booking happens on our Onam booking site — pick your date, choose
            dine-in or takeaway, and you&apos;re set.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://onam.kayal.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-full bg-hf-green px-7 font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Book now at onam.kayal.com.au
            </a>
            <CallCta placement="onam_sadya_footer" />
          </div>
          <p className="mt-6 text-sm text-white/60">
            Looking for catering instead of the set sadya menu?{" "}
            <Link href="/catering/" className="underline underline-offset-2">
              See our catering page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
