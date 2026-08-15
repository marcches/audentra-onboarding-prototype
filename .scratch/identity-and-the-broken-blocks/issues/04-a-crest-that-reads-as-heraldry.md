# 04 — A crest that reads as heraldry, not as an app icon

Status: ready-for-agent

**What to build:** A student opening the flow sees a mark at the head of the rail
that reads as a university's arms. The client asked for "o símbolo de uma
faculdade de verdade, pra simular como se fosse real", and what makes the current
mark fail that is not that Aster is invented — it is that it is a violet→azure
gradient shield carrying a geometric eight-petal flower, which is the visual
language of an app icon.

Aster stays fictional. Every fixture number in the prototype derives from ADR
0005's ~7,000 undergraduates, and a real university's crest is that university's
registered trademark, which is an awkward thing to have on screen when the demo
is shown to a different university. The mark changes; the institution does not.

Real academic heraldry, legible at 36px: a shield with square shoulders drawn to
a point in flat fill, a chief across the top carrying the founding year, the
aster surviving as a charge rather than as a logo mark, an open book below it —
the commonest charge on U.S. collegiate arms — and a motto ribbon under the
point.

Navy and gold, flat. Aster gets its own palette because Audentra owns
violet/azure/mint at the system layer, and two owners in the same colours is how
the distinction gets lost again.

**Blocked by:** None — can start immediately. Scoped to one SVG and the fixture.

**Referências:**
- [Teachable](https://mobbin.com/screens/6a15e96c-6baf-49ed-8cc1-3e564b8d8b78) — the school's own mark is the subject of the screen and the vendor's wordmark sits small in the corner of the chrome. The whole of decision 1: the institution leads, the platform owns the system layer.
- [Deputy](https://mobbin.com/screens/58047c57-4992-4c27-9974-43c522a5aa42) — the organisation's mark and name at the head of the step rail, above the steps. That is the exact slot this crest occupies.
- [ClassDojo](https://mobbin.com/screens/e66adce1-2ab2-453f-95b1-191846649902) — the class's own identity carries the content while the platform's brand stays chrome-sized.

- [ ] The shield has square shoulders drawn to a point, flat fill, no gradient
- [ ] A chief across the top carries the founding year
- [ ] The aster is drawn as a charge, with an open book below it, and a motto ribbon under the point
- [ ] Navy and gold, flat, and legible at 36px in the rail and at the smaller size the PhaseBar uses
- [ ] `institution.founded` and `institution.motto` join the fixture and are what the crest draws
- [ ] The gold exists inside the crest SVG and nowhere else: not a token, not in the theme, and not confusable with `amber-500`, which means a warning
- [ ] Aster stays fictional; no real university's arms, name or motto are reproduced
- [ ] The layout ruler asserts the crest's colours never reach the theme
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
