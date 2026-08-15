import { describe, expect, it } from "vitest";

import {
  after,
  closing,
  groups,
  groupsFor,
  nextStep,
  phaseCount,
  phases,
  previousStep,
  type StepId,
  stepApplies,
  stepById,
  stepCountFor,
  steps,
  stepsFor,
  totalMinutesFor,
  totalPointsAvailableFor,
} from "@/lib/steps";

/**
 * The spine, tested because everything counts from it.
 *
 * `steps.ts` is the highest seam this repo has: the rail, the summary, the
 * navigation, the Points total and every "N of M" in the UI all derive from it,
 * so an assertion here covers a dozen screens at once. What it must never
 * become is a restatement of the file — the tests below are about the *shape*
 * (derivation, order, uniqueness, the conditional Step) rather than about
 * whether Housing is worth thirty points.
 */

describe("the spine", () => {
  it("has ten Steps", () => {
    expect(steps).toHaveLength(10);
  });

  it("has exactly three Phases, with the Closing and After outside them", () => {
    expect(phaseCount).toBe(3);
    expect(phases.every((phase) => phase.kind === "phase")).toBe(true);
    expect(closing.kind).toBe("closing");
    expect(after.kind).toBe("after");
    expect(groups.filter((group) => group.kind === "phase")).toHaveLength(3);
  });

  it("derives the flat list from the groups rather than keeping a second one", () => {
    // The bug this shape exists to prevent: two lists that have to agree.
    expect(steps).toEqual(groups.flatMap((group) => group.steps));
  });

  it("gives every Step a unique id and a unique path", () => {
    expect(new Set(steps.map((step) => step.id)).size).toBe(steps.length);
    expect(new Set(steps.map((step) => step.path)).size).toBe(steps.length);
  });

  it("puts Health information immediately after Who you are", () => {
    /* The whole point of moving it: the flow's three uploads are adjacent. */
    const order = steps.map((step) => step.id);
    expect(order.indexOf("health")).toBe(order.indexOf("who-you-are") + 1);
  });

  it("keeps the Deposit as one entry, not three", () => {
    expect(closing.steps.map((step) => step.id)).toEqual(["review", "deposit"]);
  });
});

describe("the metadata every Quest carries", () => {
  it("levels every worked Step at one to three minutes", () => {
    /* The old problem was never the count. It was the distribution: one Step
       of six minutes beside five of one. Enrolled is exempt — it is reached,
       not worked through. */
    for (const step of steps) {
      if (step.id === "enrolled") continue;
      expect(step.minutes, step.id).toBeGreaterThanOrEqual(1);
      expect(step.minutes, step.id).toBeLessThanOrEqual(3);
    }
  });

  it("gives every Quest that can be completed a non-zero Point value", () => {
    for (const step of steps) {
      if (step.id === "enrolled") continue;
      expect(step.points, step.id).toBeGreaterThan(0);
    }
  });

  it("gives Enrolled no Points, because arriving is not earning", () => {
    expect(stepById("enrolled").points).toBe(0);
  });

  it("assigns every Step one of the five archetypes", () => {
    const allowed = new Set(["decision", "form", "catalogue", "review", "celebration"]);
    for (const step of steps) expect(allowed.has(step.archetype), step.id).toBe(true);
  });
});

describe("Where you live now exists only for the statuses it applies to", () => {
  const addressStep = stepById("where-you-live");

  it("is absent from the spine for an international student", () => {
    expect(stepApplies(addressStep, "international")).toBe(false);
    expect(stepsFor("international").map((step) => step.id)).not.toContain("where-you-live");
  });

  it("is present for a citizen and for a permanent resident", () => {
    for (const status of ["us-citizen", "permanent-resident"] as const) {
      expect(stepsFor(status).map((step) => step.id)).toContain("where-you-live");
    }
  });

  it("is still present before the question has been answered", () => {
    /* A rail that shortened itself at the start would be telling the student
       their answer had already been assumed. */
    expect(stepsFor("").map((step) => step.id)).toContain("where-you-live");
  });

  it("changes every count derived from the spine", () => {
    expect(stepCountFor("us-citizen")).toBe(10);
    expect(stepCountFor("international")).toBe(9);
    expect(totalMinutesFor("international")).toBeLessThan(totalMinutesFor("us-citizen"));
    expect(totalPointsAvailableFor("international")).toBeLessThan(
      totalPointsAvailableFor("us-citizen"),
    );
  });

  it("leaves no empty group behind", () => {
    for (const group of groupsFor("international")) {
      expect(group.steps.length, group.id).toBeGreaterThan(0);
    }
  });
});

describe("navigation follows the student's own spine", () => {
  it("walks the full flow for a citizen", () => {
    expect(nextStep("health", "us-citizen")?.id).toBe("where-you-live");
    expect(previousStep("who-we-call", "us-citizen")?.id).toBe("where-you-live");
  });

  it("steps over the absent address Step for an international student", () => {
    /* The failure this prevents: Continue walking a student into a screen the
       spine says they do not have. */
    expect(nextStep("health", "international")?.id).toBe("who-we-call");
    expect(previousStep("who-we-call", "international")?.id).toBe("health");
  });

  it("has nothing before the first Step and nothing after the last", () => {
    const walk = stepsFor("us-citizen");
    const first = walk[0].id as StepId;
    const last = walk[walk.length - 1].id as StepId;
    expect(previousStep(first, "us-citizen")).toBeUndefined();
    expect(nextStep(last, "us-citizen")).toBeUndefined();
  });
});
