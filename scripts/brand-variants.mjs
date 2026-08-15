/**
 * Generates every served brand asset from the three vector masters in `brand/`.
 *
 * Run with `node scripts/brand-variants.mjs`. Output goes to `public/brand/`,
 * which is generated in full — nothing there should be edited by hand.
 *
 * The masters are Illustrator exports: fills live in a `<style>` block as
 * `.cls-1` … `.cls-5`, and the shapes sit inside two nested, untransformed
 * `<g>` wrappers. Both are hazards on a page — the class rules are global the
 * moment an SVG is inlined — so this flattens the groups and moves each fill
 * onto the shape that carries it.
 */

import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "brand");
const OUT = join(ROOT, "public", "brand");

/**
 * What each class in the masters means. The names are roles, not hues: two of
 * them do double duty, carrying both a plane of the mark and a word of the
 * tagline, which is what lets one mapping recolour all three masters.
 */
const PALETTE = {
  "cls-2": "#6a38ff", // Violet — the long left stroke of the A.
  "cls-3": "#1e5bff", // Azure — the top plane, and "what's" in the tagline.
  "cls-1": "#04b2a9", // Teal — the underside of the fold, seen through the counter.
  "cls-4": "#02cdc7", // Mint — the right stroke, and "next" in the tagline.
  "cls-5": "#0a1f44", // Ink — the wordmark, and the body of the tagline.
};

/**
 * The four colourings the identity has to be able to take.
 *
 * `white` is the one worth explaining: it turns the ink white and leaves every
 * brand hue alone, because on a dark *neutral* ground the mark should still be
 * itself. `knockout` exists for the ground the mark cannot survive — the entry
 * panel is brand violet, and so is the A's left stroke, so at chrome size the
 * coloured lockup reads as a smudge on its own colour.
 */
const TONES = {
  colour: (cls) => PALETTE[cls],
  white: (cls) => (cls === "cls-5" ? "#ffffff" : PALETTE[cls]),
  knockout: () => "#ffffff",
  mono: () => "currentColor",
};

/** The mark is the first four shapes of every master, before any lettering. */
const SYMBOL_SHAPES = 4;

/** Pulls the shapes out of a master, in paint order, with fills resolved. */
function shapes(file, tone) {
  const svg = readFileSync(join(SOURCE, file), "utf8");
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
  if (!viewBox) throw new Error(`${file}: no viewBox`);

  // The groups carry no transform, so dropping them is lossless. Verified by
  // the absence of any `transform=` in the masters — assert rather than trust.
  if (/<g[^>]*\stransform=/.test(svg)) throw new Error(`${file}: transformed group`);

  const body = svg.slice(svg.indexOf("</defs>"));
  const elements = [...body.matchAll(/<(path|polygon)\s[^>]*\/>/g)].map(([el], index) =>
    el.replace(/class="(cls-\d)"/, (_, cls) => {
      const fill = TONES[tone](cls);
      if (!fill) throw new Error(`${file}: unmapped ${cls}`);
      // The mark's four planes abut rather than overlap, so the renderer
      // antialiases both edges of every shared edge and leaves a hairline of
      // ground showing through — a seam down the A, worst where the two flat
      // tones make it a seam in a solid silhouette. A hairline stroke in the
      // shape's own fill closes the gap without changing any colour. Only the
      // mark gets it: the wordmark's letters do not touch, and stroking them
      // would just bolden the type.
      const seam = index < SYMBOL_SHAPES ? ` stroke="${fill}" stroke-width="0.75"` : "";
      return `fill="${fill}"${seam}`;
    }),
  );

  if (elements.length === 0) throw new Error(`${file}: no shapes`);
  // Every master opens with the mark, in the same paint order. The variants
  // depend on that to know where the mark ends, so check it rather than assume.
  if (!elements[0].includes("147 55.02")) throw new Error(`${file}: does not open with the mark`);
  return { viewBox, elements };
}

/** Wraps shapes in a document. `transform` is used only by the icon crops. */
function document({ viewBox, elements }, { label, transform, ground } = {}) {
  const indent = transform ? "    " : "  ";
  const inner = elements.map((el) => `${indent}${el}`).join("\n");
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="Audentra${label ? ` — ${label}` : ""}">`,
    "  <title>Audentra</title>",
    ground ? `  <rect width="100%" height="100%" fill="${ground}"/>` : null,
    transform ? `  <g transform="${transform}">` : null,
    inner,
    transform ? "  </g>" : null,
    "</svg>",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * Centres a master on a square canvas.
 *
 * The mark is 1.29:1, so height is what constrains a square — `pad` is stated
 * as a fraction of the canvas so a favicon can sit almost edge to edge while a
 * maskable icon keeps its safe zone.
 */
function square({ viewBox, elements }, { size, pad, ...rest }) {
  const [, , w, h] = viewBox.split(/\s+/).map(Number);
  const box = size * (1 - pad * 2);
  const k = Math.min(box / w, box / h);
  const tx = (size - w * k) / 2;
  const ty = (size - h * k) / 2;
  return document(
    { viewBox: `0 0 ${size} ${size}`, elements },
    { transform: `translate(${round(tx)} ${round(ty)}) scale(${round(k)})`, ...rest },
  );
}

const round = (n) => Number(n.toFixed(3));

const MASTERS = {
  symbol: "audentra-symbol.svg",
  logo: "audentra-logo.svg",
  "logo-full": "audentra-logo-full.svg",
};

const LABELS = {
  colour: null,
  white: "on dark",
  knockout: "knockout",
  mono: "monochrome",
};

const files = new Map();

for (const [name, master] of Object.entries(MASTERS)) {
  for (const tone of Object.keys(TONES)) {
    // The mark carries no ink, so its `white` is byte-for-byte its `colour`.
    // Emitting both would be two names for one file and an invitation to reach
    // for the wrong one.
    if (name === "symbol" && tone === "white") continue;
    const suffix = tone === "colour" ? "" : `-${tone}`;
    files.set(`${name}${suffix}.svg`, document(shapes(master, tone), { label: LABELS[tone] }));
  }
}

// The favicon: the mark, near edge to edge, because at 16px every pixel of
// padding is a pixel the A does not get.
files.set("favicon.svg", square(shapes(MASTERS.symbol, "colour"), { size: 200, pad: 0.02 }));

// The maskable icon: platforms crop this to their own silhouette, so the mark
// stays inside the central 62% and sits on paper rather than on transparency.
files.set(
  "icon-maskable.svg",
  square(shapes(MASTERS.symbol, "colour"), {
    size: 512,
    pad: 0.19,
    ground: "#ffffff",
    label: "app icon",
  }),
);

mkdirSync(OUT, { recursive: true });

// Generated in full: clear the SVGs we own so a renamed variant cannot linger
// as a file nothing generates and nothing removes.
for (const existing of readdirSync(OUT)) {
  if (existing.endsWith(".svg") && !files.has(existing)) unlinkSync(join(OUT, existing));
}

for (const [name, contents] of files) {
  writeFileSync(join(OUT, name), contents, "utf8");
  console.log(`public/brand/${name}`);
}
