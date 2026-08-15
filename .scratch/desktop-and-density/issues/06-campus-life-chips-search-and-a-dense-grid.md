# 06 — _Campus life_: chips, busca e uma grade densa

**What to build:** O aluno varre ~420 Organizations e consegue varrer. Os filtros
viram uma faixa de chips com busca por texto acima da grade — não uma coluna
lateral, porque o Rail já ocupa a esquerda e rail + filtro + grade em 1366px
deixaria duas colunas de cartão num Step cujo trabalho é justamente passar o olho
por muita coisa. A grade ganha uma coluna e o cartão perde altura. No telefone o
filtro é uma sheet acionada por botão.

**Blocked by:** 02

**Status:** ready-for-agent

**Referências:**
- [Shop — Coffee](https://mobbin.com/screens/0e7de09d-f42a-4ee0-8582-037c61a89ad3) — filtro como faixa de chips acima da grade, chip ativo preenchido. ~2,5rem de altura uma vez contra 14rem de largura permanente.
- [Unity — Asset store](https://mobbin.com/screens/5b890789-7046-4cd6-8c88-7023df1cce94) — grade densa com contagem por categoria, e o dropdown abrindo sobre a grade sem empurrá-la.
- [Zillow](https://mobbin.com/screens/1899b9a4-752f-483c-9798-3b16ea1b074f) — filtro em coluna à esquerda. **Rejeitado** pelo motivo acima; fica citado para não voltar.
- [Salesforce — Advanced User Details](https://mobbin.com/screens/0365bde7-c320-46a0-b2e9-3ea0bb9f8451) — o Quick Find ao lado da navegação: com 420 itens, buscar pesa tanto quanto filtrar.

- [ ] Faixa de chips de categoria + busca por texto acima da grade no desktop; sheet por botão no mobile.
- [ ] Chip ativo é preenchimento — nunca elevação, nunca maior.
- [ ] O cartão carrega nome, categoria, compromisso semanal e custo por semestre. Nada mais: são as quatro coisas que o glossário diz que uma Organization carrega.
- [ ] A grade tem ao menos uma coluna a mais que hoje em `desktop`.
- [ ] Abrir o filtro não move nada acima dele.
- [ ] Primeira dobra em 1366×768 mostra a faixa e ao menos duas fileiras completas; em 390×844, o botão de filtro e ao menos dois cartões.
- [ ] Marcar interesse continua sendo curiosidade e não matrícula, e o destino continua sendo a rota pela Involvement Fair (ADR 0004).
