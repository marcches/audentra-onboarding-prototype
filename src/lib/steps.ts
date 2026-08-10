/**
 * The onboarding sequence after consolidation: 8 steps became 6.
 *
 * "Emergency contacts" and "Family permissions" are gone as steps — they are
 * now sections inside About you. Everything the sidebar counts comes from this
 * one list, so the "N of 6" in the rail can never drift from reality.
 */
export type StepId = "offer" | "about-you" | "housing" | "campus-life" | "review" | "deposit";

export type Step = {
  id: StepId;
  path: string;
  label: string;
  blurb: string;
  /** False for the three steps this redesign round deliberately did not touch. */
  redesigned: boolean;
};

export const steps: Step[] = [
  {
    id: "offer",
    path: "/onboarding/offer",
    label: "Your offer",
    blurb: "Say yes or no",
    redesigned: true,
  },
  {
    id: "about-you",
    path: "/onboarding/about-you",
    label: "About you",
    blurb: "Identity, address, emergency contact, family access",
    redesigned: true,
  },
  {
    id: "housing",
    path: "/onboarding/housing",
    label: "Housing",
    blurb: "Where you'll live",
    redesigned: true,
  },
  {
    id: "campus-life",
    path: "/onboarding/campus-life",
    label: "Campus life",
    blurb: "Clubs, people, support",
    redesigned: false,
  },
  {
    id: "review",
    path: "/onboarding/review",
    label: "Review & sign",
    blurb: "Your document packet",
    redesigned: false,
  },
  {
    id: "deposit",
    path: "/onboarding/deposit",
    label: "Deposit",
    blurb: "Secure your place",
    redesigned: false,
  },
];

export const stepCount = steps.length;

export function stepIndex(id: StepId) {
  return steps.findIndex((step) => step.id === id);
}

export function nextStep(id: StepId): Step | undefined {
  return steps[stepIndex(id) + 1];
}
