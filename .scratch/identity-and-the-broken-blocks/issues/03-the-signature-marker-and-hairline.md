# 03 — The signature: a marker with three states, and one hairline

Status: done

**What to build:** A student meets Audentra's identity once on every screen, in
the two places where it is a signature rather than decoration: the numbered
marker on a Section header, and one gradient hairline across the top of the
screen's work sheet. Everywhere else the colour keeps meaning what it means —
flat violet is "you are here", mint is "done".

The identity complaint stated as a number: the brand gradient has three usages in
the whole app today, none of them a Section header. The palette was never lost —
`violet-500` is the site's `--au-purple`, `azure-500` its `--au-blue`,
`mint-500` its `--au-teal`, and the display face is Satoshi in both. What was
lost is every place the identity was expressed.

The marker has two fills today — grey and mint — which makes "not started" and
"being filled in right now" the same grey. Three:

| State | Fill |
|---|---|
| Untouched | `bg-ink-200 text-ink-600` |
| In progress | the brand gradient, white numeral |
| Done | `bg-mint-500`, white check |

"In progress" is **the first incomplete Section on the screen**, decided by the
sheet rather than by the Section. A Section cannot know it is first, and asking
focus would make the marker a cursor rather than a state — so the sheet walks its
children and hands the answer down. This is the rail's own grammar, grey / brand
/ mint, repeated one level in.

**Blocked by:** 01 — the same two components' prop surface, and the hairline
lands on a sheet that has just stopped being able to stretch.

**Referências:**
- [Remote — "01. Government ID / 02. Selfie"](https://mobbin.com/flows/24d47336-90f8-4027-9299-13ad2311ddac) — a numbered, brand-coloured eyebrow inside dense content. Brand colour carrying a number, not a status.
- [Twenty](https://mobbin.com/screens/f0170497-9df6-4b27-9bdc-ab606ee77530) — the section header as a tonal bar in a record page, which is the band the marker sits in.
- [Deputy](https://mobbin.com/screens/58047c57-4992-4c27-9974-43c522a5aa42) — per-step marks that turn into a coloured check when the step is finished, with the current one held apart. The three-state grammar, one level up.
- [Later](https://mobbin.com/screens/d9985ab0-703c-437f-9b57-3cee60d686c4) — the current step is a filled mark and the rest are outlined: "in progress" expressed as a fill rather than as a second hue.
- **Rejected:** [Gamma's per-card accent colour](https://mobbin.com/screens/f5e53155-dcfc-4985-bdad-fe723e6f1bff) — brand colour as a per-card theme setting. No strong precedent was found for a brand hairline used as a signature; the argument for "once per screen" is the one that has to carry it.

- [ ] The Section marker has three states: untouched grey, in-progress gradient with a white numeral, done mint with a white check
- [ ] "In progress" is the first incomplete Section on the screen, decided by the sheet and handed down; no route computes it
- [ ] A 2px gradient hairline sits at the top of the screen's work sheet, passed by the route that owns the work and by nothing else
- [ ] The guide never carries the hairline, and no screen carries two
- [ ] The hairline costs no height the sheet's own border was not already spending
- [ ] No eyebrow above the `h1` — the Phase is already named in the rail and in the title
- [ ] No gradient on the action pill, on a field, or on a chip
- [ ] The layout ruler asserts the gradient appears only on the Section marker, the sheet hairline and the rail's group marker, and at most once per route for the hairline
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Comments

**Shipped.** The Section marker has three states; "in progress" is the first
incomplete Section on the screen, decided by `Sections` walking its children and
published through `SheetProgress` context. No route computes it, and the ruler
asserts no route can. Focus was the other candidate and was rejected in the code
comment: a marker that followed the caret is a cursor, and it would go blank the
moment the student clicked away to read something.

The hairline is drawn over the sheet's own top border inside the existing
`overflow-hidden`, so it costs **zero height** — a signed sheet and an unsigned
one put their first Section header on the same pixel.

**Where the delivery differs from the ticket.** The ticket says "one hairline
per screen"; **Housing and Campus life have none**. They are `catalogue`
archetypes: the collection is the screen and sits on the Ground, so there is no
work sheet, and signing the Shortlist Well instead would be exactly the
stripe-on-a-component this ticket exists to prevent. The identity on those two
screens is carried by the rail. Recorded in ADR 0012 as a decision rather than
left as a gap.

The ruler's rule is therefore "at most one per screen" rather than "exactly
one", expressed as: a route may carry no more `signature` props than it renders
`StepShell`s. Deposit is three screens in one file and carries two.

The gradient is confined to four files, each with its reason written beside it
in the test: the surfaces module (marker and hairline), the rail (group marker),
Enrolled (the student card, an object handed over outside the Step shell), and
the style guide (the swatch that documents the rule).
