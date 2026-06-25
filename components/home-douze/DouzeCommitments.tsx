import { douzeCommitments } from "@/data/home-douze";

export default function DouzeCommitments() {
  return (
    <section className="douze-commitments" aria-labelledby="douze-commitments-heading">
      <h2 id="douze-commitments-heading" className="douze-commitments-title">
        Woodfire, banana leaf <em>&amp; village recipes</em>
      </h2>
      <ul className="douze-commitments-list">
        {douzeCommitments.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a href="/about/" className="douze-text-link">
        Our kitchen
      </a>
    </section>
  );
}
