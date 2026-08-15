# 01 — Expand: o sistema novo nasce ao lado do antigo

**What to build:** Nada muda para o aluno. Ao fim deste ticket o app se comporta
exatamente como hoje, mas o sistema que os outros nove usam existe: as três
classes de largura com container query, a Presence como módulo, `Section` vivendo
ao lado de `Panel`, a escala de motion nova e a camada única de celebração. É o
**expand** do expand–contract: `Panel` continua funcionando e nenhuma tela é
migrada aqui, então nada pode quebrar.

A exceção deliberada é a escala tipográfica: ela é uma declaração única sem call
sites, então vira de uma vez neste ticket. Fazer expand–contract nela deixaria o
app com duas tipografias durante o épico inteiro.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

**Referências:**
- [Salesforce — Task record](https://mobbin.com/screens/95e5ac90-9df1-486f-8425-b130011eb761) — a anatomia da `Section`: cabeçalho com rótulo e chevron, régua fina, sem sombra em lugar nenhum.
- [Salesforce — Advanced User Details](https://mobbin.com/screens/0365bde7-c320-46a0-b2e9-3ea0bb9f8451) — o extremo da densidade e o limite dela: sem espaçamento vertical o mesmo padrão vira parede cinza. É o contra-exemplo que justifica os 16px entre Sections.
- [Pinterest — Notifications](https://mobbin.com/screens/ab0d2b06-e640-42f0-a68f-c1a638ce50cd) — a seção colapsada mostra o **valor**, não só o título. É a linha central do ADR 0010.
- [Ahead](https://mobbin.com/screens/2674831b-d1ab-4464-baa6-4a3d2e615aec) — o confete cai atrás do chip que carrega o valor ganho, e o número continua legível. É o contrato da camada de celebração.

- [ ] As três classes existem e estão declaradas num lugar só: `compact` (<768), `medium` (768–1279), `desktop` (≥1280). 1280 e não 1366, para a máquina HD real cair dentro da classe.
- [ ] Container query é a autoridade dentro da coluna do Step; media query só no shell.
- [ ] A Presence existe como **módulo de dados**, declarando as oito peças e o que cada uma é em cada classe. Não como nota em markdown — senão "exatamente oito" não é afirmável.
- [ ] `Section` existe: cabeçalho com rótulo e chevron, régua, sem sombra, e colapsada mostra o valor que guarda. O acordeão usa `grid-template-rows` ou clip, **nunca `height`**.
- [ ] `Panel` continua exportado e funcionando. Nenhuma rota foi migrada.
- [ ] A escala densa está aplicada nos tokens: corpo 13px/1.45, small 12px, `h1` de Step 24px, cabeçalho de Section 15px, 16px entre Sections. Alvo de toque não desce de 44px em `compact`.
- [ ] A escala de motion é 240/400/640/1000ms, substituindo 120/220/360/560.
- [ ] Existe **uma** camada de celebração no shell — `fixed`, `pointer-events: none`, um `<canvas>` criado uma vez — e o voo de Points já roda nela. Com `prefers-reduced-motion`, nada cai.
- [ ] O style guide mostra a escala nova, a `Section` nos dois estados e as quatro durações.
- [ ] `pnpm test` passa sem que `layout-rules.test.ts` tenha sido tocado.
