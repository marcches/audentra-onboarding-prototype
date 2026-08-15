import { describe, expect, it } from "vitest";

import {
  BOOKSTORE_LADDER,
  CREDIT_BLOCK_USD,
  CREDIT_PER_POINT_USD,
  creditReleased,
  nextTarget,
  POINTS_PER_BLOCK,
  pointsToNextRelease,
  SHARE_POINTS,
  totalPointsAvailable,
} from "@/lib/points";
import { steps, totalStepPoints } from "@/lib/steps";

/**
 * The conversion, tested because it is the whole of ADR-0002: a Point that does
 * not convert into a named thing is the bare scoreboard we are replacing. These
 * are fixture numbers — the assertions are about the *shape* holding when a
 * real rate replaces them, not about $0.20.
 */

describe("bookstore credit", () => {
  it("derives the block size from the rate, so the two can never disagree", () => {
    expect(POINTS_PER_BLOCK * CREDIT_PER_POINT_USD).toBe(CREDIT_BLOCK_USD);
  });

  it("releases nothing until the first block is complete", () => {
    expect(creditReleased(0)).toBe(0);
    expect(creditReleased(POINTS_PER_BLOCK - 1)).toBe(0);
  });

  it("releases credit one whole block at a time", () => {
    expect(creditReleased(POINTS_PER_BLOCK)).toBe(CREDIT_BLOCK_USD);
    expect(creditReleased(POINTS_PER_BLOCK * 2 - 1)).toBe(CREDIT_BLOCK_USD);
    expect(creditReleased(POINTS_PER_BLOCK * 2)).toBe(CREDIT_BLOCK_USD * 2);
  });

  it("counts the distance to the next release, never to zero", () => {
    expect(pointsToNextRelease(0)).toBe(POINTS_PER_BLOCK);
    expect(pointsToNextRelease(POINTS_PER_BLOCK - 1)).toBe(1);
    /* On the boundary the next thing to aim at is the *following* block —
       "0 points to go" beside a balance that has just paid out reads as an
       error, and the Balance would have nothing left to point at. */
    expect(pointsToNextRelease(POINTS_PER_BLOCK)).toBe(POINTS_PER_BLOCK);
  });
});

describe("the Balance always has an object to point at", () => {
  it("names a target the student has not reached yet", () => {
    const { target, pointsAway, reached } = nextTarget(0);
    expect(reached).toBe(false);
    expect(target).toBe(BOOKSTORE_LADDER[0]);
    expect(pointsAway).toBeGreaterThan(0);
  });

  it("moves up the ladder as credit is released", () => {
    const first = BOOKSTORE_LADDER[0];
    const enough = Math.ceil(first.usd / CREDIT_PER_POINT_USD);
    expect(nextTarget(enough).target).toBe(BOOKSTORE_LADDER[1]);
  });

  it("never runs out of a target, even past the top rung", () => {
    const last = BOOKSTORE_LADDER[BOOKSTORE_LADDER.length - 1];
    const beyond = Math.ceil((last.usd * 4) / CREDIT_PER_POINT_USD);
    const { target, reached } = nextTarget(beyond);
    expect(reached).toBe(true);
    expect(target).toBe(last);
  });
});

describe("what the flow is worth", () => {
  it("announces a total that includes the share award", () => {
    /* Announced once, at the entrance. The share award is the one point-earning
       action that is not a Step submission, so it cannot come from `steps.ts`
       and would otherwise be missing from the promise. */
    expect(totalPointsAvailable).toBe(totalStepPoints + SHARE_POINTS);
  });

  it("announces the same total to every student", () => {
    /* It used to be a function of Student status, because an international
       student had one Quest fewer. The address dropped a level and the flow is
       nine Quests for everybody (ADR 0011), so the figure the entrance promises
       is the figure any student can go on to earn. */
    expect(totalPointsAvailable).toBe(215 + SHARE_POINTS);
  });

  /* A flow whose every Quest is finished and which still had not released a
     single block of credit would make the destination decorative. */
  it("releases credit for a student who finishes everything", () => {
    const everything = steps.reduce((sum, step) => sum + step.points, 0) + SHARE_POINTS;
    expect(creditReleased(everything)).toBeGreaterThanOrEqual(CREDIT_BLOCK_USD);
  });
});
