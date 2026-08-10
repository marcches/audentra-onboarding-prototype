import type * as React from "react";

import { fieldClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldClassName, "min-h-24 py-2.5 leading-6 field-sizing-content", className)}
      {...props}
    />
  );
}

export { Textarea };
