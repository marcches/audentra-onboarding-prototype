import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Density, and the one place it is refused.
 *
 * Type and vertical rhythm densified across the whole system this round, and a
 * button came down with them — 36px at `md` against the 44px it was. The
 * exception is declared here and holds everywhere: **in `compact` no control
 * goes below `--tap-target`**. Below 44px the finger misses, and a filling-in
 * error costs the student more than the three lines of height it bought.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-field)] font-bold tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-150 compact:min-h-[var(--tap-target)] disabled:pointer-events-none disabled:opacity-45 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-violet-500 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(10_31_68/0.16)] hover:bg-violet-600",
        secondary:
          "border border-ink-200 bg-surface text-ink-800 shadow-soft hover:border-ink-300 hover:bg-ink-50",
        ghost: "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
        danger:
          "border border-danger-100 bg-danger-50 text-danger-600 hover:border-danger-500/40 hover:bg-danger-100",
        link: "text-violet-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-7 px-2 text-small",
        md: "h-9 px-4 text-body",
        lg: "h-10 px-5 text-body",
        icon: "size-9 compact:min-w-[var(--tap-target)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
