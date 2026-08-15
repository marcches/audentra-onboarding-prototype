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
    pointsAway: Math.max(0, Math.ceil(target.usd / CREDIT_PER_POINT_USD) - points),
    reached: false,
  };
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
