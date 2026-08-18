# Panel becomes Section, and elevation stops being a signal

> **Superseded entirely by [ADR 0015](./0015-the-room-and-the-band.md).**
> `Section` survives as a composition; elevation stops being forbidden. The
> risk this ADR accepted in writing — *"a screen that reads as a grey wall"*
> — is the thing the designer reported, and it came back as elevation with
> one condition: containment, never reaction.

The density reference the client named is Salesforce, and Salesforce has no
elevated panels: it has **sections** — a labelled header, a chevron, a rule, no
shadow. Keeping the four-surface system of ADR 0006 while adding collapsible
sections would put two frames around the same information, which is the exact
stacking the client has now complained about three times. So `Panel` is
retired and replaced by `Section`: header with label and chevron, separated
from its neighbours by space and a rule rather than by a shadow. `Well` and the
`Ground` survive unchanged; the flat card survives on a Well.

A collapsed `Section` shows **its value, not just its title** — "Where you live
now · 1226 University Dr, Menlo Park". Collapsing therefore reveals progress
instead of hiding it, and that is what lets a whole Step fit in 640px without
deleting a single field.

## Consequences

- Elevation stops being available as a way to say "this is one thing". Everything
  now rests on spacing, rule and label, and the honest risk — accepted
  deliberately — is a screen that reads as a grey wall. The counterweight is the
  ceiling of three surfaces on the vertical axis and the type scale in
  `docs/design-research.md`; if the wall appears, the fix is deleting a Section,
  never re-introducing the shadow.
- Shadow keeps exactly its ADR 0006 reservation: what genuinely floats — modal,
  popover, and now the desktop action pill.
- Selection remains fill plus check. That line of ADR 0006 was never about
  Panels and is not touched here.
- `Section` is the unit the Presence table's row 6 recomposes: one column on
  compact, two on desktop, same DOM, same collapsed state.
