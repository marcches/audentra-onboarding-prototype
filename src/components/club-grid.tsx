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
 *
 * Two separate controls per card, on purpose: the photo and copy open the
 * detail view (Housing's "See the room" pattern, reused), and a badge in the
 * corner is the pick. Round one made the whole card the pick action, which
 * meant there was nowhere left to click that meant "tell me more" — a name and
 * one line of blurb was the entire case for choosing a club.
 */
export function ClubGrid({
  clubs,
  selected,
  onToggle,
  onOpenDetail,
}: {
  clubs: Club[];
  selected: string[];
  onToggle: (id: string) => void;
  onOpenDetail: (club: Club) => void;
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
          <div
            key={club.id}
            className={cn(
              "group relative overflow-hidden rounded-[var(--radius-card)] border-2 transition-[border-color,box-shadow] duration-200",
              /* `z-10` is what keeps a chosen club out of the spotlight's
                 grayscale wash. The wash is a single layer painted over the
                 whole grid, so it was desaturating the cards the student had
                 already picked along with everything else — the violet ring and
                 the tick both went grey the moment the pointer moved away, and
                 you lost track of your own selection while making it. Lifting
                 the selected cards above that layer turns the effect into what
                 it should always have said: colour is what you have chosen, or
                 what you are pointing at. */
              isSelected
                ? "z-10 border-violet-500 shadow-lift ring-4 ring-violet-500/25"
                : "border-transparent hover:shadow-card",
            )}
          >
            <button
              type="button"
              onClick={() => onOpenDetail(club)}
              className="block w-full text-left"
            >
              <img
                src={club.image.src}
                alt={club.image.alt}
                loading="lazy"
                /* Square rather than 4:3 — two-word names with an "&"
                   ("Robotics & making") wrap to two lines in a two-column
                   mobile grid, and a shorter box clipped that second line
                   against the card's own top edge: the text is positioned
                   absolutely, so it can grow past the container's height
                   without stretching it, and `overflow-hidden` then crops
                   whatever crossed that boundary. The extra height is the
                   fix; the line-clamps below cap it so even the longest name
                   and blurb can't reopen the same problem. */
                className="aspect-square w-full object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent"
              />

              <span className="absolute inset-x-0 bottom-0 p-3 pr-12">
                <span className="line-clamp-2 text-body font-bold text-white">{club.name}</span>
                <span className="mt-0.5 line-clamp-2 text-small text-white/70">{club.blurb}</span>
              </span>
            </button>

            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(club.id)}
              className={cn(
                "absolute top-2.5 right-2.5 z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                isSelected
                  ? "border-white bg-violet-500 text-white"
                  : "border-white/70 bg-ink-950/30 text-transparent hover:bg-ink-950/50",
              )}
            >
              <CheckIcon weight="bold" aria-hidden className="size-4" />
              <span className="sr-only">
                {isSelected ? `Remove ${club.name} from your picks` : `Pick ${club.name}`}
              </span>
            </button>
          </div>
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
