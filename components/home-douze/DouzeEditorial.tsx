import Image from "next/image";
import Link from "next/link";
import { legacyPhoto } from "@/data/legacy-site";
import { douzePillars } from "@/data/home-douze";
import DouzeCarousel from "@/components/home-douze/DouzeCarousel";

export default function DouzeEditorial() {
  const img = legacyPhoto(3);

  return (
    <section className="douze-editorial" aria-labelledby="douze-editorial-heading">
      <div className="douze-editorial-grid">
        <div className="douze-editorial-copy">
          <h2 id="douze-editorial-heading" className="douze-editorial-lead">
            Kerala&apos;s village table
            <em> — for those who gather.</em>
          </h2>
          <DouzeCarousel slides={douzePillars} />
          <Link href="/about/" className="douze-text-link">
            Read our story
          </Link>
        </div>
        <div className="douze-editorial-media">
          <Image
            src={img.src}
            alt={img.alt}
            width={800}
            height={1000}
            className="douze-editorial-img"
          />
        </div>
      </div>
    </section>
  );
}
