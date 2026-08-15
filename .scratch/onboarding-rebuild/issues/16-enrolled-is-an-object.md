# 16 — Enrolled: hand over an object, not a message

**Status:** done

**Blocked by:** 04, 15

**What to build:** The final screen, drawn from nothing. It absorbs the deposit
receipt, so the flow has **one** ending rather than two in a row with opposing
registers — a sober receipt followed by a celebration is an anticlimax.

The research was unanimous and it is not what a bigger confetti burst would
suggest: the products that end a flow well **hand over a thing**. CRED activates
a membership, Qonto and Zing deliver a card, Qantas delivers a membership number.
None of them deliver a sentence.

**Referências:**
- [CRED — membership activated](https://mobbin.com/screens/d019ff07-66a3-44cb-b9bc-cece1fec50d9) — eyebrow de status + frase de pertencimento, **sem confete**, e ainda assim o momento mais caro do app.
- [Qonto — card ready](https://mobbin.com/screens/e8a14e8f-026f-4010-87f3-da16d3f2ba22) e [Zing — "Your digital card is live!"](https://mobbin.com/screens/02897cfd-94ce-430d-a253-7ecb1a2cb821) — o fim do fluxo entrega **um objeto**, não uma mensagem.
- [Qantas Frequent Flyer](https://mobbin.com/screens/f909ccea-f103-4cbd-b3a9-6545a156b123) — entrega o número de matrícula como o artefato do fim.
- [Headway — daily mission complete](https://mobbin.com/screens/e82ee53f-9d24-458d-9846-8500317aba65) — o checklist do que foi feito reaparece **dentro** da celebração, com checks.
- [Greenlight — Challenge Complete](https://mobbin.com/screens/2b0ba3b6-c40d-4f63-bd84-8ff8910d7479) — os ganhos como linhas de recibo, cada moeda na própria pílula.
- [Alan — "You've earned 100 berries!"](https://mobbin.com/screens/1c7a2c39-28d7-484f-acb6-9f0de113a29d) — o CTA secundário é **"Use your berries"**: a celebração já oferece o gasto.
- [GoodRx Gold](https://mobbin.com/screens/ffc1a04c-92de-4bc6-bc73-3684de5c1cdd) — ativação mais duas ações concretas de "agora use isto".
- [Nibble — TOTAL SCORE](https://mobbin.com/screens/5385f415-3d0a-4d60-86f2-b50d6aaa7763) — hierarquia mínima: verbo, número gigante, um botão.
- [Uxcel Go — Share to story](https://mobbin.com/screens/a849139b-8acf-4bd6-9046-3d9ee8381db5) — cartão 4:5 com quatro métricas em grade 2×2 e marca no rodapé.
- [Marriott Bonvoy](https://mobbin.com/screens/145c73c3-669c-4b43-ace5-e617c6efb76f) — "Feel free to brag a little!", e o cartão compartilhado é o mesmo objeto de status do app.
- [Beli](https://mobbin.com/screens/b486127e-a01f-4659-9abb-74b16f1f69b5) e [Calm](https://mobbin.com/screens/75c25c9b-df74-43f1-baea-e61def7bb524) — o cartão compartilhável sobre fundo em gradiente, nunca sobre a UI crua.
- [Duolingo Year in Review](https://mobbin.com/screens/81b67776-4a5d-40d9-860e-9b3b4122357a) — "SHARE FOR A REWARD": compartilhar é ele próprio um ganho.
- [Whop — Receipt paid](https://mobbin.com/screens/3be227fe-e941-420f-b49f-4b2808749c1b) — o recibo como bloco sóbrio: valor, referência, data, método.

## The screen

1. **Eyebrow + headline.** `ENROLLED` in spaced caps, then a short line in the
   warm register from ticket 03. Voice carries this, not an illustration.
2. **The object.** A student card — name, enrolment ID, the Residence they ranked
   first or were assigned, entry year — arriving with a flip-in from nothing.
   This is what gets screenshotted, and designing for that is the point.
3. **The journey as a receipt.** The three Phases and the Closing with checks and
   their Points, totalling into a **full-size Balance** with its conversion to
   bookstore credit below it.
4. **The deposit receipt**, subordinate: a sober, collapsible Well carrying
   reference, date, method and the what-happens-next timeline from ticket 15. The
   tax-relevant information is not lost; it is a section rather than a screen.
5. **Primary action is spending**, not closing: "Spend $18 at the bookstore",
   with Done secondary.
6. **Share**, tertiary, producing the 4:5 card with four metrics — Quests, Points,
   Residence, enrolment date — over a gradient ground, never over raw UI. Sharing
   awards Points through ticket 04's mechanism.

Confetti exists but is short (~900ms) and sits **behind** the card. The weight
comes from the object, not from particles. This is the one screen where `gsap`
may earn itself over `motion`, if the card's arrival needs a real timeline.

## What this screen must not become

A bigger version of what exists. The current completion screen is 401 lines and
the client's note was that it is fine but should be redrawn from nothing using
the references. Redraw it.

## Checklist

- [ ] The deposit receipt lives here; there is no separate receipt screen.
- [ ] The hero is an object that arrives, not a headline.
- [ ] The student card carries name, enrolment ID, Residence and entry year.
- [ ] Phases listed with checks and their Points, totalling to the Balance.
- [ ] The Balance appears at full size with its conversion.
- [ ] The primary action spends the credit; Done is secondary.
- [ ] The share card is 4:5 with four metrics over a gradient ground.
- [ ] Sharing awards Points through the same mechanism as everywhere else.
- [ ] Confetti is under one second and behind the card.
- [ ] `prefers-reduced-motion`: the card is present and complete without the
      flip, and nothing is missing.
- [ ] Fits without the receipt forcing a long scroll — the receipt Well is
      collapsed by default.
- [ ] References appended to `docs/design-research.md`.

## Comments

### Fechado em 2026-08-15 — `b241431`

**Onde vive:** `src/routes/completion.tsx`, `src/components/share-card.tsx`,
`enrollment` em `src/lib/fixtures.ts`.

O recibo do depósito mora aqui, num Well colapsável, e não existe mais tela de
recibo separada — o fluxo tem um final em vez de dois com registros opostos.

O herói é um objeto que chega com flip-in. O confete dura ~900ms, sai em
`zIndex: 0` e fica atrás do cartão.

**`gsap` não se justificou.** O ticket permitia que ele se pagasse na chegada do
cartão, e um `rotateY` com overshoot é uma transição, não uma timeline. Saiu do
`package.json` junto com `SplitText`, `CountUp` e `LightRays`, que ficaram sem
chamador quando esta tela foi redesenhada. Registrado no ticket 17.

**Ajustado depois da conferência no browser:** as três colunas do cartão de
estudante viraram `1.5fr 1fr 0.6fr` porque o enrolment ID quebrava em duas
linhas — num cartão feito para ser fotografado, é a única coisa que não pode
acontecer. E a ação primária diz "Open the bookstore" quando o crédito é zero,
em vez de oferecer gastar $0.

**Nota:** o `#` do título deste arquivo dizia `12`. Corrigido para `16`.
