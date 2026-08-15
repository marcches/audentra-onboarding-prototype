Status: done

# Identity, the broken blocks, and About you in three

Three complaints, one round. They are related more tightly than they look: the
same instinct that stripped the Audentra signature off the shell in pursuit of
Salesforce density also left prose running at Salesforce's *table* measure, and
left the About-you Phase carrying a Step too thin to justify a screen.

Every defect below was **measured at 1366×768 before anything was designed** —
the viewport ADR 0008 names — because the previous three rounds each fixed the
place the finger pointed at and left the rest to be found next time.

## Problem Statement

### What the client said

> "parece q perdemos um pouco da nossa identidade... vc focou mto em deixar
> salesforce q perdemos nossa identidade audentra q criamos. eu queria um
> salesforce tipo edtech sabe?"

> "AINDA POSSUEM TEXTOS COM O SEU BLOCO QUEBRADO OU INCONSISTENTE, DEIXANDO O
> SISTEMA COM ESPAÇO EM BRANCO ERRADO. JA FALEI PRA RESOLVER ISSO."

> "o fluxo do about you poderia melhorar, esse 'who we call...' deveria ta dentro
> de algum etapa ja, alem disso ta desalinhado o rail"

### What that is, measured

| Defect | Measurement |
|---|---|
| Rail connector misaligned | Marker centre `x=28`, line `x=23.5`. Off by 4.5px on all five groups. |
| Prose measure inside a Section | 89 characters per line (577px at 13px). The guide's prose runs at 38. Readable is 45–75. |
| Void inside a Section | `who-you-are` §3: one line of text, ~90px of empty white under it. |
| Void inside a sheet | `health` §2: dropzone, then ~140px of empty white. |
| Void under a sheet | `who-we-call`: sheet ends at y≈400, ~280px of Ground below. |
| Brand gradient in the app | 3 usages total, none of them a Section header. |

The last row is the identity complaint stated as a number. The palette was never
lost — `violet-500 #6a38ff` is the site's `--au-purple`, `azure-500 #1e5bff` is
`--au-blue`, `mint-500 #00c49a` is `--au-teal`, `ink-900 #0a1f44` is `--au-navy`,
and the display face is Satoshi in both. What was lost is every place the
identity was *expressed*.

### And from the student's side

A student walking About you today crosses four screens to answer what is one
subject: their name, their number, their status, their document, their address.
One of those screens — *Where you live now* — is two minutes of two fields, and
it exists as a Step only because an earlier round needed somewhere to put an
address that varies by Student status. A second screen, *Who we call*, ends
mid-page with 280px of grey under it and opens with a FERPA paragraph set 20%
past the width anyone can read a line at, with a bold clause opening and closing
mid-sentence and a link welded to the tail of the last line.

## Solution

**Put the identity back where it is expressed, cap the prose, let every sheet be
the height of its content, and make About you three Steps.**

The seven decisions:

1. **The institution leads, the platform owns the system layer.** Aster keeps
   the top of the rail. Audentra owns the gradient, the type and the signature.
   A SaaS that replaces the university's crest with its own on the student's
   screen is selling the wrong story.
2. **The signature lands in two places and no more**: the Section header's
   numbered marker, and one gradient hairline at the top of the screen's work
   sheet. The guide never carries it. Once per screen is what makes it read as a
   signature rather than as a stripe on a component.
3. **Flat violet is state; the gradient is brand.** Violet-700 keeps meaning
   "you are here" and mint keeps meaning "done". The 115° violet→azure→teal
   gradient is read as material, never as status, which is the only reason it can
   sign a screen without becoming semantics.
4. **Every sheet is content-height.** `fill` and `grow` leave the system. A short
   screen shows Ground under its sheet and that is not a defect; a paragraph with
   90px of white beneath it *inside* its own block is.
5. **About you is three Steps.** The permanent address becomes a conditional
   Section inside *Who you are* — present for a citizen or permanent resident,
   absent for an international student, exactly as before but one level down.
   *Health information* and *Who we call, who can see* survive as Steps.
6. **Aster gets its own colours.** Navy and gold, flat, scoped to the crest SVG.
   The crest stops being a gradient shield with a geometric flower — which reads
   as an app icon — and becomes heraldry: shoulders, a chief, a motto ribbon, a
   founding year.
