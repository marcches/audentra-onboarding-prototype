# 09 — Contract: apagar `Panel` e reescrever a régua

**What to build:** O sistema antigo deixa de existir. Com as dez telas migradas,
`Panel` não tem mais nenhum chamador, e os tokens tipográficos antigos não têm
mais leitor — os dois são apagados. É o **contract** do expand–contract, e é aqui
que a régua nova vira teste: enquanto `Panel` existisse, afirmar "nenhuma tela
usa Panel" seria afirmar algo falso.

Nada muda para o aluno. Tudo muda para quem escreve a próxima rodada.

**Blocked by:** 03, 04, 05, 06, 07, 08

**Status:** ready-for-agent

**Referências:** nenhuma, deliberadamente. Este ticket não propõe UI — ele apaga
código morto e reescreve um arquivo de teste. Citar Mobbin aqui seria justificar
depois do fato, que é o que `docs/agents/design-references.md` existe para
impedir.

- [ ] `Panel` está apagado do código e do vocabulário. Nenhuma rota o importa.
- [ ] Os tokens tipográficos antigos estão apagados; a escala densa é a única declarada.
- [ ] `src/lib/layout-rules.test.ts` foi **reescrito, não estendido** — o precedente é o ADR 0006 e o motivo é o mesmo: um teste e uma régua que discordam são piores que qualquer um dos dois sozinho.
- [ ] Ele afirma as quatro invariantes de drift que já existiam: título ancorado no mesmo pixel, nada nascendo acima do título, barra de altura constante declarada uma vez, botão primário com piso de largura.
- [ ] Ele afirma que a Presence tem exatamente oito entradas.
- [ ] Ele afirma que não existe breakpoint fora das três classes em nenhum `.tsx`.
- [ ] Ele afirma que nenhuma regra de animação toca `height`, `top`, `width` ou `left`.
- [ ] Ele afirma que a camada de celebração é uma só, `fixed` e não interativa — evolução da asserção que hoje mira o componente do voo de Points.
- [ ] Ele **não** tenta afirmar conteúdo por dobra nem o teto de três superfícies. Medir dobra sem DOM é fingir que o teste sabe a altura de uma fonte.
- [ ] As cinco costuras de domínio continuam passando sem edição: espinha e navegação por Student status, Points, validação, resumo, catálogo. Se alguma quebrou, o épico foi longe demais.
