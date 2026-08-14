/**
 * The onboarding sequence: 8 steps became 6 at consolidation, then 7 when
 * Health information split out of Campus life as its own optional step.
 *
 * "Emergency contacts" and "Family permissions" are gone as steps — they are
 * now sections inside About you. Everything the sidebar counts comes from this
 * one list, so the "N of 7" in the rail can never drift from reality.
 */
export type StepId =
  | "offer"
  | "about-you"
  | "housing"
  | "campus-life"
  | "health"
  | "review"
  | "deposit";

export type Step = {
  id: StepId;
  path: string;
  label: string;
  blurb: string;
  /**
   * Approximations, not measured data — a minute or two per section is fine
   * for a step, more for About you given its four sections. Review & sign
   * reads this field rather than keeping its own copy, so a change here is
   * the only place a change is ever made.
   */
  timeEstimateMinutes: number;
  /** Whether the step blocks Continue on its own screen — not a claim about the whole flow. */
  required: boolean;
  /**
   * Points awarded on submission — a quick, plausible pass modelled loosely on
   * how U.S. university orientation checklists scale points ("bookstore
   * points"-style programmes: a handful for a quick task, tens for one with
   * several parts), not authoritative. Structurally correct so real values can
   * replace these without a shape change.
   */
  points: number;
};

export const steps: Step[] = [
  {
    id: "offer",
    path: "/onboarding/offer",
    label: "Your offer",
    blurb: "Say yes or no",
    timeEstimateMinutes: 1,
    required: true,
    points: 10,
  },
  {
    id: "about-you",
    path: "/onboarding/about-you",
    label: "About you",
    blurb: "Identity, address, emergency contact, family access",
    timeEstimateMinutes: 6,
    required: true,
    points: 50,
  },
  {
    id: "housing",
    path: "/onboarding/housing",
    label: "Housing",
    blurb: "Where you'll live",
    timeEstimateMinutes: 2,
    required: true,
    points: 20,
  },
  {
    id: "campus-life",
    path: "/onboarding/campus-life",
    label: "Campus life",
    blurb: "Clubs to join",
    timeEstimateMinutes: 2,
    required: false,
    points: 15,
  },
  {
    id: "health",
    path: "/onboarding/health",
    label: "Health information",
    blurb: "Accommodations, optional",
    timeEstimateMinutes: 1,
    required: false,
    points: 10,
  },
  {
    id: "review",
    path: "/onboarding/review",
    label: "Review & sign",
    blurb: "Your enrollment agreement",
    timeEstimateMinutes: 4,
    required: true,
    points: 30,
  },
  {
    id: "deposit",
    path: "/onboarding/deposit",
    label: "Deposit",
    blurb: "Secures your place",
    timeEstimateMinutes: 1,
    required: false,
    points: 15,
  },
];

export const stepCount = steps.length;

export function stepIndex(id: StepId) {
  return steps.findIndex((step) => step.id === id);
}

export function nextStep(id: StepId): Step | undefined {
  return steps[stepIndex(id) + 1];
}
