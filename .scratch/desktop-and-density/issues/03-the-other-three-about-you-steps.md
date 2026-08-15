# 03 — Os outros três Steps de _About you_

**What to build:** _Health information_, _Where you live now_ e _Who we call, who
can see_ ganham o mesmo tratamento que _Who you are_ ganhou no 02. O aluno
atravessa a Phase inteira sem que a tela mude de linguagem no meio: mesma
densidade, mesmas Sections, mesmo beat de entrada, mesmo confete por Quest.

Lote de migração do expand–contract: três telas saem de `Panel` e entram em
`Section`. Nenhuma inventa composição — a forma foi decidida e aprovada no 02.

**Blocked by:** 02

**Status:** ready-for-agent

**Referências:**
- [Etsy — About you](https://mobbin.com/screens/827e35e4-c32a-4f05-bc21-7cffd2a2d13a) — grupos separados por régua fina e rótulo pequeno, com o endereço ocupando a linha inteira em vez de forçar simetria de duas colunas.
- [Salesforce — Event record](https://mobbin.com/screens/ce85ea59-0b33-4c35-a4d4-f46da1a72cfb) — pares label/valor em duas colunas, com o campo longo quebrando a grade quando precisa.
- [Origin — Basic info](https://mobbin.com/screens/0bff97ff-e115-4eb1-ab8b-4573437ae7a6) — label flutuante dentro do campo: a linha economizada por campo é o que faz três telas de saúde e contato caberem.
- [Vanta](https://mobbin.com/screens/d6c8a960-3253-4ca4-b4aa-06e902fa0e4e) — o contador por seção, que aqui carrega o peso: _Who we call_ tem escopo de acesso e o aluno precisa ver quanto já concedeu sem abrir tudo.

- [ ] Os três Steps usam `Section`; nenhum importa `Panel`.
- [ ] Duas colunas em `desktop`, uma em `compact`, por container query. Campos longos ocupam a linha inteira.
- [ ] _Health information_ mantém a Accommodation como opcional aqui e diz em voz alta que a exigência real vem depois no portal; o Immunization record é enviado ao lado da documentação médica, não em outra tela.
- [ ] _Where you live now_ não existe para aluno internacional, e Continue a partir de _Health information_ leva esse aluno direto a _Who we call_ — a espinha em `steps.ts` não muda.
- [ ] _Who we call, who can see_ concede Family access com escopo, e a Section recolhida mostra quem tem acesso a quê.
- [ ] Todos os campos de cada Step aparecem sem rolar em 1366×768, ou o excedente virou Section recolhida.
- [ ] Cada Step conclui com o jorro curto de confete ancorado no Balance.
- [ ] Em 390×844, cada Step rola no máximo uma tela.
