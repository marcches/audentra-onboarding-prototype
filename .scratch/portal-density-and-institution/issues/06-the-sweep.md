# 06 — The sweep

Status: ready-for-agent

**What to build:** Nothing new. Every void in this spec's table measured again on
what shipped, at 1366×768 and 390×844, plus the judgements no test makes.

**The table, measured again.** The four voids. The title size against the gate's.
The count of signature hairlines. The Balance's opening figure. Primary actions
per screen. Institutional facts on screen — from three to however many there now
are.

**The judgements no test makes.** Whether the portal reads as the same product as
the gate, walked one after the other in the same sitting. Whether the academic
block reads as an institution or as a widget. Whether the rows read as density or
as a second list nobody asked for. Whether Appointments answers the question that
started all of this.

**What is checked and expected not to move.** The gate, in full, at both
viewports — with the one new link on the arrival screen as the only difference.
`steps.test.ts`, `summary.test.ts` and `points.test.ts` pass unedited for the
third cycle running, and so does `portal.test.ts` apart from the two assertions
ticket 03 adds.

**Blocked by:** 01, 02, 03, 04, 05.

**Referências:** none, deliberately. This ticket makes no UI decision — it
verifies the ones taken in 01 through 05, each of which carries its own.

- [ ] Every void in the spec's table re-measured on the shipped screens
- [ ] The first Quest card still ends above the fold at 1366×768
- [ ] Both viewports walked: 1366×768 and 390×844
- [ ] The gate walked end to end and unchanged but for the hand-off link
- [ ] `steps.test.ts`, `summary.test.ts` and `points.test.ts` unedited
- [ ] The four judgements recorded with a verdict, not a tick
- [ ] Anything found that this cycle does not fix is written down as a finding
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm lint` and `pnpm build` pass
