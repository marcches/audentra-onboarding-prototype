# 09 — The sweep and the human acceptance

Status: done

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

## Comments

**Shipped.** Walked end to end in a real browser at 1366x768 — entry, offer, who
you are, health, who we call, housing, campus life, review and sign, deposit,
enrolled — then as an international student, then at 390x844. Both deposit
branches (pay now, pay by deadline) reach their receipt. Console clean
throughout.

Every row of the spec's defect table re-measured, recorded in
`docs/review-script.md`. Headline numbers: connector 4.5px off → 0; FERPA 89
characters → 68; the two voids 90px and 140px → 0; gradient 3 usages, none on a
Section header → one hairline per work sheet plus the current Section's marker;
nine Quests for every student.

At 390x844: no horizontal overflow, nothing clipped, no overlapping Sections,
rail out of flow, PhaseBar in place, hairline surviving the narrower sheet.

**Five defects the walk found that no source-level test could have**, all fixed:

1. A collapsed `Reveal` kept its subtree focusable and hit-testable, so a file
   meant for Health's immunization record landed in the hidden
   medical-documentation input. Now `inert` while closed.
2. A CSS grid row stretched its items to the tallest sibling on Deposit's
   receipt — `fill` reintroduced by CSS after the prop was deleted.
   `items-start`.
3. The student card's enrolment year sat on top of the Audentra wordmark, which
   was absolutely positioned behind a 56px reserve narrower than the mark. The
   wordmark is in flow now and the meta takes two rows.
4. Five paragraphs still ran past 75 characters, and the screen lead was exempt
   from the measure when it should not have been.
5. "About 23 minutes , saved as you go" on the entrance had a space before its
   comma, from a clause split across two flex children inheriting the row's gap.

**One measurement left standing at 76**: the dropzone caption on Health ("A
letter or report from a clinician. PDF, JPEG or PNG · up to 8 files, 30 MB"). It
is a control caption rather than a paragraph, and it truncates rather than
wrapping.
