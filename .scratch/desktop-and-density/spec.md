Status: ready-for-agent

# O desktop construído, a densidade Salesforce, e o confete de volta

Escrito da sessão de grilling de 2026-08-15 (tarde). Vinte e cinco perguntas em
quatro rodadas, todas respondidas pelo cliente; toda decisão abaixo é dele. As
três decisões duras viraram ADRs 0008, 0009 e 0010. O vocabulário e as réguas
estão em `docs/design-research.md`; cada um dos nove tickets carrega suas
próprias referências Mobbin, por `docs/agents/design-references.md`.

## Problem Statement

O aluno abre o onboarding num computador e recebe a tela do telefone esticada.
Abre no telefone e vê a tela tremer entre passos, blocos se sobreporem, conteúdo
cortado na borda. E em qualquer um dos dois, vê pouca informação ocupando muito
espaço — pela terceira rodada seguida.

Nas palavras do cliente:

- **O desktop não foi construído, foi alargado.** Existe a árvore mobile com
  breakpoints por cima. Pior: foi composta contra Full HD, quando a máquina real
  é HD — em 1366×768 sobram ~640px de altura útil, e telas apareceram cortadas.
- **O mobile está inconsistente**: flick, DOM errado, sobreposição errada.
- **Densidade.** "Tudo grande", de novo. Com a referência que faltava:
  **Salesforce** — e não só a densidade, o que mais há de bom lá.
- **A animação está travada e rápida demais** para ser vista. E não conduz: o
  produto tem que orientar o aluno, não só reagir a ele.
- **Sumiu o entusiasmo.** O confete foi removido na rodada passada e o cliente o
  quer de volta em todo momento de ganho.

Debaixo de tudo, o mesmo diagnóstico das rodadas anteriores: cada correção
herdou a estrutura da anterior e redecorou. Desta vez a estrutura errada tem nome
— é a suposição de que desktop é mobile com mais largura.

## Solution

Uma árvore de DOM, recomposta por CSS. Três classes de largura, com **1366×768
como viewport de projeto** e Full HD apenas alargando. Container query manda
dentro da coluna do Step; media query manda só no shell. Onde uma peça
genuinamente difere entre larguras, ela está declarada na tabela de **Presence** —
oito linhas, fechada, testada.

A superfície muda: **Panel morre, Section nasce**, e uma Section colapsada mostra
o valor que ela guarda em vez do título sozinho. É isso que faz um Step caber em
640px sem apagar campo nenhum.

O `decision` para de ser uma viewport exata. A tipografia densifica nas duas
larguras, com alvo de toque protegido no telefone. A animação desacelera, para de
tocar propriedades que forçam layout, e passa a conduzir: um beat de entrada por
Step, foco no primeiro campo, e o botão primário narrando o que falta.

E o confete volta — nos doze momentos em que se ganha, se aceita ou se termina,
em três tamanhos, numa camada única que também é dona do voo de Points.

## User Stories

**Onde eu estou, e o que este produto é**

1. Como aluno recém-admitido num notebook HD, quero que o onboarding use a tela
   que eu tenho, para que eu não role uma coluna estreita cercada de branco.
2. Como aluno num monitor grande, quero que a tela cresça sem se redesenhar, para
   que eu não aprenda um layout diferente ao mudar de máquina.
3. Como aluno no desktop, quero uma trilha permanente à esquerda com as três
   Phases e seus Steps, para que eu veja quanto falta sem abrir nada.
4. Como aluno no desktop, quero que a trilha marque com check o que já terminei,
   para que meu progresso seja um fato visível e não uma lembrança.
5. Como aluno no telefone, quero a mesma informação numa barra segmentada no
   topo, para que eu não perca a noção de onde estou por causa do tamanho da tela.
6. Como aluno, quero que a trilha nunca mude de largura entre Steps, para que a
   página não escorregue lateralmente quando eu avanço.
