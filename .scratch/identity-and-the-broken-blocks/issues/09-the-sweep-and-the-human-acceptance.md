# 09 — The sweep and the human acceptance

Status: ready-for-agent

**What to build:** The walk that says the round is done. Every defect in the
spec's table was a measurement taken at 1366×768 before anything was designed;
this ticket takes each one again, on the shipped flow, and records the new
number beside the old one.

The repo has no DOM environment, and by ADR 0006 the layout tests assert
source-level invariants rather than measuring a rendered page. That covers the
escape hatches — a prop that does not exist cannot be passed — and covers none of
the pixels. The pixels are this ticket, and the client agreed to that explicitly
in the previous round.

The walk is all nine screens at **1366×768**, the viewport ADR 0008 names, and
then at **390×844** for the phone, where the same Sections stack in one column
and the signature has to survive the narrower sheet.

**Blocked by:** 01, 02, 03, 04, 05, 06, 07, 08.

**Referências:** none, and deliberately. This ticket makes no UI decision — it
verifies the ones taken in 01 through 08, each of which carries its own. The
precedent for an acceptance ticket closing a round is the previous round's own
last ticket.

- [ ] Every screen re-measured at 1366×768, with each row of the spec's defect table given its new number
- [ ] No white space inside a block that has stopped having content, on any screen
- [ ] No paragraph inside a Section sets past 75 characters per line
- [ ] Exactly one gradient hairline per screen, and none on the guide
- [ ] The Section marker's three states are distinguishable at a glance without reading the numerals
- [ ] The crest reads as a university's arms at rail size, and its gold is nowhere else on screen
- [ ] The rail's connector passes through its marker centres, with a mark per Quest and a segment per group
- [ ] The same walk at 390×844: nothing overlaps, nothing is clipped, and the signature survives the narrower sheet
- [ ] Nine Quests are counted everywhere, for a citizen, a permanent resident and an international student
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass on the finished round
