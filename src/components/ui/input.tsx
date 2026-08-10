import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Retheme note: the field reads as a filled slab on the sunken tint until it
 * takes focus, when it lifts to white. That gives every form a visible "where
 * am I" without relying on a focus ring alone.
 */
const fieldClassName =
  "w-full rounded-[var(--radius-field)] border border-ink-200 bg-ink-50/60 px-3.5 text-body text-ink-900 shadow-none transition-[background-color,border-color,box-shadow] outline-none placeholder:text-ink-400 hover:border-ink-300 focus:border-violet-400 focus:bg-surface focus:shadow-[0_0_0_4px_var(--color-violet-50)] disabled:cursor-not-allowed disabled:border-ink-100 disabled:bg-ink-50 disabled:text-ink-500 aria-[invalid=true]:border-danger-500 aria-[invalid=true]:bg-danger-50/50 aria-[invalid=true]:focus:shadow-[0_0_0_4px_var(--color-danger-50)]";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldClassName, "h-11", className)}
      {...props}
    />
  );
}

export { fieldClassName, Input };
