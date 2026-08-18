# The room and the band

This is the **second** time the client has said the product lost its identity,
and the first answer is the thing being replaced.

ADR 0012 was written against *"vc focou mto em deixar salesforce q perdemos nossa
identidade audentra"*. Its answer was deliberately narrow: the gradient may
appear in four files, once per screen, never on a control. That answer has now
been measured in the browser by the designer and found short — *"the dashboard is
too flat… can we have it more purple and more round?"*

A narrow rule that fails twice is not a rule that needs a fifth exception. It is
the wrong shape of rule.

## The diagnosis, which is three things and not one

"Flat" was read as one complaint and it is three, each with its own cause in this
repo:

1. **Tonal.** ADR 0010 retired elevation to reach Salesforce density, and it
   named this exact outcome as an accepted risk: *"the honest risk, accepted
   deliberately, is a screen that reads as a grey wall."* The wall appeared.
2. **Chromatic.** Violet was rationed to "progress, primary action" and the
   gradient to four files. The palette was never lost; every place it was
   *expressed* was.
3. **Typographic**, and this was invisible until it was measured. `--font-sans`
   and `--font-display` are the same string — the system names a display voice it
   does not own. The scale had nine steps with six of them inside 5px
   (11/12/13/14/15/16), so below `h2` nothing could say what mattered more than
   what. The same disease appears in whitespace, where five gap values live
   between 4px and 12px with half-steps, and in icons, where three Phosphor
   weights run at once and read as three different icon families.

A hierarchy whose steps are one pixel apart is flat in the most literal sense
available, and no amount of violet fixes it.

## What this supersedes

- **ADR 0010, entirely.** `Section` survives as a composition; elevation stops
  being forbidden.
- **ADR 0012, entirely.** Replaced by the material rule below, which is wider and
  is stated as *what each material does* rather than as a list of permitted
  files.
- **ADR 0006, one line only** — *"Selection is fill and a check, never
  elevation."* The four drift invariants are untouched and are not negotiable:
  they answer a different complaint (*"vc erra bastante tbm com layout, onde fica
  dando flick, de posição"*) which nobody has withdrawn.

ADR 0008 (HD is the desktop), ADR 0009 (a decision scrolls) and ADR 0014 (the
portal's Presence table) are **not** touched. They are the physical ruler rather
than taste, and they are what keeps "cortado" and "flick" from coming back.

## The rule: one job per material

Elevation came back, so three things can now delimit an area and they will fight
unless each is given one job and refused the others.

- **Tint groups.** A Well is what says "these belong together".
- **Shadow contains.** It marks the one object a screen is about — the band, the
  lead card. Never a list of twelve.
- **Border delimits a control**, and nothing else. Input, select, field.
- **Texture appears once, on the ground.** Never inside a card, where it is noise
  behind text.

**Elevation is containment, never reaction.** Nothing rises on hover, nothing
rises on selection. That is the half of ADR 0006 which survives its own line
being revoked: an element that grows when you point at it moves its neighbours,
and the neighbours are the layout.

## The concept: the room and the band

The ground of the whole application is tinted violet and carries one very quiet
texture — the room. Each screen opens with a gradient band that **contains** its
first unit rather than sitting above it — the band.

The containment is the entire point, and it is what makes this affordable. A
colour block stacked *before* the first card spends 140–180px of the ~640px ADR
0008 measures at 1366×768, which is how the previous cycle came to reject exactly
that composition on the record. A band that holds the first card inside it spends
nothing: the card was going to be there anyway.

Violet is material on the ground and in the band, and **only** there. As a signal
it keeps meaning what it meant. A student must never have to work out whether a
colour is telling them something about their progress — that line of ADR 0012 was
right and is the one thing carried forward whole.

## Typography

Two voices, because one voice at nine sizes was the problem.

- **Satoshi** keeps the entire interface: body, forms, tables, chips, buttons,
  navigation.
- A **display grotesk with rounded terminals**, weight 700–800, takes the band's
  display and the `h1`s. Not a serif. The audience is an eighteen-year-old
  starting in 2031, and the reference band is Preply and Duolingo's Feather, with
  ClassDojo as the guardrail on the childish side. The rounded terminal also
  answers the designer's "more round" in the letterform, which corner radius
  alone cannot do.
- The scale is seven steps with real distance: **11 / 13 / 15 / 18 / 24 / 32 /
  44**. `micro` and `lead` are deleted; body moves 14 → 15.
- **No uppercase label survives anywhere.** The tracked, capitalised eyebrow is
  cut. `app.css` already carried half of this argument against itself: the note
  beside `--text-meta` records that facts set in `micro` "read as a row of five
  little headings", cites Linear for setting facts in lower case, and then keeps
  `micro` anyway.

The second face is a **brand decision and needs the designer's sign-off**. If it
is refused, the fallback is Satoshi across the full 300–900 range, which is not
nothing: the system today declares exactly one weight above body.

## Where the identity is allowed to come from

The client sent a screenshot of another prototype to convey a feeling, and was
explicit that it is *"apenas pra demonstrar o sentimento dela, não é pra copiar
nem se enviesar de nada"*. That instruction is recorded here because the previous
cycle already treated that prototype as a source and this one must not.

The vocabulary in this ADR is sourced from the catalogue, not from that
screenshot, and the citations are in `docs/design-research.md`. The screenshot is
evidence of a temperature and of nothing else.

## Consequences

- **Five of the twelve invariants in `src/lib/layout-rules.test.ts` are deleted**
  — the ones policing the signature's four files, the floating Quest card, the
  stretching sheet, and the two closed Presence tables. The rule that replaces
  them: *the ruler asserts a defect the client has reported more than once, never
  an aesthetic.* That file has been rewritten three times, always because it was
  holding taste still, and #8 as written today fails the designer's request in
  CI.
- Two invariants are **added**, because each is verifiable and each answers a
  measured defect: one icon weight for meaning and one for state, and no
  half-step in the spacing scale.
- The gate is **recomposed, not repainted**. A repainted gate beside a recomposed
  portal is the two-skin outcome the previous cycle closed under the name "one
  product, not two".
- Dark mode is **out of scope and declared out**, not forgotten.
  `@custom-variant dark` stays unimplemented.
- Photography carries what is real — residences, campus, the student's own card.
  Illustration carries what is abstract — empty states, the seven placeholders,
  the reward moment. A student choosing where to live does not want a drawing of
  the room.
- No grid of twelve columns is introduced. Three archetype measures already exist
  with an ADR behind them, and a column grid laid over them would be a second
  layout system growing beside the one that works. What is added is one declared
  gutter and a closed set of two-column compositions.
