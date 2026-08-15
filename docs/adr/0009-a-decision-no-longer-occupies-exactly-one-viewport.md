# A decision no longer occupies exactly one viewport

ADR 0006 gave the `decision` archetype `h-dvh overflow-hidden`: it fills one
viewport at any width, and if the content does not fit it loses content rather
than the constraint. That rule was written against 452px of dead white measured
on Your offer in a 1440px window, and it worked there. Against the HD viewport
of ADR 0008 it inverts: with ~640px of usable height the clipping eats the
programme description and the "what accepting does" block — the two things that
tell the student what they are signing. The remedy became the defect, and the
client saw it directly ("tinha uns que tavam cortados").

The constraint is now narrower and survives both viewports: **the decision
itself — the title and the two actions — is visible without scrolling; its
supporting material may sit below the fold.** `overflow-hidden` is gone and the
screen scrolls.

## Consequences

- This supersedes the `decision` half of ADR 0006. The four drift invariants in
  `src/lib/layout-rules.test.ts` are untouched — they are about the same screen
  landing on the same pixels, which scrolling does not threaten.
- The original complaint stays answered by the archetype measure
  (`--decision-measure`, 82rem) and the two-column composition, not by clipping.
- "Cortado" is now a bug with two named causes rather than a vibe: this one, and
  the fixed action bar covering the foot of the column on short viewports. Both
  are fixed at the source; neither gets a per-device inventory.
