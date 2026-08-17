Status: ready-for-agent

# The portal, cycle one and a half: the voids closed, the two surfaces reconciled, and an institution on the screen

The portal shell and the Dashboard shipped. Walked in front of the person it is
for, the verdict was that it *reads as incomplete and inconsistent* — and the
hypothesis offered was that the density ruler had gone too far.

**The measurements say the opposite.** Density is working: a Quest card is 156px,
a sidebar row is 29px, the first card ends at y=241 and all three fit above the
fold. What is wrong is that the dense content **stops**, and what is under it is
grey. This cycle spends the space that measurement found, reconciles the portal
with the gate it was built beside, and puts the institution on a screen that
currently has a crest and nothing else.

Everything in the previous cycle stands. Nothing here revokes a decision; three
things here *extend* one, and each says so.

## Problem Statement

Measured on the shipped portal at 1366×768, in a browser:

| Defect | Measurement |
|---|---|
| Void below the Dashboard's content | **195px** of Ground, full width |
| Void in the Dashboard's secondary column | content ends at y=403 — **365px** |
| Void in the sidebar | last Area at y=401, Balance at y=735 — **334px** |
| Void on each unbuilt Area | sheet ends at y=188 — **580px**, on eight screens |
| The portal's `h1` | **20px**, against the gate's **28px** (`--text-h1`) |
| The brand signature in the portal | **0** hairlines; the gate signs every work sheet (ADR 0012) |
| The Balance on arrival | **0 points**, `$0 in bookstore credit` |
| Primary actions competing on the landing screen | **3**, all violet, stacked |
| Institutional facts on any portal screen | the crest, the university's name, the student's first name. **Nothing** about programme, degree, term, student number, campus or the academic calendar |

Three separate causes, and reading them as one is what makes the whole thing feel
unfinished:

