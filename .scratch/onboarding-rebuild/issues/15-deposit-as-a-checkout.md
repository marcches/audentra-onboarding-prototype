# 11 — The Deposit, as a checkout someone has already used

**Status:** ready-for-agent

**Blocked by:** 14

**What to build:** The Deposit, redrawn from nothing. The client's brief: make it
an experience the user has already had — an e-commerce checkout, adapted to the
subject. Three screens behind **one rail entry**, because a checkout is one thing
to anyone who has bought something online.

**Referências:**
- [Airbnb — Confirm and pay](https://mobbin.com/screens/5dae47fd-6764-4452-b208-324c253af5a8) — três cartões numerados numa página só (quando pagar · método · revisar) com o cartão de preço fixo ao lado. É o casamento estrutural mais próximo das três escolhas do depósito.
- [Shop / Shopify — Checkout](https://mobbin.com/screens/963d3261-95be-42f3-8282-5eabe5758620) — "Pay now / Pay in 2 installments" como radios **diretamente acima** dos campos de cartão: cronograma e método são uma decisão, não duas telas. É o padrão que um americano de 18 anos já usou dezenas de vezes.
- [Squarespace — Review Order](https://mobbin.com/screens/74fdbbc4-e844-4598-9c8c-9f2a0b462a94) — o resumo termina numa linha **Due Today** em negrito, distinta do subtotal, e o consentimento legal é texto acima do botão, não um checkbox.
- [Fresha — Review and confirm](https://mobbin.com/screens/1f95a596-cc30-4467-8cde-013944cc6fe2) — Total US$10, depois **Pay now $2.50** e **Pay at venue $7.50** empilhados, com a política de depósito em linguagem simples abaixo. O melhor padrão "isto é um sinal" encontrado.
- [Navan — Summary of charges](https://mobbin.com/screens/87015985-b118-443a-abfa-9ce5ce199417) — "Your payment schedule" com Due now / Due later como duas linhas: a ideia de crédito futuro vira um cronograma, não uma nota de rodapé.
- [Klarna — extrato datado](https://mobbin.com/screens/5651c767-a878-47e2-8e4d-f3c2da9ca488) — obrigação futura como linhas com data e valor. Pegamos o extrato, **não** a identidade fintech.
- [Etsy — Checking out an order](https://mobbin.com/flows/6ce72f42-9962-4bae-9b87-f534bdfc8762) — "You will not be charged until you review this order on the next page", e depois uma tela de conferência antes do botão irreversível.
- [Codecademy — Checkout](https://mobbin.com/screens/85a87575-2cb5-47de-a65f-80011317b961) — preço fixo mostrado uma vez, grande, com "One time payment"; métodos em acordeão, só o escolhido expande.
- [Eventbrite — Checkout](https://mobbin.com/screens/102a5496-3f53-405b-9539-97eed15fec56) — inscrição de taxa fixa com **zero vocabulário de carrinho**.
- [lululemon — Purchasing a product](https://mobbin.com/flows/0a9a45a0-7b9c-4e1c-b838-faa75bd1e3ed) — cada passo concluído colapsa para uma linha com "Edit" e o resumo fica fixo à direita o caminho todo.
- [Stripe — Payment successful](https://mobbin.com/screens/8379a44e-9b7e-4341-8913-9cd1a4be3fa8) — check, uma frase nomeando a cobrança exata, "a receipt has been sent to…", dois botões. Nada mais.
- [Whop — Receipt paid](https://mobbin.com/screens/3be227fe-e941-420f-b49f-4b2808749c1b) — o recibo como objeto: valor enorme, depois número / data / método em três linhas.
- [adidas — confirmação com "next steps"](https://mobbin.com/flows/867c5690-61bf-4e4c-9457-ca78ad4d7a11) — metade recibo, metade linha do tempo do que vem a seguir. É a forma que um depósito precisa.
- [Melio — Payment scheduled](https://mobbin.com/screens/1d9bfa79-45d3-46f7-aff4-026b7ed81af7) — "eu não paguei hoje" ainda ganha uma tela de confirmação completa com a data do débito.
- [Deel — Payment confirmed](https://mobbin.com/screens/eb392439-083f-4863-b60b-baa13493780b) — transferência bancária aparece como **status em processamento**, não como pagamento concluído.
- [Upwork — How will you pay?](https://mobbin.com/screens/2ca97c0e-fbe7-4b16-8b71-ec429957ac4e) — as estruturas de pagamento como radio cards com uma linha de explicação cada, antes de qualquer credencial.

## The three screens

**1 · Secure your place.** Numbered cards on the left — *how to pay* (the three
options as radio rows with a line of explanation each) → *payment method*
(collapsed accordion rows, only the chosen one expands) → *review* (collapsed
until the first two are answered). On the right, a **Deposit summary that never
scrolls away**: the amount, "credited against your first term's tuition", a
bolded **Due today** on its own line, and the refundable-until date. This replaces
the current full-width amount band — a number that large with no price context
reads as a banner, not a total.

Choosing the waiver swaps Due today to `$0 — pending review` and collapses what
follows. **Requesting a waiver is a valid checkout outcome, not an exit.**

**2 · Double check.** Both prior steps collapsed to one line each with Change,
the deposit policy in plain language, and one button reading **Pay $500** —
never "Finish enrollment".

**3 · Receipt.** Tick, one sentence naming the exact charge, the receipt block
(reference, date, method), then a three-row *what happens next* timeline:
deposit received → credited to your first term's bill → balance due. Every
branch reaches a receipt, including paying by the deadline and requesting a
waiver, each with its own copy and status. A bank transfer shows as processing,
not as paid.

## What does not come across from e-commerce

Each of these is deliberate, and the first one is a matter of ethics rather than
taste:

- **No urgency of any kind.** No countdown, no "held for 09:58", no scarcity.
  Applying purchase pressure to a financial obligation, from an institution that
  has already admitted the student, is coercive and reads as a scam.
- No cart vocabulary — no cart, bag, items, quantity steppers.
- No upsells or "you may also like". Nothing is sold on this screen.
- No promo code field. A deposit has no discount, and the field invites a hunt
  for one that does not exist.
- No BNPL branding. Paying by the deadline is an arrangement with Student
  Accounts; fintech chrome implies fees and credit checks.
- No marketing opt-ins in a payment card.
- No confetti on the receipt. The sober next-steps timeline is the right register
  — the celebration lives in ticket 12.
- The button says the amount. The confirmation says a place is confirmed. A seat
  is not an order.

## Gateway

Not connected. Screen 2 simulates, screen 3 is real, the card fields are a stub.
The sequence survives unchanged when a gateway lands.

## Checklist

- [ ] One rail entry; three screens inside it with their own progress.
- [ ] The summary is pinned and never scrolls away, ending in a bolded Due today.
- [ ] "Credited against your first term's tuition" is on screen, not implied.
- [ ] All three outcomes — pay now, pay by deadline, waiver — reach a receipt.
- [ ] The waiver collapses the rest rather than leaving the checkout.
- [ ] Bank transfer reads as processing.
- [ ] The primary button carries the amount.
- [ ] No countdown, cart language, upsell, promo field, BNPL logo, marketing
      opt-in or confetti anywhere on these three screens.
- [ ] The layout is form-left / summary-right at desktop and stacks with the
      amount next to the button at 390px.
- [ ] References appended to `docs/design-research.md`.
