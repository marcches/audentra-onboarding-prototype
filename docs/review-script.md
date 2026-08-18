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

## O que o ciclo "a sala e a faixa" mediu

O pedido que abriu o ciclo foi da designer, no navegador: *"o dashboard está
muito chapado… dá pra deixar mais roxo e mais redondo?"* — a **segunda** vez que
este repositório é informado de que perdeu a identidade. A ADR 0015 diagnosticou
três defeitos sob uma palavra só, e os três foram medidos antes de qualquer coisa
ser desenhada.

| Defeito | Antes | Depois |
|---|---|---|
| Passos da escala tipográfica | 9, com 6 dentro de 5px (11/12/13/14/15/16) | 7, em 11/13/15/18/24/32/44 |
| Corpo | 14/1.5 | 15/1.55 |
| Voz de display | `--font-display` = `--font-sans` (a mesma face) | grotesca de terminais arredondados, em token trocável numa linha |
| Pesos da face de interface | 1 acima do corpo (700) | 300–900 carregados, 650 nomeado |
| Valores de espaçamento | 5 entre 4px e 12px, com meios-passos; 1 token declarado | 5 declarados: 4 / 8 / 16 / 24 / 40, sem meio-passo |
| Meios-passos no código | 266 utilitários `x.5` | 0, e a régua falha o build no primeiro que voltar |
| Pesos de ícone simultâneos | 3 (`regular`, `bold`, `duotone`) | 2: `bold` significa, `fill` é estado |
| Rótulos em caixa alta | 27 | 0 na interface (restam 2 artefatos: o mote do brasão e a carteira impressa) |
| Elevação | proibida (ADR 0010) | 2 papéis: `contains` e `floats`, e nenhum deles reage ao mouse |
| Raio de contêiner | card 16, slab 20 | card 20, slab 28 — o campo continua em 10 |
| Violeta na superfície | 0 (racionado a sinal, 4 arquivos) | o chão inteiro do app, mais uma faixa por tela |
| Textura | 0 | 1, e só no chão (`body`) |

### A varredura em 1366x768

Loja limpa (`localStorage.clear()`), coluna útil de 668px pela ADR 0008.

| Tela | Coluna | `h1` em | Primeira unidade termina em |
|---|---|---|---|
| Your offer | 689 | y=28 | dentro da faixa |
| Who you are | 1323 | y=28 | dentro da faixa |
| Health information | 668 | y=28 | dentro da faixa |
| Who we call | 668 | y=28 | dentro da faixa |
| Housing | 867 | y=28 | dentro da faixa |
| Campus life | 1904 | y=28 | dentro da faixa |
| Review & sign | 1094 | y=28 | y=288 |
| Deposit | 668 | y=28 | dentro da faixa |
| Dashboard | — | y=32 | **y=276** (card líder) |
| Appointments | — | y=32 | y=368 |
| Uma Area não construída | — | y=32 | y=645 |

**A faixa contém a primeira unidade em todas as 12 telas**, e o custo dela é o
próprio respiro: a faixa do Dashboard termina em y=292 e o card líder, dentro
dela, em y=276. Um bloco de cor *antes* do primeiro card gastaria 140–180px dos
~640 úteis — foi por isso que o ciclo anterior recusou exatamente essa
composição.

**O `h1` cai no mesmo pixel** chegando por Continue e pelo link de edição do
Review, nas cinco telas testadas (y=28 nas duas). A diferença de `left` entre
315 e 288 é a medida do arquétipo, que é um fato do Step e não deriva da rota.

**Nada sobe, cresce ou engrossa**: passando o mouse por todos os cards e
controles do Dashboard, 0 de 3 caixas mudaram de posição ou tamanho.

**A textura aparece exatamente uma vez** — `BODY`, e mais nada no documento tem
`background-image` de textura. **Uma faixa por tela**, medido.

### A varredura em 390x844

Sem overflow horizontal em nenhuma das 14 rotas (`scrollWidth - innerWidth` = 0).
Nada cortado, nada sobreposto. Barra de ação em 64px constantes nos oito Steps,
sem transbordo interno. Console limpo no percurso inteiro.

Dois achados no compact, **corrigidos aqui**:

- "Saved automatically" quebrava em duas linhas dentro de uma barra de altura
  fixa a 15px de corpo, e transbordava o próprio móvel. Agora não quebra.
- O selo `Best next step` ficava órfão numa linha só, empurrado à direita por
  `ml-auto` num card de 390px. No compact ele acompanha os outros chips.

### Os julgamentos que nenhum teste faz, com veredito

1. **Ainda está chapado?** Não. A hierarquia agora existe em três eixos ao mesmo
   tempo — tamanho (44 contra 15, e sete passos entre eles), peso (300 a 900) e
   material (a faixa e o card líder elevados, tudo o mais plano). O que fechou a
   queixa não foi o violeta: foi a escala. Nove passos com seis dentro de cinco
   pixels é chapado no sentido mais literal disponível.
