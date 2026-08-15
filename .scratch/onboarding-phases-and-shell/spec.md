Status: in-progress — 01–04 done, 05–07 open

# Onboarding: Phases, shell, and the parts the last round missed

## Problem Statement

The 2026-08-14 round treated the review call as a list of bugs and fixed the ones
that fit inside a single file each. Three requests did not fit and were left out
entirely, and one was executed in a way that made the product worse:

- **Housing** was to look like Booking — photo carousel, room and bathroom
  detail, Off campus removed. `housing.tsx` was never touched.
- **Your offer** was to be fixed, without scrolling. It is still a hero plus
  three stacked sections.
- **Mobile first** was asked for explicitly, for everything student-facing. The
  app only truly exists above 1280px: a 19rem rail and a three-column grid.
- **Density and "the shell of a real system"** — the complaint underneath all the
  others. The shared chrome got a padding pass and nothing structural.
- **Gamification** shipped as a grey `+50` beside a completed rail item: a
  receipt for someone who already finished, adding weight to the one component
  that was already too heavy.

Behind all five: no Mobbin research was done in that round at all
(`docs/design-research.md` is untouched since 2026-08-10), so every decision was
made from memory instead of from evidence.

## Solution

Reorganise the flow around three **Phases** and a **Closing** (ADR-0001), rebuild
the shared chrome as a real application shell, give **Points** a named
destination (ADR-0002), and deliver the two screens the last round skipped.
Mobile-first throughout: mobile and desktop are two layouts of the same content,
not one shrinking into the other.

The spine becomes:

| Phase | Quests |
|---|---|
| **Deciding** | Your offer |
| **About you** | Identity & contact · Health information |
| **Your life on campus** | Housing · Campus life |
| _Closing_ | Review & sign · Deposit |

## Implementation Decisions

**Shell.** Recessed ground with white panels (Deel), compact ~14rem rail showing
the three Phases with the active one expanded to its Quests, a fixed action bar
at the foot in both layouts, and one **Balance** at the top of the rail. On
mobile: segmented three-part progress bar at the top, action bar pinned to the
bottom, no third column anywhere.

**Rail granularity.** Time estimate and required/optional sit on the **Phase**.
Individual Quests carry an "optional" label only — "I can skip this" is the one
thing worth knowing per line; a time figure at three levels is noise.

**Gamification.** Quests in the rail, Points animating from the moment they are
earned into the single Balance, denominated in bookstore credit. No standing
price list beside unfinished items.

**Offer.** Accept and Decline move into the fixed bar, with the reassurance line
above them (Upwork). Decline is a link, not a matched secondary button, and takes
one click — no two-step confirmation. Hero shrinks to a ~96px band. "What happens
when you accept" moves into the full-screen celebration, where the student has
actually asked the question.

**Housing.** Eight Residences, ranked **Shortlist** of three (ADR-0003), filter
pills, inline carousel on the card, all published facts except cost, discreet
off-campus exit.

**Copy.** Sweep limited to what these decisions renamed or invented — not a full
`copy-inventory.md` pass.

**Modals.** Club detail becomes a bottom sheet on mobile and a dialog on desktop.
The celebration stays a full dialog in both: it is the one moment that should own
the screen.

## Found on the second pass through the transcript

Re-auditing the call line by line against the code turned up two things the last
round got wrong rather than merely skipped, and both are in tickets now:

- **Family access has three of the four fields Laura listed.** "O que vai ter
  acesso" was never built, and the screen's own lead promises it. → ticket 07.
- **The celebration says "Entirely optional."** That is precisely the register
  the client rejected — "não apenas se você quiser" — in the one moment of the
  flow he wanted to feel like going public with a relationship. → ticket 06.

And four requests that were in the call but in nobody's ticket:

- **"Eu não quero também empilhar."** A constraint on *how* the Offer gets
  shorter — smaller cards, not a taller column. → ticket 02.
- **"Tem explicação em cada um deles — será que é necessário isso mesmo?"** The
  per-field helper text is itself part of the bulk she was complaining about.
  → tickets 01 and 02.
- **Housing availability comes from a university API**, mocked this round. The
  fixture has to be API-shaped. → ticket 04.
- **The club detail sheet on mobile**, decided in the design session and owned by
  no ticket until now. → ticket 01, as a shared responsive overlay.

One more input we have never used: asked what the portals should feel like, the
client's own benchmark was **Salesforce** — a real system, not a set of screens.
That is the same complaint as "não tem casca de sistema", from his mouth, and it
belongs in the shell work as a reference point.

## Order of delivery

Shell → Offer → Gamification → Housing → Closing → Copy, with **07 (Family
access) riding alongside the Closing** — it is small, and it is a promise
currently broken on screen. Cuts come from the bottom. Housing is the most likely
casualty and the least code-bound: eight Residences is ~24 curated Unsplash
images, which is clock work.

