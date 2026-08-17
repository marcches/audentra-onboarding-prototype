import type { Recomposition } from "@/lib/layout";

/**
 * The portal's Presence table (ADR 0014).
 *
 * The gate's table in `layout.ts` is closed at eight and stays there. The portal
 * brings pieces it never anticipated — a sidebar that becomes a bottom
 * navigation, a two-column landing screen, a card whose five metadata fields
 * cannot all survive at 390px — and growing the existing table to twelve
 * destroys the only thing it does: eight is a number a reviewer can hold, twelve
 * is a list nobody notices a thirteenth row going into.
 *
 * **What is not duplicated here**: the three width classes, the 1366×768 design
 * viewport, and the rule that container queries own the content column while
 * media queries own the shell. Those are ADR 0008's, they are a property of the
 * machines students use rather than of a surface, and they are inherited
 * unchanged. Only the exception list splits.
 *
 * Written in the cycle that needs it, with the rows this cycle actually has. A
 * row for a piece no screen has demanded yet is a guess, and guesses are what a
 * closed list exists to keep out.
 */

export type PortalPieceId =
  | "area-navigation"
  | "portal-balance"
  | "dashboard-columns"
  | "quest-metadata";

export type PortalPresenceRow = {
  id: PortalPieceId;
  piece: string;
  /** What the piece is below 768. */
  compact: string;
  /** What it is at 768 and above. */
  desktop: string;
  recomposes: Recomposition;
};

/**
 * Closed at four. A fifth needs a written reason in the same change, and the
 * argument has to be that no container query can express it.
 */
export const portalPresence: readonly PortalPresenceRow[] = [
  {
    id: "area-navigation",
    piece: "Area navigation",
    compact: "Bottom navigation, the primary Areas",
    desktop: "Sidebar at the left, 14rem, three groups, never collapsing",
    recomposes: "swap",
  },
  {
    id: "portal-balance",
    piece: "Compact Balance",
    compact: "In the top bar, beside the institution",
    desktop: "Foot of the sidebar, permanent",
    recomposes: "swap",
  },
  {
    id: "dashboard-columns",
    piece: "Dashboard columns",
    compact: "One column: the work, then the Balance under it",
    desktop: "Work in the primary column, Balance in the secondary",
    recomposes: "reflow",
  },
  {
    id: "quest-metadata",
    piece: "Quest card metadata",
    compact: "Wraps to two rows under the blurb",
    desktop: "One row of facts beneath the blurb",
    recomposes: "reflow",
  },
];
