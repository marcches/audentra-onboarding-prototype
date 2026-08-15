# 02 — Tracer bullet: _Who you are_ ponta a ponta

**What to build:** Um Step inteiro funcionando nas duas larguras, com tudo que o
épico promete acontecendo nele: o aluno abre _Who you are_ num notebook HD e vê a
trilha à esquerda com as três Phases, seus Steps e seus checks, o Balance no pé
dela, os campos em duas colunas dentro de Sections que mostram o que já
responderam quando recolhidas, e o pill de ação flutuando no rodapé com o estado
de salvamento. Abre no telefone e vê a mesma coisa numa coluna, com a barra
segmentada no topo e a barra de ação fixa embaixo. Termina o Step e ganha um
jorro curto de confete atrás do chip de Points.

**Este é o gate.** O cliente confere aqui, no material real, se a densidade e o
`h1` de 24px sobrevivem — antes que qualquer outra tela seja migrada.

**Blocked by:** 01

**Status:** ready-for-agent

**Referências:**
- [Mercury — 1/6](https://mobbin.com/screens/8b12e7b5-4bd6-4eea-9a61-7ebbcfa4f855) e [Klook Merchant](https://mobbin.com/screens/11779a82-1f77-4177-a114-8b3f550f19fc) — a trilha fixa à esquerda com passos aninhados e checks: a anatomia do Rail.
- [Time2book](https://mobbin.com/screens/7c6850a5-6e83-4830-8b67-a30738cf46e1) — o card fixado no pé da sidebar. É o slot do Balance.
- [Clerk — Legal](https://mobbin.com/screens/64495603-2e48-4214-922d-2022463a27e2) — ações num pill flutuante com o estado de salvamento como texto do próprio pill.
- [Etsy — About you](https://mobbin.com/screens/827e35e4-c32a-4f05-bc21-7cffd2a2d13a) — rótulo de seção pequeno, régua fina entre grupos, campo sem moldura pesada. É a `Section` aplicada a formulário.
- [Origin — Basic info](https://mobbin.com/screens/0bff97ff-e115-4eb1-ab8b-4573437ae7a6) — label flutuante dentro do campo, economizando uma linha por campo: densidade sem encolher fonte.
- [Deputy — Contact details](https://mobbin.com/screens/6490ec6d-f7bf-4e6d-af30-fc026b8faaa5) — o `Next` fica desabilitado, não escondido.
- [Vanta](https://mobbin.com/screens/d6c8a960-3253-4ca4-b4aa-06e902fa0e4e) — o contador de preenchimento no cabeçalho da seção. **Rejeitada** a barra de progresso no topo da sidebar: os checks já são o progresso.

- [ ] O Rail existe no desktop: 14rem de largura constante, wordmark e nome do aluno no topo, as três Phases com seus Steps e checks no meio, o Balance e sua conversão no pé. Nunca colapsa.
- [ ] A PhaseBar segmentada existe no mobile, com o Balance comprimido dentro, lendo o mesmo estado.
- [ ] O pill de ação flutua no rodapé no desktop e absorve o "Saved automatically"; no mobile a barra fixa fica.
- [ ] _Who you are_ usa `Section`, não `Panel`. Duas colunas em `desktop`, uma em `compact`, mesma árvore — nenhum componente lê a largura da janela em JS.
- [ ] Section recolhida mostra o valor preenchido; com mais de dois campos, mostra também o contador.
- [ ] Todos os campos do Step aparecem sem rolar em 1366×768. O que não coube virou Section recolhida — **nenhum campo foi apagado**.
- [ ] Beat de entrada: `h1` e primeira Section em 400ms com 60ms de defasagem, nada mais se move. Foco automático no primeiro campo. O botão primário narra o que falta e fica desabilitado, não escondido.
- [ ] Concluir o Step dispara ~40 partículas por ~1,2s ancoradas no Balance, atrás do chip de Points, pela camada do ticket 01.
- [ ] Student status continua decidindo o Identity document, e o bloco revelado aparece abaixo do controle que o disparou, sem mover nada acima dele.
- [ ] **Gate**: o cliente aprova em 1366×768 e 390×844 antes de 03–08 começarem. Se o `h1` de 24px for reprovado, é ele que volta.
