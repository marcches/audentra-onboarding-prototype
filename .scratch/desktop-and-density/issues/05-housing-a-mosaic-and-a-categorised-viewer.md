# 05 — _Housing_: um mosaico e um viewer categorizado

**What to build:** O aluno compara oito Residences e consegue de fato olhar para
elas. No desktop, cada ficha abre com um mosaico de fotos cuja última célula leva
a um viewer organizado por ambiente — quarto, banheiro, área comum, exterior — em
vez de um carrossel cego de 24 imagens. No telefone, o carrossel embutido
continua, porque abrir tela cheia sobre algo que já é tela cheia não é ampliar.
Os fatos de cada Residence viram linhas de rótulo e valor, e a ficha para de
ocupar o dobro da altura que precisa.

**Blocked by:** 02

**Status:** ready-for-agent

**Referências:**
- [Zillow — property detail](https://mobbin.com/screens/d5f8bb0a-fa13-4584-8ab1-b690aea56262) — mosaico de 1 foto grande + 4 pequenas com "See all 38 photos" na última célula, e os fatos em duas colunas abaixo.
- [KAYAK — hotel photos](https://mobbin.com/screens/6ef3012a-b7f4-4078-bf82-41dc8a6e0c9c) — o viewer abre com as categorias como abas horizontais, não como carrossel cego.
- [Expedia — property gallery](https://mobbin.com/screens/06d4e76f-b493-49f4-b503-49b5371e9c51) — a mesma ideia com a contagem de fotos por categoria e legenda por foto.
- [Salesforce — Task record](https://mobbin.com/screens/95e5ac90-9df1-486f-8425-b130011eb761) — os fatos como linhas label/valor, não como chips soltos.

- [ ] A ficha da Residence usa `Section`; nenhum `Panel` sobra nesta rota.
- [ ] Desktop: mosaico 1+4 no topo, última célula abrindo o viewer.
- [ ] Mobile: carrossel embutido, sem viewer de tela cheia por cima.
- [ ] O viewer abre categorizado por ambiente, com contagem por categoria.
- [ ] Tipo de quarto, banheiro, meal plan, tempo de caminhada e lavanderia aparecem como linhas de rótulo e valor em duas colunas.
- [ ] A ficha cabe em uma tela e meia em 1366×768.
- [ ] O viewer fecha sem mover a página atrás dele.
- [ ] Seleção continua sendo preenchimento e check, nunca elevação. O Shortlist continua sendo três de oito, e o custo por semestre continua fora da ficha (ADR 0003).
- [ ] Nenhum filtro foi adicionado: oito itens não pedem controle.
- [ ] A saída "arranjo minha própria moradia" continua existindo, discreta.
