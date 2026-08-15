import { SparkleIcon } from "@phosphor-icons/react";

import { totalPoints } from "@/lib/points";
import { useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The one place the running Points total lives.
 *
 * "Exactly one Balance in the shell" is the whole point of it being a component
 * rather than a bit of markup in the rail: the thing this replaces was a grey
 * `+50` printed beside every finished rail item, which read as a receipt for
 * someone who had already done the work. A single total can be looked at when
 * the student wants it and ignored when they don't.
 *
 * Ticket 03 gives this its destination — the bookstore-credit conversion, the
 * distance to the next threshold, and the award animation that travels here
 * from the point of action. What ticket 01 owns is that there is exactly one of
 * these and that it sits at the top of the rail.
 */
export function Balance({ variant = "rail" }: { variant?: "rail" | "chip" }) {
  const points = totalPoints(useOnboarding());

  if (variant === "chip") {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-violet-50 px-2.5 py-1",
          "text-micro font-bold tracking-[0.06em] text-violet-700 uppercase",
        )}
      >
        <SparkleIcon weight="fill" aria-hidden className="size-3.5" />
        {points}
        <span className="sr-only"> points earned</span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-[var(--radius-field)] bg-violet-50 px-3 py-2.5">
      <SparkleIcon weight="fill" aria-hidden className="size-4 shrink-0 text-violet-600" />
      <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
        <span className="text-micro font-bold tracking-[0.06em] text-violet-700 uppercase">
          Balance
        </span>
        <span className="text-body font-bold text-violet-700">
          {points}
          <span className="sr-only"> points</span>
          <span aria-hidden className="ml-1 text-micro font-bold tracking-normal">
            pts
          </span>
        </span>
      </div>
    </div>
  );
}
