Status: ready-for-agent

# The room and the band: one visual system, across both surfaces

The designer opened the product and said it is *too flat*, and asked for *more
purple and more round*. That is the **second** time this repo has been told it
lost its identity chasing Salesforce density, and the first answer — ADR 0012,
which rationed the brand gradient to four files and one usage per screen — is the
thing being replaced rather than extended.

The diagnosis is three defects wearing one word, and only one of them had been
looked at before. Tonal: ADR 0010 retired elevation and predicted the grey wall
in writing. Chromatic: violet was rationed to signal. **Typographic**, which
nobody had measured: the system declares a display voice and points it at the
same face as body text, and its nine type steps put six of them inside five
pixels, so below `h2` nothing can say what matters more than what. The same
compression runs through whitespace and icons.

This cycle rebuilds the visual system once, for both surfaces, and connects the
gamification the client asked to focus on. It is large on purpose: the previous
cycle closed under the name *one product, not two*, and repainting the portal
while leaving the gate behind is how that gets undone in a fortnight.

## Problem Statement

A newly admitted student opens the portal and sees a grey wall. The screen is
dense, correct and legible, and it looks like a CRM the university bought rather
than something built for the person who just got in. Nothing on it says which
institution this is in a way that carries feeling, nothing distinguishes what
matters most from what matters least, and the reward the product runs on is
almost invisible.

For the designer, the specific failures are that the surface has no depth, no
colour and no roundness. For the client, the commercial failure is **Melt**:
admitted students stop before enrolling, and a product that reads as
administrative paperwork gives them no reason not to.

Underneath the complaint are four measured causes:

- **Elevation was removed as a signal**, so every unit on the screen sits at the
  same tonal level and nothing is the subject.
- **Violet was rationed to signal**, so the brand is present in the palette and
  absent from the screen.
- **The type scale is compressed** — nine steps, six within five pixels, one
  weight above body, and a display token that resolves to the body face.
- **Whitespace and icons are unsystematised** — five gap values inside eight
  pixels with half-steps, one spacing token declared in the entire system, and
  three icon weights running at once so they read as three different families.

And the gamification the product depends on is thin: Points exist and convert to
**Bookstore credit**, but there is no sense of what is still earnable, no
continuity between days, and no visible journey toward the destination.

## Solution

One visual system, named **the room and the band**, applied to the gate and the
portal in the same cycle.

The **room** is the application's ground: tinted violet, carrying one very quiet
texture. Every screen sits in it, so the brand is ambient rather than rationed.
The **band** is a gradient block that opens each screen and **contains** its first
unit rather than sitting above it. That containment is what makes colour
affordable — a colour block stacked before the first card spends 140–180px of the
~640px available at 1366×768, which is why the previous cycle rejected exactly
that composition; a band that holds the first card inside it spends nothing.

Depth returns as **containment and never as reaction**: the band and the lead
card are raised and stay still. Nothing rises on hover, nothing rises on
selection — that is what keeps the drift complaint from coming back.

Each material gets one job and is refused the others. Tint groups. Shadow
contains. Border delimits a control and nothing else. Texture appears once, on
the ground.

Typography gets a second voice: Satoshi keeps the whole interface, and a display
grotesk with rounded terminals takes the band's display and the headings. The
rounded terminal is where *more round* lands in the letterform, which corner
radius alone cannot deliver. The scale drops from nine steps to seven with real
distance between them, and body moves from 14 to 15.

Gamification grows **vertically and never socially**. The student is measured
against the next amount of Bookstore credit on a **Reward track**, told how much
is still earnable today as **Headroom**, and shown a **Streak** of consecutive
days. Points are shown as a price on the Quest before acting, not only as a
receipt after. **Decay** stays literal and stays on the lead card only. No tiers,
no levels, no leaderboard: ADR 0002 rejected those on social grounds — they rank
a cohort against each other before any of them has arrived on campus, on a screen
the student's family may be sitting beside them for — and that argument has not
been withdrawn.

## User Stories

1. As an admitted student, I want the portal to look like it was made for me
   rather than for an administrator, so that I feel I have been admitted
   somewhere rather than enrolled in a system.
2. As an admitted student, I want one thing on each screen to be obviously the
   subject, so that I know where to look first without reading everything.
