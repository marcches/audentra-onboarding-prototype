import { formatMoney } from "@/lib/fixtures";
import { steps } from "@/lib/steps";
import { completedSteps, type OnboardingState } from "@/lib/store";

/**
 * What a Point is worth, and what it is worth *for*.
 *
 * ADR-0002: a Point with no named destination is a scoreboard, and every
 * rewards UI worth copying (Everyday Rewards, Qantas, Ulta) shows points as
 * distance to a thing rather than as a score. Here the thing is credit at the
 * campus bookstore.
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
 * Awarded once, for using the celebration's share prompt — the one
 * point-earning action in this flow that isn't a step submission, so it can't
 * live in `steps.ts` next to the per-step values. A quick, plausible number in
 * the same spirit as the per-step points: enough to feel like a real bonus
 * next to a small step's ~10-15, not enough to dwarf About you's 50.
 */
export const SHARE_POINTS = 20;

/** The sum of points from steps actually completed — never a hardcoded max. */
export function stepPoints(state: OnboardingState): number {
  const done = new Set(completedSteps(state));
  return steps.filter((step) => done.has(step.id)).reduce((sum, step) => sum + step.points, 0);
}

export function totalPoints(state: OnboardingState): number {
  return stepPoints(state) + (state.offer.shared ? SHARE_POINTS : 0);
}
