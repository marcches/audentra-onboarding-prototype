import { CoinVerticalIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { totalPoints } from "@/lib/points";
import type { StepId } from "@/lib/steps";
import { useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Points as a transaction: a price before the Quest, a receipt after it, and
 * one object doing both jobs.
 *
 * What this replaces was a `+50` born at the moment of completion and flown to
 * the Balance. It animated well and it meant nothing, because a figure that
 * appears from nothing on completion makes the flight decoration. The mechanism
 * matters more than the duration: the tag that flies is the *same tag* the
 * student was already looking at while they worked, which is what turns a
 * reward into a receipt for a price they had been quoted (Langdock prices each
 * unfinished task; Portrait keeps the same "+100" visible after completion).
 *
 * The seven beats, ~2.6s, nothing blocking — Continue is live from beat three:
 *
 * | # | Beat                                          | ms        |
 * |---|-----------------------------------------------|-----------|
 * | 1 | Badge grows from centre with overshoot        | 0–350     |
 * | 2 | Headline enters from below                    | 250–550   |
 * | 3 | The price pill pulses and turns solid         | 500–800   |
 * | 4 | **Nothing moves**                             | 800–1100  |
 * | 5 | Pill detaches, flies in an arc, sheds its label| 1100–1850 |
 * | 6 | Balance scales, glows, its number rolls       | 1800–2300 |
 * | 7 | The credit line cross-fades to its new value  | 2300–2600 |
 *
 * Beat 4 is what the client meant by "more slowly". 300ms of total stillness is
 * what makes it read as expensive rather than as quick.
 *
 * The flight layer is `position: fixed` with `pointer-events: none`, so the
 * choreography cannot shift the layout and the four drift invariants still hold
 * while it runs.
 */

type Point = { x: number; y: number };

/** Where the award is in its seven beats. `0` is "no award running". */
export type Beat = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const BEATS: Record<number, number> = {
  1: 0,
  2: 250,
  3: 500,
  4: 800,
  5: 1100,
  6: 1800,
  7: 2300,
  0: 2600,
};

type Celebration = {
  stepId: StepId | "share";
  points: number;
  beat: Beat;
  from: Point;
  to: Point;
};

type PointsAwardValue = {
  /**
   * The total to *render*, which lags the store by the length of the flight so
   * the number goes up as the token lands rather than before it has left.
   */
  shownPoints: number;
  /** Bumped when a token lands, so the Balance can react to its own arrival. */
  landings: number;
  /** Which beat is running, so the Balance and the price pill can play their parts. */
  beat: Beat;
  celebrating: StepId | "share" | null;
  registerBalance: React.RefCallback<HTMLElement>;
  registerPrice: (id: StepId | "share", element: HTMLElement | null) => void;
  /**
   * Start the choreography for a Quest whose Points have just been written.
   * `onSettled` fires at beat 3, when the CTA is live — not at the end, because
   * nothing about this award blocks.
   */
  celebrate: (id: StepId | "share", points: number) => void;
};

const PointsAwardContext = React.createContext<PointsAwardValue | null>(null);

/** Null outside the provider — the style guide renders a Balance with no shell. */
export function usePointsAward(): PointsAwardValue | null {
  return React.useContext(PointsAwardContext);
}

function centreOf(element: HTMLElement | null | undefined): Point | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/** The visible Balance, of the two the shell renders at different widths. */
function targetPoint(balances: Set<HTMLElement>): Point | null {
  for (const element of balances) {
    const point = centreOf(element);
    if (point) return point;
  }
  return null;
}

export function PointsAwardProvider({ children }: { children: React.ReactNode }) {
  const total = totalPoints(useOnboarding());
  const reduceMotion = useReducedMotion();

  const [shown, setShown] = React.useState(total);
  const [landings, setLandings] = React.useState(0);
  const [award, setAward] = React.useState<Celebration | null>(null);

  const balances = React.useRef(new Set<HTMLElement>());
  const prices = React.useRef(new Map<StepId | "share", HTMLElement>());
  const timers = React.useRef<number[]>([]);
  const latest = React.useRef(total);
  latest.current = total;

  /* A total that changes with no award running is not a reward: it is an edit
     un-signing the packet, or a restored blob. It should simply be true. */
  React.useEffect(() => {
    if (!award) setShown(total);
  }, [total, award]);

  React.useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer);
    },
    [],
  );

  const registerBalance = React.useCallback<React.RefCallback<HTMLElement>>((element) => {
    const set = balances.current;
    if (!element) return;
    set.add(element);
    return () => {
      set.delete(element);
    };
  }, []);

  const registerPrice = React.useCallback((id: StepId | "share", element: HTMLElement | null) => {
    if (element) prices.current.set(id, element);
    else prices.current.delete(id);
  }, []);

  const celebrate = React.useCallback(
    (id: StepId | "share", points: number) => {
      for (const timer of timers.current) window.clearTimeout(timer);
      timers.current = [];

      const to = targetPoint(balances.current) ?? {
        x: 112,
        y: 120,
      };
      const from = centreOf(prices.current.get(id)) ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      /* Reduced motion gets the award without the journey. The point of the
         choreography is to say "this went there"; with the travel removed,
         arriving at the right number still says it. */
      if (reduceMotion) {
        setAward({ stepId: id, points, beat: 3, from, to });
        setShown(latest.current);
        setLandings((count) => count + 1);
        timers.current.push(window.setTimeout(() => setAward(null), 1400));
        return;
      }

      setAward({ stepId: id, points, beat: 1, from, to });

      const at = (ms: number, run: () => void) => {
        timers.current.push(window.setTimeout(run, ms));
      };
      const advance = (beat: Beat) =>
        setAward((current) => (current ? { ...current, beat } : current));

      at(BEATS[2], () => advance(2));
      at(BEATS[3], () => advance(3));
      at(BEATS[4], () => advance(4));
      at(BEATS[5], () => advance(5));
      at(BEATS[6], () => {
        advance(6);
        setShown(latest.current);
        setLandings((count) => count + 1);
      });
      at(BEATS[7], () => advance(7));
      at(BEATS[0], () => setAward(null));
    },
    [reduceMotion],
  );

  const value = React.useMemo<PointsAwardValue>(
    () => ({
      shownPoints: shown,
      landings,
      beat: award?.beat ?? 0,
      celebrating: award?.stepId ?? null,
      registerBalance,
      registerPrice,
      celebrate,
    }),
    [shown, landings, award, registerBalance, registerPrice, celebrate],
  );

  return (
    <PointsAwardContext.Provider value={value}>
      {children}

      {/* The flight layer. Fixed and non-interactive, so nothing it does can
          move the page underneath it or swallow a click meant for the CTA. */}
      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        <AnimatePresence>
          {award && award.beat >= 5 && !reduceMotion ? (
            <FlyingToken key={`${award.stepId}-${landings}`} award={award} />
          ) : null}
        </AnimatePresence>
      </div>

      <p aria-live="polite" className="sr-only">
        {award ? `${award.points} points earned` : ""}
      </p>
    </PointsAwardContext.Provider>
  );
}

