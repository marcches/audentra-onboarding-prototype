# HD is the desktop we design for, and Full HD is the widening

The desktop layout was composed against 1920×1080 and then trusted to survive
narrower machines. It does not: 1366×768 with browser chrome leaves roughly
640px of usable height, against ~890px on Full HD, and the difference is spent
before any content is drawn — a 4.5rem fixed action bar is 5% of one viewport
and 11% of the other. From this round the design viewport is **1366×768**, and
Full HD is the case that widens rather than the case that is designed.

Three width classes exist and no more: **compact** (<768), **medium**
(768–1279), **desktop** (≥1280). 1280 rather than 1366, so a real HD machine
sits inside the class rather than on its edge. Above 1280 nothing recomposes —
larger monitors only release the archetype measures, so the big screen is the
same screen with more air and not a fourth layout nobody tests.

## Considered options

Continuing to widen the mobile tree by Tailwind breakpoint was rejected because
the client's ask was to *build* the desktop, not to let it fall out. Two React
trees chosen by measured width was rejected outright: it re-introduces
measure-then-remount, which is the mechanical cause of the flick and of the
"DOM errado" the client reported.

## Consequences

- One DOM. Composition changes through `grid-template-areas`, never through a
  component existing at one width and not at another. Where a piece genuinely
  differs it is declared in the Presence table (`docs/design-research.md`),
  which has exactly eight rows.
- **Container queries on the Step column are the authority; media queries are
  the shell's alone.** Anything inside the column responds to the column, not to
  the window — otherwise the same `Section` behaves differently in Housing and
  in Review purely because the archetype measures differ.
- Breakpoints outside the three classes are a test failure, not a review note.
- Vertical space becomes the scarce resource, which is what decides ADR 0009
  and ADR 0010 and why the desktop action bar is a floating pill rather than a
  bar (Presence table, row 2).
