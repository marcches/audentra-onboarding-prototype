import type * as React from "react";

import { useFieldControl } from "@/components/field-context";
import { fieldClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Textarea({
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: React.ComponentProps<"textarea">) {
  const field = useFieldControl();

  return (
    <textarea
      data-slot="textarea"
      aria-describedby={describedBy ?? field?.describedBy}
      aria-invalid={invalid ?? field?.invalid}
      className={cn(fieldClassName, "field-sizing-content min-h-24 py-2.5 leading-6", className)}
      {...props}
    />
  );
}

export { Textarea };
