Status: done

# The portal, cycle one: the shell, the Balance in two roles, and a Dashboard that directs

This repo stops being the onboarding prototype and becomes **the designer's
prototype of the whole student experience**. The gate is finished and is not
touched. What is built beside it is the portal a student lands in afterwards —
in this cycle, the shell and the Dashboard.

The second cycle (`enrollment-and-edward`) takes My Enrollment in full, the
`See how` drawer and Edward's three states. It is split off deliberately: the
client can look at the shell and the Dashboard and say the face is wrong
**before** the checklist is built on top of a wrong face.

Everything below was decided in a grilling session on 2026-08-17 and is recorded
in [`CONTEXT-MAP.md`](../../CONTEXT-MAP.md),
[`docs/context/portal.md`](../../docs/context/portal.md), ADR 0013, ADR 0014 and
the 2026-08-17 round of `docs/design-research.md`. The domain docs were written
**before** this spec rather than as its last ticket, because the vocabulary is
what the tickets are written in.

## Problem Statement

### What the client said

> "Quando você vai falar com financial aid, ele vem em appointments. Cadê a
> pointment na side bar? Então quer dizer que eu não posso simplesmente marcar
> um, sei lá, um suporte em algum dia específico. Eu tenho que entrar em
> financials para falar aqui, entendeu?"

> "Se eu tivesse entrando na universidade agora e eu olhasse isso aqui, eu ia —
> eu aqui quando eu abro ele, eu não tenho direcionamento." … "acho que tem muita
> informação."

> "Ele já traz de cara, sem conversa, o que que tá faltando? Próximos passos. Eu
> acabei de entrar, ele já me mostra, entendeu? Tipo, eu não fico tendo que
> procurar."

> "Essa aqui é obrigatório, mandatório. Pedido do cliente. Essa: se fizer hoje é
> 100, amanhã 99, depois de amanhã 98."

> "A gente não precisa voltar pro design de 2004, mas a gente precisa ser mais
> denso."

### What that is, in the portal that exists

Measured against `Audentra-portals/apps/web` at the commit reviewed on 08-17:

| Defect | Measurement |
|---|---|
| Areas in the sidebar | 9, flat, no grouping. `Appointments` is not among them. |
| Reachable Areas not in the sidebar | `/appointments` exists as a page and has no nav entry. It is reached only from inside Financials. |
| Edward | Occupies a sidebar row (`Edward AI`), i.e. a place you go rather than a thing you have. |
| The landing screen | `/dashboard` renders a financial snapshot, campus events and an Edward brief. It renders no list of outstanding work. |
| "What is missing" | Answerable only by opening `/enrollment` and reading it. |
| Points | One balance in the sidebar. No value on any individual piece of work, and no decay anywhere. |

The student's own version: they accept an offer, land in a portal, and the first
screen tells them how much money they owe and what is happening on campus — but
not what the institution is waiting on them for. Every one of the client's
sentences above is a different angle on that one fact.

### And the target the client approved

A reference prototype exists, built by the client in ChatGPT sites and approved
by the person this work is presented to. It is not a dashboard — it is a
**checklist occupying the home**: `42% · 5 of 12 steps complete`, three ordering
tabs, work grouped by whether the student can act on it, and every card carrying
a deadline, a time estimate, a value and that value's decay.

It also does one thing the design ruler of this repo forbids. Its preamble —
greeting, progress bar, next-task sentence, momentum block, three tabs — pushes
the first card **below the fold** at 1366×768, which is the viewport ADR 0008
names and the ~640px of usable height it measures. A screen that celebrates
progress before showing the next action is doing the opposite of what the client
asked for.

## Solution

**Build the shell the client tried to navigate, and make the Dashboard answer its
own first question above the fold.**

Eight decisions:

1. **The repo grows a second context.** Gate and portal share `Points`,
   `Balance`, `Bookstore credit`, `Student status`, `Identity document` and
   `Enrollment deposit`, and disagree about everything else. `Phase` and
   `Closing` are the gate's. `Requirement`, `Decay` and `Smart order` are the
   portal's. Two glossaries, one map, one ADR sequence.
2. **The portal's unit of work is a Requirement**, and it carries what a Step
   never did: an availability date, a deadline, prerequisites, a state, and a
   value that changes with time. `Requirement` is the word the production portal
   already uses, so the prototype translates without a glossary.
3. **Twelve Requirements**: three carried over from Quests the student skipped in
   the gate, nine new. The carried-over three are the reason the portal can say
   *nothing was lost* and mean it.
4. **The sidebar is grouped and complete.** Nine Areas in three groups, with
   `Appointments` present. `Edward AI` leaves the sidebar. Nine flat rows is the
   point at which a list stops being scannable, which is precisely why the client
   *searched* for Appointments instead of seeing it.
5. **Seven Areas declare honestly that they are not built.** Clickable, with a
   drawn placeholder. A sidebar of dead items repeats the complaint that started
   this work.
6. **The Balance is two roles with one source** (ADR 0013). A compact figure in
   the sidebar, present in every Area; a rich block in the Dashboard's secondary
   column carrying the Bookstore ladder rung and the distance to it.
7. **The first Quest is above the fold at 1366×768.** Greeting and progress on
   one line, the rich Balance in the secondary column, no momentum banner in the
   primary flow.
8. **Decay is shown literally** — `100 pts today · 99 tomorrow` — never as a
   tally of what has been lost. −1/day, floor at 50% of the original value, clock
   starting on the availability date.

### The twelve Requirements

Category badges reuse the gate's Phase names where they apply, which is what the
reference prototype does and what makes the two surfaces read as one product.

| # | Quest | Category | Origin | State at fixture time |
|---|---|---|---|---|
| 1 | Secure your place | Your offer | carried over (Deposit) | Available |
| 2 | Share your health records | Health & wellness | carried over (Health information) | Available |
| 3 | Find your people | Campus life | carried over (Campus life) | Available |
| 4 | Final transcript | Academics | new | Under review |
| 5 | Verify your financial aid | Financials | new | Available |
| 6 | Register for orientation | Academics | new | Available |
| 7 | Choose your meal plan | Campus life | new | Available |
| 8 | Your student ID photo | About you | new | Available |
| 9 | Health insurance | Health & wellness | new | Available |
| 10 | Register for courses | Academics | new | Upcoming (needs 4) |
| 11 | Choose your move-in window | Campus life | new | Upcoming (needs housing assignment) |
| 12 | Meet your academic adviser | Academics | new | Upcoming (needs program assignment) |

Requirements 5 and 6 come from the client's own opening sentences on the call —
*financial verification* and *registro para orientação*. They are not invented to
round the number up.

## User Stories

**Landing, and being directed**

1. As a newly admitted student, I want the first screen to tell me what the
   institution is waiting on me for, so that I do not have to go looking for my
   own outstanding work.
2. As a student, I want the first thing I can act on to be visible without
   scrolling on my laptop, so that the screen directs me rather than congratulates
   me.
3. As a student, I want to see how far through I am as a single line rather than
   as a section, so that the progress figure does not cost me the first action.
4. As a student, I want to know roughly how long the next thing takes before I
   commit to starting it, so that I can decide whether I have time now.
5. As a student who has finished nothing yet, I want the screen to still read as
   a beginning rather than as a backlog, so that I am not discouraged on day one.
6. As a student who has finished almost everything, I want the screen to say so
   rather than showing an empty list with no explanation, so that the end reads as
   an end.

**Finding my way around**

7. As a student, I want to book an appointment without going through Financials
   first, so that talking to somebody is not hidden inside a topic.
8. As a student, I want the sidebar to contain everything the portal can do, so
   that not finding something in it means it does not exist.
9. As a student, I want the nine Areas grouped under headings, so that I can find
   one by category instead of reading all nine names.
10. As a student, I want the sidebar dense enough that it does not take a third of
    my screen, so that the work has the room.
11. As a student, I want to know which Area I am currently in without hunting for
    a highlight, so that I never lose my place.
12. As a student who clicks an Area that has not been built yet, I want it to tell
    me so plainly, so that I do not think the portal is broken.
13. As the client demonstrating this, I want every sidebar item to be clickable,
    so that I can walk the whole map in front of the person I am presenting to.
14. As a student on a phone, I want the Areas reachable from a bottom navigation,
    so that the portal is usable away from a desk.

**The work itself**

15. As a student, I want each piece of outstanding work to name what it is in
    plain words, so that I know what I am being asked before I open it.
16. As a student, I want to see which part of my life a piece of work belongs to,
    so that a checklist reads as my situation rather than as an administrative
    queue.
17. As a student, I want to see the deadline as a date *and* as a distance, so
    that I feel the urgency without doing arithmetic.
18. As a student, I want to see how many minutes something takes, so that I can
    pick something that fits the time I have.
19. As a student, I want to see what a piece of work is worth before I do it, so
    that the value is a price rather than a surprise.
20. As a student, I want to see that today's value is higher than tomorrow's, so
    that I have a reason to act today specifically.
21. As a student, I want the value never to reach zero however late I am, so that
    the reward system does not turn into a bill.
22. As a student, I want to never be shown how many points I have already lost, so
    that arriving late is not punished twice.
23. As a student, I want one obvious action per piece of work, so that I do not
    have to decide how to start.
24. As a student, I want a second, quieter way to ask what something is before
    doing it, so that I can find out without committing.
25. As a student, I want the piece of work at the top to be the one that opens the
    most doors, so that the order is doing something for me.
26. As a student, I want to know *why* the top one is the top one, so that the
    ordering is a claim I can check rather than magic.
27. As a student, I want work that is waiting on the institution to be visibly
    not mine, so that I am not anxious about something I cannot act on.
28. As a student, I want work I cannot start yet to name what is blocking it, so
    that the block is an instruction rather than an obstacle.
29. As a student, I want finished work to leave the list, so that the top of the
    screen is not occupied by things I cannot act on.
30. As a student, I want to be able to find what I finished, so that leaving the
    list does not mean disappearing.

**What I did not finish before**

31. As a student who skipped optional questions while accepting my offer, I want
    to meet them again here, so that skipping was genuinely allowed rather than
    quietly costly.
32. As a student, I want to be told that nothing I entered was lost, so that I do
    not start over out of doubt.
33. As a student, I want the carried-over work to sit in the same list as
    everything else rather than in a penalty box, so that it reads as work rather
    than as a mistake.
34. As a student who skipped nothing, I want no empty "you skipped" block on my
    screen, so that the portal does not invent a problem I do not have.

**Points, and what they turn into**

35. As a student, I want my running total visible from every Area, so that the
    reward is something I have rather than somewhere I visit.
36. As a student, I want the total shown against what it converts to, so that the
    number means something.
37. As a student, I want the rich version of that — what I can get and how far off
    it is — somewhere it has room, so that it is not squeezed into a sidebar.
38. As a student, I want the two versions of my Balance to always agree, so that I
    never have to work out which one is right.
39. As a student, I want the Balance to carry over from the gate rather than reset,
    so that the work I already did still counts.
40. As a student, I want the Balance not to move or animate while I am reading
    something else, so that the screen stays still.

**What the next reader finds**

41. As the next agent on this repo, I want two glossaries rather than one with
    footnotes, so that I can tell which words mean something where.
42. As the next agent, I want `Requirement` and `Step` explicitly distinguished, so
    that I do not model the portal's work with the gate's type.
43. As the next agent, I want the decay rule written as domain language rather than
    only as arithmetic, so that the floor and the clock's start are not re-derived
    from code.
44. As the next agent, I want an ADR explaining why the Balance stopped being one
    thing, so that I do not "fix" it back to a single element.
45. As the next agent, I want an ADR explaining why the portal has its own Presence
    table, so that I do not merge the two and lose the closed count.
46. As a reviewer, I want the one component with no reference in the catalogue
    flagged as such, so that its absence reads as a known risk rather than as
    sloppiness.

## Implementation Decisions

**A new domain module is the portal's spine**, sibling to `steps.ts` and modelled
on it: a data module that derives rather than duplicates. It owns the twelve
Requirements, the state computation, the three orderings, and the decay
arithmetic. Every "N of M" and every ordering in the portal derives from it, the
way every count in the gate derives from `steps.ts`.

**A Requirement's shape.** It carries an id, a path, a Quest label, a blurb, a
category, an availability date, a deadline, a minutes estimate, an original
Points value, and its prerequisites as a list of other Requirement ids. It does
**not** carry its state or its current value — both are derived, because a stored
state and a stored prerequisite list are two facts that can disagree.

**State is derived, never stored.** Complete comes from the store. Under review
comes from a submission the institution holds. Upcoming is any Requirement with an
unmet prerequisite or an availability date in the future. Available is the
remainder. The four are exhaustive and mutually exclusive, and that is what the
domain test asserts rather than a restatement of the fixture.

**Decay is arithmetic on two dates and one number**, and lives in the spine rather
than in `points.ts`. `points.ts` answers what a Point converts to; it has no
opinion about time, and giving it one would put the reward ladder and the deadline
clock in the same module. The value today is the original minus the days elapsed
since availability, floored at half the original, rounded to whole Points. Points
at risk is one per day until the floor is reached and zero afterwards — which is
also why a Requirement sitting at its floor stops rising in Smart order.

**"Today" is a fixture, not `Date.now()`.** The prototype has a fixed notion of
today so that a screenshot taken in November and one taken in March show the same
thing, and so that the tests are not time-dependent. It lives beside the other
fixtures and every date in the spine is expressed relative to it.

**Smart order is a comparator, not a score.** Unlocks descending, then Points at
risk descending, then minutes ascending, with Upcoming Requirements excluded from
the ordering entirely rather than sorted to the bottom — they are in a different
group, so they never compete. A single weighted score was rejected: the weights
would be invented, and the badge on the first card has to be able to say *why*,
which a score cannot.

**`Unlocks` is derived from the prerequisite lists**, counting transitively. A
Requirement that unlocks one Requirement which itself unlocks two has unlocked
three. Counting only direct dependents would make the badge understate the thing
it exists to justify.

**The sidebar is three groups.** `Dashboard` and `My Enrollment` unlabelled at the
top; `ACADEMICS` (My Classrooms, My Campus Life); `ADMIN` (My Financials, My
Documents, Appointments); and `Messages` with `Profile` at the foot. Uppercase
labels at the new metadata step. `Edward AI` is not a row.

**The seven unbuilt Areas share one placeholder component**, taking the Area's
name and one sentence about what will live there. One component rather than seven
routes with their own copy, because seven bespoke empty screens is the "entregando
pouco" the client and I named on the call.

**The Balance is two components reading one module** (ADR 0013). The compact one
is a shell element and obeys the shell's rules: it does not animate on change
while the student is reading elsewhere, and it never reflows a column. The rich
one is Dashboard-only and uses `nextTarget()` from `points.ts` unchanged.

**The Dashboard's vertical budget is a stated target, measured in the acceptance
ticket.** At 1366×768 with browser chrome, the first Quest card is fully visible.
Concretely: the greeting and the progress figure occupy one line, not a section;
the rich Balance and any campus content sit in the secondary column, never above
the primary one; and the primary column goes header → one orientation line →
cards, with nothing between.

**The Dashboard shows the top three Available Requirements**, in Smart order, and
a link to the full list. Three because the fourth is below the fold at HD and a
list that continues below the fold on the *landing* screen recreates the problem.
The full twelve, the three ordering tabs and the state groups are cycle two's.

**The Quest card is a flat card on a Well**, not an elevated one. ADR 0010's
reservation of shadow for what genuinely floats stands, and a list of twelve
shadows is the stacking the client has complained about repeatedly.

**The type scale gains one step, for metadata only** — deadline, minutes, points,
category and urgency. Declared once in the theme beside the existing measures,
the pattern the action-bar height and the archetype measures already follow. The
body and heading sizes are untouched: this is not a rescale.

**The portal's Presence table is created with the rows this cycle actually needs**
(ADR 0014) and no more. The three width classes, the 1366×768 design viewport and
the container-query authority rule are inherited from ADR 0008 unchanged and are
not duplicated.

**The store gains a portal slice and the gate's is read, never written.** The
carried-over three are computed by asking the gate's store which optional Steps
were skipped. The portal never writes into the gate's slice — that direction is
the one-way relationship `CONTEXT-MAP.md` records, and breaking it is how a
student's finished onboarding starts changing under them.

**The carried-over block is conditional on there being any.** A student who
skipped nothing sees no block, not an empty one.

## Testing Decisions

**What makes a good test here.** The repo has no DOM environment. By ADR 0006 the
layout tests assert **source-level invariants** — an escape hatch that does not
exist cannot be misused later, which is stronger than catching it afterwards.
Domain tests assert the *shape* of the spine — derivation, exhaustiveness,
ordering, arithmetic at its boundaries — and never restate the fixture. Nothing
asserts appearance.

**Two seams, one new**, confirmed with the designer before this spec was written.

**The new domain seam** covers the portal's spine:

1. **The four states are exhaustive and mutually exclusive.** Every Requirement
   is in exactly one, for every fixture state of the store.
2. **Upcoming is derived from prerequisites, not declared.** Completing a
   prerequisite moves its dependent out of Upcoming without any state being
   written.
3. **Decay at its three boundaries**: on the availability date the value is the
   original; one day later it is one less; past the floor it stays at half the
   original however many days pass. Never zero, never negative.
4. **Points at risk is zero at the floor**, which is what stops a stale
   Requirement climbing Smart order forever.
5. **Smart order is a total order** — no two Requirements compare equal — and
   excludes Upcoming entirely rather than ranking it last.
6. **Unlocks counts transitively**, asserted against a fixture with a chain
   rather than a flat list.
7. **The carried-over three are derived from the gate's store**, and a student
   who skipped nothing produces none.
8. **The twelve are unique and derived**, in the shape `steps.test.ts` already
   asserts for the nine: no duplicate ids, no duplicate paths, the flat list
   derived from the grouping rather than kept beside it.

**The existing ruler is extended, not duplicated.** `layout-rules.test.ts`
already enforces the repo-wide rules — no breakpoint outside the three width
classes in any `.tsx`, one z-index ladder, nothing animating a layout property,
one celebration layer — and the portal inherits every one of them by being in the
same tree. It takes three new assertions:

1. **The portal's Presence table has exactly the rows this cycle declares**, the
   same closed-count assertion that keeps the gate's at eight.
2. **The metadata type step is declared once, in the theme**, and no component
   reassigns it.
3. **No Quest card carries elevation.** Shadow stays reserved to modal, popover
   and the action pill.

**`points.test.ts` is deliberately untouched and is the tripwire.** If it breaks,
decay leaked into the currency module and the change went further than this spec
asked. `steps.test.ts` and `summary.test.ts` are equally untouched: the gate does
not move in this cycle, and if they break, it did.

**What is deliberately not a test.** The pixels: the first card landing above the
fold, the sidebar reading as dense rather than cramped, the metadata step reading
as metadata rather than as small body text, and the placeholder reading as honest
rather than as broken. Measuring those without a DOM is pretending a test knows
the height of a font. They are **human acceptance at 1366×768**, which is where
the ruler already puts the fold.

## Out of Scope

- **My Enrollment in full** — the twelve in one list, the three ordering tabs, the
  collapsible state groups and the completed-work summary. Cycle two.
- **The `See how` drawer.** Cycle two. The secondary action exists on the card in
  this cycle and is inert.
- **Edward, in all three states.** Cycle two. No FAB is drawn in this cycle —
  drawing a button that does nothing is worse than not drawing it.
- **The other seven Areas as real screens.** They get one shared placeholder and
  nothing else. Financials, Documents, Classrooms, Campus Life, Messages,
  Appointments and Profile are V1.
- **Any change to the gate.** The nine Steps, the three Phases, the Closing, the
  215 Points and every route under it are untouched. The portal reads the gate's
  store and never writes it.
- **Tiers, levels or a status ladder.** Points convert to Bookstore credit. The
  divergence from the reference prototype is declared in `CONTEXT.md` and goes to
  the review as an argument, not as a silent omission.
- **Real dates.** Today is a fixture. Nothing calls `Date.now()`.
- **Compact polish.** Compact is drawn and correct — one DOM, per ADR 0008 — and
  is not polished. The floating assistant window and the two-column maximised
  layout have no compact form at all, and both are cycle two anyway.
- **A rescale of the type system.** One new step, for metadata. Body and headings
  do not move.
- **Multi-tenant theming.** Aster stays. Harvard in the reference prototype is
  that prototype's choice; ADR 0005 sized every fixture in this repo to a
  7,000-undergraduate institution and a rename would make the housing catalogue
  and the organization counts lie.
- **Server state, API clients, optimistic updates and realtime.** This is a
  prototype with fixtures. `Audentra-portals` is the reference for flow, never the
  destination for code.

## Further Notes

**The six tickets, in dependency order.** Two can start immediately.

1. `01-the-balance-becomes-two-roles` — the prefactor. The gate's Balance splits
   into a compact and a rich form reading one source, with the gate visually
   unchanged and no portal code consuming either yet. *No blockers.*
2. `02-tracer-bullet-one-quest-end-to-end` — the spine, a portal route, and the
   Dashboard rendering the top Requirement as a complete Quest card with its
   literal decay. *No blockers.*
3. `03-the-dashboard-above-the-fold` — the composition, the vertical budget, the
   top three in Smart order, the rich Balance in the secondary column. *Blocked
   by 01, 02.*
4. `04-the-whole-map-navigable` — the three-group sidebar with Appointments in
   and Edward out, the seven honest placeholders, the compact bottom navigation,
   and the portal's Presence table. *Blocked by 02.*
5. `05-nothing-was-lost` — the carried-over block, conditional on there being
   any. *Blocked by 02, 03.*
6. `06-the-sweep-and-the-human-acceptance` — every measurement in the defect
   table taken again, at 1366×768 and 390×844. *Blocked by all.*

**These are vertical slices, not layers.** An earlier cut of this spec listed
eight tickets split by layer — a model ticket, a component ticket, a screen
ticket. Each one was individually reviewable and none of them was individually
*demonstrable*, which is the property that matters when the point of the cycle is
to put a face in front of the client early. Ticket 02 is deliberately the largest
in the cycle for that reason: a spine with no screen is a data structure, and a
screen with no spine is a picture.

**The one soft edge is 03 on 01.** The rich Balance is Dashboard content and
could have been built inside 03. It is separate because the gate also draws that
component, and changing something the gate depends on inside the same ticket as a
new screen means that when the number comes out wrong there is no way to tell
which half did it.

**Ticket 05 was a candidate for folding into 03** and was kept apart because it
is the only place the two contexts touch. If it turns out to be three elements
and a sentence, folding it back is the right call and costs nothing.

**What this cycle cannot answer, and who can.** The literal decay display has no
precedent in the reference catalogue — thirty-six screens searched, every one
using a deadline or a countdown instead. It is built as the client specified and
flagged in `docs/design-research.md` as the single component validated by
authority rather than by evidence. The client offered two specialists in U.S.
higher education for exactly this kind of question; this is the question.

**References.** Searched on Mobbin before the solution was proposed, per
`docs/agents/design-references.md`. The full round with the reasoning is in
`docs/design-research.md`; each ticket carries its own `Referências` field.

- The checklist anatomy — value per row, grouped counts, primary plus quiet
  secondary: [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8),
  [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8).
- A checklist as the dashboard's spine:
  [Remote](https://mobbin.com/screens/1a5a8ac8-49f2-467c-ad4f-5e36c2e86936),
  [Wrike](https://mobbin.com/screens/d750f820-568f-4a4f-8540-1692449871de).
- The grouped, dense sidebar:
  [Render](https://mobbin.com/screens/f4e5d3b4-195a-438d-aa0e-a422c91bc5fc),
  [Dovetail](https://mobbin.com/screens/661fe01b-36a7-4e61-8229-68b09cce1dae),
  [Remote](https://mobbin.com/screens/58e6b83b-831e-41ff-9422-a33c928b8b60),
  [Salesforce](https://mobbin.com/screens/d984cf82-47ad-415e-a48f-f098d2bd6210).
- The honest placeholder:
  [Render](https://mobbin.com/screens/f4e5d3b4-195a-438d-aa0e-a422c91bc5fc),
  [Salesforce](https://mobbin.com/screens/d984cf82-47ad-415e-a48f-f098d2bd6210).
- Value chip beside urgency, and the Balance in a right-hand column:
  [OpenSea](https://mobbin.com/screens/516ee107-5c44-4af4-b299-df1bd30711cf),
  [Uxcel](https://mobbin.com/screens/165ede79-21ff-4a81-adda-68a942c39c21).
