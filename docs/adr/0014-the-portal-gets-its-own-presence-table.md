# The portal gets its own Presence table, and the gate's stays closed at eight

ADR 0008 gave this repo three width classes and a Presence table listing **the
eight pieces that genuinely differ between a phone and a desktop**. The number is
the point. `layout.ts` says so in its own comment: without the closed list,
Presence is `hidden lg:block` with a nicer name, and a ninth row has to be argued
for in a diff rather than typed into a document nobody re-reads. A test counts
the rows.

The portal brings pieces the table never anticipated — a sidebar that becomes a
bottom navigation, a floating assistant window that cannot exist on a phone,
collapsible state groups, a checklist card whose five metadata fields cannot all
survive at 390px. Three or four new rows, on a table whose value is being small.

**The portal gets its own table, and the gate's stays at eight.**

Growing the existing table to eleven or twelve destroys the only thing it does.
Eight is a number a reviewer can hold; twelve is a list. And the argument is
already made one level up: the repo grew a second context this round precisely
because the gate and the portal share a vocabulary at the edges and disagree in
the middle. A layout ruler is domain language about screens, and it splits along
the same seam for the same reason.

## Considered options

**One table, grown to eleven or twelve** was rejected on the grounds above. The
cost of a shared table is not maintenance, it is that nobody notices the
thirteenth row going in.

**No table for the portal, media queries as they come** was rejected because it
is the state ADR 0008 was written against, and it produced the defect the client
named: *"o desktop não foi construído, foi alargado"*. A surface without a
closed list of exceptions grows them silently.

**A shared table with a `surface` column** was rejected as the worst of both: one
file to read for either question, with half the rows irrelevant to whichever
question was asked, and a shared row count that means nothing.

## Consequences

- Two tables, two tests. `layout-rules.test.ts` keeps counting the gate's eight.
  The portal's table gets its own count, fixed at whatever the first cycle needs
  and defended the same way.
- **The three width classes are not duplicated.** `compact` / `medium` /
  `desktop` and the 1366×768 design viewport are ADR 0008's and remain shared —
  they are a property of the machines students use, not of a surface. Only the
  exception list splits.
- The rule about authority is inherited unchanged: container queries inside the
  content column, media queries for the shell alone. The portal's shell is a
  different shell, and the rule is the same rule.
- The portal's table is written in the cycle that needs it rather than up front.
  A row that no screen has yet demanded is a guess, and guesses are what the
  closed list exists to keep out.
- If the two tables ever converge — if the portal's rows turn out to be the
  gate's rows with different names — that is evidence the split was wrong and
  should be reversed in a new ADR, not silently by merging the files.
