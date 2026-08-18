# 06 — The gate's shell recomposed

**What to build:** A student who has just accepted an offer walks into the same
room the portal lives in. The gate's rail, its work sheet, its action bar and its
entry screen move onto the new system, so that finishing enrollment and arriving
in the portal stop looking like two products.

The rail's group marker, the Phase names and the Closing all keep their meaning —
this is a recomposition of the shell, not a change to what the gate *is*. The
nine Steps inside it are ticket 07 and are untouched here; a shell that has moved
with Step bodies that have not is the intermediate state this ticket is allowed
to leave behind.

The institution keeps the top of the rail. Aster's crest leads and the vendor
owns the system layer — the ground, the band, the type. A SaaS that replaces the
university's arms with its own on the student's screen is selling the wrong
story, and that does not change because the system did.

**Blocked by:** 01 — The token layer, expanded.

**Status:** resolved

**Referências:**
- [Duolingo](https://mobbin.com/screens/1467f205-3b47-4515-af63-823002effe6f) — a left rail whose active item is a filled rounded pill, sitting beside dense content without competing with it.
- [Quicken](https://mobbin.com/screens/baf54f43-a35a-4e01-947e-45dd32051194) — brand colour carried in the chrome while the content area stays flat and quiet, which is the division of labour the shell needs.
- [Mercor](https://mobbin.com/screens/6ab63817-8b06-46a6-8fba-be87f0e05a6d) — the band as the thing that opens a screen inside a shell, rather than the shell itself carrying the colour.

- [ ] The gate's rail, sheet, action bar and entry screen read the new tokens
- [ ] The gate and the portal are visibly the same product
- [ ] Aster's crest still leads the rail; the vendor's mark stays at the system layer
- [ ] The Phases, the Closing and the rail's group marker keep their meaning
- [ ] The action bar is still a constant height, declared once
- [ ] Every Step still anchors its title at the same pixel
- [ ] Nothing is born above the title
- [ ] The old tokens are untouched and still resolve
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass

## Answer

The band *is* the gate's header rather than a block above it, which is what keeps "nothing is born above the title" true. Every Step anchors its `h1` at y=28, arriving by Continue and by the Review summary's edit link alike. The action bar is still a constant 64px, declared once.