2. **Está mais roxo?** Sim, e sem custar nada à dobra. O violeta virou chão e
   faixa — material — enquanto continua sendo sinal em progresso e ação
   primária. Um estudante nunca precisa decidir se uma cor está dizendo algo
   sobre o progresso dele.
3. **Está mais redondo?** Sim, e em dois lugares. Contêineres subiram (card 20,
   slab 28) e os controles não se mexeram, que é a razão de a densidade do
   formulário ter sobrevivido. O terminal arredondado da segunda voz é a metade
   que o raio de canto não entrega.
4. **A gamificação lê como razão para voltar ou como decoração?** Como razão, com
   uma ressalva. Headroom ("457 pts ainda disponíveis hoje") e Streak ("2 dias
   seguidos") estão na linha da saudação e não custaram um pixel; a trilha de
   recompensa nomeia objetos em vez de números. A ressalva é que Streak é a única
   das três que **não responde ao que o estudante fez hoje** sem um fixture por
   trás — o protótipo não guarda carimbo de tempo, e isso está escrito em
   `portal.ts` em vez de escondido.

### O decaimento, julgado explicitamente

**Veredito: lê como urgência, não como pressão — e continua sendo a aposta não
validada deste ciclo.**

O que sustenta o veredito: o par aparece **num card por tela**, é uma comparação
(`100 pts · 99 tomorrow`) e não uma contagem regressiva, e o que já foi perdido
não é derivável do que o card recebe. Nos outros dois cards do Dashboard há
preço e não há decaimento, o que é a diferença entre "isto vale 66 pontos" e "a
lista inteira está fugindo de você".

O que **não** sustenta: nenhuma referência no catálogo. Trinta e seis telas
pesquisadas e nenhum produto que tenha tentado valor limitado no tempo encolhe a
recompensa — todos usam prazo ou contagem regressiva. Concentrar em um card por
tela é exatamente o que permite este julgamento; se um estudante ler como
punição, isso é conversa com o cliente e não bug para remendar em silêncio.

### A segunda voz

**Pendente de aprovação da designer.** O token está no ar como **Nunito**
(700/800/900), escolhido pela banda de referência da ADR 0015 — Preply e o
Feather da Duolingo, com o ClassDojo como guarda-corpo do lado infantil. Trocar
é uma linha: `--font-display-face` em `app.css`. Apontada para `var(--font-sans)`
o sistema inteiro cai para Satoshi em 300–900, e **nada mais no ciclo se mexe** —
o que já é melhoria real contra o único peso acima do corpo que existia.

### O que este ciclo não fecha, escrito aqui em vez de deixado

- **`Who you are` continua sem caber numa tela**: 1323px contra 668 úteis. Já não
  cabia (1175 antes), e o Prefill devolveu 141px sem encolher tipo nenhum — o
  endereço inteiro virou uma linha confirmada em vez de cinco campos. Fechar de
  vez custa apagar uma Section, que é o que a ADR 0010 prescreve e o que este
  ciclo escolheu não fazer sem a designer na frente.
- **`Your offer` passou a rolar 21px** (689 contra 668). É um arquétipo
  `decision`, e a ADR 0009 diz que uma decisão rola.
- **O Prefill é fixture.** A grammar está desenhada e testada contra valores
  fixos; o CRM é o próximo ciclo. Não há flag `prefilled` em lugar nenhum: um
  campo é Prefill enquanto o valor ainda é o da instituição.
- **A carteira de estudante e o mote do brasão continuam em caixa alta.** São
  artefatos — um cartão impresso e uma heráldica — e não rótulos de interface.
  Ficam, e ficam nomeados aqui.

---

## Antes de tudo — a fundação (`/style-guide`)

- [ ] As quatro superfícies aparecem desenhadas: Ground, Panel, Well, cartão
      plano. Dá pra distinguir cada uma de sua vizinha **sem** ler o rótulo.
- [ ] **Cada material faz um trabalho só** (ADR 0015): tinta agrupa, sombra
      contém, borda delimita um controle e nada mais, textura aparece uma vez e
      só no chão. Nenhuma unidade delimitada duas vezes.
- [ ] Sombra tem exatamente dois papéis desenhados — `contains` (a faixa, o card
      líder) e `floats` (modal, popover, a pílula de ação) — e **nenhum dos dois
      é reação ao mouse**.
- [ ] A sala e a faixa estão desenhadas: chão tingido com uma textura, faixa
      contendo a primeira unidade em vez de vir antes dela.
- [ ] Os sete passos de tipo, as duas vozes e os cinco passos de espaçamento
      estão numa tela só, e dá pra ver a distância entre cada passo.
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
- [ ] Exatamente **uma faixa** por tela, abrindo a tela e contendo a primeira
      unidade dela. A régua de gradiente no topo da folha de trabalho não existe
      mais: a ADR 0015 substitui a ADR 0012 inteira, e a marca virou propriedade
      da superfície em vez de exceção concedida a quatro arquivos.
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
