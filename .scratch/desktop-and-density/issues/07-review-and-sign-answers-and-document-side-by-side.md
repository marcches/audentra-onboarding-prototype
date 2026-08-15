# 07 — _Review & sign_: respostas e documento lado a lado

**What to build:** O aluno confere o que assina contra o que respondeu, ao mesmo
tempo. No desktop, respostas à esquerda em Sections que mostram o valor quando
recolhidas, documento e assinatura à direita — a assinatura nunca a uma rolagem
de distância. `Edit` por **linha**, porque é por campo que o aluno pensa, levando
ao Step e voltando pelo pill sem que a tela se desloque. No telefone, uma coluna:
respostas primeiro, documento e assinatura depois.

E o documento passa a dizer o que é antes de o aluno encarar o texto legal — a
queixa original era abrir num documento sem rótulo.

**Blocked by:** 02

**Status:** ready-for-agent

**Referências:**
- [Headspace — Confirm your appointment](htt/ps://mobbin.com/screens/6fdec779-df69-4624-9399-43028d8d1710) — detalhes à esquerda, documentos e assinatura à direita. E o contra-exemplo dentro da própria tela: eles precisaram colar um nudge "Scroll to bottom", que é exatamente o que a coluna fixa dispensa.
- [Figma — Review](https://mobbin.com/screens/e23d11dd-4c38-4d54-bae4-7c10a45042d6) — dados em cartão estreito à esquerda, o objeto sendo confirmado à direita, com o aceite legal colado no botão.
- [Walmart — Review and confirm](https://mobbin.com/screens/548804c1-697d-4d40-ae16-22c57de12b98) — `Edit` por linha, com rótulo de seção acima de cada grupo.
- [Salesforce — Task record](https://mobbin.com/screens/95e5ac90-9df1-486f-8425-b130011eb761) — pares label/valor densos: é a coluna da esquerda inteira.

- [ ] Desktop: duas colunas, respostas e assinatura visíveis na mesma tela em 1366×768.
- [ ] Mobile: uma coluna, respostas primeiro.
- [ ] Nenhum nudge de rolagem existe na tela.
- [ ] `Edit` é por linha e leva ao Step com a marca de origem; a volta mora no pill de ação, nunca acima do título.
- [ ] Editar um campo e voltar deixa o `h1` do Step no mesmo pixel de quando se chega por Continue.
- [ ] O acordo tem título visível.
- [ ] Sections recolhidas mostram o valor respondido.
- [ ] Os múltiplos pares título-e-lead deste arquétipo continuam permitidos: num `review` eles são estrutura, não empilhamento (ADR 0006).
