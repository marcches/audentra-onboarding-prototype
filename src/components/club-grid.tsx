import { CheckIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import * as React from "react";

import type { Club } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * The club grid.
 *
 * The mechanism is ReactBits' `ChromaGrid`: a spotlight that follows the
 * pointer across the grid, with everything outside its radius desaturated, so
 * whatever you are pointing at is the only thing in colour. What is *not*
 * borrowed is the component itself — `ChromaGrid` renders cards that open a
 * URL, and this grid's whole job is multi-select with a visible checked state.
 * So the two custom properties it drives (`--x`, `--y`) and the mask are lifted
 * and the card is this app's own.
 *
 * Without the photographs this is a grid of coloured rectangles, which is what
 * the step looked like before.
 */
export function ClubGrid({
  clubs,
  selected,
  onToggle,
}: {
  clubs: Club[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [pointerInside, setPointerInside] = React.useState(false);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = root.current;
    if (!element || reduceMotion) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--y", `${event.clientY - rect.top}px`);
    setPointerInside(true);
  };

  return (
    <div
      ref={root}
      onPointerMove={handleMove}
      onPointerLeave={() => setPointerInside(false)}
      className="relative grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {clubs.map((club) => {
        const isSelected = selected.includes(club.id);
        return (
          <button
            key={club.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(club.id)}
            className={cn(
              "group relative overflow-hidden rounded-[var(--radius-card)] border-2 text-left transition-[border-color,box-shadow,transform] duration-200",
              isSelected
                ? "border-violet-500 shadow-card"
                : "border-transparent hover:shadow-card focus-visible:border-violet-300",
            )}
          >
            <img
              src={club.image.src}
              alt={club.image.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-transparent"
            />

            <span className="absolute inset-x-0 bottom-0 flex items-end gap-2 p-3">
              <span className="flex-1">
                <span className="block text-body font-bold text-white">{club.name}</span>
                <span className="mt-0.5 block text-small text-white/70">{club.blurb}</span>
              </span>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-violet-400 bg-violet-500 text-white"
                    : "border-white/60 bg-white/10 text-transparent",
                )}
              >
                <CheckIcon weight="bold" aria-hidden className="size-3.5" />
              </span>
            </span>
          </button>
        );
      })}

      {/* The spotlight, lifted from ChromaGrid: a grayscale wash over the whole
          grid, masked away in a circle around the pointer. Purely decorative,
          so it is pointer-transparent and simply absent under reduced motion —
          a mask that never moves is a grey sheet over the photographs. */}
      {reduceMotion ? null : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] transition-opacity duration-300"
          style={{
            opacity: pointerInside ? 1 : 0,
            backdropFilter: "grayscale(0.85) brightness(0.86)",
            WebkitBackdropFilter: "grayscale(0.85) brightness(0.86)",
            maskImage:
              "radial-gradient(circle 260px at var(--x) var(--y), transparent 0%, transparent 22%, rgb(0 0 0 / 0.4) 55%, black 100%)",
            WebkitMaskImage:
              "radial-gradient(circle 260px at var(--x) var(--y), transparent 0%, transparent 22%, rgb(0 0 0 / 0.4) 55%, black 100%)",
          }}
        />
      )}
    </div>
  );
}
