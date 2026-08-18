import { addDays } from "@/lib/day";
import { formatMoney } from "@/lib/fixtures";
import { steps, totalStepPoints } from "@/lib/steps";
import { completedSteps, type OnboardingState } from "@/lib/store";

/**
 * What a Point is worth, and what it is worth *for*.
 *
 * ADR-0002: a Point with no named destination is a scoreboard, and every
 * rewards UI worth copying (Ulta's "10 Points / $0.00 Value", adiClub's "50
 * points to spend", IHG's "20 more nights to your next Milestone") shows points
 * as distance to a thing rather than as a score. Here the thing is credit at
 * the campus bookstore.
 *
 * FIXTURE — both numbers below are plausible, not authoritative. The real rate
 * has to come from the institution before a student ever sees this. They live
 * here, and only here, so replacing them is an edit to two lines rather than a
 * hunt through copy: everything else in the app derives from them.
 */
export const CREDIT_PER_POINT_USD = 0.2;

/**
 * Credit is issued in whole blocks rather than continuously, because that is
 * what gives the Balance something to count down to. A running "$17.40 so far"
 * has no next moment in it; "10 points to your next $10" does.
 */
export const CREDIT_BLOCK_USD = 10;

/** Derived, never typed out: the two fixtures above are the only inputs. */
export const POINTS_PER_BLOCK = Math.round(CREDIT_BLOCK_USD / CREDIT_PER_POINT_USD);

/** Bookstore credit the student can actually spend today, in USD. */
export function creditReleased(points: number): number {
  return Math.floor(points / POINTS_PER_BLOCK) * CREDIT_BLOCK_USD;
}

/**
 * Points still to earn before the next block lands. Never zero: on the boundary
 * the next thing to aim at is the block after it, so the Balance always has
 * somewhere to point.
 */
export function pointsToNextRelease(points: number): number {
  return POINTS_PER_BLOCK - (points % POINTS_PER_BLOCK);
}

/** The next block's value, in USD — what the countdown is counting down to. */
export function nextRelease(points: number): number {
  return creditReleased(points) + CREDIT_BLOCK_USD;
}

export function formatCredit(usd: number): string {
  return formatMoney(usd, "USD");
}

/**
 * What the credit actually buys, as objects rather than as amounts.
 *
 * "180 more for a $25 textbook" is a target; "180 points to go" is arithmetic.
 * Shopee's progress bar ends in the prize's icon and IHG names the milestone,
 * and both work for the same reason: a bar that ends in a number ends in
 * nothing. FIXTURE, in the same spirit as the rate above.
 */
export const BOOKSTORE_LADDER = [
  { usd: 10, label: "a notebook and pens", icon: "notebook" },
  { usd: 25, label: "a course textbook", icon: "book" },
  { usd: 50, label: "an Aster hoodie", icon: "shirt" },
  { usd: 100, label: "your first term's books", icon: "books" },
] as const;

export type BookstoreTarget = (typeof BOOKSTORE_LADDER)[number];

/**
 * Points a student has to hold before `usd` of credit has actually been
 * **released** to them.
 *
 * Not `usd / rate`, and that difference is a real defect the Reward track
 * surfaced by drawing the two facts beside each other: credit is issued in
 * whole blocks, so a rung is reached when enough *blocks* have landed, not when
 * the raw arithmetic crosses it. At 145 Points the raw sum is $29 and the
 * released credit is $20, and the old figure said "0 more for a course
 * textbook" beside a $25 rung the student had visibly not reached. A distance
 * of zero to something you have not got is the one number a reward system must
 * never print.
 */
function pointsForCredit(usd: number): number {
  return POINTS_PER_BLOCK * Math.ceil(usd / CREDIT_BLOCK_USD);
}

/**
 * The next thing on the ladder this student has not reached, with what it costs
 * in Points from where they are. The last rung repeats once passed: a Balance
 * with nothing left to point at is the scoreboard again.
 */
export function nextTarget(points: number): {
  target: BookstoreTarget;
  pointsAway: number;
  reached: boolean;
} {
  const spendable = creditReleased(points);
  const target = BOOKSTORE_LADDER.find((rung) => rung.usd > spendable);
  if (!target) {
    const last = BOOKSTORE_LADDER[BOOKSTORE_LADDER.length - 1];
    return { target: last, pointsAway: 0, reached: true };
  }
  return {
    target,
    pointsAway: Math.max(0, pointsForCredit(target.usd) - points),
    reached: false,
  };
}

/* -------------------------------------------------------------------------
   The Reward track
   ---------------------------------------------------------------------- */

/**
 * The whole ladder at once, with where the student is standing on it.
 *
 * `nextTarget` above answers *what is next*; this answers *how far along the
 * run of named amounts am I*, which is a different question and the one ADR
 * 0002 described in prose and never drew: **distance to a named thing along a
 * run of named things, never a bare score** (sweetgreen).
 *
 * `progress` is the fraction of the way from the previous rung to the next
 * one, not the fraction of the whole ladder. A bar that measures the whole
 * ladder barely moves for the first three rungs, which teaches the student the
 * bar does not respond to them — and the rungs are far apart on purpose.
 *
 * Derived, like everything else here, from the one number a student has.
 */
