# The stillness ruler loses a line, and the stacking ruler loses two

> **One line superseded by [ADR 0015](./0015-the-room-and-the-band.md):**
> *"Selection is fill and a check, never elevation."* Selection is still fill
> and a check — what changed is that elevation is no longer forbidden
> everywhere else. The four drift invariants are untouched and are not
> negotiable: they answer a different complaint, and nobody has withdrawn it.

Written because a rule that disappears without a recorded reason comes back in
two rounds, and one of the two below had already been reinstated once.

The stillness ruler had five lines. It now has four, and the fifth was
*replaced* rather than simply deleted. The stacking ruler beside it lost two of
its five in the same round.

## What survives, and why these four

All four are about **drift**: the same element landing on different pixels
depending on how you arrived at it. That is the client's actual complaint ("vc
erra bastante tbm com layout, onde fica dando flick, de posição"), and it is
user story 60 word for word: *the same screen lands in the same place however I
arrived at it*.

1. Every Step anchors its `h1` at the same pixel.
2. Nothing is born above the title.
3. The action bar is a constant height, declared once.
4. A primary button's width does not react to its own label.

`src/lib/layout-rules.test.ts` asserts exactly these and nothing else. It was
rewritten rather than extended, so the test and the ruler cannot disagree.

## What was revoked, and why

- **"A conditional block reserves its space or is an overlay."** It did not
  prevent drift, it prevented *choreography*. A revealed block that reserves its
  own space is a hole in the layout before it is filled, and an overlay for a
  single extra field is a modal around a text input. Replaced by: **the revealed
  block appears directly below the control that triggered it, inside the same
  Panel, with an authored transition, and nothing above the trigger moves.**
  That is judgement rather than a source-level invariant, so it is reviewed by a
  human and lives in `docs/design-research.md`.

- **"`Panel` never wraps a gallery."** This is the line that pushed catalogues
  onto the bare Ground and produced the "jogado no fundo" complaint the client
  has now made twice. Replaced by the four-surface system, where the Ground has
  exactly three exceptions and each is named in code through `OnGround`.

- **"No control exists for a catalogue that already fits."** The review call
  asked for a filter on Campus life and this line forbade it. With ~420
  organizations declared, the filter *is* the screen.

- **Demoted rather than revoked: "one title-and-lead pair per screen."** It is
  now an archetype default. A `review` screen has a status header, section
  labels and a document, and three pairs there are structure rather than
  stacking.

## Consequences

- Choreography is now allowed and, in the Points award, required: seven beats
  over roughly 2.6 seconds with 300ms of deliberate stillness in the middle.
- The layer that carries it is `position: fixed` with `pointer-events: none`,
  which is how a 2.6 second animation across the whole screen coexists with the
  four invariants above.
- Selection is fill and a check, never elevation, everywhere in the system. An
  elevated selected item rises above its own container and moves its neighbours
  while the student is still choosing.
- Emphasis is a ring glow rather than geometry. No scale, no growth, no border
  thickening, no hover lift: those are the four ways an emphasised element
  shoves its neighbours, and the neighbours are the layout.
