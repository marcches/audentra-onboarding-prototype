import { describe, expect, it } from "vitest";

import {
  after,
  closing,
  groups,
  nextStep,
  phaseCount,
  phases,
  previousStep,
  type StepId,
  stepById,
  stepCount,
  steps,
  totalMinutes,
  totalStepPoints,
} from "@/lib/steps";

/**
 * The spine, tested because everything counts from it.
 *
 * `steps.ts` is the highest seam this repo has: the rail, the summary, the
 * navigation, the Points total and every "N of M" in the UI all derive from it,
 * so an assertion here covers a dozen screens at once. What it must never
 * become is a restatement of the file — the tests below are about the *shape*
 * (derivation, order, uniqueness, what the totals come to) rather than about
 * whether Housing is worth thirty points.
 *
 * It changed with the spine this round. There is no `status` branch left in it,
 * because there is no status branch left in the spine: `Where you live now` is
 * two Sections inside `Who you are` and every student walks the same nine
 * Quests (ADR 0011). The assertions that counted nine against ten went with the
 * subsystem that made the difference.
 */

describe("the spine", () => {
  it("has nine Steps", () => {
    expect(steps).toHaveLength(9);
    expect(stepCount).toBe(9);
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

  it("holds About you in three: you, your health, and other people", () => {
    /* Three Steps, three subjects. The previous round's four drew the boundary
       around fields, which is how the permanent address came to be a Quest of
       two fields; this draws it around subjects and the address drops a level
       into `Who you are`. */
    const aboutYou = phases.find((phase) => phase.id === "about-you");
    expect(aboutYou?.steps.map((step) => step.id)).toEqual([
      "who-you-are",
      "health",
      "who-we-call",
    ]);
  });

  it("has retired the address Step without retiring the address", () => {
    // The Step is gone from the spine. What it asked is asked inside `Who you
    // are`, which is why the Step it merged into is the longer one below.
    expect(steps.map((step) => step.id)).not.toContain("where-you-live");
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
  it("levels every worked Step at one to three minutes, and says why one is five", () => {
    /* The rule was written against a *distribution*, not against a length: one
       Step of six minutes that walked the student back and forth through four
       subjects, beside five Steps of one. `Who you are` is five minutes and its
       parts are adjacent — name, number, status, document, address, all one
       subject — so it is not what the rule was aimed at, and it is named here
       rather than having its number fudged down to fit. Enrolled is exempt for
       the older reason: it is reached, not worked through. */
    const LONGER_BY_DESIGN: Partial<Record<StepId, number>> = { "who-you-are": 5 };

    for (const step of steps) {
      if (step.id === "enrolled") continue;
      const allowed = LONGER_BY_DESIGN[step.id];
      if (allowed !== undefined) {
        expect(step.minutes, step.id).toBe(allowed);
        continue;
      }
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

describe("what the flow adds up to", () => {
  it("keeps the total at 215 Points, unchanged by the merge", () => {
    /* The merge moved 20 Points from a Step to a Section and 20 back into the
       Step that absorbed it. A student's total must not move because of a
       decision they did not make. */
    expect(totalStepPoints).toBe(215);
    expect(stepById("who-you-are").points).toBe(50);
  });

  it("counts one total for every student", () => {
    // There is no status to ask. That is the point: an international student is
    // never told there are nine when there are ten, or the other way round,
    // because there is only one number.
    expect(totalMinutes).toBe(steps.reduce((sum, step) => sum + step.minutes, 0));
    expect(totalStepPoints).toBe(steps.reduce((sum, step) => sum + step.points, 0));
  });
});

describe("navigation walks one flow", () => {
  it("goes Who you are, Health information, Who we call", () => {
    expect(nextStep("who-you-are")?.id).toBe("health");
    expect(nextStep("health")?.id).toBe("who-we-call");
    expect(previousStep("who-we-call")?.id).toBe("health");
  });

  it("has nothing before the first Step and nothing after the last", () => {
    const first = steps[0].id;
    const last = steps[steps.length - 1].id;
    expect(previousStep(first)).toBeUndefined();
    expect(nextStep(last)).toBeUndefined();
  });
});
