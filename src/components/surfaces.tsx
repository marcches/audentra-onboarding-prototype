import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The surface levels, as components.
 *
 * The client's complaint across two rounds was that the flow reads as "coisas
 * jogadas no fundo" — things thrown onto a background. The cause was that there
 * was an app shell but no shell for the content inside it: a screen decided for
 * itself whether a group of fields sat on white, on grey, in a bordered box or
 * in nothing at all, and eight screens made eight different decisions.
 *
 * So the levels are components rather than a paragraph in a document. The
 * "never holds" column of the table is expressed here — a `Well` has no way to
 * take the primary action, a `FlatCard` refuses to render outside a `Well`, and
 * content on the Ground has to name which of the three documented exceptions it
 * is. A rule you can only remember is a rule the next round forgets.
 *
 * | Level     | Holds                                            | Never holds                       |
 * |-----------|--------------------------------------------------|-----------------------------------|
 * | Ground    | page title, section label, spacing                | field, row, image, datum, CTA     |
 * | Sections  | Sections, and nothing else                        | a second Sections                 |
 * | Section   | anything; Wells                                   | another Section                   |
 * | Well      | read-only summary, file list, dropzone, grid      | the primary action; a raised card |
 * | Flat card | a collection item on a Well                       | anything, with no Well under it   |
 *
 * One step of luminance and at most one border tell them apart. **Shadow is not
 * a level**: by ADR 0010 it belongs to what genuinely floats — modal, popover,
 * and the desktop action pill. `Panel` is gone; a `Section` says "this is one
 * thing" with a label, a rule and 16px, and if a screen ever reads as a grey
 * wall the fix is deleting a Section, never re-introducing the shadow.
 */

/* -------------------------------------------------------------------------
   Sections
   ---------------------------------------------------------------------- */

/**
 * The paper a Step's Sections share.
 *
 * Not a fifth surface and not `Panel` under another name: it has no header, no
 * footer, no padding of its own and holds nothing but Sections. It exists so
 * that six Sections are **one frame with rules between them** rather than six
 * framed boxes in a column — which is the stacking the client has objected to
 * three times, and which ADR 0010 would otherwise have re-created one size
 * smaller.
 */
export function Sections({
  as: Tag = "div",
  columns = 1,
  fill = false,
  footer,
  className,
  children,
}: {
  as?: "div" | "section" | "fieldset";
  /**
   * Two columns is the sixth Presence row, and it is what a Salesforce record
   * page actually looks like: sections beside sections, ruled like a table.
   * It halves the height of a Step *and* uses the width, which are the two
   * complaints this round exists to answer. One column where the sheet is
   * already inside a narrow half — Review's left-hand column asks for that.
   */
  columns?: 1 | 2;
  /**
   * Take the height left in the Step column, and hand it to whichever Section
   * asked to `grow`.
   *
   * Not a filler: a Step short enough to leave a gap has one part that is
   * genuinely better large — a dropzone you can throw a file anywhere into, a
   * list that has room to grow. Stretching *that* is using the space. An empty
   * div stretched to the same size is the void with a border around it, which
   * is what the first attempt at this shipped and what the client saw.
   */
  fill?: boolean;
  /** The guidance strip at the foot of the sheet — what is left, and what is next. */
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink-100 bg-panel",
        fill && "min-h-0 flex-1 self-stretch",
        className,
      )}
    >
      {/* The rules between Sections, drawn as a grid rather than as a stack of
          frames. Every Section carries a top and a left hairline and the
          wrapper pulls itself one pixel up and left, so the outer edges land
          under the sheet's own border and only the internal rules survive.
          This is what a second frame would have been, minus the frame. */}
      <div
        className={cn(
          "-mt-px -ml-px",
          /* Flex in one column so a Section can take the slack; grid in two,
             where the rules have to line up across the pair. */
          columns === 2 ? "grid grid-cols-2 narrow:grid-cols-1" : "flex min-h-0 flex-1 flex-col",
        )}
      >
        {children}
      </div>

      {footer ? (
        <div className="mt-auto border-t border-ink-100 bg-well px-3 py-2">{footer}</div>
      ) : null}
    </Tag>
  );
}

