# 08 — _Deposit_ e _Enrolled_: o checkout e o palco escuro

**What to build:** O aluno paga vendo o que está pagando: métodos de um lado,
resumo do outro, sem rolar entre o valor e a forma. Escolher um método expande
ali mesmo sem empurrar o resto. E as três saídas — pagar agora, pagar até o prazo,
pedir isenção — aparecem como três saídas, porque nenhuma delas é desistência.

Depois, o fim: a única tela do fluxo que troca de fundo. Palco escuro, o cartão
do aluno no centro, chuva de confete atrás dele por ~3s, uma frase, e duas ações
concretas de "agora use isto".

**Blocked by:** 02

**Status:** ready-for-agent

**Referências:**
- [Babbel — Select payment method](https://mobbin.com/screens/06c179e7-7ff6-4d82-81d9-198a895f5544) — métodos à esquerda, resumo à direita, e **só o resumo emoldurado**: emoldurar os dois apagaria o destaque.
- [Turo — Payment method](https://mobbin.com/screens/a52dd069-342e-4ce8-9d2f-5cc992c22228) e [lululemon — Checkout](https://mobbin.com/screens/36ef1596-819b-42c6-80d2-69f22490238f) — o método selecionado expande em acordeão e os outros continuam visíveis.
- [Mercury — You're all set](https://mobbin.com/screens/c26da4f3-2cdd-47c8-a737-34c623476680) — o fim entrega um objeto, uma frase e duas ações.
- [Linktree — Looking good!](https://mobbin.com/screens/15bce965-033f-424f-ae47-ad9c544cb798) — a chuva sustentada com o objeto produzido no centro. Foi a referência que o cliente citou.
- [Codecademy](https://mobbin.com/screens/c827145c-7d03-4771-908c-6a6c4be2abc7) — sobre palco escuro o confete rende muito mais com muito menos partícula. É por que o Enrolled troca de fundo.

- [ ] Deposit em duas colunas no desktop: métodos no Ground, resumo emoldurado. Uma coluna no mobile, resumo primeiro.
- [ ] O método selecionado expande por `grid-template-rows` ou clip, nunca `height`, e nada acima dele se move.
- [ ] As três saídas do Enrollment deposit são igualmente visíveis, e a tela diz que nenhuma é um abandono.
- [ ] Deposit cabe em uma tela em 1366×768 com o resumo visível junto dos métodos.
- [ ] Enrolled tem palco escuro — a única tela do fluxo que troca de fundo — com o cartão do aluno no centro.
- [ ] A chuva dura ~3s pela camada do 01 e roda sem engasgo em 390×844. Se engasgar, a contagem de partículas cai antes de a duração cair.
- [ ] O eyebrow de status e a frase de pertencimento sobrevivem; duas ações concretas fecham a tela.
- [ ] Com `prefers-reduced-motion`, tudo aparece sem chuva.
