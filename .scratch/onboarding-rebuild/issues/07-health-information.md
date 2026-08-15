# 07 — Health information, beside the other documents

**Status:** done

**Blocked by:** 01, 02, 03, 06

**What to build:** The Step the client described as having a strange flow. It
keeps its own place in the spine — the research argued against dissolving it —
but moves to immediately after **Who you are**, so the three uploads of the whole
flow (Identity document, medical documentation, Immunization record) are
adjacent.

**Referências:**
- [Deputy — Completing documents](https://mobbin.com/flows/77da76fb-cd1d-413a-925f-84e03419ac30) — "Documents we need from you" é entrada de rail própria, apartada dos formulários e **contígua**. É o argumento para Health ser um Step e para onde ele fica.
- [Revolut Business — Verifying personal identity](https://mobbin.com/flows/f37fbbc4-ddc2-412b-a6fe-b87d8ddc66ef) — o upload de documento ocupa uma tela sozinha em vez de virar uma seção de outra.
- [PayPal — Upload documents](https://mobbin.com/screens/8ea4958b-7bb4-409a-8d8c-7983b3c2e15c) — a dropzone é o único elemento rebaixado, e o arquivo enviado **sai dela** e vira miniatura: o Well não acumula estado.
- [Lindy — Files](https://mobbin.com/screens/50bd3a40-45f3-44a4-a9da-fe935dffefe1) — dropzone e lista de arquivos como dois Wells irmãos sob um rótulo comum: dois uploads distintos sem virar duas seções.
- [Cake Equity](https://mobbin.com/screens/90edf08e-3f62-4a8d-8cd9-2d2d5e6bef0b) — os uploads nascem abaixo do controle que os pediu, no mesmo bloco.
- [Remote — US person](https://mobbin.com/screens/341cd493-0581-4ba9-a47f-2769b46e8a98) — a pergunta sensível explica por que é feita antes de pedir o anexo.

## Why it stays a Step

I recommended dissolving it into Who you are during the grilling and the evidence
said otherwise. Three reasons, in order of weight:

1. It is the **only optional Step** in its Phase. Folding it into a required Step
   would make optional information sit inside a mandatory screen.
2. It carries two uploads and a conditional — which is exactly the shape that
   produced the "About you is a mess" complaint when four such things shared one
   screen.
3. Deputy and Revolut both give document collection its own rail entry.

## The Step

One question — does the student need an accommodation for a disability or health
condition — asked in the flat register, with its reason stated once. On yes, two
uploads appear **below the control**, in the same Panel: medical documentation
and Immunization record, as sibling Wells under one label.

The Immunization record is asked for regardless of the accommodation answer. It
is not conditional on disability, and treating it as such was part of what made
the flow read as strange.

Optionality is stated plainly, and so is the consequence of skipping: the student
portal will require this later even though onboarding does not. Laura was
explicit that this difference has to be said, not implied.

## Copy register

Flat and precise, from ticket 03. This is the one screen in the flow where warmth
would read as intrusive.

## Checklist

- [ ] Health information sits immediately after Who you are in the spine.
- [ ] The three uploads of the flow are adjacent in the journey.
- [ ] The accommodation question states why it is asked, once.
- [ ] Uploads appear below the control that revealed them; nothing above moves.
- [ ] Immunization record is not gated on the accommodation answer.
- [ ] Skipping is possible from the action bar and the copy says what skipping
      means later.
- [ ] An uploaded file leaves the dropzone rather than accumulating inside it.
- [ ] The Step is marked optional in the rail and on Review & sign.
- [ ] Fits one viewport at 1440 in both its answered and unanswered states — this
      Step had 443px of dead canvas.
- [ ] References appended to `docs/design-research.md`.

## Comments

### Fechado em 2026-08-15 — `b241431`

**Onde vive:** `src/routes/health.tsx`, posição na espinha em `src/lib/steps.ts`.

Fica imediatamente depois de Who you are, e `steps.test.ts` afirma essa
adjacência por índice — é o que mantém os três uploads do fluxo contíguos se
alguém reordenar a espinha depois.

O Immunization record **não** é condicionado à resposta sobre acomodação. Ele
tem rótulo próprio abaixo de um divisor, e os dois uploads são Wells irmãos.

A pergunta diz por que é feita, uma vez. Skip está na barra e a linha sobre o
que pular significa depois está na tela, não implícita.
