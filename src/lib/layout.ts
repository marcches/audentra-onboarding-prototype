/**
 * The layout domain: three width classes, and the eight pieces that differ
 * between them.
 *
 * This is a data module rather than a paragraph in `docs/design-research.md`
 * for one reason: "the exceptions are exactly eight" is not a claim anybody can
 * check about a markdown table. Here it is a length, the test counts it, and a
 * ninth row has to be argued for in a diff rather than typed into a document
 * nobody re-reads. Without that, Presence is `hidden lg:block` with a nicer
 * name — which is precisely what ADR 0008 exists to stop.
 *
 * The classes come from ADR 0008. **1366×768 is the viewport this is designed
 * for**, so the composition below is written desktop-first and `compact` is the
 * override — the opposite of the mobile tree with breakpoints stacked on top
 * that produced "o desktop não foi construído, foi alargado".
 */

/**
 * Three, and no more. 1280 rather than 1366 so a real HD machine sits inside
 * the class rather than on its edge; above 1280 nothing recomposes, larger
 * monitors only release the archetype measures.
 */
export type WidthClass = "compact" | "medium" | "desktop";

export type WidthClassDefinition = {
  id: WidthClass;
  /** Inclusive lower bound, in CSS pixels. */
  from: number;
  /** Exclusive upper bound. `null` for the class with no ceiling. */
  to: number | null;
  why: string;
};

export const widthClasses: readonly WidthClassDefinition[] = [
  {
    id: "compact",
    from: 0,
    to: 768,
    why: "The phone. One column, a segmented PhaseBar, and a fixed action bar.",
  },
  {
    id: "medium",
    from: 768,
    to: 1280,
    why: "Tablets and small laptops. The desktop composition, at its narrowest.",
  },
  {
    id: "desktop",
    from: 1280,
    to: null,
    why: "1366×768 lives here. Above it only the archetype measures release.",
  },
];

/* -------------------------------------------------------------------------
   Presence
   ---------------------------------------------------------------------- */

/**
 * The eight pieces that are genuinely different between a phone and a desktop.
 * Everything else is one DOM node whose composition changes through CSS, which
 * is the whole of ADR 0008: rendering by measured width in JS is what caused
 * the flick and the wrong DOM the client reported.
 */
export type PieceId =
  | "spine-navigation"
  | "step-actions"
  | "balance"
  | "residence-gallery"
  | "campus-life-filter"
  | "step-sections"
  | "review-columns"
  | "autosave";

/**
 * How a row differs between the classes.
 *
 * - `swap` — two nodes, each drawn in one class and absent in the other. This
 *   is the expensive kind and the reason the table is closed at eight.
 * - `reflow` — one node, one collapsed state, recomposed by a container query.
 *   Free, and the shape every new piece should reach for first.
 */
export type Recomposition = "swap" | "reflow";

export type PresenceRow = {
  id: PieceId;
  piece: string;
  /** What the piece is below 768. */
  compact: string;
  /** What it is at 768 and above. */
  desktop: string;
  recomposes: Recomposition;
};

/**
 * Closed at eight. A ninth row needs a written reason in the same change, and
 * the argument has to be that no container query can express it.
 */
export const presence: readonly PresenceRow[] = [
  {
    id: "spine-navigation",
    piece: "Spine navigation",
    compact: "Segmented PhaseBar at the top",
    desktop: "Rail at the left, 16rem, never collapsing",
    recomposes: "swap",
  },
  {
    id: "step-actions",
    piece: "Step actions",
    compact: "Fixed bar at the foot",
    desktop: "Floating pill at the foot",
    recomposes: "swap",
  },
  {
    id: "balance",
    piece: "Balance",
    compact: "Compressed into the PhaseBar",
    desktop: "Foot of the Rail, permanent",
    recomposes: "swap",
  },
  {
    id: "residence-gallery",
    piece: "Residence gallery",
    compact: "Inline carousel",
    desktop: "1+4 mosaic opening the categorised viewer",
    recomposes: "swap",
  },
  {
    id: "campus-life-filter",
    piece: "Campus life filter",
    compact: "Sheet, opened by a button",
    desktop: "Chip band above the grid",
    recomposes: "swap",
  },
  {
    id: "step-sections",
    piece: "Step sections",
    compact: "One column",
    desktop: "Two columns",
    recomposes: "reflow",
  },
  {
    id: "review-columns",
    piece: "Review & sign",
    compact: "One column, answers first",
    desktop: "Answers left, document and signature right",
    recomposes: "reflow",
  },
  {
    id: "autosave",
    piece: "Autosave line",
    compact: "Inside the fixed bar",
    desktop: "Inside the pill",
    recomposes: "swap",
  },
];

export function presenceOf(id: PieceId): PresenceRow {
  const row = presence.find((entry) => entry.id === id);
  // Unreachable while `PieceId` and the table agree, which is the point of the
  // union — but a lookup returning `undefined` would push the problem into
  // whichever component happened to render next.
  if (!row) throw new Error(`No Presence row for: ${id}`);
  return row;
}

/* -------------------------------------------------------------------------
   The three classes, as class names
   ---------------------------------------------------------------------- */

/**
 * The `swap` rows, expressed. Literal strings rather than a builder, because
 * Tailwind scans source text and a composed class name is a class name that
 * does not exist.
 *
 * The base state is the desktop composition and `compact:` is the override —
 * `hidden compact:block` therefore means "the phone's half of a swapped row"
 * and `compact:hidden` means "the desktop's half". There is no third form, and
 * a piece that needs one is a ninth Presence row.
 */
export const inCompact = "hidden compact:block";
export const inCompactFlex = "hidden compact:flex";
export const aboveCompact = "compact:hidden";

/**
 * The Rail's width and the offset everything that clears it reads.
 *
 * 16rem, declared once. It was 14 — the figure the spec carried — and at 14 with
 * this type scale the Quest names wrapped and the whole column read as a
 * caption beside the screen rather than as the spine of it. Two more rem buys
 * every Quest name one line and costs the Step column nothing it was using.
 *
 * A rail that changed width between Steps would slide the page sideways on
 * every navigation, on a flow that is nothing but navigation — so the width is
 * not a per-Step decision and there is nowhere to make one.
 */
export const RAIL_WIDTH = "w-64";
export const RAIL_OFFSET = "left-64";
