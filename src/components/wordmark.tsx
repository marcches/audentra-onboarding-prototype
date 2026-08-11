import { cn } from "@/lib/utils";

/**
 * The Audentra identity, from the delivered brand assets.
 *
 * These were hand-drawn SVG until the real identity arrived: three flat
 * polygons with a mint crossbar, which turned out to be wrong in every respect
 * that matters. The actual mark is a ribbon folded into an A — a continuous band
 * whose planes run violet → blue → teal, with the crossbar reading as the
 * underside of the fold. Redrawing that by hand from a raster would have shipped
 * an approximation of a logo, which is worse than shipping a bitmap of the real
 * one, so the delivered files are the source of truth.
 *
 * `public/brand/` holds them, trimmed to their own ink from the originals in
 * `Logos/`: `mark` (the A alone), `lockup` (mark + wordmark) and
 * `lockup-tagline` (the full signature), each with a `-white` variant whose
 * lettering is white for dark grounds. The mark keeps its gradient in every
 * variant — it is the one element that never goes flat.
 *
 * Note on the wordmark: the mark *is* the A of AUDENTRA. So there is no
 * "mark plus text" arrangement to compose in CSS — the lockup is one image, and
 * setting the letters in Satoshi beside the mark would both mismatch the
 * typeface and duplicate the A.
 */

/** Natural proportions of the trimmed assets, so nothing has to guess a height. */
const RATIO = {
  mark: 256 / 198,
  lockup: 1174 / 198,
  tagline: 1174 / 283,
} as const;

/**
 * The A, alone.
 *
 * Sized by height — the mark is wider than it is tall (1.29:1), so a square
 * utility like `size-8` would squash it. Pass `h-*` and the width follows.
 */
export function AudentraMark({
  className,
  tone = "colour",
}: {
  className?: string;
  /**
   * `mono` draws the mark as a silhouette in `currentColor` instead of its own
   * gradient, by masking a block of colour through the asset's alpha.
   *
   * For the one job the coloured mark cannot do: being used as material. The
   * entry panel crops it oversized behind its own type at a few per cent white,
   * where the gradient would fight the ground it is sitting on.
   */
  tone?: "colour" | "mono";
}) {
  if (tone === "mono") {
    return (
      <span
        aria-hidden
        className={cn("inline-block bg-current", className)}
        style={{
          aspectRatio: String(RATIO.mark),
          maskImage: "url(/brand/mark.png)",
          WebkitMaskImage: "url(/brand/mark.png)",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }

  return (
    <img
      src="/brand/mark.png"
      alt="Audentra"
      width={256}
      height={198}
      className={cn("h-8 w-auto", className)}
    />
  );
}

/**
 * The full lockup: the mark and the wordmark it forms the first letter of.
 *
 * `on-dark` swaps to the variant with white lettering. The tagline is opt-in —
 * it belongs on a signature, not on every piece of chrome that needs the name.
 */
export function Wordmark({
  className,
  tone = "ink",
  tagline = false,
}: {
  className?: string;
  /**
   * `ink` for light grounds and `on-dark` for dark neutral ones — both keep the
   * mark in its own gradient.
   *
   * `knockout` is the one-colour reversed version, for a saturated or
   * photographic ground. It exists because the coloured mark loses its left
   * stroke against the entry panel: that stroke is brand violet and so is the
   * panel, so at chrome size the A read as a smudge. Derived from the artwork's
   * own alpha, which is the standard way an identity gets a reversed lockup.
   */
  tone?: "ink" | "on-dark" | "knockout";
  tagline?: boolean;
}) {
  const src = tagline
    ? tone === "knockout"
      ? "/brand/lockup-tagline-knockout.png"
      : tone === "on-dark"
        ? "/brand/lockup-tagline-white.png"
        : "/brand/lockup-tagline.png"
    : tone === "knockout"
      ? "/brand/lockup-knockout.png"
      : tone === "on-dark"
        ? "/brand/lockup-white.png"
        : "/brand/lockup.png";

  return (
    <img
      src={src}
      alt="Audentra"
      width={1174}
      height={tagline ? 283 : 198}
      /* `object-contain` and an explicit `w-auto` so a flex or grid parent that
         stretches its children cannot squash the lockup: it was being drawn at
         the full width of the entry panel and the height of its own class. */
      className={cn("w-auto object-contain", tagline ? "h-14" : "h-7", className)}
    />
  );
}
