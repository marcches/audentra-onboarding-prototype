/**
 * The onboarding spine: three Phases and a Closing.
 *
 * This used to be a flat list of seven steps, and the rail counted it. The flat
 * list is still here — the router, the summary and every "which screen comes
 * next" question want it — but it is now *derived* from the grouping rather
 * than kept beside it. Two lists that have to agree is the bug this shape
 * exists to make impossible.
 *
 * The Closing is a group but deliberately not a Phase: Review & sign and
 * Deposit confirm what the student already gave rather than asking for
 * something new, so they sit outside the three-Phase count and outside the
 * segmented progress bar on mobile. See `CONTEXT.md` and ADR-0001.
 */
export type StepId =
  | "offer"
  | "identity-contact"
  | "health"
  | "housing"
  | "campus-life"
  | "review"
  | "deposit";

export type PhaseId = "deciding" | "about-you" | "on-campus";
export type GroupId = PhaseId | "closing";

/**
 * One screen. `label` is the Quest name — what the student is invited to
 * finish — and it is the only name the UI ever shows for it.
 */
export type Step = {
  id: StepId;
  path: string;
  label: string;
  blurb: string;
  /**
   * Approximations, not measured data. Never rendered on a Quest row: the rail
   * shows time on the Phase, where it helps before the work rather than after
   * it. This is the raw material for that sum and nothing else.
   */
  timeEstimateMinutes: number;
  /** Whether the step blocks Continue on its own screen — not a claim about the whole flow. */
  required: boolean;
  /**
   * Points awarded on submission — a quick, plausible pass modelled loosely on
   * how U.S. university orientation checklists scale points, not authoritative.
   * Structurally correct so real values can replace these without a shape
   * change. Never rendered beside an unfinished Quest; see `points.ts`.
   */
  points: number;
};

export type Group = {
  id: GroupId;
  /**
   * `phase` rows are numbered and counted; `closing` is drawn apart from them.
   * A boolean called `isPhase` would have read the same and told the rail
   * nothing about how to style the odd one out.
   */
  kind: "phase" | "closing";
  label: string;
  blurb: string;
  steps: Step[];
};

export type Phase = Group & { id: PhaseId; kind: "phase" };

export const phases: Phase[] = [
  {
    id: "deciding",
    kind: "phase",
    label: "Deciding",
    blurb: "Say yes, and the rest opens up",
    steps: [
      {
        id: "offer",
        path: "/onboarding/offer",
        label: "Your offer",
        blurb: "Say yes or no",
        timeEstimateMinutes: 1,
        required: true,
        points: 10,
      },
    ],
  },
  {
    id: "about-you",
    kind: "phase",
    label: "About you",
    blurb: "Who you are, and who we call",
    steps: [
      {
        /* Renamed from `about-you`, which now names the Phase above it. A Phase
           can be described loosely; a form cannot — see `CONTEXT.md`. */
        id: "identity-contact",
        path: "/onboarding/identity-contact",
        label: "Identity & contact",
        blurb: "Identity, address, emergency contact, family access",
        timeEstimateMinutes: 6,
        required: true,
        points: 50,
      },
      {
        id: "health",
        path: "/onboarding/health",
        label: "Health information",
        blurb: "Accommodations and immunisations",
        timeEstimateMinutes: 1,
        required: false,
        points: 10,
      },
    ],
  },
  {
    id: "on-campus",
    kind: "phase",
    label: "Your life on campus",
    blurb: "Where you'll live, and who with",
    steps: [
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
    ],
  },
];

/** Not a fourth Phase. Confirming what you already gave, and securing it. */
export const closing: Group = {
  id: "closing",
  kind: "closing",
  label: "Closing",
  blurb: "Check it, sign it, secure it",
  steps: [
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
  ],
};

/** Everything the rail draws, top to bottom. */
export const groups: Group[] = [...phases, closing];

/** The flow, flattened. Derived — never edited by hand. */
export const steps: Step[] = groups.flatMap((group) => group.steps);

export const stepCount = steps.length;

/** Three. The Closing is not one of them, and nothing should count it as one. */
export const phaseCount = phases.length;

export function stepIndex(id: StepId) {
  return steps.findIndex((step) => step.id === id);
}

export function stepById(id: StepId): Step {
  const step = steps.find((candidate) => candidate.id === id);
  // Unreachable while `StepId` and `groups` agree, which is the point of the
  // union — but a lookup that silently returns `undefined` would push the
  // problem into whichever screen happened to render next.
  if (!step) throw new Error(`Unknown step: ${id}`);
  return step;
}

export function nextStep(id: StepId): Step | undefined {
  return steps[stepIndex(id) + 1];
}

export function previousStep(id: StepId): Step | undefined {
  const index = stepIndex(id);
  return index > 0 ? steps[index - 1] : undefined;
}

/** The group a Quest belongs to — a Phase, or the Closing. */
export function groupOf(id: StepId): Group {
  const group = groups.find((candidate) => candidate.steps.some((step) => step.id === id));
  if (!group) throw new Error(`Step belongs to no group: ${id}`);
  return group;
}

/** The Phase a Quest belongs to, or `undefined` if it belongs to the Closing. */
export function phaseOf(id: StepId): Phase | undefined {
  const group = groupOf(id);
  return group.kind === "phase" ? (group as Phase) : undefined;
}

/** 1-based, for the segmented bar. `undefined` for the Closing, which has no number. */
export function phaseNumber(id: GroupId): number | undefined {
  const index = phases.findIndex((phase) => phase.id === id);
  return index === -1 ? undefined : index + 1;
}

/**
 * A Phase's time estimate is the sum of its Quests'. The client asked for a
 * figure; showing it at Phase level rather than on every row is what keeps it
 * information instead of noise.
 */
export function groupMinutes(group: Group): number {
  return group.steps.reduce((total, step) => total + step.timeEstimateMinutes, 0);
}

/** A Phase is required if anything inside it is. Skipping it is not on offer. */
export function groupRequired(group: Group): boolean {
  return group.steps.some((step) => step.required);
}
