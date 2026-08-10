import type * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dialCodes } from "@/lib/fixtures";

/**
 * Country code is a select, not something you type into the same box as the
 * number.
 *
 * That single split is what removes the entry screen's phone bug at the root:
 * there is no longer a free-text "+" for a backend regex to reject, and the
 * number field is free to accept the spaces and dashes people naturally type.
 */
export function PhoneInput({
  id,
  dialCode,
  onDialCodeChange,
  invalid,
  ...inputProps
}: React.ComponentProps<"input"> & {
  id: string;
  dialCode: string;
  onDialCodeChange: (value: string) => void;
  invalid?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Select value={dialCode} onValueChange={onDialCodeChange}>
        <SelectTrigger className="w-[8.5rem] shrink-0" aria-label="Country code">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dialCodes.map((code) => (
            <SelectItem key={code.value} value={code.value}>
              {code.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="555 123 4567"
        aria-invalid={invalid}
        {...inputProps}
      />
    </div>
  );
}
