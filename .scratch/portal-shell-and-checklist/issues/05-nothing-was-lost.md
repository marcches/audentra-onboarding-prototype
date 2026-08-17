# 05 — Nothing was lost

Status: done

**What to build:** A student who skipped optional Quests while accepting their
offer meets them again in the portal, and is told — plainly, once — that nothing
they entered was lost. A student who skipped nothing sees no such block at all.

**Why this earns its own slice.** It is the only place where the gate and the
portal touch, and it is the emotional hinge of the whole checklist. The gate lets
a student skip *Health information*, *Campus life* and the *Deposit* by design.
If the portal shows those back without saying why they are there, skipping turns
out to have been quietly costly, and the permission the gate offered was a trap.
The reference prototype gets this exactly right and says so in one sentence:
*"You skipped two details while accepting your offer. We saved your place, so
nothing was lost."*

**The shape.** One block, on the Dashboard, carrying the count, the reassurance,
and one action that resumes. The carried-over Requirements themselves stay in the
ordinary list with everything else — not quarantined into a penalty box. What is
separate is the *explanation*, not the work.

**Conditional on there being any.** No skipped Quests, no block. An empty "you
skipped nothing" state invents a problem the student does not have, and the gate
already knows the answer.

**Read, never write.** The count comes from the gate's store. The portal does not
mark anything in the gate as seen, resumed or acknowledged — that direction is
one-way and `CONTEXT-MAP.md` records it.

**Blocked by:** 02 (the carried-over derivation and the card), 03 (the Dashboard
composition this sits inside).

**Referências:**
- [Vercel](https://mobbin.com/screens/c12cd01b-cd5c-4b48-91fd-fd5fff966e37) — the Production Checklist marks items `Skipped` in the same list as `Done`, struck through rather than removed or sequestered. Skipping is a first-class outcome with its own label, which is the treatment the carried-over Requirements get here.
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8) — unfinished items stay in the main list at full weight rather than being demoted to a secondary area. Confirms keeping the work in the list and separating only the explanation.
- [Tally](https://mobbin.com/screens/0f2523c5-d61e-4384-a934-c169dbb1eaeb) — the drawn-block anatomy this repo adopted in the previous cycle: the true sentence and exactly one action, with nothing padded around it.

- [x] The block appears only when the gate reports skipped optional Steps
- [x] It carries the count, the reassurance that nothing was lost, and one resuming action
- [x] The carried-over Requirements appear in the ordinary list, not in a separate area
- [x] A student who skipped nothing sees no block and no empty state
- [x] The count derives from the gate's store and nothing is written back to it
- [x] `steps.test.ts` and `summary.test.ts` pass unedited
- [x] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** One block in the Dashboard's secondary column, rendered only when
`carriedOver()` returns anything — which it derives from the gate's store, so a
student who skipped nothing sees no block and no empty state.

It sits in the secondary column rather than the primary one because the primary
column's rule is header → one line → cards with nothing between, and this is an
explanation rather than work. The carried-over Requirements themselves stay in
the ordinary list at full weight.

Its action resumes the first of them, which for all three means going back into
the gate's own screen — the portal writes nothing there.
