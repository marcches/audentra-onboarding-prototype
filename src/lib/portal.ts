import type { PortalContext } from "@/lib/portal-store";
import { type StepId, stepById } from "@/lib/steps";
import { completedSteps } from "@/lib/store";

/**
 * The portal's spine: twelve Requirements, four derived states, one decay rule
 * and three orderings.
 *
 * Sibling to `steps.ts` and modelled on it — a data module that **derives**
 * rather than duplicates. The flat list comes from the grouping, every "N of M"
 * in the portal comes from here, and nothing in a component counts anything for
 * itself. Two lists that have to agree is the bug this shape exists to make
 * impossible, and it is the same bug one surface across.
 *
 * What it deliberately does not own: what a Point is *worth*. `points.ts`
 * answers that and has no opinion about time. Giving it one would put the reward
 * ladder and the deadline clock in the same module, and the first thing to break
 * would be the Bookstore ladder — which the gate also draws.
 *
 * See `docs/context/portal.md` for the vocabulary and ADR 0013 for the Balance.
 */

/* -------------------------------------------------------------------------
   Today
   ---------------------------------------------------------------------- */

/**
 * **Today is a fixture.** Nothing in this module calls `Date.now()`.
 *
 * A prototype whose Points decay is a prototype whose screenshots change while
 * nobody is looking: one taken in November and one taken in March would show
 * different numbers on the same screen, and every test that touched a value
 * would depend on the day it ran. So the clock is a constant, every other date
 * in the file is written relative to it, and the whole spine takes `today` as a
 * parameter defaulting to it.
 *
 * Chosen so that the fixture sits inside the offer's own year (`Fall 2027`),
 * seventeen days before teaching begins — which is where a student accepting a
 * place in August actually stands, and which is the window every deadline below
 * is written into.
 */
export const TODAY = "2027-08-08";

const DAY_MS = 86_400_000;

