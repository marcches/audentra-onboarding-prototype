# 08 — What gets written down

Status: done

**What to build:** The round reverses a decision from the last one and deletes a
subsystem. Both are the kind of thing a reader finds in six weeks and cannot
reconstruct, so both get written down where that reader will be standing.

**`CONTEXT.md`.** The **Phase** entry says About you "is now four Steps ...
because a Phase can be described loosely and a form cannot". It becomes three,
with a note saying what moved and why the reasoning survives the change.
**Emergency contact** joins the glossary: it is a term the flow uses, it is
capped at two, and it is not the same thing as Family access, which the copy has
conflated more than once.

**ADR 0011 — About you is three Steps, and status variation drops a level.** Hard
to reverse (the storage shape and the summary both follow it), surprising without
context (the previous commit argued for four), and a real trade-off (the
five-minute Step, against the ping-pong the four-Step split was built to stop).

**ADR 0012 — Where the Audentra signature may appear.** Flat violet is state, the
gradient is brand, the signature lands once per screen on the work sheet and on
the Section marker, and the institution keeps the top of the rail. Written down
because "a little brand colour here too" is a decision that gets remade every
fortnight until it is a stripe on every component.

**`docs/copy-inventory.md`.** The Step list drops to nine, and the four prose
rules from ticket 02 are already there — this ticket checks they are, and that no
line in the file still describes a flow of ten Steps.

**Blocked by:** 02, 03, 04, 06, 07 — every decision this records has to have
shipped, or the documents describe an app that does not exist yet.

**Referências:**
- [Gusto — Personal information](https://mobbin.com/flows/4c148fb2-f611-4b54-bc2d-4eebdb50dc58) — the precedent ADR 0011 cites for the address living inside the personal-details step.
- [Remote — "01. Government ID / 02. Selfie"](https://mobbin.com/flows/24d47336-90f8-4027-9299-13ad2311ddac) and [Twenty](https://mobbin.com/screens/f0170497-9df6-4b27-9bdc-ab606ee77530) — the two ADR 0012 cites for brand colour carrying a number on a section header rather than carrying a status.

- [ ] `CONTEXT.md`'s **Phase** entry says three Steps, names what moved, and keeps the reasoning that survives the change
- [ ] **Emergency contact** is in the glossary, distinct from Family access, with the cap of two stated
- [ ] ADR 0011 records About you as three Steps and the drop of status variation one level, with the trade-off argued rather than asserted
- [ ] ADR 0012 records where the Audentra signature may appear and where it may not
- [ ] `docs/copy-inventory.md` lists nine Steps and carries the four prose rules
- [ ] No document in the repo still claims the flow has ten Steps or that About you has four
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** `CONTEXT.md`'s **Phase** entry says three Steps, names what moved,
and keeps the half of the reasoning that survives. **Emergency contact** is in
the glossary with the distinction from Family access written out — who Aster
calls, against who may ask.

**ADR 0011** records About you as three Steps with the trade-off argued rather
than asserted, and lists what reversing it would cost. **ADR 0012** records where
the signature may appear, and where it may not, including why the two catalogues
carry none.

`docs/copy-inventory.md` lists nine Steps with the address folded into Who you
are, and carries the four prose rules, the rewritten FERPA block, the drawn empty
state and the cap of two. `docs/review-script.md` lost the retired screen, gained
this round's checks, and takes the acceptance measurements from ticket 09. The
README's test table and `docs/design-research.md` stop saying ten.

No document in the repo still claims ten Steps or four About-you Steps, except
ADR 0011 where the reversal is the subject.