export type RewardTrack = {
  rungs: { target: BookstoreTarget; reached: boolean; next: boolean }[];
  /** Bookstore credit already released, in USD. */
  released: number;
  /** The rung being aimed at. The last one repeats once the ladder is finished. */
  target: BookstoreTarget;
  pointsAway: number;
  reached: boolean;
  /** 0–1, from the previous rung to the next. */
  progress: number;
};

export function rewardTrack(points: number): RewardTrack {
  const released = creditReleased(points);
  const { target, pointsAway, reached } = nextTarget(points);

  /* Where the run of named amounts starts from: the rung already passed, or
     zero. Measuring from zero every time is what makes a four-rung ladder feel
     like one long bar with nothing happening on it.

     Measured in **Points** rather than in released dollars, because credit is
     released in whole blocks: a bar reading released credit sits perfectly
     still for forty-nine Points and then jumps, which teaches the student it
     does not respond to them. Points is what they earn, and it is what moves. */
  const passed = BOOKSTORE_LADDER.filter((rung) => rung.usd <= released);
  const from = passed.length > 0 ? pointsForCredit(passed[passed.length - 1].usd) : 0;
  const span = pointsForCredit(target.usd) - from;
  const progress = reached || span <= 0 ? 1 : Math.min(1, Math.max(0, (points - from) / span));

  return {
    rungs: BOOKSTORE_LADDER.map((rung) => ({
      target: rung,
      reached: rung.usd <= released,
      next: !reached && rung === target,
    })),
    released,
    target,
    pointsAway,
    reached,
    progress,
  };
}

/* -------------------------------------------------------------------------
   Headroom
   ---------------------------------------------------------------------- */

/**
 * What is **still earnable today**, and it never says what was lost.
 *
 * Forward-looking by construction: it is a sum over what the student can act on
 * right now, at what those things are worth today, so there is no arithmetic
 * available to it that could produce a figure about the past. That is the
 * whole social design of it — "180 still available today" is an invitation and
 * "you have lost 40" is a bill, and the product has already decided which of
 * those it is (Upwork's "Available to earn" at the head of a task list).
 *
 * The values come from the caller because *what a thing is worth today* is
 * Requirement logic and lives in `portal.ts`. What a Point is remains this
 * module's, and it stays without an opinion about time.
 */
export function headroom(values: readonly number[]): { points: number; count: number } {
  return {
    points: values.reduce((sum, value) => sum + value, 0),
    count: values.length,
  };
}

/* -------------------------------------------------------------------------
   Streak
   ---------------------------------------------------------------------- */

/**
 * Consecutive days, counting back, on which the student finished at least one
 * Requirement.
 *
 * **Today not being in the list does not break the streak.** A student who
 * finished something yesterday and has not opened the portal yet today is on a
 * live streak of one; the day is not over. Counting from today would show them
 * a zero every morning for something they have not failed to do yet, which is
 * the reprimand this product does not make.
 *
 * **A broken streak resets, and says nothing else.** There is no "you lost a
 * 6-day streak", no freeze to buy, no repair. The number is simply smaller the
 * next time it is read. Missing a day while you are moving house is not
 * something a university's enrolment portal should have an opinion about.
 *
 * Pure over a list of ISO days, which is what makes it testable here: the days
 * themselves come from the portal, where finishing things happens.
 */
export function streakOf(days: readonly string[], today: string): number {
  const seen = new Set(days);
  /* The grace day above: start at today if it counts, otherwise at yesterday. */
  let cursor = seen.has(today) ? today : addDays(today, -1);
  let run = 0;
  while (seen.has(cursor)) {
    run += 1;
    cursor = addDays(cursor, -1);
  }
  return run;
}

/**
 * Awarded once, for using the share prompt — the one point-earning action in
 * this flow that is not a Step submission, so it cannot live in `steps.ts`
 * beside the per-Step values. Duolingo's "SHARE FOR A REWARD": sharing is
 * itself a gain rather than a favour being asked.
 */
export const SHARE_POINTS = 20;

/** The sum of Points from Steps actually completed — never a hardcoded max. */
export function stepPoints(state: OnboardingState): number {
  const done = new Set(completedSteps(state));
  return steps.filter((step) => done.has(step.id)).reduce((sum, step) => sum + step.points, 0);
}

export function totalPoints(state: OnboardingState): number {
  return stepPoints(state) + (state.offer.shared ? SHARE_POINTS : 0);
}

/**
 * Every Point on offer, announced once at the entrance and nowhere else.
 * Langdock crowns its checklist with "0 / 595" and that is the whole of the
 * promise; repeating it per screen turns it into a debt.
 *
 * It took a Student status until this round, because the flow was nine Quests
 * for an international student and ten for everyone else. It is nine for
 * everybody now (ADR 0011), so the announcement at the entrance is the same
 * number the student later earns.
 */
export const totalPointsAvailable = totalStepPoints + SHARE_POINTS;
