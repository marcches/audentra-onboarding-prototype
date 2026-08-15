/**
 * The onboarding spine: three Phases, a Closing, and what comes after.
 *
 * This used to be a flat list, and the rail counted it. The flat list is still
 * here — the router, the summary and every "which screen comes next" question
 * want it — but it is *derived* from the grouping rather than kept beside it.
 * Two lists that have to agree is the bug this shape exists to make impossible.
 *
 * The Closing is a group but deliberately not a Phase: Review & sign and
 * Deposit confirm what the student already gave rather than asking for
 * something new, so they sit outside the three-Phase count and outside the
 * segmented progress bar on mobile. `after` is the same idea at the other end —
 * Enrolled is arrived at, not worked through. See `CONTEXT.md` and ADR-0001.
 *
 * What changed in the rebuild: `Identity & contact` is gone. It was one Step
 * carrying four subjects and 1068 lines, and the client described the defect
 * exactly — "a gente começou falando de nome, falou de contato, aí voltou a
 * falar de nome, falou de contato de novo." Two rounds of accordion work hid it
 * rather than removed it. It is now three Steps, each one subject, and Health
 * information moved up beside them so the flow's three uploads are adjacent.
 *
 * The old problem was never the count. It was the distribution: one Step of six
 * minutes beside five of one. Every Step here is levelled at one to three.
 */

export type StepId =
  | "offer"
  | "who-you-are"
  | "health"
  | "where-you-live"
  | "who-we-call"
  | "housing"
  | "campus-life"
  | "review"
  | "deposit"
  | "enrolled";

export type PhaseId = "deciding" | "about-you" | "on-campus";
export type GroupId = PhaseId | "closing" | "after";

/**
 * The Student status answer, which decides two things: which Identity document
 * is asked for, and whether `Where you live now` exists at all.
 *
 * It lives here rather than in the fixtures because the spine reads it. An
 * international student has no U.S. permanent address to give, so the Step is
 * *absent* from their flow — not shown and explained, not skipped in the rail.
 * Laura on the call: "se não é residente ou cidadão dos Estados Unidos, não
 * precisa de endereço, já arranca fora."
 */
export type StudentStatus = "us-citizen" | "permanent-resident" | "international";

/** Unanswered is the ordinary state at the start of the flow, not an error. */
export type StudentStatusAnswer = StudentStatus | "";

/**
 * The five screen archetypes. A route composes from its archetype's parts
 * rather than freely, and the archetype comes from the spine rather than from
 * a prop the route chooses — which is what "a route cannot compose outside
 * one" has to mean if it is to mean anything.
 *
 * - `decision` — occupies exactly one viewport at any width. If it does not
 *   fit it loses content, not the constraint. The documented exception is
 *   `review`, where the object of the decision is a legally binding document:
 *   the document scrolls inside its own Panel and the signing bar is fixed
 *   outside it.
 * - `form` — a measured column of Panels. Scrolls.
 * - `catalogue` — the collection *is* the screen, so it sits on the Ground at
 *   full width. One of the three documented Ground exceptions.
 * - `review` — reads answers back before asking for a signature.
 * - `celebration` — hands over an object. No rail, no action bar.
 */
export type Archetype = "decision" | "form" | "catalogue" | "review" | "celebration";

/**
 * One screen. `label` is the Quest name — what the student is invited to
 * finish — and it is the only name the UI ever shows for it.
 */
export type Step = {
  id: StepId;
  path: string;
  label: string;
  blurb: string;
  archetype: Archetype;
  /**
   * Levelled at one to three. Rendered on the Quest row in the rail and on
   * Review & sign, which revokes the previous round's rule that time never
   * appears on a Quest line: Klaviyo puts "About 3 minutes" on a sub-step and
   * HoneyBook puts minutes on every row of a checklist, and with Steps this
   * short the figure reads as "this is quick" rather than as a threat.
   *
   * It disappears from a row once that row is complete — a time estimate on
   * finished work is a fact nobody can act on.
   */
  minutes: number;
  /** Whether the Step blocks Continue on its own screen. Shown in the rail. */
  required: boolean;
  /**
   * What finishing this Quest is worth. Shown as a *price* on the Quest being
   * worked and the one after it, and as the *receipt* once earned — the same
   * tag doing both jobs. Never a price list of the whole flow; see `points.ts`.
   *
   * FIXTURE. Modelled loosely on how U.S. orientation checklists scale points,
   * structurally correct so real values replace these without a shape change.
   */
  points: number;
  /**
   * Which Student statuses this Step applies to. Absent means all of them.
   * An unanswered status keeps every Step in the spine: the rail must not
   * shorten itself before the student has said anything.
   */
  appliesTo?: StudentStatus[];
};

