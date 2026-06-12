/** Subtle backwater-ripple section divider (kayal = backwater lagoon). */
export default function RippleDivider({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className={`block h-8 w-full ${flip ? "rotate-180" : ""}`}
        fill="currentColor"
      >
        <path d="M0 24c60-12 120-12 180 0s120 12 180 0 120-12 180 0 120 12 180 0 120-12 180 0 120 12 180 0 120-12 180 0 120 12 180 0v24H0z" opacity="0.35" />
        <path d="M0 32c60-10 120-10 180 0s120 10 180 0 120-10 180 0 120 10 180 0 120-10 180 0 120 10 180 0 120-10 180 0 120 10 180 0v16H0z" />
      </svg>
    </div>
  );
}
