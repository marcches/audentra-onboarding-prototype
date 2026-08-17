# Shared

What the gate and the portal both name. Six terms and one currency — everything
else belongs to one surface or the other, in
[onboarding](./docs/context/onboarding.md) or in
[portal](./docs/context/portal.md).

This file used to be the whole glossary. It was split on 2026-08-17, when the
repo grew a second surface; see [`CONTEXT-MAP.md`](./CONTEXT-MAP.md) for why, and
for the one-directional relationship between the two.

Written in English because the identifiers are: `steps.ts`, `store.ts`,
`points.ts` and the UI copy all use these words, and a glossary that disagrees
with the code is worse than no glossary.

## Language

**Quest**:
The student-facing name for one unit of work, used wherever progress is shown. It
is what the student is invited to finish. What the *system* stores under it
differs by surface — a Step in the gate, a Requirement in the portal — and the
student never meets either word.
_Avoid_: task, to-do, item

> One student-facing word across two surfaces is deliberate. A student who
> finished nine Quests in the gate and meets twelve more in the portal is doing
> the same kind of thing, and renaming it at the boundary would say otherwise.

**Points**:
What completing a Quest is worth. Shown as a price on the Quest being worked and
as a receipt once earned — the same tag doing both jobs. Never a price list of
the whole flow.
_Avoid_: score, XP, credits, momentum

> The price and the receipt are one object, not two. What travels to the Balance
> is the tag the student was already looking at; a figure that appears only on
> completion makes the journey decoration rather than a transaction.
>
> **Not _momentum points_.** The reference prototype the client approved uses
> that name and a ladder of status tiers. The name is a synonym and was dropped;
> the tiers were rejected on the argument in ADR 0002 — see the **Bookstore
> credit** entry.

**Balance**:
The student's running Points total, always shown against what it converts to.
There is exactly one *source* of the number (`points.ts`), and it appears in two
roles: a compact figure that persists across every area, and a rich block that
says what the figure is turning into. See ADR 0013.
_Avoid_: total, wallet

> This entry used to read "there is exactly one Balance in the shell". That was
> a rule about the number's provenance wearing the clothes of a rule about
> placement, and the portal is where the difference started to matter.

**Bookstore credit**:
What Points convert into, and the reason a Point is worth earning. The
destination that makes a number mean something.
_Avoid_: reward, prize, tier, status, level

> `tier` is on the avoid list on purpose and against the reference prototype,
> which counts down to a status called *Trailblazer*. A tier is a name for a
> number; a credit is a thing the student buys. ADR 0002 is the argument, and
> this is the one place the design deliberately diverges from what the client
> approved — declared rather than quietly ignored.

**Student status**:
The answer that decides which documents and which address fields the flow asks
for. Exactly one of: _U.S. citizen_, _Permanent resident_, _International
student_.
_Avoid_: citizenship, residency

**Identity document**:
The proof of Student status the flow requires, which differs by status: a U.S.
passport for a citizen, a driver's licence for a permanent resident, a home
country passport for an international student.
_Avoid_: ID, upload

**Enrollment deposit**:
The one fixed payment that secures the place, credited against the first term's
bill rather than charged on top of it. It can be paid now, paid by the deadline,
or waived — all three are ways of finishing, none is an exit. Named in both
surfaces because a student who did not pay it in the gate meets it again in the
portal.
_Avoid_: fee, tuition, payment
