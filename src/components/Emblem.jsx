/**
 * Stylised line-art bee — the thread that runs through the collection
 * (the Bee Bottle, first struck in 1853). Decorative, inherits currentColor.
 */
export default function Emblem({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Wings */}
      <ellipse cx="22.5" cy="27" rx="13" ry="7.5" transform="rotate(-26 22.5 27)" />
      <ellipse cx="41.5" cy="27" rx="13" ry="7.5" transform="rotate(26 41.5 27)" />
      {/* Body */}
      <path d="M32 21.5c-5 0-7 5-7 11 0 9.5 3 18 7 22 4-4 7-12.5 7-22 0-6-2-11-7-11Z" />
      {/* Stripes */}
      <line x1="26.4" y1="34" x2="37.6" y2="34" />
      <line x1="27" y1="40.5" x2="37" y2="40.5" />
      <line x1="28.6" y1="47" x2="35.4" y2="47" />
      {/* Head + antennae */}
      <circle cx="32" cy="17.5" r="3.1" />
      <path d="M30 14.8c-2.4-3.4-4.4-4.6-6.4-5.4" />
      <path d="M34 14.8c2.4-3.4 4.4-4.6 6.4-5.4" />
    </svg>
  );
}
