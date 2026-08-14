# Roteiro de revisão visual/UX

Substitui a suíte automatizada (ver `spec.md` → Testing Decisions). Cada item
abaixo era uma asserção E2E na versão anterior do spec; agora é uma coisa pra
olhar. Rode em desktop **e** em 390px de largura.

Comece limpo: `localStorage.clear()` no console, depois recarregue.

## Densidade e chrome compartilhado (rodada 3)

- [ ] Rail, page shell, context panel e o cartão do acordeão usam a mesma
      escala de espaçamento mais densa em **todos** os sete passos — nenhum
      passo destoa visualmente do outro.
- [ ] Offer: a grade de fatos e o card do depósito cabem numa rolagem mais
      curta que antes, tanto em desktop quanto em 390px.

## Entry — `/entry`

- [ ] Abre com **Create account** ativo, não "Welcome back"/Sign in.
- [ ] **Rodada 2 — o convite.** O painel esquerdo mostra um **convite impresso**
      com curso, grau, campus, prazo e número de inscrição, e a linha "Issued to"
      **em branco**. Não é mais três parágrafos de texto.
- [ ] **Rodada 2 — a escala.** Abrir a 1280, 1440, 1920 e 2560px: as duas metades
      crescem juntas e o convite cresce com elas. Nada de vão morto aumentando à
      volta do formulário.
- [ ] **Rodada 2 — sem rolagem de página.** No desktop a tela ocupa exatamente
      uma altura de viewport; se algo transbordar, rola dentro da coluna.
- [ ] **Rodada 2 — as abas não pulam.** Alternar Create account ↔ Sign in várias
      vezes: o título, as abas e o aviso de verificação **não se mexem**.
- [ ] **Rodada 2 — mobile (390px).** O formulário vem primeiro; o convite aparece
      **abaixo**, sem cantos cortados.
- [ ] **Rodada 2 — movimento reduzido.** Com a opção ligada no SO: o aurora não
      monta e o painel fica no gradiente `.brand-panel`, o convite aparece parado.
      O painel tem que estar **completo**, nunca vazio.
- [ ] Trocar pra Sign in e voltar: o thumb desliza; o e-mail já digitado continua lá.
- [ ] Telefone `555 234 5678` (com espaços) é **aceito**.
- [ ] Telefone `123` é rejeitado com "That number is too short. It should be 7 to
      14 digits after the country code." — nunca uma regex.
- [ ] Nenhum campo de telefone pede `+` — o código do país é um select.
- [ ] Senha curta: a mensagem diz o que falta, não uma política genérica.
- [ ] Banner de verificação explica que e-mail/SMS não estão ligados **como
      configuração, não como falha**.
- [ ] Preencher metade do formulário, dar F5: aba ativa, e-mail e telefone voltam.
- [ ] Criar conta leva pro Offer.
- [ ] Voltar pro `/entry` e tentar criar conta com o **mesmo e-mail** → aviso de
      conta existente apontando pra aba Sign in.
- [ ] Sign in com e-mail desconhecido → aviso dizendo que nada foi enviado nem alterado.

## Offer — `/onboarding/offer`

- [ ] Programa, grau, termo, campus, prazo e depósito visíveis antes de decidir.
- [ ] **Dois botões** (Accept / Decline). Nenhum checkbox em lugar nenhum.
- [ ] Aceitar abre um **popup centralizado com confete** — a página atrás continua
      lá, escurecida. Não houve navegação.
- [ ] O headline "You're in." entra letra a letra.
- [ ] O prompt de compartilhamento aparece e é **dispensável** — dá pra ir embora
      pelo botão primário sem tocar nele.
- [ ] Fechar o popup no X: o aceite fica registrado e você continua no Offer.
- [ ] "Next: about you" leva pro About you.
- [ ] Recomeçar limpo e **recusar**: motivo é opcional, dá pra enviar em branco.
- [ ] Depois de responder, o passo mostra a resposta registrada e a rota pra mudá-la
      (Admissions), sem oferecer os dois botões de novo.
- [ ] Com `prefers-reduced-motion: reduce` ligado no SO: sem confete, sem animação
      de letra, o popup ainda funciona.

### Aceite do offer — momento maior (rodada 3)

- [ ] O popup do aceite está **maior** que antes e mantém o confete e o headline
      letra a letra.
