import { SparkleIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

import { usePointsAward } from "@/components/points-award";
import {
  creditReleased,
  formatCredit,
  nextRelease,
  POINTS_PER_BLOCK,
  pointsToNextRelease,
  totalPoints,
} from "@/lib/points";
import { useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The one place the running Points total lives, and the only place a Point is
 * ever printed.
 *
 * What it replaces was a grey `+50` beside every finished rail item: a receipt
 * for someone who had already done the work, and a standing price list beside
 * the ones they hadn't. This says the two things a rewards UI has to say
 * (Everyday Rewards, Qantas, Ulta, Navan): what you have, and how far it is to
 * the next thing you actually want. Points here are bookstore credit —
 * ADR-0002 — so the number is never bare.
 *
 * Credit lands in whole blocks rather than accruing by the cent, because that
 * is what gives this component a countdown to show. See `points.ts`, where the
 * rate is a fixture and lives once.
 */
export function Balance({ variant = "rail" }: { variant?: "rail" | "chip" }) {
  const live = totalPoints(useOnboarding());
  const award = usePointsAward();
  const reduceMotion = useReducedMotion();

  /* Outside the provider — the style guide — there is nothing in flight, so
     the live total is the shown total. */
  const points = award?.shownPoints ?? live;
  const landings = award?.landings ?? 0;

  const released = creditReleased(points);
  const toGo = pointsToNextRelease(points);
  const inBlock = POINTS_PER_BLOCK - toGo;

  /* Keyed on the landing count so the number replays its own arrival: the
     token is absorbed and the total reacts, in that order. */
  const Total = (
    <motion.span
      key={reduceMotion ? "static" : landings}
      initial={landings > 0 && !reduceMotion ? { scale: 0.7, opacity: 0.4 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 18 }}
      className="inline-block"
    >
      {points}
    </motion.span>
  );

  if (variant === "chip") {
    return (
      <span
        ref={award?.registerBalance}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-violet-50 px-2.5 py-1",
          "text-micro font-bold tracking-[0.06em] text-violet-700 uppercase",
        )}
      >
        <SparkleIcon weight="fill" aria-hidden className="size-3.5" />
        <span aria-hidden>{Total} pts</span>
        {/* The phone header has room for the number and not for the sentence
            around it. The sentence is still said, to anyone listening. */}
        {released > 0 ? (
          <span aria-hidden className="text-violet-500">
            · {formatCredit(released)}
          </span>
        ) : null}
        <span className="sr-only">
          {points} points, {balanceSentence(points)}
        </span>
      </span>
    );
  }

  return (
    <div
      ref={award?.registerBalance}
      className="rounded-[var(--radius-field)] bg-violet-50 px-3 py-2.5"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-micro font-bold tracking-[0.06em] text-violet-700 uppercase">
          <SparkleIcon weight="fill" aria-hidden className="size-3.5" />
          Balance
        </span>
        <span className="text-body font-bold text-violet-700">
          {Total}
          <span className="sr-only"> points</span>
          <span aria-hidden className="ml-1 text-micro font-bold tracking-normal">
            pts
          </span>
        </span>
      </div>

      {/* Progress through the current block, not through the flow — the rail
          above already says where you are in the flow, and a second bar
          measuring the same thing would be the noise this round is removing. */}
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-violet-100">
        <div
          className="h-full rounded-full bg-violet-500 transition-[width] duration-700 ease-[var(--ease-out-expo)]"
          style={{ width: `${(inBlock / POINTS_PER_BLOCK) * 100}%` }}
        />
      </div>

      <p className="mt-1.5 text-[0.6875rem] leading-4 text-violet-700">
        {released > 0 ? (
          <>
            <span className="font-bold">{formatCredit(released)} bookstore credit</span> ready ·{" "}
            {toGo} pts to {formatCredit(nextRelease(points))}
          </>
        ) : (
          <>
            {toGo} pts to your first{" "}
            <span className="font-bold">{formatCredit(nextRelease(points))} bookstore credit</span>
          </>
        )}
      </p>
    </div>
  );
}

/** The same fact as the rail panel, in one sentence, for a screen reader. */
function balanceSentence(points: number): string {
  const released = creditReleased(points);
  const toGo = pointsToNextRelease(points);
  const next = formatCredit(nextRelease(points));

  return released > 0
    ? `${formatCredit(released)} bookstore credit ready, ${toGo} points to ${next}`
    : `${toGo} points to your first ${next} of bookstore credit`;
}
