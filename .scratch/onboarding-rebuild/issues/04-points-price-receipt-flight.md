# 04 — Points: the price, the receipt, and the flight between them

**Status:** done

**Blocked by:** 01, 02

**What to build:** The gamification the client asked to make theatrical — larger,
slower, more identifiable. The mechanism matters more than the duration: a Point
value is a **price** before the Quest and a **receipt** after it, and the object
that flies to the Balance is the same tag that carried the price. A figure that
appears from nothing on completion makes the flight decoration; the same figure
travelling makes it a transaction.

**Referências:**
- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) — **+10 / +15 / +20 ao lado de cada tarefa ainda não feita**, e "0 / 595" coroando o checklist: o total possível é a promessa. É a referência que derruba a regra antiga de nunca mostrar preço.
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8) — o "+100" continua visível depois de concluído: a mesma etiqueta é preço antes e recibo depois.
- [Finch — Rainbow Stones](https://mobbin.com/screens/3d7ef155-c49e-45b6-b918-2f73c95f6162) — o chip do saldo fica visível no canto **durante** a celebração e o ganho aparece como pílula separada: é o par origem→destino que o voo precisa.
- [Alan — "321 Berries collected"](https://mobbin.com/screens/9f30f6a1-5ce0-4675-bdc5-b345a8baf371) — as moedas caem atrás e na frente do numeral; a profundidade é o que justifica uma animação longa.
- [Brilliant — Lesson Complete](https://mobbin.com/screens/3c3cb198-8f28-4ed3-84e0-d9607f4da700) — a tela celebra o **acumulado**, não o delta.
- [Ulta Beauty](https://mobbin.com/screens/5e1db78b-5bb0-4336-841e-7ed0d962030f) — "10 Points / $0.00 Value" lado a lado: a tradução vive colada ao número. É o modelo do Bookstore credit.
- [adidas adiClub](https://mobbin.com/screens/5c88e9dd-b915-439e-b81a-3522538b4f0c) — "50 points **to spend**": o verbo transforma contador em carteira.
- [Shopee](https://mobbin.com/screens/d9be55ce-b373-4bea-8c07-9b96f34de029) — a barra de progresso termina no **ícone do prêmio**: o alvo é um objeto, não o fim da barra.
- [IHG](https://mobbin.com/screens/9135b2b8-e7b3-4534-8160-068cbf04f337) — "20 more nights to your next Milestone" com o prêmio nomeado: o que falta é concreto.
- [Mimo](https://mobbin.com/screens/f83964b8-5a63-4abf-bc32-726991f82a82) e [Duolingo](https://mobbin.com/screens/95bfa3c2-24b3-4897-90b5-7cd3bca1400b) — saldo persistente no mesmo pixel entre telas; sem isso o voo não tem destino.
- [Upwork — Earn free Connects](https://mobbin.com/screens/707fa0fd-0ce5-4773-9487-d2bcb53e2f92) — "102 available to earn" no topo e "Earn up to 60" por grupo: preço agregado por Phase.

## Where the price appears

On the Quest being worked and on the next one. **Never** as a price list of the
whole flow — that is what the `CONTEXT.md` rule was protecting, and it survives
in that narrower form. The total available is announced once, at the entrance.
`CONTEXT.md` has already been rewritten to say this.

## The seven beats

~2.6s to a usable CTA. Nothing blocks: Continue is live from beat three.

| # | Beat | Where | ms |
|---|---|---|---|
| 1 | Badge grows from centre with overshoot | step column | 0–350 |
| 2 | Headline enters from below | under the badge | 250–550 |
| 3 | The price pill pulses and turns solid — **the same pill that showed the price** | where the price already was | 500–800 |
| 4 | **Nothing moves** | — | 800–1100 |
| 5 | Pill detaches, flies in an **arc**, shrinks ~40%, sheds its label in the last third | step → Balance | 1100–1850 |
| 6 | Balance scales 1→1.12→1, brief glow, number rolls | shell | 1800–2300 |
| 7 | Credit line cross-fades to the new value | shell | 2300–2600 |

Beat 4 is what the client meant by "more slowly". 300ms of total stillness is
what makes it read as expensive.

The flying pill starts at **56–64px tall** with a coin icon and "+120", large
enough to read in motion. Whatever exists today is a `text-sm`.

## The Balance as a destination

1. **Two numbers, always** — Points above, `= $18 in bookstore credit` below.
2. **Its own surface**, not text in a bar. It should look pressable.
3. **A verb** — "50 points to spend", not "Total: 50".
4. **What is missing, named as an object** — "180 more for a $25 textbook", with
   a thin bar ending in a book icon.
5. **One fixed position** across the entire flow. The flight layer sits above
   everything with `position: fixed` and `pointer-events: none`, so the
   choreography cannot shift the layout — the four drift invariants from 01 still
   hold during the award.

## Checklist

- [ ] The tag that flies is the same DOM concept that carried the price. A figure
      born at completion is a failure of this ticket even if it animates well.
- [ ] Price visible on the current Quest and the next one; nowhere else.
- [ ] Total available announced once, at the entrance.
- [ ] All seven beats present, including the 300ms of stillness.
- [ ] Flying token ≥56px tall.
- [ ] Balance carries two numbers, a verb, its own surface, and a named next
      target.
- [ ] Balance occupies the same position on every screen in the flow.
- [ ] The award cannot move the page: flight layer is fixed and non-interactive.
- [ ] Sharing awards Points through the same mechanism.
- [ ] `points.test.ts` covers price, receipt, the share award, conversion and the
      announced total.
- [ ] `prefers-reduced-motion`: the award resolves without the flight, and the
      Balance still ends on the right number.
- [ ] References appended to `docs/design-research.md`.

## Comments

### Fechado em 2026-08-15 — `b241431`

**Onde vive:** `src/lib/points.ts`, `src/components/points-award.tsx`,
`src/components/balance.tsx`, `src/lib/points.test.ts`.

O mecanismo, que importa mais que a duração: `PricePill` é um componente só
fazendo os dois trabalhos, e ele **registra o próprio elemento DOM** com o
provider. O voo parte de onde a pílula realmente está. Uma versão disso que
voasse do ponteiro seria a decoração que este ticket substituiu, por melhor que
animasse.

Os sete beats estão implementados como uma cadeia de timers em `celebrate()`,
com o beat 4 sendo 300ms em que nada acontece de propósito. Continue fica vivo
no beat 3. O token de voo tem 56px (`size="flight"`), arco com apex derivado da
distância, encolhe ~40% e perde o rótulo no último terço.

O Balance tem os dois números, superfície própria que parece pressionável, o
verbo ("points to spend") e o que falta nomeado como objeto, via `nextTarget()`
e a escada `BOOKSTORE_LADDER`. Preço aparece em exatamente duas linhas do rail.

`prefers-reduced-motion` resolve sem voo e o Balance ainda termina no número
certo. A camada de voo é `fixed` + `pointer-events-none`, e o teste de layout
afirma isso — é assim que uma animação de 2,6s convive com as quatro
invariantes.
