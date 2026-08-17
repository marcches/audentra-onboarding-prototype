# 05 — The placeholders get a body

Status: ready-for-agent

**What to build:** Seven screens that currently end at y=188 with 580px of grey
under them. Honest is right; **empty is not the same as honest**, and seven
screens that stop three lines in is what makes the whole portal read as
unfinished in a walkthrough.

Each unbuilt Area keeps its one true sentence and gains:

- **What will live here**, as a short labelled list of three or four things. Not
  a feature promise with dates on it — the things themselves, named the way the
  student would name them.
- **One true pointer** to where they can act meanwhile, when there is one. My
  Financials points at the deposit; My Documents at what they have already sent;
  My Campus Life at the organisations they marked in the gate. Where there is
  genuinely nowhere, it says nothing rather than inventing a destination.

Still one component. Still no invented illustration, no fake count, no progress
bar, no "coming soon".

**Blocked by:** 01 — same shell, same title scale, same signature.

**Referências:**
- [Render](https://mobbin.com/screens/f4e5d3b4-195a-438d-aa0e-a422c91bc5fc) — the empty-state template already adopted, and the reason the list of what-will-live-here belongs *inside* the same card rather than in a second block below it.
- [Salesforce](https://mobbin.com/screens/d984cf82-47ad-415e-a48f-f098d2bd6210) — `Nothing to see here` at a size that does not read as a defect. The proof that an honest empty state may occupy real estate.

- [ ] Every unbuilt Area names three or four things that will live there
- [ ] Every pointer offered is real and reachable today
- [ ] An Area with nowhere to point offers nothing rather than inventing one
- [ ] Still one component, and still no illustration, count or progress bar
- [ ] The screen no longer ends in a third of a viewport of Ground
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
