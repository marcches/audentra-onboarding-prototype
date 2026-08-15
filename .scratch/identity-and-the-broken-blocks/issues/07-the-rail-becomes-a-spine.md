# 07 · The rail becomes a spine

Status: todo

Two defects, and fixing only the first leaves the second standing.

## The alignment

Measured: group marker centre at `x=28`, connector line at `x=23.5`, on all five
groups. `ml-[0.5625rem]` against a `size-5` marker inside `px-1`. The line is
derived from the marker's geometry instead of guessed at, so it cannot drift
again when the marker changes size.

## The function

The line has no markers on it. Every Quest row is bare and the check sits on the
right, so the line reads as a leftover border rather than as a spine. Melio,
Gamma, Remote and 15Five all put a mark per row *on* the line.

Each Quest gets a small mark on the line: a hollow dot when unstarted, a filled
dot when current, a check when done. The check that sits on the right today
moves onto the line — no new mark is added to the screen, one changes sides.

## The segments

One continuous line from the first marker to the last would draw Closing and
After into the same run as the three Phases, which is exactly what ADR 0001 and
`CONTEXT.md` keep apart. The line is a segment per group, starting under its own
marker and ending at its last Quest — 15Five and Remote both do this.
