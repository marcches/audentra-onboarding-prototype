import { LockSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import * as React from "react";

import { FieldContext } from "@/components/field-context";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * One field layout for the whole prototype.
 *
 * Two rules from the message library are baked in rather than left to each
 * screen: helper text is persistent and sits under the field (never a
 * hover-only tooltip), and the error appears beside the field it belongs to,
 * never only as a summary at the top of the form.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
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
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
        {optional ? (
          <span className="text-micro font-bold tracking-[0.06em] text-ink-400 uppercase">
            Optional
          </span>
        ) : null}
      </div>
      <FieldContext.Provider value={context}>{children}</FieldContext.Provider>
      {hint ? (
        <p id={hintId} className="text-small text-ink-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-small font-medium text-danger-600">
          <WarningCircleIcon weight="fill" aria-hidden className="mt-0.5 size-4 shrink-0" />
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
  note = "On your record. The Registrar changes this, not you.",
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="field-label">{label}</span>
      <div className="flex items-center gap-2.5 rounded-[var(--radius-field)] border border-dashed border-ink-200 bg-ink-50/70 px-3.5 py-2.5">
        <LockSimpleIcon weight="fill" aria-hidden className="size-4 shrink-0 text-ink-400" />
        <span className="text-body font-medium text-ink-800">{value}</span>
      </div>
      <p className="text-small text-ink-500">{note}</p>
    </div>
  );
}
