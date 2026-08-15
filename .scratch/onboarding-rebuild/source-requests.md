# Pedidos-fonte

Extraído dos dois specs descartados (`onboarding-2026-08-14-redesign`,
`onboarding-phases-and-shell`) antes de apagá-los, e da transcrição da call de
2026-08-14 direto. Cada linha é rastreada até uma fala, não até a interpretação
que um spec fez dela — o defeito dos dois specs anteriores foi herdar conclusões
("Housing já está certo", "About you já está clusterizado") em vez de pedidos.

Este arquivo é o critério de aceite. Um pedido só sai daqui quando a tela existe
e alguém olhou pra ela.

## Da call com a Laura (2026-08-14)

| # | Pedido | Fonte | Onde vive |
|---|---|---|---|
| L01 | Ocupar menos espaço, mais compacto — "ele quer uma coisa um pouquinho mais compacta" | 00:03:50 | 01, 03 |
| L02 | UX writing melhor no accept/decline — "a gente consegue escrever melhor" | 00:05:02 | 04, 06 |
| L03 | Cards da oferta grandes demais pro que dizem; **não empilhar** — "eu não quero também empilhar" | 00:05:02 | 06 |
| L04 | Oferta fixa, sem scroll — "se a gente conseguisse deixar fixo aqui da oferta sem ter que scrollar" | 00:05:02 | 06 |
| L05 | Clusterizar contato: nome→contato→nome→contato→endereço→contato é repetição | 00:05:02, 00:09:13 | 07 |
| L06 | Nome legal em cima, upload da identidade **depois** | 00:06:29 | 07 |
| L07 | Student status decide o documento: cidadão → passaporte; residente permanente → carteira de motorista; internacional → passaporte do país | 00:06:29, 00:07:52 | 07 |
| L08 | Endereço só é requerido pra cidadão ou residente permanente; internacional não tem endereço | 00:07:52 | 07 |
| L09 | Estado e cidade em dropdown, cidade escopada pelo estado | 00:07:52 | 07 |
| L10 | Telefone não precisa de todo aquele espaço | 00:07:52 | 07 |
| L11 | Toda explicação por campo: "será que é necessário isso mesmo?" | 00:07:52 | 04, 07 |
| L12 | Mais densidade: "o volume de informações no scroll tá pequeno" | 00:09:13 | 03, 07 |
| L13 | FERPA / family access precisa de nome completo, e-mail, **parentesco** e **o que vai ter acesso** | 00:10:10 | 07 |
| L14 | Housing como Booking: carrossel de imagens, detalhes (nº de quartos, banheiro dentro/fora) | 00:11:19 | 08 |
| L15 | Off campus pode ser removido | 00:11:19 | 08 |
| L16 | Housing vem de API da universidade — fixture tem que ter forma de API | 00:11:19, 00:12:46 | 08 |
| L17 | Pesquisar o que as universidades americanas realmente oferecem em housing | 00:12:46 | 08 |
| L18 | Campus life precisa de **filtro** em cima | 00:12:46 | 09 |
| L19 | Pesquisar como funcionam clubes e interesses nas universidades americanas | 00:12:46 | 09 |
| L20 | Falta informação antes de escolher — "sinto falta de um popup que me mostre mais sobre esse clube" | 00:13:53 | 09 |
| L21 | A pergunta de acomodação **sai** do Campus life | 00:13:53 | 07, 09 |
| L22 | Novo passo **Health information**: deficiência → laudo médico; mais Immunization record | 00:13:53, 00:15:03 | 07 |
| L23 | Health é opcional no onboarding e obrigatório depois no portal — e isso tem que ser dito | 00:15:03 | 07 |
| L24 | Campus life é opcional em todo lugar | 00:15:03 | 09 |
| L25 | Review & sign mostra, por passo, **tempo estimado** e se é **obrigatório ou opcional** | 00:15:03, 00:16:02 | 02, 10 |
| L26 | Gamificação: pontos por passo, e pesquisar como funcionam bookstore points nos EUA | 00:16:02 | 05 |
| L27 | Popup de aceite tem que ser **grande** — "é pra ser um popupzão" | 00:17:07 | 06 |
| L28 | Compartilhar em Facebook e LinkedIn, com apelo — "faça parte desse time", não "se você quiser" | 00:18:20 | 04, 06 |
| L29 | Compartilhar **vale pontos** | 00:18:20 | 05, 06 |
| L30 | Mobile first em tudo que é do estudante | 00:57:49 | todos |
| L31 | Patinete, não carro esportivo — mas com a UI correta já | 00:56:44 | todos |
| L32 | Tem que parecer Salesforce: um sistema de verdade | 00:50:20 | 01, 03 |

