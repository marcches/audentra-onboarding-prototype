import { CoinVerticalIcon } from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { totalPoints } from "@/lib/points";
import type { StepId } from "@/lib/steps";
import { useOnboarding } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * One celebration layer, owning both the Points flight and the confetti.
 *
 * There used to be two: a fixed flight layer here, and `canvas-confetti`
 * minting a fresh full-screen canvas on every call. Twelve celebration moments
 * meant up to twelve canvases, and at the instant of an award two full-screen
 * layers animated at once — which is the second suspect for the stutter the
 * client reported ("a animação está travada"), after animating `height`. Both
 * now stop existing by construction: **one** `<canvas>`, created once and
 * reused, inside **one** `fixed` `pointer-events: none` layer that also carries
 * the flying token.
 *
 * The layer sits above the Rail and the action pill, below a modal. It spent
 * one revision *below* the Rail, on Ahead's reasoning that confetti should fall
 * behind the chip carrying the number just won — and in the browser that meant
 * a burst anchored to the Balance was drawn behind the 16rem opaque panel the
 * Balance lives in. The number stays legible because the burst is small and
 * sprays outward, not because it is under the furniture.
 *
 * Points are a transaction: a price before the Quest, a receipt after it, and
 * one object doing both jobs. The tag that flies is the *same tag* the student
 * was already looking at while they worked (Langdock prices each unfinished
 * task; Portrait keeps the same "+100" visible after completion).
 *
 * The five beats, ~3.4s, nothing blocking:
 *
 * | # | Beat                                             | ms        |
 * |---|--------------------------------------------------|-----------|
 * | 1 | The price pill pulses and turns solid            | 0–500     |
 * | 2 | **Nothing moves**                                | 500–1000  |
 * | 3 | Pill detaches, flies in an arc, sheds its label  | 1000–1900 |
 * | 4 | Balance scales and glows, its number rolls, and   | 1900–2700 |
 * |   | ~40 particles burst from it and fall behind it   |           |
 * | 5 | The credit line cross-fades to its new value     | 2700–3400 |
 *
 * Beat 2 is what the client meant by "mais devagar": half a second of total
 * stillness is what makes it read as expensive rather than as quick. The whole
 * thing was 2.6s with a 300ms hold and it was too fast to be seen.
 */

type Point = { x: number; y: number };

/** Where the award is in its five beats. `0` is "no award running". */
export type Beat = 0 | 1 | 2 | 3 | 4 | 5;

export const BEATS: Record<number, number> = {
  1: 0,
  2: 500,
  3: 1000,
  4: 1900,
  5: 2700,
  0: 3400,
};

/**
 * The three scales of confetti, and the twelve moments they cover.
 *
 * The client asked for enthusiasm back and named the triggers — *when you win,
 * when you accept, when you finish*. In the domain that is twelve moments: ten
 * Quest awards, the offer acceptance, and Enrolled. None of them goes without.
 * What varies is the scale, because twelve identical parties leave Enrolled
 * nowhere to go.
 */
export type Cheer = "quest" | "accept" | "arrival";

const BRAND = ["#6a38ff", "#1e5bff", "#00c49a"];

type Celebration = {
  stepId: StepId | "share";
  points: number;
  beat: Beat;
  from: Point;
  to: Point;
};

type CelebrationValue = {
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
  /** Start the choreography for a Quest whose Points have just been written. */
  celebrate: (id: StepId | "share", points: number) => void;
  /**
   * Confetti on its own, for the two moments that are not a Points award.
   * `origin` is in viewport pixels; without one the burst is centred.
   */
  cheer: (scale: Cheer, origin?: Point) => void;
};

const CelebrationContext = React.createContext<CelebrationValue | null>(null);