3. As an admitted student, I want the brand colour present in the surface I am
   standing on, so that the product has a personality instead of a palette.
4. As an admitted student, I want the heading of a screen to be unmistakably
   larger and different from the text under it, so that I can scan rather than
   read.
5. As an admitted student, I want text set large enough to read comfortably on a
   laptop, so that finishing enrollment does not feel like filling in a tax form.
6. As an admitted student, I want related things visibly grouped by the space
   around them, so that a screen with a lot on it still reads as a few things.
7. As an admitted student, I want icons that look like one family, so that the
   interface does not feel assembled from parts.
8. As an admitted student, I want an icon to tell me when something is done, so
   that I can see my progress without reading a status word.
9. As an admitted student, I want corners and letterforms that feel soft, so that
   a process about my future does not feel like enterprise software.
10. As an admitted student, I want nothing to jump or grow when I move my mouse,
    so that the page holds still while I am deciding.
11. As an admitted student, I want a selected option to be filled and checked
    rather than lifted, so that choosing does not move everything around it.
12. As an admitted student, I want to see how many Points are still available to
    earn today, so that I know there is something worth doing now.
13. As an admitted student, I want to see how far my Balance is from the next
    amount of Bookstore credit, so that the number means something concrete.
14. As an admitted student, I want to see how many days in a row I have finished
    something, so that I have a reason to come back tomorrow.
15. As an admitted student, I want a broken streak to simply reset without
    comment, so that missing a day does not feel like a punishment.
16. As an admitted student, I want to see what a Quest is worth **before** I do
    it, so that I can choose what to spend my time on.
17. As an admitted student, I want to see that today's value is higher than
    tomorrow's on the task I am being pointed at, so that the urgency is a fact
    rather than a nag.
18. As an admitted student, I want that decreasing value to appear on one task
    and not on all twelve, so that the whole list does not feel like it is
    running away from me.
19. As an admitted student, I do **not** want to see how I rank against other
    admitted students, so that neither I nor my family have to feel behind before
    I have arrived.
20. As an admitted student, I want the gate and the portal to look like one
    product, so that finishing enrollment and arriving somewhere are the same
    journey.
21. As an admitted student, I want photographs of the residences and the campus
    to be photographs, so that I can judge where I will actually live.
22. As an admitted student, I want illustration where there is nothing real to
    show, so that an empty screen still feels finished rather than broken.
23. As an admitted student, I want an area that is not built yet to say so
    clearly, so that I do not think the product is failing.
24. As an admitted student, I want a field the university already knows the
    answer to to look already answered, so that I can see the process is short.
25. As an admitted student, I want to confirm rather than type wherever possible,
    so that I do not abandon the process halfway through.
26. As an admitted student on a small laptop, I want the first piece of work
    visible without scrolling, so that opening the portal tells me what to do.
27. As an admitted student on a phone, I want the same screen to be legible and
    complete, so that I can finish something while I am away from a desk.
28. As an admitted student, I want the same screen to land in the same place
    however I arrived at it, so that the product feels stable.
29. As an admitted student, I want colour never to be the only thing telling me
    about my progress, so that I am not guessing at what a shade means.
30. As the designer, I want the brand expressed through the surface rather than
    rationed to a list of permitted files, so that identity is a property of the
    system instead of an exception to it.
31. As the designer, I want a type scale whose steps are far enough apart to be
    seen, so that hierarchy is something I can compose with.
32. As the designer, I want one declared spacing rhythm without half-steps, so
    that grouping is deliberate rather than accidental.
33. As the designer, I want each material to have exactly one job, so that a card
    is never delimited three ways at once.
34. As the designer, I want the second display face to be a decision I sign off
    on, so that the product's voice is not chosen by whoever was implementing
    that day.
35. As the designer, I want a fallback that still works if the second face is
    refused, so that the cycle does not stall waiting on brand.
36. As the client, I want the product to give admitted students a reason to
    finish, so that fewer of them melt before they enrol.
37. As the client, I want the gamification to be something I can point at in a
    conversation with a school, so that I can answer the objection about students
    not filling things in.
38. As the client, I want the university's own identity to lead and the vendor's
    to sit at the system layer, so that the school is not being sold somebody
    else's brand on their student's screen.
