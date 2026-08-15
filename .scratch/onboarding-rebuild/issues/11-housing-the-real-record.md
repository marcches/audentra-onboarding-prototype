# 11 — Housing: the record a university actually publishes

**Status:** ready-for-agent

**Blocked by:** 02, 03, 10

**What to build:** The `catalogue` archetype's first instance, with a Residence
record shaped like real U.S. on-campus housing rather than like a plausible
guess. The previous spec declared this screen already correct and touched
nothing; the record is the part that was wrong.

**Referências:**
- [Realtor.com — atalhos por ambiente sob o hero](https://mobbin.com/screens/57a73e61-070c-464a-80e1-47bf1d530c61) — uma fila de cards-atalho "Exterior (4) · Bathroom (2)" com miniatura de fundo, cada um abrindo a galeria já naquela seção. É o que permite comparar quarto com quarto sem varrer tudo.
- [Booking.com — card com "See all photos"](https://mobbin.com/screens/7e2f4093-689d-4c24-841b-3cf3dfc3cabb) — o carrossel do card não é a única porta pra galeria.
- [Agoda — contador na foto do card](https://mobbin.com/screens/3ff2c32b-5c44-4cde-b431-6428f73272fd) — pílula escura com "1/6" no canto em vez de dots, que escala pra doze fotos.
- [Expedia — galeria como modal com chips contados](https://mobbin.com/screens/06d4e76f-b493-49f4-b503-49b5371e9c51) — no desktop a galeria é um modal sobre a página, com legenda de ambiente sob cada foto.
- [Airbnb — Photo tour](https://mobbin.com/screens/32308fc2-1dc4-49df-ac43-32fc7207a4e3) — no mobile, empilhado por seção com título de ambiente, a primeira foto grande e as demais em pares.
- [Trip.com — contagem na aba](https://mobbin.com/screens/c4c9c612-c0b4-4b97-9a3b-48ef42003737) — "All 58 / Exterior 6 / Rooms 52": a contagem avisa antes do clique que uma categoria está quase vazia.
- [Zillow — Compare homes](https://mobbin.com/screens/82a740cd-7cde-4aa7-bc7b-63451d23c2ad) — colunas por residência com a primeira coluna de rótulos congelada e linhas agrupadas por assunto.

## The record

The fixture is API-shaped, because this data will come from the university:

`name · campus area · walk time · floors · capacity in beds · year built · year
renovated · room types with explicit occupancy · bathroom (community |
semi-private | suite-style | connecting | private) · air conditioning · laundry ·
dining hall · learning communities · gender configuration · class-year
eligibility · amenities · price per room type`

**Meal plan is priced separately from the room**, and the screen says so. Half of
U.S. universities bundle and half separate; without declaring a convention the
same "double" ranges from $3,556 to $15,568 and no number on the screen is
comparable to any other.

Prices follow the real ratios: triple ≈ 0.85–0.90× double, single ≈ 1.05–1.30×,
private bath +10%, renovated +15%, learning community a **flat** surcharge, rates
per person, internal spread ≈ 2×. Air conditioning is the strongest price driver
in the real data and behaves that way here.

Off campus is removed, per the review call.

## The screen

**Card**: 16:9 photo with a carousel and a `3/12` pill in the corner; name and
type; two or three metrics in a row; the Shortlist action on the photo.

**Detail**: hero with an overlaid counter and an explicit "See all photos"; then
the **room-shortcut row** with background thumbnails — `Bedroom (5) · Common area
(4) · Bathroom (2) · Exterior (3)` — each opening the gallery at that section.
Then the facts, the meal plan line, the rest.

**Gallery**: desktop is a modal with counted chips and a 3-column grid with room
captions; mobile is stacked by section with a room title. Every photograph in
both opens ticket 10's viewer.

**Shortlist** stays three, ranked, out of the catalogue, and the screen states
plainly that a preference is a request and not an assignment — the housing office
assigns. Every university researched says this in those words, and `CONTEXT.md`
already defines Shortlist that way.

**Comparison** of the three ranked: a frozen label column, one column per
Residence, rows grouped by subject.

- [ ] The Residence record carries every field listed; bathroom is the five-value
      enum.
- [ ] Meal plan is a separate line and the convention is visible on screen.
- [ ] Prices obey the ratios and the catalogue's internal spread is ≈2×.
- [ ] Every photograph opens the viewer from ticket 10.
- [ ] The room-shortcut row opens the gallery at the right section.
- [ ] Photo counters are textual pills, not dots.
- [ ] Off campus is gone.
- [ ] Shortlist is three, ranked, reorderable, with the request-not-assignment
      line.
- [ ] Comparison has a frozen label column and grouped rows.
- [ ] Ranking or selecting a Residence does not lift it or change its size.
- [ ] The catalogue sits on the Ground as a full-bleed collection — one of the
      three documented exceptions, not an accident.
- [ ] Every string comes from `copy-inventory.md`.
- [ ] References appended to `docs/design-research.md`.
