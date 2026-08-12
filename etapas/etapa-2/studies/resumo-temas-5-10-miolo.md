# Resumo — o miolo dos Temas 5 a 10

> **Isto não é um `studie-tNN`.** É um recorte único, fora do formato Parte A/B/C, feito a pedido em 11/08 para dar visão geral antes de entrar tema a tema. Não substitui o `studie-t05-testes.md` (que já existe, completo) nem os `studie-tNN` que ainda vão abrir para os Temas 6 a 10 — este arquivo é referência, não fechamento de tema. Critério de seleção: só o que mais aparece em entrevista júnior de back-end e mais sustenta o próximo tema.

---

## Tema 5 — Testes a fundo

1. **Pirâmide de testes.** Unitário (função pura, sem I/O) na base, integração (rota + Express + banco) no meio, e2e (sistema no ar, atacado por fora) no topo, bem pouco. `supertest(app)` é integração, não e2e — não abre porta.
2. **AAA.** Todo teste em três blocos: Arrange (prepara) → Act (executa) → Assert (verifica). Erro comum: act dentro do assert (`expect((await request(app).get(...)).status)`) — quando quebra, não dá pra saber o que falhou.
3. **Hooks + banco de teste isolado.** `beforeEach` limpa (`TRUNCATE`, mais rápido que `DELETE` e reseta a sequência); `afterAll` fecha o pool **uma vez**, não por arquivo. Guarda obrigatória: a suíte aborta se `PGDATABASE` não for o banco de teste.
4. **Factory em vez de literal repetido.** Função que monta o objeto com padrão + overrides (`makeTask({ status: 'done' })`), nunca `const` fixa (mutação vaza entre testes) e nunca com `expect` dentro (mistura preparo com verificação).
5. **Mock só na borda.** Mockar `queryDb` numa suíte de rotas destrói o valor dela — o que se prova ali é que a query certa roda no Postgres de verdade. Mock é legítimo só pra forçar o caminho que não dá pra reproduzir de outro jeito (banco caindo no meio do teste, pra provar o 500).
6. **Testar o error handler.** É o único lugar por onde passa toda falha e o mais fácil de ficar sem teste — nenhuma rota feliz encosta nele. Mínimo: um teste que prova que erro inesperado vira 500 **sem vazar mensagem interna**.
7. **O que NÃO testar.** Biblioteca de terceiros, tipo que o TS já garante, detalhe de implementação (nome de função privada, quantas queries rodaram). Pergunta filtro: *esse teste quebra se o comportamento visível mudar, ou só se o código interno mudar?*

## Tema 6 — Arquitetura em camadas + listas de verdade

1. **Por que separar camadas.** Rota lê request/monta response; serviço decide a regra de negócio; repositório fala com o banco. Sem isso, teste de regra de negócio obriga a subir Express + Postgres — e é exatamente o estado atual da `tasks.routes.ts`, que faz SQL dentro do handler.
2. **DTO — banco ≠ resposta.** A forma que sai do `SELECT` não precisa ser igual à forma que a API devolve. Hoje isso já existe (a query nunca faz `SELECT *`), mas fica implícito — DTO é dar nome a essa fronteira.
3. **Validação com zod.** Troca o `isNewTask`/`isPatchTask` escrito à mão por um schema declarativo — e resolve o problema registrado no `api/README.md`: hoje um dado inválido devolve **um erro só** (`field: 'task'`); zod permite reportar **por campo**, que é o que o front já espera (`ApiError.fieldErrors`, escrito e sem cliente).
4. **Paginação: cursor vs offset.** `LIMIT`/`OFFSET` é simples mas fica lento em página funda e pode pular/repetir linha se alguém inserir no meio; cursor (`WHERE created_at > $último`) é estável mas mais trabalho. Para uma lista de tarefas de um usuário, offset já resolve — cursor é o passo de quando a tabela cresce.
5. **Filtros e ordenação segura.** `ORDER BY` **nunca** recebe a coluna direto da query string interpolada — é injeção de SQL na cláusula que os parâmetros (`$1`) não protegem. A defesa é allow-list em código: só as colunas permitidas viram `ORDER BY` de verdade.
6. **Injeção de dependência (nível júnior).** Não precisa de framework: o serviço recebe a função de acesso a dado como parâmetro (ou importa um módulo `repository`) em vez de chamar `queryDb` direto — isso é o que permite trocar por um dublê no teste unitário do serviço.

## Tema 7 — Migrations + ORM

