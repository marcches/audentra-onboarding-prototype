# Audentra — protótipo de login e onboarding

Protótipo **descartável** de Entry / Offer / About you / Housing do portal do
aluno (tenant Aster, hardcoded). Não é implementação de produção e não herda a
stack do `Audentra-portals`.

Fonte da verdade do escopo: `.scratch/login-onboarding/spec.md` e
`docs/adr/0003-prototype-in-new-stack-supersedes-0002.md` no repo de contexto
(`VEKEND`). O registro de pesquisa Mobbin/ReactBits e as decisões por componente
estão em [`docs/design-research.md`](docs/design-research.md).

## Rodando

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm typecheck  # tsc --noEmit
pnpm lint       # biome check .
pnpm format     # biome check --write .
pnpm build      # typecheck + vite build
```

## Rotas

| Rota | O que é |
|---|---|
| `/entry` | Sign in / Create account, duas abas, Create account por padrão |
| `/onboarding/offer` | Passo 1 — Accept / Decline, celebração no aceite |
| `/onboarding/about-you` | Passo 2 — quatro seções em acordeão |
| `/onboarding/housing` | Passo 3 — escolha de moradia, branch condicional |
| `/onboarding/campus-life` | Passo 4 — fora de escopo, placeholder honesto |
| `/onboarding/review` | Passo 5 — fora de escopo |
| `/onboarding/deposit` | Passo 6 — fora de escopo |
| `/style-guide` | Tokens e primitivos retematizados |

Cada passo é uma rota própria e deep-linkable — dá pra mandar o link exato da
tela em revisão.

## Stack

Vite + React 19 + TypeScript · TanStack Router (roteamento **code-based**, sem
árvore gerada, pra `tsc --noEmit` valer em checkout limpo) · Tailwind CSS 4 ·
shadcn/ui retematizado sobre os tokens · ReactBits como registry adicional ·
React Hook Form + Zod · Phosphor Icons · `motion` + `canvas-confetti` · pnpm ·
Biome.

Os primitivos do shadcn foram reescritos sobre os tokens de `src/styles/app.css`
e tiveram os ícones trocados do lucide pro Phosphor — `lucide-react` não é
dependência do projeto.

## Dados e estado

Sem API, sem auth real. Tudo vem de `src/lib/fixtures.ts` (derivado de
`raw/data/2026-08-08-audentra-student-portal-fields.md` e da captura ao vivo do
fluxo atual). O progresso fica em `localStorage` sob a chave
`audentra.onboarding.v5` — é isso que faz "seu progresso é salvo automaticamente"
existir sem backend, e é o que sobrevive a um F5 no meio do formulário.

Pra limpar o estado durante uma revisão: `localStorage.clear()` no console, ou
`resetOnboarding()` exportado de `src/lib/store.ts`.

## Testes

O repositório **tem** suíte (`pnpm test`, Vitest). Uma versão anterior deste
arquivo dizia que não tinha, e um spec inteiro foi escrito em cima disso.

Ela cobre seis costuras puras, todas de comportamento externo e nenhuma de
estrutura de componente:

| Arquivo | O que garante |
|---|---|
| `steps.test.ts` | A espinha: dez Steps, três Fases, ordem, navegação, metadados, e a ausência condicional de `Where you live now`. |
| `validation.test.ts` | Os ramos condicionais: qual documento cada Student status pede, e se o endereço participa do schema. |
| `points.test.ts` | Preço, recibo, conversão em crédito, o prêmio de compartilhar e o total anunciado. |
| `summary.test.ts` | O que Review & sign mostra: o resumo de uma linha por seção e as duas contagens. |
| `catalogue.test.ts` | O filtro de Campus life nos quatro eixos, combinados, limpos e no caso zero. |
| `layout-rules.test.ts` | As quatro invariantes de deriva, no nível do código-fonte. |

O que a suíte **não** julga é composição, tom e movimento. Isso continua sendo
revisão visual, em desktop e em 390px, com o roteiro em
`docs/review-script.md`. Não há ambiente DOM neste repositório e adicioná-lo é
uma decisão maior do que qualquer rodada até aqui deveria tomar sozinha.

## Deploy

Ainda não conectado. Repo local com git, sem remote. Quando for pro Vercel:
projeto Vite, `pnpm build`, output `dist`, sem variável de ambiente nenhuma.

## Nota de bundle

O chunk inicial fica em ~294 kB gzip (Zod 4 e Radix dominam). GSAP saiu do
`package.json` nesta rodada: a tela que o usava foi redesenhada e nada mais o
importava. `canvas-confetti` fica, com um único chamador, e `ogl` fica, com um
único chamador (`Grainient`, no painel de entrada). Pra um protótipo isso está
resolvido; pra produção, cada passo viraria rota com carregamento sob demanda.

## Acessibilidade

Piso obrigatório, incluindo nos componentes ReactBits/GSAP: responsivo até
390px, foco de teclado visível (um tratamento único em `:focus-visible`),
`prefers-reduced-motion` respeitado — reset global de animação/transição,
`useReducedMotion` desligando confete e a animação do headline, e
`disableForReducedMotion` no `canvas-confetti`.