7. **Prose has a measure.** A token, an element that carries it, and four rules
   written into `docs/copy-inventory.md`, applied across all nine screens rather
   than only where the finger pointed.

### The four copy rules

1. Prose inside a Section sets to a maximum of ~68ch regardless of sheet width.
2. Emphasis is a whole sentence or nothing. No bold opening and closing mid-clause.
3. A link never shares a line with the tail of a paragraph.
4. One block of prose per Section. Everything else is a field, a list, or a
   drawn empty state.

## User Stories

**Whose product this is**

1. As a newly admitted student, I want the screen to carry one visual signature I
   can recognise across every Quest, so that the flow reads as one product rather
   than as a stack of forms.
2. As the client, I want Audentra's gradient visible in the work itself and not
   only on the marketing site, so that the identity we built is the identity the
   student meets.
3. As the client, I want the density we asked for kept exactly as it is, so that
   the identity coming back is not paid for in white space.
4. As a student, I want the university's own mark at the top of the rail rather
   than the vendor's, so that I know whose portal I am standing in.
5. As a student, I want the institution's mark to look like a university crest
   and not like an app icon, so that the offer I am accepting reads as real.
6. As a student, I want the crest to carry a founding year and a motto that the
   rest of the product also knows, so that the institution is an institution and
   not a drawing.
7. As a student, I want the brand gradient to mean "Audentra made this" and never
   "you are here" or "this is done", so that I never have to work out whether a
   colour is telling me something about my progress.
8. As a student on any one screen, I want to meet the signature once, so that it
   stays a signature instead of becoming a stripe on every component.
9. As a student, I want the primary button, the fields and the chips to stay in
   flat colour, so that the thing I click is still obviously the thing I click.

**Reading what I am asked**

10. As a student reading the FERPA explanation, I want its lines to stop at a
    width I can read without losing my place, so that I can actually decide who
    sees my record.
11. As a student, I want every explanatory paragraph in the flow to set at the
    same measure, so that one screen does not feel broken next to another.
12. As a student, I want emphasis to fall on a whole sentence, so that bold text
    tells me what matters instead of interrupting a clause.
13. As a student, I want a link to sit on its own line rather than welded to the
    tail of a paragraph, so that I can see it is a link.
14. As a student, I want at most one block of prose per Section, so that a Section
    reads as a thing to do rather than as an article about a thing to do.
15. As a student filling a two-column field grid, I want the fields to keep using
    the width they have, so that capping the prose does not cap my address line.

**Blocks that are not broken**

16. As a student, I want a block that has run out of content to end, so that I am
    not looking at 90px of white inside a border wondering what is missing.
17. As a student on a short Quest, I want the page to end where the work ends, so
    that a short screen reads as short rather than as unfinished.
18. As a student on Health information, I want the dropzone to be big because a
    dropzone should be big, not because the column had slack to give it.
19. As an agent building a future Step, I want no way to stretch a sheet to the
    column's height, so that this defect cannot be reintroduced by passing a prop.
20. As a reviewer, I want every route checked rather than only the three About-you
    screens, so that the next round does not open with the same complaint.

**About you, in three**

21. As a student, I want everything about *me* — my name, my number, my status, my
    document, my permanent address — asked on one screen, so that I stop
    ping-ponging between screens on one subject.
22. As a U.S. citizen or a permanent resident, I want my permanent address asked
    inside *Who you are*, so that the flow does not spend a whole Quest on two
    fields.
23. As an international student, I want the permanent address absent rather than
    shown and explained, so that I am never asked for a U.S. address I do not have.
24. As an international student, I want the count of Quests to be the same nine
    everyone else sees, so that my flow is not silently shorter than the one the
    entrance announced.
25. As a student, I want *Who we call, who can see* to stay its own Quest, so that
    the people I nominate are not buried inside a screen about me.
26. As a student, I want *Health information* to stay its own Quest, so that
    medical uploads keep their own place beside the identity document.
27. As a student who bookmarked the old address screen, I want the link to take me
    to where the question now lives, so that I do not land on a 404.
28. As a student returning to a browser that stored the old flow, I want the app
    to start clean rather than half-restore a spine that no longer exists.
29. As a student, I want *Who you are* worth the sum of what it absorbed, so that
    my total is unchanged by a decision I did not make.