- [ ] O prompt de compartilhamento inclui **Facebook e LinkedIn** (além de X e
      WhatsApp) com um texto que convida a "tornar público", não um "compartilhe
      se quiser" neutro.
- [ ] O popup continua **dispensável sem compartilhar** — X ou clique fora fecha
      normalmente, sem forçar nada.
- [ ] Clicar em qualquer opção de compartilhamento (ou "Copy") soma pontos uma
      vez, visivelmente ("+20 points added"), e o total no rail sobe junto.

## About you — `/onboarding/about-you`

- [ ] É **um passo só**, com quatro seções — não três telas.
- [ ] Seções: identidade, endereço/residência, contato de emergência, autorização
      familiar (FERPA).
- [ ] Cada seção abre e fecha **independente**; dá pra ter várias abertas.
- [ ] Header recolhido mostra resumo do conteúdo e um selo de status.
- [ ] Nome legal, data de nascimento e e-mail de registro aparecem **somente leitura**,
      com cadeado e a nota de quem muda — não como input cinza.
- [ ] Contato de emergência está **aqui**, não como passo da sidebar.
- [ ] Autorização familiar está **aqui**, não como passo da sidebar.
- [ ] Marcar "dar acesso a alguém" revela nome, e-mail, escopo **e relacionamento**
      (rodada 3 — mesmas opções do contato de emergência); desmarcar volta pro
      estado "ninguém tem acesso" com texto que não parece erro.
- [ ] Recolher todas as seções e clicar "Next: housing" com campo obrigatório vazio:
      **a seção com erro abre sozinha**.

### Citizenship-conditional (rodada 3)

- [ ] Citizenship é a **primeira** pergunta da seção "Who you are", antes do
      upload de documento.
- [ ] O texto de documento exigido no upload muda com a resposta: U.S. citizen
      → passport; permanent resident → driver's license; international student
      → passport of country of citizenship.
- [ ] Escolher **International student** esconde o bloco inteiro de endereço
      (rua, unidade, cidade, estado, CEP, país, verificação de residência) e
      mostra uma linha explicando por quê — a seção continua no acordeão, só
      não pede nada.
- [ ] Trocar de International student **de volta** para um status doméstico
      (U.S. citizen, permanent resident, eligible noncitizen) reabre o bloco de
      endereço vazio — nenhum valor antigo reaparece por engano.
- [ ] Preencher o endereço, trocar pra International student e voltar: o
      endereço some e volta vazio (foi limpo, não só escondido).
- [ ] Estado é um select; cidade é um select **desabilitado até escolher o
      estado**, e a lista de cidades muda para bater com o estado escolhido.
- [ ] Trocar de estado depois de já ter escolhido uma cidade: a cidade antiga
      é limpa se não pertencer ao novo estado.
- [ ] U.S. citizen / permanent resident / eligible noncitizen continuam
      exigindo o bloco de endereço pra avançar — igual ao comportamento antigo.

### Telefone compactado (rodada 3)

- [ ] O campo de celular em "Who you are" é **uma linha só** (select de código +
      número) com uma linha de texto de ajuda abaixo — sem um rótulo em bloco
      separado acima.
- [ ] A 390px o campo não recorta nem quebra de forma estranha.
- [ ] Preencher metade, dar F5: valores e o estado aberto/fechado do acordeão voltam.
- [ ] "+ Add another person" adiciona contato; "Remove" tira.

## Housing — `/onboarding/housing`

- [ ] Cinco opções iniciais: on campus, off campus, não sei, commuting, moradia
      familiar/dependente.
- [ ] **On campus** → aparece só o ranking de residências.
- [ ] Tocar numa residência a adiciona numerada; setas reordenam; X remove.
- [ ] **Off campus** → aparece só a pergunta de proteção de tuition/housing.
- [ ] **Rodada 2 — foto por residência.** Cada opção tem foto de fachada no card.
- [ ] **Rodada 2 — galeria.** "See the room" abre um modal que começa no **quarto**,
      e alterna entre quarto / prédio / área comum.
- [ ] **Rodada 2 — arrastar.** Os cards rankeados reordenam por arrasto, com o
      card levantando um pouco na pegada.
- [ ] **Rodada 2 — teclado.** As setas ↑ ↓ de cada card fazem o mesmo trabalho, e
      o X remove. Arrastar não é o único caminho.
