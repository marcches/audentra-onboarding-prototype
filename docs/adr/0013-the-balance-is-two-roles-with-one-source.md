# The Balance is two roles with one source

`CONTEXT.md` has said since the Points round that **there is exactly one Balance
in the shell**. The portal is where that sentence stops being true and starts
being two different sentences wearing one coat.

A student in the portal asks the Balance two questions that want different
answers in different places. *How many do I have?* is asked constantly, from
every Area, and wants a figure small enough to live in the sidebar forever. *What
is this turning into?* is asked occasionally, wants `nextTarget()`, the Bookstore
ladder rung and the distance to it, and does not fit anywhere a permanent
element can sit at 1366×768.

The reference prototype draws both and does not notice: `Momentum points 428 ·
+323 available today` in its header, and `Your momentum 428 pts · Settling in ·
422 to Trailblazer` further down the page. The catalogue is split the same way —
[Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) puts
the ring at the top of the content,
[Wrike](https://mobbin.com/screens/d750f820-568f-4a4f-8540-1692449871de) puts a
progress figure in the sidebar,
[Uxcel](https://mobbin.com/screens/165ede79-21ff-4a81-adda-68a942c39c21) and
[OpenSea](https://mobbin.com/screens/516ee107-5c44-4af4-b299-df1bd30711cf) put
the rich block in a right-hand column. Nobody picks one.

**From this round there are two roles and one source.** A compact Balance in the
sidebar, present in every Area, carrying the figure and nothing else. A rich
Balance in the Dashboard's secondary column, carrying the rung, the distance and
the conversion. Both read `points.ts`, which stays the only module that knows
what a Point is worth.

The invariant is rewritten rather than dropped: **there is exactly one source of
the number.** That is what the original line was protecting — a second Balance
computing its own total is how two figures come to disagree on one screen — and
it was expressed as a rule about placement because, in a flow with one screen at
a time, placement and provenance were the same thing.

## Considered options

**One Balance, sidebar only** was rejected because it deletes the rung and the
distance, which is the whole of ADR 0002: a Point with no named destination is a
scoreboard. The compact figure alone is a scoreboard with a good address.

**One Balance, Dashboard only** was rejected because a student in Documents or
Financials then has no Balance at all, and the client's stated goal for the
gamification is that it is *felt*, not visited.

**Two Balances, each with its own total** was never seriously on the table and is
named here only so that a future round does not arrive at it by accident. It is
the failure the original invariant existed to prevent.

## Consequences

- `points.ts` stays the single source, unchanged. Nothing about this decision
  touches what a Point converts to or how the ladder works.
- The compact Balance is a permanent shell element and therefore subject to the
  shell's own rules: it does not animate on change while the student is reading
  something else, and it never becomes the thing that reflows a column.
- The rich Balance is Dashboard-only. It does not follow the student into My
  Enrollment, where the checklist already carries per-Quest Points and a second
  aggregate would be a third voice saying the same thing.
- The Decay figure belongs to the Quest card, never to either Balance. A Balance
  reports what is held; Decay is a property of work not yet done.
- `CONTEXT.md`'s **Balance** entry is rewritten to say source rather than
  placement, and carries a note explaining what the old sentence was for — so
  the next reader finds both halves of the argument.
