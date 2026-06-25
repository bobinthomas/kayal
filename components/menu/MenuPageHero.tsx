import Image from "next/image";
import { legacyPhoto } from "@/data/legacy-site";
import { menuPageCopy } from "@/data/menu-meta";

export default function MenuPageHero() {
  const photo = legacyPhoto(2);

  return (
    <header className="menu-hero">
      <div className="menu-hero-text">
        <div className="menu-hero-title-row">
          <p className="menu-hero-side-label">{menuPageCopy.eyebrowLeft}</p>
          <h1 className="menu-hero-title" aria-label="Menu">
            <span className="menu-hero-letter">m</span>
            <span className="menu-hero-letter">e</span>
            <span className="menu-hero-letter">n</span>
            <span className="menu-hero-letter">u</span>
          </h1>
          <p className="menu-hero-side-label menu-hero-side-label--right">
            {menuPageCopy.eyebrowRight}
          </p>
        </div>
        <p className="menu-hero-tagline">{menuPageCopy.discoveryTagline}</p>
      </div>

      <div className="menu-hero-media">
        <div className="menu-hero-image-wrap">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </header>
  );
}
