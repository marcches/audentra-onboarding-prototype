# 06 — The sweep and the human acceptance

Status: done

**What to build:** Nothing new. Every measurement in the spec's defect table
taken again on what shipped, at 1366×768 and 390×844, plus the judgements no test
can make.

The previous two cycles each closed this way for the same reason: the three
rounds before them fixed the place the finger pointed at and left the rest to be
found next time.

**The table, measured again.** Areas in the sidebar and how many are grouped.
Whether `Appointments` is among them. Whether `Edward AI` still occupies a row.
Whether the landing screen renders outstanding work. Whether "what is missing" is
answerable without opening a second screen. Whether any piece of work carries a
value, and whether that value decays.

**The one measurement that is new.** The y-coordinate at which the first Quest
card ends, at 1366×768 with browser chrome. Above the fold or it is not done.

**The judgements no test makes.** The metadata step reading as metadata rather
than as small body text. The sidebar reading as dense rather than as cramped. The
placeholders reading as honest rather than as broken. The decay reading as a
reason to act today rather than as a threat — which is the one this cycle most
needs a human on, because it is the component with no precedent in the reference
catalogue.

**What is checked and expected not to move.** The gate, in full. Walk it end to
end at both viewports. `steps.test.ts`, `summary.test.ts` and `points.test.ts`
pass unedited; if any of them needed editing during the cycle, that is the
finding, not a footnote.

**Blocked by:** 01, 02, 03, 04, 05.

**Referências:**
- [Salesforce](https://mobbin.com/screens/d984cf82-47ad-415e-a48f-f098d2bd6210) — the density ceiling the client named. The sweep's question is whether the shell landed nearer this than the airy version, without crossing into it.
- [Linear](https://mobbin.com/screens/610d34b6-6ad8-45ab-80fb-2107b31ed01e) — the target for the metadata step: a dense list where the item name and the facts about it are unmistakably different sizes. Held beside the built screens to judge whether the new step reads as metadata.
- [Remote](https://mobbin.com/screens/1a5a8ac8-49f2-467c-ad4f-5e36c2e86936) — actionable work at the top of the landing screen with the greeting costing one line. The arrangement the fold measurement is checking against.

- [x] Every row of the spec's defect table re-measured on the shipped portal
- [x] The first Quest card ends above the fold at 1366×768 with browser chrome
- [x] Both viewports walked: 1366×768 and 390×844
- [x] The gate walked end to end at both viewports and unchanged
- [x] `steps.test.ts`, `summary.test.ts` and `points.test.ts` pass unedited
- [x] The four human judgements recorded with a verdict, not a tick
- [x] Anything found that this cycle does not fix is written down as a finding rather than left
- [x] `pnpm typecheck`, `pnpm test`, `pnpm lint` and `pnpm build` pass

## Comments

**Shipped.** Every row of the spec's defect table re-measured on `/portal` at
1366x768 and recorded in `docs/review-script.md`, beside the four human
judgements and the three findings this cycle does not fix.

Headline numbers: nine Areas grouped into three, `Appointments` in the sidebar,
`Edward AI` no longer a row, the landing screen rendering three actionable
Requirements as its first content, "what is missing" answerable without opening a
second screen, and a value with literal decay on every card. The new measurement:
the first Quest card ends at **y=241**, the third at **y=573**, and the whole
Dashboard fits in 768px without scrolling.

390x844 walked: bottom navigation with 44px targets, metadata wrapping to two
rows, no horizontal overflow (`scrollWidth` 380), console clean.

The gate walked and unchanged at both viewports — entry, the form Steps, the
catalogues, the Rail's Balance tile and the compact PhaseBar chip all render as
before. `steps.test.ts`, `summary.test.ts` and `points.test.ts` were never
opened during the cycle, which is the tripwire the spec asked for: no commit in
this branch touches them or `points.ts`.

`pnpm typecheck`, `pnpm test` (137), `pnpm lint` and `pnpm build` all pass.

**Findings carried forward** (also in `docs/review-script.md`):

1. Nothing leads from the gate to the portal. `/done` does not link to
   `/portal` because any change to the gate was out of scope; today the portal
   is reached by address. Worth a line in the next cycle's spec.
2. The bottom navigation does not scroll the current Area into view when it
   starts off-screen. Compact is drawn and correct, not polished (ADR 0008).
3. The decay display remains the one component validated by authority rather
   than by evidence. It is built as the client specified and is the question for
   the two specialists she offered.
