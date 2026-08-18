# 04 — The price before acting, and Decay on the lead card

**What to build:** A student can see what a Quest is worth **before** deciding to
do it, and can see on the one task they are being pointed at that today's value
is higher than tomorrow's.

The Points price appears on the Quest card as a chip, at the moment of choosing
rather than only as a receipt at the moment of finishing. The object already
supports this — Points are a price and a receipt in one object (ADR 0007) — so
this is showing the half that was never drawn, not inventing a second figure.

**Decay appears on the lead card and nowhere else.** It stays literal: today's
value beside tomorrow's, never a running tally of what has been lost. The
placement is deliberate and is the risk-management decision of this cycle —
Decay is the one component in the product with **no reference in the catalogue**,
so concentrating it on one card per screen is what lets human acceptance judge it
instead of it becoming twelve simultaneous unvalidated bets.

**Blocked by:** 02 — The room and the band, on the Dashboard.

**Status:** resolved

**Referências:**
- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) — the price chip sitting on the row *before* the student acts, which remains the strongest reference this project has found for pricing a task rather than receipting it.
- [OpenSea](https://mobbin.com/screens/516ee107-5c44-4af4-b299-df1bd30711cf) — the closest the catalogue gets to Decay, and the reason Decay stays on one card: every app that has tried time-limited value uses a deadline or a countdown, and none of them shrinks the reward itself.
- [Uxcel](https://mobbin.com/screens/e364eaf2-50f2-4c3f-8a48-a83d31d0ab34) — a value carried on the checklist item itself without the row growing a second line for it.

- [ ] The Points price is visible on a Quest card before the student acts on it
- [ ] The price and the receipt remain one object; no second figure is introduced
- [ ] Decay appears on the lead card only
- [ ] Decay is shown as today's value beside tomorrow's
- [ ] Decay never shows a tally of what has already been lost
- [ ] The chip does not add a line to the card or change its height
- [ ] Decay's rule is tested where Requirement logic is already tested
- [ ] The first Quest card still ends above the fold at 1366×768
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Answer

The Points price is a chip in the Quest card's existing chip row, so the card gains no line and no height. Decay is on the lead card only, literal, and never a tally. `leadRequirement` names the head of Smart order; `portal.test.ts` asserts there is exactly one, that it is always actionable, and that it is absent rather than invented when nothing is left.