30. As a student on Review & sign, I want my address to be read back to me under
    *Who you are*, so that the summary matches the screen I answered it on.

**Who we call, earning its screen**

31. As a student, I want the FERPA block rewritten to the four rules, so that the
    worst-set paragraph in the flow stops being the first thing on the screen.
32. As a student who has granted nobody access, I want a drawn empty state saying
    so and the one action that changes it, so that the true thing is not a grey
    sentence floating under a paragraph.
33. As a student, I want a rule behind "Add another" — one contact required, a
    second optional, capped at two — so that a two-minute Quest does not turn into
    a list manager.
34. As a student, I want the screen to stay short rather than be padded, so that
    the flow does not invent work to fill a sheet.

**The spine**

35. As a student, I want the rail's connector to run through the centre of its
    marker, so that the one permanent element on screen does not look misaligned.
36. As a student, I want a mark on the line for every Quest, so that the line
    reads as a spine I am travelling rather than as a leftover border.
37. As a student, I want the mark to say which of the three states a Quest is in —
    unstarted, current, done — so that I can find where I am without reading names.
38. As a student, I want the check that says "done" to sit on the line with the
    other marks, so that no new furniture is added to the rail.
39. As a student, I want the line segmented per group, so that the Closing and
    After never read as a fourth Phase.
40. As an agent changing the marker's size later, I want the connector to follow
    it, so that the 4.5px cannot come back.

**What the next reader finds**

41. As the next agent on this repo, I want `CONTEXT.md` to say About you is three
    Steps and why the four-Step reasoning survives the change, so that I do not
    read the glossary and the code as contradicting each other.
42. As the next agent, I want *Emergency contact* in the glossary, so that I stop
    conflating it with Family access the way the copy already has.
43. As the next agent, I want an ADR for the three-Step decision, so that the
    commit arguing for four is not the last word I find.
44. As the next agent, I want an ADR naming where the signature may appear, so
    that "a little brand colour here too" is a decision already made rather than
    one remade every fortnight.
45. As a writer taking the next screen, I want the four prose rules beside the
    rules already in `docs/copy-inventory.md`, so that the measure is a rule of the
    system rather than a fix applied to one paragraph.

## Implementation Decisions

**The hairline.** The gradient already exists in the app as a `.brand-gradient`
utility over `linear-gradient(115deg, #6a38ff 0%, #1e5bff 62%, #14a5d6 100%)`. A
2px rule of it sits at the top of the screen's **work sheet** — one per screen,
never on the guide, never on a second sheet. The `Sections` surface grows a
`signature` prop; the route that owns the work passes it and nothing else does.
It costs no height the sheet's own border was not already spending.

**The marker's three states.** `Section`'s numbered marker has two fills today —
`bg-ink-200` and mint — which makes "not started" and "being filled in right now"
the same grey. Three: untouched is `bg-ink-200 text-ink-600`, in progress is the
brand gradient with a white numeral, done is `bg-mint-500` with a white check.
This is the rail's own grammar — grey / brand / mint — repeated one level in.

**"In progress" is decided by the sheet, not by the Section.** It is the first
incomplete Section on the screen. A Section cannot know it is first, and asking
focus would make the marker a cursor rather than a state, so `Sections` walks its
children and hands the answer down through context. No route computes it.

**Flat violet is state; the gradient is brand** (ADR 0012). The gradient may
appear on the Section marker and on the sheet hairline. It may not appear on the
action pill, on a field, on a chip, or above an `h1` as an eyebrow — the Phase is
already named in the rail and in the title, and a third voice saying it is
stacking.

**The crest becomes heraldry.** Aster stays fictional: every fixture number in the
prototype derives from ADR 0005's ~7,000 undergraduates, and a real university's
crest is that university's registered trademark, which is an awkward thing to have
on screen when the demo is shown to a different university. What changes is the
mark. At 36px: a shield with square shoulders drawn to a point in flat fill, a
chief carrying the founding year, the aster drawn as a charge rather than as a
logo mark, an open book below it, and a motto ribbon under the point.

**Aster's colours are navy and gold, flat, and live inside the crest SVG.**
Audentra owns violet/azure/mint at the system layer, and two owners in the same
colours is how the distinction gets lost again. The gold does not enter the
theme, is not a token, and must not be confusable with `amber-500`, which means a
warning. `institution.founded` and `institution.motto` join the fixture, because a
crest carrying a year and a motto the rest of the app has never heard of is a
drawing rather than an institution.