/** Midnight UTC of an ISO date. Parsing a fixture is not reading a clock. */
function atMidnight(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

/** Whole days from one ISO date to another. Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((atMidnight(to) - atMidnight(from)) / DAY_MS);
}

/** The same date, `days` later, as an ISO date. */
export function addDays(iso: string, days: number): string {
  return new Date(atMidnight(iso) + days * DAY_MS).toISOString().slice(0, 10);
}

/* -------------------------------------------------------------------------
   The unit of work
   ---------------------------------------------------------------------- */

export type RequirementId =
  | "secure-your-place"
  | "health-records"
  | "health-insurance"
  | "find-your-people"
  | "meal-plan"
  | "move-in-window"
  | "final-transcript"
  | "register-orientation"
  | "register-courses"
  | "meet-adviser"
  | "financial-aid"
  | "student-id-photo";

/**
 * Which part of a student's life a Requirement belongs to.
 *
 * The gate's Phase and Quest names are reused where they apply — `Your offer`,
 * `About you`, `Campus life` — which is what the reference prototype does and
 * what makes the two surfaces read as one product rather than as two systems
 * with a login between them.
 */
export type RequirementCategory =
  | "Your offer"
  | "About you"
  | "Academics"
  | "Financials"
  | "Health & wellness"
  | "Campus life";

/**
 * One thing the institution needs from the student after the offer is accepted.
 *
 * It carries **no state and no current value**. Both are derived: a stored state
 * and a stored prerequisite list are two facts that can disagree, and the one
 * that would win is the stale one. See `stateOf` and `valueOn`.
 */
export type Requirement = {
  id: RequirementId;
  /** Where the work happens. A carried-over Requirement points back at the gate. */
  path: string;
  /** The Quest name — what the student is invited to finish. */
  label: string;
  /** One line, in the student's terms, of what is actually being asked. */
  blurb: string;
  /**
   * The primary action's label, and it carries a verb.
   *
   * Separate from `label` because half the Quest names are nouns — `Final
   * transcript`, `Health insurance` — and a button reading `Health insurance`
   * tells the student what the thing is called rather than what pressing it
   * does. One obvious action per Requirement, named as an instruction.
   */
  action: string;
  category: RequirementCategory;
  /**
   * The office that owns it — the Registrar, Student Accounts, Housing
   * Services. Shown when a Requirement is Under review, because a state the
   * student cannot act on still owes them the name of whoever is holding it.
   * It is also the most institutional fact a Requirement carries: work in a
   * university belongs to an office, not to a queue.
   */
  office: string;
  /** The day it becomes Available, and the day the Decay clock starts. */
  availableOn: string;
  /** The day the institution needs it by. */
  deadline: string;
  minutes: number;
  /** What it was worth on its Availability date. Never shown; see `valueOn`. */
  points: number;
  /** Other Requirements that must be Complete first. */
  prerequisites: RequirementId[];
  /**
   * What is being waited on when the blocker is not another Requirement — an
   * assignment made by the institution rather than work the student can do.
   * Named on screen, because a named prerequisite is an instruction and a
   * padlock is an obstacle.
   */
  availableWhen?: string;
  /**
   * The Quest in the gate this Requirement carries over from, if any. Whether
   * it *is* carried over is a question about the gate's store, not about this
   * field — a student who finished the Quest simply has a Complete Requirement.
   */
  from?: StepId;
};

/**
 * The twelve, grouped by category. The flat list below is derived from this and
 * never edited beside it.
 *
 * Nine are new and three carry over from Quests the gate lets a student skip.
 * `financial-aid` and `register-orientation` are the client's own opening
 * sentences on the call — *verificação financeira* and *registro para
 * orientação* — rather than two rows invented to round the number up.
 *
 * **Every date here is measured against `academicCalendar`**, and that is a
 * correction rather than a convention. The first pass wrote deadlines to make
 * one card read `100 days`, which put `Secure your place` on Nov 16 — twelve
 * weeks after the student would have started classes. So the twelve are
 * re-based into the run-up to term: available now or soon, wanted before
 * teaching begins on Aug 25, and ordered against the things they are actually
 * for — aid and the transcript before the bill, the meal plan and the move-in
 * window before move-in, the interest list before the Involvement Fair,
 * registration before the first lecture. `portal.test.ts` holds both halves of
 * that so a future date cannot be nudged to make a screenshot read well.
 *
 * One visible consequence, and it is the honest one: at seventeen days out
 * nothing is `steady`, so every card carries an urgency chip. That is what the
 * fortnight before term looks like. The band is not dead — `urgencyOf` takes
 * the day as a parameter — it simply has nothing to say on this one.
 */
export const requirementGroups: readonly {
  category: RequirementCategory;
  requirements: readonly Requirement[];
}[] = [
  {
    category: "Your offer",
    requirements: [
      {
        /* The top of Smart order at fixture time, and the one Requirement that
           opens another: a move-in window cannot be chosen before the place is
           secured. It is worth 100 and became available today, which is what
           makes the card read `100 pts today · 99 tomorrow`. Due the day before
           the first term's bill, because the deposit is credited against it. */
        id: "secure-your-place",
        office: "Student Accounts",
        action: "Secure your place",
        path: "/onboarding/deposit",
        label: "Secure your place",
        blurb: "Pay the deposit, arrange to pay it later, or ask for a waiver.",
        category: "Your offer",
        availableOn: TODAY,
        deadline: "2027-08-14",
        minutes: 4,
        points: 100,
        prerequisites: [],
        from: "deposit",
      },
    ],
  },
  {
    category: "Health & wellness",
    requirements: [
      {
        id: "health-records",
        office: "Health Services",
        action: "Share your records",
        path: "/onboarding/health",
        label: "Share your health records",
        blurb: "Immunisations, and anything you want us to accommodate.",
        category: "Health & wellness",
        availableOn: TODAY,
        deadline: "2027-08-19",
        minutes: 6,
        points: 60,
        prerequisites: [],
        from: "health",
      },
      {
        id: "health-insurance",
        office: "Health Services",
        action: "Choose your cover",
        path: "/portal/enrollment/health-insurance",
        label: "Health insurance",
        blurb: "Join the student plan, or show us the cover you already have.",
        category: "Health & wellness",
        availableOn: "2027-08-01",
        deadline: "2027-08-18",
        minutes: 7,
        points: 60,
        prerequisites: [],
      },
    ],
  },
  {
    category: "Campus life",
    requirements: [
      {
        id: "find-your-people",
        office: "Student Life",
        action: "Browse organisations",
        path: "/onboarding/campus-life",
        label: "Find your people",
        blurb: "Mark what you might join before the Involvement Fair.",
        category: "Campus life",
        availableOn: TODAY,
        deadline: "2027-08-24",
        minutes: 5,
        points: 40,
        prerequisites: [],
        from: "campus-life",
      },
      {
        id: "meal-plan",
        office: "Dining Services",
        action: "Choose a plan",
        path: "/portal/enrollment/meal-plan",
        label: "Choose your meal plan",
        blurb: "Three plans, and you can change once before term starts.",
        category: "Campus life",
        availableOn: TODAY,
        deadline: "2027-08-20",
        minutes: 6,
        points: 50,
        prerequisites: [],
      },
      {
        /* Blocked twice over, and both are true: the place has to be secured,
           and Housing Services has to have assigned a room. The spec's table
           names the second; the first is what makes `Secure your place` the
           Requirement that opens the most doors. */
        id: "move-in-window",
        office: "Housing Services",
        action: "Choose a window",
        path: "/portal/enrollment/move-in-window",
        label: "Choose your move-in window",
        blurb: "Pick the half-day you arrive, once your room is assigned.",
        category: "Campus life",
        availableOn: "2027-08-12",
        deadline: "2027-08-19",
        minutes: 4,
        points: 40,
        prerequisites: ["secure-your-place"],
        availableWhen: "your housing assignment",
      },
    ],
  },
  {
    category: "Academics",
    requirements: [
      {
        id: "final-transcript",
        office: "the Registrar",
        action: "Check what we hold",
        path: "/portal/enrollment/final-transcript",
        label: "Final transcript",
        blurb: "Your school sends it; the Registrar checks it against your offer.",
        category: "Academics",
        availableOn: "2027-08-01",
        deadline: "2027-08-13",
        minutes: 3,
        points: 50,
        prerequisites: [],
      },
      {
        id: "register-orientation",
        office: "Student Life",
        action: "Register",
        path: "/portal/enrollment/register-orientation",
        label: "Register for orientation",
        blurb: "Two days before term. Pick the session that suits you.",
        category: "Academics",
        availableOn: "2027-08-04",
        deadline: "2027-08-17",
        minutes: 4,
        points: 70,
        prerequisites: [],
      },
      {
        id: "register-courses",
        office: "the Registrar",
        action: "Register for courses",
        path: "/portal/enrollment/register-courses",
        label: "Register for courses",
        blurb: "Your first term's timetable, once your transcript clears.",
        category: "Academics",
        availableOn: TODAY,
        deadline: "2027-08-21",
        minutes: 15,
        points: 90,
        prerequisites: ["final-transcript"],
      },
      {
        id: "meet-adviser",
        office: "Academic Advising",
        action: "Book a meeting",
        path: "/portal/enrollment/meet-adviser",
        label: "Meet your academic adviser",
        blurb: "Half an hour, once the department has assigned you one.",
        category: "Academics",
        availableOn: "2027-08-14",
        deadline: "2027-08-24",
        minutes: 20,
        points: 50,
        prerequisites: [],
        availableWhen: "your programme adviser",
      },
    ],
  },
  {
    category: "Financials",
    requirements: [
      {
        id: "financial-aid",
        office: "Financial Aid",
        action: "Verify your aid",
        path: "/portal/enrollment/financial-aid",
        label: "Verify your financial aid",
        blurb: "Confirm the award letter and the documents behind it.",
        category: "Financials",
        availableOn: "2027-08-01",
        deadline: "2027-08-12",
        minutes: 10,
        points: 80,
        prerequisites: [],
      },
    ],
  },
  {
    category: "About you",
    requirements: [
      {
        /* Available since before the fixture's today, and far enough back that
           Decay has already taken it to its Floor — which is the state that
           proves Points at risk reaches zero rather than running to nothing. */
        id: "student-id-photo",
        office: "Campus Card Office",
        action: "Upload a photo",
        path: "/portal/enrollment/student-id-photo",
        label: "Your student ID photo",
        blurb: "One photograph, to the same rules as a passport.",
        category: "About you",
        availableOn: "2027-07-20",
        deadline: "2027-08-22",
        minutes: 3,
        points: 30,
        prerequisites: [],
      },
    ],
  },
];

/** The twelve, flattened. Derived — never edited by hand. */
export const requirements: readonly Requirement[] = requirementGroups.flatMap(
  (group) => group.requirements,
);

/** How many there are. Every "N of M" in the portal derives from here. */
export const requirementCount = requirements.length;

export function requirementById(id: RequirementId): Requirement {
  const found = requirements.find((requirement) => requirement.id === id);
  // Unreachable while `RequirementId` and the groups agree, which is the point
  // of the union — but a lookup returning `undefined` would push the problem
  // into whichever card happened to render next.
  if (!found) throw new Error(`Unknown requirement: ${id}`);
  return found;
}

/**
 * Where a Requirement sits in the declared order. The last key of every
 * comparator below, so an ordering is **total**: two Requirements that tie on
 * every meaningful key still have one answer, and it is the same answer on
 * every engine rather than whatever the sort happened to do.
 */
function declaredIndex(id: RequirementId): number {
  return requirements.findIndex((requirement) => requirement.id === id);
}

/* -------------------------------------------------------------------------
   State
   ---------------------------------------------------------------------- */

/**
 * Four, exhaustive and mutually exclusive. A Requirement is in exactly one at a
 * time, and none of them is stored.
 */
export type RequirementState = "complete" | "under-review" | "upcoming" | "available";

/**
 * Everything the portal is Complete on, gate included.
 *
 * The carried-over three are Complete when their gate Quest is — the portal
 * *reads* the gate's store and never writes to it, which is the one-way
 * relationship `CONTEXT-MAP.md` records. Breaking it is how a student's
 * finished onboarding starts changing under them.
 */
export function completedRequirements({
  gate: gateState,
  portal,
}: PortalContext): Set<RequirementId> {
  const gate = new Set(completedSteps(gateState));
  const done = new Set<RequirementId>(portal.completed);
  for (const requirement of requirements) {
    if (requirement.from && gate.has(requirement.from)) done.add(requirement.id);
  }
  return done;
}

/**
 * Which of the four a Requirement is in, derived from the store and the date.
 *
 * The order of the branches is the definition: Complete wins over everything,
 * a submission the institution holds wins over availability, and Upcoming is
 * every unmet prerequisite or unreached date. Available is the remainder, which
 * is what makes the four exhaustive without a fifth "unknown".
 */
export function stateOf(
  requirement: Requirement,
  state: PortalContext,
  today: string = TODAY,
): RequirementState {
  const done = completedRequirements(state);
  if (done.has(requirement.id)) return "complete";
  if (state.portal.underReview.includes(requirement.id)) return "under-review";
  if (daysBetween(today, requirement.availableOn) > 0) return "upcoming";
  if (requirement.prerequisites.some((id) => !done.has(id))) return "upcoming";
  return "available";
}

/** Every Requirement in one state, in declared order. */
export function requirementsInState(
  target: RequirementState,
  state: PortalContext,
  today: string = TODAY,
): Requirement[] {
  return requirements.filter((requirement) => stateOf(requirement, state, today) === target);
}

/**
 * What an Upcoming Requirement is waiting on, named rather than locked.
 *
 * Unmet prerequisites by their Quest names, then the institution's own side of
 * it. A padlock says "no"; this says what would make it a yes.
 */
export function waitingOn(requirement: Requirement, state: PortalContext): string[] {
  const done = completedRequirements(state);
  const blockers = requirement.prerequisites
    .filter((id) => !done.has(id))
    .map((id) => requirementById(id).label);
  if (requirement.availableWhen) blockers.push(requirement.availableWhen);
  return blockers;
}

/** Complete out of the twelve, for the one progress figure the portal shows. */
export function portalProgress(state: PortalContext): {
  complete: number;
  total: number;
  percent: number;
} {
  const complete = completedRequirements(state).size;
  return {
    complete,
    total: requirementCount,
    percent: Math.round((complete / requirementCount) * 100),
  };
}

/* -------------------------------------------------------------------------
   Decay
   ---------------------------------------------------------------------- */

/**
 * The least Decay can take a Requirement to: half its Original value, in whole
 * Points.
 *
 * Without a Floor a student who is a hundred days late opens the portal to a row
 * of noughts and the reward system has become a bill.
 */
export function floorValue(requirement: Requirement): number {
  return Math.round(requirement.points / 2);
}

/**
 * What a Requirement is worth on a given day: one Point less for each day since
 * it became Available, never below the Floor and never before the clock starts.
 *
 * The client's one non-negotiable, and the only part of the design specified
 * outright: *hoje é 100, amanhã 99*.
 */
export function valueOn(requirement: Requirement, day: string = TODAY): number {
  const elapsed = Math.max(0, daysBetween(requirement.availableOn, day));
  return Math.max(floorValue(requirement), requirement.points - elapsed);
}

/** Today's value, and tomorrow's — the pair the card shows literally. */
export function valueToday(requirement: Requirement, today: string = TODAY): number {
  return valueOn(requirement, today);
}

export function valueTomorrow(requirement: Requirement, today: string = TODAY): number {
  return valueOn(requirement, addDays(today, 1));
}

/**
 * What a day of not acting costs — one Point, or nothing once the Floor is
 * reached. It is also the second key of Smart order, which is what stops a
 * stale Requirement climbing the list forever.
 *
 * Never rendered as a running tally of what has already been lost. Displaying
 * that turns a reward into a reprimand, which is why the Original value is held
 * and never shown.
 */
export function pointsAtRisk(requirement: Requirement, today: string = TODAY): number {
  return valueToday(requirement, today) - valueTomorrow(requirement, today);
}

/* -------------------------------------------------------------------------
   Deadlines
   ---------------------------------------------------------------------- */

/**
 * `Aug 14` — the deadline as a date, shown beside the distance to it.
 *
 * Both, always: a date alone makes a student do arithmetic to feel urgency, and
 * a distance alone gives them nothing to write in a diary. `UTC` because every
 * date in this module is a fixture at midnight UTC, and rendering it in the
 * machine's zone would show the day before to half of North America.
 */
export function formatDeadlineShort(iso: string): string {
  return new Date(atMidnight(iso)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Days from today to the deadline. Negative once it has passed. */
export function daysToDeadline(requirement: Requirement, today: string = TODAY): number {
  return daysBetween(today, requirement.deadline);
}

/**
 * How loudly the deadline should read. Three steps rather than a countdown on
 * every row: a card that shouts about ninety days away teaches the student to
 * ignore the one that does not.
 */
export type Urgency = "overdue" | "urgent" | "soon" | "steady";

export function urgencyOf(requirement: Requirement, today: string = TODAY): Urgency {
  const days = daysToDeadline(requirement, today);
  if (days < 0) return "overdue";
  if (days <= 7) return "urgent";
  if (days <= 21) return "soon";
  return "steady";
}

/* -------------------------------------------------------------------------
   Unlocks
   ---------------------------------------------------------------------- */

/**
 * How many Requirements completing this one releases, **counting
 * transitively**: a Requirement that opens one which itself opens two has
 * opened three.
 *
 * Counting only direct dependents would make the badge understate the thing it
 * exists to justify — `Best next step` is a claim the student can check, and a
 * claim that undercounts is as wrong as one that inflates.
 */
export function unlockCount(
  id: RequirementId,
  list: readonly Requirement[] = requirements,
): number {
  const released = new Set<RequirementId>();
  const walk = (current: RequirementId) => {
    for (const requirement of list) {
      if (released.has(requirement.id)) continue;
      if (!requirement.prerequisites.includes(current)) continue;
      released.add(requirement.id);
      walk(requirement.id);
    }
  };
  walk(id);
  return released.size;
}

/* -------------------------------------------------------------------------
   Ordering
   ---------------------------------------------------------------------- */

export type Ordering = "smart" | "deadline" | "quick";

/**
 * **Smart order is a comparator, not a score.** Unlocks descending, then Points
 * at risk descending, then time ascending, then the declared order.
 *
 * A single weighted score was rejected twice over: the weights would be
 * invented, and the badge on the first card has to be able to say *why* it is
 * first. "Opens 1 more" is checkable; "score 0.82" is not.
 *
 * Upcoming Requirements are not ranked last here — they are excluded from the
 * ordering entirely, by never being in the list handed to it. They are a
 * different group on screen, so they never compete for the top.
 */
export function compareSmart(a: Requirement, b: Requirement, today: string = TODAY): number {
  return (
    unlockCount(b.id) - unlockCount(a.id) ||
    pointsAtRisk(b, today) - pointsAtRisk(a, today) ||
    a.minutes - b.minutes ||
    declaredIndex(a.id) - declaredIndex(b.id)
  );
}

/** Soonest deadline first. The arrangement for "what will bite me". */
export function compareDeadline(a: Requirement, b: Requirement, today: string = TODAY): number {
  return (
    daysToDeadline(a, today) - daysToDeadline(b, today) ||
    a.minutes - b.minutes ||
    declaredIndex(a.id) - declaredIndex(b.id)
  );
}

/** Shortest first. The arrangement that answers "I have four minutes". */
export function compareQuick(a: Requirement, b: Requirement, today: string = TODAY): number {
  return (
    a.minutes - b.minutes ||
    pointsAtRisk(b, today) - pointsAtRisk(a, today) ||
    declaredIndex(a.id) - declaredIndex(b.id)
  );
}

const COMPARATORS: Record<Ordering, typeof compareSmart> = {
  smart: compareSmart,
  deadline: compareDeadline,
  quick: compareQuick,
};

export function ordered(
  list: readonly Requirement[],
  ordering: Ordering = "smart",
  today: string = TODAY,
): Requirement[] {
  return [...list].sort((a, b) => COMPARATORS[ordering](a, b, today));
}

/** What the student can act on now, best first. */
export function availableInOrder(
  state: PortalContext,
  ordering: Ordering = "smart",
  today: string = TODAY,
): Requirement[] {
  return ordered(requirementsInState("available", state, today), ordering, today);
}

/* -------------------------------------------------------------------------
   What the gate left behind
   ---------------------------------------------------------------------- */

/**
 * The Requirements that exist because the student skipped the equivalent Quest
 * while accepting their offer.
 *
 * Derived from the gate's store, never stored here. A student who skipped
 * nothing produces none — which is what makes the reassurance on the Dashboard
 * conditional rather than an empty block inventing a problem nobody has.
 */
export function carriedOver({ gate: gateState }: PortalContext): Requirement[] {
  const gate = new Set(completedSteps(gateState));
  return requirements.filter((requirement) => requirement.from && !gate.has(requirement.from));
}

/** The Quest names, in the gate's own words, for the reassurance sentence. */
export function carriedOverLabels(state: PortalContext): string[] {
  return carriedOver(state).map((requirement) =>
    requirement.from ? stepById(requirement.from).label : requirement.label,
  );
}