## Out of Scope

- The staff portal.
- Real housing or points data — fixtures stay fixtures, shaped so real values
  drop in without a shape change.
- Rewriting copy the session's decisions did not touch.
- Edward, the assistant, and the student portal proper. Both were discussed on
  the same call but belong to the portal effort, not to onboarding.

## Further Notes

The client asked for the time estimate and optional/required labels **on Review &
sign specifically** ("ele pediu só aqui"). We are putting them in the rail
instead, which shows them for the whole flow rather than only at the end. This is
more than was asked for, not less — but it is a visible deviation and should be
named out loud on the next call rather than discovered.

## Progress

| Ticket | Status |
|---|---|
| 01 — The shell: Phases, recessed ground, fixed action bar, mobile-first | **done** |
| 02 — Your offer in one viewport | **done** |
| 03 — Points with a destination | **done** |
| 04 — Housing: eight Residences, a Shortlist of three | **done** |
| 05 — The Closing: Review & sign, and Deposit | ready-for-human |
| 06 — Copy sweep | ready-for-human |
| 07 — Family access: what they can actually see | ready-for-human |

04–07 are all unblocked: 01 was the only thing any of them were waiting on, and
05's second dependency (how a completed flow reports its Points) is now answered
by `points.ts` and the Balance.

### What 01 changed that the rest depend on

- **`steps.ts` is the spine.** Three `Phase`s plus a `closing` group; the flat
  `steps` array is derived from them. Never add a step by editing `steps` — it is
  `groups.flatMap(...)`. `pnpm test` guards this (19 assertions, the only tests
  in the repo).
- **`useStepNav(current)`** in `step-shell.tsx` derives Back/Continue from the
  spine. Do not write `navigate({ to: "/onboarding/..." })` in a route again —
  the Phase reordering silently broke every one of those, and nothing failed to
  build.
- **`StepShell` takes `actions`**, not `<StepActions>` children. `ContextPanel`
  is gone; `Panel` (optionally `aside`) is the unit. There is no third column.
- **`Overlay`** (`ui/overlay.tsx`) is bottom sheet below `md`, dialog above. Use
  it for anything the student opens, reads and dismisses. The celebration stays
  a plain `Dialog` on purpose.
- **`Balance`** (`components/balance.tsx`) exists and is placed — one in the rail,
  one chip in the mobile header. Ticket 03 owns what it *says*: the
  bookstore-credit conversion, the threshold, the award animation. It currently
  shows a bare total, which is exactly what 03 exists to fix.
- **Storage is `v3`.** Bump it again if a slice is renamed or a stored value
  changes meaning.

### What 02 changed that the rest can use

- **`StepShell` takes `actionBarHeight` and `centered`.** A step whose bar needs
  more than one row sets the height there, not in two places; `centered` centres
  a deliberately short column (`justify-center-safe`). 05 is the likely next
  user of both.
- **The celebration now carries "What happens now"** as well as the share
  prompt, and scrolls inside itself (`max-h-[calc(100dvh-2rem)]`). Anything else
  moved into that dialog has to keep the continue button reachable on a phone.
- **The decline dialog and its state are gone** — `declineReasons`,
  `declineReason`, `declineNote`. Declining is one click and records only the
  answer and the timestamp.

### What 03 changed that the rest can use

- **`points.ts` is the only place a Point converts.** `CREDIT_PER_POINT_USD` and
  `CREDIT_BLOCK_USD` are the two fixtures; `POINTS_PER_BLOCK` is derived and
  `points.test.ts` fails if they ever disagree. Any screen printing a Points
  figure calls `creditReleased` / `pointsToNextRelease` — never a bare number
  (ADR-0002).
- **`PointsAwardProvider` wraps `/onboarding` and animates by itself.** It
  watches `totalPoints` and flies a `+N` from the last `pointerdown` to the
  Balance. **A new point-earning action needs no award code** — write the
  `patch` and the animation follows. Adding a Quest to `steps.ts` is enough.
- **`Balance` renders `award.shownPoints`, not the live total**, so the number
  changes as the token lands. Outside the provider (the style guide) it falls
  back to the live total.
- **05 inherits a cleaner Review header**: the per-group `pts` chip is gone and
  the total now names its destination. The per-step time and required/optional
  labels beside it are still 05's to remove.

### Known gaps, deliberate

- **No `/code-review` on any ticket in this effort, by choice.** This is a
  prototype whose correctness is judged on screen, not in the diff. Verification
  is typecheck, tests, biome, and looking at it at both sizes.
- **Review & sign barely moved on density** (−1%). Its height is the agreement
  itself, which is deliberately full-length so the page is the only scroll
  container — the read-to-the-end gate depends on it. Ticket 05 should decide
  whether that is still the right trade.
- Review's summary still prints per-step time and required/optional, which
  ticket 05 removes.

