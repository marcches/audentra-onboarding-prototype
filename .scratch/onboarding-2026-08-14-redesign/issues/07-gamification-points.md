# 07 — Gamification: points per step + running total

**What to build:** Extend the same step-order source (from #06) with a point value per step. Points are awarded on step submission (the same `submitted: true` moment already used for completion tracking) and accumulate. Review & Sign shows a running total. Point values are a quick, plausible pass — briefly research how U.S. university engagement-point programs typically scale a first-week checklist, then assign proportionate values (a five-section step earning meaningfully more than a one-question step) — structurally correct, not authoritative.

**Blocked by:** #06 (extends the same shared step-metadata source; sequencing avoids both tickets reshaping it at once).

**Status:** ready-for-human

- [x] Step-order source gains a point value per step.
- [x] Completing a step (existing `submitted: true` moment) awards its points.
- [x] Review & Sign shows a running total that matches the sum of whatever was actually completed — not a hardcoded max.
- [x] Point values are proportionate to step complexity (quick pass, not deep research).
- [x] `docs/review-script.md` gets a checklist entry: full run-through accumulates points correctly and the Review & Sign total matches actual completion.

## Comments

Implemented as a derived total rather than mutable state — `lib/points.ts`'s `stepPoints()` sums `steps[].points` for whichever steps `completedSteps()` reports done, so the total can never drift from what's actually been submitted. Points: offer 10, about-you 50, housing 20, campus-life 15, health 10, review 30, deposit 15 (150 total) — roughly modelled on how U.S. university orientation/engagement-point checklists scale a multi-section task above a one-question one. Shown in the step rail (a total next to "Your path to Aster", and a "+N" badge on each completed step) and in Review & Sign's summary header. The one non-step award — sharing at the accept-offer moment — needed its own boolean (`offer.shared`) since it isn't tied to a step's `submitted` flag; `totalPoints()` adds `SHARE_POINTS` on top of `stepPoints()` when set. Verified in-browser end to end.
