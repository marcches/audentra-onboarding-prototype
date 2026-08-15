# Pesquisa de referência e decisões por componente

O `spec.md` do repo de contexto (VEKEND) torna obrigatório avaliar **Mobbin**
(padrão de interação/estrutura) **e** **ReactBits** (execução/personalidade/movimento)
antes de decidir cada momento de UI — e exige que a escolha final entre
"shadcn simples" e "tratamento ReactBits" venha justificada, não como default por
falta de pesquisa. Este arquivo é esse registro.

Buscas feitas em 2026-08-10 via `mcp__mobbin__search_screens` (plataforma `web`) e
contra o catálogo do ReactBits.

> **Correção (rodada 2).** A versão anterior deste arquivo dizia "revisado o
> catálogo inteiro" tendo olhado ~6 dos ~165 componentes. Era falso. O
> inventário real, conferido em `api.github.com/repos/DavidHDev/react-bits/contents/src/content/<Categoria>`:
> **Backgrounds 53 · Components 44 · Animations 36 · TextAnimations 32 = 165.**
> A rejeição em bloco dos seis fundos WebGL também fica **revogada** — ver
> `docs/adr/0005-reactbits-adopt-by-default-fallback-not-rejection.md` no repo de
> contexto: num artefato descartável o custo de performance não rejeita
> componente; onde o custo é real (canvas, `prefers-reduced-motion`) a resposta é
> fallback estático explícito, não abstenção.

---

## 1. Direção visual (ticket 01)

**Brand como restrição leve.** Do `raw/assets/2026-08-08-audentra-brand-guidelines.jpeg`:
violet `#6A38FF`, azure `#1E5BFF`, mint `#00C49A`, navy `#0A1F44`, cinza `#6B7280`,
tipografia **Satoshi**. Tudo isso está nos tokens (`src/styles/app.css`).

**O que deliberadamente não foi herdado:** a linguagem do site institucional
(hero navy escuro, glassmorphism, gradiente roxo em texto). Ela é linguagem de
*marketing*; um fluxo de matrícula com formulários longos precisa de contraste
alto e superfície clara. Aqui o navy virou **tinta** (todo o texto e as bordas),
o gradiente violet→azure virou **sinal** (usado em exatamente três lugares: o
marcador do passo ativo, a barra de progresso, e o momento do aceite), e o mint
virou **"pronto/verificado"**.

Também evitados os três "generic AI look" que o skill `frontend-design` nomeia:
fundo creme com serif de alto contraste, fundo quase-preto com um acento vibrante,
e layout de jornal com hairlines.

**Como isso foge do "cara de shadcn padrão":** raio 10/16/20px em vez de 8px;
altura de botão 44px em vez de 36px; sombra tingida de navy em vez de preto neutro;
input preenchido (`bg-ink-50/60`) que só sobe pra branco no foco; label em
caixa alta com tracking em vez de sentence case; scrim de modal navy em vez de
`black/50`.

### Achados Mobbin (varredura ampla, SaaS/consumer bem desenhados)

