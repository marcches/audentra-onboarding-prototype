import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as React from "react";

import { SheetProgress, useSheetProgress } from "@/components/sections-context";
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
 *
 * **A sheet is the height of its content and has no way not to be.** It used to
 * take `fill`, which handed the Step column's leftover height to whichever
 * Section asked to `grow` — and the reasoning ("stretch the part that is
 * genuinely better large") was sound about the dropzone and wrong about
 * everything else, because a sheet that can stretch stretches on the screens
 * where nothing wanted the room. That is the white the client photographed:
 * `who-you-are` §3 with 90px under one sentence, `health` §2 with 140px under a
 * dropzone. Both props are gone from the prop surface rather than from the call
 * sites, so a future Step cannot reintroduce the void by passing them again;
 * the dropzone carries its own intrinsic height instead of borrowing the
 * column's slack. Ground under a short sheet is the ordinary state of a page.
 */
export function Sections({
  as: Tag = "div",
  columns = 1,
  signature = false,
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
   * The Audentra hairline: a 2px rule of the brand gradient across the top of
   * this sheet, and one of the two places in the whole system the gradient is
   * allowed to appear (ADR 0012).
   *
   * It is a signature rather than a stripe, which is a claim about *frequency*
   * before it is a claim about anything else: the screen's work sheet takes it
   * and nothing else on the screen does. The guide never carries it — a guide
   * signed like the work would make the signature furniture.
   *
   * It costs no height. The strip is drawn over the sheet's own top border
   * inside the existing `overflow-hidden`, so a signed sheet and an unsigned
   * one put their first Section header on the same pixel.
   */
  signature?: boolean;
  /** The guidance strip at the foot of the sheet — what is left, and what is next. */
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  /**
   * The first numbered Section that is not done — the one being filled in right
   * now. Decided here because it is a fact about the sheet: a Section cannot
   * know it is first, and a route made to work it out would be nine routes
   * working it out. See `sections-context.ts`.
   */
  const inProgress = React.useMemo(() => {
    for (const child of React.Children.toArray(children)) {
      if (!React.isValidElement<{ step?: number; done?: boolean }>(child)) continue;
      const { step, done } = child.props;
      if (step !== undefined && !done) return step;
    }
    return undefined;
  }, [children]);

  return (
    <Tag
      className={cn(
        /* No border. **Border delimits a control and nothing else** (ADR
           0015): a sheet is told apart from the room by tone, and a white
           panel on a violet-tinted ground needs no hairline to say where it
           starts. What the border was doing — and doing badly, three rounds of
           "stacking" complaints deep — is now the room's job. */
        "relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-panel",
        className,
      )}
    >
      {signature ? (
        <span aria-hidden className="brand-gradient absolute inset-x-0 top-0 h-1" />
      ) : null}

      {/* The rules between Sections, drawn as a grid rather than as a stack of
          frames. Every Section carries a top and a left hairline and the
          wrapper pulls itself one pixel up and left, so the outer edges land
          under the sheet's own border and only the internal rules survive.
          This is what a second frame would have been, minus the frame. */}
      <div
        className={cn(
          "-mt-px -ml-px",
          columns === 2 ? "grid grid-cols-2 narrow:grid-cols-1" : "flex flex-col",
        )}
      >
        <SheetProgress.Provider value={inProgress}>{children}</SheetProgress.Provider>
      </div>

      {footer ? <div className="border-t border-ink-100 bg-well px-3 py-2">{footer}</div> : null}
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
   * Its place in the Step's own order, drawn as a numbered marker in one of
   * three states: grey untouched, the brand gradient where the student is
   * standing, a mint check once `done`. This is the conduction — a Step is a
   * short checklist and the student can see how far along it they are without
   * counting fields.
   *
   * Which one is "here" is decided by the sheet and handed down; see
   * `sections-context.ts`. Nothing passes it in.
   */
  step?: number;
  done?: boolean;
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
  /* Handed down by the sheet, never computed here and never passed by a route:
     "first incomplete Section on this screen" is not a fact a Section has. */
  const active = useSheetProgress();
  const inProgress = step !== undefined && !done && step === active;

  /**
   * The header is a tinted band, not a line of text sitting on the body.
   *
   * The first pass set title, counter and value at similar weights on the
   * white body and the hierarchy did not read. A Salesforce section header is
   * a *bar*: one tone down from its own body, the label at the left, the state
   * at the right. That single tone is what turns a column of fields into a
   * record — and it costs nothing, because it is a fill rather than a shadow.
   */
  /**
   * The marker, in three states rather than two.
   *
   * It had grey and mint, which made "not started" and "being filled in right
   * now" the same grey — so a numbered checklist could not say where the
   * student was standing in it, which is the one thing a numbered checklist is
   * for. The third state is the brand gradient with a white numeral, and this
   * is one of the two places in the system it is allowed (ADR 0012).
   *
   * That works because the grammar is the rail's own, one level in: grey for
   * untouched, brand for here, mint for done. The gradient reads as *material*
   * rather than as status — flat violet keeps meaning "you are here" on the
   * rail and on the primary action, and nothing on this marker competes with
   * it, because a marker is not a control.
   */
  const marker =
    step === undefined ? null : (
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold numeric",
          "transition-colors duration-[var(--duration-base)]",
          done && "bg-mint-500 text-white",
          !done && inProgress && "brand-gradient text-white",
          !done && !inProgress && "bg-ink-200 text-ink-600",
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
            "size-4 shrink-0 text-ink-400",
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
        className,
      )}
    >
      <div className="flex items-center gap-2 bg-well px-4 py-2">
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
              "shrink-0 rounded-[var(--radius-pill)] px-2 py-1 text-meta font-bold numeric",
              complete ? "bg-mint-50 text-mint-deep" : "bg-ink-100 text-ink-500",
            )}
          >
            {count[0]}/{count[1]}
          </span>
        ) : null}
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <Reveal open={shown}>
        <div className={cn("flex flex-col px-4 pt-2 pb-4", bodyClassName)}>{children}</div>
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
          while it is between sizes.

          `inert` while closed, because a collapsed track is still *there*: the
          subtree keeps its place in the tab order and stays hit-testable, so a
          keyboard user tabs into a textarea nobody can see and a click lands on
          the first file input on the page rather than the visible one. Found by
          walking the flow — Health's medical upload, which is inside a closed
          Reveal, swallowed a file meant for the immunization record two Sections
          below it. `hidden`/`display:none` would fix it too and would kill the
          transition; `inert` does not. */}
      <div inert={!open} className="min-h-0 overflow-hidden">
        {children}
      </div>
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
    <div className={cn("grid grid-cols-12 gap-x-3 gap-y-2 narrow:grid-cols-1", className)}>
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
   Prose
   ---------------------------------------------------------------------- */