1. **O problema do schema sem histórico.** Hoje o `sql/schema.sql` é aplicado à mão via `psql` — não existe registro de *quando* cada mudança aconteceu nem como desfazer uma. Um segundo desenvolvedor (ou você em outra máquina) não tem como saber se o banco dele está no schema certo.
2. **Migration up/down.** Cada mudança de schema vira um arquivo numerado com duas direções: `up` (aplica) e `down` (desfaz). O histórico de migrations aplicadas fica registrado numa tabela própria no banco.
3. **Seeds.** Dado de exemplo para popular ambiente novo — separado do schema, porque schema é estrutura e seed é dado.
4. **O que o ORM abstrai e cobra.** Abstrai SQL repetitivo (`INSERT`/`UPDATE` gerado a partir de um objeto) e migrations com CLI própria; cobra menos controle fino sobre a query e o risco do **N+1** — buscar uma lista e depois, para cada item, uma query extra (uma tarefa por vez em vez de um `JOIN`/`IN`).
5. **Por que SQL primeiro, ORM depois — e por que ainda vale nesta API.** Você já escreveu `INSERT`/`UPDATE`/`SELECT` parametrizado à mão (Tema 4) — sabe o que o ORM está gerando por baixo. Trocar agora é trocar ferramenta, não pular o aprendizado.

**Decisão em aberto, sua:** qual ferramenta de migration usar (`node-pg-migrate`, mais perto do SQL cru que você já escreveu, ou Prisma, que já traz ORM junto). Ver nota de autorização no fim.

## Tema 8 — Autenticação + segurança de borda

1. **Hash com salt, nunca reversível.** Senha nunca é guardada em texto puro nem criptografada (que se desfaz) — é hasheada com `bcrypt`, que embute o salt no próprio hash e é deliberadamente lento (dificulta força bruta).
2. **Cadastro e login — mensagens que não entregam.** `POST /auth/register` e `POST /auth/login`. Login errado (usuário não existe **ou** senha errada) devolve a **mesma mensagem genérica** nos dois casos — mensagem diferente vaza se o e-mail existe na base.
3. **Sessão × JWT.** Sessão guarda estado no servidor (precisa de storage compartilhado se escalar); JWT é auto-contido (o token carrega os dados assinados) mas não tem "logout de verdade" sem uma lista de revogação — é a limitação que você vai citar quando explicar a escolha.
4. **Middleware de auth: 401 × 403.** 401 = não autenticado (sem token ou token inválido); 403 = autenticado, mas sem permissão (token de outro usuário tentando mexer numa tarefa que não é dele). É a diferença que a prova prática do fim da etapa testa direto ("token de outro usuário").
5. **CORS a fundo + Helmet + rate limiting.** O CORS de hoje (`app.ts`) é a versão mínima, escrita à mão, para uma origem só. Este tema aprofunda: credenciais, headers expostos, comportamento em produção. Helmet fecha headers de segurança padrão; rate limiting freia força bruta no login.
6. **Dados sensíveis fora dos logs.** `morgan('dev')` já loga toda request — senha e token não podem aparecer nesse log. Checar antes de ligar auth.

## Tema 9 — Deploy

1. **Dev × teste × produção.** Três configurações diferentes pela mesma variável de ambiente (`NODE_ENV`, `PGDATABASE`) — já é o padrão desta API (`tasks_dev`/`tasks_test`); produção soma um terceiro banco, gerenciado, fora da sua máquina.
2. **`/health`.** Rota simples que responde 200 se o processo está de pé (e, numa versão mais completa, se consegue falar com o banco) — é o que o serviço de hospedagem usa para saber se reinicia o processo.
3. **Graceful shutdown.** Quando a plataforma manda `SIGTERM` (redeploy, escala), o processo não pode morrer no meio de uma request — fecha o pool do Postgres e para de aceitar conexão nova antes de encerrar.
4. **Logs estruturados.** `morgan('dev')` é para ler no terminal; produção pede log em formato que a plataforma de hospedagem consegue indexar (JSON, um evento por linha).
5. **Banco gerenciado.** Postgres como serviço, não instalado à mão — string de conexão vem de variável de ambiente da plataforma, nunca commitada.

## Tema 10 — Docker + CI

1. **Imagem × container.** Imagem é a receita (congelada); container é a receita rodando. `Dockerfile` descreve como montar a imagem da API.
2. **Multi-stage build.** Um estágio instala tudo e compila o TS; o estágio final copia só o `dist/` e as dependências de produção — imagem final menor, sem `devDependencies` nem código-fonte.
3. **`docker compose` com Postgres.** Sobe API + banco juntos localmente, com a mesma configuração que o `.env` já descreve — reproduz o ambiente sem instalar Postgres na máquina.
4. **CI: suíte verde a cada push.** Workflow do GitHub Actions roda `npm test` (que já inclui `typecheck`) a cada push, com um Postgres de serviço no próprio CI — é a suíte que hoje só roda na sua máquina passando a rodar sozinha.
5. **Badge + CD (noção).** Badge mostra o status do último workflow no README; CD é o próximo passo depois do CI verde — redeploy automático quando o push cai na `main`.

---

## O que fica de fora deste resumo

Cada tema tem mais tópicos no `plano.md` (por exemplo Tema 5 tem 15, aqui ficaram 7) — o `studie-t05-testes.md` já cobre o Tema 5 inteiro em Parte A completa. Para os Temas 6 a 10, quando abrir cada um de verdade, o `studie-tNN` de cada um retoma os tópicos que ficaram fora daqui.
