# Where the Audentra signature may appear

The client's complaint was that the product had lost its identity in pursuit of
Salesforce density: *"vc focou mto em deixar salesforce q perdemos nossa
identidade audentra q criamos. eu queria um salesforce tipo edtech sabe?"*

Stated as a number, that is: the brand gradient had **three usages in the whole
app**, none of them on a Section header. The palette was never lost —
`violet-500` is the marketing site's `--au-purple`, `azure-500` its `--au-blue`,
`mint-500` its `--au-teal`, `ink-900` its `--au-navy`, and the display face is
Satoshi in both. What was lost is every place the identity was *expressed*.

This records where it may be expressed, because "a little brand colour here too"
is a decision that gets remade every fortnight until it is a stripe on every
component.

## The rule

**Flat violet is state. The gradient is brand.**

Violet-700 keeps meaning "you are here" and mint keeps meaning "done". The 115°
violet→azure→teal gradient is read as *material*, never as status, and that is
the only reason it can sign a screen without becoming semantics. A student must
never have to work out whether a colour is telling them something about their
progress.

## Where it may appear

1. **The Section header's numbered marker**, when that Section is in progress.
   Three states — grey untouched, gradient here, mint done — which is the rail's
   own grammar repeated one level in. Precedent: Remote's "01. Government ID /
   02. Selfie", a numbered brand-coloured eyebrow inside dense content, and
   Twenty's section header as a tonal bar in a record page.
2. **One 2px hairline across the top of the screen's work sheet.** Once per
   screen. It is the *once* that makes it read as a signature rather than as a
   stripe on a component.
3. **The rail's group marker**, which predates this round and is the same
   grammar one level up.

Two further usages are admitted and named so the list stays closed: the student
card on **Enrolled**, which is an object handed over on a celebration screen
outside the Step shell, and the swatch in the **style guide**, because a system
that cannot show its own gradient cannot be reviewed.

## Where it may not

- On the primary action, a field, a chip, or any control. The thing you click
  has to stay obviously the thing you click.
- As an eyebrow above an `h1`. The Phase is already named in the rail and in the
  title; a third voice saying it is stacking.
- Twice on one screen. A screen with two hairlines has a pattern, not a
  signature.
- On the guide. The guide is a second sheet on the same screen, and signing it
  would put the mark on every form Step twice.

Housing and Campus life carry no hairline at all. They are `catalogue`
archetypes: the collection *is* the screen and sits on the Ground, so there is
no work sheet to sign, and signing the Shortlist Well instead would be exactly
the stripe-on-a-component this ADR exists to prevent. The identity on those
screens is carried by the rail, which is permanent.

## The institution keeps the top of the rail

Aster's crest leads and Audentra owns the system layer: the gradient, the type
and the signature. A SaaS that replaces the university's arms with its own on
the student's screen is selling the wrong story. Precedent: Teachable, where the
school's mark is the subject and the vendor's wordmark sits small in the chrome.

Aster's own colours are navy and gold, flat, and live inside the crest SVG.
Audentra owns violet, azure and mint at the system layer, and two owners in the
same colours is how the distinction gets lost again. The gold is not a token,
does not enter the theme, and is deliberately unlike `amber-500`, which means a
warning and must go on meaning only that.

## Consequences

- `src/lib/layout-rules.test.ts` holds the list. The gradient utility may appear
  in four files, a route may sign each of its screens once, the guide may never
  sign, and the crest's two colours may never reach `app.css`. Adding a fifth
  file means editing the list, which is where the argument for it belongs.
- "In progress" is decided by the sheet and handed down through context. A
  Section cannot know it is first on the screen, and nine routes working it out
  is the answer living in nine places. Asking focus instead would make the
  marker a cursor rather than a state, and it would go blank the moment the
  student clicked away to read something.
- The hairline costs no height: it is drawn over the sheet's own top border
  inside the existing `overflow-hidden`, so a signed sheet and an unsigned one
  put their first Section header on the same pixel. The identity comes back
  inside the ruler ADR 0008 and ADR 0009 set, not beside it — none of it is paid
  for in white space.
