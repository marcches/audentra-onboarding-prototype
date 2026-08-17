# 02 — Tracer bullet: the portal exists and shows one real Quest

Status: done

**What to build:** A student who has finished the gate opens the portal and sees,
without scrolling and without looking for it, the single most important thing the
institution is waiting on them for — with its deadline, how long it takes, what
it is worth today, and what it will be worth tomorrow.

This is the slice that proves the whole thesis. It is deliberately the largest
ticket in the cycle, because none of its halves demonstrates anything alone: a
spine with no screen is a data structure, and a screen with no spine is a
picture.

**What it cuts through.** The portal's spine — the twelve Requirements, their
four derived states, the decay arithmetic, Smart order, and the three carried
over from Quests skipped in the gate. A portal route with enough shell to hold a
page. And the Dashboard rendering **the top Requirement only**, as a complete
Quest card.

**The card, in full.** Category badge and urgency, the Quest name, one line of
blurb, `Due Nov 16 · 100 days`, `About 4 min`, and `100 pts today · 99 tomorrow`
shown literally. A primary action carrying a verb, and a quiet `See how` beside
it which is present and inert — its drawer is cycle two, and a secondary action
that moves the layout when it arrives is worse than one that does nothing now.

**Decay is the client's one non-negotiable**, and this is where it lands: −1 per
day from the availability date, floored at half the original value, never zero,
never negative, and never expressed as what has already been lost. See
`docs/context/portal.md` for the terms and the spec for why this display has no
precedent in the reference catalogue.

**Today is a fixture.** No `Date.now()`, so a screenshot in November and one in
March show the same thing and no test depends on the day it runs.

**The gate is read, never written.** The carried-over three come from asking the
gate's store which optional Steps were skipped. That direction is one-way, and
`CONTEXT-MAP.md` records it.

**Demoable as:** open the portal, see one real thing to do, come back tomorrow in
the fixture and watch it be worth one point less.

**Blocked by:** None — can start immediately.

**Referências:**
- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) — the card's two-action anatomy exactly: `Start chatting` primary with a verb, `Learn more ↗` quiet beside it, and the value carried as a tag on the row rather than announced on completion.
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8) — the active task expanded to full card while its neighbours stay as rows, with `+100` on the row itself. The shape of showing one Requirement at full weight.
- [OpenSea](https://mobbin.com/screens/516ee107-5c44-4af4-b299-df1bd30711cf) — value chip and urgency badge as two independent fields on one row (`+100 XP`, `ENDING IN 1D`), which is why the model keeps points and deadline separate rather than blending them into a priority.
- [Remote](https://mobbin.com/screens/1a5a8ac8-49f2-467c-ad4f-5e36c2e86936) — outstanding work as the first thing on the landing screen, each row carrying its own date. The arrangement this ticket is the first step toward.

- [x] The twelve Requirements exist, with unique ids and paths, the flat list derived from the grouping
- [x] The four states are exhaustive and mutually exclusive for every store state
- [x] Upcoming derives from unmet prerequisites and future availability, never from a stored flag
- [x] Decay floors at half the original, in whole Points, never zero or negative
- [x] Points at risk is 0 once the floor is reached
- [x] Smart order is a total order and excludes Upcoming entirely
- [x] `Unlocks` counts transitively, asserted against a chained fixture
- [x] The carried-over three derive from the gate's store; a student who skipped nothing produces none
- [x] Nothing calls `Date.now()`
- [x] The Dashboard renders the top Requirement as a full Quest card with all six metadata fields
- [x] `100 pts today · 99 tomorrow` is shown literally, and what has been lost is never shown
- [x] `See how` is present and inert, sized so its drawer arriving later moves nothing
- [x] The card is a flat card on a Well — no elevation (ADR 0010)
- [x] The gate's store is read and never written
- [x] `points.ts` is not modified — if `points.test.ts` breaks, decay leaked into the currency
- [x] `steps.test.ts` and `summary.test.ts` pass unedited — if they break, the gate moved
- [x] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** `src/lib/portal.ts` is the spine — twelve Requirements grouped by
category with the flat list derived from the grouping, four derived states, the
decay arithmetic, transitive unlocks and three comparators. `portal.test.ts`
covers all eight assertions the spec named, in 26 tests.

Two decisions worth recording, because neither was in the spec as written:

1. **A second store rather than a slice of the gate's.** `PortalState` lives in
   `src/lib/portal-store.ts` with its own storage key. Adding a required slice to
   `OnboardingState` would have broken `summary.test.ts` at the type level — a
   test this cycle promised not to edit — and a separate object makes the
   one-way relationship a property of the code: there is no `patch("portal", …)`
   on the gate's store to reach for. Every derivation takes a `PortalContext`
   (`{ gate, portal }`), so no call site can pass one half and forget the other.
2. **A `Requirement` carries an `action` verb** beside its label. Half the Quest
   names are nouns — `Final transcript`, `Health insurance` — and a button
   reading `Health insurance` names the thing rather than the act.

`Secure your place` is a prerequisite of `Choose your move-in window`, which is
what gives the first card a checkable `opens 1 more`. The spec's table names the
housing assignment as that Requirement's blocker; both are true and both are
modelled.

Measured in the browser at 1366x768: `Due Nov 16 · 100 days`, `About 4 min`,
`100 pts today · 99 tomorrow`, on a flat card with no elevation.
