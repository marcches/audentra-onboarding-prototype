# 01 — One product, not two

Status: ready-for-agent

**What to build:** The portal stops looking like a different team's work, and it
opens with the gate behind it.

Six small things, all measured on the shipped screens:

- **The title is `--text-h1`**, 28px, as every screen in the gate is. Twenty was
  typed, not decided.
- **The work sheet is signed.** The gradient hairline ADR 0012 admits lands once
  per portal screen — the same rule the gate follows, not a second one.
- **The compact Balance sits against the last Area**, not 334px below it. The
  sidebar's foot is a block, not an orphaned chip at the bottom of a column of
  air.
- **One primary action per screen.** Only the lead Quest card keeps the violet
  button; the other two are secondary. Three primaries stacked is three
  invitations arguing with each other.
- **The greeting line gains a thin progress bar**, on the line it already has.
  What the last cycle cut was the ring above the work, not the instrument.
- **The gate hands over**: one link from the arrival screen to the portal. The
  single deliberate exception to "the gate does not move", and it is one line.

**The demo seed.** A student arriving at `/portal` with a *pristine* gate store —
no offer response at all — gets a finished gate: offer accepted and shared, `Who
you are`, `Who we call`, `Housing` and `Review & sign` submitted, and `Health
information`, `Campus life` and the `Deposit` genuinely skipped. That is 180 of
215 Points and exactly three carried-over Requirements, which is the state every
screen in this portal was designed against.

It lives in `src/lib/demo.ts` and nowhere else, so that grepping finds all of it.
It is **not** the portal writing the gate: it runs once, on a store nobody has
touched, and `CONTEXT-MAP.md` records the exception beside the rule it excepts.

**Referências:**
- [Google Workspace](https://mobbin.com/screens/05a829a2-525b-4a6e-911a-f4d5e2e5b9ce) — `You're on your way, Alex` with a thin bar on the same line, and the work immediately under it. The progress bar this ticket adds, at the size that does not cost a row.
- [Square](https://mobbin.com/screens/b58d212c-eaba-4487-a2b3-2aa6f4ed7cbf) — `Let's keep going · 5 of 7 completed` with one open item carrying the only filled button on the screen; every other row's action is quiet. The one-primary rule, drawn.

- [ ] The portal's `h1` reads `--text-h1`, and no component sets its own title size
- [ ] Each portal screen carries the signature hairline exactly once
- [ ] The compact Balance sits against the last Area in the sidebar
- [ ] Only the lead Quest card carries a primary action
- [ ] The progress bar is on the greeting's line and adds no height
- [ ] The arrival screen links to the portal
- [ ] A pristine gate store seeds the finished-gate demo; a touched one is left alone
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
