# 17 — Contract: delete what nothing calls any more

**Status:** ready-for-agent

**Blocked by:** 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16

**What to build:** Nothing. This ticket only removes, and it exists because
tickets 01 and 02 deliberately built the new system **beside** the old one so
every ticket in between could land with the build green. That is the expand half
of an expand–contract; this is the contract.

It is last on purpose and it is not optional. A codebase carrying both systems is
worse than either, and the specific failure mode here is well-attested in this
repo: a future round reads a dead component or a stale comment, believes it, and
rebuilds against it. That is how "About you is already clustered correctly" got
written into a spec.

## What comes out

**Routes and components with no callers.** `identity-contact.tsx` and everything
that existed only to serve it. The old completion and deposit screens. Any
surface or layout helper superseded by the four levels from ticket 01. Verify by
absence of callers, not by memory.

**The revoked ruler lines.** Confirm they are gone from `docs/design-research.md`
and that `layout-rules.test.ts` asserts exactly the four drift invariants and
nothing else. Ticket 01 does this; this ticket checks it survived twelve tickets
of pressure.

**The phantom ADR citations.** Six comments cite `ADR-0005`, `ADR-0006` and
`ADR-0007`. Only 0001 to 0003 exist. Each citation is repointed at what does
exist, or the claim is restated in the comment on its own authority. The missing
ADRs are **not** written retroactively — inventing the reasoning behind a
decision nobody recorded is worse than admitting it was never recorded, and this
delivery already has one instance of a confident reference to a document that
does not exist.

**Stale doc claims.** `docs/review-script.md` is consolidated to the current
flow: sections for screens that no longer exist come out, and the per-screen
checklists added by tickets 05 through 16 are ordered to match the spine. Any
statement in the repo that this project has no automated test suite is corrected
— it has one, and the previous spec was wrong about that.

**Dependencies with no importers.** If `ogl`, `canvas-confetti` or `gsap` ends
this delivery with no caller, it leaves `package.json`. If it has one, it stays
and this ticket records where.

## New ADRs

Four decisions from the grilling session earn one, numbered from **0004**:

1. Campus life is discovery, not selection — a future reader will see a screen
   that produces no commitment and assume it is unfinished.
2. Aster is ~7,000 undergraduates — every catalogue size and price derives from
   it, and changing it later invalidates all of them.
3. Which lines of the stillness ruler were revoked, and why — otherwise someone
   reinstates them in two rounds.
4. Points are a price and a receipt in one object — this reverses an earlier
   recorded decision, and the reason is mechanical rather than aesthetic.

- [ ] No route or component in `src/` is unreachable from the router or from
      another live module.
- [ ] `layout-rules.test.ts` asserts the four drift invariants and nothing else.
- [ ] The revoked ruler lines appear nowhere in `docs/`.
- [ ] No comment in `src/` cites an ADR that does not exist.
- [ ] ADRs 0004 to 0007 written for the four decisions above.
- [ ] `docs/review-script.md` matches the ten-Step spine, in order.
- [ ] No claim anywhere that this repo lacks a test suite.
- [ ] Every dependency in `package.json` has at least one importer.
- [ ] Typecheck, `pnpm test`, biome and `pnpm build` all clean.
- [ ] `source-requests.md` walked end to end, every row either delivered or
      explicitly recorded as not delivered with a reason.
