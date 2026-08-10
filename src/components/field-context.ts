import * as React from "react";

/**
 * How a `Field` reaches the control inside it.
 *
 * `Field` renders `{children}` opaquely — it cannot know whether the control is
 * an Input, a SelectTrigger, or an Input wrapped in a positioning div. So
 * instead of cloning children, it publishes the ids of its hint and error text
 * here and the primitives pick them up. Without this, the hint and the
 * validation message are visible but programmatically orphaned: a screen
 * reader announces "invalid entry" and never says why.
 */
export type FieldContextValue = {
  describedBy?: string;
  invalid: boolean;
};

export const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useFieldControl() {
  return React.useContext(FieldContext);
}
