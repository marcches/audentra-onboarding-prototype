import { describe, expect, it } from "vitest";

import {
  CREDIT_BLOCK_USD,
  CREDIT_PER_POINT_USD,
  creditReleased,
  POINTS_PER_BLOCK,
  pointsToNextRelease,
  SHARE_POINTS,
} from "@/lib/points";
import { steps } from "@/lib/steps";

/**
 * The conversion, tested because it is the whole of ADR-0002: a Point that
 * doesn't convert into a named thing is the bare scoreboard we are replacing.
 * These are fixture numbers — the assertions are about the *shape* holding
 * when a real rate replaces them, not about $0.20.
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

describe("what the flow is worth", () => {
  it("gives every Quest a non-zero value", () => {
    for (const step of steps) expect(step.points).toBeGreaterThan(0);
  });

  /* A flow whose every Quest is finished and which still hasn't released a
     single block of credit would make the destination decorative. */
  it("releases credit for a student who finishes everything", () => {
    const everything = steps.reduce((sum, step) => sum + step.points, 0) + SHARE_POINTS;
    expect(creditReleased(everything)).toBeGreaterThanOrEqual(CREDIT_BLOCK_USD);
  });
});
