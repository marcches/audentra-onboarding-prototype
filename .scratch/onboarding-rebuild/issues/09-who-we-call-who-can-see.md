# 09 — Who we call, who can see

**Status:** done

**Blocked by:** 02, 03

**What to build:** The last of the three Steps replacing `identity-contact.tsx`:
the emergency contact, and **Family access** — the FERPA record of who may see
what.

The two live together on purpose. Remote separates them, but together they are
about two minutes and they answer the same question — other people on your record
— and splitting them would produce two Steps below the floor the evidence shows.

**Referências:**
- [Remote — Add an employee](https://mobbin.com/screens/d6094185-b959-4f34-8022-248f0ea7ff52) — `Emergency contact` como entrada de rail própria, apartada do perfil pessoal.
- [Deputy — Completing documents](https://mobbin.com/flows/77da76fb-cd1d-413a-925f-84e03419ac30) — assuntos sobre terceiros ficam num passo só, não pulverizados pelo formulário.
- [Remote — US person](https://mobbin.com/screens/341cd493-0581-4ba9-a47f-2769b46e8a98) — a pergunta sensível diz por que é feita antes de pedir o dado.
- [Melio — Add cardholder details](https://mobbin.com/screens/a1123459-1409-4b67-b150-01ae29d5e669) — pares na horizontal; nome e parentesco numa linha.
- [Origin](https://mobbin.com/screens/3aa9eac9-df30-442d-b4b1-57d250860e5a) — o passo mais curto do fluxo ainda é um passo, com "adicionar mais uma pessoa" como ação secundária.

## Explain the law before asking about it

Added 2026-08-15, from Laura's annotation on the screen: *"Include FERPA — a
brief explanation of the law."*

The section opens with a short explanation of FERPA in plain language, before any
field. The substance that matters, from the annotation:

> The Family Educational Rights and Privacy Act (FERPA) is a federal law that
> affords parents the right to have access to their children's education
> records. **When a student turns 18, or enters a postsecondary institution at
> any age, those rights transfer from the parents to the student.**

The second sentence is the point, and it is why this explanation earns its place
rather than being legal decoration: it answers the question the screen provokes
in a seventeen-year-old and in the parent standing behind them — *why am I the
one deciding what my family can see?* Because the law moved the right to the
student on the day they enrolled. Without that sentence the screen reads as the
university arbitrarily cutting parents out.

Constraints, so this does not become the bulk the client has complained about
twice:

- Brief. A short paragraph, in the flat register, not the statute.
- It is **explanation**, so it sits on the Ground as supporting text or in an
  `aside` Panel — never in a Well, which is for data.
- It comes **before** the fields, not as a footnote under them.
- The full text can live behind a "what this means" disclosure, but the sentence
  about rights transferring is always visible, never behind the disclosure.
- No em dashes, per ticket 03.

## Family access

Four fields, and the fourth is the one that has never been built:

1. Full name
2. Email
3. **Relationship**
4. **What they can see** — the scope granted

Laura listed all four on the call: *"precisa do nome completo, precisa do e-mail,
precisa do parentesco, e o que vai ter acesso."* The screen's own lead has been
promising the fourth for two rounds. `CONTEXT.md` already defines Family access
as carrying all four.

The scope is a real choice with consequences, not a checkbox — the copy for each
option states what that person will and will not be able to see, in the flat
register.

More than one person can be granted access, and each is an independent record.

## The emergency contact

Name, relationship, phone. The relationship options are the same set used by
Family access, defined once.

- [ ] A brief FERPA explanation appears before the fields, not after them.
- [ ] The sentence about rights transferring to the student on enrolment is
      always visible, never behind a disclosure.
- [ ] The explanation sits on the Ground or in an `aside` Panel, never in a Well.
- [ ] Family access captures name, email, relationship and scope.
- [ ] Each scope option states what that person can and cannot see.
- [ ] More than one person can be granted access, and each can be removed.
- [ ] Relationship options are defined once and used by both sections.
- [ ] The Step reads as one subject — people on your record — not as two forms
      stapled together.
- [ ] Fits one viewport at 1440 with one person granted access.
- [ ] Every string comes from `copy-inventory.md`.
- [ ] References appended to `docs/design-research.md`.

## Comments

### Fechado em 2026-08-15 — `b241431`

**Onde vive:** `src/routes/who-we-call.tsx`, `FamilyAccessGrant` em
`src/lib/store.ts`, `whoWeCallSchema` em `src/lib/validation.ts`.

A frase sobre a transferência do direito aos 18 anos está em negrito, no corpo,
**sempre visível** — nunca atrás do disclosure. O disclosure carrega só o
detalhe prático. A explicação está na Ground do Panel, nunca num Well: um Well é
para dado, e explicação não é dado.

Family access é uma lista, com os quatro campos. O quarto é o que nunca tinha
sido construído, e o schema recusa uma concessão sem escopo — nome e e-mail sem
significado atrelado não é um registro FERPA.

Health e Disciplinary record continuam marcados como `sensitive` no fixture,
desenhados à parte e nunca pré-marcados.
