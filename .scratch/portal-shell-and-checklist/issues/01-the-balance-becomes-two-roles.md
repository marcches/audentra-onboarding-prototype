# 01 — Prefactor: the Balance becomes two roles

Status: done

**What to build:** The Balance the gate already draws splits into a compact form
and a rich form, both reading one source. Nothing in the gate changes on screen,
and no portal code consumes either one yet.

This is the expand half of ADR 0013, done before anything needs it. The portal
wants the compact figure in a shell that persists across every Area, and the rich
block — the Bookstore ladder rung and the distance to it — in a Dashboard column
that has room for it. Building that split at the same time as a new screen mixes
a change to something the gate depends on with a change to something nobody has
seen yet, and when the number comes out wrong there is no way to tell which half
did it.

**One source, two roles.** `points.ts` is not modified. `nextTarget()`,
`creditReleased()` and the ladder stay exactly as they are — the split is about
how the answer is presented, never about who computes it. The invariant that
survives is *there is exactly one source of the number*, which is what the
retired "exactly one Balance in the shell" line was actually protecting.

**The compact form obeys shell rules.** It does not animate on change while the
student is reading something else, and it never reflows the column beside it. The
`CountUp` the gate uses at the moment of earning stays where it is and does not
follow the figure into a permanent element.

**Verifiable on its own:** the gate is pixel-identical before and after, and
`points.test.ts` passes without being edited.

**Blocked by:** None — can start immediately.

**Referências:**
- [Wrike](https://mobbin.com/screens/d750f820-568f-4a4f-8540-1692449871de) — the compact role: a `Quick start` progress figure living permanently in the sidebar, small enough to survive every screen and carrying no explanation of its own.
- [OpenSea](https://mobbin.com/screens/516ee107-5c44-4af4-b299-df1bd30711cf) — the rich role: `Total XP`, the treasures it converts to and a loyalty bar, in a right-hand column that has the room the sidebar does not.
- [Uxcel](https://mobbin.com/screens/165ede79-21ff-4a81-adda-68a942c39c21) — both at once on one screen, which is the arrangement this split exists to make possible: a compact figure in the header and a richer reward block in the right column, agreeing with each other.

- [x] Two Balance forms exist, both reading `points.ts`
- [x] `points.ts` is not modified and `points.test.ts` passes unedited
- [x] The gate is visually unchanged
- [x] The compact form does not animate on change and does not reflow its neighbour
- [x] No portal code consumes either form yet
- [x] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** `Balance` with a three-value `variant` became `CompactBalance` and
`RichBalance` in `src/components/balance.tsx`, both reading `points.ts`, which
was not modified — `points.test.ts` passes unedited.

The seam is a `celebrates` flag rather than two components with different
sources. In the gate both forms are where the award's flight lands, so the Rail,
the PhaseBar and the style guide pass it and render exactly what they rendered
before. A permanent shell element does not: the portal passes nothing, so the
compact figure never animates on change while the student is reading elsewhere.
`shrink-0` and tabular numerals are what keep it from reflowing its neighbour.

No portal code consumed either form in this ticket; the shell arrived in 02.