39. As a developer, I want the visual rules recorded as one decision rather than
    scattered across three, so that the next round does not have to reconstruct
    them.
40. As a developer, I want the ruler to assert only defects that have been
    reported more than once, so that it stops being rewritten every cycle.
41. As a developer, I want the type, spacing and radius scales declared in one
    place with no call sites, so that changing the system is one edit.
42. As a developer, I want the deleted type and spacing steps to be genuinely
    gone rather than deprecated, so that a future screen cannot reintroduce the
    compression.

## Implementation Decisions

**The visual system is decided in ADR 0015 and this spec implements it.** ADR
0015 supersedes ADR 0010 entirely, ADR 0012 entirely, and one line of ADR 0006
(*selection is never elevation*). ADR 0008, ADR 0009 and ADR 0014 are untouched —
they are the physical ruler rather than taste, and they are what keeps *cortado*
and *flick* from returning.

**The token layer is the seam for the repaint.** Type, spacing, radius, elevation
and colour are declared once and have no call sites, which is what makes a system
change one edit rather than a sweep. The scales themselves:

- Type: seven steps at 11 / 13 / 15 / 18 / 24 / 32 / 44. `micro` and `lead` are
  deleted rather than deprecated. Body moves 14 → 15.
- Spacing: five steps at 4 / 8 / 16 / 24 / 40, with no half-steps. The system
  currently declares one spacing token and improvises the rest.
- Radius: containers rise and controls freeze — card 16 → 20, slab 20 → 28,
  field stays at 10. A field at container radius reads as a pill and destroys
  form density.
- Weights: the interface face uses its full range rather than the single strong
  weight declared today.

**Two type faces.** The interface face keeps every control, form, table, chip and
navigation item. A display grotesk with rounded terminals takes the band's
display and the headings, at heavy weight. It is not a serif — the audience is an
eighteen-year-old, and the catalogue reference is Preply and Duolingo rather than
anything editorial. **The face itself needs the designer's sign-off**, and the
fallback if refused is the interface face across its full weight range, which is
a real improvement on its own.

**No uppercase label survives.** The tracked, capitalised eyebrow is removed
everywhere. This was argued half-way already: the note beside the metadata step
records that facts set in the uppercase label *read as a row of five little
headings* and cites Linear for setting facts in lower case, and then kept the
label anyway.

**Elevation returns as containment only.** The band and the lead card are raised
and static. No hover lift, no growth on selection, no border thickening. Emphasis
stays a ring glow. Selection stays fill and a check.

**One job per material.** Tint groups, shadow contains, border delimits a control
and nothing else, texture appears once on the ground. A unit delimited by two of
them at once is the stacking three rounds of review have objected to, rebuilt in
new material.

**The band contains its first unit.** This is the load-bearing composition
decision and the reason the colour is affordable at all. A band that sits above
the first card spends 140–180px of the fold budget; a band that holds the card
inside it spends nothing.

**Violet is material on the ground and in the band, and signal everywhere else.**
Chips, states and navigation stay neutral. A student must never have to work out
whether a colour is telling them something about their progress.

**Both surfaces are recomposed, not just repainted.** The gate's nine Steps, its
rail, its sheet and its action bar all move to the new system in this cycle.

**Gamification is vertical.** Three new mechanics sit on the existing single
source of Points, as pure functions rather than as new state: Headroom (what is
still earnable today), Streak (consecutive days with at least one Requirement
finished), and Reward track (distance to the next named amount of Bookstore
credit). The Points price appears on a Quest before it is acted on, which the
existing object already supports — Points are a price and a receipt in one
object. No tiers, levels, leagues or leaderboards are introduced.

**Decay is unchanged in rule and changed in placement.** It stays literal —
today's value beside tomorrow's, never a running tally of what was lost — and
appears on the lead card only. It is the one component in the product with no
reference in the catalogue, so the risk is concentrated on one card per screen
where human acceptance can actually judge it.

**Photography and illustration divide by subject.** Photographs carry what is
real: residences, campus, the student's own card. Illustration carries what is
abstract: empty states, the unbuilt areas, the reward moment.

**No column grid is introduced.** The three archetype measures stay. What is
added is one declared gutter and a closed set of two-column compositions. A grid
of twelve laid over three measures would be a second layout system beside the one
that already has an ADR.

