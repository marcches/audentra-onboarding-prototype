# 02 — The room and the band, on the Dashboard

**What to build:** The screen the designer complained about, rebuilt on the new
system end to end. A student opening the portal lands in a violet-tinted room
carrying one quiet texture, and the screen opens with a gradient band that
**contains** the lead Quest card rather than sitting above it.

The containment is the whole point and the acceptance criterion that matters: a
band stacked before the first card spends 140–180px of the ~640px available at
1366×768, and the first card must still end above the fold. Colour that costs
height is colour this product cannot afford.

Depth returns here as **containment and never as reaction**. The band and the
lead card are raised and static. Nothing rises on hover, nothing rises on
selection — selection stays fill and a check, emphasis stays a ring glow.

Each material does one job on this screen and can be checked for it: tint groups,
shadow contains, border appears only on controls, texture appears once and only
on the ground.

**Blocked by:** 01 — The token layer, expanded.

**Status:** resolved

**Referências:**
- [Mercor](https://mobbin.com/screens/6ab63817-8b06-46a6-8fba-be87f0e05a6d) — the load-bearing composition: the gradient band holds the white cards inside its lower edge instead of preceding them, which is what makes the colour cost no vertical budget.
- [Asana](https://mobbin.com/screens/5bef03d3-11e0-4925-bae1-52529effba86) — the room: an entire page ground tinted and lightly patterned, with every card flat and white on top of it. Proof that purple and restraint about elevation coexist.
- [Fireflies](https://mobbin.com/screens/b18c746c-1c82-41ed-af38-1340addd869a) — the dosage: one band per screen, behind the greeting only, with the content below left plain.

- [ ] The application ground is tinted and carries one texture, and the texture appears nowhere else
- [ ] The band contains the lead Quest card rather than preceding it
- [ ] The first Quest card still ends above the fold at 1366×768
- [ ] The band carries the display face at the display step
- [ ] The lead card and the band are the only raised things on the screen
- [ ] Nothing lifts, grows or thickens on hover or on selection
- [ ] Every Quest card below the lead one is flat on its Well
- [ ] Border appears only on controls
- [ ] The four drift invariants still hold
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Answer

The Dashboard opens with a band containing the lead Quest card. Measured at 1366x768: band bottom y=292, lead card bottom y=276, against the ~640px usable. The band and the lead card are the only raised things; every card under them is flat on its Well. Border is left to controls in the shared surfaces, so the rule holds everywhere at once.
