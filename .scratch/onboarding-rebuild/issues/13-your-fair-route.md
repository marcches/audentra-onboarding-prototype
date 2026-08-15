# 13 — Your fair route: what the interest list is for

**Status:** ready-for-agent

**Blocked by:** 12

**What to build:** The outcome of Campus life. Marking interest has to produce
something, or the Step is a survey that goes nowhere. What it produces is a route
through the Involvement Fair — the in-person event where joining actually
happens.

This is the ticket that makes ticket 12's premise honest. Without it, "Interested"
is a button that does nothing, and the Step reverts to being a selection screen
with softer wording.

**Referências:**
- [Wanderlog — itinerário por dia](https://mobbin.com/screens/a9e14927-a81a-4255-88bf-cbc54a2f2538) — cada parada é um cartão numerado com horário e o tempo de caminhada até a próxima. É o formato do roteiro.
- [Google Maps Timeline](https://mobbin.com/screens/0084a901-a5a2-4d9c-b1d7-c665ed356b00) — trilho vertical contínuo com pontos e trechos de deslocamento entre paradas, e um resumo no topo (5 visitas, 3h29).
- [Trip.com — overview com itens removíveis](https://mobbin.com/screens/ed92777b-cd9a-4b3c-8796-42f2ecdf21c1) — visão condensada por bloco antes do detalhe, com `×` por item para remover no lugar.
- [Pangea — itinerário guardando o que veio da wishlist](https://mobbin.com/screens/4e015b05-c82e-49bd-bcb6-afaaa90c7afd) — o roteiro preserva a origem dos itens e permite ver só um tipo.
- [Careem — favoritos como lista simples](https://mobbin.com/screens/2e491c8a-aba9-4d19-bea0-f7ee50c90ba9) — o marcador de salvo à direita é o único enfeite; o resto é conteúdo.

## The route

Reached from an `Interested · 7` pill in the catalogue header.

1. **Summary line** — `7 organizations · 3 fair zones · ~45 min`.
2. **Grouped by fair zone**, not by the order things were marked. That regrouping
   is the entire difference between a list of saves and a route: it turns
   "things I liked" into "where I walk". Zone headers, numbered stops on a
   vertical track beneath each, walking legs between zones as a thin line.
3. **Each stop** carries its number, the organization's name, the table number,
   and the **Getting in** line — at the fair that last one is the only thing the
   student will actually use ("bring a résumé", "audition in September", "just
   turn up").
4. **An inline `×` removes a stop**, no confirmation. The route is a draft.
5. **Footer**: export or print. Nothing else. The route is the product; it does
   not submit anywhere and there is no "confirm my clubs".
6. **Empty state**: nothing marked yet, with the way back to the catalogue.

The fair's date and place are stated once at the top, because that is the fact
that makes the whole screen make sense — the student is being handed a plan for
an event that happens after classes begin.

- [ ] Stops are grouped by fair zone, not by the order marked.
- [ ] The summary counts organizations, zones and walking time.
- [ ] Each stop shows table number and the Getting in line.
- [ ] Removing a stop is inline, immediate and reversible by re-marking.
- [ ] The fair's date and place appear once, at the top.
- [ ] Nothing on the screen submits, confirms or enrols.
- [ ] The route can be exported or printed.
- [ ] The empty state offers the way back to the catalogue.
- [ ] Works at 390px without horizontal scroll.
- [ ] Every string comes from `copy-inventory.md`.
- [ ] References appended to `docs/design-research.md`.
