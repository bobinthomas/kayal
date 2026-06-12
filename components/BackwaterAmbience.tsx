/** Animated backwater ripples + floating gold motes for the hero ambience layer. */
export default function BackwaterAmbience() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Slow-drifting lagoon ripples */}
      <svg
        className="ripple-layer ripple-layer-1 absolute -bottom-8 left-0 w-[200%] text-turmeric/25"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 60c120-24 240-24 360 0s240 24 360 0 240-24 360 0 240 24 360 0v60H0z" />
      </svg>
      <svg
        className="ripple-layer ripple-layer-2 absolute bottom-0 left-0 w-[200%] text-leaf/40"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 50c90-18 180-18 270 0s180 18 270 0 180-18 270 0 180 18 270 0v50H0z" />
      </svg>
      <svg
        className="ripple-layer ripple-layer-3 absolute bottom-4 left-0 w-[200%] text-cream/10"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 40c100-12 200-12 300 0s200 12 300 0 200-12 300 0 200 12 300 0v40H0z" />
      </svg>

      {/* Gold motes — slow float */}
      <span className="mote mote-1" />
      <span className="mote mote-2" />
      <span className="mote mote-3" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(20,51,30,0.55)_100%)]" />
    </div>
  );
}
