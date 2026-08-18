# 03 — Headroom, Streak and the Reward track

**What to build:** The Balance stops being a number and becomes a journey. A
student sees how far they are from the next named amount of **Bookstore credit**
(the **Reward track**), how many Points are still available to earn today
(**Headroom**), and how many days in a row they have finished at least one
Requirement (**Streak**).

All three are derived from the single existing source of Points as pure
functions. None of them introduces new stored state, and none of them changes
what a Point is worth or what it converts to.

**None of this ranks the student against anybody.** No tiers, no levels, no
league, no leaderboard, no position. ADR 0002 rejected those on social grounds —
they rank a cohort against each other before any of them has arrived on campus,
on a screen the student's family may be sitting beside them for — and that
argument stands. Headroom is forward-looking by construction: it says what is
still possible, never what was missed. A broken Streak resets silently and says
nothing else.

**Blocked by:** 02 — The room and the band, on the Dashboard.

**Status:** resolved

**Referências:**
- [sweetgreen](https://mobbin.com/screens/26c7cc12-dcf7-41e1-9832-1208c3bbe98c) — the Reward track exactly as ADR 0002 described it in prose: distance to a *named* thing along a run of named amounts, never a bare score.
- [Upwork](https://mobbin.com/screens/707fa0fd-0ce5-4773-9487-d2bcb53e2f92) — "Available to earn" as a forward-looking figure at the head of a task list, which is the anatomy Headroom borrows.
- [Langdock](https://mobbin.com/screens/c69db9e3-a938-4c5f-9c86-652c6efc28a7) — the ring and the fraction saying how big the whole process is, without pushing the first task below the fold.

- [ ] Headroom says what is still earnable today and never what was lost
- [ ] The Reward track shows distance to the next named amount of Bookstore credit
- [ ] Streak counts consecutive days with at least one Requirement finished
- [ ] A broken Streak resets without comment or penalty
- [ ] No tier, level, league, leaderboard or ranking appears anywhere
- [ ] All three derive from the single source of Points; no new stored state
- [ ] The conversion rate and the meaning of a Point are unchanged
- [ ] The three are tested where Points is already tested
- [ ] Nothing pushes the first Quest card below the fold at 1366×768
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Answer

Headroom, Streak and the Reward track are pure functions in `points.ts`, tested there. Nothing is stored. Headroom and Streak sit on the band's greeting row, which existed before them, so the lead card still ends at y=276. No tier, level, league, leaderboard or position anywhere, and the Reward track's shape is asserted to contain none.