| Referência | O que foi aproveitado |
|---|---|
| [LangSmith / LangChain](https://mobbin.com/screens/2dddad04-7abf-4544-9927-4dac2d07b61f) | Split layout: painel de marca à esquerda com contexto real, card de formulário à direita. Virou o layout da Entry screen. |
| [Firecrawl](https://mobbin.com/screens/d7d3efd7-51d6-4ac7-853d-051c720dbf28) | Abas como segmented control pill sobre trilho cinza, com o thumb branco elevado. Virou o `Tabs`. Também: erro de validação em vermelho logo abaixo do campo, não no topo da página. |
| [DoorDash](https://mobbin.com/screens/4ffdf09b-790b-4195-9740-e1107e7fb1fb) | **O achado mais útil da rodada**: código do país como `select` separado do número. Ver seção 2. |
| [Deel](https://mobbin.com/screens/0ecba66f-2205-48f2-8dcf-427624a21f3f) | Acordeão em que o header **recolhido** já carrega um resumo do que tem dentro ("Job title · Seniority level · Job scope"), mais o aviso lateral "Autosaved — this form is saved automatically". Virou o About you inteiro. |
| [Contra](https://mobbin.com/screens/2fce92f6-622a-46da-adb9-4e5e52858225) | Indicador de status por seção (check quando completa) no header do acordeão. Virou o `StatusPill`. |
| [Zillow — pet policy](https://mobbin.com/screens/bcb632e1-d447-4034-848f-e9a7c558e06d) | Pergunta condicional revelada **inline, logo abaixo da resposta**, sem trocar de tela, com uma nota de reasseguramento ao lado. Virou o branch condicional de Housing. |
| [Zillow — partner agent](https://mobbin.com/screens/cb38de39-87aa-41e6-a76d-68586edf6ae2), [7shifts](https://mobbin.com/screens/1050237f-2406-4bed-9ed9-155eaafa234b), [YNAB](https://mobbin.com/screens/fb85e8f6-9f19-4522-9481-28b27f696d7f), [Magnific](https://mobbin.com/screens/e1020a86-7e8d-4dbb-b65c-90c2ad113a99) | Padrão consistente de celebração: modal centralizado **com o confete estourando por trás/em volta**, página atrás só escurecida, um CTA primário e a ação opcional como link secundário. Virou o `CelebrationDialog`. |

### Catálogo ReactBits — o que foi avaliado na rodada 1

Candidatos avaliados e o veredito **da rodada 1**. Duas linhas ficaram
desatualizadas e estão marcadas; a rodada 2 está na seção 6.

| Momento | Candidatos ReactBits | Decisão |
|---|---|---|
| Celebração do aceite | `count-up`, `magic-rings`, `click-spark`, `star-border`, `prismatic-burst`, `ballpit` | **`SplitText` (instalado) + `canvas-confetti`.** Não existe componente de confete no ReactBits — nenhum dos candidatos entrega "confete estourando atrás de um modal". `canvas-confetti` faz isso e tem `disableForReducedMotion` nativo. O que o ReactBits agrega de verdade é a **entrada do headline**: `SplitText` (GSAP, char a char com blur) em "You're in.". Foi o componente usado para validar o registry. |
| Fundo do painel de marca (Entry) | `aurora`, `silk`, `light-rays`, `grainient`, `liquid-ether`, `plasma` | ~~**Rejeitado — CSS próprio (`.brand-panel`).**~~ **Revogado na rodada 2 — `Aurora` adotado por cima do `.brand-panel`, que passa a ser o fallback.** Ver seção 6. Todos são canvas WebGL (OGL/three.js). Isto é a **primeira pintura do produto**: um canvas que precisa bootar antes de desenhar custa LCP e ainda exigiria fallback de `prefers-reduced-motion`. Gradiente radial em CSS com drift lento entrega o mesmo efeito, é de graça, e o reset global de reduced-motion já o desliga. |
| Acordeão do About you | `accordion-gallery`, `stack`, `scroll-stack` | **Rejeitado — shadcn `Accordion` (Radix).** O `accordion-gallery` do ReactBits é galeria de imagens, não seção de formulário; nenhum dos três dá semântica de disclosure acessível. Formulário exige Radix. |
| Passos do onboarding | `stepper` | **Rejeitado.** O `stepper` do ReactBits é um componente multi-etapa autocontido que guarda o passo em estado interno — brigaria com o requisito de "uma rota por passo, deep-linkable" do TanStack Router. |
| Ranking de residências | `animated-list`, `stack`, `bounce-cards` | ~~**Rejeitado**~~ **Revogado na rodada 2** — a física de pega/solta do `Stack` entrou no gesto de arrastar. Ver seções 3 e 6. |
| Abas da Entry | `pill-nav`, `bubble-menu` | **Rejeitado como componente, aproveitado como ideia.** São navegação de site, não `role="tablist"`. Mas o thumb deslizante deles foi reproduzido no `Tabs` com `motion` + `layoutId` sobre o Radix Tabs. |

---

## 2. Entry screen (ticket 03)

**Aba padrão.** Create account primeiro e ativo. Quem chega por link de oferta não
tem conta; "Welcome back" é literalmente o bug que a Laura apontou na call.

**Thumb deslizante.** Não é enfeite: o problema original é gente não perceber que
existe outra aba. Um thumb que desliza entre as duas posições denuncia a existência
da segunda. Implementado com `motion` `layoutId` — como o Radix não expõe o valor
atual por contexto público, o `Tabs` espelha o valor num contexto próprio só pra
saber qual trigger renderiza o thumb.

**Telefone.** O portal atual rejeita `+1 555 234 5678` e devolve
`phone: String should match pattern ^\+[1-9][0-9]{7,14}$` pro aluno. A correção
copiada do DoorDash é estrutural, não de copy: **código do país é um `select`**,
o campo de número aceita espaço, hífen e parênteses, e a validação conta dígitos.
A mensagem de falha diz o que é aceitável ("7 a 14 dígitos depois do código do
país"), não o padrão.

**Erros simulados** (não há backend): criar conta com um e-mail que já foi criado
nesta sessão → "That address already has an account"; entrar com e-mail
desconhecido → "No account for that address yet", explicitando que nada foi
enviado nem alterado.

**Persistência:** aba ativa, e-mail, código do país e telefone sobrevivem a refresh
via `localStorage`.

---

## 3. Housing (ticket 06)

**Ranking por toque, não por arrastar.** As três referências que o Mobbin devolveu
pra "drag and drop list to rank preferences" — [Behance](https://mobbin.com/screens/59697694-c5a7-40d5-8db2-e39010585765),
[Juicebox](https://mobbin.com/screens/01028d24-0e2e-4ae8-81b3-c5f8c09117a0),
[Circle](https://mobbin.com/screens/a0684ada-0fe1-410b-a8e6-f4109d3c33a7) — são
todas lista com alça de arrastar dentro de um modal. **Descartado de propósito.**
A user story 20 diz que parte relevante do público está no celular, e lista de
arrastar é justamente o controle que pior funciona em toque e com teclado.
Tocar pra adicionar (`1`, `2`, `3`) + setas pra reordenar + remover faz o mesmo
trabalho e funciona em qualquer entrada.

**Branches.** On campus → só o ranking. Off campus → só a pergunta de proteção de
tuition/housing. "Não sei", "commuting" e "moradia familiar/dependente" → nenhuma
pergunta de acompanhamento, só uma frase dizendo o que acontece a seguir.
Isso é uma **inferência**, não confirmação da Laura — ver Further Notes do `spec.md`.

Saíram do passo, e não aparecem em lugar nenhum: tipo de quarto, preferência de
banheiro, matching de roommate, questionário de estilo de vida (sono/estudo/
barulho/limpeza/visitas/temperatura/substância) e comunidades temáticas.

---

## 4. About you (ticket 05)

Quatro seções num passo só (identidade, endereço/residência, contato de emergência,
FERPA), acordeão múltiplo — dá pra ter mais de uma aberta.

**Header recolhido carrega resumo + status** (padrão Deel + Contra). O ponto de
recolher um formulário longo é que o estado fechado ainda te diga o que tem dentro
e se você já resolveu; senão a pessoa abre as quatro pra descobrir.

**Risco conhecido do padrão, e a mitigação:** seção recolhida escondendo erro de
validação. Um submit inválido **abre todas as seções que têm erro**
(`FIELD_SECTIONS` em `src/routes/about-you.tsx`).

**Campos travados** renderizam como valor com cadeado e borda tracejada, não como
input desabilitado — um input cinza convida a pessoa a tentar digitar e depois se
perguntar por quê. A nota diz quem muda ("The Registrar changes this, not you.",
RN-PR-02).

**EDward** (leitura de ID) está fora de escopo: o bloco aparece com a copy que já
existe hoje, marcado como não conectado neste protótipo. Não foi expandido nem
removido.

---

## 5. Copy

Direção do `spec.md`: direto, frases curtas, sem linguagem corporativa densa. As
convenções da aba *Message Library* de `raw/data/2026-08-08-audentra-student-portal-fields.md`
foram tratadas como regra e estão embutidas nos componentes, não deixadas por
conta de cada tela:

- **Helper text é persistente e fica embaixo do campo** — nunca tooltip de hover
  pra informação necessária (`Field`).
- **Erro fica do lado do campo**, nunca só num resumo no topo (`Field`).
- **Erro diz se algo foi salvo, enviado ou cobrado** e nunca culpa a pessoa por
  falha de sistema (`Notice`).
- **Estado vazio diz por que está vazio e o que o preencheria** — não é espaço em
  branco.

A redação final de cada string continua sendo workstream de conteúdo à parte
(Further Notes do `spec.md`). O que está aqui é a direção executada, não texto
homologado.

---

## 6. Rodada 2 — o que mudou, e por quê

O enquadramento mudou na rodada 2: ReactBits deixa de ser avaliado e passa a
ser **adotado por padrão**, com fallback estático onde o custo é real. Alvo
declarado: **um momento assinatura por tela**, não tratamento pesado em tudo.

### Entry screen — o split

O defeito era estrutural: o painel travado em `max-w-[34rem]` e o formulário em
`flex-1`, então a folga ia toda para as margens do formulário (240px de cada
lado a 1440px, 480px a 1920px). O ticket pedia inverter os papéis — painel
`flex-1`, formulário fixo em ~30rem. Isso conserta o vão morto mas mantém um
painel que cresce sem limite, e a revisão do Marcos apontou que a **escala entre
as duas metades** continuava errada. A correção final é um **split proporcional**
(46% / 54%) com o conteúdo de cada lado em `clamp()`: 1280 e 2560 mostram a mesma
imagem em tamanhos diferentes, que é o que "parar de derivar" queria dizer.

Junto: a tela passa a ter **exatamente uma altura de viewport** no desktop
(`lg:h-dvh`), e a coluna que transbordar rola dentro de si. Barra de rolagem de
página numa tela de login lê como layout que não coube.

### Entry screen — o objeto: convite, não crachá 3D

O ticket 08 pedia `Lanyard` (crachá pendurado com física, arrastável). **Foi
construído e descartado.** Funcionou tecnicamente — o `frontImage` do componente
aceita uma textura desenhada em canvas, e o crachá saiu impresso com curso,
campus e número de inscrição, com linha do nome e foto em branco. O veredito do
Marcos ao ver rodando: *"perdeu o valor da entrada... deveria ser tipo um
convite, algo do tipo. pq a pessoa foi tipo selecionada"*. O objeto virou demo de
tecnologia e a mensagem — **você foi escolhido** — ficou atrás da física.

O que ficou no lugar: um **convite impresso**, 2D, em DOM (texto selecionável,
tipografia real, nítido em qualquer densidade). Mantém o miolo da ideia original
— tudo que Aster já sabe vem impresso, a linha do nome fica **em branco**, e é
isso que criar a conta preenche. O `SplitText` entra na linha do curso.

Custo evitado, de quebra: `three`, `@react-three/fiber`, `@react-three/drei`,
`@react-three/rapier`, `meshline` e um `card.glb` de 2,4 MB saíram do projeto.

**Plano B do ticket (`ProfileCard` / `TiltedCard`) não foi usado**: os dois são
tratamentos de card com inclinação, e o problema não era a inclinação — era o
objeto estar errado.

### Entry screen — `Aurora`

Adotado, com o `.brand-panel` (gradiente CSS que já existia) embaixo como piso.
Com `prefers-reduced-motion`, o canvas não monta e o painel fica no gradiente.
Isso revoga a rejeição da rodada 1, que era boa engenharia e enquadramento
errado: num artefato descartável o custo não rejeita, o fallback resolve.

### Housing — arrastar **e** setas

A rodada 1 rejeitou arrastar porque falha em toque e com teclado. Metade do
argumento continua de pé, então arrastar foi **somado**, não substituído: os
cards reordenam por arrasto (física de pega/solta do `Stack` — leve `scale` e
`rotate` na pegada, mola na soltura, via `Reorder` do `motion`) e as mesmas
posições saem por dois botões em cada card, com a mudança anunciada em
`aria-live`.

As galerias do catálogo (`DomeGallery`, `CircularGallery`, `FlyingPosters`) foram
consideradas e não servem: todas navegam, nenhuma expressa **ordem**, e ordem é o
dado que o passo captura.

O que a rodada 1 errou de verdade não era o controle, era o conteúdo: três linhas
de texto por residência. Agora cada opção é uma **foto** com galeria de três
(quarto, prédio, área comum), e o quarto vem primeiro porque é a pergunta real.

### Campus life — `ChromaGrid` como mecanismo

O holofote do `ChromaGrid` (as custom properties `--x`/`--y` e a máscara que
dessatura tudo fora do raio do ponteiro) foi adotado; o componente não. O
`ChromaGrid` renderiza cards que abrem uma URL, e este passo é **multi-seleção**
com estado marcado visível. Mecanismo emprestado, card próprio.

### Review & sign

Sem componente ReactBits. O momento assinatura da tela é o **canvas de
assinatura**, que é gesto, não animação — e as duas outras coisas que a tela faz
(ler documento inline com o aceite destravando no fim, e cada linha do resumo com
link de edição) são estrutura. Movimento aqui atrapalharia a leitura, mesma
exceção fundamentada que o About you tem.

### Deposit — `CountUp`

Adotado no valor de $500, com o número acessível em `sr-only` (um leitor de tela
não deve ouvir um número subindo) e o odômetro em `aria-hidden`. Com movimento
reduzido, o valor entra parado.

### Completion — `SplitText`, não `SplitFlapText`

O ticket 13 pedia `SplitFlapText` virando para "YOU'RE ENROLLED" — painel de
aeroporto, mecânico. **Foi construído e trocado.** Lendo na tela, os ladrilhos
liam como quadro de partidas: certo para "registro de chegada", errado para
falar com uma pessoa. O pedido do Marcos foi explícito: conduzir o usuário,
"congratulations, you're enrolled", grande, com a fonte aparecendo.

O que ficou: uma **sequência** — marca, epígrafe, e o título entrando em duas
batidas com `SplitText` ("YOU'RE" em branco, "ENROLLED" em mint 620ms depois),
seguido dos quatro cartões de "o que acontece a seguir" em cascata com `motion`.

O título é **uma linha, em caixa alta, com o tracking do wordmark** — a pedido
do Marcos, para amarrar as maiores palavras do produto à marca no topo da mesma
tela. Ele lê como carimbo, não como frase.

O fundo passou por três versões. Foto de campus clara (rejeitada: contraste),
foto de campus escura ao anoitecer (rejeitada: *"esses fundo na ta encaixando"*),
e finalmente **`LightRays` (ReactBits) sobre `ink-950`** — que é o que resolve o
problema de raiz, porque o fundo para de disputar pixels com o texto. Fallback de
`prefers-reduced-motion`: o canvas não monta e sobra um gradiente radial.

**Continua sem confete.** Ele pertence ao aceite da Offer; repetir aqui dilui os
dois.

### Imagens

Curadoria em Unsplash, licença livre (Unsplash+ pago foi excluído na curadoria).
Baixadas, recortadas e recodificadas em WebP para `public/images` — nada de
hotlink. Crédito e licença por arquivo em `public/images/CREDITS.md`.

Regra de curadoria aplicada: luz de dia, vegetação de verão, câmera na altura dos
olhos, tijolo — para as três residências lerem como um campus só. Descartados na
revisão visual: prédios de universidade reconhecíveis (Harvard, Berkeley), tomadas
de inverno com árvores sem folha, e ângulos de baixo para cima que quebravam a
altura de câmera.

### Sidebar do onboarding — a instituição

Achado do Marcos na revisão: *"o nome da faculdade ta mto simples po, só texto
jogado?"*. Estava — wordmark da Audentra em cima, "Aster University" embaixo em
cinza pequeno. Isso põe o **fornecedor acima da instituição** e trata o
substantivo mais importante da tela como legenda.

Invertido: a instituição lidera, com `InstitutionBadge` (brasão + nome + campus /
termo), e a Audentra desce para um crédito de uma linha no pé do rail.

O brasão é **um brasão**, não um avatar de iniciais — uma segunda rodada de
feedback matou o quadrado com "AU" dentro: *"vc tem q simular o simbolo de uma
univerdade de verdade"*. É um escudo com chefe e uma áster de oito pétalas
(*aster* é "estrela" em grego, e é o nome da instituição). No produto real este é
o slot do logo que o tenant sobe.

O rail também ganhou **um filete entre cada bloco**, no mesmo peso, do brasão ao
crédito de plataforma — antes só o rodapé tinha um, o que fazia o rodapé parecer
pregado e tudo acima dele parecer uma coluna indiferenciada.

### Dois bugs achados de graça na revisão visual

- **O wordmark perdia metade.** O `<linearGradient>` do "A" tinha `id` constante,
  então toda tela que renderiza a marca duas vezes (entry: coluna do formulário +
  painel; passos: header mobile + rail) tinha dois `<defs>` disputando o mesmo id
  — e quando o vencedor caía num ramo `display:none`, o traço esquerdo sumia.
  Agora o id é por instância (`useId`).
- **`CountUp` demorava ~1,8s no melhor caso.** A prop `duration` do registry não
  é duração: ela alimenta `damping = 20 + 40/d` e `stiffness = 100/d` ao mesmo
  tempo, então encolher o número endurece a mola *e* aumenta o amortecimento, e o
  tempo de acomodação satura. Trocado por mola por duração do `motion`
  (`{ duration, bounce: 0 }`), onde `duration` quer dizer o que diz.

---

## Rodada de 2026-08-14 — a casca: Fases, chão rebaixado, barra fixa, mobile-first

Buscas via `mcp__mobbin__search_screens` / `search_flows` feitas **antes** de
propor a solução, conforme `docs/agents/design-references.md`. As referências
abaixo são as citadas no ticket 01; aqui fica o que foi efetivamente tirado de
cada uma e o que foi deliberadamente **não** copiado.

### O chão e os painéis

- [Deel — bulk edit](https://mobbin.com/screens/ff59116e-b033-499e-badb-b4c9e02cd84a)
  é a tese inteira: chão cinza, painéis brancos, um painel de passos *pequeno*
  em vez de uma sidebar de 19rem, e Exit/Continue numa barra fixa no pé.
  Tomado: os quatro. O `--step-measure` deixou de ser `coluna + gap + coluna` e
  virou um número só (56rem), porque a terceira coluna morreu com isso.
- [Mixpanel](https://mobbin.com/screens/7a76dace-f4de-4782-89dc-441056f53e85) e
  [Clay](https://mobbin.com/screens/1ed67bda-94e7-4a4d-a49a-0072ee2a29b3):
  sidebar + conteúdo em painéis com borda. Tomado o painel como *unidade* — o
  componente `Panel` é o que substituiu tanto o `ContextPanel` (que só existia
  na coluna morta) quanto as seções soltas que renderizavam direto no branco.
  **Não** tomada a barra de contexto no topo: aqui o topo do desktop já é o
  título do passo, e uma segunda faixa acima dele seria a terceira coisa
  dizendo onde você está.

### As Fases no rail

- [Adaline](https://mobbin.com/screens/36261cc6-0b4a-4cd5-a957-e679828ec74f):
  capítulos nomeados com os sub-passos dentro e os concluídos riscados. Tomados
  os dois. O risco importa mais do que parece — um tique sozinho lê como
  *status*, um risco lê como "acabou, siga".
  Só a Fase ativa abre; as outras ficam na linha-título. Foi o que permitiu o
  rail cair de 19rem para 14rem sem esconder a estrutura.

### O topo no telefone

- [MyFitnessPal](https://mobbin.com/screens/3dfe2002-71de-42d7-97f2-98f707da5b3c):
  barra segmentada em que **cada segmento é um capítulo**. É a razão de o
  Closing não estar nela: ele não é a Fase quatro. Cada segmento preenche pela
  fração de Quests salvos da própria Fase, então a barra também anda *dentro*
  de uma Fase, não só entre elas.
- [Zopa](https://mobbin.com/screens/3117af6d-d7d7-41b0-b296-06e764439d8d) e
  [Alan](https://mobbin.com/screens/e1a0f7bf-2e64-4436-9508-66ec9cd02d70):
  progresso em cima, botão preso embaixo. É a mesma `ActionBar` do desktop, não
  um componente de telefone à parte — o que muda entre os dois layouts é onde
  ela encosta, não o que ela é.

### Overlay responsivo

Sem referência nova: a decisão saiu da sessão de design (folha embaixo no
telefone, diálogo no desktop) e o `Overlay` implementa os dois com um wrapper
flex em vez de `top-1/2 -translate-y-1/2`, porque translate estático briga com
os keyframes de entrada — é isso que deixa o mesmo elemento *subir* no telefone
e *dar zoom* no desktop. A celebração fica **de fora** de propósito: folha é
gaveta de detalhe de apoio, e a celebração é o momento que deve tomar a tela.

### ReactBits

Nada novo adotado nesta rodada. `CountUp` continua no depósito (agora numa
faixa horizontal, não num painel alto) e a celebração segue com `SplitText` +
confetti. A casca é justamente a parte do produto que **não** deve ter
personalidade própria: ela é a moldura, e a régua que o cliente deu para ela
foi Salesforce — "um sistema de verdade", não um conjunto de telas.

## Ticket 03 — Points com destino: Balance, conversão e o momento do prêmio

Referências citadas no ticket antes de propor a solução. O que saiu de cada uma,
e o que foi recusado.

### O que estava errado

Um `+50` cinza ao lado do item já concluído no rail. É um **recibo**: aparece
onde o trabalho já aconteceu, fica lá para sempre, e ainda pesava justamente no
componente que a rodada anterior estava tentando aliviar. Nenhuma das
referências abaixo mostra pontos assim.

### Pontos são distância, nunca placar

- [Everyday Rewards](https://mobbin.com/screens/c0d07517-325a-4d5c-8663-575ade1f2f00),
  [Qantas](https://mobbin.com/screens/3685ad75-41b1-4520-9114-5d48576fa905),
  [Ulta](https://mobbin.com/screens/5e1db78b-5bb0-4336-841e-7ed0d962030f): as
  três dizem a mesma frase — "faltam N pontos para X". Nunca o número sozinho.
  Daí o crédito da livraria sair em **blocos de $10** em vez de acumular por
  centavo: um "$17,40 até agora" não tem próximo momento dentro dele; "faltam 10
  pts para os próximos $10" tem. É o bloco que dá ao Balance o que contar.
- [Navan](https://mobbin.com/screens/d13f4a74-9b7b-478a-b563-41a0ef35afbe): um
  saldo de recompensa único morando na moldura. Confirma a decisão do ticket 01
  de haver **um** Balance — aqui ele só ganhou o que dizer.

### O `+10` antes da tarefa — recusado

- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8)
  mostra `+10` *antes* de cada tarefa, e é a resposta direta ao recibo. Tomamos
  o registro convidativo e o anel de fração; **não** tomamos o preço por linha.
  Ao lado de sete Quests isso é uma tabela de preços — exatamente o peso que o
  cliente reclamou —, e a ADR-0002 já tinha fechado essa porta. O que sobra do
  Langdock no rail é a barra de progresso dentro do bloco atual, dentro do
  próprio Balance, e não uma coluna de números.
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8):
  tarefas futuras como expectativa e não como preço. É o que a linha "faltam 25
  pts para $30" faz sem precisar tocar em nenhuma linha do rail.

### O prêmio como trajeto, não como selo

Nenhuma referência resolvia "onde o ponto aparece no instante em que é ganho".
A decisão é de mecanismo: o token sai do **ponto da ação** (o último
`pointerdown`, que é literalmente onde a mão estava) e viaja até o Balance, onde
é absorvido — e o total só muda quando ele chega. Duas consequências que
valeram a escolha:

- O provider observa o total e anima sozinho. Nenhum passo chama `award()`, então
  nenhum passo futuro pode esquecer de chamar — o erro clássico de dois escritos
  que precisam concordar.
- Ele mora acima de `/onboarding`, não dentro do passo: o clique que ganha o
  ponto é o mesmo que navega, e um provider dentro do passo seria desmontado no
  meio do próprio voo.

`prefers-reduced-motion` recebe o mesmo prêmio sem a viagem: o token aparece
logo acima do Balance, fica legível por um segundo e some. O que a animação
precisa dizer é "isto foi para lá" — chegando no lugar certo, ela ainda diz.

### ReactBits

`CountUp` avaliado e recusado para o Balance: ele anima ao entrar em viewport,
uma vez, e o que este número precisa é reagir à *chegada* de um token. Uma mola
de `motion` com `key` na contagem de pousos faz isso em três linhas e sem
segunda fonte de verdade sobre o valor.

---

## Rodada de 2026-08-14 (tarde) — duas réguas: empilhamento e imobilidade

O cliente trouxe uma captura de Campus life com duas queixas na mesma frase:
*"olha o tanto de informação uma contra a outra, nao dando harmonia aos olhos"*
e *"nao e so aqui q vc erra, vc erra bastante tbm com layout, onde fica dando
flick, de posição"*. A segunda metade é o ponto: **não era desta tela**. Daí
esta rodada produzir régua antes de produzir tela — tickets `08` e `09`.

Vinte telas varridas via `mcp__mobbin__search_screens` (plataforma `web`, dois
recortes: catálogo de interesses com filtro; multi-seleção com contagem), todas
**antes** de qualquer proposta, conforme `docs/agents/design-references.md`.

### O que as vinte referências têm em comum

- **A contagem mora no botão, nunca numa segunda lista.**
  [Skillshare](https://mobbin.com/screens/e0394052-5731-44d8-a3b1-3fc3be2eebdc)
  ("Pick 3 to Continue"),
  [Substack](https://mobbin.com/screens/898419be-fb09-44aa-a5bb-4ce7181bd503)
  ("Select 3 more to continue"),
  [Cosmos](https://mobbin.com/screens/a8ad2460-eb22-4ded-9098-bcfc3cc8a217)
  ("Choose 3 · 1/3"),
  [X](https://mobbin.com/screens/40a2182f-e029-401a-9cc4-ff3c74620052)
  ("0 of 1 selected"),
  [Hulu](https://mobbin.com/screens/ad9f060d-9708-4f80-a92a-d0fa9412d08b)
  ("1 ITEM SELECTED"). Nenhuma das vinte empilha filtro **e** bandeja de
  escolhidos acima da grade, que era exatamente o que tínhamos.
- **A escolha se expressa na própria grade.**
  [Bloom](https://mobbin.com/screens/c7aa79c9-b8a4-4d60-b17a-a78cc8daa3e6) e
  Hulu marcam o escolhido e **recuam o não escolhido**. É o que torna "três,
  destes nove" legível sem imprimir os três de novo embaixo.
- **Uma voz por tela.**
  [Kit](https://mobbin.com/screens/da62829d-aee9-43f4-8b20-a40a9e89062d),
  [Uxcel](https://mobbin.com/screens/74a1a5b1-244f-4dbb-bfb2-b2c3f0f630d9),
  [Magnific](https://mobbin.com/screens/6ea5f92a-028a-422c-89c1-c35ccd7e1e88):
  título, **uma** linha de apoio, controles. Nenhuma tem um segundo cabeçalho
  com descrição própria dentro do conteúdo.
- **Título ancorado no topo, mesmo com pouco conteúdo** (Magnific, Kit, Uxcel).
  É o argumento contra centralizar uma tela e não as outras.
- **Recusada:** o agrupamento por categoria do Cosmos. Seis cabeçalhos para nove
  itens é mais cabeçalho do que conteúdo.

### A régua de empilhamento — o que sobrou dela

A régua de empilhamento tinha cinco linhas. Duas foram **revogadas** na rodada
de 2026-08-15, e as revogações estão registradas aqui em vez de simplesmente
apagadas, porque uma linha que some sem motivo volta em duas rodadas.

Sobrevivem:

1. Contagem de seleção mora no CTA. Nunca numa segunda lista.
2. Um significado por canal visual. Se dessaturação quer dizer "não escolhido",
   ela não quer dizer mais nada.

**Revogada:** *`Panel` embrulha campos; galeria não vai em painel.* Era a linha
que empurrou os catálogos para o chão nu e produziu exatamente a queixa
"jogado no fundo". Substituída pelo sistema de quatro superfícies do ticket 01,
onde a Ground tem **três** exceções nomeadas em código (`OnGround`) e uma delas
é o catálogo que *é* a tela.

**Revogada:** *Nenhum controle existe para trabalhar um catálogo que já cabe na
tela.* A call de revisão pediu um filtro para Campus life e esta linha o
proibia. Com ~420 organizações declaradas e ~60 no fixture, o filtro é a tela.

**Rebaixada:** *Um par título+apoio por tela* deixa de ser proibição e passa a
ser o padrão do arquétipo. Uma tela `review` tem cabeçalho de status, rótulos de
seção e o documento; três pares ali não são empilhamento, são estrutura.

### A régua de imobilidade — quatro linhas, todas sobre deriva

Reduzida de cinco para quatro na rodada de 2026-08-15, e reescrita como o que
sempre foi: uma régua contra **deriva**, não contra movimento. A queixa do
cliente nunca foi que as coisas se mexem, foi que *a mesma tela cai em lugares
diferentes dependendo de como você chegou nela* ("vc erra bastante tbm com
layout, onde fica dando flick, de posição").

1. Todo passo ancora o `h1` no mesmo pixel.
2. Nada nasce acima do título. O que aparece por estado vai para a barra, para a
   própria linha do título, ou é overlay.
3. A barra de ação tem altura constante, declarada uma vez.
4. Largura de botão primário não reage ao próprio rótulo.

**Revogada:** *Bloco condicional dentro do corpo ou reserva espaço, ou é
overlay.* Ela proibia coreografia por completo — e coreografia é metade do que
esta entrega precisa. Substituída por: **o bloco revelado nasce imediatamente
abaixo do controle que o disparou, no mesmo Panel, com uma transição autoral;
nada acima do gatilho se mexe.** Isso é julgamento, e é revisado por gente.

As quatro causas reais do "flick", achadas com o código na mão: `centered` só na
Offer; `--action-bar-height` mudando 6.5→4.5rem no meio da Offer e arrastando o
`padding-bottom` do `main` junto; `ReturnToReview` nascendo acima do `h1` quando
se chega pelo Review; e a bandeja de escolhidos nascendo dentro de Campus life.
O salto **horizontal** já estava resolvido por `scrollbar-gutter: stable`.

`src/lib/layout-rules.test.ts` foi **reescrito**, não estendido: ele afirma
exatamente estas quatro e nada mais, e as asserções que sustentavam as linhas
revogadas foram apagadas na mesma mudança que as linhas. Um teste e uma régua
que discordam é pior que qualquer um dos dois sozinho.

### ReactBits — `ChromaGrid` revogado

A rodada 2 adotou o holofote do `ChromaGrid` em Campus life ("mecanismo
emprestado, card próprio"). **Revogado.** Ele dessatura o que está fora do raio
do ponteiro; a seleção agora dessatura o que não foi escolhido. Dois cinzas com
pesos diferentes dizendo coisas diferentes é vocabulário que ninguém pediu para
aprender, e a seleção é o dado que o passo captura — ela fica com o canal. O
holofote também era enfeite para uma parede de cards, e a parede tem nove.

Nada novo adotado. `SplitText`, `CountUp`, `LightRays` e o confetti seguem onde
estavam.

---

## Rodada de 2026-08-15 — reconstrução a partir da espinha

Sessão de grilling de 2026-08-15: vinte perguntas, todas respondidas pelo
cliente. Seis frentes de pesquisa por trás delas. As referências abaixo são as
citadas nos tickets de `.scratch/onboarding-rebuild/`, conforme o portão de
`docs/agents/design-references.md`. Uma linha cada, com o que foi tirado.

### 01 · Fundação: superfícies, movimento, marca

- [Xero — importar bills](https://mobbin.com/screens/100b7cfe-9010-4e4e-84ab-27bc60673f87) — o Panel termina numa barra de rodapé colada à borda, não num botão solto embaixo dele.
- [Clerk — Overview](https://mobbin.com/screens/9b720c06-5945-4746-9d1e-c4f1a8270c51) — rodapé com metadado à esquerda e ação de escape à direita, como linha do próprio painel.
- [Airwallex — Settings](https://mobbin.com/screens/0424ee49-c5dc-4700-bccb-67ba0a54df82) — cabeçalho = título + subtítulo + **uma** ação secundária, separado por divisor.
- [Cloudflare — AI Gateway Settings](https://mobbin.com/screens/8e3ce95f-34c9-40fb-9e12-b94d6421b656) — o rótulo de seção fica fora do painel. Primeira exceção da Ground.
- [Jira — Select a template](https://mobbin.com/screens/31e7e771-e8fc-4f38-a672-062f2474b790) — grade num Well tingido, itens como cartões planos.
- [Bloom — What do you want to create?](https://mobbin.com/screens/c7aa79c9-b8a4-4d60-b17a-a78cc8daa3e6) — seleção por preenchimento + check, nunca por elevação.
- [Kit — Choose your template](https://mobbin.com/screens/5a10bd07-3ec4-453c-b116-ca44f915d63e) — quando a coleção *é* a tela, ela dispensa o painel. Segunda exceção.
- [Squarespace — Review Order](https://mobbin.com/screens/74fdbbc4-e844-4598-9c8c-9f2a0b462a94) — só o resumo é emoldurado. Terceira exceção.
- [lululemon — Checkout](https://mobbin.com/screens/1b90a989-8460-400b-bbcc-1747d579961e) — passos do mesmo formulário viram um Panel com divisores, não N painéis.
- [PayPal — Upload documents](https://mobbin.com/screens/8ea4958b-7bb4-409a-8d8c-7983b3c2e15c) — a dropzone é a única coisa rebaixada e o arquivo enviado sai dela.
- [Lindy — Files](https://mobbin.com/screens/50bd3a40-45f3-44a4-a9da-fe935dffefe1) — dropzone e lista como dois Wells irmãos no mesmo tom.
- [Mercury — Policies](https://mobbin.com/screens/98e61b35-61a0-4490-b1a9-15a7188767ce) — um Well pode ter escala de uma palavra.
- [Walmart — Review Order](https://mobbin.com/screens/14cb5cd9-d4c4-4165-9479-099cb38edf05) — cabeçalho levemente tingido dá duas tonalidades sem borda.
- [Docusign — Template](https://mobbin.com/screens/225c95a5-ae7c-4ddc-be26-45460c5eebd6) — um Well pode ser faixa de largura total.

### 02 · A espinha: dez Steps

- [Remote — Add an employee](https://mobbin.com/screens/d6094185-b959-4f34-8022-248f0ea7ff52) — Personal profile · Address details · Emergency contact como três entradas de rail. A evidência literal da quebra em três.
- [Deputy — Completing documents](https://mobbin.com/flows/77da76fb-cd1d-413a-925f-84e03419ac30) — documentos como entrada própria e contígua. É por isso que Health é um Step e fica onde fica.
- [Airwallex — Verifying ID](https://mobbin.com/screens/e72dd825-7bcd-41e3-9a3f-f3ba8cab355b) — rail de dois níveis, só o grupo atual expandido. É como dez Steps não parecem dez.
- [OKX — identity verification](https://mobbin.com/flows/183e41d1-8744-48c6-b254-155794430af0) — separa endereço de verificação de endereço: o piso de granularidade é baixo.
- [Mercury — onboarding](https://mobbin.com/screens/bdc369b8-aa88-4826-8c21-c52a19c5fa50) — Company info separado de Company address.
- [Klaviyo — Set up your account](https://mobbin.com/screens/c116a0f9-8c5e-450d-b66d-d7a4f52a4b61) — "About 3 minutes" por sub-step. É a referência que **revoga** a regra de que tempo nunca aparece numa linha de Quest.
- [Melio — Get Started](https://mobbin.com/screens/f380e3c1-0c86-400e-aaff-5821143e501f) — o total anunciado uma vez, antes do primeiro campo.
- [HoneyBook](https://mobbin.com/screens/7c915d6b-2a99-4eb0-956d-e7a3a97bb265) — o minuto **some quando a linha fica verde**.
- [Binance — Verifying an account](https://mobbin.com/flows/24bdfada-87a1-4718-acb9-ae2446410854) — a abertura lista os passos por nome e promete um tempo.

### 03 · Duas vozes

- [Fiverr — Are you a U.S. person?](https://mobbin.com/screens/819111c3-99bc-400a-82d2-6919412e1f60) — cada radio carrega a consequência na própria etiqueta.
- [Remote — US person](https://mobbin.com/screens/341cd493-0581-4ba9-a47f-2769b46e8a98) — a pergunta explica *por que* pergunta. É o único helper que sobrevive à poda.
- [Workable — NDA](https://mobbin.com/screens/7f33b11d-bc78-431c-ae2e-1f34582d9b59) — a consequência legal inteira numa frase ao lado do botão.
- [Cleo](https://mobbin.com/screens/9cd27255-d309-406e-b8b4-a6f0073497a6) e [happn](https://mobbin.com/screens/5d76730f-2df5-436b-b426-33e476f39937) — voz e tipografia grande no lugar de ilustração.
- [GoodRx](https://mobbin.com/screens/9cc6c7aa-d129-4781-8e15-39d16e1044cd) — o eyebrow é onomatopeia, não rótulo.
- [Marriott Bonvoy](https://mobbin.com/screens/145c73c3-669c-4b43-ace5-e617c6efb76f) — "Feel free to brag a little!": o convite a compartilhar sem pedir licença.

### 04 · Points: preço, recibo e o voo

- [Langdock](https://mobbin.com/screens/065752db-06ad-4118-ad1c-8f95daa3f8a8) — +10/+15/+20 ao lado de cada tarefa **não feita**, e "0 / 595" coroando o checklist. Derruba a regra antiga de nunca mostrar preço.
- [Portrait](https://mobbin.com/screens/21e83614-0f58-429c-a84b-8e811abb64e8) — o "+100" continua visível depois: a mesma etiqueta é preço e recibo.
- [Finch](https://mobbin.com/screens/3d7ef155-c49e-45b6-b918-2f73c95f6162) — saldo visível no canto **durante** a celebração: o par origem→destino do voo.
- [Alan](https://mobbin.com/screens/9f30f6a1-5ce0-4675-bdc5-b345a8baf371) — profundidade é o que justifica uma animação longa.
- [Brilliant](https://mobbin.com/screens/3c3cb198-8f28-4ed3-84e0-d9607f4da700) — a tela celebra o acumulado, não o delta.
- [Ulta Beauty](https://mobbin.com/screens/5e1db78b-5bb0-4336-841e-7ed0d962030f) — "10 Points / $0.00 Value" lado a lado: a tradução mora colada ao número.
- [adidas adiClub](https://mobbin.com/screens/5c88e9dd-b915-439e-b81a-3522538b4f0c) — "50 points **to spend**": o verbo transforma contador em carteira.
- [Shopee](https://mobbin.com/screens/d9be55ce-b373-4bea-8c07-9b96f34de029) — a barra termina no ícone do prêmio: o alvo é um objeto.
- [IHG](https://mobbin.com/screens/9135b2b8-e7b3-4334-8160-068cbf04f337) — o que falta é concreto e nomeado.
- [Mimo](https://mobbin.com/screens/f83964b8-5a63-4abf-bc32-726991f82a82) e [Duolingo](https://mobbin.com/screens/95bfa3c2-24b3-4897-90b5-7cd3bca1400b) — saldo no mesmo pixel entre telas; sem isso o voo não tem destino.
- [Upwork](https://mobbin.com/screens/707fa0fd-0ce5-4773-9487-d2bcb53e2f92) — preço agregado por grupo.

### 05 · A oferta e o aceite

- [Deel](https://mobbin.com/screens/66328d19-07aa-4a67-bacd-4cfea6e32885) — coluna larga é o documento, estreita é o ato.
- [Upwork](https://mobbin.com/screens/826b635b-4b9e-40e6-895d-7f674d820901) — a coluna direita não é resumo da esquerda, é **a outra parte**. É o que enche a tela sem inflar conteúdo.
- [Turo](https://mobbin.com/screens/a9bcd906-db01-416e-862a-3ccef0773384) — as políticas moram no painel do ato.
- [Preply](https://mobbin.com/screens/8d814369-220a-4fe1-a800-eae206780502) — painel de consequência em linhas com ícone. É a forma de "what accepting does".
- [Kiwi.com](https://mobbin.com/screens/e46b131d-1b44-4b7c-a43e-689deae6ab4a) — o prazo vira bloco próprio.
- [Mistral](https://mobbin.com/screens/49cb4c69-88e7-465e-806e-978413cf3f31) — o gradiente é o **chão**; é como o vazio deixa de ser branco.
- [Stripe](https://mobbin.com/screens/791099ca-408b-4964-9d57-92e3ec2302b5) — gradiente confinado, o resto branco.
- [Frame.io](https://mobbin.com/screens/a8cb043c-52c5-4a95-a972-f4bd741f9821) e [Runway](https://mobbin.com/screens/6d919fa4-5dc7-4589-a2a1-17cb27a4508a) — arte é faixa vertical, nunca fundo atrás do texto.
- [Qonto](https://mobbin.com/screens/f6561608-fe6e-43fa-bb26-7158020f0f47) — mobile: número grande, lista com check, botão colado embaixo.
- [Monzo](https://mobbin.com/screens/98df0031-b73c-472f-900a-c686315a8730) — no telefone a arte encolhe, não some.
- [Mercedes-Benz](https://mobbin.com/screens/f25b629c-dca8-4818-9cca-ed13479d42c0) — no mobile o número decisivo migra para junto do CTA.
- [Artsy](https://mobbin.com/screens/0aaf2a08-5bd4-49ec-9c04-e6bca23bc09b) — a reasseguração vira bloco imediatamente acima do botão.
- [Commons](https://mobbin.com/screens/c8ac48ea-89ab-4811-ac60-c208492da6f8) e [Linktree](https://mobbin.com/screens/15bce965-033f-424f-ae47-ad9c544cb798) — o que se comemora tem que ser uma **coisa visível**.
- [Uxcel Go](https://mobbin.com/screens/a849139b-8acf-4bd6-9046-3d9ee8381db5) — cartão 4:5 com quatro métricas em grade 2×2 e marca no rodapé.
- [Duolingo Year in Review](https://mobbin.com/screens/81b67776-4a5d-40d9-860e-9b3b4122357a) — compartilhar é ele próprio um ganho.

### 06–09 · Os três Steps que substituem Identity & contact

- [Remote — Add an employee](https://mobbin.com/screens/d6094185-b959-4f34-8022-248f0ea7ff52) — a quebra em três, de novo.
- [Airwallex — Verifying ID](https://mobbin.com/screens/e72dd825-7bcd-41e3-9a3f-f3ba8cab355b) — o upload acompanha o status, na mesma tela em que ele foi respondido.
- [Cake Equity](https://mobbin.com/screens/90edf08e-3f62-4a8d-8cd9-2d2d5e6bef0b) — o bloco revelado nasce **abaixo** do controle que o disparou; nada acima se mexe. É a linha que substitui a régua revogada.
- [Melio — Add cardholder details](https://mobbin.com/screens/a1123459-1409-4b67-b150-01ae29d5e669) — pares na horizontal: seis campos em ~4 alturas de linha.
- [Zillow — Step 1 of 3](https://mobbin.com/screens/c1b594bb-ab3c-40db-a396-18ee26aa7dd8) e [Workable](https://mobbin.com/screens/19490514-0961-404d-9edb-b930bd1a88de) — a segunda coluna absorve o que não é campo.
- [Revolut Business](https://mobbin.com/flows/f37fbbc4-ddc2-412b-a6fe-b87d8ddc66ef) — o upload de documento ocupa uma tela sozinha.
- [Origin](https://mobbin.com/screens/3aa9eac9-df30-442d-b4b1-57d250860e5a) — o passo mais curto do fluxo ainda é um passo.

### 10 · O visualizador de imagens

- [Careem](https://mobbin.com/screens/303977eb-2a8c-4a2e-ab2e-d0d9e0ec562c) — X no topo à esquerda, contador no rodapé à direita, legenda à esquerda.
- [Shopee](https://mobbin.com/screens/76f54f9e-c43f-409e-9139-32d70f037c16) — ampliada, a foto continua rotulada com o ambiente.
- [Weverse](https://mobbin.com/screens/d8f4f967-1c71-4dae-af9e-f3dc801c008c) — tira de miniaturas: navegação por salto, não só swipe.
- [Faire](https://mobbin.com/screens/3701c325-f3d6-49fd-a3ac-9bd0bbd5c70d) — letterbox em fundo preto. A imagem inteira, nunca cortada.
- [Swarm](https://mobbin.com/screens/6702cfbd-6987-469c-8a75-a135246f8874) — contador textual, não dots.

### 11 · Housing

- [Realtor.com](https://mobbin.com/screens/57a73e61-070c-464a-80e1-47bf1d530c61) — fila de atalhos por ambiente sob o hero, cada um abrindo a galeria naquela seção.
- [Booking.com](https://mobbin.com/screens/7e2f4093-689d-4c24-841b-3cf3dfc3cabb) — o carrossel do card não é a única porta pra galeria.
- [Agoda](https://mobbin.com/screens/3ff2c32b-5c44-4cde-b431-6428f73272fd) — pílula escura com "1/6" em vez de dots, que escala pra doze fotos.
- [Expedia](https://mobbin.com/screens/06d4e76f-b493-49f4-b503-49b5371e9c51) — no desktop a galeria é modal com legenda de ambiente.
- [Airbnb — Photo tour](https://mobbin.com/screens/32308fc2-1dc4-49df-ac43-32fc7207a4e3) — no mobile, empilhado por seção.
- [Trip.com](https://mobbin.com/screens/c4c9c612-c0b4-4b97-9a3b-48ef42003737) — a contagem avisa antes do clique que uma categoria está quase vazia.
- [Zillow — Compare homes](https://mobbin.com/screens/82a740cd-7cde-4aa7-bc7b-63451d23c2ad) — primeira coluna de rótulos congelada, linhas agrupadas por assunto.

### 12–13 · Campus life e o roteiro da feira

- [Care.com](https://mobbin.com/screens/7851345f-8c0c-4b72-91f5-74528639148d) — cada eixo é uma pílula com popover ancorado e Clear próprio.
- [Juicebox](https://mobbin.com/screens/62dbcaad-fa05-48eb-aacd-d9ff8d917ce7) — a pílula ativa carrega quantos valores estão escolhidos.
- [Tripadvisor](https://mobbin.com/screens/c46b676e-057c-400a-a50a-7de7be7d3b2e) — overflow horizontal em vez de quebra de linha; a barra nunca cresce duas alturas.
- [Klook](https://mobbin.com/screens/a3454f15-f734-46e4-87a7-71eb8e96695f) — o número de resultados aparece antes do filtro ser confirmado.
- [Locals](https://mobbin.com/screens/97354356-6811-4be8-8061-37e4b0ea2861) — chips agrupados sob cabeçalhos tornam ~40 itens navegáveis.
- [Etsy](https://mobbin.com/screens/b53410bc-c9a5-4706-9c26-5b41e600a2f2) — depois de salvo, o botão vira pílula cinza com rótulo no passado, **sem cor de marca**.
- [Beli](https://mobbin.com/screens/2fad692a-1d5a-464b-9f77-f2c6b96ae71a) — a separação visual entre "quero ver" e "escolhi".
- [Nextdoor](https://mobbin.com/screens/3371a7b8-5efe-46a6-9ace-058be3e87ad2) — a referência do que **não** fazer: botão sólido de largura total lê como inscrição.
- [Blackbird](https://mobbin.com/screens/e553aed1-ceb0-4f6c-9d2a-30c5a2001ca8) — três colunas rotuladas: custo / horas / como entrar.
- [Going](https://mobbin.com/screens/71eb64b3-b380-486e-b0ca-0d10ad694e17) — a contagem zero aparece onde a contagem normal aparece.
- [OpenSea](https://mobbin.com/screens/45a834a8-d95b-43fe-8420-7f0660bb528b) — os chips culpados continuam na tela para remoção individual.
- [Wanderlog](https://mobbin.com/screens/a9e14927-a81a-4255-88bf-cbc54a2f2538) — cada parada é um cartão numerado com o tempo de caminhada até a próxima.
- [Google Maps Timeline](https://mobbin.com/screens/0084a901-a5a2-4d9c-b1d7-c65ed356b00) — trilho vertical com trechos de deslocamento e um resumo no topo.
- [Trip.com](https://mobbin.com/screens/ed92777b-cd9a-4b3c-8796-42f2ecdf21c1) — `×` por item para remover no lugar.
- [Pangea](https://mobbin.com/screens/4e015b05-c82e-49bd-bcb6-afaaa90c7afd) — o roteiro preserva a origem dos itens.
- [Careem](https://mobbin.com/screens/2e491c8a-aba9-4d19-bea0-f7ee50c90ba9) — o marcador de salvo é o único enfeite.

### 14 · Review & sign

- [Zillow — Lease review](https://mobbin.com/screens/8743e2d5-d864-47c4-b7ec-43bd57df810d) — cada seção com pílula de status própria e Edit. É a resposta a "bato o olho e não sei o que é".
- [GoFundMe](https://mobbin.com/screens/7e19670f-48eb-4cac-a757-a5092755384e) — o propósito declarado numa frase impede o resumo de ser lido como formulário.
- [Gusto](https://mobbin.com/screens/6d232ada-f54e-45a1-ac32-a8ac00856924) — "Step 4 of 4 · Review" no cabeçalho: o resumo é o último passo de uma sequência conhecida.
- [AWS](https://mobbin.com/screens/9af9f1a6-fd6e-4af7-8790-b7ae6e7c7703) — **um** Edit por cartão, campos em duas colunas.
- [Employment Hero](https://mobbin.com/screens/1a1d201b-3303-462e-bf8b-bc67632cf0b2) — Edit **e** chevron no mesmo cabeçalho.
- [Remote — checklist](https://mobbin.com/screens/ed95183c-7542-4966-87a7-581bb02b72b9) — o cabeçalho carrega o estado, então uma seção fechada ainda diz algo.
- [Origin](https://mobbin.com/screens/22a90a68-6172-4d96-a28f-dfd622dc6b1d) — texto livre ganha bloco de largura cheia.
- [Contra](https://mobbin.com/screens/4d997279-8a42-4370-8468-686a9265bbe4) — documento no próprio quadro de rolagem, assinatura ao lado.
- [Oyster / DocuSign](https://mobbin.com/screens/37671703-759d-43be-a0fb-89b45ceeaf2c) — a divulgação de registros eletrônicos é o que faz um adulto americano ler isso como assinar.
- [Dialpad](https://mobbin.com/screens/afbe1fe1-65ff-4c45-b544-56d71ebca235) — seções concluídas colapsam para um cartão com check.

### 15 · O depósito como checkout

- [Airbnb — Confirm and pay](https://mobbin.com/screens/5dae47fd-6764-4452-b208-324c253af5a8) — três cartões numerados com o cartão de preço fixo ao lado.
- [Shop / Shopify](https://mobbin.com/screens/963d3261-95be-42f3-8282-5eabe5758620) — cronograma e método são uma decisão, não duas telas.
- [Squarespace](https://mobbin.com/screens/74fdbbc4-e844-4598-9c8c-9f2a0b462a94) — o resumo termina numa linha **Due Today** em negrito, distinta do subtotal.
- [Fresha](https://mobbin.com/screens/1f95a596-cc30-4467-8cde-013944cc6fe2) — o melhor padrão "isto é um sinal" encontrado.
- [Navan](https://mobbin.com/screens/87015985-b118-443a-abfa-9ce5ce199417) — crédito futuro vira cronograma, não nota de rodapé.
- [Klarna](https://mobbin.com/screens/5651c767-a878-47e2-8e4d-f3c2da9ca488) — pegamos o extrato datado, **não** a identidade fintech.
- [Etsy](https://mobbin.com/flows/6ce72f42-9962-4bae-9b87-f534bdfc8762) — "you will not be charged until you review this order on the next page".
- [Codecademy](https://mobbin.com/screens/85a87575-2cb5-47de-a65f-80011317b961) — métodos em acordeão, só o escolhido expande.
- [Eventbrite](https://mobbin.com/screens/102a5496-3f53-405b-9539-97eed15fec56) — inscrição de taxa fixa com **zero vocabulário de carrinho**.
- [lululemon](https://mobbin.com/flows/0a9a45a0-7b9c-4e1c-b838-faa75bd1e3ed) — cada passo concluído colapsa para uma linha com Edit.
- [Stripe](https://mobbin.com/screens/8379a44e-9b7e-4341-8913-9cd1a4be3fa8) — check, uma frase nomeando a cobrança exata, dois botões. Nada mais.
- [Whop](https://mobbin.com/screens/3be227fe-e941-420f-b49f-4b2808749c1b) — o recibo como objeto: valor, referência, data, método.
- [adidas](https://mobbin.com/flows/867c5690-61bf-4e4c-9457-ca78ad4d7a11) — metade recibo, metade linha do tempo do que vem a seguir.
- [Melio](https://mobbin.com/screens/1d9bfa79-45d3-46f7-aff4-026b7ed81af7) — "eu não paguei hoje" ainda ganha uma confirmação completa.
- [Deel](https://mobbin.com/screens/eb392439-083f-4863-b60b-baa13493780b) — transferência bancária aparece como **em processamento**, não como paga.
- [Upwork](https://mobbin.com/screens/2ca97c0e-fbe7-4b16-8b71-ec429957ac4e) — estruturas de pagamento como radio cards antes de qualquer credencial.

### 16 · Enrolled

- [CRED](https://mobbin.com/screens/d019ff07-66a3-44cb-b9bc-cece1fec50d9) — eyebrow de status + frase de pertencimento, **sem confete**, e ainda assim o momento mais caro do app.
- [Qonto](https://mobbin.com/screens/e8a14e8f-026f-4010-87f3-da16d3f2ba22) e [Zing](https://mobbin.com/screens/02897cfd-94ce-430d-a253-7ecb1a2cb821) — o fim do fluxo entrega **um objeto**, não uma mensagem.
- [Qantas](https://mobbin.com/screens/f909ccea-f103-4cbd-b3a9-6545a156b123) — entrega o número de matrícula como o artefato do fim.
- [Headway](https://mobbin.com/screens/e82ee53f-9d24-458d-9846-8500317aba65) — o checklist reaparece **dentro** da celebração, com checks.
- [Greenlight](https://mobbin.com/screens/2b0ba3b6-c40d-4f63-bd84-8ff8910d7479) — os ganhos como linhas de recibo.
- [Alan](https://mobbin.com/screens/1c7a2c39-28d7-484f-acb6-9f0de113a29d) — o CTA secundário é "Use your berries": a celebração já oferece o gasto.
- [GoodRx Gold](https://mobbin.com/screens/ffc1a04c-92de-4bc6-bc73-3684de5c1cdd) — ativação mais duas ações concretas de "agora use isto".
- [Nibble](https://mobbin.com/screens/5385f415-3d0a-4d60-86f2-b50d6aaa7763) — hierarquia mínima: verbo, número gigante, um botão.
- [Beli](https://mobbin.com/screens/b486127e-a01f-4659-9abb-74b16f1f69b5) e [Calm](https://mobbin.com/screens/75c25c9b-df74-43f1-baea-e61def7bb524) — o cartão compartilhável sobre gradiente, nunca sobre a UI crua.

### ReactBits — o que ficou

`Grainient` continua no painel de entrada, e é o único chamador de `ogl`.
`SplitText`, `CountUp` e `LightRays` foram **apagados** nesta rodada: a tela de
completion que os usava foi redesenhada do zero e nada mais os importava. Com
eles saiu `gsap` e `@gsap/react` do `package.json` — o ticket 16 permitia que o
`gsap` se justificasse na chegada do cartão de estudante, e não se justificou:
um `rotateY` com overshoot é uma transição, não uma timeline. `canvas-confetti`
fica, com um único chamador.
