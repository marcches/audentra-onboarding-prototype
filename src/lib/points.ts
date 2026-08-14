import { steps } from "@/lib/steps";
import { completedSteps, type OnboardingState } from "@/lib/store";

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
