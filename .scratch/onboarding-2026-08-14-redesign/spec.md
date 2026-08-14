Status: ready-for-human

# Onboarding redesign — 2026-08-14 review call

## Problem Statement

A student walking through the Aster onboarding flow (offer → about you → housing
→ campus life → review & sign → deposit) hits several friction points a live
review call surfaced:

- The same topic (name, then contact, then name again, then contact again, then
  address, then contact) is asked about out of order, so answering feels
  repetitive rather than linear.
- Screens like Your Offer are spaced out enough that a small amount of
  information forces a large amount of scrolling, and the surrounding chrome
  doesn't read as a real product — it reads as a loose set of screens.
- Whether a document upload or an address is even required depends on the
  student's citizenship/status, but today every student sees the same fields
  regardless of answer — an international student is shown a U.S. address block
  that will never apply to them.
- Campus Life's clubs are a flat grid with no way to filter or learn more before
  picking one — the student commits to a club on name and one line of blurb
  alone.
- A disability/accommodation question sits inside Campus Life with no path to
  attach the medical documentation or immunization record that later steps in
  the real portal will require.
- Review & Sign doesn't tell the student, per step, how long it takes or
  whether it's optional — so the six-step rail reads as one undifferentiated
  block of work.
- There's no acknowledgement, anywhere, that finishing a step is worth
  anything — no points, no reason to want to finish the next one.
- Accepting the offer opens a small, easy-to-miss dialog when this is the
  single moment in the whole flow the student has the most reason to feel
  something and to tell people about it.

The client's other, blunter feedback — "estamos enrolando e não estamos
entregando" — sets the operating constraint for how this gets solved: as a
single, complete pass through the onboarding flow, not a slow trickle of partial
fixes.

## Solution

Rework the six-step onboarding flow as one cohesive delivery, built mobile-first
throughout, in this order (chosen so each step inherits the work of the one
before it rather than duplicating it):

1. **Shell & density pass** — tighten the shared step chrome (rail, page shell,
   context panel, spacing tokens) so every later screen looks like it belongs to
   one system, without waiting for each individual screen to be reworked first.
2. **About You: reorder, cluster, condition** — the four-section accordion
   already clusters identity/residence/emergency/family correctly; what's
   missing is that residence and the identity document requirement don't yet
   react to the citizenship/status answer.
3. **Housing** — the ranked-residence-with-gallery pattern already exists and
   already matches the "booking-style" ask; extend it only where the call
   specifically asked for more (room-level detail already present, no further
   fields needed) and confirm off-campus/not-sure stay minimal.
4. **Campus Life** — add a filter over the club grid and a detail view per club
   before selection.
5. **Health Information** — a new, explicitly optional step (or section) for the
   disability/accommodation question, now with medical documentation and
   immunization record upload, split out of Campus Life.
6. **Review & Sign** — add a per-step time estimate and required/optional tag,
   sourced from one place so the rail, About You's section index, and this
   summary can't disagree with each other.
7. **FERPA/family access** — verify the existing "who else can see your record"
   section matches the call's ask (name, email, relationship, access granted);
   add whatever's missing.
8. **Gamification** — a lightweight points value per step, shown at each step
   and totalled at Review & Sign.
9. **Accept-offer moment** — grow the existing celebration dialog into a larger,
   shareable, points-earning moment.

Everything ships together as the "patinete": each of the above is scoped to the
smallest version that is still correct and on-brand, not the most complete
version imaginable. Where a screen already matches the call's ask (About You's
clustering, Housing's gallery/ranking), the spec below says so explicitly rather
than re-describing already-working behaviour as new work.

## User Stories

1. As a student filling out About You, I want citizenship/status to be the
   first thing I answer in that section, so that the form only ever asks me for
   information that actually applies to me.
2. As a U.S. citizen or permanent resident, I want to be asked for my
   identifying document as a passport or driver's license respectively, so that
   the upload matches what I'm actually able to provide.
3. As an international student, I want to be asked for my passport, so that I'm
   not asked for a U.S.-specific document I don't have.
4. As an international student, I want the permanent-address block to not
   appear at all, so that I'm not asked to fill in a U.S. state/city dropdown
   that doesn't apply to me.
