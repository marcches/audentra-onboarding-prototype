# 01 — The foundation: surfaces, motion, brand

**Status:** done

**Blocked by:** None. Everything else is blocked by this.

**What to build:** The visual system every other ticket is built against — four
surface levels, five screen archetypes, the reduced stillness ruler and its
rewritten test, and the brand tokens absorbed from the marketing site. No screen
work. The client chose a single delivery with no gate after this ticket, so this
is the one place where being wrong is expensive.

**Referências:**
- [Xero — importar bills](https://mobbin.com/screens/100b7cfe-9010-4e4e-84ab-27bc60673f87) — o Panel é dividido por régua interna e termina numa barra de rodapé colada à borda, não num botão solto embaixo dele. É a anatomia do Panel com rodapé.
- [Clerk — Overview](https://mobbin.com/screens/9b720c06-5945-4746-9d1e-c4f1a8270c51) — rodapé do Panel carrega metadado à esquerda e ação de escape à direita, como uma linha do próprio painel.
- [Airwallex — Settings](https://mobbin.com/screens/0424ee49-c5dc-4700-bccb-67ba0a54df82) — cabeçalho do Panel = título + subtítulo + uma ação secundária na mesma linha, separado do corpo por divisor.
- [Cloudflare — AI Gateway Settings](https://mobbin.com/screens/8e3ce95f-34c9-40fb-9e12-b94d6421b656) — o rótulo de seção fica **fora** do painel, no Ground. É a primeira das três exceções à regra "nada solto no fundo".
- [Jira — Select a template](https://mobbin.com/screens/31e7e771-e8fc-4f38-a672-062f2474b790) — a grade senta num Well tingido com rótulo próprio e os itens são cartões planos; o painel externo nunca encosta nos cartões.
- [Bloom — What do you want to create?](https://mobbin.com/screens/c7aa79c9-b8a4-4d60-b17a-a78cc8daa3e6) — a mesma solução com tinta de marca, e seleção marcada por preenchimento + check em vez de elevação.
- [Kit — Choose your template](https://mobbin.com/screens/5a10bd07-3ec4-453c-b116-ca44f915d63e) — quando a coleção *é* a tela, a grade dispensa o painel e fica sobre uma régua sob o título. Segunda exceção.
- [Squarespace — Review Order](https://mobbin.com/screens/74fdbbc4-e844-4598-9c8c-9f2a0b462a94) — o formulário fica no branco e só o resumo é emoldurado; emoldurar tudo apagaria o destaque. Terceira exceção.
- [lululemon — Checkout](https://mobbin.com/screens/1b90a989-8460-400b-bbcc-1747d579961e) — quando os grupos são passos do mesmo formulário sem ações independentes, um Panel com divisores comunica melhor que N painéis.
- [PayPal — Upload documents](https://mobbin.com/screens/8ea4958b-7bb4-409a-8d8c-7983b3c2e15c) — a dropzone é a única coisa rebaixada, e o arquivo enviado sai dela: o Well não acumula estado.
- [Lindy — Files](https://mobbin.com/screens/50bd3a40-45f3-44a4-a9da-fe935dffefe1) — dropzone e lista de arquivos como dois Wells irmãos no mesmo tom.
- [Mercury — Policies](https://mobbin.com/screens/98e61b35-61a0-4490-b1a9-15a7188767ce) — um Well pode ter escala de uma palavra: o valor inline vira chip rebaixado dentro do cartão.
- [Walmart — Review Order](https://mobbin.com/screens/14cb5cd9-d4c4-4165-9479-099cb38edf05) — cabeçalho de Panel levemente tingido dá duas tonalidades internas sem precisar de borda.
- [Docusign — Template](https://mobbin.com/screens/225c95a5-ae7c-4ddc-be26-45460c5eebd6) — um Well pode ser uma faixa de largura total, não só um retângulo com raio.

## The four surfaces

Distinguished by **one step of luminance and at most one border**. Shadow is
reserved for what genuinely floats: modal, popover, the fixed bar.

| Level | Holds | Never holds |
|---|---|---|
| **Ground** | page title, section label, spacing | a field, a row, an image, a datum, the primary action |
| **Panel** | anything; internal dividers; Wells | another identical Panel |
| **Well** | read-only summary, file list, dropzone, preview, thread, a grid | the primary action; an elevated card |
| **Flat card** | a collection item on a Well | anything, when there is no Well under it |

The three exceptions where content sits on the Ground, each cited above: a
catalogue that *is* the screen, a section label, and the checkout's asymmetry.

**Selection is fill + check, never elevation.** An elevated selected item rises
above its own container — this is the visible bug in Campus life and Housing
today.

## The five archetypes

`decision` · `form` · `catalogue` · `review` · `celebration`. A route composes
from its archetype's parts, not freely. A `decision` screen occupies exactly one
viewport at any width — if it does not fit it loses content, not the constraint.
Documented exception: when the object of the decision is a legally binding
document, the document scrolls inside its own Panel and the signing bar is fixed
outside it.

## The ruler, reduced

Survives — all four are about *drift*, the same element landing on different
pixels depending on how you arrived:

1. Every Step anchors its `h1` at the same pixel.
2. Nothing is born above the title.
3. The action bar is a constant height, declared once.
4. A primary button's width does not react to its own label.

Revoked, deleted from `docs/design-research.md` in this ticket:

- *A conditional block reserves its space or is an overlay* → replaced by
  **reveals directly below the control that triggered it, with an authored
  transition; nothing above the trigger moves**.
- *`Panel` never wraps a gallery* → it is what pushed catalogues onto the bare
  Ground and produced the "jogado no fundo" complaint.
- *No control exists for a catalogue that already fits* → the review call asked
  for a filter and this line forbade it.
- *One title-and-lead pair per screen* → demoted to archetype default.

`src/lib/layout-rules.test.ts` is **rewritten**, not extended: the assertions
enforcing revoked lines are deleted alongside the lines.

## Motion

`motion` is the default; `gsap` only where a timeline needs it; `ogl` gains no
new callers. Emphasis is a **ring glow**, never geometry — no scale, no growth,
no border thickening, no hover lift. A named duration/easing scale lives with the
tokens so choreography is composed from it rather than typed per component.

## Brand

Two-stop gradient stays a signal. Three new non-signal uses admitted: a very low
gradient ground under `decision` screens, the icon tile at 12% alpha, and the
progress fill — the one place the third hue earns itself by ending in the colour
of "done".

Absorbed: `deep`/`soft`/`pale` ramps for azure and mint; `tabular-nums`; a 650
weight; the icon tile; the ring glow; the row hover that nudges its own content.
The gradient-in-text value takes the darker teal that holds contrast on white.

Rejected with reasons in the spec: mesh behind content, SVG waves, coloured glow
on buttons, hover lift, viewport-scaled display type, pills as default, azure
focus ring, second type family.

## Checklist

- [ ] Four surface levels exist as tokens and as components, with the "never
      holds" rules expressible rather than remembered.
- [ ] The three Ground exceptions are the only ones, and each is named in code.
- [ ] Selection anywhere in the system is fill + check.
- [ ] Five archetypes exist; a route cannot compose outside one.
- [ ] `layout-rules.test.ts` asserts exactly the four survivors and nothing else.
- [ ] The revoked ruler lines are gone from `docs/design-research.md`.
- [ ] Azure and mint ramps, 650 weight, `tabular-nums`, icon tile, ring glow, row
      hover.
- [ ] Duration/easing scale named and used by at least one component.
- [ ] `style-guide.tsx` shows every surface, every archetype skeleton, the ring
      glow and the motion scale — it is the proof this ticket shipped.
- [ ] References above appended to `docs/design-research.md` with one line each.

## Comments

### Fechado em 2026-08-15 — `b241431`

**Onde vive:** `src/components/surfaces.tsx`, `src/styles/app.css`,
`src/lib/layout-rules.test.ts`, `src/routes/style-guide.tsx`.

As quatro superfícies são componentes, não um parágrafo: `Well` não tem como
receber a ação primária, `FlatCard` existe para ser item de coleção, e conteúdo
na Ground precisa declarar qual das três exceções é, via `OnGround reason=`.
Uma quarta exceção não pode ser adicionada sem editar a união `GroundException`,
que é onde o argumento por ela deve aparecer.

Os cinco arquétipos vêm de `steps.ts`, não de uma prop — uma rota não pode
escolher ser mais larga que o tipo de tela que ela é. O teste afirma isso
diretamente: nenhum arquivo em `routes/` pode conter `archetype=`.

`layout-rules.test.ts` foi reescrito e afirma exatamente as quatro invariantes
de deriva. As linhas revogadas saíram de `docs/design-research.md` na mesma
mudança, com o motivo registrado em vez de apagado, e ADR-0006 guarda o
raciocínio.

**Desvio a registrar:** `--catalogue-measure` e `--decision-measure` se juntaram
a `--step-measure`. São três medidas em vez de uma, e o teste agora afirma que
cada uma é declarada exatamente uma vez e que nenhum componente reatribui
nenhuma delas. A régua diz que *o mesmo passo* cai no mesmo pixel de onde quer
que se chegue nele; dois arquétipos diferentes comporem diferente é o arquétipo
fazendo o trabalho dele.
