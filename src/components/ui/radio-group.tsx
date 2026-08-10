import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2.5", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "relative size-5 shrink-0 rounded-full border border-ink-300 bg-surface transition-[border-color,box-shadow] outline-none hover:border-ink-400 disabled:cursor-not-allowed disabled:opacity-45 data-[state=checked]:border-[6px] data-[state=checked]:border-violet-500",
        className,
      )}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem };
