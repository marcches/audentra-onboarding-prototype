Status: delivered 2026-08-15 (`b241431`) — os dezessete tickets estão fechados;
a passada de entrega linha a linha está em `source-requests.md`

# Onboarding, rebuilt from the spine out

Written from the grilling session of 2026-08-15. Twenty questions, all answered
by the client; every decision below is his. Six parallel research fronts backed
the questions themselves — the references are in each ticket's `Referências`
field, per `docs/agents/design-references.md`.

## Problem Statement

The student onboarding flow has been through two rounds of correction and is
still, in the client's words, a set of screens rather than a product. The
specific complaints:

- The flow reads as things thrown onto a background. There is an app shell but no
  shell for the content inside it — screens draw straight onto the canvas.
- The density correction overshot. The rail is too short, Your offer occupies a
  fraction of a 1440px viewport and leaves the rest white, and the emptiness was
  measured last round (452px on Offer, 443px on Health) and filed rather than
  fixed.
- Identity & contact is one Step carrying four subjects and 1068 lines. The
  client on the review call described the defect precisely — name, then contact,
  then name again, then contact again — and two rounds of accordion work have
  hidden it rather than removed it.
- The conditional logic the review call asked for was specified in a previous
  spec and never built: Student status still does not decide which Identity
  document is asked for, and an international student is still shown a U.S.
  address block.
- Health information reads as a strange detour, because it was placed by an
  earlier agent's judgement rather than derived from the flow.
- Housing photographs cannot be enlarged. There is no zoom and no viewer.
- Campus life offers nine invented clubs. A U.S. university has hundreds, chosen
  in person at an Involvement Fair after classes begin — so both the scale and
  the verb of that screen are wrong. Its detail modal is, in the client's words,
  useless as it stands.
- Review & sign opens on an unlabelled legal document, with the summary of
  everything the student answered buried below the fold. The client bats an eye
  at it and cannot tell what it is.
- The Deposit flow is bad enough to be redrawn from nothing.
- The gamification is timid. Points should be larger, slower, more identifiable,
  and the whole flow should feel theatrical rather than polite.

Underneath all of them, the client's own diagnosis: each round inherited the
previous agent's structure and redecorated it. The structure is the defect.

## Solution

Rebuild the spine rather than correct the screens. The domain in `CONTEXT.md`
holds; what changes is the sequence of Steps, what each one asks, and the visual
system they are built from.

**Ten Steps, three Phases, a Closing**, each Step levelled at one to three
minutes:

| Phase | Quests |
|---|---|
| **Deciding** | Your offer |
| **About you** | Who you are · Health information · Where you live · Who we call, who can see |
| **Your life on campus** | Housing · Campus life |
| _Closing_ | Review & sign · Deposit |
| _After_ | Enrolled |

Delivered as one release, in dependency order: foundation, then spine, then
voice, then screens. No intermediate review gate — the client chose a single
delivery knowing the risk that a wrong foundation multiplies across ten screens.

Four things change everywhere at once:

**A content shell.** Four surface levels — Ground (recessed, holds no content),
Panel (elevated, frames a subject, may carry its own header and footer), Well
(inset within a Panel, for lists, uploads, previews, summaries and grids), and a
flat card that exists only on a Well. Three documented exceptions where content
sits on the Ground: a full-bleed catalogue, a section label, and the asymmetric
checkout.

**Authored motion.** The stillness ruler is cut down to the four lines that
prevent *drift* — the same element landing on different pixels depending on how
you arrived. Everything else is released so choreography can exist. The four
survivors are enforced by a rewritten source-level test; the revoked lines are
deleted from the ruler and from the test together.

**Points as a transaction.** A Point value is shown as a price on the Quest being
worked and the one after it, and the same tag becomes the receipt once earned.
What flies to the Balance is the object the student was already looking at. A
seven-beat, ~2.6s choreography with 300ms of total stillness in the middle.

**Campus life as discovery.** No U.S. university has students join clubs during
enrolment; they join in person at the Involvement Fair. The Step produces an
Interest list and a route through that fair, not a membership.

Aster University is fixed as a mid-size private institution of ~7,000
undergraduates, which sets every catalogue size and price in the fixtures.

## User Stories

1. As a newly admitted student, I want every screen's content to sit inside a
   frame that belongs to one system, so that the product reads as an application
   rather than a set of documents.
2. As a student on a 1440px display, I want Your offer to fill the viewport
   deliberately, so that I am not looking at 450px of white below the only
   decision on screen.
3. As a student, I want the offer to be decidable without scrolling, so that I
   can see the whole of what I am accepting at once.
4. As a student reading my offer, I want to know what accepting actually does
   before I accept, so that the decision is informed rather than a leap.
5. As a student who accepts, I want a large, celebratory moment rather than a
   small dialog, so that the milestone feels like one.
6. As a student in that moment, I want an inviting prompt to tell people, tied to
   earning Points, so that sharing is part of the reward rather than an ask.
7. As a student, I want to answer each subject exactly once, in one place, so
   that I never feel like I am repeating myself.
8. As a student, I want each Step to cover one subject and take one to three
   minutes, so that no single screen feels like the whole form.
9. As a U.S. citizen, I want to be asked for a U.S. passport, so that the upload
   matches what I can actually provide.
10. As a permanent resident, I want to be asked for a state-issued driver's
    licence, so that the document proves what the university needs it to prove.
11. As an international student, I want to be asked for my home country passport,
    so that I am not asked for a U.S. document I do not have.
12. As an international student, I want the U.S. address block not to appear at
    all, so that I am not filling in a state dropdown that cannot apply to me.
13. As a U.S. citizen or permanent resident, I want state and city as selects
    with the city list scoped to the state, so that my address is well-formed.
14. As a student, I want the mobile number to be one compact row, so that a
    single field does not occupy a block of the screen.
15. As a student, I want helper text only where a field is genuinely ambiguous,
    so that explanation is not itself the bulk I am scrolling past.
16. As a student, I want to see how long each Step takes and whether it is
    optional, so that I can judge what I am about to do.
17. As a student, I want the total time announced once before the first field, so
    that I know what I am starting.
18. As a student with a disability or health condition, I want a dedicated
    optional Step to disclose it and attach documentation, so that it is not
    folded into a screen about clubs.
19. As a student on that Step, I want to attach medical documentation and an
    immunization record as separate uploads, so that I am not guessing what goes
    where.
20. As a student who skips it, I want to be told plainly that the portal will
    require this later, so that I am not ambushed.
21. As a student, I want the health uploads to sit near the identity upload, so
    that everything requiring a document is in one part of the journey.
22. As a student granting family access, I want to record their name, email,
    relationship, and exactly what they can see, so that the FERPA record is
    complete.
22a. As a student being asked who may see my record, I want a brief explanation
    of FERPA before the fields, so that I understand what I am exercising.
22b. As a seventeen or eighteen year old, I want to be told that the right to my
    education record transferred from my parents to me when I enrolled, so that
    I understand why this decision is mine and can explain it to them.
23. As a student choosing housing, I want to browse Residences with photographs
    the way I would on a travel site, so that "where would I live" is answered
    with a picture.
24. As a student looking at a Residence photograph, I want to open it full screen,
    move between images, and close it, so that I can actually see the room.
25. As a student comparing Residences, I want the facts a U.S. university
    actually publishes — room types, bathroom arrangement, air conditioning,
    laundry, walk time, meal plan, capacity, learning communities — so that I am
    comparing on something real.
26. As a student, I want to rank a Shortlist of three out of the catalogue, so
    that I state a preference the way universities actually collect it.
27. As a student, I want to be told plainly that a preference is a request and
    not an assignment, so that I am not surprised in July.
28. As a student browsing Campus life, I want to see the true scale of what the
    university offers, so that the screen is not a token gesture.
29. As a student, I want to filter organizations by category, cost, weekly time
    commitment, and how you join, so that I can narrow hundreds down to the few
    that fit my life.
30. As a student considering an organization, I want a detail view answering what
    it is, what it costs, how much time it takes and how you get in, so that I am
    not committing on a name and one line.
31. As a student, I want marking an organization to mean I am interested rather
    than enrolled, so that the screen tells me the truth about how joining works.
32. As a student who marks interests, I want the result to be a route through the
    Involvement Fair with its date and place, so that the Step produces something
    I can use.
33. As a student, I want Campus life to be clearly optional, so that I can move on
    without penalty.
34. As a student reaching Review & sign, I want to see immediately what the screen
    is, so that I am not staring at an unlabelled contract.
35. As a student on that screen, I want my own answers before the agreement, so
    that I check my data before reading the document built from it.
36. As a student, I want each section as a card with its own status and a single
    edit control, so that fixing one answer is obvious.
37. As a student, I want a collapsed section to still summarise itself in a line,
    so that closing it does not blind me.
38. As a student, I want to be told how many answers there are and how many need
    attention, so that I know whether I am done.
39. As a student, I want a long free-text answer shown as a block rather than
    squeezed into a two-column list, so that it is readable.
40. As a student, I want to sign in a way that reads like signing, so that I trust
    what I am doing.
41. As a student paying the deposit, I want a checkout that works like the ones I
    have used to buy things online, so that I already know how it works.
42. As a student, I want an amount summary pinned beside the form ending in a
    bolded amount due today, so that I always know what I am paying.
43. As a student, I want to be told the deposit is credited against my first
    term's bill, so that it does not read as an extra charge.
44. As a student, I want to review before the irreversible button, so that I can
    correct a mistake.
45. As a student, I want the button to say the amount, so that nothing is hidden
    behind a generic verb.
46. As a student who cannot pay now, I want paying by the deadline or requesting a
    waiver to be a complete outcome with its own receipt, so that I am not left
    without confirmation.
47. As a student who has paid, I want a receipt and a plain statement of what
    happens next, so that I know the money landed.
48. As a student who finishes everything, I want to be handed an object rather
    than a message, so that the end of the flow is something I can keep.
49. As a student at the end, I want my Points total and what it converts to shown
    at full size, so that the reward is realised rather than implied.
50. As a student at the end, I want the primary action to be spending the credit
    rather than closing the page, so that the reward has a destination.
51. As a student at the end, I want a shareable card, so that I can tell people
    without screenshotting a dashboard.
52. As a student, I want finishing a Quest to be staged with real weight — an
    award that is large, slow and identifiable — so that progress feels earned.
53. As a student, I want to see what a Quest is worth before I do it, so that the
    award afterwards is a transaction rather than a surprise.
54. As a student, I want the award to travel to a single Balance in the same place
    on every screen, so that I know where my Points live.
55. As a student, I want the Balance to state what my Points convert to and what I
    still need for the next thing, so that it is a wallet and not a scoreboard.
56. As a student, I want a conditional field to appear directly below the control
    that revealed it, so that nothing above me moves.
57. As a student, I want a radio option to carry its consequence in its own label,
    so that I understand what choosing it means.
58. As a student on a phone, I want a layout designed for the phone rather than a
    narrowed desktop, so that the default case is the good one.
59. As a student on a desktop, I want a composition designed for the width, so
    that space is used rather than left over.
60. As a student, I want the same screen to land in the same place however I
    arrived at it, so that the product does not flick.
61. As a student, I want selection marked by fill and a check rather than by
    lifting a card, so that choosing does not make the page jump.
62. As a student reading the flow, I want warm language in the moments and precise
    language in the forms, so that neither register is doing the other's job.
63. As a product reviewer, I want every screen to look like the same system, so
    that review time is not spent relitigating the foundation.

## Implementation Decisions

### Foundation before screens

The visual foundation lands first and every screen is built against it. This is
the single largest risk in the delivery and is accepted knowingly: the client
chose one release with no intermediate gate, so a wrong foundation is discovered
with ten screens already built on it.

### Surfaces

Four levels, distinguished by one step of luminance and at most one border.
Shadow is reserved for things that genuinely float — modal, popover, the fixed
bar.

- **Ground** — the recessed page. Holds titles, section labels, spacing. Never a
  field, a row, an image, a datum or the primary action.
- **Panel** — elevated, framing one subject. Optional header (title, subtitle,
  one secondary action, divider) and optional footer (metadata left, action
  right). May contain anything, including Wells. Never another identical Panel.
- **Well** — inset within a Panel; fill without border, or a dashed border.
  Always darker than the Panel, never darker than the Ground. Holds read-only
  summaries, file lists, dropzones, previews, threads and grids. Never the
  primary action and never an elevated card.
- **Flat card** — border-thin, shadowless, image bleeding to the edge. Exists
  only on a Well acting as the local ground for a collection.

Three exceptions where content sits directly on the Ground, each with a
reference behind it: a catalogue that *is* the screen (Campus life, Housing),
section labels, and the checkout's asymmetry where only the summary is framed.

Selection is marked by fill and a check, never by elevation — an elevated
selected item rises above its own container.

Where a group of Panels are sequential parts of one form with no independent
actions, they become one Panel with internal dividers instead of N Panels.

### Screen archetypes

Every route is one of five archetypes and composes from that archetype's parts
rather than freely: **decision**, **form**, **catalogue**, **review**,
**celebration**. A decision screen occupies exactly one viewport at any width;
if it does not fit it loses content, not the constraint. Form and catalogue
screens scroll. The exception, documented: when the object of a decision is a
legally binding document, the document scrolls *inside its own panel* and the
signing bar is fixed outside it.

### Motion

The stillness ruler is reduced to four lines, all of them about drift:

1. Every Step anchors its `h1` at the same pixel.
2. Nothing is born above the title.
3. The action bar is a constant height, declared once.
4. A primary button's width does not react to its own label.

Revoked, with the reason recorded: *a conditional block reserves its space or is
an overlay* (it forbids choreography — replaced by *reveals below the control
that triggered it, with an authored transition*); *Panel never wraps a gallery*
(it is what pushed catalogues onto the bare Ground); *no control exists for a
catalogue that already fits* (the review call asked for a filter and this rule
forbade it). *One title-and-lead pair per screen* is demoted from prohibition to
archetype default.

`layout-rules.test.ts` is rewritten to assert exactly the four survivors. The
revoked lines are deleted from `docs/design-research.md` in the same change, so
the ruler and the test cannot disagree.

State changes that need emphasis use a ring glow rather than geometry — no
scaling, no growing, no thickening a border, no `translateY` lift on hover.
`motion` and `gsap` are already dependencies; `motion` is the default and `gsap`
is used only where a timeline genuinely needs it. No new 3D: `ogl` stays where
it is and gains no new callers.

### Brand

The brand gradient stays two-stop and stays a signal. Three new uses that are not
signals are admitted: a very low gradient ground beneath decision screens, an
icon tile at 12% alpha (a container, never touching text), and the progress fill
— the one place the third hue earns itself, ending in the colour of "done".

Absorbed from the marketing site: soft/deep/pale ramps for azure and mint (only
violet has one today, which is why mint can be a fill but never a legible label),
`tabular-nums` on every number that can change on screen, a 650 weight between
body and bold, the icon tile, the ring-glow state, and a row hover that nudges
its own content rather than lifting the card. The gradient-in-text value adopts
the darker teal that holds contrast on white.

Rejected, with reasons: mesh behind content (unpredictable luminance under a
column of inputs), SVG wave separators (need a section boundary that does not
exist between two Steps of a form), coloured glow on buttons (a permanent halo
on a fixed bar, competing with the focus ring), hover lift on cards, viewport-
scaled display type, pill buttons as default, an azure focus ring, and a second
type family.

### The spine

`steps.ts` remains the single source. It grows per-Step metadata: minutes,
required/optional, and Point value. Nothing derives a count, an order or a
number anywhere else.

Identity & contact is replaced by three Steps — **Who you are** (preferred name,
pronouns, phone, Student status, Identity document), **Where you live now**
(address and residency verification, present only for the statuses it applies
to), **Who we call, who can see** (emergency contact and Family access).
**Health information** becomes its own Step immediately after Who you are, so
the three uploads are adjacent.

Per-Step minutes and the optional flag appear in the rail and on Review & sign,
and a total is announced once before the first field. This revokes an existing
rule that time never appears on a Quest line, and it is more than the review call
asked for — the call asked for it on Review & sign only. It is a visible
deviation and should be named on the next call rather than discovered.

### Family access explains the law first

Added after the grilling, from Laura's annotation on the screen. The section
opens with a short plain-language explanation of FERPA before any field, and the
sentence that has to survive every edit is the one about the right transferring
from the parents to the student on turning 18 or entering a postsecondary
institution. It is what answers the question the screen provokes — why is this
mine to decide — and without it the screen reads as the university arbitrarily
cutting parents out. `CONTEXT.md` gains **Eligible student** for the term FERPA
uses. Kept brief and placed as supporting text, not in a data surface, so it does
not become the bulk the client has objected to twice.

### Conditional logic

Student status is answered first within Who you are and decides two things: which
Identity document is requested, and whether Where you live exists at all for that
student. The address block, when shown, uses a state select and a city select
scoped to the chosen state. The validation schema branches with the answer rather
than validating fields that are not on screen.

A revealed block appears directly below the control that revealed it, inside the
same Panel, with an authored transition. Nothing above the trigger moves. Each
radio option carries its consequence in its own label rather than in a footnote.

### Points

A Point value is shown on the Quest being worked and on the next one, and the
same tag becomes the receipt once earned. It is never a price list of the whole
flow. The total available is announced once at the entrance. `CONTEXT.md` has
been updated to say this.

The award is seven beats, ~2.6s, nothing blocking — Continue is live from beat
three. The badge grows with overshoot; the headline enters from below; the price
pill solidifies; **everything stops for 300ms**; the pill flies in an arc to the
Balance, shrinking and shedding its label; the Balance scales and its number
rolls; the credit line cross-fades. The flying pill starts at 56–64px tall. The
existing `PointsAwardProvider` already flies a token — what changes is that the
token is now the same object that carried the price, its size, and its timing.

The Balance carries two numbers (Points, and what they convert to), sits on its
own surface that looks pressable, uses a verb rather than a label, and names what
is still missing as an object ("180 more for a $25 textbook"). It occupies one
fixed position across the whole flow, with the flight layer above everything,
`position: fixed` and `pointer-events: none` so it cannot shift the layout.

### Your offer

Desktop is a two-column composition whose halves stretch to the same height and
fill the usable viewport: the piece on the left (campus photograph, wash,
institution wordmark, programme), the act on the right in stacked bands — the
facts as label→value rows rather than a five-cell grid, the deposit tile with the
respond-by date, the reassurance, and a new *what accepting does* block of three
lines. That last block is migrated out of the celebration dialog, which means the
celebration is now made of emotion, Points and sharing rather than information.
The canvas beneath takes a very low gradient so the piece rests rather than
floats. Accept and Decline stay in the fixed bar.

Mobile reorders deliberately and drops content: the art band shrinks but does not
disappear, the programme description is cut, five facts become three rows, the
deposit figure moves next to the button, and the reassurance sits immediately
above the bar. *What accepting does* is not carried to mobile.

### Housing

The Residence fixture takes the shape a U.S. university actually publishes: room
types with explicit occupancy, bathroom as an enum of five (community,
semi-private, suite-style, connecting, private), air conditioning, laundry,
capacity in beds, year built and renovated, learning communities, gender
configuration, class-year eligibility, walk time, dining, and a canonical
amenities list. Meal plan is priced **separately** from the room and declared as
such, so a room price is comparable between Residences. Prices follow the real
ratios: triple ≈ 0.85–0.90× double, single ≈ 1.05–1.30×, private bath +10%,
renovated +15%, learning community a flat surcharge, and an internal spread of
about 2×. Rates are per person. Off campus is removed.

An image viewer is added: clicking a photograph opens it full screen, moves
between the Residence's images, and closes. This is the client's explicit
request and the reason the gallery currently frustrates.

Shortlist stays three ranked out of the catalogue, and the screen states plainly
that a preference is a request, not an assignment.

### Campus life

The Step's verb changes from choosing to declaring interest. Aster is stated as
having roughly 420 organizations; the fixture carries ~60 real ones adapted from
verified directories, and the screen opens on recommendation and filter rather
than on a grid, because nobody browses 400 items.

The Organization record carries the fields real directories carry, including the
three facets that are genuinely structured: cost per semester in bands, weekly
time commitment, and joining process as an enum of six. Category is the fourth
axis, from a taxonomy of 8–12, which is the real size of a directory taxonomy.
Meeting cadence and location are shown but flagged internally as an improvement
on the standard rather than a copy of it — they are not structured fields in the
real systems.

The detail view answers the questions a student actually has before walking up to
a table: what it is, what it costs, how much time, and how you get in. The
outcome of the Step is an Interest list rendered as a route through the
Involvement Fair, with its date and place.

Greek life and sport clubs are categories within the directory. Intramurals,
work-study and residence life are separate systems and are not in this screen.

### Review & sign

The order inverts. The screen opens on a status header — what this is, one
sentence of purpose, and a completeness line counting answers and anything
needing attention. Then the student's own answers. Then the agreement. Then
signing. The Points figure leaves the summary header, where it competes with the
sections' meaning.

Each section is a card with a status pill, a chevron, and exactly one edit
control in its header. Sections with problems or with few rows are expanded;
long ones are collapsed but show a one-line digest so a closed section still says
something. Long free-text answers get a full-width block rather than a
definition-list cell. The `?from=review` round trip is kept.

Signing keeps the read-to-the-end gate and gains the electronic-records
disclosure line above it, which is what makes a U.S. reader recognise this as a
signature.

### Deposit

Three screens behind one rail entry, because a checkout is one thing to anyone
who has bought something online:

1. **Secure your place** — numbered cards (how to pay, payment method, review)
   with a Deposit summary pinned beside them that never scrolls away, ending in a
   bolded *due today* line separate from the subtotal. Choosing the waiver swaps
   due today to `$0 — pending review` and collapses the rest.
2. **Double check** — prior steps collapsed to one line each with Change, the
   deposit policy in plain language, and a button reading the amount.
3. **Receipt** — reference, date, method, and a three-row *what happens next*
   timeline. Every branch reaches a receipt, including paying by the deadline and
   requesting a waiver.

Deliberately absent, because they are coercive or dishonest in this context: any
countdown or urgency, cart vocabulary, upsells, promo fields, BNPL branding,
marketing opt-ins on the payment screen, and confetti on the receipt. The
dated-ledger presentation of a future obligation is borrowed; the fintech
identity is not.

The gateway is not connected: screen two simulates and screen three is real. The
sequence survives when a gateway lands.

### Enrolled

The receipt and the final screen merge, so the flow has one ending rather than
two with opposing registers. The hero is an object — a student card carrying
name, enrolment ID, Residence and entry year — delivered with a flip-in. Above
it, a status eyebrow and a headline in the warm voice. Below it, the journey as a
receipt: Phases with checks and their Points, totalling to a full-size Balance
with its conversion. The deposit receipt lives inside this screen as a sober,
collapsible Well rather than as a screen of its own. The primary action is
spending the credit; done is secondary; sharing is tertiary and produces a 4:5
card. Confetti is short and behind the object.

### Voice and copy

All copy is rewritten before the screens are built, not after — the previous
round's copy ticket was ninth of nine, which is why the text reads as retrofitted.
Two declared registers rather than one averaged voice: warm and direct in the
moments (offer, award, celebration, campus life), flat and precise in the forms
and the Closing. Helper text survives only where a field is genuinely ambiguous.

### What is deleted

`identity-contact.tsx`, `offer.tsx`, `campus-life.tsx`, `completion.tsx` and
`deposit.tsx` are rewritten rather than edited. `steps.ts`, `store.ts` and
`validation.ts` change shape. `CONTEXT.md` and the domain hold.

Six comments in the codebase cite `ADR-0005`, `ADR-0006` and `ADR-0007`, which do
not exist. Those citations are corrected to point at what does exist rather than
writing the missing documents retroactively — inventing the reasoning for a
decision nobody recorded is worse than admitting it was not recorded. New ADRs
start at 0004.

Both previous spec directories are deleted. Their requests survive in
`source-requests.md`, traced to the transcript rather than to the interpretation.

## Testing Decisions

A good test here asserts external behaviour — what the spine says, what a branch
validates, what a filter returns, what a summary contains — never how a component
is built. The repo has no DOM environment, and adding one is a larger decision
than this delivery should make alone; visual and motion judgement stays in
`docs/review-script.md`, run at desktop and 390px, which is the discipline this
repo already has.

Five seams, four of them existing:

- **`steps.ts`** *(existing, `steps.test.ts`)* — the spine. Ten Steps, three
  Phases, the Closing, order, navigation, and the new per-Step minutes,
  required flag and Point value. Every count in the UI derives here, so this is
  the highest seam available. Prior art: the existing assertions on
  `groups.flatMap` derivation and path uniqueness.
- **`validation.ts`** *(existing, untested today)* — the conditional branches.
  Each Student status is asserted for the Identity document it requires and for
  whether the address block participates in the schema at all. Pure, and
  impossible to test at any higher point without a DOM.
- **`points.ts`** *(existing, `points.test.ts`)* — price, receipt, conversion to
  Bookstore credit, the share award, and the announced total. Prior art: the
  existing shape assertions that fail if the rate and the block size disagree.
- **`summary.ts`** *(existing, untested today)* — what Review & sign displays:
  the per-section one-line digest and the counts of answers and of items needing
  attention.
- **`catalogue.ts`** *(new)* — the only new seam. Filtering Organizations across
  the four axes. With a declared catalogue of ~420 and a fixture of ~60 this is
  real logic, and inside a route it would be untestable.

`layout-rules.test.ts` is rewritten rather than extended: six assertions become
the four surviving drift invariants, and the assertions enforcing revoked lines
are deleted alongside the lines themselves.

`docs/review-script.md` gains a section per screen, in its existing style — a
flat checklist of things to look at, at both widths. At minimum it must cover:
the four surface levels appearing where the archetype says and nowhere else; no
route rendering a child directly on the Ground outside the three exceptions;
selection never lifting an item; the award's seven beats including the 300ms
stillness; the flying token being the same object that carried the price; each
Step's title landing at the same pixel from every route of arrival; the image
viewer opening, paging and closing; the catalogue filter narrowing and clearing;
the deposit's three branches each reaching a receipt; and a full run at 390px
with no horizontal scroll and no tap target under 44px.

## Out of Scope

- **Roommate matching.** The strongest thing the housing research surfaced — a
  14-question ordinal instrument and a percentage-match selection screen — and
  explicitly deferred as the next obvious candidate. It would add a Step and it
  was asked for by nobody.
- The staff portal, the student portal proper, and the EDward assistant.
- A real payment gateway and a real housing API. Fixtures stay fixtures, shaped
  so real values drop in without a shape change.
- Real authentication. The entry screen inherits the foundation and the voice
  rewrite; its behaviour does not change.
- 3D. `ogl` and `LightRays` stay as they are and gain no new callers.
- Writing the missing ADR-0005 through ADR-0007 retroactively.
- A DOM or browser test environment.

## Further Notes

The two previous specs both recorded that some of the review call's requests were
already satisfied — "About You's clustering already correct", "Housing: no
structural change". Both were wrong, and both were inherited from an earlier
agent's work rather than checked against the call. That is the specific failure
this spec is built to avoid: `source-requests.md` traces every requirement to a
timestamp in the transcript or a line of the client's feedback, not to a previous
spec's reading of it.

The research that backs these decisions was commissioned as input, not as a
deliverable, so there are no research documents. The design references are a
different matter: `docs/agents/design-references.md` gates them, so each ticket
carries its `Referências` field and the reasoning is appended to
`docs/design-research.md` in the round the UI is built. That gate stays on. It is
the only thing preventing the next round from finding a reference that agrees
with whatever was already built.

The client chose a single delivery with no gate after the foundation, against the
recommendation. Recorded here because if the foundation's tone is wrong, it will
be wrong on ten screens before anyone sees it.
