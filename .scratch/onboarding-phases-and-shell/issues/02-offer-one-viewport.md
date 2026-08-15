# 02 — Your offer in one viewport

**What to build:** The offer fits without scrolling. Accept and Decline leave the
side panel and live in the fixed action bar with a reassurance line above them.
The hero shrinks to a band. "What happens when you accept" moves out of this
screen and into the celebration. Decline becomes a link — visible, one click, no
two-step confirmation.

**Blocked by:** 01 — the fixed bar and the death of the third column are what make
this fit.

**Status:** ready-for-human

**Referências:**
- [Deel — offer](https://mobbin.com/screens/66328d19-07aa-4a67-bacd-4cfea6e32885) — Reject/Accept in the fixed footer, contract facts as a compact label→value panel.
- [Upwork](https://mobbin.com/screens/826b635b-4b9e-40e6-895d-7f674d820901) — the reassurance line above the actions and the expiry below; Decline demoted to a link beside a solid Accept. This is the UX-writing model the client asked for.
- [Cake Equity](https://mobbin.com/screens/ae323a7e-5e19-43ac-85b7-7285ad8b2503) — offer summary as a dense fact grid with one coloured tile for the number that matters.

- [ ] Offer fits one viewport at 1440px and needs at most one short scroll at 390px.
- [ ] **The cards get smaller, they do not get stacked.** Laura's exact constraint on this screen: "esses cards estão muito grandes… eu não quero também empilhar." Solving the height by turning a grid into a column fails this ticket.
- [ ] Every explanatory line under a fact earns its place or goes — same audit as ticket 01, applied hardest here, since this is the screen where she raised it.
- [ ] Accept and Decline render in the fixed action bar; the `ContextPanel` on this step is gone.
- [ ] A reassurance line sits above the actions; the response deadline sits below.
- [ ] Decline is a link, one click, and does not open a confirmation step.
- [ ] Hero is a band of roughly 96px carrying the programme name — the campus image survives, the 200px of it does not.
- [ ] "What happens when you accept" no longer appears on this screen and appears in the celebration instead.
- [ ] Accept/Decline copy rewritten — the client called this out by name.

## Comments