/** Null outside the provider — the style guide renders a Balance with no shell. */
export function useCelebration(): CelebrationValue | null {
  return React.useContext(CelebrationContext);
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

/** Viewport pixels to the 0–1 space `canvas-confetti` fires from. */
function toOrigin(point: Point | null): { x: number; y: number } {
  if (!point) return { x: 0.5, y: 0.45 };
  return {
    x: Math.min(1, Math.max(0, point.x / window.innerWidth)),
    y: Math.min(1, Math.max(0, point.y / window.innerHeight)),
  };
}

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
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

  /* The one canvas. Created on first use against the element below and kept —
     `canvas-confetti` mints its own full-screen canvas per call otherwise, and
     a dozen of those is the cost this whole layer exists to remove. */
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const fireRef = React.useRef<confetti.CreateTypes | null>(null);

  const fire = React.useCallback((options: confetti.Options) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!fireRef.current) {
      fireRef.current = confetti.create(canvas, { resize: true });
    }
    void fireRef.current({ colors: BRAND, disableForReducedMotion: true, ...options });
  }, []);

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

  const cheer = React.useCallback<CelebrationValue["cheer"]>(
    (scale, origin) => {
      if (reduceMotion) return;

      if (scale === "quest") {
        /* Short and anchored on whatever was handed in — the price pill as the
           Points leave it, the Balance as they land. Two of these bracket the
           flight, which is what makes a Quest read as a transaction with a
           beginning and an end rather than as a number quietly changing. */
        fire({
          particleCount: 55,
          spread: 70,
          startVelocity: 30,
          ticks: 110,
          scalar: 0.85,
          origin: toOrigin(origin ?? null),
        });
        return;
      }

      if (scale === "accept") {
        /* Full screen, over the screen the student is already on — no modal,
           no route change (Trello). Two cannons from the lower corners plus a
           centre burst: one origin at 150 particles reads as a sneeze, and
           this is the largest thing that happens before Enrolled. */
        fire({
          particleCount: 90,
          spread: 100,
          startVelocity: 45,
          ticks: 200,
          origin: { x: 0.5, y: 0.45 },
        });
        fire({
          particleCount: 70,
          angle: 60,
          spread: 70,
          startVelocity: 55,
          ticks: 200,
          origin: { x: 0.05, y: 0.9 },
        });
        fire({
          particleCount: 70,
          angle: 120,
          spread: 70,
          startVelocity: 55,
          ticks: 200,
          origin: { x: 0.95, y: 0.9 },
        });
        return;
      }

      /* Enrolled: one burst as the card lands, then sustained rain over the
         dark stage, where confetti reads far more for far fewer particles
         (Codecademy). Three seconds of drops rather than one big bang — a bang
         is an event, and this is the end of something. If it ever stutters on
         a phone, the particle count comes down before the duration does. */
      fire({
        particleCount: 120,
        spread: 110,
        startVelocity: 45,
        ticks: 220,
        origin: { x: 0.5, y: 0.5 },
      });
      const end = performance.now() + 3000;
      const drop = () => {
        if (performance.now() > end) return;
        fire({
          particleCount: 6,
          startVelocity: 0,
          ticks: 260,
          gravity: 0.55,
          scalar: 0.9,
          spread: 120,
          origin: { x: Math.random(), y: -0.1 },
        });
        timers.current.push(window.setTimeout(drop, 120));
      };
      drop();
    },
    [fire, reduceMotion],
  );

  const celebrate = React.useCallback(
    (id: StepId | "share", points: number) => {
      for (const timer of timers.current) window.clearTimeout(timer);
      timers.current = [];

      const to = targetPoint(balances.current) ?? { x: 112, y: 120 };
      const from = centreOf(prices.current.get(id)) ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      /* Reduced motion gets the award without the journey, and without the
         confetti. The point of the choreography is to say "this went there";
         with the travel removed, arriving at the right number still says it. */
      if (reduceMotion) {
        setAward({ stepId: id, points, beat: 1, from, to });
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

      /* The click has to answer immediately. Beat 1 bursts where the price
         pill is — the tag the student was looking at while they worked — and
         beat 4 bursts where it lands. */
      cheer("quest", from);

      at(BEATS[2], () => advance(2));
      at(BEATS[3], () => advance(3));
      at(BEATS[4], () => {
        advance(4);
        setShown(latest.current);
        setLandings((count) => count + 1);
        /* Fired from where the token just landed, so the particles come out
           from behind the Balance rather than from the middle of the page. */
        cheer("quest", targetPoint(balances.current) ?? to);
      });
      at(BEATS[5], () => advance(5));
      at(BEATS[0], () => setAward(null));
    },
    [reduceMotion, cheer],
  );

  const value = React.useMemo<CelebrationValue>(
    () => ({
      shownPoints: shown,
      landings,
      beat: award?.beat ?? 0,
      celebrating: award?.stepId ?? null,
      registerBalance,
      registerPrice,
      celebrate,
      cheer,
    }),
    [shown, landings, award, registerBalance, registerPrice, celebrate, cheer],
  );

  return (
    <CelebrationContext.Provider value={value}>
      {children}

      {/* The layer. Fixed and non-interactive, so nothing it does can move the
          page underneath it or swallow a click meant for the CTA. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[var(--z-celebration)] overflow-hidden"
      >
        <canvas ref={canvasRef} className="size-full" />
        <AnimatePresence>
          {award && award.beat >= 3 && award.beat < 5 && !reduceMotion ? (
            <FlyingToken key={`${award.stepId}-${landings}`} award={award} />
          ) : null}
        </AnimatePresence>
      </div>

      <p aria-live="polite" className="sr-only">
        {award ? `${award.points} points earned` : ""}
      </p>
    </CelebrationContext.Provider>
  );
}

/**
 * The price pill: the Quest's value, in the one place it is allowed to appear.
 *
 * The same component is the price beforehand and the receipt afterwards. It
 * registers its element with the provider so the flight can start from exactly
 * where the student was already looking — that registration is the whole
 * mechanism, and a version of this that flew from the pointer would be
 * decoration.
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
  const award = useCelebration();
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!stepId || !award) return;
    const element = ref.current;
    award.registerPrice(stepId, element);
    return () => award.registerPrice(stepId, null);
  }, [stepId, award]);

  const running = stepId != null && award?.celebrating === stepId;
  const solid = running && (award?.beat ?? 0) >= 1;
  /* Beat 3: the pill detaches. The original goes, and the copy in the layer
     takes over from the same coordinates — so it reads as the pill leaving
     rather than as a second pill appearing. */
  const gone = running && (award?.beat ?? 0) >= 3;

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] font-bold numeric",
        "transition-[background-color,color,box-shadow,opacity] duration-[var(--duration-quick)] ease-[var(--ease-out-soft)]",
        size === "rail" && "px-1.5 py-0 text-[0.625rem]",
        size === "header" && "px-2 py-0.5 text-small",
        size === "flight" && "h-12 gap-2 px-4 text-h2 shadow-lift",
        earned || solid
          ? "bg-mint-600 text-white"
          : "bg-violet-50 text-violet-700 ring-1 ring-violet-100 ring-inset",
        solid && "ring-glow-mint",
        gone && "opacity-0",
        className,
      )}
    >
      <CoinVerticalIcon
        weight="fill"
        aria-hidden
        className={cn(size === "flight" ? "size-6" : size === "header" ? "size-3.5" : "size-3")}
      />
      <span>+{points}</span>
      <span className="sr-only">{earned ? "points earned" : "points for this quest"}</span>
    </span>
  );
}

