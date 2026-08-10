# Roteiro de revisão visual/UX

Substitui a suíte automatizada (ver `spec.md` → Testing Decisions). Cada item
abaixo era uma asserção E2E na versão anterior do spec; agora é uma coisa pra
olhar. Rode em desktop **e** em 390px de largura.

Comece limpo: `localStorage.clear()` no console, depois recarregue.

## Entry — `/entry`

- [ ] Abre com **Create account** ativo, não "Welcome back"/Sign in.
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
- [ ] Marcar "dar acesso a alguém" revela nome, e-mail e escopo; desmarcar volta
      pro estado "ninguém tem acesso" com texto que não parece erro.
- [ ] Recolher todas as seções e clicar "Next: housing" com campo obrigatório vazio:
      **a seção com erro abre sozinha**.
- [ ] Preencher metade, dar F5: valores e o estado aberto/fechado do acordeão voltam.
- [ ] "+ Add another person" adiciona contato; "Remove" tira.

## Housing — `/onboarding/housing`

- [ ] Cinco opções iniciais: on campus, off campus, não sei, commuting, moradia
      familiar/dependente.
- [ ] **On campus** → aparece só o ranking de residências.
- [ ] Tocar numa residência a adiciona numerada; setas reordenam; X remove.
- [ ] **Off campus** → aparece só a pergunta de proteção de tuition/housing.
- [ ] "Não sei", "commuting" e "moradia familiar" → nenhuma pergunta adicional.
- [ ] Em nenhum branch aparece: tipo de quarto, preferência de banheiro, matching
      de roommate, questionário de estilo de vida, comunidades temáticas.
- [ ] Trocar de branch e dar F5: a escolha e o ranking voltam.

## Sidebar e contagem

- [ ] A sidebar lista **6 passos**, não 8.
- [ ] Emergency contacts e Family permissions **não** aparecem como passos.
- [ ] O cabeçalho de cada passo diz "Step N of 6".
- [ ] Concluir Offer → o contador sobe pra "1 of 6 saved" e a barra anda.
- [ ] Passos fora de escopo (Campus life, Review & sign, Deposit) abrem e dizem
      explicitamente que não foram mexidos nesta rodada.

## Mobile (390px)

- [ ] Sidebar vira um cabeçalho fixo com marca e "Step N of 6".
- [ ] Nenhuma tela rola na horizontal.
- [ ] Os cards de opção do Housing são tocáveis no card inteiro, não só no radio.
- [ ] Os botões de Accept/Decline empilham e continuam com 44px+ de altura.
