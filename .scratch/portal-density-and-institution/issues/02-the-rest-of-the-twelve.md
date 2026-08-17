# 02 — The rest of the twelve, as rows

Status: ready-for-agent

**What to build:** The Dashboard stops showing three of twelve and then stopping.
Under the three cards, the remaining Requirements appear as compact rows — which
is what closes the 195px void measured under the content, and what answers the
client's *"a gente precisa ser mais densos"* with information rather than with
smaller type.

**The row carries four things**: the Quest name, its category, its deadline as
date and distance, and its value today. It **drops** the minutes estimate and
`See how` — a row being scanned does not support six fields, and the full weight
of a card has to keep meaning something.

**The two states nothing has drawn yet.**

- **Under review** says who holds it and that it is not the student's move. A
  state the student cannot act on still owes them a reason for existing.
- **Upcoming** names what it is waiting on, from `waitingOn()` — which the spine
  already derives and which no screen has rendered. A named prerequisite is an
  instruction; a padlock is an obstacle.

**What this is not.** No ordering tabs, no collapsible groups, no completed-work
summary. Those are My Enrollment's and stay there; if this ticket starts growing
them, it has taken the next cycle's work.

**Referências:**
- [Bonsai](https://mobbin.com/screens/1956d6e4-3b1d-4a2b-ba5b-23c227ad87fd) — the numbered list of remaining steps beside the one expanded step. The exact division of weight this ticket applies: one at full size, the rest as lines.
- [Circle](https://mobbin.com/screens/509ed183-a8b9-4613-a2a4-0164192e5aba) — a setup checklist whose rows carry their own state marker and nothing else, so a dozen of them scan in one pass.

- [ ] Every Requirement not in the three cards appears as a row
- [ ] The row carries name, category, deadline and value, and nothing else
- [ ] Under review names who holds it
- [ ] Upcoming names what it waits on, derived rather than written
- [ ] Complete Requirements are not in the list
- [ ] No ordering tabs, no collapsible groups, no completed summary
- [ ] The first Quest card still ends above the fold at 1366×768
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
