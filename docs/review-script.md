# Roteiro de revisão visual/UX

**Complementa** a suíte automatizada, não a substitui. O repositório tem testes
(`pnpm test`: `steps`, `points`, `validation`, `summary`, `catalogue` e
`layout-rules`) e uma versão anterior deste arquivo afirmava que não tinha, o
que era falso e foi herdado por um spec inteiro. O que os testes não conseguem
julgar é composição, tom e movimento, e é disso que este roteiro trata.

Rode em **1366x768** (o viewport da ADR 0008) **e** em **390x844**. Comece
limpo: `localStorage.clear()` no console, depois recarregue.

A ordem abaixo é a ordem da espinha, em `src/lib/steps.ts`.

---

## O que a rodada "identidade e os blocos quebrados" mediu

Cada defeito daquela rodada foi medido em 1366x768 **antes** de qualquer coisa
ser desenhada. A tabela abaixo repete a medição no fluxo entregue, para que a
próxima rodada não comece discutindo se melhorou.

| Defeito | Antes | Depois |
|---|---|---|
| Conector do rail desalinhado | marcador `x=28`, linha `x=23.5` (4,5px em cinco grupos) | marcador, linha e marca todos em `x=28`, nos cinco grupos |
| Prosa dentro de uma Section | 89 caracteres por linha (577px) no bloco FERPA | 68 caracteres (373px) |
| Vão dentro de uma Section | `who-you-are` §3: ~90px de branco sob uma frase | 0 |
| Vão dentro de uma folha | `health` §2: ~140px sob a dropzone | 0 |
| Vão sob uma folha | `who-we-call`: folha termina em y≈400, ~280px de Ground | Ground continua ali, e é aceito |
| Gradiente da marca no app | 3 usos, nenhum num cabeçalho de Section | 1 régua por tela de trabalho + o marcador da Section corrente |
| Quests contados | nove para international, dez para os demais | nove para todo mundo |

Varredura das oito telas de trabalho em 1366x768: **nenhum parágrafo dentro de
uma Section acima de 75 caracteres**, **nenhum vão**, **exatamente uma régua por
tela** (zero em Housing e Campus life, que são catálogos e não têm folha de
trabalho). Em 390x844: sem overflow horizontal, nada cortado, nada sobreposto,
rail fora do fluxo e PhaseBar no lugar. Console limpo em todo o percurso.

