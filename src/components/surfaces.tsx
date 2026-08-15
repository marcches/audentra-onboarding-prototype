import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The four surface levels, as components.
 *
 * The client's complaint across two rounds was that the flow reads as "coisas
 * jogadas no fundo" — things thrown onto a background. The cause was that there
 * was an app shell but no shell for the content inside it: a screen decided for
 * itself whether a group of fields sat on white, on grey, in a bordered box or
 * in nothing at all, and eight screens made eight different decisions.
 *
 * So the levels are components rather than a paragraph in a document. The
 * "never holds" column of the ticket's table is expressed here — a `Well` has
 * no way to take the primary action, a `FlatCard` refuses to render outside a
 * `Well`, and content on the Ground has to name which of the three documented
 * exceptions it is. A rule you can only remember is a rule the next round
 * forgets.
 *
 * | Level     | Holds                                             | Never holds                    |
 * |-----------|---------------------------------------------------|--------------------------------|
 * | Ground    | page title, section label, spacing                 | field, row, image, datum, CTA |
 * | Panel     | anything; internal dividers; Wells                 | another identical Panel        |
 * | Well      | read-only summary, file list, dropzone, grid       | the primary action; a raised card |
 * | Flat card | a collection item on a Well                        | anything, with no Well under it |
 *
 * One step of luminance and at most one border tell them apart. Shadow is not a
 * level: it belongs to what genuinely floats — modal, popover, the fixed bar.
 */

/* -------------------------------------------------------------------------
   Panel
   ---------------------------------------------------------------------- */

/**
 * An elevated frame around exactly one subject.
 *
 * The header is title, optional subtitle and at most one secondary action on
 * the same line, divided from the body by a rule (Airwallex Settings). The
 * footer carries metadata at the left and the escape action at the right, as a
 * line of the panel itself rather than a button floating below it (Xero, Clerk).
 *
 * Where several panels are sequential parts of one form with no independent
 * actions, they are one Panel with `<PanelDivider />` between the groups rather
 * than N Panels (lululemon Checkout). N framed boxes in a column is the
 * "empilhamento" the client has objected to twice.
 */
export function Panel({
  as: Tag = "section",
  title,
  description,
  action,
  footer,
  footerMeta,
  aside = false,
  flush = false,
  className,
  bodyClassName,
  children,
}: {
  /**
   * `fieldset` where the Panel *is* a group of related controls. A panel with
   * a legend that isn't a fieldset is a heading pretending to be one.
   */
  as?: "section" | "fieldset" | "div";
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** The one secondary action allowed in the header. Never the primary action. */
  action?: React.ReactNode;
  /** The footer's action, at the right. */
  footer?: React.ReactNode;
  /** The footer's metadata, at the left. */
  footerMeta?: React.ReactNode;
  /**
   * A Panel carrying explanation rather than input. Tinted, so it reads as
   * reference beside the work. It is still a Panel and not a Well: a Well is
   * for data, and an explanation is not data.
   */
  aside?: boolean;
  /** Body padding removed, for a Panel whose child bleeds to its edges. */
  flush?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const hasHeader = Boolean(title || description || action);

  return (
    <Tag
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border",
        aside ? "border-ink-100 bg-ink-50/70" : "border-ink-100 bg-panel shadow-soft",
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex items-start gap-3 border-b border-ink-100 px-4 py-3 sm:px-5">
          <div className="min-w-0 flex-1 space-y-0.5">
            {title ? <h2 className="text-h3 text-ink-900">{title}</h2> : null}
            {description ? <p className="text-small text-ink-500">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className={cn(!flush && "p-4 sm:p-5", bodyClassName)}>{children}</div>

      {footer || footerMeta ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 bg-well px-4 py-3 sm:px-5">
          <div className="min-w-0 flex-1 text-small text-ink-500">{footerMeta}</div>
          {footer ? <div className="shrink-0">{footer}</div> : null}
        </div>
      ) : null}
    </Tag>
  );
}

/**
 * The rule between two groups inside one Panel. This is what a second Panel
 * would have been, minus the second frame.
 */
export function PanelDivider({ className }: { className?: string }) {
  return <hr aria-hidden className={cn("-mx-4 my-5 border-ink-100 sm:-mx-5", className)} />;
}

/* -------------------------------------------------------------------------
   Well
   ---------------------------------------------------------------------- */

/**
 * An inset within a Panel: read-only summaries, file lists, dropzones,
 * previews, threads and grids.
 *
 * Darker than the Panel and never darker than the Ground, so an inset reads as
 * recessed within its frame rather than as a hole punched through to the page.
 * It never holds the primary action and never holds a raised card — an elevated
 * item inside a recess rises above its own container, which is the visible bug
 * on Housing and Campus life today.
 */
export function Well({
  as: Tag = "div",
  label,
  dashed = false,
  strong = false,
  flush = false,
  className,
  children,
}: {
  as?: "div" | "section" | "ul" | "ol";
  /** A Well may carry its own quiet label; two sibling Wells often share one. */
  label?: React.ReactNode;
  /** A dropzone. Border instead of fill, because it is an invitation not a record. */
  dashed?: boolean;
  /** One step deeper, for a Well that is the local ground under flat cards. */
  strong?: boolean;
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-field)]",
        dashed
          ? "border border-ink-200 border-dashed bg-transparent"
          : strong
            ? "bg-well-strong"
            : "bg-well",
        !flush && "p-3 sm:p-4",
        className,
      )}
    >
      {label ? (
        <p className="mb-2 text-micro font-bold tracking-[0.06em] text-ink-500 uppercase">
          {label}
        </p>
      ) : null}
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
   Flat card
   ---------------------------------------------------------------------- */