**Prefill gets its grammar and not its plumbing.** How a field that the
institution already answered *looks* is designed in this cycle against fixtures.
The CRM integration is a separate cycle. Designing the grammar later means
designing it twice.

## Testing Decisions

**A good test here asserts a defect that was reported, not a decision that was
made.** The design-system ruler in this repo has been rewritten three times,
every time because it was holding taste still rather than catching a fault. The
rule that replaces the old contents is written into the file itself: *assert a
defect the client has reported more than once, never an aesthetic.*

**Three existing seams, no new ones.**

- **The Points module.** Headroom, Streak and Reward track are pure functions
  over the single source of Points, so they are tested where Points already is.
  Prior art: the existing Points tests, which assert conversion to Bookstore
  credit and the price/receipt duality.
- **The portal module.** Decay's placement on the lead card and the ordering of
  what the student sees are Requirement logic, tested where Requirement logic
  already is. Prior art: the existing portal tests, including the assertions that
  no Requirement is due after teaching begins.
- **The layout ruler.** It shrinks from twelve invariants to nine. Five are
  deleted — the ones policing the signature's file count, the floating Quest
  card, the stretching sheet, and the two closed Presence tables — because each
  polices an aesthetic, and one of them fails the designer's own request in CI.
  Two are added, because each is verifiable and each answers a measured defect:
  one icon weight for meaning and one for state, and no half-step in the spacing
  scale.

**One declared non-seam.** Whether the screen reads as flat, whether the band
contains its card, whether the violet is in the right dose — none of it is
testable without a DOM, and the ruler already says so about itself: measuring a
fold without one is pretending the test knows the height of a font, and a test
that lies is worse than no test. These are human acceptance at 1366×768 and
390×844, the same standard the previous cycle used and the client agreed to.

**The existing domain tests must pass unedited.** The gate's Steps, the
catalogue, validation, the summary and appointments are untouched by a visual
system change. If one of them breaks during the repaint, it was asserting a
presentation detail and that is itself the finding.

## Out of Scope

- **Dark mode.** Declared out rather than forgotten. The dark variant stays
  declared and unimplemented.
- **The CRM prefill plumbing.** Pulling name, phone and address from what the
  institution already holds is the next cycle. This cycle owes the grammar of a
  prefilled field, drawn against fixtures.
- **Tiers, levels, leagues and leaderboards.** Rejected on social grounds in ADR
  0002 and not reopened here. Reopening it is a conversation with the designer
  and the client present, not a UI change.
- **A column grid.** The three archetype measures stay.
- **Any change to the domain model.** Quests, Phases, the Closing, Requirements,
  the twelve, the conversion rate and every fixture keep their meaning. This is a
  visual system change with three additive Points mechanics on top.
- **The staff portal.** Journeys, requirement authoring and the form builder are
  somebody else's context, as they have always been.
- **Real dates.** Today remains a fixture.
- **Server state and realtime.** Still a prototype with fixtures.
- **The physiological research behind the incentive amounts.** The designer is
  bringing it. It changes how much a Quest is worth, not where the price sits.

## Further Notes

**On the screenshot the designer sent.** It is a different prototype, and the
client was explicit that it is *only to demonstrate her feeling, not to copy and
not to be biased by*. The previous cycle treated that prototype as a source of
vocabulary; this one does not. Every reference behind this spec is cited in the
design research document, and the screenshot is evidence of a temperature and
nothing else.

**On the size of this cycle.** It is genuinely large — both surfaces recomposed,
the whole token layer replaced, three new mechanics, an ADR and a ruler rewrite.
That is a consequence of the decision that the gate and the portal are one
product. Splitting the repaint across two cycles would put a repainted gate
beside a recomposed portal, which is the two-skin outcome the previous cycle
closed.

**On what the second face blocks.** Nothing, deliberately. Every other decision
here stands whether the display face is approved, refused, or still being
discussed, and the fallback is a real improvement rather than a placeholder.

**On the ruler shrinking.** Deleting five invariants will feel like losing
coverage and is the opposite. Every one of the five polices a decision this cycle
is deliberately reversing, and one of them would fail the designer's request in
CI. What is left is the four drift invariants, the z-index ladder, the rule
against animating layout properties, the single celebration layer, and the two
new ones — all of which trace to a complaint somebody actually made, twice.
