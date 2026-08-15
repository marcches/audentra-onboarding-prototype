# 02 — The spine: ten Steps, levelled

**Status:** done

**Blocked by:** 01

**What to build:** `steps.ts`, the store and the route skeleton for the rebuilt
spine. No screen content — this ticket makes the ten Steps exist, navigable, with
their metadata, and leaves each screen empty for its own ticket. The client's
complaint that the rail is too short is answered here, not by padding.

**Referências:**
- [Remote — Add an employee](https://mobbin.com/screens/d6094185-b959-4f34-8022-248f0ea7ff52) — rail de 7 com exatamente a nossa quebra: Personal profile · **Address details** · **Emergency contact** como entradas separadas. É a evidência literal de que About you vira três.
- [Deputy — Completing documents](https://mobbin.com/flows/77da76fb-cd1d-413a-925f-84e03419ac30) — 8 tarefas nomeadas, uma por assunto, com a seção de documentos contígua. É o modelo de pôr Health junto dos outros uploads.
- [Airwallex — Verifying ID](https://mobbin.com/screens/e72dd825-7bcd-41e3-9a3f-f3ba8cab355b) — rail de dois níveis: grupos pais com filhos, só o grupo atual expandido. A forma de mostrar 10 Steps sem parecer 10.
- [OKX — Completing identity verification](https://mobbin.com/flows/183e41d1-8744-48c6-b254-155794430af0) — chega a separar "Enter your address" de "Verify your address": duas telas para o que é um assunto só. O piso de granularidade é mais baixo do que parece.
- [Mercury — onboarding](https://mobbin.com/screens/bdc369b8-aa88-4826-8c21-c52a19c5fa50) — "3 / 6" grande acima do rail, e Company info separado de Company address.
- [Klaviyo — Set up your account](https://mobbin.com/screens/c116a0f9-8c5e-450d-b66d-d7a4f52a4b61) — **"About 3 minutes" por sub-step**. É a referência que revoga a regra de que tempo nunca aparece numa linha de Quest.
- [Melio — Get Started](https://mobbin.com/screens/f380e3c1-0c86-400e-aaff-5821143e501f) — "Takes 4-5 minutes · Each step is saved as you progress" antes do primeiro campo. É o total anunciado uma vez.
- [HoneyBook](https://mobbin.com/screens/7c915d6b-2a99-4eb0-956d-e7a3a97bb265) — "6/7 completed" com minutos por linha, e o minuto **some quando a linha fica verde**.
- [Binance — Verifying an account](https://mobbin.com/flows/24bdfada-87a1-4718-acb9-ae2446410854) — a tela de abertura lista os passos por nome e promete "verify your account in 7 minutes".

## The spine

| Phase | Quests |
|---|---|
| **Deciding** | Your offer |
| **About you** | Who you are · Health information · Where you live now · Who we call, who can see |
| **Your life on campus** | Housing · Campus life |
| _Closing_ | Review & sign · Deposit |
| _After_ | Enrolled |

Ten Steps. The evidence range across nine researched flows is 3 to 10, nobody
above ~10 without grouping. **The old problem was never the count — it was the
distribution**: one Step of six minutes beside five of one. Every Step here is
one to three minutes.

`Where you live now` exists only for the Student statuses it applies to. It
disappears from the rail entirely for an international student rather than
appearing and explaining itself.

## Metadata on the Step

`steps.ts` stays the single source and grows three fields per Step: **minutes**,
**required/optional**, and **Point value**. Nothing anywhere derives a count, an
order, a duration or a number from anywhere else.

Minutes and the optional flag appear **in the rail and on Review & sign**, and a
total is announced once before the first field. This revokes the existing rule
in `steps.ts` that time never appears on a Quest line — Klaviyo and HoneyBook
contradict it, and with Steps levelled at 1–3 minutes the figure reads as "this
is quick" rather than as a threat. It is also more than the review call asked
for; the call asked for it on Review & sign only. Name this on the next call
rather than letting it be discovered.

## Deposit in the rail

The Deposit is **one rail entry** with three internal screens. A checkout is one
thing to anyone who has bought something online, and three entries would make the
Closing larger than a Phase — which is the distinction `CONTEXT.md` protects.

## Checklist

- [ ] Ten Steps derived from the Phase groups; adding a Step by editing a flat
      array remains impossible.
- [ ] Every Step carries minutes, required/optional and a Point value.
- [ ] `Where you live now` is absent from the rail, not skipped in it, when
      Student status does not call for it.
- [ ] Rail shows the current Phase expanded to its Quests; ten Steps do not read
      as ten.
- [ ] Total time announced once, before the first field.
- [ ] Minutes disappear from a line once it is complete.
- [ ] Deposit is one rail entry.
- [ ] Storage version bumped; a stored value that changed meaning does not load
      into the new shape.
- [ ] `steps.test.ts` covers the new counts, order, navigation, metadata, and the
      conditional absence of `Where you live now`.
- [ ] References appended to `docs/design-research.md`.

## Comments

### Fechado em 2026-08-15 — `b241431`

**Onde vive:** `src/lib/steps.ts`, `src/lib/store.ts`,
`src/components/step-rail.tsx`, `src/components/step-shell.tsx`,
`src/router.tsx`, `src/lib/steps.test.ts`.

Dez Steps derivados dos grupos; `steps` é `groups.flatMap(...)` e o teste afirma
essa igualdade, então acrescentar um Step editando uma lista plana continua
impossível. Cada Step carrega `minutes`, `required`, `points` e `archetype`.

`Where you live now` não é pulado no rail: ele **não existe** para um estudante
internacional. `stepApplies` / `groupsFor` / `stepsFor` filtram a espinha por
Student status, e `nextStep` / `previousStep` recebem o status, então Continue
nunca leva a uma tela que a espinha diz não existir. `stepCountFor` devolve 10 e
9, e o total de minutos e de Points cai junto.

Storage subiu para `v5`. `identityContact` virou três slices, `citizenship`
virou `studentStatus` com três valores em vez de quatro, `campusLife.clubs`
virou `interests` contra um catálogo completamente diferente.

**Desvio a nomear na próxima call:** minutos aparecem na linha do Quest, não só
em Review & sign. Isso é mais do que a call pediu. Klaviyo e HoneyBook são a
evidência, e o número some quando a linha fica pronta.