5. As a U.S. citizen or permanent resident, I want the address block to appear
   with a state and city selector, so that I can give a complete, well-formed
   address without free-typing something the registrar has to correct.
6. As a student on a small screen, I want the mobile phone field to take up one
   compact row, not a large block with its own heading and helper text, so that
   the form feels appropriately dense.
7. As a student, I want to answer each topic (identity, contact, address,
   emergency contact, family access) exactly once, in a logical order, so that
   I never feel like I'm repeating myself.
8. As a student reviewing my offer, I want the offer card to fit without
   excessive scrolling, so that I can see the shape of what I'm accepting at a
   glance.
9. As a student anywhere in onboarding, I want every step's chrome (rail,
   spacing, type, card treatment) to look consistent, so that the product feels
   like a finished system rather than a set of prototyped screens stitched
   together.
10. As a student picking housing, I want to see room photos before ranking a
    residence (already true today), so that "where would I live" is answered
    with a picture, not a sentence.
11. As a student choosing clubs, I want a filter over the grid, so that I can
    narrow nine options down to the two or three categories I actually care
    about.
12. As a student considering a club, I want to open a detail view before
    picking it, so that a name and one line of blurb isn't the only information
    I get before committing.
13. As a student with a disability or health condition, I want a dedicated,
    clearly optional step to disclose it and attach documentation, so that this
    sensitive information isn't folded into an unrelated "clubs and interests"
    screen.
14. As a student using the Health Information step, I want to attach a medical
    letter/report and my immunization record as separate uploads, so that the
    university has what it needs without me guessing what format to use.
15. As a student who skips Health Information during onboarding, I want to
    understand that it may become required later in the student portal, so
    that I'm not surprised when it's asked again.
16. As a student on Review & Sign, I want to see, for every step, how long it
    took (or is estimated to take) and whether it was required or optional, so
    that I understand what I actually just did and what I chose not to do.
17. As a student progressing through onboarding, I want to see points
    accumulate as I finish each step, so that finishing has some
    acknowledgement beyond a checkmark.
18. As a student who accepts their offer, I want a bigger, more celebratory
    moment than a small dialog, so that the offer feels like the milestone it
    is.
19. As a student in that celebratory moment, I want a clear, inviting prompt to
    share the news (e.g. to social platforms), tied to earning points for doing
    so, so that sharing feels like part of the reward rather than a bolted-on
    ask.
20. As a student granting a family member access to my record, I want to give
    their name, email, and relationship to me (not just name and email), so
    that the record of who has access is actually complete.
21. As a product reviewer looking at any step, I want the visual density and
    chrome to communicate "this is a real system" rather than "this is a
    prototype", so that stakeholder review time isn't spent relitigating
    whether the foundation is solid.
22. As a student using a phone (the default case, not the exception), I want
    every one of the above to work correctly at mobile width first, so that the
    experience isn't a shrunk-down desktop layout.

## Implementation Decisions

### Shell & density pass

- The shared step chrome (the page shell, the step rail, the context panel, the
  section-title pattern used across steps) gets a single pass over spacing,
  card padding, and vertical rhythm — reducing default gaps between sections
  and cards rather than introducing new layout primitives. This is a token/
  spacing-scale change applied through the existing shared components, not a
  new component.
- The Offer step's fact grid and deposit callout are the first candidates for a
  "fits without excess scroll" treatment, since that was the specific example
  raised on the call — but the resulting spacing scale applies to every step
  equally, so no step ends up visually inconsistent with another.
- This pass happens first and every other item in this spec is built against
  its result, not against the current spacing.

### About You: conditional citizenship logic

- Citizenship/student status becomes the field that gates two other things
  already in the identity/residence sections, rather than a new section:
  - The identity document requirement text (and, if the ID upload component
    supports it, the accepted-document hint) changes based on the answer: U.S.
    citizen → passport; permanent resident → driver's license (state-issued);
    international student → passport of country of citizenship.
  - The entire residence/address block (street, unit, city, state, postal code,
    country, residency-verification question) is shown only when citizenship is
    U.S. citizen or permanent resident. International students skip straight
    past it — the section still exists in the accordion, but renders a short
    explanatory line instead of the address fields, and is excluded from the
    validation schema for that branch.
