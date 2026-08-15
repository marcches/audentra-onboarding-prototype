# 08 — A ruler for stacking and stillness

**What to build:** Two written rulers — one for how much a screen may stack, one
for what may move — plus the shell changes that bring the existing chrome into
line with the second, plus a geometry test that keeps it there. The client's
words: *"olha o tanto de informação uma contra a outra, nao dando harmonia aos
olhos"* and *"vc erra bastante tbm com layout, onde fica dando flick, de
posição"*. The second complaint has four causes and three of them live in the
shell, which is why this ticket exists before the screen he was looking at.

**Blocked by:** None.

**Status:** done

**Referências:**
- [Kit](https://mobbin.com/screens/da62829d-aee9-43f4-8b20-a40a9e89062d) — title, *one* line of help, then controls. No second heading inside the content region. The shape the stacking ruler is written from.
- [Uxcel](https://mobbin.com/screens/74a1a5b1-244f-4dbb-bfb2-b2c3f0f630d9) — the same, with the fixed footer bar carrying the only primary action at a constant height. Confirms 4.5rem is a ceiling, not a starting point.
- [Magnific](https://mobbin.com/screens/6ea5f92a-028a-422c-89c1-c35ccd7e1e88) — heading anchored at the top of the column, not centred, even with a short screen's worth of content. The argument for killing `centered`.
- [Substack](https://mobbin.com/screens/898419be-fb09-44aa-a5bb-4ce7181bd503) — 30 selectable items with no filter row at all. Cited here because it is the evidence behind the "no control for a catalogue that already fits" rule, which is a ruler line, not a Campus life detail.

## The rulers

Both go into `docs/design-research.md` as a new section, written as
prohibitions rather than aspirations — each line answers "may this exist?" with
yes or no.

**Stacking.** One title-and-lead pair per screen, and the lead says what is
gained, not that the screen is sorry to exist. `Panel` wraps fields, never a
gallery. No control exists to work a catalogue that already fits on screen. A
selection count lives in the CTA, never in a second list. One meaning per visual
channel — if desaturation says "not chosen", it says nothing else.

**Stillness.** Every step anchors its `h1` at the same pixel. Nothing is born
above the title. The action bar is a constant 4.5rem; what does not fit there is
not a bar. A primary button's width does not react to its own label. A
conditional block inside the body either reserves its space or is an overlay.

## Checklist

- [x] `docs/design-research.md` gains a section for this round, with the
      references above and one line each saying what was taken.
- [x] `centered` / `justify-center-safe` is gone from `step-shell.tsx` and from
      `offer.tsx:52`. Offer's `h1` sits where every other step's does.
- [x] `--action-bar-height` is a constant. The `actionBarHeight` prop and
      `offer.tsx:54`'s `response === null ? "6.5rem" : undefined` are gone.
- [x] Offer's reassurance line moves into the body beside what it reassures
      about — it answers a question asked while *reading*, not while deciding.
- [x] Offer's deadline moves into the existing facts grid (`offer.tsx:95-99`).
      It is a fact of the offer, not part of the act.
- [x] `ReturnToReview` no longer renders above the header. With `?from=review`
      it *replaces* Back in the action bar — the `steps.ts`-derived Back is the
      wrong answer to "where do I go back to?" when you did not arrive by Next.
- [x] Primary buttons whose label changes with state carry a fixed `min-w`, so
      the fix to the body cannot break the footer.
- [x] A test keeps the invariants: no escape hatch for centring or bar height
      exists; `--step-measure` and `--action-bar-height` are declared once and
      reassigned nowhere; `header` is the first child of the measured column;
      every step passes `actions`. **Amended from what this ticket asked for** —
      it wanted a walk-and-measure test, and the repo has no DOM environment to
      run one in. See "The geometry test, honestly" below; the walk was done by
      hand and its numbers are in the table.
- [x] Violations of a ruler line in steps this ticket does not touch are filed as
      findings rather than absorbed. One was found — see below.
- [x] Verified at 390, 768 and 1440 across all seven steps, in both their plain
      and `?from=review` states — 42 measurements: no horizontal scroll, action
      bar reachable, title anchored.

## Comments

Written from the grilling session of 2026-08-14. Nineteen questions, all
answered by the client; the decisions above are his, not defaults.

Two things this ticket deliberately does not do. It does not reform the other
five steps: the ruler is born, the test points at violations, and each violation
becomes its own ticket. And it does not touch copy — the rewritten lead lines
belong to `06-copy-sweep.md`.

The honest weakness, recorded before anyone discovers it: the test measures the
frame, and neither complaint was about the frame. "One title-and-lead pair per
screen" and "`Panel` does not wrap a gallery" still depend on judgement, and
ticket 01 is the standing proof that judgement gives itself the benefit of the
doubt — it promised "density has a number, not a vibe" and shipped Campus life
at −4.8%, then called it done.

### What was built

Three of the four causes of the flick were fixed by *deletion*. `StepShell` no
longer accepts `centered` or `actionBarHeight`, so no step can move its own
title or change the bar's height — and because `--action-bar-height` also drives
the column's bottom padding, that second prop was moving the content while the
student answered. `ReturnToReview` came out of the column and into the bar,
where it takes over the Back slot on `?from=review`; `BackButton` stands down in
that case, so there is never a choice between two returns. It works on Offer
too, which has no Back of its own but is in the Review summary.

Offer paid for the constant bar. Its three-row footer became one row: the
deadline joined the facts grid as a fifth cell (it is a fact of the offer, not
part of the act), and the reassurance merged with the deposit line in the body,
next to the thing it reassures about. The merge also dropped a duplicate — "only
Admissions can reopen it" was already in the step's own lead.

`steadyAction` is the width floor for a state-labelled primary button, measured
rather than guessed: the widest label the flow produces is "Continue with 9
clubs" at 249px, so the floor is 16rem.

### Measured

All seven steps, each in its plain state and again with `?from=review` — 14
states per width, three widths:

| | h1 top | action bar | h-scroll |
|---|---|---|---|
| 1440×900 | 28px on all 14 | 73px on all 14 | none |
| 768×1024 | 117px on all 14 | 73px on all 14 | none |
| 390×844 | 117px on all 14 | 73px on all 14 | none |

73px is `--action-bar-height` (4.5rem = 72px) plus its top hairline. The 28 → 117
difference between desktop and the two narrower widths is the mobile `PhaseBar`,
which is in flow below `lg` and replaced by the rail above it — expected, and
constant within each width.

Campus life was also sampled through all 19 states of picking and unpicking its
nine clubs: one `h1` top (28px), one page height (900px), one CTA width (256px)
across every one of them. The step does not move while it is used.

No horizontal scroll at either width. Before this ticket Offer's h1 was centred
in whatever the viewport had left over, so it sat well below every other step's
and moved a second time the moment the offer was answered and the bar shrank
6.5rem → 4.5rem. Those two numbers were not measured before the change — the
mechanism is in `offer.tsx` history, the "after" column above is what was
measured.

### A finding this ticket did not fix

Short steps have a lot of dead canvas at 1440×900 — the gap between the bottom of
the content and the top of the bar: **Offer 452px, Health 443px, Deposit 265px.**
Campus life is 36px. This is not a regression from killing `centered`: Health has
never been centred and has always looked like this, and the change made Offer
*consistent* with it rather than uniquely wrong. But 450px of nothing on two of
seven steps is a content question per step, and the stacking ruler is what it
should be argued against. Filed here rather than absorbed.

### The geometry test, honestly

`src/lib/layout-rules.test.ts` asserts source-level invariants, not rendered
geometry: this repo has no DOM test environment, and adding Playwright to it is a
bigger decision than this ticket should make on its own. It is not a downgrade in
every respect — an escape hatch that has been deleted cannot be misused by a
future step, which is stronger than measuring one after the fact. What it cannot
do is catch a *new* mechanism that moves the layout. The numbers in the table
above were measured by driving the real app, by hand.

### Handoff

Typecheck, Biome, `pnpm test` (31 assertions, 6 of them new) and `pnpm build` all
clean. Committed on `main`. `/code-review` not run, per standing instruction for
this repo.
