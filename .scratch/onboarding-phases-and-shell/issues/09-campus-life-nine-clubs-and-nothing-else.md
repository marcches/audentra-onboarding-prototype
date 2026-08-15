# 09 — Campus life: nine clubs and nothing else

**What to build:** Strip the step down to the grid it is. Five stacked blocks
currently sit between the page title and the first club — a panel heading with
its own description, six category filters wrapping onto two rows, a tray of
chosen clubs, and an empty-filter sentence — to work a catalogue of **nine**
cards that fits in three rows. All five go. Selection stops being a second list
and becomes a state of the grid.

**Blocked by:** 08. The rulers have to exist before a screen is redrawn against
them, or the screen becomes the ruler.

**Status:** done

**Referências:**
- [Hulu](https://mobbin.com/screens/ad9f060d-9708-4f80-a92a-d0fa9412d08b) — the grid *is* the screen: one heading, then cards, no panel around them, and the count as "1 ITEM SELECTED" pinned at the foot. Taken: the grid on the ground, and the count out of the body.
- [Bloom](https://mobbin.com/screens/c7aa79c9-b8a4-4d60-b17a-a78cc8daa3e6) — chosen cards carry a check and the unchosen ones fade back. Taken whole: it is how "three, of these nine" gets read without a second list.
- [Skillshare](https://mobbin.com/screens/e0394052-5731-44d8-a3b1-3fc3be2eebdc) — the primary button carries the state: "Pick 3 to Continue". Taken: one button whose label changes, instead of Skip and Next asking the same question twice.
- [Substack](https://mobbin.com/screens/898419be-fb09-44aa-a5bb-4ce7181bd503) — 30 topics, no filter, and "Select 3 more to continue" as the only running count. Taken: the licence to delete the filter row outright.
- [Cosmos](https://mobbin.com/screens/a8ad2460-eb22-4ded-9098-bcfc3cc8a217) — grouping by category with a persistent "Choose 3 · 1/3" bar. Considered and **not** taken: six group headings for nine items is more heading than content.

## Checklist

- [x] The `SectionTitle` and its description come out. The step keeps one
      title-and-lead pair, and the surviving line says what is gained — a merge
      of today's two, drafted here and finalised in `06-copy-sweep.md`.
- [x] `CategoryFilter` (`campus-life.tsx:159-200`) is deleted. Six controls in
      two rows to filter nine cards costs more height than it saves.
- [x] The "Nothing matches that filter" paragraph goes with it — a third
      conditional block that existed only to serve the filter.
- [x] `Picks` (`campus-life.tsx:210-235`) is deleted. It repeated in pill form
      what the grid already showed, and it was born from nothing on the first
      pick, shoving the grid down.
- [x] The grid comes out of `Panel` and sits on the recessed ground. This is the
      written exception to ticket 01's "no step renders on the canvas": a panel
      wraps fields, not a gallery. The exception goes in the ruler, not just here.
- [x] `clubCategories` disappears from the UI entirely — no filter, no per-card
      label, no grouping. Nine photographs and nine names carry it.
- [x] Chosen cards get a check badge; unchosen cards fade back one step, over
      200ms on `--ease-out-expo` (the ticket said ~180ms; 200 is the scale step
      the rest of the card already transitions on, and matching it costs
      nothing). The global `prefers-reduced-motion` switch (`app.css:457-466`)
      already makes it instant.
- [x] The `ChromaGrid` spotlight (`club-grid.tsx:139-153`) is removed.
      Desaturation now means "not chosen" and nothing else; two greys with
      different weights is a vocabulary nobody asked to learn.
- [x] `docs/design-research.md` §6 "Campus life — `ChromaGrid` como mecanismo"
      is **corrected in place**, not deleted. The record of adopting it, and why
      it is being dropped, are both worth keeping.
- [x] Skip is gone. One primary button carries the state — "Skip for now" at
      zero, "Continue with N clubs" otherwise — at a fixed `min-w` per ruler 08.
- [x] The step's height does not change while it is used: picking and unpicking
      moves nothing. Covered by 08's per-step stillness assertion.
- [x] Record the before/after screen height at 1440×900 in the comments, against
      the 1026px this step measured in ticket 01.

## Comments

From the same grilling session as 08. The client's screenshot of this step is
what started it, but the layout half of his complaint turned out to be mostly
elsewhere — hence 08 first.

Worth stating plainly: ticket 01 already claimed a density pass on this step and
delivered −4.8%. The number moved and the stacking did not, because shrinking
each block is not the same as asking whether it should be on screen. This ticket
asks the second question and answers it "no" five times.

### What was built

Everything on the checklist, by deletion. `CategoryFilter`, `Picks`, the
empty-filter sentence, the `SectionTitle` and the `Panel` are gone from
`campus-life.tsx`; the file went from 236 lines to 127. The route no longer
imports `clubCategories`, `ClubCategory`, `Panel`, `SectionTitle` or `cn`, and
holds one piece of local state (`detailClub`) instead of two.

`ClubGrid` lost the `ChromaGrid` spotlight and with it a `useRef`, a
`useReducedMotion`, a `useState` and a pointer-move handler. What it gained is
one line: unchosen cards fall to `opacity-55 saturate-[0.4]` once anything is
chosen, over 200ms on `--ease-out-expo`, and hover returns a card to full
strength so changing your mind never means reading through the fade. The `z-10`
that used to lift chosen cards out of the spotlight's wash went too — there is
no wash to escape.

One button. `goNext` no longer takes an `answered` flag from whichever button
was pressed; it reads `picked.length > 0`, which is the fact it always wanted.
Skipping still does not tick Campus life in the rail.

### Measured, 1440×900

| | Before | After |
|---|---|---|
| Page height | 1026px | **900px — fits one screen** |
| Blocks between title and first club | 5 | 0 |
| Height moved while picking/unpicking all nine | tray in/out | **0px** |

The −4.8% of ticket 01 is now −12.3%, and the honest number is the second row:
the step stopped being a scrolling page. Nothing was made smaller to get there.

### The correction, not a deletion

`docs/design-research.md` §6 said "Campus life — `ChromaGrid` como mecanismo",
and adopting it was a real decision made against a real reference. The new
section revokes it and says why — two greys with different weights, one of which
had to be worked around with `z-10` — rather than quietly removing the
paragraph.

### Copy

The lead is a merge of the two lines that used to be on the screen: "We'll
introduce you to the people who run these before term starts — pick as many as
you like, or none." The old page lead ("None of this blocks your enrollment")
was a step apologising for existing, and the rail already says *optional*.
Final wording is still `06-copy-sweep.md`'s.

### Handoff

Typecheck, Biome, `pnpm test` (31) and `pnpm build` all clean. Verified at 390,
768 and 1440. Committed on `main`. `/code-review` not run, per standing
instruction for this repo.
