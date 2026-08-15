# 04 · Every sheet is content-height

Status: todo

Three sibling Steps in one Phase, three different bottom edges:

- `who-you-are` — §3 holds one sentence and ~90px of white under it.
- `health` — the dropzone, then ~140px of white under it.
- `who-we-call` — sheet ends at y≈400, ~280px of Ground under it.

The first two pass `fill` on `Sections` and `grow` on a Section; the last two do
not. `step-shell.tsx` claims in a comment that this was solved by "putting
something worth reading in the space" — it was not solved, the void moved
inside the sheet.

## The rule

`fill` and `grow` leave the system. Every sheet is the height of its content.
Where a screen is short, Ground shows underneath, and Ground under a sheet is
the ordinary state of a page — it is not a hole. A hole is white space *inside*
a block that has stopped having content.

The one thing that genuinely wanted to be large — Health's dropzone — gets an
honest intrinsic height instead of borrowing the column's slack.

## Reach

`Sections fill` and `Section grow` are deleted from the props, not just from the
call sites, so a future screen cannot reintroduce this by passing them again.
Every route is checked, not only About you.
