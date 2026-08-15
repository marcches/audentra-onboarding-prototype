# 05 — The rail becomes a spine

Status: done

**What to build:** A student glancing left sees a line that runs through the
centre of its markers and carries a mark for every Quest, so the rail reads as a
spine they are travelling rather than as a leftover border with names beside it.

Two defects, and fixing only the first leaves the second standing.

**The alignment.** Measured at 1366×768: the group marker's centre sits at
`x=28`, the connector line at `x=23.5`. Off by 4.5px, on all five groups, because
the line's offset was guessed at rather than derived from the marker's geometry.
The fix is to derive it, so it cannot drift again when the marker changes size:

```ts
export const RAIL_MARKER = 20;   // the marker's size, in px
export const RAIL_ROW_PAD = 4;   // the row's horizontal padding, in px
export const RAIL_CONNECTOR_OFFSET = RAIL_ROW_PAD + RAIL_MARKER / 2;
```

The same shape the layout domain already uses for `presence` and the rail's
width: a named export the ruler can do arithmetic against.

**The function.** The line has no marks on it. Every Quest row is bare and the
check sits out on the right, so the line reads as a border. Each Quest gets a
small mark **on** the line: a hollow dot when unstarted, a filled dot when
current, a check when done. The check that sits on the right today moves onto the
line — no new mark is added to the screen, one changes sides.

**The segments.** One continuous line from the first marker to the last would
draw the Closing and After into the same run as the three Phases, which is
exactly what ADR 0001 and `CONTEXT.md` keep apart. The line stays a segment per
group, starting under its own marker and ending at its last Quest.

**Blocked by:** None — can start immediately.

**Referências:**
- [Melio](https://mobbin.com/screens/03ef6cc6-505c-4277-bfe2-b0c068a141c1) and [Gamma](https://mobbin.com/screens/523d6c4f-ac58-44f7-9d7a-a9881cba40f7) — the connector passes through the marker centres, with one marker per row. The anatomy this rail is missing.
- [15Five](https://mobbin.com/screens/b15499c2-0d36-47a0-a758-073e309e1a60) and [Remote](https://mobbin.com/screens/0d2b48f4-1904-4fe9-b335-a34ca87fbb68) — both segment the line per group rather than running one spine top to bottom, which is what keeps the Closing and After from reading as Phase four.
- [Deputy](https://mobbin.com/screens/58047c57-4992-4c27-9974-43c522a5aa42) — a mark per row that becomes a check on completion, and no second status furniture out to the right.
- [Later](https://mobbin.com/screens/d9985ab0-703c-437f-9b57-3cee60d686c4) — current as a filled mark against outlined neighbours: three states in one shape.

- [ ] The marker size, the row padding and the connector offset are named exports of the layout domain, and the connector is computed from them
- [ ] The line runs through the marker centres on all five groups, at 1366×768
- [ ] Every Quest carries a mark on the line: hollow dot unstarted, filled dot current, check done
- [ ] The check that sat on the right has moved onto the line, and no new mark was added to the screen
- [ ] The line is a segment per group, from the group's own marker to its last Quest
- [ ] The Closing and After stay visibly apart from the three Phases
- [ ] The layout ruler asserts the connector offset equals the marker's centre, computed rather than compared to a literal
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** `RAIL_MARKER`, `RAIL_ROW_PAD` and `RAIL_CONNECTOR_OFFSET` are named
exports of the layout domain and the rail computes from them. The ruler asserts
the arithmetic rather than a literal, and also ties the constants to the `size-5`
and `px-1` actually drawn — so a class changing without the constant fails rather
than drifts.

Measured at 1366x768 after: **marker centre, line centre and mark centre all at
x=28**, on all five groups. Before: 28 and 23.5.

Every Quest carries a mark on the line — hollow dot unstarted, filled dot
current, check done. The check that sat out on the right moved onto the line;
nothing new was added to the screen, and the ruler asserts the rail draws exactly
two `CheckIcon`s.

The segments are drawn per row rather than as one run, which is what lets a
segment start under its own group marker and stop at its last Quest without
anything measuring a row's height. The Closing and After stay visibly apart from
the three Phases.
