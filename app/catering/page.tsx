import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import CallCta from "@/components/CallCta";
import WhatsAppCta from "@/components/WhatsAppCta";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { cateringCategories } from "@/data/copy";

export const metadata: Metadata = {
  title: "Catering & Events — Kerala Buffets in Sydney",
  description:
    "Kerala catering for weddings, festivals and events across Sydney. Buffet service with naadan entrees, mains, specials and desserts. Request a quote.",
  alternates: { canonical: "/catering" },
  openGraph: { images: [{ url: "/og/catering.png", width: 1200, height: 630 }] },
};

export default function CateringPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Catering", path: "/catering/" },
        ])}
      />
      <div className="bg-leaf py-14 text-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            The village table, brought to yours.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-cream/85">
            Onam sadya for two hundred. A chatti choru spread for the office.
            Wedding buffets that smell like home. We cater across Sydney —
            quote-based, built around your event.
          </p>
        </div>
      </div>

      <section aria-labelledby="catering-categories" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="catering-categories" className="font-display text-3xl font-semibold text-leaf">
          How the buffet flows
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cateringCategories.map((category, i) => (
            <Reveal as="li" key={category.title} className="lift rounded-2xl bg-white/70 p-6 ring-1 ring-leaf/10">
              <p aria-hidden="true" className="font-display text-3xl font-bold text-turmeric">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">{category.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{category.blurb}</p>
            </Reveal>
          ))}
        </ol>
        <p className="mt-8 rounded-2xl bg-turmeric/15 px-6 py-4 text-sm leading-relaxed text-ink/80 ring-1 ring-turmeric/30">
          Full buffet service available. Menus are tailored per event and quoted
          individually — tell us your date, your guest count and your occasion,
          and we&apos;ll build the spread.
        </p>
      </section>

      <section aria-labelledby="catering-enquiry" className="bg-cream pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="catering-enquiry" className="font-display text-3xl font-semibold text-leaf">
              Request a quote
            </h2>
            <p className="mt-3 leading-relaxed text-ink/75">
              Prefer to talk it through? Call or WhatsApp us — we love planning
              a feast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CallCta placement="catering" />
              <WhatsAppCta placement="catering" message="Hi Kayal! I'd like to ask about catering." />
            </div>
          </div>
          <div className="rounded-3xl bg-white/70 p-6 ring-1 ring-leaf/10 sm:p-8">
            <ContactForm variant="catering" />
          </div>
        </div>
      </section>
    </>
  );
}
