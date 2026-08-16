import type { Metadata } from "next";
import { restaurant } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kayal Foods handles your personal information — contact forms, bookings and analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-hf-heading text-4xl font-semibold text-hf-ink">Privacy policy</h1>
      <div className="mt-6 space-y-6 leading-relaxed text-hf-body">
        <p>
          {restaurant.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your
          privacy. This policy explains what we collect through{" "}
          {restaurant.url.replace("https://", "")} and how we use it.
        </p>
        <section>
          <h2 className="font-hf-heading text-2xl font-semibold text-hf-ink">What we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Contact and catering enquiries:</strong> your name, phone
              number, email address and message, used solely to respond to your
              enquiry. Submissions are emailed to us and are not stored in a
              database on this website.
            </li>
            <li>
              <strong>WhatsApp offers group:</strong> joining is initiated by you
              via WhatsApp. {restaurant.whatsapp.consentCopy} You can leave the
              group at any time.
            </li>
            <li>
              <strong>Analytics:</strong> we use cookieless, privacy-friendly
              analytics (Cloudflare Web Analytics) to understand site usage. No
              cookies are set and no personal profiles are built.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-hf-heading text-2xl font-semibold text-hf-ink">How we use it</h2>
          <p className="mt-3">
            We use your details only to answer your enquiry, arrange your booking
            or catering quote, and — if you join the WhatsApp group — to send
            periodic offers. We never sell or share your information with third
            parties for marketing.
          </p>
        </section>
        <section>
          <h2 className="font-hf-heading text-2xl font-semibold text-hf-ink">Third-party services</h2>
          <p className="mt-3">
            Form submissions are processed by Cloudflare and delivered to our
            email. Spam protection may be provided by Cloudflare Turnstile. The
            map on our contact page is provided by Google Maps, which has its own
            privacy policy.
          </p>
        </section>
        <section>
          <h2 className="font-hf-heading text-2xl font-semibold text-hf-ink">Contact us</h2>
          <p className="mt-3">
            Questions about your data? Email{" "}
            <a href={`mailto:${restaurant.email}`} className="font-semibold text-hf-red underline-offset-2 hover:underline">
              {restaurant.email}
            </a>{" "}
            or call {restaurant.phone.display}.
          </p>
        </section>
        <p className="text-sm text-hf-body">Last updated: June 2026.</p>
      </div>
    </div>
  );
}