- The state/city fields, when shown, become selects (state list, then a
  city list scoped to the selected state) rather than free-text inputs. This is
  new fixture data (U.S. states, and either a full or a representative
  per-state city list) added alongside the existing citizenship/country
  fixtures.
- This is a genuine behavior change from what's in the codebase today, where
  the address block is unconditionally required for every citizenship answer.
  The existing code comment reasoning for "address is required" (residency
  classification, tuition, official post) still holds — it's just now scoped to
  the citizenship answers where it actually applies.

### About You: phone field density

- The mobile-number field's visual footprint shrinks to a single compact row
  (dial-code select + number input side by side, one line of helper text) —
  no separate heading block. This is a presentational change to the existing
  phone input pairing, not a new field.

### About You: family access relationship field

- The family-access section gains a relationship field (using the same
  relationship options already defined for emergency contacts), so a family
  member's access record captures name, email, relationship, and the
  disclosure scope already collected — matching what the call asked for and
  what a FERPA-style release actually needs to be complete.

### Housing

- No structural change: the on-campus ranked residence list with room/exterior/
  common-area photo galleries, the off-campus single protection question, and
  the "not decided yet" no-op branch already match what the call asked for
  (booking-style photo-first browsing, ranked choices staying visible while
  photos scroll). Confirm this against the call recording during build and
  only add what's actually still missing — don't rebuild what already works.

### Campus Life

- A filter control is added above the club grid. Filtering is by category —
  each club fixture gains a category field (e.g. sport, arts, outdoors, social,
  service), and the filter narrows the visible grid to one or more selected
  categories. Selecting clubs remains independent of the filter (a club stays
  picked even if filtered out of view).
