/**
 * Stylized, original geometric crest emblems for each marque.
 * These are NOT reproductions of the brands' trademarked logos —
 * they are distinct decorative emblems paired with each marque's name.
 */

type EmblemProps = { className?: string };

const emblems: Record<string, (p: EmblemProps) => JSX.Element> = {
  // Shield crest
  ferrari: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M24 4l16 4v14c0 11-8 18-16 22-8-4-16-11-16-22V8l16-4z" />
      <path d="M24 14c-4 3-6 6-6 9 0 4 3 7 6 7s6-3 6-7c0-3-2-6-6-9z" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Hexagon bull
  lamborghini: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M24 3l18 10.5v21L24 45 6 34.5v-21L24 3z" />
      <path d="M16 30c0-6 3-12 8-15 5 3 8 9 8 15-3-3-5-4-8-4s-5 1-8 4z" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Laurel circle
  porsche: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="20" />
      <path d="M24 8v32M8 24h32" />
      <circle cx="24" cy="24" r="9" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  ),
  // Spirit / wing
  "rolls-royce": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M24 6c-2 6-2 12 0 30 2-18 2-24 0-30z" fill="currentColor" stroke="none" />
      <path d="M22 14C14 12 6 16 4 24c8-2 14-4 18-6M26 14c8-2 16 2 18 10-8-2-14-4-18-6" />
    </svg>
  ),
  // Bentley wings
  bentley: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="7" fill="currentColor" stroke="none" />
      <path d="M17 24C11 18 6 18 2 22c4 1 7 3 9 6M31 24c6-6 11-6 15-2-4 1-7 3-9 6" />
    </svg>
  ),
  // Three-point star
  "mercedes-benz": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="20" />
      <path d="M24 24V6M24 24l16 9M24 24L8 33" />
    </svg>
  ),
  // Speed swoosh
  mclaren: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 32c10-2 22-8 36-22-6 14-16 22-26 24" />
      <path d="M10 36c8-1 16-5 24-13" opacity="0.6" />
    </svg>
  ),
  // Aston wings
  "aston-martin": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M24 18l4 6h-8l4-6z" fill="currentColor" stroke="none" />
      <path d="M20 22C13 18 6 19 3 25c7-1 12-1 17 1M28 22c7-4 14-3 17 3-7-1-12-1-17 1" />
    </svg>
  ),
  // Four rings
  audi: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="24" r="8" />
      <circle cx="20" cy="24" r="8" />
      <circle cx="29" cy="24" r="8" />
      <circle cx="38" cy="24" r="8" />
    </svg>
  ),
  // BMW roundel
  bmw: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="13" />
      <path d="M24 11a13 13 0 010 26V24H11A13 13 0 0124 11z" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  ),
  // Range Rover oval
  "range-rover": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="14" width="40" height="20" rx="10" />
      <path d="M16 24h16" strokeWidth="2" />
    </svg>
  ),
};

function Fallback({ className }: EmblemProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="20" />
    </svg>
  );
}

export function BrandLogo({ slug, className }: { slug: string; className?: string }) {
  const Emblem = emblems[slug] ?? Fallback;
  return <Emblem className={className} />;
}