/**
 * One Section: a labelled header with a chevron, a rule, and a body. No shadow,
 * anywhere, ever (ADR 0010).
 *
 * The line that makes the whole round work is `value`: **a collapsed Section
 * shows what it holds, not just its name** — "Where you live now · 1226
 * University Dr, Menlo Park" (Pinterest). Collapsing therefore reveals progress
 * instead of hiding work, and that is what lets a ten-field Step fit in the
 * ~640px a 1366×768 machine actually has without deleting a single field.
 *
 * The open/close transition is `grid-template-rows`, never `height`. Animating
 * height reflows the subtree on every frame and is the first suspect for the
 * stutter the client reported.
 */
export function Section({
  title,
  value,
  count,
  action,
  icon,
  step,
  done = false,
  grow = false,
  defaultOpen = true,
  collapsible = false,
  span = false,
  className,
  bodyClassName,
  children,
}: {
  title: React.ReactNode;
  /**
   * What this Section holds, in one line, shown when it is closed. A Section
   * with nothing answered yet passes nothing and reads as an invitation.
   */
  value?: React.ReactNode;
  /** `[filled, total]`. Drawn from three fields up, where a value stops fitting. */
  count?: [number, number];
  /** The one secondary action allowed in the header. Never the primary action. */
  action?: React.ReactNode;
  /**
   * A Phosphor icon, at `duotone`, for a Section whose subject has one. The
   * weight matters: `duotone` reads as a label on a header where `fill` reads
   * as a status and `regular` disappears at 14px.
   */
  icon?: React.ReactNode;
  /**
   * Its place in the Step's own order, drawn as a numbered marker that turns
   * into a mint check once `done`. This is the conduction: a Step is a short
   * checklist and the student can see how far along it they are without
   * counting fields.
   */
  step?: number;
  done?: boolean;
  /** Takes the slack in a `fill`ing sheet. At most one Section per sheet. */
  grow?: boolean;
  defaultOpen?: boolean;
  /**
   * Off by default, and that is the correction.
   *
   * Every Section was collapsible in the first pass and the screen read as a
   * wall of accordions — a chevron beside something nobody wants to close is a
   * control that only ever costs a click. A Section earns one when closing it
   * genuinely helps: a read-back summary, a long optional block, an
   * explanation. A form the student is filling in right now does not.
   */
  collapsible?: boolean;
  /** Takes the whole width of a two-column sheet. For the one that will not halve. */
  span?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const shown = collapsible ? open : true;
  const complete = count ? count[0] >= count[1] : false;

  /**
   * The header is a tinted band, not a line of text sitting on the body.
   *
   * The first pass set title, counter and value at similar weights on the
   * white body and the hierarchy did not read. A Salesforce section header is
   * a *bar*: one tone down from its own body, the label at the left, the state
   * at the right. That single tone is what turns a column of fields into a
   * record — and it costs nothing, because it is a fill rather than a shadow.
   */
  const marker =
    step === undefined ? null : (
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold numeric",
          "transition-colors duration-[var(--duration-base)]",
          done ? "bg-mint-500 text-white" : "bg-ink-200 text-ink-600",
        )}
      >
        {done ? <CheckIcon weight="bold" aria-hidden className="size-3" /> : step}
      </span>
    );

  const header = (
    <>
      {collapsible ? (
        <CaretDownIcon
          weight="bold"
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 text-ink-400",
            "transition-transform duration-[var(--duration-quick)] ease-[var(--ease-out-soft)]",
            !shown && "-rotate-90",
          )}
        />
      ) : null}
      {marker}
      {icon ? <span className="shrink-0 text-ink-400">{icon}</span> : null}
      <span className="shrink-0 text-h3 font-bold text-ink-900">{title}</span>
      {/* Only when closed. Open, the value is the fields themselves, and
          printing it twice is the section saying the same thing to itself. */}
      {!shown && value ? (
        <span className="min-w-0 flex-1 truncate text-right text-small text-ink-500">{value}</span>
      ) : null}
    </>
  );

  return (
    <section
      className={cn(
        "flex min-w-0 flex-col border-t border-l border-ink-100",
        span && "col-span-full",
        grow && "min-h-0 flex-1",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-ink-100 bg-well px-3 py-1.5">
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={shown}
            className="row-nudge flex min-w-0 flex-1 items-center gap-2 text-left compact:min-h-[var(--tap-target)]"
          >
            {header}
          </button>
        ) : (
          <span className="flex min-w-0 flex-1 items-center gap-2">{header}</span>
        )}

        {count && count[1] > 2 ? (
          <span
            className={cn(
              "shrink-0 rounded-[var(--radius-pill)] px-1.5 py-0.5 text-micro font-bold tracking-[0.05em] uppercase numeric",
              complete ? "bg-mint-50 text-mint-deep" : "bg-ink-100 text-ink-500",
            )}
          >
            {count[0]}/{count[1]}
          </span>
        ) : null}
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <Reveal open={shown} className="min-h-0 flex-1">
        <div className={cn("flex h-full flex-col px-3 py-2.5", bodyClassName)}>{children}</div>
      </Reveal>
    </section>
  );
}

