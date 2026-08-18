# 05 — The rest of the portal onto the system

**What to build:** Every remaining portal screen reads as the same product as the
Dashboard. A student moving from the Dashboard into My Enrollment, into
Appointments, or into any of the seven areas that are not built yet, stays in the
same room — same ground, same rhythm, same type, same one-job-per-material rule.

This is a **migrate batch** of the expand–contract: the portal's call sites move
off the old type and spacing tokens and onto the new ones. The old tokens still
exist, so the batch lands green on its own without waiting for the gate.

The seven unbuilt areas keep saying honestly that they are unbuilt. What changes
is that an unbuilt area now looks finished-and-empty rather than broken.

**Blocked by:** 02 — The room and the band, on the Dashboard.

**Status:** ready-for-agent

**Referências:**
- [Apollo](https://mobbin.com/screens/09da790a-fc80-4bd0-b0cf-0bc5fcedc394) — dense flat rows carrying a single high-chroma accent on the one next action, which is how a long list stays calm without going grey.
- [HoneyBook](https://mobbin.com/screens/7c915d6b-2a99-4eb0-956d-e7a3a97bb265) — the checklist anatomy where finished work collapses to a line and the live item keeps its detail, so the full twelve fit without deleting anything.
- [Uxcel](https://mobbin.com/screens/e364eaf2-50f2-4c3f-8a48-a83d31d0ab34) — the progress ring carried on the collection's own card rather than on a separate header block.

- [ ] Every portal screen sits in the tinted room
- [ ] No portal screen reads an old type or spacing token
- [ ] The seven unbuilt areas read as finished-and-empty, not broken
- [ ] Each unbuilt area still says plainly what will live there
- [ ] One material per job holds on every screen, not just the Dashboard
- [ ] Nothing lifts or grows on hover or selection anywhere in the portal
- [ ] The portal's Presence table still holds
- [ ] The old tokens are untouched and still resolve
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