7. Como aluno, quero meu nome e a marca da instituição no topo da trilha, para
   que a tela pareça minha e não um formulário genérico.
8. Como aluno, quero meu Balance sempre visível no pé da trilha, junto com o que
   ele vira, para que eu saiba o que estou acumulando enquanto trabalho.

**Densidade: ver mais sem perder nada**

9. Como aluno, quero ver todos os campos de um Step sem rolar no desktop, para
   que eu saiba o tamanho do que estou prestes a fazer antes de começar.
10. Como aluno, quero que o que não couber vire seção recolhida e não campo
    removido, para que a densidade não custe informação.
11. Como aluno, quero que uma seção recolhida mostre o que eu já respondi, para
    que recolher revele progresso em vez de esconder trabalho.
12. Como aluno, quero rótulos e valores em duas colunas no computador, para que a
    tela use a largura que tem em vez de empilhar tudo numa fita estreita.
13. Como aluno, quero uma coluna só no telefone, para que eu não leia duas
    colunas de 8px de largura.
14. Como aluno no telefone, quero que botões e alvos continuem grandes o
    suficiente para o dedo, mesmo com o texto menor, para que densidade não vire
    erro de preenchimento.
15. Como aluno, quero no máximo três superfícies empilhadas por tela, para que a
    página tenha hierarquia em vez de camadas.
16. Como cliente revisando a entrega, quero que a densidade seja conferível em
    duas viewports declaradas, para que "está grande" deixe de ser uma discussão
    de gosto.
17. Como cliente, quero que toda melhoria de densidade tenha apagado algo, para
    que ninguém me entregue o mesmo conteúdo encolhido e chame de progresso.

**Imobilidade: a tela para de tremer**

18. Como aluno, quero que o mesmo Step apareça no mesmo lugar não importa como eu
    cheguei nele, para que voltar do resumo não pareça outra tela.
19. Como aluno, quero que nada nasça acima do título, para que a tela não desça
    enquanto eu leio.
20. Como aluno, quero que o botão principal não mude de largura conforme o que eu
    preencho, para que a única peça fixa da tela seja de fato fixa.
21. Como aluno, quero que um campo revelado apareça logo abaixo do controle que o
    revelou, para que a resposta que dei não empurre a pergunta para fora da vista.
22. Como aluno, quero que nada seja cortado na borda em nenhum tamanho de tela,
    para que eu não perca a parte que explica o que estou aceitando.
23. Como aluno, quero que abrir um filtro ou um seletor não empurre a lista
    embaixo dele, para que o item que eu estava mirando continue onde estava.
24. Como aluno, quero que a barra de rolagem não mude a largura da página entre
    Steps, para que a navegação não pisque lateralmente.
25. Como aluno, quero que nenhuma sobreposição fique atrás do que deveria cobrir,
    para que um diálogo seja um diálogo.

**A oferta e a decisão**

26. Como aluno, quero ver a decisão e as duas ações sem rolar, para que eu saiba
    imediatamente o que está sendo pedido.
27. Como aluno, quero poder rolar para ler a descrição do programa e o que aceitar
    significa, para que eu não assine sem o contexto que foi cortado antes.
28. Como aluno, quero que aceitar seja um segundo momento explícito com o termo à
    vista, para que eu não aceite no mesmo clique com que li.
29. Como aluno, quero uma comemoração no instante em que aceito, na própria tela,
    para que o momento tenha peso sem me tirar do fluxo.

**About you**

30. Como aluno, quero que cada Step de dados pessoais trate de um assunto só, para
    que eu não responda meu nome duas vezes em telas diferentes.
31. Como aluno internacional, quero não ver campos de endereço americano, para que
    o formulário não me peça algo que eu não tenho.
32. Como aluno, quero que meu Student status decida qual documento me é pedido,
    para que eu não escolha entre opções que não se aplicam a mim.
33. Como aluno, quero saber quantos campos faltam antes de continuar, para que eu
    decida se termino agora ou depois.