/**
 * The price pill: the Quest's value, in the one place it is allowed to appear.
 *
 * The same component is the price beforehand and the receipt afterwards. It
 * registers its element with the provider so the flight can start from exactly
 * where the student was already looking — that registration is the whole
 * mechanism, and a version of this that flew from the pointer would be the
 * decoration this ticket replaced.
 *
 * At `flight` size it is 56px tall with a coin and a `+120`, large enough to
 * read while it moves. Whatever flew before was a `text-sm`.
 */
export function PricePill({
  points,
  stepId,
  size = "header",
  earned = false,
  className,
}: {
  points: number;
  /** Which Quest this price belongs to. The flight is keyed on it. */
  stepId?: StepId | "share";
  size?: "rail" | "header" | "flight";
  /** Once earned the same tag is the receipt: mint rather than violet. */
  earned?: boolean;
  className?: string;
}) {
  const award = usePointsAward();
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!stepId || !award) return;
    const element = ref.current;
    award.registerPrice(stepId, element);
    return () => award.registerPrice(stepId, null);
  }, [stepId, award]);

  const running = stepId != null && award?.celebrating === stepId;
  const solid = running && (award?.beat ?? 0) >= 3;
  /* Beat 5: the pill detaches. The original goes, and the copy in the flight
     layer takes over from the same coordinates — so it reads as the pill
     leaving rather than as a second pill appearing. */
  const gone = running && (award?.beat ?? 0) >= 5;

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] font-bold numeric",
        "transition-[background-color,color,box-shadow,opacity] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)]",
        size === "rail" && "px-1.5 py-0 text-[0.625rem]",
        size === "header" && "px-3 py-1.5 text-body",
        size === "flight" && "h-14 gap-2 px-5 text-h2 shadow-lift",
        earned || solid
          ? "bg-mint-600 text-white"
          : "bg-violet-50 text-violet-700 ring-1 ring-violet-100 ring-inset",
        solid && "ring-glow-mint",
        /* Lifted above the award stage's wash while the award runs, so beat 3
           happens *where the price already was* rather than behind a scrim.
           A z-index is not geometry: nothing moves. */
        running && "relative z-50",
        gone && "opacity-0",
        className,
      )}
    >
      <CoinVerticalIcon
        weight="fill"
        aria-hidden
        className={cn(size === "flight" ? "size-7" : size === "header" ? "size-4" : "size-3")}
      />
      <span>+{points}</span>
      <span className="sr-only">{earned ? "points earned" : "points for this quest"}</span>
    </span>
  );
}

