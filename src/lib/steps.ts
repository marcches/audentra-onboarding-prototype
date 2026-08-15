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
 * rather than removed it. It became four Steps, each one subject.
 *
 * **About you is now three** (ADR 0011). That reverses half of the previous
 * round on purpose, and it does not undo its reasoning: the boundary was drawn
 * around *fields* rather than around *subjects*, which is how the permanent
 * address came to be a Quest of its own — two minutes of two fields, existing
 * because an earlier round needed somewhere to put an address that varies by
 * Student status. Name, number, status, document and address are one subject
 * (*you*); emergency contact and family access are another (*other people*);
 * health is a third. Three Steps, three subjects, and the address drops a level
 * to a conditional Section inside `Who you are`.
 *
 * The old problem was never the count, and it was never the length of any one
 * Step. It was the *distribution*: one Step of six minutes that walked the
 * student back and forth through four subjects, beside five Steps of one. That
 * is what the one-to-three-minute levelling was written against. `Who you are`
 * is five minutes and its parts are adjacent, so it is not what that rule was
 * aimed at — see the test, which allows it by name and says why.
 */

export type StepId =
  | "offer"
  | "who-you-are"
  | "health"
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
 * is asked for, and whether the permanent address is asked for at all.
 *
 * It no longer decides anything about the *spine*. It used to: `Where you live
 * now` was absent from an international student's flow, which meant every count
 * in the UI had to be computed against a status and the rail could be nine rows
 * for one student and ten for another. With the address a Section inside `Who
 * you are`, the same rule applies one level down — present for a citizen and a
 * permanent resident, absent for an international student — and every student
 * walks the same nine Quests. Laura on the call: "se não é residente ou cidadão
 * dos Estados Unidos, não precisa de endereço, já arranca fora." Still true;
 * it is `addressSchemaFor()` that says so now, and `null` still means the
 * fields do not participate in validation at all.
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
   * Rendered on the Quest row in the rail and on Review & sign, which revokes
   * the previous round's rule that time never appears on a Quest line: Klaviyo
   * puts "About 3 minutes" on a sub-step and HoneyBook puts minutes on every row
   * of a checklist, and with Steps this short the figure reads as "this is
   * quick" rather than as a threat.
   *
   * One to three, except `Who you are` at five. The levelling was written to
   * kill a six-minute Step that made the student circle back through four
   * subjects; it was never a cap on length as such, and pretending a
   * five-minute Step is a three-minute one would be fudging the number to fit
   * the rule rather than fixing either.
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
        /* One subject: you. Name, number, Student status, Identity document,
           and — for a citizen or a permanent resident — the permanent address
           and the residency check, which used to be a Quest of their own. Five
           minutes and 50 Points, which is 30 + the 20 the address Step carried;
           the total available is unchanged at 215. */
        id: "who-you-are",
        path: "/onboarding/who-you-are",
        label: "Who you are",
        blurb: "Your name, your number, one document, and where you live",
        archetype: "form",
        minutes: 5,
        required: true,
        points: 50,
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
   What the flow adds up to
   ---------------------------------------------------------------------- */

/**
 * **One spine, for every student.**
 *
 * There used to be a subsystem here: `Step.appliesTo`, a `stepApplies()`
 * predicate, and a `status` parameter threaded through eight functions, so that
 * `Where you live now` could be absent from an international student's flow. It
 * existed for one row of one table. With the address a Section inside `Who you
 * are` no Step varies by Student status, so none of it has a caller, and it
 * goes rather than being kept for an imagined one — which is exactly how a
 * two-column option came to sit in this codebase with no route using it.
 *
 * The behaviour it was protecting survives one level down, in
 * `addressSchemaFor()`. What changes is that every student now counts the same
 * nine Quests, which is what the entrance announced to all of them anyway.
 */

/** How many Quests there are. Every "N of M" in the UI derives from here. */
export const stepCount = steps.length;

/**
 * The total time announced once, before the first field — Melio's "Takes 4-5
 * minutes", Binance's "verify your account in 7 minutes". Once, at the
 * entrance, and never repeated as a running remainder.
 */
export const totalMinutes = steps.reduce((total, step) => total + step.minutes, 0);

/**
 * Every Point the Quests are worth. `points.ts` adds the one award that is not
 * a Step submission and publishes the figure the entrance announces.
 */
export const totalStepPoints = steps.reduce((total, step) => total + step.points, 0);

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

/** Where a Quest sits in the walk. Private: `stepIndexFor` had no caller. */
function stepIndex(id: StepId) {
  return steps.findIndex((step) => step.id === id);
}

export function nextStep(id: StepId): Step | undefined {
  return steps[stepIndex(id) + 1];
}

export function previousStep(id: StepId): Step | undefined {
  const index = stepIndex(id);
  return index > 0 ? steps[index - 1] : undefined;
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
