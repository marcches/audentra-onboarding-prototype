# 01 — The token layer, expanded

**What to build:** The whole visual system exists and can be looked at, without a
single existing screen changing. The style guide shows the new type scale, the
new spacing rhythm, the new radii, the two elevation roles, the tinted ground and
its texture, and both type faces — all declared beside the old values so nothing
in the product breaks.

This is the **expand** half of an expand–contract. Roughly 235 call sites across
~35 files still read the old tokens and must keep working: 124 half-step spacing
utilities, 64 uses of the deleted small type step, 24 uppercase labels and 23
duotone icons. None of them is touched here. They are deleted in ticket 10, once
nothing reads them.

The type scale is seven steps at 11 / 13 / 15 / 18 / 24 / 32 / 44, body at 15.
Spacing is five steps at 4 / 8 / 16 / 24 / 40 with no half-steps. Radius rises on
containers and freezes on controls: card 20, slab 28, field stays 10. Elevation
gets two roles and two only — *contains* for the band and the lead card, and what
genuinely floats.

**The display face is a swappable token.** It needs the designer's sign-off, and
until it lands the token points at the interface face. Nothing downstream in this
cycle waits on that decision.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

**Referências:**
- [Preply](https://mobbin.com/screens/c6860362-5042-4aa5-9f18-77b731447f73) — the shape and weight of the second voice: a display grotesk with rounded terminals set heavy over flat colour. The rounded terminal is where "more round" lands in the letterform.
- [Midday](https://mobbin.com/screens/72304bea-11b7-48f7-a870-a2263f475090) — very few spacing values set far apart, which is where the 4/8/16/24/40 rhythm comes from and why the half-steps go.
- [mymind](https://mobbin.com/screens/4ec3c082-db2b-409e-bc16-4457a53715f9) — how little border a calm screen actually needs once tint and space are doing the grouping.

- [ ] The seven type steps are declared, with real distance between each
- [ ] The five spacing steps are declared, with no half-step available
- [ ] Container radii rise and control radius is unchanged
- [ ] Elevation has exactly two roles declared: contains, and floats
- [ ] The ground carries its tint and one quiet texture
- [ ] Both faces are declared, and the display face is a token that can point at the interface face without any other change
- [ ] The interface face's full weight range is available, not the single strong weight
- [ ] Every old token still resolves; no existing screen changes appearance
- [ ] The style guide renders the complete new system on one screen
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
