# 03 — Who you are at Aster

Status: ready-for-agent

**What to build:** The screen says which university this is, what the student was
admitted to, when it starts, and what their number is — which is the whole of the
difference between a violet SaaS with a crest in the corner and a system a
university runs.

**The academic block**, in the secondary column under the Balance: programme,
degree, starting term, campus, student number and `Class of`. Every one of those
already exists in `fixtures.ts` and none of them has ever been on a portal
screen.

**A contained photograph** at its head. One image, short, not a hero band across
the top — the fold budget from the previous cycle is the constraint that holds,
and the first Quest card ending above y≈300 is the number this ticket must not
break.

**Key dates**, from one new fixture: orientation, move-in, teaching begins,
add/drop closes, and the first term's bill. A university portal that cannot say
when term starts is not one.

**And the defect the calendar exposes.** With `TODAY = 2027-08-08`, `Secure your
place` is due **Nov 16** — after Fall 2027 teaching begins. The dates were
written to make one card read `100 days` and were never checked against a term.
Every Requirement's availability and deadline is re-based so that the whole
twelve falls inside the run-up to term, and the spine's tests must pass unedited
while it happens: if one of them breaks, it was restating the fixture.

**Referências:**
- [Uxcel](https://mobbin.com/screens/165ede79-21ff-4a81-adda-68a942c39c21) — the right-hand column carrying identity and reward blocks stacked, each short, none of them competing with the work in the main column.
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8) — a profile block whose facts are set as label→value pairs at metadata size, which is the anatomy the academic block borrows rather than inventing a fourth one.

- [ ] Programme, degree, term, campus, student number and `Class of` are on the Dashboard
- [ ] Every fact comes from `fixtures.ts`; none is typed into a component
- [ ] The key dates fixture exists and the block reads it
- [ ] No Requirement is due after teaching begins
- [ ] Every Requirement is available on or before its own deadline
- [ ] `portal.test.ts` gains those two assertions and its existing ones pass unedited
- [ ] The photograph is contained, and the first card still ends above the fold
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