34. Como aluno, quero que o botão de continuar apareça desabilitado em vez de
    sumir, para que eu veja o caminho antes de poder tomá-lo.
35. Como aluno, quero foco automático no primeiro campo ao entrar num Step, para
    que eu comece a digitar sem procurar onde.

**Health, família e acesso**

36. Como aluno, quero declarar necessidade de Accommodation de forma opcional
    aqui, para que eu saiba que a exigência real vem depois no portal.
37. Como aluno, quero enviar Immunization record junto do resto de saúde, para que
    eu não procure upload em duas telas.
38. Como Eligible student, quero conceder Family access escolhendo o escopo, para
    que quem me acompanha veja o que eu decidi e não tudo.

**Housing**

39. Como aluno, quero ver as fotos de uma Residence organizadas por ambiente, para
    que eu compare quarto com quarto e não com a fachada.
40. Como aluno no desktop, quero abrir as fotos ampliadas sem sair da ficha, para
    que eu não perca meu lugar na lista.
41. Como aluno no telefone, quero as fotos num carrossel embutido, para que eu não
    abra tela cheia sobre algo que já é tela cheia.
42. Como aluno, quero os fatos da Residence em linhas de rótulo e valor, para que
    eu compare duas moradias sem caçar o mesmo dado em posições diferentes.
43. Como aluno, quero ranquear três Residences das oito, para que eu declare
    preferência sabendo que quem designa é o escritório de moradia.
44. Como aluno que já mora na cidade, quero uma saída discreta para arranjar minha
    própria moradia, para que o fluxo não me obrigue a escolher um campus.

**Campus life**

45. Como aluno, quero filtrar centenas de Organizations por categoria com chips
    acima da grade, para que eu não perca metade da tela com uma coluna de filtro.
46. Como aluno, quero buscar por texto, para que eu ache o clube que eu já sei que
    existe sem varrer categorias.
47. Como aluno, quero ver mais Organizations por tela, para que varrer o catálogo
    seja varrer e não paginar.
48. Como aluno, quero que marcar interesse seja curiosidade e não matrícula, para
    que eu marque sem medo de estar me comprometendo.
49. Como aluno, quero sair com uma rota pela Involvement Fair, para que a lista
    vire um plano para a primeira semana.

**Review & sign**

50. Como aluno, quero ver minhas respostas e o documento ao mesmo tempo no
    desktop, para que eu confira o que assino contra o que respondi.
51. Como aluno, quero que a assinatura esteja visível sem rolar até o fim, para
    que eu não precise de um aviso me mandando rolar.
52. Como aluno, quero editar um campo específico direto do resumo, para que eu
    corrija o dado errado e não a seção inteira.
53. Como aluno, quero voltar ao resumo depois de editar sem que a tela se desloque,
    para que a ida e volta não desoriente.
54. Como aluno, quero saber o que é o documento antes de olhar para ele, para que
    eu não encare um texto legal sem rótulo.

**Deposit e Enrolled**

55. Como aluno, quero ver o resumo do que estou pagando junto das formas de
    pagamento, para que eu não role entre o valor e o método.
56. Como aluno, quero que escolher um método expanda ali mesmo, sem empurrar o
    resto, para que a página não salte enquanto eu decido.
57. Como aluno sem condições de pagar agora, quero que pagar até o prazo e pedir
    isenção sejam saídas igualmente visíveis, para que nenhuma delas pareça
    desistência.
58. Como aluno, quero terminar recebendo um objeto — meu cartão — e não uma
    mensagem, para que eu tenha o que guardar.
59. Como aluno, quero que o fim do fluxo comemore de verdade, para que a última
    impressão seja de conquista.
60. Como aluno, quero duas ações concretas depois do fim, para que eu saiba o que
    fazer agora.

**Points e confete**

61. Como aluno, quero ver os Points de uma Quest antes de fazê-la e como recibo
    depois, para que o mesmo número seja preço e comprovante.