/**
 * A block that appears below the control that revealed it.
 *
 * This is the replacement ADR 0006 wrote for "a conditional block reserves its
 * space or is an overlay": the block is born directly under its trigger, with
 * an authored transition, and **nothing above the trigger moves**. Reserving
 * space would have been a hole in the layout before it was filled; an overlay
 * for one extra field is a modal around a text input.
 *
 * `grid-template-rows: 0fr → 1fr`, never `height: 0 → auto`. Every reveal in
 * the flow used the second one, which meant several subtrees reflowing on every
 * frame — the first suspect for "a animação está travada".
 */
export function Reveal({
  open,
  className,
  children,
}: {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-[var(--duration-base)] ease-[var(--ease-out-soft)]",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
    >
      {/* The clip that lets the track animate without the content spilling
          while it is between sizes. */}
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

/**
 * A Section's fields, on twelve columns.
 *
 * Twelve rather than two, because two is not a layout — it is the assumption
 * that every answer is the same size, and it is what put a ZIP code in a box
 * the width of a street address. Each `Field` declares how much room its answer
 * needs and this grid honours it; see `FIELD_WIDTH`.
 *
 * The breakpoint is the **column**, not the window (ADR 0008): the same Section
 * in a 64rem form column and in a 26rem Review column has to make its own
 * decision, and asking the viewport would give the wrong answer in one of them.
 */
export function SectionFields({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid grid-cols-12 gap-x-3 gap-y-2.5 narrow:grid-cols-1", className)}>
      {children}
    </div>
  );
}

/**
 * One fact, as a label→value row (Salesforce Task record).
 *
 * Rows rather than a grid of cells, because a grid makes the reader scan in two
 * directions to answer "when does it start". Two of these sit side by side
 * inside a `SectionFields`.
 */
export function Fact({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "col-span-6 flex items-baseline justify-between gap-3 border-b border-ink-100/70 py-1 narrow:col-span-full",
        className,
      )}
    >
      <dt className="shrink-0 text-small text-ink-500">{label}</dt>
      <dd className="min-w-0 text-right text-small font-strong text-ink-800">{children}</dd>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Well
   ---------------------------------------------------------------------- */

/**
 * An inset within a Section: read-only summaries, file lists, dropzones,
 * previews, threads and grids.
 *
 * Darker than the Section and never darker than the Ground, so an inset reads
 * as recessed within its frame rather than as a hole punched through to the
 * page. It never holds the primary action and never holds a raised card — an
 * elevated item inside a recess rises above its own container.
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
        !flush && "p-2.5",
        className,
      )}
    >
      {label ? (
        <p className="mb-1.5 text-micro font-bold tracking-[0.06em] text-ink-500 uppercase">
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
 * page rather than inside a Section. Each has a reference behind it and each
 * has to name itself here, so "I put it on the Ground" is never a decision a
 * screen makes quietly.
 *
 * - `section-label` — a label *for* the group below it, which cannot live
 *   inside the thing it names (Cloudflare AI Gateway Settings).
 * - `catalogue` — a collection that *is* the screen. Framing it puts a white
 *   box on a grey page containing white cards: border around border, and the
 *   reason catalogues ended up looking thrown down (Kit "Choose your template").
 * - `checkout-asymmetry` — the checkout, where only the summary is framed.
 *   Framing both halves would erase the emphasis that makes the summary the
 *   summary (Squarespace "Review Order", Babbel "Select payment method").
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
        "flex size-4 shrink-0 items-center justify-center rounded-full border",
        "transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-soft)]",
        selected ? "border-violet-500 bg-violet-500 text-white" : "border-ink-300 bg-panel",
        className,
      )}
    >
      {selected ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="size-2.5"
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
        size === "sm" && "size-7",
        size === "md" && "size-9",
        size === "lg" && "size-10",
        className,
      )}
    >
      {children}
    </span>
  );
}
