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

O enquadramento mudou com o ADR-0005: ReactBits deixa de ser avaliado e passa a
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
errado: o ADR-0005 diz que num artefato descartável o custo não rejeita, o
fallback resolve.

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
