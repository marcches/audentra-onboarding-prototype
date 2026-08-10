# Pesquisa de referência e decisões por componente

O `spec.md` do repo de contexto (VEKEND) torna obrigatório avaliar **Mobbin**
(padrão de interação/estrutura) **e** **ReactBits** (execução/personalidade/movimento)
antes de decidir cada momento de UI — e exige que a escolha final entre
"shadcn simples" e "tratamento ReactBits" venha justificada, não como default por
falta de pesquisa. Este arquivo é esse registro.

Buscas feitas em 2026-08-10 via `mcp__mobbin__search_screens` (plataforma `web`) e
o catálogo completo do ReactBits (sitemap de `reactbits.dev`, 4 categorias:
text-animations, animations, components, backgrounds).

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

### Catálogo ReactBits — o que existe e o que foi descartado

Revisado o catálogo inteiro. Candidatos avaliados e o veredito:

| Momento | Candidatos ReactBits | Decisão |
|---|---|---|
| Celebração do aceite | `count-up`, `magic-rings`, `click-spark`, `star-border`, `prismatic-burst`, `ballpit` | **`SplitText` (instalado) + `canvas-confetti`.** Não existe componente de confete no ReactBits — nenhum dos candidatos entrega "confete estourando atrás de um modal". `canvas-confetti` faz isso e tem `disableForReducedMotion` nativo. O que o ReactBits agrega de verdade é a **entrada do headline**: `SplitText` (GSAP, char a char com blur) em "You're in.". Foi o componente usado para validar o registry. |
| Fundo do painel de marca (Entry) | `aurora`, `silk`, `light-rays`, `grainient`, `liquid-ether`, `plasma` | **Rejeitado — CSS próprio (`.brand-panel`).** Todos são canvas WebGL (OGL/three.js). Isto é a **primeira pintura do produto**: um canvas que precisa bootar antes de desenhar custa LCP e ainda exigiria fallback de `prefers-reduced-motion`. Gradiente radial em CSS com drift lento entrega o mesmo efeito, é de graça, e o reset global de reduced-motion já o desliga. |
| Acordeão do About you | `accordion-gallery`, `stack`, `scroll-stack` | **Rejeitado — shadcn `Accordion` (Radix).** O `accordion-gallery` do ReactBits é galeria de imagens, não seção de formulário; nenhum dos três dá semântica de disclosure acessível. Formulário exige Radix. |
| Passos do onboarding | `stepper` | **Rejeitado.** O `stepper` do ReactBits é um componente multi-etapa autocontido que guarda o passo em estado interno — brigaria com o requisito de "uma rota por passo, deep-linkable" do TanStack Router. |
| Ranking de residências | `animated-list`, `stack`, `bounce-cards` | **Rejeitado** — ver seção 3. |
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