/**
 * Beat 5: the pill in flight.
 *
 * An arc rather than a straight line, because a straight line between two
 * points on a page reads as a tween and an arc reads as a throw. It shrinks by
 * ~40% and sheds its label in the last third, arriving at the Balance as a
 * coin — which is what the Balance is made of.
 */
function FlyingToken({ award }: { award: Celebration }) {
  const dx = award.to.x - award.from.x;
  const dy = award.to.y - award.from.y;
  /* The apex: up and out, on the side the destination is not. A control point
     derived from the distance keeps the arc's shape constant whether the
     Balance is two inches away or across a 1440px screen. */
  const apex = {
    x: award.from.x + dx * 0.45 - Math.sign(dx || 1) * Math.min(120, Math.abs(dx) * 0.25),
    y: Math.min(award.from.y, award.to.y) - Math.max(60, Math.abs(dy) * 0.35),
  };

  return (
    <motion.div
      aria-hidden
      initial={{ x: award.from.x, y: award.from.y, scale: 1, opacity: 1 }}
      animate={{
        x: [award.from.x, apex.x, award.to.x],
        y: [award.from.y, apex.y, award.to.y],
        scale: [1, 0.86, 0.6],
      }}
      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.18 } }}
      transition={{ duration: 0.7, ease: [0.32, 0, 0.2, 1], times: [0, 0.5, 1] }}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <span className="block -translate-x-1/2 -translate-y-1/2">
        <span className="inline-flex h-14 items-center gap-2 rounded-[var(--radius-pill)] bg-mint-600 px-5 text-h2 font-bold text-white shadow-lift numeric">
          <CoinVerticalIcon weight="fill" aria-hidden className="size-7" />
          {/* Sheds its label in the last third and arrives as a coin. */}
          <motion.span
            initial={{ opacity: 1, width: "auto" }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.45, duration: 0.25 }}
          >
            +{award.points}
          </motion.span>
        </span>
      </span>
    </motion.div>
  );
}

/**
 * Beats 1 and 2: the badge and the headline, in the step column.
 *
 * An overlay rather than a block in the flow, because a block appearing at
 * submit time would push the whole screen down — the second drift invariant.
 * It is `pointer-events-none` except for its own actions, so the CTA underneath
 * is genuinely live from beat 3 rather than merely visible.
 */
export function AwardStage({
  stepId,
  headline,
  children,
}: {
  stepId: StepId;
  headline: string;
  children?: React.ReactNode;
}) {
  const award = usePointsAward();
  const running = award?.celebrating === stepId;
  const beat = award?.beat ?? 0;

  return (
    <AnimatePresence>
      {running ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-canvas/85 backdrop-blur-sm lg:left-56"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="brand-gradient flex size-20 items-center justify-center rounded-full text-white shadow-lift"
          >
            <CoinVerticalIcon weight="fill" aria-hidden className="size-10" />
          </motion.span>

          {beat >= 2 ? (
            <motion.p
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-h2 text-ink-900"
            >
              {headline}
            </motion.p>
          ) : null}

          {beat >= 3 && children ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-auto"
            >
              {children}
            </motion.div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