/**
 * Beat 3: the pill in flight.
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
     Balance is two inches away or across a 1920px screen. */
  const apex = {
    x: award.from.x + dx * 0.45 - Math.sign(dx || 1) * Math.min(120, Math.abs(dx) * 0.25),
    y: Math.min(award.from.y, award.to.y) - Math.max(60, Math.abs(dy) * 0.35),
  };

  return (
    <motion.div
      initial={{ x: award.from.x, y: award.from.y, scale: 1, opacity: 1 }}
      animate={{
        x: [award.from.x, apex.x, award.to.x],
        y: [award.from.y, apex.y, award.to.y],
        scale: [1, 0.86, 0.6],
      }}
      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.24 } }}
      transition={{ duration: 0.9, ease: [0.32, 0, 0.2, 1], times: [0, 0.5, 1] }}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <span className="block -translate-x-1/2 -translate-y-1/2">
        <span className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-pill)] bg-mint-600 px-4 text-h2 font-bold text-white shadow-lift numeric">
          <CoinVerticalIcon weight="fill" aria-hidden className="size-6" />
          {/* Sheds its label in the last third and arrives as a coin. */}
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.55, duration: 0.3 }}
          >
            +{award.points}
          </motion.span>
        </span>
      </span>
    </motion.div>
  );
}
