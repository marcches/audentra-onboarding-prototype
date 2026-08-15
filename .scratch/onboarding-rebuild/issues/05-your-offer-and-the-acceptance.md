# 05 — Your offer, and the moment of accepting

**Status:** done

**Blocked by:** 01, 03, 04

**What to build:** The `decision` archetype's first instance, and the flow's
biggest emotional moment. Two problems: 452px of dead canvas at 1440×900 —
measured last round and filed rather than fixed — and an acceptance dialog the
client wants to be, in Laura's words, *"um popupzão"*.

**Referências:**
- [Deel](https://mobbin.com/screens/66328d19-07aa-4a67-bacd-4cfea6e32885) — coluna larga é o documento, estreita é o contrato em fatos com Reject/Accept na base: a decisão nunca compete com a leitura.
- [Upwork](https://mobbin.com/screens/826b635b-4b9e-40e6-895d-7f674d820901) — a coluna direita não é resumo da esquerda, é **a outra parte**. É isso que enche a tela sem inflar conteúdo.
- [Turo](https://mobbin.com/screens/a9bcd906-db01-416e-862a-3ccef0773384) — as políticas moram no painel do ato, não no corpo: é o que se pergunta na hora de decidir.
- [Preply](https://mobbin.com/screens/8d814369-220a-4fe1-a800-eae206780502) — painel de **consequência** da escolha em quatro linhas com ícone. É a forma do bloco "what accepting does".
- [Kiwi.com](https://mobbin.com/screens/e46b131d-1b44-4b7c-a43e-689deae6ab4a) — o prazo vira bloco próprio, não linha solta de rodapé.
- [Mistral](https://mobbin.com/screens/49cb4c69-88e7-465e-806e-978413cf3f31) — o gradiente é o **chão** e o conteúdo é peça pousada nele. É como o vazio deixa de ser branco.
- [Stripe](https://mobbin.com/screens/791099ca-408b-4964-9d57-92e3ec2302b5) — gradiente confinado a uma diagonal superior, o resto branco.
- [Frame.io](https://mobbin.com/screens/a8cb043c-52c5-4a95-a972-f4bd741f9821) e [Runway](https://mobbin.com/screens/6d919fa4-5dc7-4589-a2a1-17cb27a4508a) — arte é **faixa vertical de largura fixa**, nunca fundo atrás do texto.
- [Qonto](https://mobbin.com/screens/f6561608-fe6e-43fa-bb26-7158020f0f47) — mobile: número grande, explicação em lista com check, botão colado embaixo, zero grid.
- [Monzo](https://mobbin.com/screens/98df0031-b73c-472f-900a-c686315a8730) — no telefone a arte **encolhe, não some**.
- [Mercedes-Benz](https://mobbin.com/screens/f25b629c-dca8-4818-9cca-ed13479d42c0) — no mobile o número decisivo migra para junto do CTA.
- [Artsy](https://mobbin.com/screens/0aaf2a08-5bd4-49ec-9c04-e6bca23bc09b) — a reasseguração vira bloco cinza imediatamente acima do botão.
- [Commons](https://mobbin.com/screens/c8ac48ea-89ab-4811-ac60-c208492da6f8) e [Linktree](https://mobbin.com/screens/15bce965-033f-424f-ae47-ad9c544cb798) — o que se comemora tem que ser uma **coisa visível**, em proporção de story.
- [Uxcel Go — Share to story](https://mobbin.com/screens/a849139b-8acf-4bd6-9046-3d9ee8381db5) — cartão 4:5 com quatro métricas em grade 2×2 e marca no rodapé.
- [Duolingo Year in Review](https://mobbin.com/screens/81b67776-4a5d-40d9-860e-9b3b4122357a) — **"SHARE FOR A REWARD"**: compartilhar é ele próprio um ganho.

## Desktop

Two columns stretching to the same height, filling the usable viewport. The empty
space stops being white at the bottom and becomes the height of the piece.

- **Left, ~5/12** — the piece: campus photograph in portrait, wash, institution
  wordmark at the top, programme at the base, programme description as a caption
  in the art's footer. No text floating in the middle of the image.
- **Right, ~7/12** — the act, in stacked bands with hairlines: facts as
  label→value **rows**, not a five-cell grid; the deposit tile with the
  respond-by date beside it; the reassurance; and **what accepting does** — three
  lines with icons.
- The canvas beneath takes a very low gradient so the piece rests rather than
  floats.
- Accept and Decline stay in the fixed bar. Decline is a link, one click, no
  two-step confirmation.

**"What accepting does" is migrated out of the celebration dialog.** Stating the
consequence before the decision is the honest pattern and it is what fills the
column. The consequence is that the celebration is now made of emotion, Points
and sharing rather than information — deliberate, and the thing the client
actually asked for.

## Mobile

Reordered on purpose, and content is **cut**:

1. Art band 96–112px with the programme; the programme description drops.
2. Facts as three `label → value` rows. The five-cell grid does not survive.
3. Deposit tile full width, respond-by as a subline, number next to the button.
4. Reassurance as a block immediately above the bar.
5. *What accepting does* is **not** carried to mobile.

## The acceptance

A full moment, not a dialog to dismiss. The thing being celebrated has to be a
**visible object** in story proportion. Share is primary and earns Points; the
next step is a link. The share card is 4:5 with four metrics and the wordmark.
Copy comes from ticket 03 in the warm register — "faça parte desse time", never
"entirely optional".

## The one-viewport rule

Holds. No strong reference asks anyone to scroll in order to *decide*. Documented
exception, not applicable here but relevant to ticket 10: when the object of the
decision is a legally binding document, the document scrolls inside its own Panel
and the signing bar is fixed outside it.

## Checklist

- [ ] Dead canvas below the content at 1440×900 is under 80px. It was 452px.
- [ ] The offer decides in one viewport at 1440, 1280 and 390 — no page scroll.
- [ ] Left and right columns end at the same height at every width.
- [ ] Facts are rows, not a grid, in both layouts.
- [ ] "What accepting does" is on the offer screen and gone from the celebration.
- [ ] Mobile cuts the programme description and the "what accepting does" block.
- [ ] Decline is one click.
- [ ] The celebration owns the screen and its hero is an object, not a headline.
- [ ] Sharing awards Points via ticket 04's mechanism.
- [ ] Nothing on this screen lifts, scales or reflows on hover.
- [ ] References appended to `docs/design-research.md`.

## Comments

### Fechado em 2026-08-15 — `b241431`

**Onde vive:** `src/routes/offer.tsx`, `src/components/acceptance.tsx`,
`src/components/share-card.tsx`.

Medido no browser a 1440×900: o conteúdo preenche a viewport, sem rolagem de
página. As duas colunas esticam juntas porque o grid é `min-h-0 flex-1` e o
arquétipo `decision` põe `h-dvh overflow-hidden` no `main`. Os 452px de chão
morto acabaram.

Os fatos são linhas `rótulo → valor`. "What accepting does" migrou para cá, e a
celebração ficou feita de emoção, Points e compartilhamento — sem informação.

**Parcial:** botões por rede (Facebook, LinkedIn) **não** foram construídos. Não
há integração de share neste protótipo, e um botão com logo de rede que não abre
nada é pior que um botão genérico que abre a mesma coisa. O apelo está escrito
na voz pedida e o cartão 4:5 existe. Registrado em `source-requests.md`, linha
L28.
