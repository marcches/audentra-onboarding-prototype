import { SparkleIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { totalPoints } from "@/lib/points";
import { useOnboarding } from "@/lib/store";

/**
 * Points arriving, from wherever they were earned into the one Balance.
 *
 * The thing this replaces printed `+50` beside a finished rail item, which is a
 * receipt: it appears where the work already happened and it stays there. What
 * a reward moment has to do instead is connect two places — the button that was
 * just pressed, and the total it fed. So the award is a token that leaves the
 * point of action, travels to the Balance, and stops existing; the Balance is
 * the only thing left over.
 *
 * Nothing calls `award()`. The provider watches the one number that matters and
 * animates whenever it goes up, which means every future point-earning action
 * is animated for free and none of them can forget to be. The alternative —
 * every step's submit handler firing an award beside its `patch` — is two
 * writes that have to agree, and the second one is the one people forget.
 *
 * Where it flies *from* is the last pointer-down. That is genuinely the point
 * of action for a click or a tap, and it needs no route to describe itself.
 * Keyboard and the odd programmatic award fall back to the foot of the screen,
 * where the action bar lives.
 */

type Point = { x: number; y: number };

type Token = {
  id: number;
  amount: number;
  from: Point;
  to: Point;
};

type PointsAwardValue = {
  /**
   * The total to *render* — which lags the store by the length of one flight,
   * so the number goes up as the token lands rather than before it has left.
   */
  shownPoints: number;
  /** Bumped when a token lands, so the Balance can react to its own arrival. */
  landings: number;
  registerBalance: React.RefCallback<HTMLElement>;
};

const PointsAwardContext = React.createContext<PointsAwardValue | null>(null);

/** Null outside the provider — the style guide renders a Balance with no shell around it. */
export function usePointsAward(): PointsAwardValue | null {
  return React.useContext(PointsAwardContext);
}

/** The visible Balance, of the two the shell renders at different widths. */
function targetPoint(balances: Set<HTMLElement>): Point | null {
  for (const element of balances) {
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
  }
  return null;
}

export function PointsAwardProvider({ children }: { children: React.ReactNode }) {
  const total = totalPoints(useOnboarding());
  const [shown, setShown] = React.useState(total);
  const [landings, setLandings] = React.useState(0);
  const [tokens, setTokens] = React.useState<Token[]>([]);

  const balances = React.useRef(new Set<HTMLElement>());
  const pointer = React.useRef<Point | null>(null);
  const previous = React.useRef(total);
  const nextId = React.useRef(0);
  /* Read at landing time, not at award time: two awards in quick succession
     should both land on the truth rather than on their own arithmetic. */
  const latest = React.useRef(total);
  latest.current = total;

  React.useEffect(() => {
    const remember = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
    };
    /* Capture, because a handler on the way down may unmount whatever was
       clicked before the event finishes bubbling. */
    window.addEventListener("pointerdown", remember, true);
    return () => window.removeEventListener("pointerdown", remember, true);
  }, []);

  React.useEffect(() => {
    const gained = total - previous.current;
    previous.current = total;
    if (gained === 0) return;

    const to = targetPoint(balances.current);
    /* A loss is an edit un-signing the packet, not an award, and it should not
       fly anywhere — it should simply be true. Same for a gain with no Balance
       on screen to fly to. */
    if (gained < 0 || !to) {
      setShown(total);
      return;
    }

    const from = pointer.current ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight - 56,
    };
    nextId.current += 1;
    setTokens((current) => [...current, { id: nextId.current, amount: gained, from, to }]);
  }, [total]);

  const registerBalance = React.useCallback<React.RefCallback<HTMLElement>>((element) => {
    const set = balances.current;
    if (!element) return;
    set.add(element);
    return () => {
      set.delete(element);
    };
  }, []);

  const land = React.useCallback((id: number) => {
    setTokens((current) => current.filter((token) => token.id !== id));
    setShown(latest.current);
    setLandings((count) => count + 1);
  }, []);

  const value = React.useMemo<PointsAwardValue>(
    () => ({ shownPoints: shown, landings, registerBalance }),
    [shown, landings, registerBalance],
  );

  return (
    <PointsAwardContext.Provider value={value}>
      {children}
      {/* Above the celebration dialog: accepting the offer and sharing it both
          award points from inside a modal, and a token that lands behind the
          overlay is a token nobody sees. */}
      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        <AnimatePresence>
          {tokens.map((token) => (
            <AwardToken key={token.id} token={token} onLand={() => land(token.id)} />
          ))}
        </AnimatePresence>
      </div>
      {/* The award is a visual event; this is the same event for anyone who
          isn't watching it happen. */}
      <p aria-live="polite" className="sr-only">
        {tokens.length > 0 ? `${tokens[tokens.length - 1].amount} points earned` : ""}
      </p>
    </PointsAwardContext.Provider>
  );
}

/**
 * One `+N` in flight.
 *
 * Reduced motion gets the award without the journey: the token appears at the
 * Balance, holds long enough to be read, and goes. The point of the animation
 * is to say "this went there" — with the travel removed, arriving at the right
 * place still says it.
 */
function AwardToken({ token, onLand }: { token: Token; onLand: () => void }) {
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!reduceMotion) return;
    const timer = window.setTimeout(onLand, 1100);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, onLand]);

  const label = (
    <span className="flex items-center gap-1 rounded-[var(--radius-pill)] bg-violet-500 px-2.5 py-1 text-small font-bold text-white shadow-lift">
      <SparkleIcon weight="fill" aria-hidden className="size-3.5" />+{token.amount}
    </span>
  );

  if (reduceMotion) {
    return (
      <motion.div
        aria-hidden
        exit={{ opacity: 0 }}
        /* Just above the Balance rather than on top of it: the award and the
           total it changed should be readable at the same time. */
        style={{ position: "absolute", top: 0, left: 0, x: token.to.x, y: token.to.y - 26 }}
      >
        <span className="block -translate-x-1/2 -translate-y-1/2">{label}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      aria-hidden
      initial={{ x: token.from.x, y: token.from.y, opacity: 0, scale: 0.7 }}
      animate={{ x: token.to.x, y: token.to.y, opacity: 1, scale: 1 }}
      /* A pop on arrival rather than a fade-out: the token is absorbed by the
         Balance, which is also the moment the number changes. */
      exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.22 } }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], opacity: { duration: 0.18 } }}
      onAnimationComplete={onLand}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <span className="block -translate-x-1/2 -translate-y-1/2">{label}</span>
    </motion.div>
  );
}
