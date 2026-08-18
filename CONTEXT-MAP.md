# Context Map

This repo held one context until 2026-08-17. It now holds two, because it stopped
being the onboarding prototype and became **the designer's prototype of the whole
student experience** — the gate a newly admitted student walks, and the portal
they land in afterwards.

The two share a vocabulary at the edges and disagree in the middle, which is the
whole reason they are separate files. `Phase` and `Closing` mean something only
inside the gate. `Requirement`, `Decay` and `Smart order` mean something only
inside the portal. `Points` means the same thing in both, and there is exactly
one definition of it.

## Contexts

- [Shared](./CONTEXT.md) — the terms both surfaces name. Read this first; the
  other two assume it.
- [Onboarding](./docs/context/onboarding.md) — the gate. From receiving an offer
  to securing a place. Nine Quests, three Phases, a Closing.
- [Portal](./docs/context/portal.md) — where the student lands once the gate is
  behind them. The enrollment checklist, the areas around it, and Edward.

## Relationships

- **Onboarding → Portal**: one direction only. The gate *produces* the portal's
  starting state. A Quest the student skipped in the gate arrives in the portal
  as a carried-over Requirement, which is why the portal can honestly say nothing
  was lost. The portal never writes back into the gate.
  The one exception is named and lives in `src/lib/demo.ts`: on a machine where
  the gate's store has never been touched, opening the portal seeds a finished
  gate. That is the prototype's bootstrap rather than a consequence of anything
  the student does in the portal — the rule it excepts is about *consequence*,
  because a finished onboarding that changes under the student is the worst thing
  this repo could do.
- **Shared ← both**: `Points`, `Balance` and `Bookstore credit` are one currency
  with one source of truth (`src/lib/points.ts`). A student's total does not
  reset at the boundary, and neither surface owns the number.
- **Not modelled here**: the staff portal. Journeys, requirement authoring and
  the form builder are decided there and are somebody else's context. This repo
  only ever sees their output.

## ADRs

One numbered sequence at [`docs/adr/`](./docs/adr/), covering both contexts. A
decision is dated and does not move house when the repo grows a second context —
ADR 0001 through 0012 are the gate's, 0013 onward begin to be the portal's, and
the numbering says when rather than where. ADR 0015 is the first that is neither:
it decides the visual system for both surfaces at once, which is the point of it
— a rule that stopped at the boundary would be how the product grows two skins.
