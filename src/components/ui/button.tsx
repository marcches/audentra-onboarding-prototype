import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Retheme note: taller than the shadcn default (44px vs 36px) so every action
 * clears the mobile tap-target floor, heavier type, 10px radius, and a
 * one-pixel press displacement instead of a hover ring.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-field)] font-bold tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-150 disabled:pointer-events-none disabled:opacity-45 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
        sm: "h-9 px-3.5 text-small",
        md: "h-11 px-5 text-body",
        lg: "h-12 px-7 text-lead",
        icon: "size-11",
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
