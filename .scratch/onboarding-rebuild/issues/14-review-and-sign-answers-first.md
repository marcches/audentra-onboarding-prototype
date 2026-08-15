# 14 — Review & sign: the answers come first

**Status:** done

**Blocked by:** 05, 07, 08, 09, 11, 13 — it summarises all of them, and building
it against fixtures before those screens settle guarantees rework

**What to build:** The screen the client bats an eye at and cannot identify. The
diagnosis is structural, not decorative: **the order is inverted.** It opens on an
unlabelled legal document, and "Your answers" — the review of everything, the
reason the screen exists — is below the fold under a Points figure.

**Referências:**
- [Zillow — Lease review](https://mobbin.com/screens/8743e2d5-d864-47c4-b7ec-43bd57df810d) — cada seção é um cabeçalho colapsável com **pílula de status própria** e Edit, e um botão separado abre o documento. É a resposta mais direta a "bato o olho e não sei o que é".
- [GoFundMe — Review your fundraiser](https://mobbin.com/screens/7e19670f-48eb-4cac-a757-a5092755384e) — um rail fixo declara o propósito numa frase enquanto a coluna direita rola os itens revisáveis. É o que impede um resumo de ser lido como formulário.
- [Gusto — Add a role, Summary](https://mobbin.com/screens/6d232ada-f54e-45a1-ac32-a8ac00856924) — "Step 4 of 4 · Review" fica no cabeçalho: o resumo é legível como o último passo de uma sequência conhecida, não como tela nova.
- [AWS — Review](https://mobbin.com/screens/9af9f1a6-fd6e-4af7-8790-b7ae6e7c7703) — seções como cartões titulados com **um** Edit no cabeçalho, campos em duas colunas com rótulo acima do valor: lê-se como bloco, não como lista de definições.
- [Employment Hero — Check & send](https://mobbin.com/screens/1a1d201b-3303-462e-bf8b-bc67632cf0b2) — cada cabeçalho de seção carrega Edit **e** chevron; expandido por padrão, colapsável para o que não interessa.
- [Remote — Get started checklist](https://mobbin.com/screens/ed95183c-7542-4966-87a7-581bb02b72b9) — o cabeçalho do grupo carrega o estado ("Complete" vs "4 tasks left"), então uma seção fechada ainda diz algo.
- [Origin — Estate planning summary](https://mobbin.com/screens/22a90a68-6172-4d96-a28f-dfd622dc6b1d) — resposta de texto livre ganha bloco de largura cheia; misturar prosa numa lista de duas colunas é o que torna um resumo ilegível.
- [Contra — Review, sign, and start project](https://mobbin.com/screens/4d997279-8a42-4370-8468-686a9265bbe4) — documento à esquerda no próprio quadro de rolagem, assinatura à direita: duas colunas, um trabalho cada.
- [Oyster / DocuSign — Request for Signature](https://mobbin.com/screens/37671703-759d-43be-a0fb-89b45ceeaf2c) — a divulgação de registros eletrônicos vive numa barra persistente acima do documento. É essa linha que faz um adulto americano ler isso como assinar.
- [Workable — NDA](https://mobbin.com/screens/7f33b11d-bc78-431c-ae2e-1f34582d9b59) — a consequência legal inteira numa frase ao lado do botão.
- [Dialpad — Checkout](https://mobbin.com/screens/afbe1fe1-65ff-4c45-b544-56d71ebca235) — seções concluídas colapsam para um cartão com check enquanto só a ativa fica aberta.

## The order, corrected

1. **Status header** — what this screen is, one sentence of purpose, and a
   completeness line: *"14 answers across 5 sections · 1 needs attention"*. Plus
   the position in the sequence, so it reads as the last Step of something known.
2. **Your answers** — moved above the agreement.
3. **The agreement**.
4. **Signing**.

The student checks their own data *before* reading the document built from it.

## Each section

A card, not a `divide-y` band. Header carries the section name, a status pill, a
chevron, and **exactly one Edit**. Today Edit is per group, which multiplies
buttons and flattens the hierarchy.

Expanded by default for sections with problems or with one to three rows;
collapsed for the long ones, with the collapsed state showing a one-line digest —
*"Sunrise Hall · Single · 3 preferences"* — so a closed section still says
something. A long free-text answer gets a full-width block, never a
definition-list cell.

The `?from=review` round trip stays, including the return that takes over the
Back slot in the action bar.

## The Points figure moves out

Next to "Your answers" it competes with the section's own meaning. It belongs in
the header strip.

## Per-Step time and required/optional

Return here, per ticket 02, read from `steps.ts`. A previous round implemented
these and then removed them; they come back by explicit decision.

## Signing

Document in its own scroll frame; signing beside it. Signature mode tabs, the
typed or drawn field, one attestation sentence, the button. The read-to-the-end
gate is unchanged. **Add the electronic-records disclosure line above it** — that
single line is what makes this read as a real signature to a U.S. reader.

This screen is the documented exception to the one-viewport rule: the object of
the decision is a legally binding document, so it scrolls **inside its own
Panel** and the signing bar is fixed outside it. Note that a previous round made
the whole page the only scroll container specifically to support the gate; this
ticket moves the scroll into the panel and the gate has to follow it.

## Checklist

- [ ] The screen opens on a status header, not on a document.
- [ ] Your answers sit above the agreement.
- [ ] Completeness line counts answers and items needing attention.
- [ ] One Edit per section, in the section header.
- [ ] A collapsed section shows a one-line digest.
- [ ] Free-text answers are full-width blocks.
- [ ] The Points figure is out of the summary.
- [ ] Time and required/optional shown per Step, read from `steps.ts`.
- [ ] Electronic-records disclosure above the signature.
- [ ] The read-to-the-end gate works with the document scrolling inside its panel.
- [ ] `?from=review` returns to the right place from all ten Steps.
- [ ] `summary.test.ts` covers the digest per section and the two counts.
- [ ] References appended to `docs/design-research.md`.

## Comments

### Fechado em 2026-08-15 — `b241431`

**Onde vive:** `src/routes/review.tsx`, `src/lib/summary.ts`,
`src/lib/summary.test.ts`.

A ordem inverteu: cabeçalho de status, depois as respostas, depois o acordo,
depois a assinatura. Verificado no browser — a tela abre no cabeçalho, não num
documento sem rótulo.

Uma seção é um Step agora, não uma Fase, com pílula de status, chevron e **um**
Edit. O resumo de uma linha por seção é testado, incluindo que o endereço sai
nas palavras que uma pessoa lê ("San Francisco, California") e não nos códigos
armazenados.

As duas contagens saem das próprias seções. Um Step opcional pulado é `skipped`,
não `attention` — dizer que pular um Quest opcional "precisa de atenção" seria o
fluxo contradizendo a própria palavra, e o teste guarda isso.

O documento rola dentro do próprio Panel e o gate de leitura foi junto, ligado
ao `onScroll` daquele container em vez do da página.

**Ajustado depois da conferência no browser:** `items-start` no grid das seções.
Sem isso uma seção curta esticava até a altura da alta ao lado, deixando um
bloco de branco dentro de um cartão.

**Nota:** o `#` do título deste arquivo dizia `10`. Corrigido para `14`, que é o
número do ticket.