**Prose gets a token and an element.** A `--measure-prose` custom property in the
theme, declared once beside the archetype measures, and a `Prose` element in the
surfaces module that carries it. Prose inside a Section stops tracking the sheet's
width. Fields, lists, tables and drawn empty states are unaffected — they were
never the problem, and capping them would put a 68ch limit on a two-column field
grid. The four copy rules go into `docs/copy-inventory.md` beside the rules
already there, and the sweep covers all nine screens.

**`fill` and `grow` are deleted from the props, not just from the call sites.**
Both leave `Sections` and `Section` entirely, so a future screen cannot
reintroduce the void by passing them again. Health's dropzone — the one part that
genuinely wanted to be large — gets an honest intrinsic height instead of
borrowing the column's slack. The comment in the step shell claiming this was
solved by "putting something worth reading in the space" goes with them: it was
not solved, the void moved inside the sheet.

**About you becomes three Steps, and the address drops a level.** The spine loses
`where-you-live`. The permanent address and the residency check become Sections
inside *Who you are*, present for a citizen or a permanent resident and absent for
an international student — the same rule, one level down. Gusto's "Personal
information" is the precedent. This does not undo the previous round's split of
*Identity & contact*: name/number/status/document/address is one subject (*you*),
emergency contact and family access are another (*other people*), and health is a
third. Three Steps, three subjects.

**`Who you are` becomes 5 minutes and 50 Points; totals are unchanged at 215.**
The spine module says every Step is "levelled at one to three". That rule was
written to kill a six-minute Step that made the student circle back through four
subjects, not to cap a five-minute Step whose parts are adjacent. The comment and
the test get rewritten to say that, rather than the number being fudged to fit it.

**The status-varying spine is deleted, not kept for a future caller.** With the
address a Section, no Step varies by Student status, so `Step.appliesTo`,
`stepApplies()` and the `status` parameter on `stepsFor`, `stepCountFor`,
`groupsFor`, `totalMinutesFor`, `totalPointsAvailableFor`, `stepIndexFor`,
`nextStep` and `previousStep` have no user and go. Keeping a subsystem for an
imagined caller is how a two-column option came to sit in the codebase with no
route using it.

**`addressSchemaFor()` stays** — it is still the right seam, just called from the
Section now rather than from the route. `null` still means absent, and absent
still means the fields do not participate in validation at all.

**The loose ends of the merge.** The old address path redirects to
`/onboarding/who-you-are` rather than 404ing, using the `beforeLoad` redirect the
router already uses for its index routes, because the Review summary's edit links
and any bookmark point at it. The address values keep their own slice in the
store, but `whereYouLive.submitted` goes and `whoYouAre.submitted` governs both.
The storage key bumps to v6 — a v5 blob carries a submitted flag and a spine that
no longer exists. The summary module folds the address rows into `who-you-are`,
conditionally, and stops emitting a section for a Step that is gone.

**Who we call earns its screen without being padded.** The FERPA block is
rewritten to the four rules: one block, at measure, emphasis on a whole sentence,
the link on its own line. "Nobody has access to your record." becomes a drawn
empty state inside a Well — the thing that is true, and the one action that
changes it. Emergency contacts get the rule that "Add another" has been missing:
one required, a second optional, capped at two. If the screen still ends at y≈400
once its text is fixed, it ends there.

**The rail's connector is derived from the marker's geometry, never guessed at.**
The marker size, the row padding and the resulting offset become named exports in
the layout module — the same shape `presence` and `RAIL_WIDTH` already use — and
the ruler asserts the arithmetic rather than a class string:

```ts
// src/lib/layout.ts
export const RAIL_MARKER = 20;   // size-5, in px
export const RAIL_ROW_PAD = 4;   // px-1, in px
export const RAIL_CONNECTOR_OFFSET = RAIL_ROW_PAD + RAIL_MARKER / 2;
```