62. Como aluno, quero uma comemoração a cada Quest concluída, para que cada passo
    tenha um fecho.
63. Como aluno, quero que a comemoração do fim seja maior que a de cada Quest,
    para que o fim ainda signifique alguma coisa depois de dez celebrações.
64. Como aluno, quero que o confete caia atrás do número ganho e não sobre ele,
    para que eu leia quanto ganhei.
65. Como aluno, quero que a comemoração não me impeça de clicar em nada, para que
    a festa não segure o produto.
66. Como aluno com sensibilidade a movimento, quero que o sistema respeite minha
    configuração de reduzir animações, para que eu conclua a matrícula sem passar
    mal.

**Motion e condução**

67. Como aluno, quero que as animações durem tempo suficiente para eu vê-las, para
    que elas me digam o que mudou em vez de piscar.
68. Como aluno, quero que a animação não engasgue, para que ela não pareça um bug.
69. Como aluno, quero que a entrada de cada Step leve meu olho ao começo do
    trabalho, para que eu não procure por onde iniciar.
70. Como aluno, quero que nada mais se mexa enquanto o Step entra, para que a
    orientação seja um gesto e não uma agitação.

**Quem constrói**

71. Como desenvolvedor, quero que a Presence seja um dado em código e não uma nota
    em markdown, para que "existe só no desktop" seja verificável.
72. Como desenvolvedor, quero que renderizar por largura em JS seja impossível de
    passar despercebido, para que a causa raiz do flick não volte na próxima
    rodada.
73. Como desenvolvedor, quero que breakpoints fora das três classes quebrem o
    build, para que a quarta classe não nasça por acidente.
74. Como desenvolvedor, quero que animar propriedades de layout quebre o teste,
    para que o travamento não volte por descuido.
75. Como cliente, quero que as duas réguas que o CI não consegue medir estejam
    escritas como aceite meu, para que ninguém me diga que acabou sem eu ter
    olhado.

## Implementation Decisions

**Classes de largura e autoridade** (ADR 0008). Três: `compact` (<768), `medium`
(768–1279), `desktop` (≥1280). 1280 e não 1366, para a máquina HD real cair
dentro da classe e não na fronteira. Acima de 1280 nada recompõe; monitores
maiores só destravam as medidas de arquétipo. **Container query manda dentro da
coluna do Step; media query manda só no shell.** Renderização condicional por
largura em JS é proibida — é a causa mecânica do flick e do "DOM errado".

**Presence como módulo, não como prosa.** Um módulo de domínio de layout declara
as oito peças que diferem entre larguras e o que cada uma é em cada classe. Os
componentes leem dele; o teste conta as linhas. Sem isso, "exatamente oito" não é
afirmável e a tabela vira decoração. É a única mudança de produção que a costura
de teste impõe, e é deliberada.

**A superfície** (ADR 0010). `Panel` sai do código e do vocabulário. `Section`:
cabeçalho com rótulo e chevron, régua, sem sombra; colapsada, mostra o valor que
guarda. `Well`, `Ground` e o cartão plano sobrevivem sem mudança. Sombra segue
reservada ao que flutua: modal, popover, e agora o pill de ação. O acordeão usa
`grid-template-rows` ou clip, **nunca `height`**.

**O arquétipo `decision`** (ADR 0009). Sai `overflow-hidden`. A invariante vira:
a decisão e suas ações aparecem sem rolar; o material de apoio pode ficar abaixo.
A composição em duas colunas e a medida de 82rem ficam.

**A escala densa.** Corpo 13px/1.45, small 12px, `h1` de Step 24px, cabeçalho de
Section 15px, 16px entre Sections. Vale nas duas larguras, com **uma exceção
declarada**: altura de controle interativo não desce abaixo de 44px em `compact`.
O `h1` de 24px é o número mais arriscado e o mais barato de reverter — é ele que
volta se o gate reprovar.

