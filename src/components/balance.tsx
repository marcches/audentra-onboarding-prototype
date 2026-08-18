import { BookOpenIcon, CoinVerticalIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

import { useCelebration } from "@/components/celebration";
import { creditReleased, formatCredit, nextTarget, totalPoints } from "@/lib/points";
import { useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The Balance: two roles, one source (ADR 0013).
 *
 * `points.ts` is the only module that knows what a Point is worth, and neither
 * component below computes anything of its own — the split is about how the
 * answer is presented, never about who computes it. That is the invariant the
 * retired "there is exactly one Balance in the shell" line was actually
 * protecting: a second Balance with its own total is how two figures come to
 * disagree on one screen.
 *
 * **`CompactBalance`** answers *how many do I have?* It is small enough to live
 * permanently in a rail, a bar or a sidebar, in every Area, and it carries no
 * explanation of its own (Wrike's `Quick start` figure).
 *
 * **`RichBalance`** answers *what is this turning into?* — the Bookstore ladder
 * rung and the distance to it, in a column that has the room for it (OpenSea's
 * `Total XP` block, Uxcel's reward column). Four things make it a destination
 * rather than a counter, and all four came out of the research (Ulta, adiClub,
 * IHG, Shopee, Mimo, Duolingo):
 *
 * 1. **Two numbers, always.** Points above, what they convert to below. A
 *    number with no translation beside it is the scoreboard ADR-0002 rejects.
 * 2. **Its own surface.** Not text in a bar. It should look pressable.
 * 3. **A verb.** "50 points to spend", never "Total: 50".
 * 4. **What is missing, named as an object.** "180 more for a course textbook",
 *    with a thin bar that ends in the object's icon rather than in the end of
 *    the bar.
 *
 * `celebrates` is what separates the gate's Balance from a permanent shell
 * element. In the gate both forms are where the award's flight lands, so they
 * register with the celebration layer and play beat 4 — the scale, the glow and
 * the rolling number. A Balance that persists across a whole portal does not:
 * it must not animate on change while the student is reading something else,
 * which is the shell's own rule and the reason the flag is opt-in rather than
 * opt-out.
 */

/** The live total, and the award's reaction to it — only where one is in flight. */
function useBalance(celebrates: boolean) {
  const live = totalPoints(useOnboarding());
  const flight = useCelebration();
  /* Read unconditionally — a hook cannot be called under an `if` — and then
     ignored where the Balance is furniture rather than a landing site. */
  const award = celebrates ? flight : null;

  return {
    /* Outside a flight the live total is the shown total. */
    points: award?.shownPoints ?? live,
    landings: award?.landings ?? 0,
    beat: award?.beat ?? 0,
    register: award?.registerBalance,
  };
}

/**
 * The figure alone, on one line. The compact role.
 *
 * It never reflows its neighbour: `shrink-0`, and every digit is tabular, so a
 * total going from 99 to 100 does not widen the element that carries it.
 */
export function CompactBalance({ celebrates = false }: { celebrates?: boolean }) {
  const { points, landings, beat, register } = useBalance(celebrates);
  const reduceMotion = useReducedMotion();
  const released = creditReleased(points);

  return (
    <span
      ref={register}
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] bg-violet-50 px-2 py-0.5",
        "text-micro font-bold tracking-[0.06em] text-violet-700 uppercase",
        "transition-shadow duration-[var(--duration-quick)]",
        beat === 4 && "ring-glow",
      )}
    >
      <CoinVerticalIcon weight="fill" aria-hidden className="size-3" />
      <span aria-hidden>
        <Total points={points} landings={landings} still={!celebrates || !!reduceMotion} /> pts
      </span>
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

/**
 * The figure, what it converts to, and what it is turning into. The rich role.
 *
 * Dashboard-only in the portal, and the foot of the Rail in the gate. It does
 * not follow the student into an Area where the compact form already answers
 * the question this one answers at length.
 */
export function RichBalance({
  size = "rail",
  celebrates = false,
}: {
  /** `full` is the Dashboard column, which has the room the rail does not. */
  size?: "rail" | "full";
  celebrates?: boolean;
}) {
  const { points, landings, beat, register } = useBalance(celebrates);
  const reduceMotion = useReducedMotion();

  const released = creditReleased(points);
  const { target, pointsAway, reached } = nextTarget(points);
  const progress = reached ? 1 : Math.min(1, released / target.usd);
  const full = size === "full";

  return (
    <motion.div
      ref={register}
      animate={beat === 4 && !reduceMotion ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn(
        /* Its own surface, told apart from what is around it by **tint**
           rather than by a hairline (ADR 0015): border delimits a control, and
           this is a block. It is not raised either — the band and the lead card
           are the screen's only elevation, because shadow marks the one object
           a screen is about. */
        "rounded-[var(--radius-card)] bg-violet-50",
        "transition-shadow duration-[var(--duration-quick)]",
        full ? "px-6 py-4" : "px-4 py-2",
        beat === 4 && "ring-glow",
      )}
    >
      {/* The verb, not a label. adiClub's "50 points to spend" turns a counter
          into a wallet, and the word doing that is "spend". */}
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-bold text-violet-700 numeric",
            full ? "text-[3rem] leading-none" : "text-h3",
          )}
        >
          <Total points={points} landings={landings} still={!celebrates || !!reduceMotion} />
        </span>
        <span className={cn("font-strong text-violet-700", full ? "text-lead" : "text-micro")}>
          points to spend
        </span>
      </div>

      {/* The second number: what they convert to. Ulta puts "10 Points" and
          "$0.00 Value" on the same row, and the translation lives glued to the
          figure rather than a screen away. */}
      <motion.p
        key={`${released}-${beat >= 5 ? "new" : "old"}`}
        initial={beat === 5 && !reduceMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn("text-mint-deep numeric", full ? "mt-1 text-h3" : "text-micro")}
      >
        = <span className="font-bold">{formatCredit(released)}</span> in bookstore credit
      </motion.p>

      {/* The bar ends in the prize's icon, not in the end of the bar (Shopee).
          What is missing is an object with a name (IHG). `scaleX`, not `width`:
          no animation rule in this system touches a layout property. */}
      <div className={cn("flex items-center gap-1.5", full ? "mt-4" : "mt-1.5")}>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-violet-100">
          <span
            className="progress-fill block h-full origin-left rounded-full transition-transform duration-[var(--duration-stage)] ease-[var(--ease-out-expo)]"
            style={{ transform: `scaleX(${progress})` }}
          />
        </span>
        <BookOpenIcon
          weight={reached ? "fill" : "regular"}
          aria-hidden
          className={cn("size-3.5 shrink-0", reached ? "text-mint-600" : "text-violet-300")}
        />
      </div>

      <p className={cn("mt-1 text-ink-500", full ? "text-body" : "text-micro leading-4")}>
        {reached ? (
          <>Enough for {target.label}</>
        ) : (
          <>
            <span className="font-strong text-ink-700 numeric">{pointsAway} more</span> for{" "}
            {target.label}
          </>
        )}
      </p>
    </motion.div>
  );
}

/**
 * The number itself.
 *
 * Beat 4: it scales 1 → 1.12 → 1 with a brief glow while its number rolls,
 * keyed on the landing count so it replays its own arrival — the token is
 * absorbed and then the total reacts, in that order. `still` is a permanent
 * shell element saying it will not do any of that.
 */
function Total({ points, landings, still }: { points: number; landings: number; still: boolean }) {
  return (
    <motion.span
      key={still ? "static" : landings}
      initial={!still && landings > 0 ? { scale: 0.75, opacity: 0.4 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className="inline-block numeric"
    >
      {points}
    </motion.span>
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
