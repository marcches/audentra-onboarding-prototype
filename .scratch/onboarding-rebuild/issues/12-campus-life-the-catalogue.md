# 12 — Campus life: the catalogue, and interest that is not enrolment

**Status:** ready-for-agent

**Blocked by:** 02, 03

**What to build:** The Step whose premise was wrong. **No U.S. university has
students join organizations during enrolment** — they join in person at the
Involvement Fair after classes begin. Ohio State runs it on the Oval in late
August; Penn State runs two days on the HUB lawn with ~40,000 students
circulating; Syracuse runs three days segmented by category. What exists during
onboarding is an interest survey.

So the verb changes: the student declares interest, and nothing on this screen is
a commitment. That is also why the current modal is useless — it was built to
confirm a choice that does not happen here.

Scale changes too. Nine invented clubs is off by an order of magnitude. Aster is
fixed at ~7,000 undergraduates, which puts it at **~420 organizations** by the
real ratio of one per 15–25 undergraduates; ~60 ship in the fixture, adapted from
verified directories at Michigan, Cornell, Iowa, Kenyon and Wittenberg.

**Referências:**
- [Care.com — fila de pílulas por eixo](https://mobbin.com/screens/7851345f-8c0c-4b72-91f5-74528639148d) — cada eixo é uma pílula com chevron abrindo um popover ancorado, com Clear próprio. É a forma exata dos quatro eixos.
- [Juicebox — contagem no rótulo da pílula](https://mobbin.com/screens/62dbcaad-fa05-48eb-aacd-d9ff8d917ce7) — a pílula ativa carrega quantos valores estão escolhidos, então o estado do filtro se lê sem abrir nada.
- [Tripadvisor — pílulas com overflow horizontal](https://mobbin.com/screens/c46b676e-057c-400a-a50a-7de7be7d3b2e) — seta de overflow em vez de quebra de linha; a barra nunca cresce duas alturas.
- [Klook — contagem antes de aplicar](https://mobbin.com/screens/a3454f15-f734-46e4-87a7-71eb8e96695f) — o número de resultados aparece antes do filtro ser confirmado.
- [Locals — "What are you into?"](https://mobbin.com/screens/97354356-6811-4be8-8061-37e4b0ea2861) — chips agrupados sob cabeçalhos de categoria tornam ~40 itens navegáveis.
- [Etsy — pílula "Favorited"](https://mobbin.com/screens/b53410bc-c9a5-4706-9c26-5b41e600a2f2) — depois de salvo, o botão vira pílula fantasma cinza com rótulo no passado, **sem cor de marca**.
- [Beli — bookmark separado do "+"](https://mobbin.com/screens/2fad692a-1d5a-464b-9f77-f2c6b96ae71a) — a separação visual entre "quero ver" e "escolhi" é literalmente esta.
- [Nextdoor — "Join" sólido](https://mobbin.com/screens/3371a7b8-5efe-46a6-9ace-058be3e87ad2) — a referência do que **não** fazer: botão sólido de largura total lê como inscrição.
- [Blackbird — stats em três colunas](https://mobbin.com/screens/e553aed1-ceb0-4f6c-9d2a-30c5a2001ca8) — três colunas rotuladas, exatamente para custo / horas semanais / como entrar.
- [Going — "0 results" com Clear na mesma linha](https://mobbin.com/screens/71eb64b3-b380-486e-b0ca-0d10ad694e17) — a contagem zero aparece onde a contagem normal aparece.
- [OpenSea — vazio com os chips culpados visíveis](https://mobbin.com/screens/45a834a8-d95b-43fe-8420-7f0660bb528b) — os chips que causaram o zero continuam na tela para remoção individual.

## The four axes

Three of them are genuinely structured fields in real directories — Michigan
publishes all three — which is why they make a filter worth having rather than an
ornament:

- **Category** — 8–12 values, the stable core across every directory examined:
  academic/honor, arts & performance, cultural/identity, faith, service, sport &
  recreation, media/publications, political/advocacy, governance,
  professional/pre-professional, special interest, greek.
- **Cost per semester** — `$0 · $1–20 · $21–100 · $101–250`.
- **Weekly time** — `1–2 h · 3–5 h · 5+ h`.
- **Getting in** — `Automatic acceptance · Attend a meeting · Application ·
  Interview or audition · Rush · Academic standing`.

Meeting cadence and location are shown but are **not** structured fields in the
real systems — an improvement on the standard, flagged as such in the fixture so
nobody later mistakes it for a copy of one.

Greek life and sport clubs are categories inside the directory. Intramurals,
work-study and residence life are separate systems and do not belong on this
screen.

## The screen

Header, one line: `[search] [Category ▾] [Cost ▾] [Time ▾] [Getting in ▾] · 62
organizations · Clear all`. The result count lives in that line and is the
feedback when a filter lands.

**Desktop**: four pills opening anchored popovers. No permanent side panel — four
axes do not justify a column, and the catalogue is the content. The active pill
goes solid and carries its count. Popovers have no Apply; they apply on click and
the count updates behind.

**Mobile**: the same pills with horizontal overflow, never wrapping. Tapping one
opens a bottom sheet for **that axis only**, sized to content, with a fixed
`Clear · Show 38 organizations` footer. One axis per sheet is what keeps it from
eating half the screen. An extra `Filters (2)` pill opens all four stacked.

**Card**: name and category badge; one truncated line; a metadata row — `$0–50/sem
· 2–4 h/week · Just show up`. Getting in appears on the **card**, not only in the
detail: it is what separates "I can turn up tomorrow" from "there is an audition".

**Detail**: name, category, size; a three-column labelled block — Cost per
semester / Weekly time / Getting in; when getting in is anything but automatic, a
line naming the real step ("Audition in September — sign up at the fair");
description; where and when they meet; the interest action in the footer,
secondary.

## Interest is not enrolment

The rule: **the control is never a full-width solid button, and the label is
never a commitment verb.**

- Neutral: outline or ghost, bookmark icon, label `Interested`, the same visual
  weight as the card's metadata.
- Marked: filled pill in a **neutral** tone with the label in the past tense.
  Brand colour stays reserved for the screen's primary navigation action.
- No toast, no confetti, no counter animation. The toggle is reversible and the
  pill is the same width in both states, so the card never changes height or
  position.
- One supporting line under the header on first visit: marking interest does not
  sign you up, it builds your fair route.
- **"Join", "Sign up", "Apply" and "Enroll" appear nowhere as a control.** Where
  an organization requires an application, that is information in Getting in.

The Step is optional and skippable from the action bar, as Laura specified.

- [ ] No control on this screen says Join, Sign up, Apply or Enroll.
- [ ] The interest toggle is neutral-toned and never changes a card's size or
      position.
- [ ] ~60 organizations in the fixture, derived from real directories; the ~420
      total is stated on screen.
- [ ] All four axes filter, combine and clear; the count updates live.
- [ ] Getting in is visible on the card, not only in the detail.
- [ ] The detail answers cost, time and how you get in, in three labelled columns.
- [ ] Mobile opens one axis per sheet; the pill bar never wraps to two rows.
- [ ] The zero-result state keeps the bar and the count, leaves the offending
      chips on screen, and offers one Clear all.
- [ ] The results area reserves a minimum height so the filter bar does not rise
      when the empty state appears.
- [ ] The Step is optional and skippable.
- [ ] `catalogue.test.ts` covers each axis alone, axes combined, clearing, and
      the zero-result case.
- [ ] Every string comes from `copy-inventory.md`.
- [ ] References appended to `docs/design-research.md`.