**Shell.** Rail de 14rem no desktop, largura constante, que nunca colapsa: topo
com wordmark e nome do aluno, meio com as três Phases e seus Steps e checks, pé
com o Balance e sua conversão. PhaseBar segmentada no mobile, com o Balance
comprimido dentro. O pill flutuante substitui a barra fixa no desktop e absorve o
estado de autosave; no mobile a barra fixa fica.

**Camada de celebração.** Uma só, montada no shell, dona do voo de Points e do
confete: `fixed`, `pointer-events: none`, um `<canvas>` criado uma vez e
reaproveitado. `canvas-confetti` cria um canvas por chamada se deixarem, e doze
desses é a segunda suspeita para o travamento. Com `prefers-reduced-motion`, o
confete não cai.

**Confete: doze momentos, três tamanhos.** Quest concluída (×10): jorro curto
ancorado no Balance, ~40 partículas, ~1,2s, atrás do chip de Points. Aceitar:
jorro de tela cheia, ~150 partículas, sobre a própria tela da oferta. Enrolled:
chuva sustentada de ~3s com o cartão no centro, sobre palco escuro — a única tela
do flow que troca de fundo, de propósito, porque a régua de densidade vale para
telas de trabalho e essa não é uma.

**Motion.** 240 / 400 / 640 / 1000ms, substituindo 120/220/360/560. Só
`transform` e `opacity` em regra de animação. Voo de Points de ~2,6s para ~3,4s,
com a parada do meio subindo de 300ms para 500ms. Condução é um beat de entrada
por Step (título e primeira Section, 400ms, 60ms de defasagem), foco automático no
primeiro campo, e o botão primário narrando o que falta. **Sem tour de coach
marks** — reservado pelo cliente para a entrada na plataforma.

**O domínio não muda.** `CONTEXT.md` não é tocado. Phase, Step, Quest, Points,
Balance, Shortlist, Interest list continuam significando o que significavam;
`steps.ts` mantém a espinha de dez Steps e a lógica condicional por Student
status.

## Testing Decisions

**O que faz um bom teste aqui.** O repo não tem ambiente de DOM, e por decisão do
ADR 0006 os testes de layout afirmam **invariantes de fonte** em vez de medir uma
página renderizada: uma escotilha que não existe não pode ser usada errado por um
Step futuro, o que é garantia mais forte que pegar o erro depois. Nenhum teste
afirma aparência; todos afirmam que o meio de errar foi removido.

**A costura: uma, e já existe.** `src/lib/layout-rules.test.ts` lê os fontes do
disco e afirma o ruler. Ela é **reescrita, não estendida** — o precedente é o
próprio ADR 0006, e a razão é a mesma: um teste e uma régua que discordam são
piores que qualquer um dos dois sozinho. As invariantes afirmadas passam a ser:

1. As quatro de drift que já existem (título ancorado, nada acima do título,
   barra de altura constante declarada uma vez, botão primário com piso de
   largura).
2. A tabela de Presence com exatamente oito entradas.
3. Nenhum breakpoint fora das três classes, em nenhum `.tsx`.
4. Nenhuma regra de animação tocando `height`, `top`, `width` ou `left`.
5. A camada de celebração sendo uma, `fixed` e não interativa — a evolução da
   asserção que hoje mira `points-award.tsx`.

**Costuras existentes que este épico não toca**, e que continuam sendo a prova de
que o domínio sobreviveu: `steps.test.ts` (a espinha e a navegação por Student
status), `points.test.ts`, `validation.test.ts`, `summary.test.ts`,
`catalogue.test.ts`. Se alguma delas quebrar, a mudança foi longe demais.

**O que deliberadamente não vira teste**: conteúdo por dobra e o teto de três
superfícies. Medir dobra sem DOM é fingir que o teste sabe a altura de uma fonte,
e um teste que mente é pior que nenhum. Os dois são **aceite humano** em 1366×768
e 390×844 — o cliente sabe disso e concordou explicitamente. É o único ponto do
épico onde "pronto" não é uma saída do CI.

