import { BookOpenIcon, CoinVerticalIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

import { usePointsAward } from "@/components/points-award";
import { creditReleased, formatCredit, nextTarget, totalPoints } from "@/lib/points";
import { useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The Balance: where Points live, in one fixed position across the whole flow.
 *
 * Four things make it a destination rather than a counter, and all four came
 * out of the research (Ulta, adiClub, IHG, Shopee, Mimo, Duolingo):
 *
 * 1. **Two numbers, always.** Points above, what they convert to below. A
 *    number with no translation beside it is the scoreboard ADR-0002 rejects.
 * 2. **Its own surface.** Not text in a bar. It should look pressable.
 * 3. **A verb.** "50 points to spend", never "Total: 50".
 * 4. **What is missing, named as an object.** "180 more for a course textbook",
 *    with a thin bar that ends in the object's icon rather than in the end of
 *    the bar.
 *
 * It also has to sit in the same place on every screen, because the award's
 * flight needs somewhere to land. The rail renders it at the top; the phone
 * header renders the chip. Both register with the award provider, which flies
 * to whichever of the two is actually visible.
 */
export function Balance({ variant = "rail" }: { variant?: "rail" | "chip" | "full" }) {
  const live = totalPoints(useOnboarding());
  const award = usePointsAward();
  const reduceMotion = useReducedMotion();

  /* Outside the provider — the style guide — nothing is in flight, so the live
     total is the shown total. */
  const points = award?.shownPoints ?? live;
  const landings = award?.landings ?? 0;
  const beat = award?.beat ?? 0;

  const released = creditReleased(points);
  const { target, pointsAway, reached } = nextTarget(points);
  const progress = reached ? 1 : Math.min(1, released / target.usd);

  /* Beat 6: the Balance scales 1 → 1.12 → 1 with a brief glow while its number
     rolls. Keyed on the landing count so it replays its own arrival — the token
     is absorbed and then the total reacts, in that order. */
  const Total = (
    <motion.span
      key={reduceMotion ? "static" : landings}
      initial={landings > 0 && !reduceMotion ? { scale: 0.75, opacity: 0.4 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 460, damping: 17 }}
      className="inline-block numeric"
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
          "transition-shadow duration-[var(--duration-slow)]",
          beat === 6 && "ring-glow",
        )}
      >
        <CoinVerticalIcon weight="fill" aria-hidden className="size-3.5" />
        <span aria-hidden>{Total} pts</span>
        {released > 0 ? (
          <span aria-hidden className="text-violet-500 numeric">
            · {formatCredit(released)}
          </span>
        ) : null}
        <span className="sr-only">
          {points} points to spend, {balanceSentence(points)}
        </span>
      </span>
    );
  }

  const full = variant === "full";

  return (
    <motion.div
      ref={award?.registerBalance}
      animate={beat === 6 && !reduceMotion ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn(
        /* Its own surface, and it looks pressable — a raised tile rather than a
           tinted strip of the rail it sits in. */
        "rounded-[var(--radius-card)] border border-violet-100 bg-panel shadow-soft",
        "transition-shadow duration-[var(--duration-slow)]",
        full ? "px-6 py-5" : "px-3 py-2.5",
        beat === 6 && "ring-glow",
      )}
    >
      {/* The verb, not a label. adiClub's "50 points to spend" turns a counter
          into a wallet, and the word doing that is "spend". */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-bold text-violet-700 numeric",
            full ? "text-[3.25rem] leading-none" : "text-h3",
          )}
        >
          {Total}
        </span>
        <span
          className={cn(
            "font-strong text-violet-700",
            full ? "text-lead" : "text-[0.6875rem] leading-4",
          )}
        >
          points to spend
        </span>
      </div>

      {/* The second number: what they convert to. Ulta puts "10 Points" and
          "$0.00 Value" on the same row, and the translation lives glued to the
          figure rather than a screen away. */}
      <motion.p
        key={`${released}-${beat >= 7 ? "new" : "old"}`}
        initial={beat === 7 && !reduceMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn("text-mint-deep numeric", full ? "mt-1 text-h3" : "text-[0.6875rem]")}
      >
        = <span className="font-bold">{formatCredit(released)}</span> in bookstore credit
      </motion.p>

      {/* The bar ends in the prize's icon, not in the end of the bar
          (Shopee). What is missing is an object with a name (IHG). */}
      <div className={cn("flex items-center gap-2", full ? "mt-4" : "mt-2")}>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-violet-100">
          <span
            className="progress-fill block h-full rounded-full transition-[width] duration-[var(--duration-stage)] ease-[var(--ease-out-expo)]"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
        <BookOpenIcon
          weight={reached ? "fill" : "regular"}
          aria-hidden
          className={cn("shrink-0", reached ? "text-mint-600" : "text-violet-300", "size-4")}
        />
      </div>

      <p className={cn("mt-1.5 text-ink-500", full ? "text-body" : "text-[0.6875rem] leading-4")}>
        {reached ? (
          <>Enough for {target.label}</>
        ) : (
          <>
            <span className="font-strong text-ink-700 numeric">{pointsAway} more</span> for{" "}
            {target.label} ({formatCredit(target.usd)})
          </>
        )}
      </p>
    </motion.div>
  );
}

/** The same fact as the panel, in one sentence, for a screen reader. */
function balanceSentence(points: number): string {
  const released = creditReleased(points);
  const { target, pointsAway, reached } = nextTarget(points);
  return reached
    ? `${formatCredit(released)} in bookstore credit, enough for ${target.label}`
    : `${formatCredit(released)} in bookstore credit, ${pointsAway} more for ${target.label}`;
}