- [ ] "Não sei", "commuting" e "moradia familiar" → nenhuma pergunta adicional.
- [ ] Em nenhum branch aparece: tipo de quarto, preferência de banheiro, matching
      de roommate, questionário de estilo de vida, comunidades temáticas.
- [ ] Trocar de branch e dar F5: a escolha e o ranking voltam.

## Sidebar e contagem

- [ ] **Rodada 2 — a instituição lidera.** No topo do rail: brasão da Aster
      (escudo com a áster), nome, e campus · termo. A Audentra aparece só como
      crédito de uma linha no pé.
- [ ] **Rodada 2 — o brasão não é avatar de iniciais**, e o "A" da Audentra
      aparece **inteiro** em toda tela, inclusive nas que mostram a marca duas
      vezes (entry no desktop, passos no mobile).
- [ ] **Rodada 2 — filetes** separando os blocos do rail, todos no mesmo peso.
- [ ] A sidebar lista **7 passos** (rodada 3 — Health information entrou depois
      de Campus life), não 6 nem 8.
- [ ] Emergency contacts e Family permissions **não** aparecem como passos.
- [ ] O cabeçalho de cada passo diz "Step N of 7".
- [ ] Concluir Offer → o contador sobe pra "1 of 7 saved" e a barra anda.
- [ ] **Rodada 2:** nenhum passo diz "unchanged this round" — o conceito saiu.
      Os sete passos são telas reais.
- [ ] **Rodada 3 — pontos.** O rail mostra um total de pontos ao lado de "Your
      path to Aster", que só aparece depois do primeiro ponto ganho. Cada passo
      concluído ganha um selo "+N" ao lado do nome — só nos concluídos, não nos
      pendentes.

## Mobile (390px)

- [ ] Sidebar vira um cabeçalho fixo com marca e "Step N of 7".
- [ ] Nenhuma tela rola na horizontal.
- [ ] Os cards de opção do Housing são tocáveis no card inteiro, não só no radio.
- [ ] Os botões de Accept/Decline empilham e continuam com 44px+ de altura.

## Campus life — `/onboarding/campus-life` (rodada 2)

> **Ao apresentar:** a Laura nunca falou deste passo. A redução é **proposta**.

- [ ] Grade **visual** de nove clubes, com foto em cada card — não uma lista de texto.
- [ ] Passar o ponteiro pela grade: o card sob o cursor fica colorido e o resto
      dessatura (holofote). Com movimento reduzido, o holofote não aparece e as
      fotos ficam todas em cor.
- [ ] Clicar no **emblema no canto** do card marca e desmarca; o contador
      embaixo acompanha.
- [ ] **Não existem** mais: social settings, "what would you love to find",
      support topics.
- [ ] O passo continua **skippable** ("Skip for now").

### Filtro e detalhe do clube (rodada 3)

- [ ] A pergunta de acomodações **não está mais aqui** — mudou pro passo Health
      information.
- [ ] Um filtro de categoria aparece acima da grade (Sport, Arts, Outdoors,
      Social, Service, Making), multi-seleção.
- [ ] Marcar uma ou mais categorias **estreita** a grade; "Clear filter" volta a
      mostrar os nove.
- [ ] Escolher um clube e depois filtrar ele pra fora da vista: ele continua
      marcado no painel "Your picks" — o filtro não desmarca nada.
- [ ] Clicar na **foto ou no texto** do card (não no emblema) abre um modal de
      detalhe com foto maior, cadência de encontros e uma descrição mais longa —
      independente do filtro estar ativo.
- [ ] A 390px, nomes de clube com "&" (Robotics & making, Tabletop & games,
      Debate & speaking) quebram em duas linhas **sem cortar a primeira linha**
      no topo do card.

## Health information — `/onboarding/health` (rodada 3)

- [ ] A pergunta de acomodações e o aviso "não escreva dados médicos aqui" são
      os mesmos que existiam em Campus life, agora num passo próprio.
- [ ] Respondendo "Yes": aparecem dois uploads — documentação médica e registro
      de imunização — cada um se comportando como o upload de identidade
      (adicionar, remover, sem quebrar com a lista vazia).
- [ ] O passo é **opcional**: "Skip for now" não marca como concluído; "Next:
      review & sign" marca.
- [ ] O texto do passo deixa claro que onboarding não exige isso, mas o portal
      do aluno pode pedir de novo depois.
- [ ] Trocar de "Yes" pra "No" e voltar: os uploads ainda funcionam (o estado
      não quebra ao esconder/mostrar a seção).