## Out of Scope

- **Tour de coach marks.** Rejeitado para o onboarding — é um onboarding do
  onboarding, e ancorar tooltip em elemento reintroduz medir-para-posicionar, que
  é a causa raiz de metade dos flicks. O cliente reservou o tour para a entrada na
  plataforma.
- **O Path em chevrons do Salesforce.** Custa altura, que é o recurso escasso no
  HD, e mostra três Phases onde o Rail mostra dez Steps.
- **A identidade visual do Salesforce**: o azul, o chrome de tabs, os ícones
  Lightning. Pegamos densidade e arquitetura, não a cara.
- **Edição inline com lápis.** Num onboarding o campo já é editável; o lápis seria
  decoração.
- **Um inventário de defeitos por dispositivo.** Cortado pelo cliente: "não
  precisa analisar um por um, é só achar o problema e corrigir". A varredura caça
  causas, não telas.
- **Filtro em Housing.** Oito Residences não precisam de controle.
- **Preço na ficha da Residence.** Continua fora, pelo ADR 0003.
- **Mudanças no domínio.** Nenhum termo de `CONTEXT.md` entra, sai ou muda.
- **Uma quarta classe de largura para Full HD ou maior.**

## Further Notes

**A entrega é expand–contract com um tracer bullet no meio, e tem gate.** Dez
tickets:

| # | Ticket | Bloqueado por |
|---|---|---|
| 01 | Expand: o sistema novo nasce ao lado do antigo | — |
| 02 | **Tracer bullet**: _Who you are_ ponta a ponta — **é o gate** | 01 |
| 03 | Os outros três Steps de _About you_ | 02 |
| 04 | _Your offer_ | 02 |
| 05 | _Housing_ | 02 |
| 06 | _Campus life_ | 02 |
| 07 | _Review & sign_ | 02 |
| 08 | _Deposit_ e _Enrolled_ | 02 |
| 09 | Contract: apagar `Panel`, reescrever a régua | 03–08 |
| 10 | A varredura e o aceite humano | 09 |

Só o rename `Panel → Section` é wide refactor, e por isso vai por
expand–contract: o novo nasce ao lado do velho (01), as telas migram em lotes
(02–08), o velho morre quando não sobra chamador (09). A escala tipográfica
**não** é wide refactor — é uma declaração única sem call sites, e vira de uma
vez no 01; fazer expand–contract nela deixaria o app com duas tipografias durante
o épico inteiro.

O gate humano é depois do **02**, e não depois de uma casca vazia: o cliente vê um
Step inteiro funcionando nas duas larguras e julga a densidade no material real.
Se o `h1` de 24px for reprovado, ele volta antes de nove telas o herdarem. De 04 a
08 tudo pode correr em paralelo depois do gate.

**Duas reversões estão registradas, não apagadas.** O ADR 0009 revoga metade do
0006 e diz por quê. A linha "sem confete" no Enrolled, escrita na rodada passada
com o CRED como referência, está marcada como revertida em
`docs/design-research.md` com o motivo — o cliente pediu confete explicitamente. O
que sobrevive daquela linha é o eyebrow e a frase de pertencimento, não a ausência
de festa.

**As referências rejeitadas foram registradas junto com as aceitas**, com o
motivo de cada rejeição: Path em chevrons, filtro lateral do Zillow, ações no fim
do conteúdo do Etsy/Docusign, barra de progresso do Vanta, tour do Navattic/Deel.
Uma referência rejeitada sem motivo escrito volta em duas rodadas.

**O ticket 09 não tem referências Mobbin e não vai ter.** Ele não desenha nada;
inventar duas citações ali seria justificar depois do fato, que é o que o gate de
`docs/agents/design-references.md` existe para impedir.
