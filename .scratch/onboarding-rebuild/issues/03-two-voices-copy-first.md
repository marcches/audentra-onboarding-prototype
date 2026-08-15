# 03 — Two voices, written before the screens

**Status:** ready-for-agent

**Blocked by:** 02

**What to build:** The whole flow's copy, written as a document before any screen
is built. Title, lead, label, helper, error, button, empty state, confirmation.
The previous round's copy ticket was ninth of nine — built last, against screens
that already existed — which is exactly why the client says the input text was
never fixed.

**Referências:**
- [Fiverr — Are you a U.S. person?](https://mobbin.com/screens/819111c3-99bc-400a-82d2-6919412e1f60) — cada opção de radio carrega a consequência escrita nela ("U.S. tax authorities might request Form W-9"), em vez de uma nota de rodapé abaixo do grupo.
- [Remote — US person](https://mobbin.com/screens/341cd493-0581-4ba9-a47f-2769b46e8a98) — a pergunta explica *por que* pergunta ("We need this to determine which tax forms you need"). É o único helper que sobrevive à poda.
- [Workable — NDA](https://mobbin.com/screens/7f33b11d-bc78-431c-ae2e-1f34582d9b59) — a consequência legal inteira numa frase ao lado do botão: "I agree to be legally bound by this document."
- [Melio — Get Started](https://mobbin.com/screens/f380e3c1-0c86-400e-aaff-5821143e501f) — o que você vai precisar, listado antes do primeiro campo, em vez de descoberto no meio.
- [Cleo — "That totally worked"](https://mobbin.com/screens/9cd27255-d309-406e-b8b4-a6f0073497a6) e [happn — "Take a bow"](https://mobbin.com/screens/5d76730f-2df5-436b-b426-33e476f39937) — voz de marca e tipografia grande substituindo ilustração. É o registro quente, sem mascote.
- [GoodRx — "CHA-CHING"](https://mobbin.com/screens/9cc6c7aa-d129-4781-8e15-39d16e1044cd) — o eyebrow é onomatopeia, não rótulo. Barato e identificável.
- [Marriott Bonvoy](https://mobbin.com/screens/145c73c3-669c-4b43-ace5-e617c6efb76f) — "Feel free to brag a little!" — o convite a compartilhar sem pedir licença.

## Two registers, declared

Not one voice averaged across the flow — that average is what produces "your form
was submitted successfully!".

- **Warm and direct** — Your offer, the acceptance moment, every Points award,
  Campus life, Enrolled. The client's brief, via Laura: *"faça parte desse
  time"*, not *"compartilhe se quiser"*. The analogy on the call was going public
  with a relationship.
- **Flat and precise** — every form, Health information, Review & sign, Deposit.
  Money, FERPA, immigration status and signatures do not want personality.

The seam between the two is a Step boundary, never a paragraph boundary.

## Rules that fall out of the research

- A radio option carries its own consequence in its label (Fiverr).
- A question that needs justifying says why it is asked, once (Remote).
- Helper text survives **only** where a field is genuinely ambiguous. The review
  call was explicit: *"tem explicação em cada um deles — será que é necessário
  isso mesmo?"* The helper text is itself part of the bulk being scrolled past.
- No em dashes. Requested directly by the client on the call.
- Buttons are named for what comes next, never "Submit" — and where money is
  involved the button carries the amount.
- What you will need is listed before the first field, not discovered mid-form.

## What this ticket produces

`docs/copy-inventory.md` is replaced, not amended: every string in the flow, by
Step, in its final wording, with the register marked. Screens are built from it.
Any screen ticket that invents a string instead of taking it from here has
skipped this ticket.

## Checklist

- [ ] Every string in the flow exists in the inventory before any screen ticket
      starts.
- [ ] Each Step is marked with one register; no Step mixes them.
- [ ] Every helper line that survives has a stated reason; the rest are deleted.
- [ ] Every radio option that has a consequence states it in its own label.
- [ ] No em dashes anywhere in user-facing copy.
- [ ] No button reads "Submit", "Continue" where a better verb exists, or
      "Complete purchase".
- [ ] The offer's accept/decline copy is rewritten — named on the call as
      needing better writing.
- [ ] The celebration no longer says "Entirely optional" about sharing; that is
      the exact register the client rejected.
- [ ] References appended to `docs/design-research.md`.
