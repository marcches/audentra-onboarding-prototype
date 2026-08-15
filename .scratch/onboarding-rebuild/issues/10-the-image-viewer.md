# 10 — A way to actually see the photograph

**Status:** ready-for-agent

**Blocked by:** 01

**What to build:** A full screen image viewer, usable anywhere in the flow. The
client's request, verbatim: *"housing precisa ser possível zoom nas imagens, já
que não abre — precisamos ou do zoom pelo mouse, ou clicar e abrir só um
visualizador full screen, que pode passar entre imagens e fechar."*

It is its own ticket, ahead of Housing, deliberately. Inside the Housing ticket
it would be the last thing built and the first thing cut when time runs short —
and it is the one thing on that screen the client asked for by name.

**Referências:**
- [Careem — viewer com contador](https://mobbin.com/screens/303977eb-2a8c-4a2e-ab2e-d0d9e0ec562c) — X no topo à esquerda, contador "5 / 12" no rodapé à direita, legenda à esquerda: o topo só fecha, o rodapé carrega o metadado.
- [Shopee — rótulo dentro do viewer](https://mobbin.com/screens/76f54f9e-c43f-409e-9139-32d70f037c16) — ampliada, a foto continua rotulada com o ambiente; nunca se perde de que cômodo ela é.
- [Weverse — tira de miniaturas](https://mobbin.com/screens/d8f4f967-1c71-4dae-af9e-f3dc801c008c) — navegação por salto e não só swipe sequencial. Sem isso, doze fotos no desktop viram cliques repetidos.
- [Faire — letterbox em fundo preto](https://mobbin.com/screens/3701c325-f3d6-49fd-a3ac-9bd0bbd5c70d) — a imagem inteira, centrada, nunca cortada. Uma foto de quarto cortada não serve pra decidir nada.
- [Swarm — "10 of 40" no header](https://mobbin.com/screens/6702cfbd-6987-469c-8a75-a135246f8874) — alternativa de posição do contador quando não há legenda de rodapé.

## The viewer

- Solid black ground. The image whole, letterboxed. Never cropped.
- Top: `X`, left. Nothing else competes with it.
- Bottom: the room or category label at the left, `5 / 12` at the right. The
  counter is always **textual**, never dots — dots stop scaling past about six.
- **Desktop**: `‹ ›` at the sides, `←` `→` and `Esc` on the keyboard, and a
  thumbnail filmstrip along the bottom with the current frame outlined.
- **Mobile**: swipe to page, swipe down to close, pinch to zoom.
- Opens with the source thumbnail growing into place and the ground fading in;
  closes the same way in reverse.
- The page behind is scroll-locked with its position preserved and **does not
  shift** when the viewer opens or closes — a scrollbar disappearing and taking
  the layout with it is the classic version of this bug, and it would violate the
  drift invariants from ticket 01.
- Focus moves into the viewer on open and returns to the triggering thumbnail on
  close. `Esc` always closes.
- `prefers-reduced-motion`: it appears and disappears without the grow.

Demoable on its own in the style guide, against a set of sample images, before
Housing exists.

- [ ] Any photograph in the flow opens full screen from a single click or tap.
- [ ] Paging works by arrow key, side arrow, filmstrip click and swipe.
- [ ] `Esc` and the `X` both close; swipe down closes on mobile.
- [ ] Pinch zoom works at 390px.
- [ ] The image is never cropped at any aspect ratio or viewport.
- [ ] The counter is textual and the room label is visible while zoomed.
- [ ] The page behind does not move on open or close, at any scroll position.
- [ ] Focus enters on open and returns to the trigger on close.
- [ ] Reduced motion is honoured.
- [ ] Shown in the style guide with a sample set.
- [ ] References appended to `docs/design-research.md`.
