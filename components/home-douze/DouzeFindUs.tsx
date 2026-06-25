import { restaurant } from "@/data/restaurant";

export default function DouzeFindUs() {
  return (
    <section className="douze-find" aria-labelledby="douze-find-heading">
      <h2 id="douze-find-heading" className="douze-section-title">
        Where to find us
      </h2>

      <article className="douze-find-card">
        <h3 className="douze-find-name">Kayal Foods</h3>
        <p className="douze-find-blurb">{restaurant.findingUs.headline}</p>
        <p className="douze-find-detail">{restaurant.findingUs.blurb}</p>
        <a
          href={restaurant.maps.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="douze-text-link"
        >
          Get directions
        </a>
      </article>
    </section>
  );
}
