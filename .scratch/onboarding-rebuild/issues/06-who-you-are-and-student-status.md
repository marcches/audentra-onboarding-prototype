# 06 — Who you are, and the answer that shapes the rest

**Status:** ready-for-agent

**Blocked by:** 02, 03

**What to build:** The first of the three Steps that replace `identity-contact.tsx`
— 1068 lines carrying four subjects behind an accordion. This one asks who the
student is and, crucially, asks **Student status** before requesting a document,
so the request is never generic.

Laura described the defect this replaces exactly: *"a gente começou falando de
nome, falou de contato, aí voltou a falar de nome, falou de contato de novo."* An
accordion hides that; it does not fix it. Nor does compression: the research
showed the client's "more density AND less scrolling" is not a contradiction —
both improve when a subject **leaves** the screen.

**Referências:**
- [Remote — Add an employee](https://mobbin.com/screens/d6094185-b959-4f34-8022-248f0ea7ff52) — Personal profile · Address details · Emergency contact como três entradas separadas do rail. A evidência literal da quebra em três.
- [Airwallex — Verifying ID](https://mobbin.com/screens/e72dd825-7bcd-41e3-9a3f-f3ba8cab355b) — o upload do documento acompanha o status, na mesma tela em que o status foi respondido.
- [Fiverr — Are you a U.S. person?](https://mobbin.com/screens/819111c3-99bc-400a-82d2-6919412e1f60) — cada opção de radio carrega a consequência na própria etiqueta, não numa nota abaixo do grupo.
- [Remote — US person](https://mobbin.com/screens/341cd493-0581-4ba9-a47f-2769b46e8a98) — a pergunta que ramifica diz **por que** é feita, e a resposta abre um painel ancorado no próprio radio.
- [Cake Equity](https://mobbin.com/screens/90edf08e-3f62-4a8d-8cd9-2d2d5e6bef0b) — o bloco revelado nasce imediatamente abaixo do controle que o disparou; nada acima se mexe.
- [Melio — Add cardholder details](https://mobbin.com/screens/a1123459-1409-4b67-b150-01ae29d5e669) — First/Last lado a lado: seis campos em ~4 alturas de linha, sem scroll.
- [Zillow — Step 1 of 3](https://mobbin.com/screens/c1b594bb-ab3c-40db-a396-18ee26aa7dd8) — coluna de formulário estreita mais painel à direita que absorve a largura que a coluna não deve ter.

## The Step

Preferred name, pronouns, phone, **Student status**, and the Identity document
that status calls for.

| Student status | Identity document |
|---|---|
| U.S. citizen | U.S. passport |
| Permanent resident | State-issued driver's licence |
| International student | Home country passport |

Status is answered first, and the upload below it changes with the answer —
appearing beneath the control that revealed it, inside the same Panel, with an
authored transition. Nothing above the trigger moves.

Phone is one compact row: dial-code select plus number, one line of help, no
heading block of its own. The review call asked for this directly and it has been
specified twice before without being built.

Helper text survives only where a field is genuinely ambiguous — Laura's *"tem
explicação em cada um deles, será que é necessário isso mesmo?"*. The explanation
is itself part of the bulk being scrolled past.

- [ ] Student status is answered before any document is requested.
- [ ] Each of the three statuses requests the right document, and switching the
      answer changes the request in both directions without losing an upload the
      new answer still needs.
- [ ] The upload appears below the control that revealed it; the title does not
      move.
- [ ] Phone is one row, and no phone field asks for a `+`.
- [ ] Every branching radio carries its consequence in its own label.
- [ ] Fits one viewport at 1440 with no page scroll; scrolls at most once at 390.
- [ ] `validation.test.ts` asserts the required document per status.
- [ ] Every string comes from `copy-inventory.md`; none is invented here.
- [ ] References appended to `docs/design-research.md`.