**The line grows marks, and stays segmented per group.** Each Quest gets a small
mark *on* the line: a hollow dot when unstarted, a filled dot when current, a
check when done. The check that sits on the right today moves onto the line — no
new mark is added to the screen, one changes sides. The line remains a segment per
group, starting under its own marker and ending at its last Quest, because one
continuous run would draw the Closing and After into the same line as the three
Phases, which is exactly what ADR 0001 and `CONTEXT.md` keep apart.

**What gets written down.** `CONTEXT.md`'s **Phase** entry becomes three Steps,
with a note saying what moved and why the four-Step reasoning survives it, and
**Emergency contact** joins the glossary as a term distinct from Family access.
**ADR 0011** records that About you is three Steps and that status variation drops
a level — hard to reverse, surprising without context, and a real trade-off
against the ping-pong the four-Step split was built to stop. **ADR 0012** records
where the Audentra signature may appear. `docs/copy-inventory.md` takes the four
prose rules and its Step list drops to nine.

## Testing Decisions

**What makes a good test here.** The repo has no DOM environment, and by ADR 0006
the layout tests assert **source-level invariants** rather than measuring a
rendered page: an escape hatch that does not exist cannot be used wrongly by a
future Step, which is a stronger guarantee than catching it afterwards. Nothing
asserts appearance; everything asserts that the means of getting it wrong was
removed. Domain tests assert the shape of the spine — derivation, order,
uniqueness, what a status does — never a restatement of the file.

**One source-level seam, rewritten rather than extended.** `layout-rules.test.ts`
already reads the sources off disk and enforces the ruler, and its own precedent
is that it is rewritten each round, because a test and a ruler that disagree are
worse than either alone. It keeps the nine groups it has and takes four more:

1. **No sheet can stretch.** `fill` and `grow` appear nowhere in the surfaces
   module's props and nowhere in a route.
2. **The signature lands twice and no more.** The gradient utility appears only on
   the Section marker, the sheet hairline and the rail's group marker; a route
   renders at most one hairline; no field, chip or primary action carries it.
3. **The gold is not a token.** The crest's navy and gold appear only in the
   institution badge module and never in the theme.
4. **`--measure-prose` is declared once**, in the theme, and no component
   reassigns it — the pattern the action bar height and the archetype measures
   already follow.

Plus the rail arithmetic: `RAIL_CONNECTOR_OFFSET` equals the marker's centre,
computed from the exported constants rather than compared to a literal.

**The spine seam.** `steps.test.ts` is the highest seam in the repo — the rail,
the summary, the navigation, the Points total and every "N of M" derive from it —
and it changes with the spine: nine Steps rather than ten, About you holding
*Who you are*, *Health information* and *Who we call*, no status branch counting
nine against ten, and navigation walking one flow for every student. The
one-to-three-minute assertion is rewritten to allow the five-minute *Who you are*
by name, with the reason in the test rather than in a review comment.

**The summary seam.** `summary.test.ts` asserts that the address rows appear under
*Who you are* for a citizen and a permanent resident, are absent for an
international student, and that no section is emitted for the retired Step.

**The validation seam is expected not to move.** `validation.test.ts` keeps
asserting that `addressSchemaFor` returns `null` for an international student and
a schema for the other two, and that `null` means the fields do not validate at
all. If those assertions need editing, the address moved further than this spec
asked it to.

**Prior art for all of the above**: `layout-rules.test.ts` for source-level
invariants, `steps.test.ts` for spine shape, `summary.test.ts` and
`validation.test.ts` for the status-conditional behaviour, `points.test.ts` and
`catalogue.test.ts` for the modules this round does not touch — if either of the
last two breaks, the change went too far.

**What is deliberately not a test.** The pixels: the voids, the marker's three
fills, the crest reading as heraldry, the marks on the spine, and prose landing
inside 45–75 characters. Measuring those without a DOM is pretending the test
knows the height of a font, and a test that lies is worse than none. They are
**human acceptance at 1366×768**, which is where the ruler already puts content
above the fold and the ceiling of three surfaces.

## Out of Scope

- **Coach marks and tours.** Still reserved by the client for entry to the
  platform, not the onboarding.
- **A new state colour.** The gold lives inside one SVG and is not a token.
- **Content invented to fill a short sheet.** If *Who we call* still ends at
  y≈400 once its text is fixed, it ends there.
- **A real university's crest, name or arms.** Aster stays fictional.
- **Any change to the density, the type scale or the three width classes.** The
  identity comes back inside the ruler ADR 0008 and ADR 0009 set, not beside it.
