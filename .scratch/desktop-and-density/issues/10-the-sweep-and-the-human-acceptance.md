# 10 — A varredura e o aceite humano

**What to build:** Nada novo. O aluno atravessa o fluxo inteiro em 390×844 e em
1366×768 e nada treme, nada é cortado, nada se sobrepõe errado, nada engasga. E o
cliente confere as duas réguas que o CI não consegue medir.

**Blocked by:** 09

**Status:** ready-for-agent

**Referências:** nenhuma, deliberadamente — este ticket não desenha nada. O que
ele cita são as duas viewports de aceite e a tabela de Presence em
`docs/design-research.md`.

## O que se caça

O cliente cortou o inventário por dispositivo — "não precisa analisar um por um, é
só achar o problema e corrigir". Então a busca é por **causa**, não por tela.

- [ ] **Clipping**: as duas causas conhecidas já morreram (o `overflow-hidden` do `decision`, no 04; a barra fixa cobrindo o pé da coluna, no 02). Confirmado que não sobrou uma terceira em nenhuma largura entre 320px e 1920px.
- [ ] **Flick de posição**: nenhum componente lê largura em JS, nenhuma imagem entra sem dimensão reservada, nenhum bloco nasce acima do título. As três primeiras já são teste; este passo procura o que o teste não pega.
- [ ] **Sobreposição**: a escala de z-index está declarada num lugar só — camada de celebração, pill, modal, popover, Rail — e nenhum `z-` literal existe fora dela.
- [ ] **Travamento**: nenhuma regra de animação toca propriedade de layout, e existe **um** canvas de celebração, não doze.
- [ ] O aceite do cliente em **1366×768** e **390×844**: conteúdo por dobra, Step a Step.
- [ ] O aceite do cliente: teto de três superfícies no eixo vertical.
- [ ] Para cada tela onde se reivindica densidade, algo foi **apagado** do inventário de blocos. Percentual de altura não é evidência.
- [ ] Se algo for reprovado, o conserto volta para o ticket que o causou — não para cá.