/**
 * A collection item on a Well. Hairline border, no shadow, image bleeding to
 * the edge (Jira "Select a template", Bloom).
 *
 * It is deliberately not a `Card` with elevation: the Well under it is already
 * the local ground for the collection, and raising every item off it would put
 * a shadow inside a recess.
 */
export function FlatCard({
  as: Tag = "div",
  selected = false,
  interactive = false,
  className,
  children,
  ...rest
}: {
  as?: "div" | "article" | "li" | "button" | "label";
  /** Fill and a check. Never elevation, never a size change — see `SelectionMark`. */
  selected?: boolean;
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-field)] border bg-panel text-left",
        "transition-[background-color,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-soft)]",
        selected ? "border-violet-400 bg-violet-50/60 ring-glow" : "border-ink-100",
        interactive && !selected && "hover:border-ink-200 hover:bg-ink-50/50",
        className,
      )}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
   The Ground, and its three exceptions
   ---------------------------------------------------------------------- */

/**
 * The three — and only three — places content sits directly on the recessed
 * page rather than inside a Panel. Each has a reference behind it and each has
 * to name itself here, so "I put it on the Ground" is never a decision a screen
 * makes quietly.
 *
 * - `section-label` — a label *for* the panel below it, which cannot live
 *   inside the thing it names (Cloudflare AI Gateway Settings).
 * - `catalogue` — a collection that *is* the screen. Framing it puts a white
 *   box on a grey page containing white cards: border around border, and the
 *   reason catalogues ended up looking thrown down (Kit "Choose your template").
 * - `checkout-asymmetry` — the checkout, where only the summary is framed.
 *   Framing both halves would erase the emphasis that makes the summary the
 *   summary (Squarespace "Review Order").
 */
export type GroundException = "section-label" | "catalogue" | "checkout-asymmetry";

/**
 * Content on the Ground, with its exception declared.
 *
 * The `reason` is not decorative: it is a prop nobody can supply by accident,
 * and grepping for `OnGround` finds every place the rule was invoked. A fourth
 * exception cannot be added without editing the union above, which is where the
 * argument for it belongs.
 */
export function OnGround({
  reason,
  as: Tag = "div",
  className,
  children,
}: {
  reason: GroundException;
  as?: "div" | "section" | "header";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag data-ground-exception={reason} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A section label on the Ground — the first exception, and the common one.
 */
export function SectionLabel({
  children,
  description,
  action,
}: {
  children: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <OnGround reason="section-label" as="header" className="flex items-end gap-3">
      <div className="min-w-0 flex-1">
        <h2 className="text-h3 text-ink-900">{children}</h2>
        {description ? <p className="text-small text-ink-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </OnGround>
  );
}

/* -------------------------------------------------------------------------
   Selection
   ---------------------------------------------------------------------- */

/**
 * How a chosen thing says so, everywhere in the system: fill and a check.
 *
 * Never elevation. An item that lifts when selected rises above the container
 * it is sitting in, and it moves its neighbours while the student is still
 * choosing — the two failures the client has named. The mark is absolutely
 * positioned and the fill is a background, so a card is the same size and in
 * the same place selected as unselected.
 */
export function SelectionMark({ selected, className }: { selected: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border",
        "transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-soft)]",
        selected ? "border-violet-500 bg-violet-500 text-white" : "border-ink-300 bg-panel",
        className,
      )}
    >
      {selected ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="size-3"
          fill="none"
          stroke="currentColor"
        >
          <path d="M2 6.2 4.6 8.8 10 3.4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : null}
    </span>
  );
}

/**
 * A brand-tinted container for an icon. Never behind text — the tint is a
 * container's tint, and at 12% it has no business carrying a word.
 */
export function IconTile({
  size = "md",
  className,
  children,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "icon-tile shrink-0",
        size === "sm" && "size-8",
        size === "md" && "size-10",
        size === "lg" && "size-12",
        className,
      )}
    >
      {children}
    </span>
  );
}
