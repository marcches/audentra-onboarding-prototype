# 08 — Where you live now, for the students it applies to

**Status:** ready-for-agent

**Blocked by:** 02, 03, 06

**What to build:** The address Step — and the fact that for an international
student it **does not exist**. Not shown and explained, not skipped in the rail:
absent. Laura on the call: *"se não é residente ou cidadão dos Estados Unidos,
não precisa de endereço, já arranca fora."*

This was specified in a previous spec and never implemented. Today every student
is shown a U.S. address block regardless of the answer, which is the single
clearest example of the flow asking for something it knows cannot apply.

**Referências:**
- [OKX — Completing identity verification](https://mobbin.com/flows/183e41d1-8744-48c6-b254-155794430af0) — separa "Enter your address" de "Verify your address" em duas telas: endereço sustenta um Step próprio com folga.
- [Remote — Add an employee](https://mobbin.com/screens/d6094185-b959-4f34-8022-248f0ea7ff52) — `Address details` é uma entrada de rail própria, ao lado de Personal profile.
- [Melio — Add cardholder details](https://mobbin.com/screens/a1123459-1409-4b67-b150-01ae29d5e669) — City/State lado a lado; o bloco de endereço inteiro em ~4 alturas de linha.
- [Cake Equity](https://mobbin.com/screens/90edf08e-3f62-4a8d-8cd9-2d2d5e6bef0b) — revelação ancorada no controle que a disparou.
- [Workable — referral](https://mobbin.com/screens/19490514-0961-404d-9edb-b930bd1a88de) — dois assuntos em duas colunas dentro de um viewport, quando a coluna de campos sozinha deixaria metade da tela vazia.

## The Step

Street, unit, city, state, postal code, country, and the residency-verification
question. **State and city are selects**, the city list scoped to the chosen
state — the review call asked for the dropdown explicitly, so the registrar is
not correcting free text.

The validation schema **branches**: for an international student the address
fields are not merely hidden, they do not participate in the schema at all. A
hidden required field that blocks Continue with an error nobody can see is the
worst version of this.

Existing reasoning worth keeping: the address is required for residency
classification, tuition rate and official post. That reasoning still holds — it
is now scoped to the statuses where it actually applies.

Density comes from pairing on one row rather than from compression, and the
second column takes what is not a field.

- [ ] The Step is absent from the rail for an international student, not shown
      with an explanation.
- [ ] The step count and every "N of M" derived from `steps.ts` reflect its
      absence.
- [ ] State and city are cascading selects; the city list matches the state.
- [ ] Switching Student status after filling an address behaves correctly in both
      directions and never leaves an unreachable validation error.
- [ ] Continue is never blocked by a field the student cannot see.
- [ ] Fits one viewport at 1440.
- [ ] `validation.test.ts` asserts the address participates in the schema for the
      two statuses that need it and is absent for the third.
- [ ] `steps.test.ts` asserts the conditional absence from the spine.
- [ ] Every string comes from `copy-inventory.md`.
- [ ] References appended to `docs/design-research.md`.
