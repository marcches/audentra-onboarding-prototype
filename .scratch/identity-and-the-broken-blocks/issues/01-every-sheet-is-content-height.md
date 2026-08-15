# 01 — Every sheet is content-height

Status: done

**What to build:** A student on a short Quest sees the sheet end where the work
ends. No block in the flow holds white space under content that has run out, and
no screen stretches a block to reach the fold. Where a screen is short, Ground
shows underneath, and that is the ordinary state of a page rather than a hole.

Three sibling Steps in one Phase have three different bottom edges today, all
measured at 1366×768:

- `who-you-are` §3 — one sentence, then ~90px of white inside the Section.
- `health` §2 — the dropzone, then ~140px of white inside the sheet.
- `who-we-call` — the sheet ends at y≈400, with ~280px of Ground below it.

The first two pass `fill` and `grow`; the last does not. The step shell claims in
a comment that this was solved by "putting something worth reading in the space".
It was not solved. The void moved inside the sheet, which is the version of it
the client photographed.

The one thing that genuinely wanted to be large — Health's dropzone — gets an
honest intrinsic height instead of borrowing the column's slack.

**Blocked by:** None — can start immediately.

**Referências:**
- [Gusto — Upload documents for identity verification](https://mobbin.com/screens/b6ba01f9-4909-4f1d-9e6f-476aa325a7e2) — two dropzones at an honest fixed height, stacked, and the page simply ends after Continue. The dropzone is large because a dropzone is large, not because the column had slack.
- [Revolut Business — Residence permit](https://mobbin.com/screens/cdb70690-cb43-4240-aa6e-d5812fcacfa8) — two compact upload blocks at the top and an empty lower half. Nothing is stretched to meet the action at the foot: this is exactly "Ground under a short sheet is not a defect".
- [PayPal — Upload documents](https://mobbin.com/screens/51b7bb9e-116b-4004-984f-cb38b6f00d90) — the card ends at its content, with the uploaded file listed under the zone rather than the zone growing to swallow the space.

- [ ] `fill` on `Sections` and `grow` on `Section` are deleted from the props, not only from the call sites, so a future screen cannot reintroduce the void by passing them again
- [ ] Health's dropzone carries its own intrinsic height and still reads as somewhere you can throw a file
- [ ] `who-you-are` §3, `health` §2 and `who-we-call` show no white space inside a block that has stopped having content, checked at 1366×768
- [ ] Ground is visible under the short sheets and is accepted rather than filled
- [ ] Every route is checked, not only the About-you Steps
- [ ] The step shell's comment claiming the void was already solved goes with the props it described
- [ ] The layout ruler asserts that neither prop exists anywhere in the sources
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** `fill` left `Sections` and `grow` left `Section` — the props, not
just the call sites — so passing either is a TypeScript error rather than a
review note. Health's dropzone carries `h-[9rem]` instead of `min-h-0 flex-1`,
which also stops its size being a fact about which screen it happens to be on.
The step shell's comment claiming the void was already solved by "putting
something worth reading in the space" went with the props it described.

Verified at 1366x768: `who-you-are` §3 and `health` §2 both measure **0px** of
slack, from ~90 and ~140. `who-we-call` still ends around y≈400 with Ground
below it, and that is accepted rather than filled.

The ruler takes three new assertions: neither prop exists in the surfaces
module, no `.tsx` passes either as a JSX attribute (with string literals blanked
first, so the style guide's caption "Selection is fill and a check" does not
trip a rule about props), and the dropzone carries no `min-h-0`.

**Beyond the ticket.** Ticket 09's browser walk found two more ways a block
could hold white after the props were gone, and both are fixed there rather than
here: a CSS grid row stretching its items to the tallest sibling on Deposit's
receipt, and the `Reveal` keeping its collapsed subtree focusable.
