# 07 — The nine Steps recomposed

**What to build:** Every Step of the gate — all nine, across the three Phases and
the Closing — sits on the new system. A student filling in the longest form in
the product reads it at the new body size, in the new rhythm, with containers
that are rounder and controls that are not.

This is the largest **migrate batch** of the expand–contract and the one where
the compression was worst: the deleted small type step and the half-step spacing
utilities are concentrated in form-dense screens, and the uppercase label is
removed here more often than anywhere else.

**The vertical budget is the constraint that decides this ticket.** Body moves 14
→ 15 and headings grow, which costs height on precisely the screens that have the
least of it. The height is bought back from the deleted type steps, the new
spacing rhythm, and — where a screen still does not fit — by deleting a Section,
which is what ADR 0010 prescribed for exactly this situation and what ADR 0015
carries forward. It is never bought back by shrinking the type: the client
already read a shrunk scale in the browser and called it what it was.

**Blocked by:** 06 — The gate's shell recomposed.

**Status:** ready-for-agent

**Referências:**
- [Brilliant](https://mobbin.com/screens/69ca0993-5784-44b6-b0c2-de41614a91fb) — round containers with markedly less round controls inside them, which is the ratio that keeps a form dense while the surface reads soft.
- [Xero](https://mobbin.com/screens/2ada8534-eb4c-4bc9-81d6-e2d37cfb4d97) — a step that puts the decision and its options on one side and refuses to fill the rest with chrome, so the choice is the screen.
- [Midday](https://mobbin.com/screens/72304bea-11b7-48f7-a870-a2263f475090) — generous inner padding with almost no borders, which is where the height for a larger body size comes from.

- [ ] All nine Steps read the new tokens
- [ ] No uppercase label survives anywhere in the gate
- [ ] Every Step's fields are visible at once at 1366×768
- [ ] Where a Step did not fit, a Section was deleted rather than the type shrunk
- [ ] Containers are rounder and controls are not
- [ ] The revealed block still appears below its trigger, with nothing above it moving
- [ ] A primary button's width still does not react to its own label
- [ ] The gate's existing domain tests pass unedited
- [ ] The old tokens are untouched and still resolve
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