export type Group = {
  id: GroupId;
  /**
   * `phase` rows are numbered and counted. `closing` and `after` are drawn
   * apart from them. A boolean called `isPhase` would have read the same and
   * told the rail nothing about how to style the two odd ones out.
   */
  kind: "phase" | "closing" | "after";
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
        archetype: "decision",
        minutes: 2,
        required: true,
        points: 25,
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
        id: "who-you-are",
        path: "/onboarding/who-you-are",
        label: "Who you are",
        blurb: "Your name, your number, and one document",
        archetype: "form",
        minutes: 3,
        required: true,
        points: 30,
      },
      {
        /* Immediately after Who you are, so the flow's three uploads — Identity
           document, medical documentation, Immunization record — are adjacent
           rather than scattered across two Phases. Deputy and Revolut both give
           document collection its own rail entry for the same reason. */
        id: "health",
        path: "/onboarding/health",
        label: "Health information",
        blurb: "Accommodations and immunisations",
        archetype: "form",
        minutes: 2,
        required: false,
        points: 15,
      },
      {
        id: "where-you-live",
        path: "/onboarding/where-you-live",
        label: "Where you live now",
        blurb: "Your permanent address",
        archetype: "form",
        minutes: 2,
        required: true,
        points: 20,
        /* Absent for an international student. Not shown with an explanation,
           not skipped in the rail: absent. */
        appliesTo: ["us-citizen", "permanent-resident"],
      },
      {
        id: "who-we-call",
        path: "/onboarding/who-we-call",
        label: "Who we call, who can see",
        blurb: "Emergency contact and family access",
        archetype: "form",
        minutes: 2,
        required: true,
        points: 20,
      },
    ],
  },
  {
    id: "on-campus",
    kind: "phase",
    label: "Your life on campus",
    blurb: "Where you'll live, and what you'll join",
    steps: [
      {
        id: "housing",
        path: "/onboarding/housing",
        label: "Housing",
        blurb: "Where you'll live",
        archetype: "catalogue",
        minutes: 3,
        required: true,
        points: 30,
      },
      {
        id: "campus-life",
        path: "/onboarding/campus-life",
        label: "Campus life",
        blurb: "What you might join",
        archetype: "catalogue",
        minutes: 3,
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
      blurb: "Your answers, then the agreement",
      archetype: "review",
      minutes: 3,
      required: true,
      points: 35,
    },
    {
      /* One rail entry with three screens inside it. A checkout is one thing to
         anyone who has bought something online, and three entries would make
         the Closing larger than a Phase — which is the distinction
         `CONTEXT.md` protects. */
      id: "deposit",
      path: "/onboarding/deposit",
      label: "Deposit",
      blurb: "Secures your place",
      archetype: "form",
      minutes: 3,
      required: false,
      points: 25,
    },
  ],
};

/**
 * Where the flow ends. In the spine because the rail should show the
 * destination — a reward with nowhere to go is the scoreboard ADR-0002 exists
 * to prevent — and drawn apart from the Closing because it is arrived at rather
 * than worked through.
 */
export const after: Group = {
  id: "after",
  kind: "after",
  label: "After",
  blurb: "What you walk away with",
  steps: [
    {
      id: "enrolled",
      path: "/done",
      label: "Enrolled",
      blurb: "Your student card and what you earned",
      archetype: "celebration",
      minutes: 0,
      required: false,
      /* Zero on purpose: this Step is not completed, it is reached. Everything
         it totals was earned upstream, and inventing a value for arriving would
         make the receipt add up to more than the journey. */
      points: 0,
    },
  ],
};

/** Everything the rail draws, top to bottom. */
export const groups: Group[] = [...phases, closing, after];

