import { LockSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import * as React from "react";

import { FieldContext } from "@/components/field-context";
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
