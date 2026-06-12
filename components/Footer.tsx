import Image from "next/image";
import Link from "next/link";
import { legacySite } from "@/data/legacy-site";
import { restaurant } from "@/data/restaurant";
import HoursTable from "@/components/HoursTable";

export default function Footer() {
  return (
    <footer className="bg-banana-dark text-cream">
      <div className="gold-rule" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Image
            src={legacySite.assets.logo}
            alt="Kayal Foods"
            width={160}
            height={52}
            className="h-12 w-auto"
          />
          <p className="mt-2 text-sm italic text-turmeric">{restaurant.tagline}</p>
          <address className="mt-4 text-sm not-italic leading-relaxed text-cream/85">
            {restaurant.address.full}
            <br />
            <a href={`tel:${restaurant.phone.tel}`} className="underline-offset-2 hover:underline">
              {restaurant.phone.display}
            </a>
            <br />
            <a href={`mailto:${restaurant.email}`} className="underline-offset-2 hover:underline">
              {restaurant.email}
            </a>
          </address>
          <a
            href={restaurant.maps.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-turmeric underline-offset-2 hover:underline"
          >
            Get directions →
          </a>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold">Hours</h2>
          <div className="mt-3">
            <HoursTable compact />
          </div>
          <p className="mt-3 text-xs text-cream/70">{restaurant.policies.bookingOnly}</p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold">Stay in the loop</h2>
          <p className="mt-2 text-sm text-cream/85">
            Join our WhatsApp group for weekend combos and festival specials.
          </p>
          <a
            href={`https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(restaurant.whatsapp.joinMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center rounded-full bg-curryleaf px-5 text-sm font-semibold text-ink transition-colors hover:bg-turmeric"
          >
            Join on WhatsApp
          </a>
          <ul className="mt-5 flex gap-4 text-sm">
            <li>
              <a href={restaurant.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-turmeric">
                Facebook
              </a>
            </li>
            <li>
              <a href={restaurant.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-turmeric">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
          </p>
          <p>
            <Link href="/privacy" className="hover:text-turmeric">
              Privacy policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
