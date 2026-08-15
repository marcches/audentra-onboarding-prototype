# 01 — The shell: Phases, recessed ground, fixed action bar, mobile-first

**What to build:** Replace the shared chrome with a real application shell.
Recessed ground with white panels instead of a white canvas; a compact ~14rem
rail carrying the three Phases with only the active one expanded to its Quests; a
fixed action bar at the foot in both layouts; one Balance at the top of the rail.
Mobile gets a segmented three-part progress bar at the top and the same action
bar pinned to the bottom — a real layout, not the desktop one narrowed.

**Blocked by:** None.

**Status:** done

**Referências:**
- [Deel — bulk edit](https://mobbin.com/screens/ff59116e-b033-499e-badb-b4c9e02cd84a) — the whole thesis: grey ground, white panels, a *small* step panel rather than a 19rem sidebar, and Exit/Continue in a fixed footer bar.
- [Adaline](https://mobbin.com/screens/36261cc6-0b4a-4cd5-a957-e679828ec74f) — Phases as named chapters with their sub-steps inside and completed ones struck through.
- [Mixpanel](https://mobbin.com/screens/7a76dace-f4de-4782-89dc-441056f53e85), [Clay](https://mobbin.com/screens/1ed67bda-94e7-4a4d-a49a-0072ee2a29b3) — sidebar plus top context bar with content in bordered panels.
- [MyFitnessPal](https://mobbin.com/screens/3dfe2002-71de-42d7-97f2-98f707da5b3c) — segmented top progress bar where each segment is a Phase; [Zopa](https://mobbin.com/screens/3117af6d-d7d7-41b0-b296-06e764439d8d), [Alan](https://mobbin.com/screens/e1a0f7bf-2e64-4436-9508-66ec9cd02d70) — progress up top, button pinned down.

- [x] `steps.ts` models Phases and the Closing, not a flat list. `stepCount` and every count in the UI derive from it, as they do today.
- [x] Step `about-you` is renamed `identity-contact` throughout — id, path, label, store keys, summary, validation.
- [x] Rail is ~14rem, shows three Phases plus the Closing as a separate line, and expands only the active Phase to its Quests.
- [x] Phase rows carry the time estimate and required/optional. Quest rows carry an "optional" label and nothing else.
- [x] Fixed action bar replaces `StepActions` in flow, on desktop and mobile, carrying Back/Continue and the autosave line.
- [x] The third column (`context`) is gone. Anything that lived there has a home in the single column or in the panel above the fold.
- [x] Content sits on a recessed ground in white panels — no step renders directly on the canvas.
- [x] A responsive overlay primitive exists: bottom sheet below `md`, dialog above. Club detail is its first consumer. The celebration is deliberately exempt — it stays a full dialog in both.
- [x] Helper text is audited across the shared field components. The client asked "tem explicação em cada um deles — será que é necessário isso mesmo?" — a hint survives only where the field genuinely confuses without it.
- [x] Density has a number, not a vibe: every step carries measurably more content per screen height than today. Record before/after screen heights per step in the comments.
- [x] Verified at 390px, 768px and 1440px: no horizontal scroll, action bar always reachable, rail collapses to the segmented bar below `lg`.
- [x] `docs/design-research.md` gains a section for this round with the references above and what was taken from each.

## Comments

Delivered on `main`. Typecheck, Biome, `pnpm test` (19 assertions on the Phase
model) and `pnpm build` all clean.

### What was built

`steps.ts` is now three `Phase`s and a `closing` group; the flat `steps` array is
`groups.flatMap(...)`, so it cannot disagree with the grouping. `phaseCount`,
`stepCount`, the segmented bar, the rail and Review's summary all read from it.
The Phase row's time estimate and required/optional are *derived* (`groupMinutes`,
`groupRequired`), not typed — a Phase cannot claim 7 minutes while its Quests add
up to 9.

The rename went all the way through: `about-you` → `identity-contact` as id,
path, route file, component, store slice (`aboutYou` → `identityContact`),
validation schema and summary group. The storage key went to `v3` because a v2
blob would have restored an *empty* Identity & contact over real answers — the
shallow merge is forgiving about missing keys, which is exactly what makes that
silent.

Flow order changed with the Phases (Health now sits before Housing), which broke
every hardcoded `navigate({ to: "/onboarding/..." })` in the routes without
anything failing to build. Those are gone: `useStepNav(current)` derives Back and
Continue from `steps.ts`, and the button labels name the next Quest from it too.
The same bug was live in two written-out strings — the celebration's "Next: about
you" and the offer's "Six more steps open" beside a list that had become seven.
Both are computed now.

### Density: before/after

Page height at 1440×900, fresh state, measured against a worktree at `d5ebfd9`:

| Step | Before | After | Δ |
|---|---|---|---|
| Your offer | 1071 | 983 | −88 (−8.2%) |
| Identity & contact | 1527 | 1461 | −66 (−4.3%) |
| Health information | 900 | 900 | fits one screen in both |
| Housing | 900 | 900 | fits one screen in both |
| Campus life | 1078 | 1026 | −52 (−4.8%) |
| Review & sign | 2486 | 2460 | −26 (−1.0%) |
| Deposit | 900 | 900 | fits one screen in both |

The raw delta understates it, and the honest reading is the second column: **every
one of these now also contains what used to be in the third column** — Campus
life absorbed the picks strip, Review the whole Sign panel (307px), Identity &
contact the section index, Deposit the amount band, Housing the ranking slots.
That content previously cost the page nothing because it lived in a column that
did not exist below 1280px. Shorter *and* carrying more is the result.

Two of them only got there after a second pass. Moving the third column into the
single column made Campus life **+152** and Review **+70** taller on the first
attempt, which fails this ticket. Clawed back by making the content itself
denser rather than by putting anything back: the club photos went from square to
4:3 (a square card grew with the wider column — three rows of them cost more than
the whole step used to), and Review's answer rows went to two columns of
label→value, which is what they always should have been for short facts.

**Review & sign is the weak number here and I am not going to pretend otherwise.**
−1% is inside the noise. Its height is dominated by the agreement itself (1286px),
which is deliberately full-length: an earlier round removed its inner scroller on
purpose so the page is the only scroll container, and Laura approved the
read-to-the-end gate that depends on it. Making that step meaningfully shorter
means reopening that decision, which is ticket 05's territory, not this one's.

### Verification

390 / 768 / 1440, all seven steps: no horizontal scroll anywhere, action bar
within the viewport on every step at every width, rail present only at 1440,
segmented bar present only below `lg`. Bottom sheet and dialog both confirmed by
screenshot on the club detail.

### Notes for the next ticket

- The rail truncated "Health infor…" at 14rem. Quest labels wrap now instead —
  a rail is the one place a Quest's name is written, so it is the one place it
  must never be cut.
- Offer's Accept/Decline moved into the bar as a consequence of the third column
  dying, with the reassurance line above them. The rest of ticket 02 — hero down
  to a band, "What happens when you accept" into the celebration, Decline down to
  a link, the copy rewrite — is untouched and still ticket 02's.
- Review's summary still lists per-step time and required/optional. That is
  ticket 05's checkbox, deliberately left alone.
- The summary now reads back in flow order (Health before Housing). Grouping it
  by *Phase* is still ticket 05.

### Handoff

Committed on `main`. `/code-review` was **not** run on this ticket — stopped
deliberately, not skipped by accident. Anyone picking 02–07 up should treat this
shell as unreviewed code.

Status set to `done`. Note that the previous round left all eight of its tickets
on `ready-for-human` after shipping, so there was no closed state to copy;
`docs/agents/triage-labels.md` is referenced by `issue-tracker.md` but does not
exist in the repo. `done` is the label used here.