**1 · Void, not density.** Lowering the density would fill the screen with air
instead of with information, which is the ADR 0009 defect (*"coisas jogadas no
fundo"*) arriving on the landing screen by a different door. The portal shows
**3 of 12** Requirements and then stops; the other nine are behind a link to a
screen that does not exist yet.

**2 · Two surfaces that do not look like one product.** Title at 20 against 28.
No signature hairline anywhere. The Balance is a rich tile at the foot of the
gate's Rail and an orphaned chip at the foot of the portal's sidebar, 334px below
the last thing above it. Each was a defensible local decision; together they read
as two teams.

**3 · No institution on the screen.** `fixtures.ts` already holds `Computer
Science`, `Bachelor of Science`, `Fall 2027`, `Main Campus`, `AST-2027-014882`,
`Class of 2031`, and a crest carrying `1867` and a motto. The portal uses none of
them. The most institutional artefact in this repo is the student card on the
gate's arrival screen, and the surface where the student actually lives inherited
nothing from it.

A fourth thing the calendar exposes: with `TODAY = 2027-08-08`, `Secure your
place` is due **Nov 16** — after Fall 2027 teaching begins. The dates were
written to make one card read well and never checked against a term.

## Solution

**Spend the space, on the three things a university portal owes the student:
the rest of their list, who they are here, and when things happen.**

1. **The rest of the twelve becomes compact rows** under the three cards. Name,
   category, deadline and value on one line, with its state. No ordering tabs and
   no collapsible groups — those are My Enrollment's, in the next cycle, along
   with the completed-work summary. This is the Bonsai/Square/Wix anatomy adopted
   in part: one item at full weight, the rest as rows.
2. **The greeting line gains a thin progress bar**, on the same line as the
   figure. The previous cycle cut the *ring* that pushes the first card below the
   fold; four of six references pair the count with a bar, and a bar on an
   existing line costs no height.
3. **The academic identity block** takes the secondary column under the Balance:
   programme, degree, term, campus, student number and `Class of`, over a
   contained campus photograph. This is what makes it a university system rather
   than a violet SaaS with a crest in the corner.
4. **Key dates** sit under it — orientation, move-in, teaching, add/drop, the
   first term's bill — from one new fixture, and **every Requirement deadline is
   re-based against them** so nothing is due after teaching starts.
5. **The portal is signed like the gate.** The `h1` moves to `--text-h1`, the
   work sheet carries the gradient hairline that ADR 0012 admits, and the compact
   Balance moves to sit against the last Area rather than 334px below it.
6. **One primary action per screen.** Only the lead Quest card keeps the violet
   button; the other two go secondary. Three primaries stacked is three
   invitations arguing.
7. **`Appointments` is built for real** — the Area whose absence started this
   whole body of work. Services, a day of slots, a booking, and the booking
   appearing where the student can find it again.
8. **The other seven placeholders get a body**: what will live there as a short
   labelled list, and one true pointer to where the student can act meanwhile.
9. **The portal opens with the gate behind it.** A student arriving at `/portal`
   with a completely untouched gate store gets a finished-gate demo state, so the
   Balance opens at 180 of 215 with three Quests genuinely skipped. It is the
   prototype's bootstrap, not the portal writing the gate — see below.
10. **The gate hands over.** The arrival screen gains one link to the portal.
    This is the single deliberate exception to "the gate does not move".

## Implementation Decisions

**The one-way rule survives, with one bootstrap named out loud.** The portal
never writes the gate's store *as a consequence of anything the student does in
the portal*. The demo seed is a different act: it runs only when the gate store
is **pristine** — no offer response at all — and it exists because this repo is a
prototype whose portal presupposes a finished gate. It lives in `src/lib/demo.ts`
so that grepping for it finds every line of it, and `CONTEXT-MAP.md` records the
exception beside the rule.

**The compact row is not a small card.** It carries name, category, deadline and
value. It drops the minutes estimate and `See how`, because a row the student is
scanning does not support two more fields and because the full weight of a card
has to keep meaning something.

**Under review and Upcoming rows are visibly not the student's move.** Under
review says who holds it; Upcoming names what it waits on, from `waitingOn()`,
which the spine already derives and nothing has rendered yet.

**The academic block reads `fixtures.ts` and adds nothing to it** except the
calendar, which is genuinely new and which the deadlines then derive against.
`institution`, `offer`, `studentRecord` and `enrollment` already hold every other
fact.

**The photograph is contained.** One image, at the head of the secondary column,
short. Not a hero band across the top: the fold budget is the constraint that
survived from the last cycle, and the first card ending above y≈300 is the number
this cycle must not break.

**Appointments is built to the depth the demo needs and no deeper.** Three
services, a week of days, slots per day, one booking at a time, stored in the
portal's own slice. No rescheduling, no cancellation policy, no staff profiles.

## Testing Decisions

**The spine's tests are the tripwire and are not edited.** `portal.test.ts`
asserts derivation, exhaustiveness, ordering and the decay boundaries — none of
which this cycle changes. Re-basing the calendar must not touch a single
assertion; if it does, a test was restating the fixture and that is the finding.

**Three new domain assertions**, in `portal.test.ts`:

1. **Every Requirement's deadline falls before teaching begins.** The defect this
   cycle found, expressed so it cannot come back.
2. **Every Requirement is available on or before its deadline**, which is the
   weaker invariant that should always have been there.
3. **The demo seed produces a finished gate and exactly three carried-over
   Requirements**, asserted against the seed rather than against a screenshot.

**Two new ruler assertions**, in `layout-rules.test.ts`:

1. **The portal's `h1` reads the same token as the gate's.** No component sets a
   title size of its own.
2. **The portal signs each screen once**, the assertion the gate already carries,
   extended to the portal's shell.

`points.test.ts`, `steps.test.ts` and `summary.test.ts` stay untouched, for the
third cycle running.

## Out of Scope

- **My Enrollment in full** — ordering tabs, collapsible state groups, the
  completed-work summary. Still the next cycle's, and the rows here are
  deliberately not it.
- **Edward, in all three states.** Unchanged from the last cycle.
- **A second typeface.** The institution arrives as *facts on the screen*, not as
  a serif. Satoshi is the brand's, and a second voice is a decision the Audentra
  brand already took.
- **Real booking.** Appointments writes to a fixture-backed local slice.
- **Any other change to the gate** beyond the one hand-off link.
- **Tiers.** Still declared divergence, still ADR 0002.

## Further Notes

**Six tickets.**

1. `01-one-product-not-two` — the h1, the signature, the Balance's position, one
   primary per screen, the progress bar, the hand-off link, the demo seed. *No
   blockers.*
2. `02-the-rest-of-the-twelve` — compact rows, and the two states nothing has
   drawn yet. *No blockers.*
3. `03-who-you-are-at-aster` — the academic block, the calendar fixture, the
   re-based deadlines, the contained photograph. *No blockers.*
4. `04-appointments-built` — the Area the client searched for. *Blocked by 01.*
5. `05-the-placeholders-get-a-body` — the other seven. *Blocked by 01.*
6. `06-the-sweep` — every void re-measured, both viewports, the gate re-walked.
   *Blocked by all.*

**References.** The round is recorded in `docs/design-research.md` under
2026-08-17 (tarde), declared as validation *after* the code — which is what the
references gate calls a justification, and is written down as one.