## Review & sign — `/onboarding/review` (rodada 2)

> **Ao apresentar:** a fonte primária não cobre este passo. É **proposta**.

- [ ] O resumo lista o que você realmente respondeu nos passos anteriores —
      inclusive Campus life e Health information. Nada de campo fantasma.
- [ ] O que ficou em branco aparece como "Not answered" em itálico apagado, não
      como se fosse uma resposta.
- [ ] O endereço permanente aparece com os **nomes por extenso** (ex.: "Los
      Angeles, California"), nunca o valor cru do select ("los-angeles", "CA").
      Isso vale tanto no resumo quanto no texto do acordo em cima.
- [ ] Cada bloco tem **"Edit"** e vai direto pro passo correspondente.

### Tempo, obrigatório/opcional e pontos (rodada 3)

- [ ] Cada bloco do resumo mostra um tempo estimado ("~N min") e uma etiqueta
      Required/Optional, lidos de `steps.ts` — sem duplicar o valor em outro
      lugar.
- [ ] Trocar um valor em `steps.ts` (tempo, obrigatório, pontos) muda o resumo
      sem precisar tocar em mais nada.
- [ ] O topo do painel mostra um total de pontos ("N points earned") que bate
      com a soma dos passos realmente concluídos — nunca um máximo fixo.
- [ ] Compartilhar no popup do aceite (Offer) soma ao total mesmo sem ser um
      passo enviado.
- [ ] Os dois documentos são lidos **na tela**, num painel rolável. Nenhum PDF em
      outra aba.
- [ ] Antes de rolar até o fim dos dois: a caixa de aceite está **desabilitada** e
      o texto explica o porquê.
- [ ] Rolar cada painel até o fim: o selo muda pra "Read" e a barra fica verde.
- [ ] O nome legal aparece **somente leitura**, com cadeado.
- [ ] "Type it": digitar um nome diferente do legal → erro em linguagem humana.
- [ ] "Draw it": dá pra desenhar com o mouse/dedo, e "Clear" apaga.
- [ ] Dar F5 depois de desenhar: o desenho volta.
- [ ] "Sign and continue" só habilita com os dois documentos lidos, a caixa
      marcada e a assinatura preenchida.

## Deposit — `/onboarding/deposit` (rodada 2)

> **Ao apresentar:** proposta, não decisão da Laura. **Não há gateway** — a tela
> valida o momento, não a integração.

- [ ] O valor $500 **conta até o número** ao abrir a tela, e chega em **menos de
      um segundo** (parado com movimento reduzido).
- [ ] As três opções estão lá: pagar agora / aceitar e pagar até o prazo / pedir
      isenção. Mais "Skip for now".
- [ ] "Pay $500 now" abre um formulário de cartão que se **anuncia como simulado**.
- [ ] O número do cartão se formata em grupos de quatro; o botão só habilita com
      16 dígitos, validade MM/AA, código e nome.
- [ ] Pagar leva a um estado de sucesso com os quatro últimos dígitos, sem sair
      do fluxo.
- [ ] "Ask for a waiver" abre um campo opcional e diz que pedir não afeta a oferta.

## Completion — `/done` (rodada 2)

- [ ] **Não é um passo**: sem trilha lateral, sem "Step N of 6", e não aparece na
      sidebar dos outros passos.
- [ ] A tela **se monta em sequência**: marca, epígrafe, "YOU'RE" entrando letra
      a letra, "ENROLLED" (em mint) uma batida depois, e os quatro cartões em
      cascata.
- [ ] O título é **uma linha só, em caixa alta**, com o tracking do wordmark — e
      é a maior coisa da tela.
- [ ] **Sem confete** — ele pertence ao aceite da Offer.
- [ ] O conteúdo é **o que acontece a seguir e quando**, não um resumo do que foi
      preenchido.
- [ ] Fundo **escuro** com `LightRays` (ReactBits) vindo de cima — não é foto. O
      contraste do título contra o fundo tem que ser total.
- [ ] Cabe em **uma altura de tela** a 1440×900, sem barra de rolagem.
- [ ] Com movimento reduzido: tudo aparece de uma vez, parado e completo, o
      canvas não monta e sobra o gradiente radial.
- [ ] O link "Prototype: clear everything and start again" limpa o `localStorage`
      e volta pro `/entry` — é assim que se reinicia a demo.
