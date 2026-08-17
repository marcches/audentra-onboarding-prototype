# 04 — The whole map, navigable

Status: done

**What to build:** A student can reach every Area the portal has from the
sidebar, and the seven that are not built yet say so honestly instead of looking
broken. The client can walk the entire map in front of the person this is
presented to without hitting a dead item.

**The defect this closes, in the client's words:** *"Cadê a pointment na side
bar? Então quer dizer que eu não posso simplesmente marcar um suporte em algum
dia específico. Eu tenho que entrar em financials para falar aqui, entendeu?"*
The page exists in the production portal and has no nav entry. A sidebar that
does not contain everything the portal can do teaches the student that not
finding something means it does not exist.

**Nine Areas, three groups.** `Dashboard` and `My Enrollment` unlabelled at the
top; `ACADEMICS` — My Classrooms, My Campus Life; `ADMIN` — My Financials, My
Documents, Appointments; `Messages` and `Profile` at the foot. Nine flat rows is
the point at which a list stops being scannable, and the grouping is what buys
the rows their reduced height: the headings do the work the vertical space was
doing.

**`Edward AI` leaves the sidebar and nothing replaces it.** Its FAB is cycle
two's. A floating control that does nothing is worse than no floating control,
and a gap where the row was is honest.

**The seven unbuilt Areas share one placeholder.** A centred card: the Area's
name, one sentence that is **true** about what will live there, and at most two
actions. "Your bill, payment plans and financial aid will live here" is true;
"coming soon" is filler. No invented illustration, no fake counts, no progress
bar. One component rather than seven bespoke screens — seven shallow screens cost
days, answer no design question, and are the *"entregando pouco"* the client and
the designer named on the call.

**Compact.** The Areas are reachable from a bottom navigation, same DOM, per ADR
0008. Drawn and correct, not polished.

**The portal's Presence table** is created here with the rows this cycle actually
needs and a closed count (ADR 0014). The three width classes, the design viewport
and the container-query authority rule are inherited from ADR 0008 and are **not**
redeclared.

**Blocked by:** 02 (the portal route and shell these hang off).

**Referências:**
- [Render](https://mobbin.com/screens/f4e5d3b4-195a-438d-aa0e-a422c91bc5fc) — two things at once: `INTEGRATIONS` / `NETWORKING` / `WORKSPACE` in small caps over an unlabelled top cluster, and the empty-state template — a centred card, what the thing is for, exactly two actions, no illustration and no apology.
- [Remote](https://mobbin.com/screens/58e6b83b-831e-41ff-9422-a33c928b8b60) — `FAVORITES` / `RECRUITING` / `TEAM MANAGEMENT` over roughly a dozen items at a row height well below this repo's current one. Evidence that grouping buys density rather than costing it.
- [Dovetail](https://mobbin.com/screens/661fe01b-36a7-4e61-8229-68b09cce1dae) — an unlabelled cluster of primary destinations sitting above the labelled groups. Where `Dashboard` and `My Enrollment` go.
- [Salesforce](https://mobbin.com/screens/d984cf82-47ad-415e-a48f-f098d2bd6210) — named by the client twice and already the basis of ADR 0010. Referenced as the density ceiling not to exceed, and for `Nothing to see here` as proof that an honest empty state need not be small to avoid reading as a defect.

- [x] Nine Areas in the three groups named above, every one clickable
- [x] `Appointments` is in the sidebar and reachable without passing through Financials
- [x] `Edward AI` is not a row, and no FAB or placeholder button stands in for it
- [x] The current Area is unambiguous without hunting for it
- [x] Sidebar row height is lower and width narrower than the production portal's
- [x] Group labels use the metadata type step, declared once in the theme
- [x] One placeholder component serves all seven unbuilt Areas
- [x] Each placeholder sentence is true about what will live there — no "coming soon"
- [x] No placeholder invents an illustration, a count or a progress bar
- [x] No placeholder reads as an error or a broken page
- [x] On compact the Areas are reachable from a bottom navigation, same DOM
- [x] The portal's Presence table exists with a closed count, asserted by the ruler
- [x] The three width classes are inherited from ADR 0008, not redeclared
- [x] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** Nine Areas in `src/lib/areas.ts`, in the three groups the spec
names, every one clickable. Measured: nine links in the sidebar, `Appointments`
among them, `Edward` nowhere in the DOM, sidebar 224px wide with 29px rows.

The seven unbuilt Areas — plus My Enrollment, whose full list is cycle two's —
share one placeholder built from `Sections`/`Section`, each printing the true
sentence its Area declares. The same component serves a Requirement's own screen
at `/portal/enrollment/$requirement`, so no Quest card's primary action leads
nowhere.

Compact: the same Areas on a bottom navigation, both halves always in the DOM
and swapped by the width classes. 44px tap targets, no horizontal overflow.

The portal's Presence table is `src/lib/portal-layout.ts`, closed at four rows,
counted by `layout-rules.test.ts` — which also now asserts the gate's is still
eight, that the portal does not redeclare the width classes, that the metadata
step is declared once, and that no Quest card carries elevation.
