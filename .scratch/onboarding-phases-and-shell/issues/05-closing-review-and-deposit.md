# 05 — The Closing: Review & sign, and Deposit

**What to build:** Review & sign becomes what its name says — check the answers,
sign. The per-step time estimates and required/optional labels it carries today
move to the Phase rows in the rail, where they help before the work instead of
after it. Review and Deposit render as the Closing: outside the three-Phase
count, visually distinct from a Phase in the rail.

**Blocked by:** 01, and 03 for how a completed flow reports its Points.

**Status:** done

**Referências:**
- [Adaline](https://mobbin.com/screens/36261cc6-0b4a-4cd5-a957-e679828ec74f) — completed items struck through and a whole-flow completion state, which is the register the Closing should be in.
- [Square — new contract](https://mobbin.com/screens/aa8c688f-a889-44ef-848a-8c766d8272da) — reviewing a set of clauses as a scannable list of panels before signing, with Next in the top chrome.
- [Deel — offer](https://mobbin.com/screens/66328d19-07aa-4a67-bacd-4cfea6e32885) — label→value summary blocks dense enough to check at a glance.

- [x] Review & sign no longer lists per-step time estimates or required/optional labels.
- [x] Those labels appear on the Phase rows in the rail instead (delivered in 01 — verify here, don't build twice).
- [x] Review shows the student's answers grouped by Phase, each with an edit link that returns to Review.
- [x] The Closing is visually distinct from a Phase in the rail and excluded from the three-Phase count and the segmented mobile bar.
- [x] Deposit keeps its own step and stays optional.
- [x] Completion reports the final Balance and its bookstore-credit value.

## Comments

**Built.** The summary is grouped by Phase and built by walking `steps.ts`
rather than by a hand-written list beside it — the order is the spine's, so it
cannot drift from the flow without the flow moving too. `SummaryGroup` lost
`timeEstimateMinutes`, `required` and `points`: nothing renders them here now,
and a field carried "in case" is how the old duplication started.

**Verified, not rebuilt (01's work):** the Phase rows in the rail carry
`{minutes} min · Required/Optional`; the Closing has no number, a square mark, a
rule above it, and is absent from `PhaseBar`'s three segments.

**Completion reports the Balance** as credit first and points second, and
renders nothing at all at zero points — an arrival screen volunteering "you
earned 0 points" is worse than silence.