- **Housing, Campus life, Your offer, Review & sign and Deposit as screens.** They
  are in scope for the prose sweep and the content-height rule and for nothing
  else.
- **New Points values, new minutes, a new Phase, or a fourth group.** Totals are
  unchanged at 215.
- **An eyebrow above the `h1`**, a gradient on any control, or a second hairline
  on a screen that already has one.
- **Domain changes beyond the two named**: the Phase entry and Emergency contact.
  No other term in `CONTEXT.md` enters, leaves or changes meaning.

## Further Notes

**The nine tickets, in dependency order.** Four can start immediately — 01, 02,
04 and 05 gate nothing and are gated by nothing. The two sweeps come first
because they are what makes the rest easy: a screen that cannot stretch and a
paragraph that cannot run wide are the ground everything else is built on.

1. `01-every-sheet-is-content-height` — `fill` and `grow` deleted from the props,
   every route checked. *No blockers.*
2. `02-prose-gets-a-measure` — the token, the element, the four rules, and the
   sweep across all nine screens. *No blockers.*
3. `03-the-signature-marker-and-hairline` — the marker's three states and the one
   hairline, plus the rule for where the gradient may not go. *Blocked by 01.*
4. `04-a-crest-that-reads-as-heraldry` — the shield, the chief, the motto ribbon,
   and Aster's own two colours. *No blockers.*
5. `05-the-rail-becomes-a-spine` — the derived connector, the mark per Quest, the
   segment per group. *No blockers.*
6. `06-about-you-in-three` — the spine, the store, the summary, the redirect, and
   the subsystem that goes with them. *Blocked by 01.*
7. `07-who-we-call-earns-its-screen` — the FERPA block, the drawn empty state, and
   the cap of two contacts. *Blocked by 01, 02.*
8. `08-what-gets-written-down` — `CONTEXT.md`, ADR 0011, ADR 0012,
   `docs/copy-inventory.md`. *Blocked by 02, 03, 04, 06, 07.*
9. `09-the-sweep-and-the-human-acceptance` — every measurement in the table above,
   taken again on the shipped flow at 1366×768 and 390×844. *Blocked by all.*

The one soft edge is 03 on 01: nothing in the signature logically needs
content-height, but both rewrite the same two components' prop surface, and
sequencing them means one rewrite rather than two.

**This round reverses a decision from the last one, on purpose.** The previous
commit argued About you into four Steps and was right about the defect it was
fixing — one Step carrying four subjects. It was wrong about where the boundary
falls, because it drew it around *fields* rather than around *subjects*. ADR 0011
exists so that the next reader finds both halves of that argument rather than only
the newer one.

**References.** Searched on Mobbin before the solution was proposed, per
`docs/agents/design-references.md`; each ticket carries its own `Referências`
field as well.

- Connector through the marker centres, one marker per row:
  [Melio](https://mobbin.com/screens/03ef6cc6-505c-4277-bfe2-b0c068a141c1),
  [Gamma](https://mobbin.com/screens/523d6c4f-ac58-44f7-9d7a-a9881cba40f7),
  [Remote](https://mobbin.com/screens/0d2b48f4-1904-4fe9-b335-a34ca87fbb68),
  [15Five](https://mobbin.com/screens/b15499c2-0d36-47a0-a758-073e309e1a60).
  15Five and Remote both segment the line per group rather than running one
  spine, which is what keeps Closing and After from reading as Phase four.
- Numbered brand-coloured eyebrow inside dense content:
  [Remote's "01. Government ID / 02. Selfie"](https://mobbin.com/flows/24d47336-90f8-4027-9299-13ad2311ddac).
- Permanent address inside the personal-details step rather than beside it:
  [Gusto, "Personal information"](https://mobbin.com/flows/4c148fb2-f611-4b54-bc2d-4eebdb50dc58) —
  preferred name, legal name, pronouns, phone and current home address in one
  step, with the agreement at its foot.
- Emergency contact as a step of its own:
  [Remote](https://mobbin.com/flows/43b10617-7cbd-4527-b708-976aa4c1171d).
- Section header as a tonal bar in a record page:
  [Twenty](https://mobbin.com/screens/f0170497-9df6-4b27-9bdc-ab606ee77530).