Uma medida fica em 76: a legenda da dropzone em Health ("A letter or report from
a clinician. PDF, JPEG or PNG · up to 8 files, 30 MB"). É legenda de controle,
não parágrafo, e trunca em vez de quebrar.

---

## O que o ciclo "o portal, o shell e o Dashboard" mediu

O portal fica em `/portal`. Cada defeito foi medido no `Audentra-portals/apps/web`
em 17/08 **antes** de qualquer coisa ser desenhada; a tabela repete a medição no
que foi entregue.

| Defeito | Antes (portal em produção) | Depois (`/portal`, 1366x768) |
|---|---|---|
| Areas na sidebar | 9, lista plana, sem agrupamento | 9, em três grupos (dois sem rótulo, `ACADEMICS`, `ADMIN`) |
| Areas alcançáveis fora da sidebar | `/appointments` existe e não tem entrada de navegação | 0 — `Appointments` está na sidebar, sem passar por Financials |
| Edward | ocupa uma linha da sidebar (`Edward AI`) | não é linha, e nada ocupa o lugar dela |
| Tela de entrada | snapshot financeiro, eventos do campus, brief do Edward; nenhuma lista de pendências | três Requirements acionáveis, em Smart order, como primeira coisa |
| "O que está faltando" | só abrindo `/enrollment` e lendo | respondido no Dashboard, sem abrir uma segunda tela |
| Valor por trabalho | nenhum; um saldo único na sidebar | valor em cada card, com decaimento literal (`100 pts today · 99 tomorrow`) |
| Decaimento | não existe | −1/dia a partir da data de disponibilidade, piso em 50% |
| Largura da sidebar | mais larga, linhas mais altas | 224px, linha de 29px |

**A medida nova.** O primeiro card termina em **y=241** em 1366x768 (com a chrome
do navegador descontada, contra os ~640px úteis da ADR 0008). Os três terminam em
**y=573**: o Dashboard inteiro cabe sem rolagem (`scrollHeight` = 768).

Em 390x844: sem overflow horizontal (`scrollWidth` 380), navegação inferior com
alvos de 44px, os cinco campos de metadado quebrando em duas linhas — que é a
linha `quest-metadata` da tabela de Presence do portal. Console limpo.

**Os quatro julgamentos que nenhum teste faz**, com veredito:

1. **O passo de metadado lê como metadado?** Sim. 11px contra os 14 do corpo, em
   caixa baixa; o nome do Quest é sem dúvida a maior coisa do card (referência:
   Linear).
2. **A sidebar lê como densa ou como apertada?** Densa. Linha de 29px e 224px de
   largura, com os grupos comprando a densidade — abaixo do teto do Salesforce,
   não acima.
3. **Os placeholders leem como honestos ou como quebrados?** Honestos: são a
   folha do próprio sistema, com uma frase verdadeira sobre o que vai morar ali e
   uma saída. Nenhum "em breve", nenhuma ilustração inventada.
4. **O decaimento lê como razão para agir hoje ou como ameaça?** Como razão — o
   par `100 pts today · 99 tomorrow` é uma comparação, não uma contagem
   regressiva, e o que já foi perdido nunca aparece. **É o julgamento que mais
   precisa de estudante na frente**: é o único componente do portal sem
   precedente no catálogo de referência (36 telas pesquisadas).

**Achados que este ciclo não corrige**, escritos aqui em vez de deixados:

- Não há passagem do gate para o portal. `/done` não leva a `/portal` porque
  qualquer mudança no gate estava fora de escopo; hoje se chega pelo endereço.
- Na navegação inferior, a Area corrente não rola sozinha para dentro do campo de
  visão quando está fora dele (ex.: `Appointments`). Compact é desenhado e
  correto, não polido — ADR 0008.
- `See how` está desabilitado, no tamanho final. Quando a gaveta chegar, nada se
  move; até lá é um botão que não faz nada, e isso foi escolhido de propósito.

---

## Antes de tudo — a fundação (`/style-guide`)

- [ ] As quatro superfícies aparecem desenhadas: Ground, Panel, Well, cartão
      plano. Dá pra distinguir cada uma de sua vizinha **sem** ler o rótulo.
- [ ] Nenhuma delas usa sombra para se distinguir: sombra só em modal, popover e
      barra fixa.
- [ ] As três exceções da Ground estão desenhadas e nomeadas: rótulo de seção,
      catálogo, assimetria do checkout.
- [ ] Os cinco arquétipos estão listados com sua regra.
- [ ] Seleção: clicar entre as três opções não muda **nenhum** tamanho nem
      posição. Só preenchimento e check.
- [ ] Ring glow em violeta e em mint. Nenhum elemento cresce ao receber ênfase.
- [ ] Row hover: o texto desliza 2px, a linha **não** sobe.
- [ ] Escala de movimento: quatro durações e quatro curvas, nomeadas.
- [ ] Price pill em três tamanhos, e o de voo tem ao menos 56px de altura.
- [ ] Visualizador de imagens: abre de qualquer miniatura, `←`/`→` navegam, a
      tira de miniaturas salta, `Esc` fecha, e a página atrás **não se mexe**.

## A casca, em qualquer passo

- [ ] O rail mostra **nove Quests**, para todo estudante — citizen, permanent
      resident ou international. Não existe mais rail de nove contra dez.
- [ ] A linha do rail passa pelo **centro** dos marcadores de grupo, nos cinco
      grupos, e cada Quest carrega uma marca **sobre** a linha: ponto vazado
      quando não começou, ponto cheio no atual, check quando pronto.
- [ ] O check está na linha, não solto à direita. Nenhuma marca nova foi
      acrescentada à tela.
- [ ] A linha é um segmento por grupo. Closing e After continuam visivelmente
      apartados das três Fases.
- [ ] O brasão no topo do rail lê como **armas de universidade**, não como ícone
      de app, e o dourado dele não aparece em nenhum outro lugar da tela.
- [ ] Exatamente **uma** régua de gradiente por tela, no topo da folha de
      trabalho, e nenhuma no guia. Housing e Campus life não têm folha e portanto
      não têm régua.
- [ ] Nenhum bloco guarda espaço em branco depois que o conteúdo acabou. Folha
      curta mostra Ground embaixo, e isso é o estado normal de uma página.
- [ ] Nenhum parágrafo dentro de uma Section passa de 75 caracteres por linha.
- [ ] Minutos aparecem na linha do Quest e **somem** quando a linha fica pronta.
- [ ] O preço em Points aparece em exatamente duas linhas: a atual e a próxima.
- [ ] O Balance está no mesmo pixel em **todas** as telas do fluxo.
- [ ] Chegar num mesmo passo por Continue e depois pelo link de edição do Review:
      o `h1` cai no mesmo pixel nas duas vezes.
- [ ] A barra de ação tem a mesma altura em todos os passos, e nenhum botão
      primário muda de largura ao mudar de rótulo.
- [ ] Total de tempo e de Points anunciado **uma vez** — nunca repetido por tela.

## O prêmio (qualquer Quest concluído)

- [ ] Sete beats acontecem: badge → headline → a pílula fica sólida → **300ms em
      que nada se mexe** → voo em arco → o Balance escala e o número rola → a
      linha de crédito faz cross-fade.
- [ ] A pílula que voa é **a mesma** que mostrava o preço no cabeçalho, e ela
      parte de onde estava.
- [ ] Continue está clicável a partir do terceiro beat.
- [ ] Nada na página se move durante o voo.
- [ ] Com `prefers-reduced-motion`: sem voo, e o Balance ainda termina no número
      certo.

---

## 1 · Your offer — `/onboarding/offer`

- [ ] Em 1440×900 o espaço morto abaixo do conteúdo está **abaixo de 80px**.
      Media com a régua do DevTools. Era 452px.
- [ ] Decide sem rolar a página em 1440, 1280 **e** 390.
- [ ] As duas colunas terminam na mesma altura em todas as larguras.
- [ ] Os fatos são linhas `rótulo → valor`, nunca uma grade de cinco células.
- [ ] "What accepting does" está **nesta** tela e **não** na celebração.
- [ ] Em 390px: a arte encolhe mas não some, a descrição do curso some, restam
      três linhas de fatos, e "what accepting does" **não** aparece.
- [ ] Decline é um clique para abrir a confirmação, e a confirmação é uma só.
- [ ] Nada nesta tela levanta, cresce ou reflui no hover.

### O aceite

- [ ] A celebração ocupa a tela inteira e o herói é **um objeto** (o cartão 4:5),
      não um título.
- [ ] Compartilhar dá Points pelo mesmo mecanismo, com a pílula de preço visível
      no botão antes.
- [ ] A palavra "optional" não aparece em lugar nenhum do convite a compartilhar.

## 2 · Who you are — `/onboarding/who-you-are`

- [ ] Student status é respondido **antes** de qualquer documento ser pedido.
- [ ] Trocar entre os três status muda o documento pedido nos dois sentidos, e o
      título **não se mexe** ao trocar.
- [ ] O upload nasce imediatamente abaixo do radio que o revelou.
- [ ] O telefone é uma linha só, e nenhum campo pede `+`.
- [ ] Cada radio carrega sua consequência na própria etiqueta.
- [ ] Um arquivo anexado **sai** da dropzone e vira linha na lista.
- [ ] Respondendo "International student", as Sections **4 · Your permanent
      address** e **5 · Residency check** somem. Não ficam cinzas, não ficam
      desabilitadas: somem (ADR 0011).
- [ ] Voltando para citizen, elas reaparecem com o que já tinha sido digitado.
- [ ] Continue nunca é bloqueado por um campo que não está na tela.
- [ ] State e city são selects em cascata, e a lista de cidades corresponde ao
      estado. Trocar o estado limpa a cidade.
- [ ] `/onboarding/where-you-live` redireciona para cá, não dá 404.
- [ ] O marcador da primeira Section incompleta é o gradiente; as posteriores
      são cinzas; as concluídas são mint com um check.

## 3 · Health information — `/onboarding/health`

- [ ] Vem imediatamente depois de Who you are no rail.
- [ ] A pergunta diz por que é feita, uma vez.
- [ ] Os uploads nascem abaixo do controle; nada acima se mexe.
- [ ] O Immunization record aparece **independente** da resposta sobre
      acomodação.
- [ ] Skip existe na barra, e o texto diz o que pular significa depois.
- [ ] Marcado como Optional no rail e no Review & sign.
- [ ] Cabe numa viewport em 1440 nos dois estados. Este passo tinha 443px de
      chão morto.

## 4 · Who we call, who can see — `/onboarding/who-we-call`

- [ ] A explicação de FERPA aparece **antes** dos campos.
- [ ] A frase sobre a transferência do direito aos 18 anos está **sempre
      visível**, nunca atrás do disclosure.
- [ ] A explicação está na Ground da Section, nunca dentro de um Well.
- [ ] O parágrafo quebra em **até 68 caracteres por linha**, não em 89.
- [ ] O link "What this means in practice" está **em linha própria**, nunca
      colado no fim do parágrafo.
- [ ] O disclosure abre como lista, não como um segundo parágrafo.
- [ ] Sem ninguém com acesso: empty state **desenhado** dentro de um Well, com
      uma frase verdadeira e exatamente uma ação. A ação não aparece duas vezes.
- [ ] `Add a second` some quando já existem dois contatos de emergência.
- [ ] O segundo contato diz "(optional)" no próprio cabeçalho.
- [ ] Family access captura nome, e-mail, parentesco **e** escopo.
- [ ] Cada opção de escopo diz o que a pessoa vai e não vai ver.
- [ ] Dá pra adicionar mais de uma pessoa e remover cada uma.
- [ ] Health e Disciplinary record nunca vêm pré-marcados.
- [ ] A folha termina onde o conteúdo termina, e o Ground abaixo dela é aceito.

## 5 · Housing — `/onboarding/housing`

- [ ] Toda fotografia abre o visualizador com um clique.
- [ ] A fila de atalhos por ambiente abre a galeria na seção certa.
- [ ] Contadores de foto são pílulas textuais, não dots.
- [ ] "Off campus" não existe em lugar nenhum.
- [ ] A linha do meal plan está na tela, e as tarifas dizem "room only".
- [ ] Shortlist são três, ranqueadas, reordenáveis, com a frase
      "request, not an assignment" visível.
- [ ] Ranquear ou remover uma Residence **não** muda o tamanho nem a posição do
      card.
- [ ] A comparação tem a coluna de rótulos congelada e linhas agrupadas.
- [ ] O catálogo senta na Ground, não dentro de um painel branco.

## 6 · Campus life — `/onboarding/campus-life`

- [ ] Nenhum controle diz Join, Sign up, Apply ou Enroll.
- [ ] O toggle de interesse é neutro e tem a **mesma largura** nos dois estados;
      o card nunca muda de altura.
- [ ] Os quatro eixos filtram, combinam e limpam, e a contagem atualiza junto.
- [ ] "Getting in" aparece no card, não só no detalhe.
- [ ] O detalhe traz custo, tempo e como entrar em três colunas rotuladas.
- [ ] Em 390px cada pílula abre uma folha de **um eixo só**, e a barra de pílulas
      nunca quebra em duas alturas.
- [ ] Estado zero: a barra e a contagem continuam, os chips culpados ficam na
      tela, e há um Clear all.
- [ ] A área de resultados reserva altura mínima: a barra de filtro **não sobe**
      quando o estado vazio aparece.
- [ ] O passo é opcional e pulável pela barra.

### Your fair route

- [ ] As paradas estão agrupadas por zona da feira, não pela ordem em que foram
      marcadas.
- [ ] O resumo conta organizações, zonas e minutos.
- [ ] Cada parada mostra número da mesa e a linha de "Getting in".
- [ ] Remover uma parada é inline e imediato.
- [ ] A data e o lugar da feira aparecem uma vez, no topo.
- [ ] Nada na tela envia, confirma ou inscreve.
- [ ] Funciona em 390px sem rolagem horizontal.

## 7 · Review & sign — `/onboarding/review`

- [ ] A tela abre num cabeçalho de status, não num documento.
- [ ] "Your answers" está **acima** do acordo.
- [ ] A linha de completude conta respostas e o que precisa de atenção.
- [ ] Um Edit por seção, no cabeçalho da seção.
- [ ] Uma seção fechada mostra um resumo de uma linha.
- [ ] Respostas de texto longo ganham bloco de largura cheia.
- [ ] A figura de Points **não** está junto das respostas.
- [ ] Tempo e obrigatório/opcional aparecem por seção.
- [ ] A divulgação de registros eletrônicos está acima da assinatura.
- [ ] O documento rola **dentro do próprio painel**, e o gate de leitura destrava
      ao chegar no fim desse painel.
- [ ] `?from=review` volta ao lugar certo a partir de cada Step, e a volta ocupa
      o lugar do Back na barra.
- [ ] Editar uma resposta depois de assinar reabre a assinatura.

## 8 · Deposit — `/onboarding/deposit`

- [ ] Uma entrada de rail, três telas dentro dela.
- [ ] O resumo fica fixo ao lado e nunca sai da tela, terminando numa linha
      **Due today** em negrito, separada do subtotal.
- [ ] "Credited against your first term's tuition" está na tela.
- [ ] Os três caminhos — pay now, pay by deadline, waiver — chegam a um recibo.
- [ ] O waiver troca Due today para `$0, pending review` e colapsa o resto, sem
      sair do checkout.
- [ ] Transferência bancária aparece como **processing**, não como paga.
- [ ] O botão primário carrega o valor.
- [ ] **Não existe** em nenhuma das três telas: contagem regressiva, urgência,
      vocabulário de carrinho, upsell, campo de cupom, logo de BNPL, opt-in de
      marketing, confete.
- [ ] Em 390px empilha, com o valor junto do botão.

## 9 · Enrolled — `/done`

- [ ] O recibo do depósito mora aqui; não existe tela de recibo separada.
- [ ] O herói é um objeto que chega, não um título.
- [ ] O cartão traz nome, enrolment ID, Residence e ano de entrada.
- [ ] As Fases aparecem com checks e seus Points, somando no Balance.
- [ ] O Balance aparece em tamanho cheio com sua conversão.
- [ ] A ação primária **gasta** o crédito; Done é secundário.
- [ ] O cartão compartilhável é 4:5 com quatro métricas sobre gradiente.
- [ ] O confete dura menos de um segundo e fica **atrás** do cartão.
- [ ] O Well do recibo vem colapsado, então a tela não força uma rolagem longa.
- [ ] Com `prefers-reduced-motion`: o cartão está presente e completo, sem o
      flip, e nada falta.

---

## Passada final em 390px

- [ ] Percorrer os nove Steps de ponta a ponta.
- [ ] Nenhuma rolagem horizontal em nenhuma tela.
- [ ] Nenhum alvo de toque abaixo de 44px.
- [ ] Nenhum passo com o `h1` num pixel diferente de quando se chega por outro
      caminho.