## Do feedback de 2026-08-15

| # | Pedido | Onde vive |
|---|---|---|
| M01 | Mais entusiasta, mais teatral; animações mais demoradas | 05 |
| M02 | O item de pontos maior, mais identificável, mais devagar | 05 |
| M03 | Densidade caiu demais: rail curto demais | 02 |
| M04 | Offer ocupa só um pedaço da tela, o resto fica branco | 06 |
| M05 | About you continua uma zona; textos dos inputs não corrigidos | 04, 07 |
| M06 | Health information com fluxo estranho | 07 |
| M07 | Refazer a lógica do fluxo do zero, sem herdar o viés do agente anterior | 02 |
| M08 | Housing precisa de zoom ou visualizador full screen com navegação entre imagens | 08 |
| M09 | Falta shell pras telas de conteúdo — as coisas parecem jogadas no fundo | 01, 03 |
| M10 | Campus life com 9 itens não corresponde à realidade americana | 09 |
| M11 | O modal do clube é inútil como está; redesenhar | 09 |
| M12 | O último item do Review não é reconhecível — "bato o olho e não sei o que é" | 10 |
| M13 | Deposit: fluxo horrível, redesenhar como e-commerce | 11 |
| M14 | Enrolled: redesenhar do zero com qualidade de Mobbin | 12 |
| M15 | Absorver o melhor do site que o Ajlan aprovou — gradiente em fundo e patterns | 01 |
| M16 | **Incluir uma explicação breve da lei FERPA na tela de acesso familiar** — anotação da Laura sobre a tela, 15/08. O ponto que importa: os direitos passam dos pais para o estudante quando ele faz 18 anos ou ingressa numa instituição de ensino superior, em qualquer idade. É isso que responde "por que sou eu que decido?" | 09 |

## Pedidos que os specs anteriores registraram e nunca entregaram

- **L07, L08, L09** — a lógica condicional de Student status foi especificada em
  `onboarding-2026-08-14-redesign/issues/02` e nunca implementada.
- **L18, L20** — filtro e detalhe de clube, especificados no mesmo spec, issue 04.
- **L25** — tempo e obrigatório por passo foram implementados e depois
  **removidos** pelo issue 05 da segunda rodada. Voltam agora, por decisão
  explícita.
- **L10** — compactação do telefone, issue 03 do primeiro spec, nunca executado.

## Conclusões herdadas que este spec rejeita

Ambas vieram de `onboarding-2026-08-14-redesign/spec.md` e são a causa raiz do
retrabalho:

- *"About You's clustering and section order — already correct"*. Não estava. O
  acordeão de quatro assuntos numa tela é o defeito que a Laura descreveu, não a
  correção dele.
- *"Housing: no structural change — don't rebuild what already works"*. A ficha
  de dados não corresponde ao que universidades americanas publicam, e não havia
  como ampliar uma imagem.

---

## Passada final de entrega (2026-08-15)

Percorrido linha a linha depois da entrega. **Entregue** significa que a tela
existe e o pedido está nela; onde não está, a linha diz o que falta e por quê.

