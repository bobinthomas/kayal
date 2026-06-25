import Image from "next/image";
import Link from "next/link";
import { douzeSignatures } from "@/data/home-douze";

export default function DouzeSignatures() {
  return (
    <section className="douze-signatures" aria-labelledby="douze-signatures-heading">
      <div className="douze-section-head">
        <h2 id="douze-signatures-heading" className="douze-section-title">
          Our signatures
        </h2>
        <p className="douze-section-sub">Three plates that tell you who we are.</p>
      </div>

      <ul className="douze-product-grid">
        {douzeSignatures.map((dish) => (
          <li key={dish.name} className="douze-product-card">
            <div className="douze-product-media">
              <Image
                src={dish.image}
                alt={dish.alt}
                width={600}
                height={720}
                className="douze-product-img"
              />
              <span className="douze-product-badge">{dish.badge}</span>
            </div>
            <div className="douze-product-body">
              {"malayalam" in dish && dish.malayalam && (
                <p className="douze-product-malayalam" lang="ml">
                  {dish.malayalam}
                </p>
              )}
              <h3 className="douze-product-name">{dish.name}</h3>
              <p className="douze-product-blurb">{dish.blurb}</p>
              <p className="douze-product-price">{dish.price}</p>
              <Link href="/menu/" className="douze-product-cta">
                View on menu
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
