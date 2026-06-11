import ferrari from "@/assets/brands/ferrari.png.asset.json";
import lamborghini from "@/assets/brands/lamborghini.png.asset.json";
import porsche from "@/assets/brands/porsche.png.asset.json";
import rollsRoyce from "@/assets/brands/rolls-royce.png.asset.json";
import bentley from "@/assets/brands/bentley.png.asset.json";
import bmw from "@/assets/brands/bmw.png.asset.json";
import mercedes from "@/assets/brands/mercedes-benz.png.asset.json";
import mclaren from "@/assets/brands/mclaren.png.asset.json";
import astonMartin from "@/assets/brands/aston-martin.png.asset.json";
import audi from "@/assets/brands/audi.png.asset.json";
import rangeRover from "@/assets/brands/range-rover.png.asset.json";

/** Bundled fallback logos for each marque, keyed by slug. */
const logos: Record<string, { url: string }> = {
  ferrari,
  lamborghini,
  porsche,
  "rolls-royce": rollsRoyce,
  bentley,
  bmw,
  "mercedes-benz": mercedes,
  mclaren,
  "aston-martin": astonMartin,
  audi,
  "range-rover": rangeRover,
};

/**
 * Monochrome / dark marques that are hard to read on a dark background.
 * These render as a crisp white silhouette so they're clearly visible by
 * default (no hover required). Land Rover, Ferrari, Lamborghini and BMW are
 * intentionally excluded — their colour IS the identity.
 */
const whiteLogos = new Set([
  "audi",
  "bentley",
  "mclaren",
  "mercedes-benz",
  "aston-martin",
  "rolls-royce",
  "porsche",
]);

/**
 * Per-brand size multipliers so visually small logos (e.g. McLaren) read as
 * large and prominent as the wordier marques.
 */
const scale: Record<string, string> = {
  mclaren: "scale-125",
  "aston-martin": "scale-110",
  "range-rover": "scale-110",
  ferrari: "scale-105",
};

export function BrandLogo({
  slug,
  src,
  name,
  className,
}: {
  slug: string;
  /** CMS-managed light/section logo URL; rendered as-is when provided. */
  src?: string | null;
  name?: string;
  className?: string;
}) {
  const fallback = logos[slug];
  const url = src || fallback?.url;
  if (!url) return null;

  // An explicit CMS light/section logo is already adjusted for the dark
  // background, so render it untouched. Otherwise apply a light treatment so
  // dark logos are visible without needing hover.
  let tone = "brightness-110 contrast-110";
  if (!src) {
    tone = whiteLogos.has(slug)
      ? "brightness-0 invert" // crisp white silhouette
      : "brightness-110 contrast-110 saturate-110"; // keep colour, lift it
  }
  const sizeBoost = src ? "" : (scale[slug] ?? "");

  return (
    <img
      src={url}
      alt={`${name ?? slug} logo`}
      loading="lazy"
      className={`${className ?? ""} ${tone} ${sizeBoost} object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]`}
    />
  );
}

