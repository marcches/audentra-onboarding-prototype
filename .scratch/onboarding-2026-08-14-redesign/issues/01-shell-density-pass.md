# 01 — Shell & density pass

**What to build:** Tighten the shared step chrome (page shell, step rail, context panel, section-title pattern, card/spacing scale) so every onboarding step — offer through deposit — reads as one consistent, dense system instead of loosely related, over-spaced screens. The Offer step's fact grid and deposit callout are the concrete example raised on the review call: they should fit without excessive scrolling once this lands.

**Blocked by:** None — can start immediately.

**Status:** ready-for-human

- [x] Shared spacing/card tokens are tightened (not a new layout primitive — an adjustment to the existing shell/rail/context-panel/section-title components).
- [x] Offer step's fact grid and deposit callout fit within a shorter scroll than today, at both desktop and 390px.
- [x] Every other step (About You, Housing, Campus Life, Review & Sign, Deposit) inherits the same spacing scale — no step ends up visually inconsistent with another.
- [x] `docs/review-script.md` gets a checklist entry confirming consistent density across all steps.

## Comments

Implemented: tightened `StepShell`/`ContextPanel`/`StepActions` padding and gaps, the step rail's outer padding, and the accordion's card padding — all shared components, so every step inherits the same scale automatically. Offer's fact grid, deposit callout, and "what happens" card got the same tighter padding as the concrete example. Verified in-browser at desktop and 390px: no regressions, less scroll on Offer. Checklist added to `docs/review-script.md` under "Densidade e chrome compartilhado (rodada 3)".
