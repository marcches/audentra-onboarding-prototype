import { CaretDownIcon } from "@phosphor-icons/react";
import { Popover } from "radix-ui";
import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * A filter as a dropdown pill across the top, rather than a column down the
 * side (Zillow, Care.com).
 *
 * The choice is a function of how many things are being filtered. A filter
 * column earns a permanent third of the width when it is narrowing hundreds of
 * results; against eight residences it would be a large piece of furniture for
 * a job that takes two taps, and it would take the width the card needs to be
 * horizontal at all.
 *
 * Multi-select, because "single or suite" is a real answer to "what kind of
 * room" and a radio group would make the student ask twice.
 */
export function FilterPill({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const active = selected.length > 0;
  const chosen = options.filter((option) => selected.includes(option.value));
  /* Both pills render the same option values, so the ids have to be scoped to
     the pill or `htmlFor` would point at the other one's checkbox. */
  const scope = React.useId();

  function toggle(value: string) {
    onChange(
      selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
    );
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3.5 text-small font-bold transition-colors",
          active
            ? "border-violet-500 bg-violet-50 text-violet-700"
            : "border-ink-200 bg-surface text-ink-700 hover:border-ink-300 hover:bg-ink-50",
        )}
      >
        {/* The pill says what is chosen, not how many are — a count is a fact
            about the filter, and the student is trying to remember a fact about
            the residences. One name fits; past that it is a count. */}
        {chosen.length === 1 ? chosen[0]?.label : `${label}${active ? ` · ${chosen.length}` : ""}`}
        <CaretDownIcon weight="bold" aria-hidden className="size-3.5 opacity-60" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-56 rounded-[var(--radius-field)] border border-ink-100 bg-surface p-1.5 shadow-lift data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <fieldset>
            <legend className="field-label px-2.5 py-2">{label}</legend>
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={`${scope}-${option.value}`}
                className="flex cursor-pointer items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-body text-ink-800 hover:bg-violet-50"
              >
                <Checkbox
                  id={`${scope}-${option.value}`}
                  checked={selected.includes(option.value)}
                  onCheckedChange={() => toggle(option.value)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>

          {active ? (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-[7px] px-2.5 py-2 text-left text-small font-bold text-violet-600 hover:bg-violet-50"
            >
              Clear {label.toLowerCase()}
            </button>
          ) : null}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
