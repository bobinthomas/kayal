import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import CallCta from "@/components/CallCta";
import WhatsAppCta from "@/components/WhatsAppCta";
import PageHero from "@/components/PageHero";
import { buildBreadcrumbSchema, buildCateringServiceSchema, buildFaqSchema } from "@/lib/schema";
import { cateringCategories } from "@/data/copy";

// Every answer here is deliberately non-numeric — minimum guest counts, lead
// time, price band, deposit terms and the exact suburb list are all
// unconfirmed (see the SEO remediation report). Replace the TODO(bobin)
// answers with real figures rather than editing the questions.
const CATERING_FAQS = [
  {
    question: "What's the minimum number of guests for catering?",
    // TODO(bobin): confirm minimum guest count.
    answer:
      "It depends on the event and menu — tell us your guest count and we'll confirm whether it works.",
  },
  {
    question: "How much lead time do you need to book catering?",
    // TODO(bobin): confirm typical/minimum lead time.
    answer:
      "The earlier the better, especially around Onam and wedding season — call or WhatsApp us as soon as you have a date.",
  },
  {
    question: "Do you provide staff and equipment, or just the food?",
    // TODO(bobin): confirm what's included — drop-off only vs staffed service, plates/cutlery included?
    answer:
      "This varies by event size and venue — let us know what you need (drop-off, staffed service, banana-leaf setup) when you enquire.",
  },
  {
    question: "What areas of Sydney do you cater to?",
    // TODO(bobin): confirm the actual suburb/travel radius served.
    answer:
      "We cater across Sydney — get in touch with your suburb and we'll confirm.",
  },
  {
    question: "Do you require a deposit to confirm a booking?",
    // TODO(bobin): confirm deposit policy and amount/percentage.
    answer:
      "We'll walk you through booking and confirmation when you enquire — call or WhatsApp us for the details.",
  },
] as const;

const TITLE = "Kerala Catering Sydney | Sadya & Wedding Buffets | Kayal";
const DESCRIPTION =
  "Kerala catering across Sydney for weddings, Onam sadya and corporate events. Full banana-leaf buffet service, quoted per event. Call or WhatsApp for a quote.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/catering" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: "/og/catering.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og/catering.png"] },
};

export default function CateringPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The village table, brought to yours.", path: "/catering/" },
          ]),
          buildCateringServiceSchema(),
          buildFaqSchema(CATERING_FAQS.map((f) => ({ question: f.question, answer: f.answer }))),
        ]}
      />
      <PageHero
        title="The village table, brought to yours."
        subtitle="Onam sadya for two hundred. A chatti choru spread for the office. Wedding buffets that smell like home. We cater across Sydney — quote-based, built around your event."
        image={{ src: "/images/home-figma/menu-hero.jpg", alt: "Kayal Foods — authentic naadan cooking" }}
      />

      <section aria-labelledby="catering-categories" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="catering-categories" className="font-hf-heading text-3xl font-semibold text-hf-ink">
          How the buffet flows
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cateringCategories.map((category, i) => (
            <Reveal as="li" key={category.title} className="lift rounded-2xl bg-white p-6 ring-1 ring-hf-border">
              <p aria-hidden="true" className="font-hf-heading text-3xl font-bold text-hf-amber">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-hf-heading text-xl font-semibold text-hf-ink">{category.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-hf-body">{category.blurb}</p>
            </Reveal>
          ))}
        </ol>
        <p className="mt-8 rounded-2xl bg-hf-badge-bg px-6 py-4 text-sm leading-relaxed text-hf-body ring-1 ring-hf-amber/30">
          Full buffet service available. Menus are tailored per event and quoted
          individually — tell us your date, your guest count and your occasion,
          and we&apos;ll build the spread.
        </p>
      </section>

      <section aria-labelledby="catering-who" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 id="catering-who" className="font-hf-heading text-3xl font-semibold text-hf-ink">
              Who it's for
            </h2>
            <p className="mt-3 leading-relaxed text-hf-body">
              Weddings and engagements,{" "}
              <Link href="/onam-sadya/" className="underline underline-offset-2">
                Onam sadya
              </Link>
              , birthdays, office lunches and corporate events — anywhere a
              naadan spread makes the occasion.
              Menus are built around your event, not picked off a fixed package.
            </p>
          </div>
          <div>
            <h2 className="font-hf-heading text-3xl font-semibold text-hf-ink">
              How booking works
            </h2>
            <p className="mt-3 leading-relaxed text-hf-body">
              Call, WhatsApp, or send the form below with your date, guest count
              and occasion. We'll talk through the menu and quote your event —
              no fixed packages, no guessing at prices online.
            </p>
          </div>
        </div>

        <dl className="mt-10 grid gap-6 rounded-2xl bg-hf-badge-bg p-6 ring-1 ring-hf-amber/30 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-hf-amber">Price</dt>
            {/* TODO(bobin): confirm a price band (e.g. $$–$$$ per head) to replace this. */}
            <dd className="mt-1 text-sm text-hf-body">Quoted per event — call or WhatsApp for a guide price.</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-hf-amber">Minimum guests</dt>
            {/* TODO(bobin): confirm minimum guest count. */}
            <dd className="mt-1 text-sm text-hf-body">Tell us your guest count and we'll confirm.</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-hf-amber">Areas served</dt>
            {/* TODO(bobin): confirm the actual suburb/travel radius list. */}
            <dd className="mt-1 text-sm text-hf-body">Across Sydney — ask us about your suburb.</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="catering-faq" className="mx-auto max-w-4xl px-4 pb-4 sm:px-6">
        <h2 id="catering-faq" className="font-hf-heading text-3xl font-semibold text-hf-ink">
          Catering FAQ
        </h2>
        <dl className="mt-8 space-y-6">
          {CATERING_FAQS.map((faq) => (
            <div key={faq.question} className="border-b border-hf-border pb-6 last:border-0">
              <dt className="font-hf-heading text-lg font-semibold text-hf-ink">{faq.question}</dt>
              <dd className="mt-2 leading-relaxed text-hf-body">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="catering-enquiry" className="bg-hf-bg pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="catering-enquiry" className="font-hf-heading text-3xl font-semibold text-hf-ink">
              Request a quote
            </h2>
            <p className="mt-3 leading-relaxed text-hf-body">
              Prefer to talk it through? Call or WhatsApp us — we love planning
              a feast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CallCta placement="catering" />
              <WhatsAppCta placement="catering" message="Hi Kayal! I'd like to ask about catering." />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-hf-border sm:p-8">
            <ContactForm variant="catering" />
          </div>
        </div>
      </section>
    </>
  );
}
