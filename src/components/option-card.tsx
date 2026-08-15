import type * as React from "react";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

/**
 * A radio rendered as a full-width slab. The hit area is the whole card, which
 * is what makes a list of options workable on a phone — the thing a plain radio
 * list is worst at.
 *
 * Two changes from what this replaces. Selection is **fill and a check**, never
 * elevation: the old version added a shadow on select, which lifted the chosen
 * option above the Panel containing it. And `consequence` is a first-class
 * prop rather than an optional hint, because every branching radio in this flow
 * carries its consequence in its own label (Fiverr) rather than in a footnote
 * under the group, which is read by nobody choosing between three things.
 */
export function OptionCard({
  value,
  id,
  label,
  consequence,
  icon,
  className,
}: {
  value: string;
  id: string;
  label: string;
  /** What choosing this one means. Written into the option, not under the group. */
  consequence?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-2.5 rounded-[var(--radius-field)] border border-ink-200 bg-panel px-2.5 py-2 compact:min-h-[var(--tap-target)]",
        "transition-[border-color,background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-soft)]",
        "hover:border-ink-300 hover:bg-ink-50/50",
        /* Fill and a check. No shadow, no scale, no lift: the card is the same
           size and in the same place chosen as unchosen. */
        "has-[[data-state=checked]]:border-violet-400 has-[[data-state=checked]]:bg-violet-50/70",
        /* The radio itself is a 20px dot at the edge of a full-width slab, so
           the focus ring belongs on the card a keyboard user is actually on. */
        "has-[:focus-visible]:border-violet-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-400",
        className,
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-1.5 text-body font-strong text-ink-900">
          {icon}
          {label}
        </span>
        {consequence ? (
          <span className="text-micro leading-4 text-ink-500">{consequence}</span>
        ) : null}
      </span>
    </label>
  );
}
