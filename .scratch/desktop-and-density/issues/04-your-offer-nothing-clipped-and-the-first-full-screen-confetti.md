# 04 — _Your offer_: nada cortado, e o primeiro confete de tela cheia

**What to build:** O aluno abre a oferta num notebook HD e vê a decisão e as duas
ações sem rolar — e, rolando, encontra a descrição do programa e o bloco "o que
aceitar significa", que hoje simplesmente desaparecem. Aceita num segundo momento
explícito, com o termo à vista, e a tela em que ele estava se enche de confete
sem trocar de página.

O ADR 0009 é implementado aqui: sai o `h-dvh overflow-hidden`, entra a invariante
estreita.

**Blocked by:** 02

**Status:** ready-for-agent

**Referências:**
- [Deel — offer](https://mobbin.com/screens/66328d19-07aa-4a67-bacd-4cfea6e32885) — a oferta em duas colunas, termos como linhas label/valor, e Reject/Accept num pill no rodapé. É a decisão e o pill na mesma tela.
- [Upwork — Accept offer](https://mobbin.com/screens/773dff9b-27d9-4525-ae28-37ff607e0df4) — aceitar é um segundo momento com o termo legal explícito, não o mesmo clique com que se lê.
- [Braintrust — Accept offer](https://mobbin.com/screens/25022d7c-9240-4ea9-b238-7b44ab6c5daa) — a confirmação cabe num objeto pequeno: a decisão não precisa da tela inteira, que é exatamente o que o ADR 0009 libera.
- [Trello](https://mobbin.com/screens/5efa7ddf-952d-4264-938c-b5ec328ee885) — o confete cai sobre a UI que já estava na tela, sem trocar de tela.

- [ ] `overflow-hidden` não existe mais neste arquétipo. A tela rola.
- [ ] A descrição do programa e o bloco "o que aceitar significa" voltaram, e nenhuma largura entre 320px e 1920px corta conteúdo.
- [ ] Em 1366×768 e em 390×844, título, fatos da oferta e as duas ações estão acima da dobra.
- [ ] A composição em duas colunas e a medida de 82rem continuam; o que sumiu foi o clipping, não o desenho.
- [ ] Aceitar é um segundo momento, com o termo à vista.
- [ ] O aceite dispara ~150 partículas de tela cheia pela camada do 01, sobre a própria tela da oferta — sem modal de parabéns e sem troca de rota.
- [ ] O confete some sem deixar canvas para trás.
- [ ] O código que carregava a regra antiga cita o ADR 0009 onde ela estava escrita.
