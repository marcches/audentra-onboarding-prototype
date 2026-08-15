# 02 — Prose gets a measure

Status: ready-for-agent

**What to build:** A student reading anything the flow explains — the FERPA
paragraph, the accommodation note, the deposit terms — reads lines that stop at a
width a person can hold their place in. Prose inside a Section stops tracking the
sheet's width, and the four rules that govern it are written down so the next
screen inherits them instead of rediscovering them.

Measured on `who-we-call` at 1366×768: the FERPA paragraph sets at **89
characters per line** (577px at 13px). The same size of prose inside the style
guide sets at **38**. The readable band is 45–75. Same system, same type, 2.3×
apart. That is the whole of "texto com o bloco quebrado ou inconsistente" — a
paragraph 20% past the reading limit cannot be rescued by the words inside it,
and the bold clause dropped into the middle of it has nowhere to land.

Fields, lists, tables and drawn empty states are unaffected. They were never the
problem, and capping them would put a 68ch limit on a two-column field grid.

**Blocked by:** None — can start immediately. Runs beside 01.

**Referências:**
- [User Interviews — Consent settings](https://mobbin.com/screens/c33026b2-c480-4f27-96f2-685785200e2e) — the consent notice, the help callout and the preview all keep one narrow measure while the page around them is wide. The legal block is the one thing on the screen that refuses to use the width, which is the decision this ticket encodes.
- [Clerk — Legal](https://mobbin.com/screens/64495603-2e48-4214-922d-2022463a27e2) — the explanatory line under each control is capped short while the field beside it spans the panel. Prose and field are measured separately in the same block.

- [ ] A `--measure-prose` token is declared once in the theme and no component reassigns it
- [ ] A `Prose` element carries the token, and prose inside a Section uses it
- [ ] The FERPA paragraph sets inside 45–75 characters per line at 1366×768, down from 89
- [ ] Fields, lists, tables and drawn empty states keep the width they have
- [ ] Emphasis is a whole sentence or nothing: no bold clause opening and closing mid-sentence anywhere in the flow
- [ ] A link never shares a line with the tail of a paragraph
- [ ] One block of prose per Section; everything else is a field, a list, or a drawn empty state
- [ ] All nine screens are swept, not only the one the client pointed at
- [ ] The four rules are written into `docs/copy-inventory.md` beside the rules already there
- [ ] The layout ruler asserts the token is declared once and never reassigned
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
