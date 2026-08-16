import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import FindingUs from "@/components/FindingUs";
import HoursTable from "@/components/HoursTable";
import JsonLd from "@/components/JsonLd";
import CallCta from "@/components/CallCta";
import WhatsAppCta from "@/components/WhatsAppCta";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { restaurant } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Contact & Bookings — Find the White House in Moorebank",
  description:
    "Book a table at Kayal Foods: (02) 9734 9634 or WhatsApp. 128 Nuwarra Road, Moorebank NSW 2170 — look for the white house. Hours, parking and directions.",
  alternates: { canonical: "/contact" },
  openGraph: { images: [{ url: "/og/contact.png", width: 1200, height: 630 }] },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact/" },
        ])}
      />
      <div className="bg-hf-footer py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="font-hf-heading text-4xl font-semibold sm:text-5xl">
            Book a table. Find the house.
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">
            Dine-in is by booking only — one call and your pot goes on.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <CallCta placement="contact_hero" />
            <WhatsAppCta placement="contact_hero" />
          </div>
        </div>
      </div>

      {/* NAP + hours + policy */}
      <section aria-labelledby="visit-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="visit-heading" className="sr-only">
          Visit us
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-7 ring-1 ring-hf-border">
            <h3 className="font-hf-heading text-xl font-semibold text-hf-ink">Where</h3>
            <address className="mt-3 text-sm not-italic leading-relaxed text-hf-body">
              {restaurant.name}
              <br />
              {restaurant.address.full}
            </address>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={`tel:${restaurant.phone.tel}`} className="font-semibold text-hf-red underline-offset-2 hover:underline">
                  {restaurant.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${restaurant.email}`} className="font-semibold text-hf-red underline-offset-2 hover:underline">
                  {restaurant.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-7 ring-1 ring-hf-border">
            <h3 className="font-hf-heading text-xl font-semibold text-hf-ink">When</h3>
            <div className="mt-3 text-sm">
              <HoursTable compact />
            </div>
          </div>
          <div className="rounded-3xl bg-hf-footer p-7 text-white ring-1 ring-hf-amber/30">
            <h3 className="font-hf-heading text-xl font-semibold text-hf-amber">How we host</h3>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-white/90">
              <li>{restaurant.policies.bookingOnly}</li>
              <li>{restaurant.policies.lastOrders}</li>
              <li>{restaurant.policies.sitting}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Finding us */}
      <section aria-labelledby="finding-us-heading" className="bg-hf-badge-bg py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="finding-us-heading" className="sr-only">
            Finding us
          </h2>
          <FindingUs full />
          <div className="mt-10 overflow-hidden rounded-3xl ring-1 ring-hf-border">
            <iframe
              title="Map showing Kayal Foods at 128 Nuwarra Road, Moorebank"
              src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.address.full)}&output=embed`}
              width="100%"
              height="360"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
            />
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section aria-labelledby="message-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="message-heading" className="font-hf-heading text-3xl font-semibold text-hf-ink">
              Send us a message
            </h2>
            <p className="mt-3 leading-relaxed text-hf-body">
              Booking requests, questions, feedback — we read everything. For
              same-day bookings, calling is fastest.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-hf-border sm:p-8">
            <ContactForm variant="contact" />
          </div>
        </div>
      </section>
    </>
  );
}
