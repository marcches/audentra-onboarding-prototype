# 02 — Your offer in one viewport

**What to build:** The offer fits without scrolling. Accept and Decline leave the
side panel and live in the fixed action bar with a reassurance line above them.
The hero shrinks to a band. "What happens when you accept" moves out of this
screen and into the celebration. Decline becomes a link — visible, one click, no
two-step confirmation.

**Blocked by:** 01 — the fixed bar and the death of the third column are what make
this fit.

**Status:** done

**Referências:**
- [Deel — offer](https://mobbin.com/screens/66328d19-07aa-4a67-bacd-4cfea6e32885) — Reject/Accept in the fixed footer, contract facts as a compact label→value panel.
- [Upwork](https://mobbin.com/screens/826b635b-4b9e-40e6-895d-7f674d820901) — the reassurance line above the actions and the expiry below; Decline demoted to a link beside a solid Accept. This is the UX-writing model the client asked for.
- [Cake Equity](https://mobbin.com/screens/ae323a7e-5e19-43ac-85b7-7285ad8b2503) — offer summary as a dense fact grid with one coloured tile for the number that matters.

- [x] Offer fits one viewport at 1440px and needs at most one short scroll at 390px. Measured: no scroll at all at either size (1440×900 `scrollHeight === innerHeight`; 390×844 fits).
- [x] **The cards get smaller, they do not get stacked.** Four slabs became one panel: a hairline grid of four small cells, 4-up on desktop and 2-up on the phone.
- [x] Every explanatory line under a fact earns its place or goes — all four per-fact notes deleted; the deposit keeps one line, because "am I paying today" is not something the number answers by itself.
- [x] Accept and Decline render in the fixed action bar.
- [x] A reassurance line sits above the actions; the response deadline sits below.
- [x] Decline is a link, one click, and does not open a confirmation step.
- [x] Hero is a band of roughly 96px carrying the programme name.
- [x] "What happens when you accept" no longer appears on this screen and appears in the celebration instead.
- [x] Accept/Decline copy rewritten — "Accept my place" / "Decline this offer".

## Comments

**Done.** Two things worth carrying forward:

- **`StepShell` gained two props.** `actionBarHeight` overrides `--action-bar-height`
  for a step whose bar is taller than one row of buttons (this one: reassurance,
  buttons, deadline) — the bar and the column's bottom padding read the same
  variable, so it stays one number. `centered` centres the column in the space it
  has, `justify-center-safe` so a small viewport overflows downward rather than
  centring the top off-screen. Offer needed it: once it fit a viewport it also
  stopped filling one, and the card sat on top of ~500px of empty canvas.
- **The decline dialog is gone, and so is its state.** `declineReasons` in
  `fixtures.ts` and `declineReason`/`declineNote` in `OfferState` were only ever
  read by that dialog. No storage bump — a v3 blob carrying the two dead keys
  merges harmlessly, since nothing changed meaning.

Verified by typecheck, the 19 tests, biome, and measurement in the browser at
1440×900 and 390×844.

Not done here, and not this ticket's: the celebration still says "Entirely
optional" (ticket 06 owns that line by name), and its X share button renders the
logo beside the letter "X", which reads as a duplicate.
