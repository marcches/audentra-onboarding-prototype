import { cn } from "@/lib/utils";

/**
 * The Audentra identity.
 *
 * The mark is a ribbon folded into an A — a continuous band whose planes run
 * violet → azure → teal, with the crossbar reading as the underside of the
 * fold. The mark *is* the A of AUDENTRA, so there is no "mark plus text"
 * arrangement to compose in CSS: the lockup is one drawing, and setting the
 * letters in Satoshi beside the mark would both mismatch the typeface and
 * duplicate the A.
 *
 * These were bitmaps until the vector arrived. Everything here now points at
 * `public/brand/*.svg`, which is generated from the masters in `brand/` by
 * `scripts/brand-variants.mjs` — the geometry is never copied into this file,
 * so a redrawn logo is one `node scripts/brand-variants.mjs` away from being
 * correct in every tone at once.
 */

/** Natural proportions of the generated assets, so nothing has to guess a height. */
const RATIO = {
  symbol: 192.33 / 149.59,
  logo: 990 / 149.59,
  full: 990 / 219.09,
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
   * colours, by masking a block of colour through the asset's alpha.
   *
   * For the one job the coloured mark cannot do: being used as material. The
   * entry panel crops it oversized behind its own type at a few per cent white,
   * where its colours would fight the ground it is sitting on.
   *
   * `knockout` is the same silhouette in flat white, for when the ground is
   * fixed and dark.
   */
  tone?: "colour" | "mono" | "knockout";
}) {
  if (tone === "mono") {
    return (
      <span
        aria-hidden
        className={cn("inline-block bg-current", className)}
        style={{
          aspectRatio: String(RATIO.symbol),
          maskImage: "url(/brand/symbol-mono.svg)",
          WebkitMaskImage: "url(/brand/symbol-mono.svg)",
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
      src={tone === "knockout" ? "/brand/symbol-knockout.svg" : "/brand/symbol.svg"}
      alt="Audentra"
      width={192}
      height={150}
      className={cn("h-8 w-auto object-contain", className)}
    />
  );
}

/**
 * The full lockup: the mark and the wordmark it forms the first letter of.
 *
 * The tagline is opt-in — it belongs on a signature, not on every piece of
 * chrome that needs the name.
 */
export function Wordmark({
  className,
  tone = "ink",
  tagline = false,
}: {
  className?: string;
  /**
   * `ink` for light grounds and `on-dark` for dark neutral ones — both keep the
   * mark in its own colours, because on a neutral the mark should still be
   * itself; only the lettering moves.
   *
   * `knockout` is the one-colour reversed version, for a saturated or
   * photographic ground. It exists because the coloured mark loses its left
   * stroke against the entry panel: that stroke is brand violet and so is the
   * panel, so at chrome size the A read as a smudge.
   *
   * `mono` is the same reversed drawing in `currentColor`, for anywhere the
   * lockup has to take the colour of the text around it.
   */
  tone?: "ink" | "on-dark" | "knockout" | "mono";
  tagline?: boolean;
}) {
  const base = tagline ? "/brand/logo-full" : "/brand/logo";
  const ratio = String(tagline ? RATIO.full : RATIO.logo);

  /* `currentColor` does not cross an `<img>` boundary — the browser renders the
     file as its own document, where `currentColor` is just black. So the one
     tone that has to inherit the surrounding text colour is drawn the same way
     the mono mark is: a block of `bg-current` cut to the artwork's alpha. */
  if (tone === "mono") {
    return (
      <span
        role="img"
        aria-label="Audentra"
        className={cn("inline-block bg-current", tagline ? "h-14" : "h-7", className)}
        style={{
          aspectRatio: ratio,
          maskImage: `url(${base}-mono.svg)`,
          WebkitMaskImage: `url(${base}-mono.svg)`,
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

  const suffix = tone === "knockout" ? "-knockout" : tone === "on-dark" ? "-white" : "";

  return (
    <img
      src={`${base}${suffix}.svg`}
      alt="Audentra"
      width={990}
      height={tagline ? 219 : 150}
      /* `object-contain` and an explicit `w-auto` so a flex or grid parent that
         stretches its children cannot squash the lockup: it was being drawn at
         the full width of the entry panel and the height of its own class. */
      className={cn("w-auto object-contain", tagline ? "h-14" : "h-7", className)}
      style={{ aspectRatio: ratio }}
    />
  );
}
