import { CheckCircleIcon, LockSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import * as React from "react";

import { FieldContext } from "@/components/field-context";
import { Reveal } from "@/components/surfaces";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * One field layout for the whole prototype, and one rule for how wide a field
 * is allowed to be.
 *
 * The width rule is the part that was missing, and it is what the client was
 * actually looking at when they said the forms read as "tudo grande". Every
 * control was as wide as whatever container it happened to land in: a ZIP code
 * got the same 24rem as a street address, and a phone number got a whole line.
 * A field four times wider than its longest possible answer reads as an empty
 * box, and a column of them reads as a form with nothing in it.
 *
 * So width is a property of the **answer**: a share of the Section's twelve
 * columns, and nothing else. An earlier pass paired the span with a `rem`
 * ceiling and it was worse than either alone — the ceiling won on wide rows and
 * the span won on narrow ones, so no two fields ever lined up and the form read
 * as a ransom note. Spans alone means every field starts and ends on a column,
 * and rows are authored to add up to twelve.
 *
 * Below the container's `narrow` threshold every field takes the full line —
 * two 6px columns is not density, it is a bug.
 *
 * Two rules from the message library are baked in as well: helper text is
 * persistent and sits under the field (never a hover-only tooltip), and the
 * error appears beside the field it belongs to, never only as a summary at the
 * top of the form.
 */

/**
 * How much room an answer needs. Named for the answer rather than for a number
 * of columns, because "a ZIP code" is a fact about the world and `col-span-3`
 * is a fact about this grid.
 */
export type FieldWidth = "tiny" | "short" | "medium" | "long" | "full";

export const FIELD_WIDTH: Record<FieldWidth, string> = {
  /** Five digits, a unit number. Three of twelve. */
  tiny: "col-span-3 narrow:col-span-full",
  /** A state, a set of pronouns, a relationship, a phone number. Four. */
  short: "col-span-4 narrow:col-span-full",
  /** A person's name, a city. Six. */
  medium: "col-span-6 narrow:col-span-full",
  /** An email address, a street. Eight. */
  long: "col-span-8 narrow:col-span-full",
  /** A paragraph, an upload, a group of options. Twelve. */
  full: "col-span-12",
};

export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  width = "medium",
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  /** How much room the answer needs. See `FIELD_WIDTH`. */
  width?: FieldWidth;
  className?: string;
  children: React.ReactNode;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  // Error first: a screen reader reads describedby in order, and what went
  // wrong matters more than the standing hint.
  const context = React.useMemo(
    () => ({
      describedBy: [errorId, hintId].filter(Boolean).join(" ") || undefined,
      invalid: Boolean(error),
    }),
    [errorId, hintId, error],
  );

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", FIELD_WIDTH[width], className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        {optional ? <span className="text-meta text-ink-400">Optional</span> : null}
      </div>
      <FieldContext.Provider value={context}>{children}</FieldContext.Provider>
      {hint ? (
        <p id={hintId} className="text-meta leading-4 text-ink-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="flex items-start gap-1 text-meta leading-4 font-medium text-danger-600"
        >
          <WarningCircleIcon weight="fill" aria-hidden className="mt-px size-3 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * A value Aster already holds. Rendered as a value, not as a disabled input —
 * a greyed-out box invites people to try typing in it and then wonder why they
 * can't (RN-PR-02: "Managed by the Registrar").
 */
export function ReadOnlyField({
  label,
  value,
  width = "medium",
  note,
}: {
  label: string;
  value: string;
  width?: FieldWidth;
  note?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", FIELD_WIDTH[width])}>
      <span className="field-label">{label}</span>
      <div className="flex items-center gap-2 rounded-[var(--radius-field)] border border-dashed border-ink-200 bg-ink-50/70 px-2 py-2">
        <LockSimpleIcon weight="fill" aria-hidden className="size-4 shrink-0 text-ink-400" />
        <span className="truncate text-body font-medium text-ink-800">{value}</span>
      </div>
      {note ? <p className="text-meta leading-4 text-ink-500">{note}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Prefill
   ---------------------------------------------------------------------- */

/**
 * Is this value still the institution's own copy?
 *
 * **The whole state model of a Prefill, and it is one comparison.** There is no
 * `prefilled` flag in the store: a field is a Prefill exactly while the value
 * in it is the value the institution supplied, so correcting one stops it
 * claiming a provenance it no longer has, and no stored flag can ever disagree
 * with the value beside it. Two facts that can disagree is the bug this repo
 * derives everything to avoid, and it is the same bug one field down.
 *
 * The empty case is not a Prefill: an institution that holds nothing has told
 * the student nothing, and a green check over a blank is a lie.
 */
export function isPrefill(value: string, held: string): boolean {
  return held.trim().length > 0 && value.trim() === held.trim();
}

/**
 * A field the institution already answered, drawn as **answered**.
 *
 * This is the direct visual answer to Melt, and it is the client's own
 * argument: schools cannot get admitted students to fill things in, so the
 * product has to show them that most of it is already filled. A prefilled field
 * drawn as an empty field that happens to contain text throws that away
 * entirely — the student reads a form of the same length and does the same
 * amount of work deciding whether each box needs them.
 *
 * The anatomy is borrowed rather than invented. It is the system's own
 * label→value pair at metadata size (Portrait's profile block), in a soft
 * filled state that reads as complete without a status word doing the work
 * (Coinbase), with the icon rule the rest of the system already follows: **fill
 * means done**.
 *
 * **It is always correctable, and the way to correct it is on the row.** A
 * student whose phone number changed since they applied must not have to hunt;
 * `Change` is beside the value, and what it reveals appears *below* it with
 * nothing above moving, which is the reveal rule ADR 0006 wrote and this
 * follows rather than reinvents.
 *
 * **A Step mostly prefilled reads shorter than one that is not**, and that is
 * arithmetic rather than a claim: a confirmed row is one line where a field is a
 * label, a control and a hint. It is the same mechanism the collapsed Section
 * uses — showing what is held rather than the machinery for holding it.
 *
 * An error forces it open. A value the form has rejected must not sit behind a
 * check saying it is done.
 */
export function Prefilled({
  label,
  value,
  source = "Already on your record",
  width = "medium",
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  /** What to show while confirmed. The parent owns the value; this owns nothing. */
  value: string;
  /** Where it came from, in the student's terms. One short phrase. */
  source?: string;
  width?: FieldWidth;
  /**
   * The control's id, when the Prefill wraps exactly one. A Prefill can also
   * stand for a *group* — a whole postal address is one thing the institution
   * either holds or does not — and there the children carry their own labels
   * and this is left off.
   */
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string;
  /** The ordinary control, revealed when the student chooses to correct it. */
  children: React.ReactNode;
}) {
  const [correcting, setCorrecting] = React.useState(false);
  const open = correcting || Boolean(error);

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", FIELD_WIDTH[width])}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-field)] px-4 py-2",
          "transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-soft)]",
          open ? "bg-well" : "bg-mint-50",
        )}
      >
        <CheckCircleIcon
          weight="fill"
          aria-hidden
          className={cn("size-4 shrink-0", open ? "text-ink-300" : "text-mint-600")}
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-meta text-ink-500">
            {label} · {source}
          </span>
          <span className="truncate text-body font-strong text-ink-900">{value}</span>
        </span>
        <button
          type="button"
          onClick={() => setCorrecting((current) => !current)}
          aria-expanded={open}
          className="shrink-0 rounded-[var(--radius-field)] px-2 py-1 text-meta font-bold text-violet-700 hover:underline"
        >
          {open ? "Keep it" : "Change"}
        </button>
      </div>

      {/* Below the trigger, and nothing above it moves. */}
      <Reveal open={open}>
        <div className="flex flex-col gap-1 pt-2">
          {htmlFor ? <Label htmlFor={htmlFor}>{label}</Label> : null}
          {children}
          {hint ? <p className="text-meta text-ink-500">{hint}</p> : null}
          {error ? (
            <p className="flex items-start gap-1 text-meta font-medium text-danger-600">
              <WarningCircleIcon weight="fill" aria-hidden className="mt-px size-3 shrink-0" />
              <span>{error}</span>
            </p>
          ) : null}
        </div>
      </Reveal>
    </div>
  );
}
