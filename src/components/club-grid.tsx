import { CheckIcon } from "@phosphor-icons/react";

import type { Club } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

/**
 * The club grid, and the whole of the step it belongs to.
 *
 * One meaning per visual channel. This grid used to carry two desaturations at
 * once: ReactBits' `ChromaGrid` spotlight, which greyed everything outside the
 * pointer's radius, and the selected state, which had to be lifted to `z-10` to
 * escape it. Two identical-looking greys saying "your mouse is not here" and
 * "you have not chosen this" is a vocabulary nobody asked to learn, so the
 * spotlight is gone and desaturation now means exactly one thing. It was
 * decoration for a wall of cards, and the wall is nine cards in three rows.
 *
 * What replaces it is Bloom's and Hulu's move: the chosen cards keep their
 * colour and the rest fall back. That is what makes "three, of these nine"
 * legible without a second list of them printed underneath — which is what the
 * removed picks tray was for.
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
  const anySelected = selected.length > 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {clubs.map((club) => {
        const isSelected = selected.includes(club.id);
        return (
          <div
            key={club.id}
            className={cn(
              "group relative overflow-hidden rounded-[var(--radius-card)] border-2",
              "transition-[border-color,box-shadow,opacity,filter] duration-200 ease-[var(--ease-out-expo)]",
              isSelected
                ? "border-violet-500 shadow-lift ring-4 ring-violet-500/25"
                : "border-transparent hover:shadow-card",
              /* One step back, not two, and only once there is something to
                 stand back from. Hover returns a card to full strength so
                 changing your mind never means reading through the fade. The
                 global reduced-motion switch makes the change instant; it does
                 not make it invisible, because the fade is state, not
                 decoration — the check badge carries it for anyone who cannot
                 see colour at all. */
              anySelected &&
                !isSelected &&
                "opacity-55 saturate-[0.4] hover:opacity-100 hover:saturate-100",
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
                /* 4:3 rather than square. The column is wider than it was, so a
                   square card grew with it — three rows of them cost more
                   height than the whole step used to. The photo is a
                   thumbnail, not the content.
                   (The square came from an earlier fix for two-line names like
                   "Robotics & making" being clipped against the card's top
                   edge — the label is positioned absolutely, so it grows past
                   the container without stretching it. The line-clamps below
                   are what actually hold that shut, and they still do.) */
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
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
    </div>
  );
}