| # | Estado | Onde olhar |
|---|---|---|
| L01 | Entregue | Três Steps no lugar de um; um Panel com divisores no lugar de N painéis. |
| L02 | Entregue | `docs/copy-inventory.md` → 1 · Your offer. |
| L03 | Entregue | Fatos como linhas `rótulo → valor`, tudo num Panel só. |
| L04 | Entregue | Arquétipo `decision`: `h-dvh overflow-hidden`, uma viewport em 1440, 1280 e 390. |
| L05 | Entregue | `who-you-are`, `where-you-live`, `who-we-call`. |
| L06 | Entregue | Nome legal num Well de "já no seu registro"; o upload nasce abaixo do status. |
| L07 | Entregue | `requiredDocumentFor()`, com teste por status. |
| L08 | Entregue | `stepApplies()` e `addressSchemaFor()`, ambos testados. O Step **some** do rail. |
| L09 | Entregue | Selects em cascata; trocar o estado limpa a cidade. |
| L10 | Entregue | Uma linha: select de DDI mais número. |
| L11 | Entregue | Dois helpers sobrevivem em Who you are, cada um com motivo escrito no inventário. |
| L12 | Entregue | Medido por deleção, não por percentual: um assunto saiu da tela. |
| L13 | Entregue | `FamilyAccessGrant` com os quatro campos, e o escopo é uma escolha real. |
| L14 | Entregue | Card com foto 16:9, pílula de contagem, detalhe com atalhos por ambiente. |
| L15 | Entregue | `arrangingOwn` e `protectionOptions` saíram do código. |
| L16 | Entregue | `src/lib/housing.ts`: códigos, não frases; tarifas derivadas por `roomRate()`. |
| L17 | Entregue | ADR-0005 registra as razões do setor por trás de cada número. |
| L18 | Entregue | Quatro eixos, `catalogue.test.ts`. |
| L19 | Entregue | ADR-0004. |
| L20 | Entregue | Detalhe responde custo, tempo, como entrar e o passo real. |
| L21 | Entregue | Saiu de Campus life e virou o Step 3. |
| L22 | Entregue | `health.tsx`, com os dois uploads. |
| L23 | Entregue | Dito na linha abaixo do Panel e no rail. |
| L24 | Entregue | Optional no rail, Skip na barra. |
| L25 | Entregue | No rail **e** por seção no Review & sign, lido de `steps.ts`. |
| L26 | Entregue | ADR-0007 e a escada de `BOOKSTORE_LADDER`. |
| L27 | Entregue | Tela cheia, herói é o cartão 4:5. |
| L28 | **Parcial** | O apelo está escrito e é a voz pedida ("faça parte desse time"). **Botões por rede (Facebook, LinkedIn) não foram construídos**: não há integração de share neste protótipo e um botão com logo que não abre nada é pior que um botão genérico que abre a mesma coisa. Uma ação de compartilhar, um cartão 4:5 pronto pra ser salvo. |
| L29 | Entregue | Passa pelo mesmo `celebrate()` de qualquer Quest. |
| L30 | Entregue | Cada tela tem layout de telefone, não desktop estreitado. |
| L31 | Entregue | — |
| L32 | Entregue | As quatro superfícies, e o style guide como prova. |
| M01 | Entregue | Sete beats, ~2.6s. |
| M02 | Entregue | Token de voo com 56px; 300ms parados no meio. |
| M03 | Entregue | Quatro grupos, dez Steps, a Fase atual aberta. |
| M04 | Entregue | Composição em duas colunas que esticam juntas, sobre gradiente baixo. |
| M05 | Entregue | Copy escrita **antes** das telas, em `docs/copy-inventory.md`. |
| M06 | Entregue | Movido pra logo depois de Who you are; os três uploads ficaram contíguos. |
| M07 | Entregue | `steps.ts` reescrito do zero. |
| M08 | Entregue | `image-viewer.tsx`, demonstrável no style guide. |
| M09 | Entregue | `surfaces.tsx`. |
| M10 | Entregue | ~60 no fixture, ~420 declaradas na tela. |
| M11 | Entregue | Redesenhado como as quatro perguntas que um estudante tem antes da mesa. |
| M12 | Entregue | Abre num cabeçalho de status; as respostas vêm antes do acordo. |
| M13 | Entregue | Três telas, uma entrada de rail. |
| M14 | Entregue | Redesenhado; entrega um objeto. |
| M15 | Entregue | Rampas de azure e mint, peso 650, `tabular-nums`, icon tile, ring glow, row hover. |
| M16 | Entregue | A frase sobre a transferência do direito está sempre visível. |

### O que ficou de fora, e por quê

- **L28, botões por rede.** Acima. Deliberado.
- **Fotos por Residence.** O fixture carrega três frames por prédio porque são
  as três que este repositório possui. Um diretório real devolve dez a quinze, e
  a galeria, os atalhos por ambiente e o visualizador já funcionam sobre um
  número arbitrário — mas a demonstração de doze fotos por prédio depende de
  imagens que não existem aqui, e inventar nomes de arquivo quebraria a galeria
  em vez de enriquecê-la. Registrado no comentário do campo `photos`.
- **Roommate matching.** Fora de escopo por decisão do spec, e é o candidato
  óbvio seguinte.
- **ADR-0005 a 0007 antigos.** Nunca existiram. As seis citações no código foram
  repontadas ou reescritas na autoridade do próprio comentário; os números 0004
  a 0007 agora pertencem às decisões desta rodada.
