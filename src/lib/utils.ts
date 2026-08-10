import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The type scale is custom (`text-body`, `text-lead`, `text-h1`…), and
 * tailwind-merge can't tell those from text *colour* utilities on its own — it
 * was quietly dropping `text-white` whenever a size class followed it. Teaching
 * it the scale keeps `cn()` honest.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["micro", "small", "body", "lead", "h3", "h2", "h1", "display"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
