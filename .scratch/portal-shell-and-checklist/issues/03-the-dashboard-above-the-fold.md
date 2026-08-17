# 03 — The Dashboard, composed, above the fold

Status: done

**What to build:** The landing screen answers its own first question on a
1366×768 laptop without scrolling. A student sees how far through they are, the
three things they can act on now in the order that serves them, and what their
Points are turning into — in that priority.

**The defect this closes, in the client's words:** *"eu aqui quando eu abro ele,
eu não tenho direcionamento"*, and the fix she named: *"ele já traz de cara, sem
conversa, o que que tá faltando? Próximos passos. Eu não fico tendo que
procurar."*

**The vertical budget is the constraint, not a preference.** ADR 0008 measures
~640px of usable height at the design viewport. The reference prototype stacks a
greeting, a progress bar, a next-task sentence, a momentum block and three tabs
before its first card, which puts that card below the fold. Cut: greeting and
progress figure on **one line**, the rich Balance in the **secondary column**,
and the primary column running header → one orientation line → cards with nothing
between. A screen that celebrates progress before showing the next action is
doing the opposite of what was asked for.

**Three cards, not more.** The fourth is below the fold at HD, and a landing
screen whose list continues past the fold recreates the problem it was built to
fix. A link goes to the full list, which is cycle two's.

**The first card earns its position.** It carries `Best next step` and the count
of what it opens, because the spine counts unlocks transitively and the badge is
a claim the student can check rather than an assertion of magic.

**The rich Balance** uses `nextTarget()` unchanged: the ladder rung, what it
converts to, and the distance in Points. It is Dashboard-only — it does not
follow the student into other Areas, where the compact form already answers the
question it answers.

**Blocked by:** 01 (the rich Balance form), 02 (the spine, the route and the card
this composes).

**Referências:**
- [Remote](https://mobbin.com/screens/1a5a8ac8-49f2-467c-ad4f-5e36c2e86936) — `Hello,` and `Things to do (4)` at the very top of the dashboard, with the first actionable row immediately under it. The greeting costs one line and the work starts straight away.
- [Wrike](https://mobbin.com/screens/d750f820-568f-4a4f-8540-1692449871de) — work in the primary columns with the progress figure pushed to the rail. The separation this ticket applies: aggregate state to the side, actionable work in the middle.
- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) — the counter-reference, adopted only in part: it crowns the page with a large `0 / 595` ring, which is exactly the preamble this ticket cuts. Taken from it: the value tag per row and the grouped counts. Rejected: the ring above the work.
- [Uxcel](https://mobbin.com/screens/165ede79-21ff-4a81-adda-68a942c39c21) — `Getting started` as a compact right-column block of three checkable rows beside the main content, with the reward block under it. The secondary column's arrangement.

- [x] Greeting and progress occupy one line, not a section
- [x] The first Quest card is fully visible at 1366×768 with browser chrome
- [x] Exactly three Available Requirements are shown, in Smart order
- [x] The first carries `Best next step` and a transitive unlock count
- [x] The rich Balance sits in the secondary column and nowhere else
- [x] No momentum banner, progress ring or celebration sits above the first card
- [x] A link leads to the full list; the full list itself is not built here
- [x] Nothing in the primary column sits between the header and the cards
- [x] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** Measured at 1366x768 with browser chrome: the first card ends at
**y=241** and the third at **y=573**, against the ~640px ADR 0008 measures. The
whole Dashboard fits without scrolling (`scrollHeight` = 768).

Greeting and progress share one line in the shell's header; the primary column
runs header → one orientation line → cards with nothing between; the rich
Balance is in the secondary column and nowhere else. No momentum banner, ring or
celebration anywhere above the work.

A student who has finished nothing reads `12 things to do before term starts`
rather than `0%`, and a student with nothing Available reads why — those are
user stories 5 and 6, and both are one line rather than a state.
