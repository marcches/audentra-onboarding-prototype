# Identity, the broken blocks, and About you in three

Three complaints, one round. They are related more tightly than they look: the
same instinct that stripped the Audentra signature off the shell in pursuit of
Salesforce density also left prose running at Salesforce's *table* measure, and
left the About-you Phase carrying a Step too thin to justify a screen.

## What the client said

> "parece q perdemos um pouco da nossa identidade... vc focou mto em deixar
> salesforce q perdemos nossa identidade audentra q criamos. eu queria um
> salesforce tipo edtech sabe?"

> "AINDA POSSUEM TEXTOS COM O SEU BLOCO QUEBRADO OU INCONSISTENTE, DEIXANDO O
> SISTEMA COM ESPAÇO EM BRANCO ERRADO. JA FALEI PRA RESOLVER ISSO."

> "o fluxo do about you poderia melhorar, esse 'who we call...' deveria ta dentro
> de algum etapa ja, alem disso ta desalinhado o rail"

## What was measured, before anything was designed

Run at 1366×768, the viewport ADR 0008 names.

| Defect | Measurement |
|---|---|
| Rail connector misaligned | Marker centre `x=28`, line `x=23.5`. Off by 4.5px on all five groups. |
| Prose measure inside a Section | 89 characters per line (577px at 13px). The guide's prose runs at 38. Readable is 45–75. |
| Void inside a Section | `who-you-are` §3: one line of text, ~90px of empty white under it. |
| Void inside a sheet | `health` §2: dropzone, then ~140px of empty white. |
| Void under a sheet | `who-we-call`: sheet ends at y≈400, ~280px of Ground below. |
| Brand gradient in the app | 3 usages total, none of them a Section header. |

The last row is the identity complaint stated as a number. The palette was never
lost — `violet-500 #6a38ff` is the site's `--au-purple`, `azure-500 #1e5bff` is
`--au-blue`, `mint-500 #00c49a` is `--au-teal`, `ink-900 #0a1f44` is `--au-navy`,
and the display face is Satoshi in both. What was lost is every place the
identity was *expressed*.

## The seven decisions

1. **The institution leads, the platform owns the system layer.** Aster keeps
   the top of the rail. Audentra owns the eyebrow, the gradient, the type and a
   signature at the foot of the rail. A SaaS that replaces the university's crest
   with its own on the student's screen is selling the wrong story.
2. **The signature lands in two places and no more**: the Section header's
   numbered marker, and one gradient hairline at the top of the screen's work
   sheet. The guide never carries it. Once per screen is what makes it read as a
   signature rather than as a stripe on a component.
3. **Flat violet is state; the gradient is brand.** Violet-700 keeps meaning
   "you are here" and mint keeps meaning "done". The 115° violet→azure→teal
   gradient is read as material, never as status, which is the only reason it can
   sign a screen without becoming semantics.
4. **Every sheet is content-height.** `fill` and `grow` leave the system. A short
   screen shows Ground under its sheet and that is not a defect; a paragraph with
   90px of white beneath it *inside* its own block is.
5. **About you is three Steps.** The permanent address becomes a conditional
   Section inside *Who you are* — present for a citizen or permanent resident,
   absent for an international student, exactly as before but one level down.
   *Who we call, who can see* and *Health information* survive as Steps.
6. **Aster gets its own colours.** Navy and gold, flat, scoped to the crest SVG.
   The crest stops being a gradient shield with a geometric flower — which reads
   as an app icon — and becomes heraldry: shoulders, a chief, a motto ribbon, a
   founding year.
7. **Prose has a measure.** Four rules in `docs/copy-inventory.md`, applied
   across all ten screens rather than only where the finger pointed.

## The four copy rules

1. Prose inside a Section sets to a maximum of ~68ch regardless of sheet width.
2. Emphasis is a whole sentence or nothing. No bold opening and closing mid-clause.
3. A link never shares a line with the tail of a paragraph.
4. One block of prose per Section. Everything else is a field, a list, or a
   drawn empty state.

## What this round does not do

- No coach marks, no tour. Still reserved for the platform.
- No new state colour. The gold lives inside one SVG and is not a token.
- No content invented to fill a short sheet. If *Who we call* still ends at
  y≈400 once its text is fixed, it ends there.

## References

Mobbin, searched before the solution was proposed, per `docs/agents/design-references.md`:

- Connector through the marker centres, one marker per row:
  [Melio](https://mobbin.com/screens/03ef6cc6-505c-4277-bfe2-b0c068a141c1),
  [Gamma](https://mobbin.com/screens/523d6c4f-ac58-44f7-9d7a-a9881cba40f7),
  [Remote](https://mobbin.com/screens/0d2b48f4-1904-4fe9-b335-a34ca87fbb68),
  [15Five](https://mobbin.com/screens/b15499c2-0d36-47a0-a758-073e309e1a60).
  15Five and Remote both segment the line per group rather than running one
  spine, which is what keeps Closing and After from reading as Phase four.
- Numbered brand-coloured eyebrow inside dense content:
  [Remote's "01. Government ID / 02. Selfie"](https://mobbin.com/flows/24d47336-90f8-4027-9299-13ad2311ddac).
- Permanent address inside the personal-details step rather than beside it:
  [Gusto, "Personal information"](https://mobbin.com/flows/4c148fb2-f611-4b54-bc2d-4eebdb50dc58) —
  preferred name, legal name, pronouns, phone and current home address in one
  step, with the agreement at its foot.
- Emergency contact as a step of its own:
  [Remote](https://mobbin.com/flows/43b10617-7cbd-4527-b708-976aa4c1171d).
- Section header as a tonal bar in a record page:
  [Twenty](https://mobbin.com/screens/f0170497-9df6-4b27-9bdc-ab606ee77530).
