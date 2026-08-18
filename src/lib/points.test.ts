import { describe, expect, it } from "vitest";

import {
  BOOKSTORE_LADDER,
  CREDIT_BLOCK_USD,
  CREDIT_PER_POINT_USD,
  creditReleased,
  headroom,
  nextTarget,
  POINTS_PER_BLOCK,
  pointsToNextRelease,
  rewardTrack,
  SHARE_POINTS,
  streakOf,
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

/**
 * The three mechanics this cycle added, all derived from the one source of
 * Points and none of them storing anything (ADR 0015).
 *
 * What is asserted is the **social** design as much as the arithmetic, because
 * that is where these can go wrong: Headroom must have no way to say what was
 * lost, a broken Streak must reset without comment, and nothing anywhere may
 * rank one student against another. ADR 0002 rejected tiers and leaderboards on
 * the grounds that they rank a cohort before any of them has arrived on campus,
 * on a screen the student's family may be sitting beside them for — and that
 * argument has not been withdrawn.
 */

describe("the Reward track", () => {
  it("shows the whole run of named amounts, not a bare score", () => {
    const track = rewardTrack(0);
    expect(track.rungs).toHaveLength(BOOKSTORE_LADDER.length);
    expect(track.rungs.every((rung) => rung.target.label.length > 0)).toBe(true);
  });

  it("marks exactly one rung as the one being aimed at", () => {
    const track = rewardTrack(0);
    expect(track.rungs.filter((rung) => rung.next)).toHaveLength(1);
    expect(track.rungs.find((rung) => rung.next)?.target).toBe(track.target);
  });

  it("measures from the rung already passed, not from zero", () => {
    /* A bar that measures the whole ladder barely moves for the first three
       rungs, which teaches the student the bar does not respond to them. */
    const first = BOOKSTORE_LADDER[0];
    const atFirst = Math.ceil(first.usd / CREDIT_PER_POINT_USD);
    const track = rewardTrack(atFirst);
    expect(track.rungs[0].reached).toBe(true);
    expect(track.target).toBe(BOOKSTORE_LADDER[1]);
    expect(track.progress).toBe(0);
  });

  it("fills as credit is released and never overshoots", () => {
    for (const points of [0, 40, 130, 260, 700, 4000]) {
      const track = rewardTrack(points);
      expect(track.progress).toBeGreaterThanOrEqual(0);
      expect(track.progress).toBeLessThanOrEqual(1);
    }
  });

  it("keeps a target past the top rung, and is full there", () => {
    const last = BOOKSTORE_LADDER[BOOKSTORE_LADDER.length - 1];
    const beyond = Math.ceil((last.usd * 4) / CREDIT_PER_POINT_USD);
    const track = rewardTrack(beyond);
    expect(track.reached).toBe(true);
    expect(track.progress).toBe(1);
    expect(track.rungs.every((rung) => rung.reached)).toBe(true);
  });

  it("ranks the student against nothing at all", () => {
    /* The one assertion here that is about ADR 0002 rather than about
       arithmetic: no tier, level, league, position or percentile is derivable
       from what this returns, because none of it is in the shape. */
    const track = rewardTrack(300);
    expect(Object.keys(track).sort()).toEqual([
      "pointsAway",
      "progress",
      "reached",
      "released",
      "rungs",
      "target",
    ]);
  });
});

describe("Headroom", () => {
  it("adds up what is still earnable, and counts what it added", () => {
    expect(headroom([100, 60, 40])).toEqual({ points: 200, count: 3 });
  });

  it("is zero rather than absent when there is nothing to do", () => {
    expect(headroom([])).toEqual({ points: 0, count: 0 });
  });

  it("has no arithmetic in it that could produce what was lost", () => {
    /* Forward-looking by construction: the only input is today's values of
       things that can still be acted on, so there is no Original value in
       scope to subtract from. "180 still available" is an invitation; "you
       have lost 40" is a bill. */
    const values = [100, 60];
    expect(headroom(values).points).toBe(160);
    expect(headroom(values.map((value) => value - 1)).points).toBe(158);
  });
});

describe("Streak", () => {
  const days = ["2027-08-06", "2027-08-07", "2027-08-08"];

  it("counts consecutive days ending today", () => {
    expect(streakOf(days, "2027-08-08")).toBe(3);
  });

  it("keeps the run alive on a day that is not over yet", () => {
    /* A student who finished something yesterday and has not opened the portal
       today is on a live streak. Showing them a zero every morning for
       something they have not failed to do is the reprimand this product does
       not make. */
    expect(streakOf(["2027-08-06", "2027-08-07"], "2027-08-08")).toBe(2);
  });

  it("stops at the first gap and counts no further back", () => {
    expect(streakOf(["2027-08-01", "2027-08-02", "2027-08-07"], "2027-08-08")).toBe(1);
  });

  it("resets to zero, and that is the whole of what happens", () => {
    /* No "you lost a 6-day streak", no freeze to buy, no repair. The number is
       simply smaller the next time it is read. */
    expect(streakOf(["2027-08-01", "2027-08-02", "2027-08-03"], "2027-08-08")).toBe(0);
    expect(streakOf([], "2027-08-08")).toBe(0);
  });

  it("does not double-count a day listed twice", () => {
    expect(streakOf(["2027-08-07", "2027-08-07"], "2027-08-08")).toBe(1);
  });
});