- Selecting a club (a tap/click that isn't the "pick" action itself) opens a
  detail view — a larger image, the existing blurb, and enough added detail
  (meeting cadence, a longer description) to inform the decision before the
  student commits. This can be a dialog/sheet consistent with the pattern
  already used for the housing residence gallery, rather than a new
  interaction pattern.
- The accommodation/disability question and its warning notice move out of this
  step entirely, into the new Health Information step below.

### Health Information (new step)

- A new step (or, if it reads better sequenced right after Campus Life without
  inflating the step count, a new section within an existing step — left to
  design judgment during build) asking the same yes/no accommodation question
  that exists today, but now followed, on "yes", by two upload fields: medical
  documentation and an immunization record. Reuses the existing document-upload
  component pattern already used for identity documents.
- This step is optional in onboarding, consistent with every other
  accommodation-adjacent question in this flow — it does not block Review &
  Sign or the deposit. Its optionality is explicitly called out in its copy
  (as Campus Life's accommodation question already does today), including a
  note that the student portal may require this information later even though
  onboarding does not.
- If implemented as a new step, `steps.ts` (the step order/label list) and the
  store's per-step state slice both need a new entry, following the same shape
  as the existing steps; `completedSteps()` needs the equivalent "submitted"
  check.

### Review & Sign

- Each step definition gains a time estimate and a required/optional flag, read
  from the single existing step-order source (not duplicated into Review &
  Sign, the rail, or anywhere else) so all three can never disagree. Review &
  Sign's per-step summary blocks display both, next to the existing "Edit"
  affordance for that step.
- Time estimates are reasonable approximations, not measured data — a minute or
  two per section is fine for a step, more for About You given its four
  sections.

### Gamification

- Each step definition gains a point value, from the same single step-order
  source as the time estimate/required flag above. Points are additive and
  awarded on step submission (the same `submitted: true` moment already used
  for step-completion tracking).
- Review & Sign shows a running total. Where a value is displayed elsewhere
  (e.g. a small badge in the rail next to a completed step) is a build-time
  design decision, not specified further here.
- Point values themselves are a quick, plausible pass — research briefly how
  U.S. university "bookstore points"/engagement-point programs typically scale
  a first-week checklist, then assign values that feel proportionate (a
  five-section step earning meaningfully more than a one-question step). This
  does not need to be authoritative; it needs to be structurally correct so
  real values can replace it later without a shape change.

### Accept-offer moment

- The existing celebration dialog grows: larger footprint, the existing
  confetti/headline treatment kept, with an added, clearly optional share
  prompt (the call's "your friend on Facebook and LinkedIn" ask) and copy that
  leans into the "publicly join this university" framing from the call rather
  than a neutral "share if you'd like to" tone.
- Sharing (when the student takes the action) awards points via the same
  points mechanism as steps above — this is the one point-earning action that
  isn't a step submission, so it needs its own small addition to the points
  total rather than reusing the per-step award path directly.
- The dialog must remain dismissible without sharing — this was true before and
  stays true; a bigger, more persuasive moment is not a forced one.

## Testing Decisions

This repo has no automated test suite by deliberate, already-recorded decision
(see `docs/review-script.md`) — the existing review discipline is a manual
visual/UX pass run at desktop and 390px width, checked off as a checklist. This
spec follows that same convention rather than introducing a new one.

`docs/review-script.md` gets a new section per changed step, in the same style
as its existing entries (a flat checklist of concrete, visually/behaviourally
verifiable assertions, run at both a desktop width and 390px). At minimum, add
checklist items for:

- Citizenship answer correctly gates the address block's visibility and the
  identity-document requirement text, in both directions (switching citizenship
  answers after already filling in an address clears/hides it correctly).
- State/city selects populate correctly and cascade (city list matches the
  selected state).
- The phone field's compacted layout doesn't clip or wrap awkwardly at 390px.
- Campus Life's filter narrows the grid correctly and clears correctly; a
  club's detail view opens with its own image and copy, independent of the
  filter state.
- The Health Information step's uploads behave like the existing identity
  upload (add/remove, no crash on empty state) and the step is skippable.
- Review & Sign shows a time estimate and required/optional tag for every step,
  matching the single step-order source (change a value there, confirm it
  updates in Review & Sign without a matching duplicate change).
- Points accumulate correctly across a full run-through and the Review & Sign
  total matches the sum of whatever was actually completed (not a hardcoded
  max).
- The grown celebration dialog remains dismissible without sharing, and sharing
  (where simulated) visibly adds points.
- A full run-through at 390px width start-to-finish has no horizontal scroll
  and no tap target under 44px, consistent with the existing mobile checklist
  items for other steps.

## Out of Scope

- The student portal proper (My Enrollment and everything beyond onboarding),
  the staff portal, and the EDward-style assistant — all explicitly framed on
  the call as the next phase, after this onboarding work ships.
- The Deposit step — not raised in this call at all; only inherits the shell/
  density pass, no functional change.
- A real backend for housing/club data — housing residences and clubs stay
  fixture-driven, as they are today; only the shape of that fixture data
  changes (categories added to clubs, states/cities added for address).
- Deep competitive research for gamification point values or club/housing
  content — a quick, structurally-correct pass is the bar, not an authoritative
  one (see Implementation Decisions above).
- Any change to the entry/sign-in screen or the completion screen beyond the
  shared shell/density pass.

## Further Notes

- Several of the call's specific complaints turned out to already be resolved
  in the codebase as it stands (About You's clustering and section order,
  Housing's photo-first ranked-residence pattern) — likely from an earlier
  round of work referencing an earlier call. This spec calls that out
  explicitly per item so build time isn't spent re-solving what's already
  correct, and so a reviewer comparing this spec to the call transcript isn't
  confused about why some asked-for items aren't listed as new work.
- The single step-order source (`steps.ts` today) is about to carry more
  per-step metadata than it does now (time estimate, required/optional, point
  value) in addition to id/path/label/blurb — worth keeping as one typed list
  rather than letting any of this drift into a second source of truth, which is
  exactly the failure mode a recent code comment in this codebase already
  flagged and fixed for section-completion status.
- Delivery framing from the call ("patinete, não carro esportivo," "com a UI
  correta já"): the bar for every item above is "correct and on-brand at the
  smallest scope that's still real," not "as complete as it could eventually
  be." Where an item above says a value or dataset is a quick pass rather than
  a deep one, that's this framing applied on purpose, not corner-cutting.
