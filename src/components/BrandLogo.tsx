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
 * Marques rendered as a crisp white/silver silhouette so they are always
 * clearly visible on the dark background — no hover required.
 * `brightness-0 invert` produces pure white regardless of the source colours,
 * so this is safe for both bundled and CMS-uploaded logos.
 */
const whiteLogos = new Set([
  "audi",
  "bentley",
  "mclaren",
  "mercedes-benz",
  "aston-martin",
  "porsche",
]);

/**
 * Marques whose colour IS the identity (Ferrari shield, Lamborghini crest,
 * Rolls-Royce badge, Land Rover green). Kept in colour with a brightness lift.
 */

/** BMW's roundel needs a light circular backing to stay legible on dark. */
const circleBacked = new Set(["bmw"]);

/**
 * Per-brand size multipliers so visually small marks read at the same
 * apparent size as wider wordmarks.
 */
const scale: Record<string, string> = {
  mclaren: "scale-125",
  "aston-martin": "scale-110",
};

export function BrandLogo({
  slug,
  src,
  name,
  className,
}: {
  slug: string;
  /** CMS-managed light/section logo URL; used when provided. */
  src?: string | null;
  name?: string;
  className?: string;
}) {
  const fallback = logos[slug];
  const url = src || fallback?.url;
  if (!url) return null;

  const tone = whiteLogos.has(slug)
    ? "brightness-0 invert opacity-95" // crisp white silhouette, always readable
    : "brightness-110 contrast-110 saturate-110"; // colour marques, lifted

  const sizeBoost = scale[slug] ?? "";

  if (circleBacked.has(slug)) {
    return (
      <span
        className={`${className ?? ""} flex items-center justify-center`}
      >
        <span className="flex aspect-square h-full items-center justify-center rounded-full bg-foreground/95 p-2 shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          <img
            src={url}
            alt={`${name ?? slug} logo`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </span>
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={`${name ?? slug} logo`}
      loading="lazy"
      className={`${className ?? ""} ${tone} ${sizeBoost} object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]`}
    />
  );
}