/**
 * A block of prose, at the one measure a person can read a line at.
 *
 * The defect this exists to close: a paragraph inside a Section tracked the
 * *sheet's* width, and the sheet is 64rem because fact rows and field pairs get
 * denser with width. Prose does the opposite. Measured at 1366×768, the FERPA
 * block set at 89 characters per line against the style guide's 38 — same
 * system, same type, 2.3× apart, and 89 is 20% past the limit anyone can hold
 * their place at.
 *
 * So the measure is a property of the *paragraph*, not of the screen it happens
 * to be on, and it is carried by one element rather than by a class every
 * screen has to remember. `--measure-prose` is declared once, in the theme,
 * beside the archetype measures it deliberately does not track.
 *
 * The four rules it belongs to, written out in `docs/copy-inventory.md`:
 *
 * 1. Prose inside a Section sets to ~68 characters, whatever the sheet does.
 * 2. Emphasis is a whole sentence or nothing — no bold clause opening and
 *    closing mid-sentence.
 * 3. A link never shares a line with the tail of a paragraph.
 * 4. One block of prose per Section. Everything else is a field, a list, or a
 *    drawn empty state.
 *
 * Two sizes, because the flow genuinely has two: the paragraph that explains
 * why a screen is asking, and the note that qualifies one control. Both are
 * prose and both take the measure; neither is a third voice.
 */
export function Prose({
  as: Tag = "p",
  size = "body",
  className,
  children,
}: {
  as?: "p" | "div";
  /** `note` is the quiet line under a legend or a control. */
  size?: "body" | "note";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "max-w-[var(--measure-prose)]",
        size === "body" ? "text-body text-ink-600" : "text-small text-ink-500",
        className,
      )}
    >
      {children}
    </Tag>
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
        "rounded-[var(--radius-card)]",
        dashed
          ? "border border-ink-200 border-dashed bg-transparent"
          : strong
            ? "bg-well-strong"
            : "bg-well",
        !flush && "p-4",
        className,
      )}
    >
      {label ? <p className="mb-2 text-meta font-bold text-ink-500">{label}</p> : null}
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
   Flat card
   ---------------------------------------------------------------------- */

/**
 * A collection item on a Well. No border, no shadow, image bleeding to the edge
 * (Jira "Select a template", Bloom, mymind).
 *
 * It is deliberately not a `Card` with elevation: the Well under it is already
 * the local ground for the collection, and raising every item off it would put
 * a shadow inside a recess. **And it is deliberately not bordered** — under
 * ADR 0015's material rule, tint groups and border delimits a control. A white
 * card on a tinted Well is already told apart from it; the hairline was a
 * second delimiter doing the same job, which is the stacking three rounds of
 * review have objected to, one size down.
 *
 * Selection is fill and a check, and the ring glow is light rather than
 * geometry: nothing lifts, grows or thickens, so a card is the same size and in
 * the same place selected as unselected.
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
        "relative overflow-hidden rounded-[var(--radius-card)] bg-panel text-left",
        "transition-[background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-soft)]",
        selected ? "bg-violet-50 ring-glow" : null,
        interactive && !selected && "hover:bg-violet-50/50",
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
 *
 * Its description is prose, and it sits on the widest thing in the system: a
 * catalogue at 72rem. Housing's "a preference is a request, not an assignment"
 * is 105 characters and set as one line before this took the measure.
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
        {description ? <Prose>{description}</Prose> : null}
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
