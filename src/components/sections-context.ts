import * as React from "react";

/**
 * Which numbered Section on this sheet is being filled in right now.
 *
 * The marker has three states — untouched, in progress, done — and the middle
 * one is **the first incomplete Section on the screen**. That is a fact about
 * the sheet, not about any Section: a Section cannot know it is first, and no
 * route should be made to work it out, because the moment a route computes it
 * the answer lives in nine places and drifts in eight of them.
 *
 * Asking focus instead was the other candidate and it is wrong for a different
 * reason: a marker that followed the caret would be a *cursor*, and it would go
 * blank the moment the student clicked away from the form to read something.
 * "In progress" has to survive not being looked at.
 *
 * So `Sections` walks its own children, finds the first one carrying a `step`
 * that is not `done`, and publishes the number here. `undefined` means every
 * Section on the sheet is finished, or none of them is numbered.
 */
export const SheetProgress = React.createContext<number | undefined>(undefined);

export function useSheetProgress() {
  return React.useContext(SheetProgress);
}
