# 11 — The sweep and the human acceptance

**What to build:** The cycle's claim, checked. Every screen in both surfaces is
walked at 1366×768 and at 390×844, and the things this cycle promised are either
true or written down as not true.

This ticket exists because the central promises of this cycle are **not testable
in CI and the repo says so about itself**: measuring a fold without a DOM is
pretending the test knows the height of a font, and a test that lies is worse
than no test. So the questions below are answered by a person looking, which is
the same standard the previous cycle used and the client agreed to.

What is being judged, in the client's own words: is it still *too flat*? Is it
*more purple*? Is it *more round*? And the one this cycle bet on: does the
gamification read as a reason to come back, or as decoration?

**The one unvalidated component gets named attention.** Decay has no reference in
the catalogue — every app that has tried time-limited value uses a deadline or a
countdown, and none shrinks the reward. It sits on one card per screen precisely
so that this walk can judge it. If it reads as pressure rather than as urgency,
that is a finding for the client conversation, not a bug to patch quietly.

**Blocked by:** all — 01 through 10.

**Status:** ready-for-agent

**Referências:**
- [Mercor](https://mobbin.com/screens/6ab63817-8b06-46a6-8fba-be87f0e05a6d) — the target the band is judged against: does the colour contain the work, or sit above it and cost height?
- [Asana](https://mobbin.com/screens/5bef03d3-11e0-4925-bae1-52529effba86) — the target the room is judged against: is the ground tinted enough to be felt and quiet enough to read text on?
- [HoneyBook](https://mobbin.com/screens/7c915d6b-2a99-4eb0-956d-e7a3a97bb265) — the before state, kept as the comparison: the flat, bordered, colourless checklist this cycle was called to replace.

- [ ] Every screen in both surfaces walked at 1366×768 and at 390×844
- [ ] The first piece of work is above the fold on every landing screen
- [ ] No screen is cut off at either size
- [ ] Nothing lifts, grows or shifts on hover or selection anywhere
- [ ] The same screen lands on the same pixels however it was arrived at
- [ ] One material per job holds on every screen, with no unit delimited twice
- [ ] The texture appears exactly once, on the ground
- [ ] Decay is judged explicitly and the verdict recorded, whichever way it goes
- [ ] Whether the display face was approved, refused or still pending is recorded
- [ ] Every measurement is written down, including the ones that failed
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
