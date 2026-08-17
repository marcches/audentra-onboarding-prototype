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

- [x] Every void in the spec's table re-measured on the shipped screens
- [x] The first Quest card still ends above the fold at 1366×768
- [x] Both viewports walked: 1366×768 and 390×844
- [x] The gate walked end to end and unchanged but for the hand-off link
- [x] `steps.test.ts`, `summary.test.ts` and `points.test.ts` unedited
- [x] The four judgements recorded with a verdict, not a tick
- [x] Anything found that this cycle does not fix is written down as a finding
- [x] `pnpm typecheck`, `pnpm test`, `pnpm lint` and `pnpm build` pass

## Comments

### The sweep, 2026-08-17 — measured on what shipped

Measured in a browser at **1366×768**, on the seeded demo state.

| Defect (spec's table) | Before | After |
|---|---|---|
| Void below the Dashboard's content | 195px | **0** — content runs to y=972, past the fold |
| Void in the Dashboard's secondary column | 365px | **0** — column ends y=948, against the primary column's y=906 |
| Void in the sidebar | 334px | **10px** — last Area y=401, Balance y=411 |
| Void on each unbuilt Area | 580px | **246px** on five, **262px** on two |
| The portal's `h1` | 20px | **28px**, the gate's own `--text-h1` |
| Signature hairlines in the portal | 0 | **1**, once per screen |
| The Balance on arrival | 0 pts · $0 | **180 pts · $30** |
| Primary actions on the landing screen | 3 | **1** |
| Institutional facts on a portal screen | 3 | **15** — crest, name, first name, founding year, programme, degree, term, campus, student number, class of, and five key dates |

The first Quest card ends at **y=256**, inside the y≈300 the cycle was not allowed
to break. At **390×844** there is no horizontal overflow on any portal screen, the
`h1` is still 28px, one hairline, and every slot control clears `--tap-target`.

**The gate**: `completion.tsx` (+15, the hand-off link) and `offer.tsx` (±4, the
`campusPhotos.offer` → `.lawn` rename, no visual change) are the only two gate
files this cycle touched. Walked at 1366×768 and unchanged.

`steps.test.ts`, `summary.test.ts` and `points.test.ts` are unedited for the
third cycle running. `portal.test.ts` gained the two assertions ticket 03 owed
and one store fixture field ticket 04 required; no existing assertion moved.

### The four judgements

1. **Does the portal read as the same product as the gate?** **Yes.** Same crest,
   same sidebar anatomy, same Balance component, and the academic block prints
   the same six facts, in the same label→value rows, as the Offer screen's `The
   offer` section and the student card on the arrival screen. The `h1` and the
   hairline are what closed the gap; before them the two surfaces disagreed about
   the size of their own title.
2. **Does the academic block read as an institution or as a widget?** **An
   institution**, narrowly. The photograph, the founding year and the student
   number carry it. Its ceiling is the 17rem column it sits in.
3. **Do the rows read as density or as a second list nobody asked for?**
   **Density** — and this is where the cycle's own verdict goes against it. See
   finding 1.
4. **Does Appointments answer the question that started this?** **Yes.** Three
   services at the top of the screen, any of them bookable directly with no topic
   first, and the booking shows at the head of the Area and survives a reload.

### Findings

1. **The density problem is not fixed, and this cycle cannot fix it.** Walked in
   front of the client on 2026-08-17, the verdict was that density is still
   wrong and that the portal needs a **complete redesign**, deferred. Every void
   in the table above is closed and the reading of the screen did not change,
   which says the ruler was wrong: "how many pixels of Ground are left" is not
   the same question as "how does this screen read". A future cycle should
   measure the whole screen, not its leftovers.
2. **Two placeholders land at 262px of Ground against the ticket's 256px bar.**
   `My Classrooms` and `Messages` are the two with no destination to point at.
   Not padded further on purpose: adding a block to hit a pixel target is the
   failure the redesign above is being called for.
3. **At seventeen days from term nothing is `steady`,** so every Quest card
   carries an urgency chip. Honest for the run-up to term, but the three-band
   tone is doing less work than it was designed to.
4. **`Your place at Aster` now names two things** — the gate's Offer screen and
   the portal's academic block. A deliberate echo, since they print the same six
   facts, but the glossary should say so if it survives the redesign.
