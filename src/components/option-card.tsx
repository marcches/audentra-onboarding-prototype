import type * as React from "react";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

/**
 * A radio rendered as a full-width slab. The hit area is the whole card, which
 * is what makes the five housing options workable on a phone — the thing a
 * plain radio list is worst at.
 */
export function OptionCard({
  value,
  id,
  label,
  hint,
  icon,
  className,
}: {
  value: string;
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-3.5 rounded-[var(--radius-card)] border border-ink-200 bg-surface p-4 transition-[border-color,box-shadow,background-color] hover:border-ink-300 hover:shadow-soft has-[[data-state=checked]]:border-violet-500 has-[[data-state=checked]]:bg-violet-50/50 has-[[data-state=checked]]:shadow-[0_0_0_1px_var(--color-violet-500)]",
        className,
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2 text-body font-bold text-ink-900">
          {icon}
          {label}
        </span>
        {hint ? <span className="text-small text-ink-500">{hint}</span> : null}
      </span>
    </label>
  );
}
