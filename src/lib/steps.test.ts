import { describe, expect, it } from "vitest";

import {
  closing,
  groupMinutes,
  groupOf,
  groupRequired,
  groups,
  nextStep,
  phaseCount,
  phaseNumber,
  phaseOf,
  phases,
  previousStep,
  type StepId,
  stepById,
  stepCount,
  stepIndex,
  steps,
} from "@/lib/steps";

/**
 * The spine, as `spec.md` states it:
 *
 * | Deciding          | Your offer                            |
 * | About you         | Identity & contact · Health information |
 * | Your life on campus | Housing · Campus life               |
 * | _Closing_         | Review & sign · Deposit               |
 *
 * These tests exist because every count in the UI derives from this file. The
 * rail's "three Phases", the segmented mobile bar and the Closing's exclusion
 * from the Phase count are all the same fact, and it should only be possible to
 * get it wrong in one place.
 */

describe("the spine", () => {
  it("has exactly three Phases, in the spec's order", () => {
    expect(phases.map((phase) => phase.id)).toEqual(["deciding", "about-you", "on-campus"]);
    expect(phaseCount).toBe(3);
  });

  it("keeps the Closing out of the Phases", () => {
    expect(phases).not.toContain(closing);
    expect(phases.map((phase) => phase.id)).not.toContain(closing.id);
    expect(closing.kind).toBe("closing");
    expect(phases.every((phase) => phase.kind === "phase")).toBe(true);
  });

  it("orders the rail as the three Phases then the Closing", () => {
    expect(groups).toEqual([...phases, closing]);
  });

  it("groups the Quests as the spec's table does", () => {
    expect(groups.map((group) => group.steps.map((step) => step.id))).toEqual([
      ["offer"],
      ["identity-contact", "health"],
      ["housing", "campus-life"],
      ["review", "deposit"],
    ]);
  });
});

describe("the flat list, derived", () => {
  it("is the groups flattened in flow order — never a second hand-kept list", () => {
    expect(steps).toEqual(groups.flatMap((group) => group.steps));
  });

  it("counts Quests, not groups", () => {
    expect(stepCount).toBe(steps.length);
    expect(stepCount).toBe(7);
  });

  it("gives every Quest a unique id and a unique path", () => {
    expect(new Set(steps.map((step) => step.id)).size).toBe(stepCount);
    expect(new Set(steps.map((step) => step.path)).size).toBe(stepCount);
  });
});

describe("the rename", () => {
  it("has no step called about-you — that name belongs to the Phase now", () => {
    expect(steps.map((step) => step.id)).not.toContain("about-you" as StepId);
    expect(steps.some((step) => step.path.includes("about-you"))).toBe(false);
  });

  it("carries Identity & contact in its place", () => {
    const step = stepById("identity-contact");
    expect(step.label).toBe("Identity & contact");
    expect(step.path).toBe("/onboarding/identity-contact");
  });

  it("still names the Phase About you", () => {
    expect(phases[1].label).toBe("About you");
  });
});

describe("walking the flow", () => {
  it("crosses a Phase boundary without noticing it", () => {
    expect(nextStep("offer")?.id).toBe("identity-contact");
    expect(nextStep("health")?.id).toBe("housing");
    expect(previousStep("housing")?.id).toBe("health");
  });

  it("stops at both ends", () => {
    expect(nextStep("deposit")).toBeUndefined();
    expect(previousStep("offer")).toBeUndefined();
  });

  it("indexes against the flat list", () => {
    expect(stepIndex("offer")).toBe(0);
    expect(stepIndex("deposit")).toBe(stepCount - 1);
  });
});

describe("finding a Quest's home", () => {
  it("puts each Quest in the group that lists it", () => {
    expect(groupOf("health").id).toBe("about-you");
    expect(groupOf("campus-life").id).toBe("on-campus");
    expect(groupOf("review")).toBe(closing);
  });

  it("reports no Phase for a Closing Quest — the Closing is not a Phase", () => {
    expect(phaseOf("review")).toBeUndefined();
    expect(phaseOf("deposit")).toBeUndefined();
    expect(phaseOf("housing")?.id).toBe("on-campus");
  });

  it("numbers Phases from one, and refuses to number the Closing", () => {
    expect(phaseNumber("deciding")).toBe(1);
    expect(phaseNumber("on-campus")).toBe(3);
    expect(phaseNumber(closing.id)).toBeUndefined();
  });
});

describe("what a Phase row shows", () => {
  it("sums its Quests' minutes rather than keeping its own figure", () => {
    for (const group of groups) {
      expect(groupMinutes(group)).toBe(
        group.steps.reduce((total, step) => total + step.timeEstimateMinutes, 0),
      );
    }
  });

  it("is required when any Quest inside it is", () => {
    // About you holds a required Quest (Identity & contact) and an optional one
    // (Health information) — the Phase follows the required one.
    expect(groupRequired(phases[1])).toBe(true);
    expect(phases[1].steps.some((step) => !step.required)).toBe(true);
  });

  it("is optional only when every Quest inside it is", () => {
    expect(
      groupRequired({
        ...phases[0],
        steps: phases[0].steps.map((s) => ({ ...s, required: false })),
      }),
    ).toBe(false);
  });
});