/** The flow, flattened. Derived — never edited by hand. */
export const steps: Step[] = groups.flatMap((group) => group.steps);

/** Three. The Closing is not one of them, and nothing should count it as one. */
export const phaseCount = phases.length;

/* -------------------------------------------------------------------------
   The spine as one student sees it
   ---------------------------------------------------------------------- */

/** Does this Step exist for a student who answered `status`? */
export function stepApplies(step: Step, status: StudentStatusAnswer): boolean {
  if (!step.appliesTo) return true;
  /* Before the question is answered every Step is still on the table. A rail
     that shortens itself the moment the flow starts would be telling the
     student their answer had already been assumed. */
  if (status === "") return true;
  return step.appliesTo.includes(status);
}

/** The groups this student actually walks, with inapplicable Steps removed. */
export function groupsFor(status: StudentStatusAnswer): Group[] {
  return groups
    .map((group) => ({ ...group, steps: group.steps.filter((step) => stepApplies(step, status)) }))
    .filter((group) => group.steps.length > 0);
}

/** The flow this student actually walks, flattened. */
export function stepsFor(status: StudentStatusAnswer): Step[] {
  return groupsFor(status).flatMap((group) => group.steps);
}

/**
 * How many Quests this student has. Every "N of M" in the UI derives from here,
 * so an international student is never told there are ten when there are nine.
 */
export function stepCountFor(status: StudentStatusAnswer): number {
  return stepsFor(status).length;
}

/**
 * The total time announced once, before the first field — Melio's "Takes 4-5
 * minutes", Binance's "verify your account in 7 minutes". Once, at the
 * entrance, and never repeated as a running remainder.
 */
export function totalMinutesFor(status: StudentStatusAnswer): number {
  return stepsFor(status).reduce((total, step) => total + step.minutes, 0);
}

/** Every Point on offer, announced once at the entrance and nowhere else. */
export function totalPointsAvailableFor(status: StudentStatusAnswer): number {
  return stepsFor(status).reduce((total, step) => total + step.points, 0);
}

/* -------------------------------------------------------------------------
   Lookups and navigation
   ---------------------------------------------------------------------- */

export function stepById(id: StepId): Step {
  const step = steps.find((candidate) => candidate.id === id);
  // Unreachable while `StepId` and `groups` agree, which is the point of the
  // union — but a lookup that silently returns `undefined` would push the
  // problem into whichever screen happened to render next.
  if (!step) throw new Error(`Unknown step: ${id}`);
  return step;
}

export function stepIndexFor(id: StepId, status: StudentStatusAnswer) {
  return stepsFor(status).findIndex((step) => step.id === id);
}

export function nextStep(id: StepId, status: StudentStatusAnswer): Step | undefined {
  const walk = stepsFor(status);
  return walk[walk.findIndex((step) => step.id === id) + 1];
}

export function previousStep(id: StepId, status: StudentStatusAnswer): Step | undefined {
  const walk = stepsFor(status);
  const index = walk.findIndex((step) => step.id === id);
  return index > 0 ? walk[index - 1] : undefined;
}

/** The group a Quest belongs to — a Phase, the Closing, or After. */
export function groupOf(id: StepId): Group {
  const group = groups.find((candidate) => candidate.steps.some((step) => step.id === id));
  if (!group) throw new Error(`Step belongs to no group: ${id}`);
  return group;
}

/** The Phase a Quest belongs to, or `undefined` if it sits outside the three. */
export function phaseOf(id: StepId): Phase | undefined {
  const group = groupOf(id);
  return group.kind === "phase" ? (group as Phase) : undefined;
}

/** 1-based, for the segmented bar. `undefined` for anything outside the Phases. */
export function phaseNumber(id: GroupId): number | undefined {
  const index = phases.findIndex((phase) => phase.id === id);
  return index === -1 ? undefined : index + 1;
}

/** A Phase is required if anything inside it is. Skipping it is not on offer. */
export function groupRequired(group: Group): boolean {
  return group.steps.some((step) => step.required);
}

/** A Phase's time estimate is the sum of its Quests'. */
export function groupMinutes(group: Group): number {
  return group.steps.reduce((total, step) => total + step.minutes, 0);
}
