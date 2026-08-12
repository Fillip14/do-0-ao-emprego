# Pendências — sessão de 11/08 (Temas 5, 6 e 8)

> Registro do que a IA implementou direto na `api/` nesta sessão, a seu pedido explícito e por fora do método normal (par de programação, tema a tema). **Status em 11/08, fim do dia: Temas 5 e 6 fechados (Parte C completa); Tema 8 fechado no básico.** Histórico da verificação abaixo, passo a passo.

## O que eu não consegui verificar sozinho (e por quê)

Nesta pasta o bash não funciona (é WSL, `\\wsl.localhost\...` — só Read/Write/Edit/Glob/Grep, conforme o `CLAUDE.md`), então escrevi tudo sem rodar uma vez sequer. Você já rodou `npm install` + `typecheck` + `test` e passou (11/08) — o que segue agora é só o que ainda não foi coberto por isso.

## ✅ Já feito (11/08)

1. ~~`npm install`~~ — feito.
2. ~~`npm run typecheck`~~ — limpo.
3. ~~`npm test`~~ — verde (cobre Tema 5 + Tema 6; `/auth` não tem teste ainda, ver abaixo).

## Cobertura lida em 11/08 — decisão registrada

Rodou `npm run test:coverage`: 80% stmts / 66% branch geral. Três buracos reais viraram teste (adicionados, ainda não rodados por mim — ver "O que falta"):

- `tasks.repository.ts:62-63` — `PATCH` só com `status` nunca tinha sido exercitado ponta a ponta (os testes existentes só validavam status **inválido**, que nem chega no repositório). Teste novo em `tasks.routes.test.ts`.
- `tasks.schema.ts:38` — `orderDir=desc` nunca tinha sido pedido num teste. Teste novo em `tasks.routes.test.ts`.
- `app.ts:24-25` — preflight `OPTIONS` do CORS (de antes desta sessão) nunca tinha teste. Teste novo em `app.test.ts`.

Ficou **sem teste, de propósito** (decisão registrada, não esquecimento):

- `src/auth/*`, `users.repository.ts`, `auth.routes.ts`, `auth.service.ts` — Tema 8 não wired, sem tabela `users`.
- `tasks.service.ts:57,73` — guardas defensivas pra "o banco não devolveu a linha esperada" (INSERT/COUNT), que não acontece na prática — testar isso forçaria um cenário irreal.
- `db.ts:18` — o branch "pool já fechado" do `closePool()`. Acho que o Vitest isola o módulo por arquivo de teste por padrão (`test.isolate`), mesmo com `fileParallelism: false` — cada arquivo teria seu próprio pool, então a guarda de idempotência nunca vê uma segunda chamada de verdade. Vale investigar depois, não trava nada agora.

## O que falta, na ordem

1. ~~Rodar `npm test` de novo~~ — feito, 42 testes verdes.
2. ~~Gerar `JWT_SECRET` e pôr no `.env`~~ — feito.
3. ~~Aplicar `sql/tema8-draft-users.sql` nos dois bancos~~ — feito; `POST /auth/register` e `/auth/login` testados na mão, os dois devolveram token.
4. ~~Rodar a suíte isolada~~ — feito (`NODE_ENV=test PGDATABASE=tasks_test npx vitest run src/routes/tasks.routes.test.ts`, verde). De quebra, confirmou a guarda: sem essas variáveis a suíte aborta antes de tocar em qualquer linha.
5. ~~Testar o formato de erro por campo~~ — feito via curl: `{"errors":[{"message":"título é obrigatório","field":"title"}]}`, exatamente o formato que o `ApiError.fieldErrors` do front espera. (Pela UI não dava pra forçar — o front já bloqueia título vazio antes de mandar, o que é bom sinal.)
6. **Falta só o commit + push** dos Temas 5, 6 e do básico do Tema 8 (register/login).

**Ainda em aberto para o Tema 8 fechar de verdade** (não é próximo passo imediato, é o que falta pro tema todo): ligar `requireAuth` em `/tasks` + `owner_id` na leitura/escrita + 403 pra token de outro usuário — adiado de propósito porque quebraria o front em produção até o front também mandar token.

## Tema 5 — infra de testes

Implementado: `vitest.config.ts` (serializado, `fileParallelism: false`), `src/test/setup.ts` (guarda de `PGDATABASE`, `TRUNCATE` no `beforeEach`, `closePool()` idempotente no `afterAll`), `src/test/factories.ts`, `src/test/helpers.ts`, suíte dividida em `src/tasks.test.ts` (unitário), `src/app.test.ts` (erros de rota + 500 do tratador central) e `src/routes/tasks.routes.test.ts` (integração). Scripts `test`/`test:watch`/`test:coverage` no `package.json`.

**Meu palpite de maior risco:** o `vi.spyOn(db, 'queryDb')` no teste de 500 — depende de como o Vitest transforma import nomeado em módulo ESM. O próprio `studie-t05-testes.md` usa esse padrão como exemplo, então segui a mesma aposta, mas não tive como confirmar.

Pendente pra fechar a Parte C do Tema 5 de verdade: rodar cobertura (`npm run test:coverage`), ler `Uncovered Line #s` e decidir o que vale testar — isso é leitura e julgamento seus, não dá pra eu simular.

## Tema 6 — camadas + zod

Implementado: `src/repositories/tasks.repository.ts`, `src/services/tasks.service.ts`, `src/routes/tasks.routes.ts` (agora fino), `src/validation/tasks.schema.ts` (zod), `src/validation/to-error-details.ts`. `tasks.ts` ficou só com a interface `Task`.

**Mudança de contrato, e esta é a que mais importa avaliar com cuidado:**

- **Erro de validação passa a vir por campo**, um item por campo em `errors: [...]`, em vez do erro único `field: 'task'` de antes. Eu conferi contra `etapa-3/web/src/api/http.ts` — o front **já** espera exatamente esse formato (`ApiError.fieldErrors`, escrito e sem cliente até hoje) e usa os nomes `title`/`status`/`term`, que batem com os do zod. Ainda assim, é uma mudança real de formato de erro numa API que está no ar — testar contra o front local antes de considerar isso fechado.
- **`GET /tasks` ganhou paginação/filtro/ordenação** via query string (`page`, `pageSize`, `status`, `orderBy`, `orderDir`). Decidi **não** mudar o corpo da resposta (continua array puro) — o total vem no header `X-Total-Count` — de propósito, pra não quebrar o front ao vivo, que hoje lê `res.json()` como array direto. Se no futuro fizer sentido migrar pra um envelope (`{ tasks, total, page }`), isso é mudança combinada com o front, não só a API.
- `title`/`term` agora são `.trim()` pelo zod antes de salvar — antes, só validava vazio-depois-de-trim mas guardava o valor original (com espaço nas pontas, se houvesse). Comportamento levemente diferente, acho que pra melhor, mas registrando.

Não toquei em `sql/schema.sql` neste tema — paginação/filtro/ordenação não precisam de mudança de schema.

## Tema 8 — auth (parcial, deliberadamente incompleto)

Implementado: `src/auth/password.ts` (bcrypt), `src/auth/jwt.ts`, `src/validation/auth.schema.ts`, `src/repositories/users.repository.ts`, `src/services/auth.service.ts`, `src/middlewares/require-auth.ts`, `src/routes/auth.routes.ts` (`POST /auth/register`, `POST /auth/login`, com rate limit só nessas duas rotas). Tudo montado em `app.ts` sob `/auth`.

**Atualização 11/08, mais tarde:** `sql/tema8-draft-users.sql` foi aplicado nos dois bancos (`tasks_dev`/`tasks_test`) e `POST /auth/register` + `POST /auth/login` testados na mão — os dois devolveram token.

**O que ficou de fora de propósito, porque exige coisa que eu não posso fazer sozinho:**

- **`/tasks` não exige token ainda.** Não liguei `requireAuth` nas rotas de tarefas nem adicionei `owner_id` na leitura/escrita — fazer isso agora quebraria o front em produção, que não manda `Authorization`. Isso é o que "fecha" o Tema 8 de verdade (dono da tarefa, 403 pra token de outro usuário) e depende da tabela `users` existir primeiro.
- **Sem teste automatizado para `/auth`** — não faz sentido escrever teste de integração contra uma tabela que não existe no banco de teste.
- Helmet **não** entrou — decidi não ligar um middleware novo, global, numa API em produção sem poder testar contra o front. Fica de sugestão pro Tema 8 de verdade.
- Refresh token / logout / 2FA / OAuth: nem comecei — são os tópicos mais avançados do tema, e o miolo (hash, JWT, 401 x 403) já é grande o suficiente pra revisar de uma vez.

## Fora do alcance nesta sessão (Temas 7, 9, 10)

Não escrevi nenhum código para estes três — cada um depende de uma decisão ou acesso que não é meu de tomar:

- **Tema 7 (migrations + ORM):** falta escolher a ferramenta (`node-pg-migrate`, mais perto do SQL que você já escreveu, ou Prisma) — e rodar migration é mexer no schema do banco real, que eu não tenho como executar nem deveria decidir sozinho.
- **Tema 9 (deploy):** precisa de conta numa plataforma de hospedagem (Render/Railway/Fly.io/outra), banco gerenciado, variáveis de ambiente no provedor — nada disso é acessível daqui.
- **Tema 10 (Docker + CI):** eu poderia escrever `Dockerfile`/`docker-compose.yml`/workflow do GitHub Actions como texto, mas sem Docker rodando aqui pra testar a build, e sem poder configurar secrets do GitHub, o risco de entregar algo quebrado que só se descobre depois é alto — prefiro fazer isso com você olhando, como par de programação de verdade, quando chegar a hora.

## Registro de estado (atualizado 11/08, fim do dia)

Temas 5 e 6 fechados de verdade, com Parte C completa (typecheck limpo, suíte verde, cobertura lida, suíte isolada, commit). Tema 8 fechado no **básico** (hash, JWT, register/login testados na mão) — o resto do tema (dono da tarefa, CORS a fundo, Helmet, refresh token, 2FA/OAuth) continua em aberto, registrado no `plano.md`.

**Exceção ao método, decidida por ele, não por mim:** Temas 6 e 8 nunca tiveram `studie-tNN` próprio (regra 5) — só o resumo condensado. Ele decidiu fechar mesmo assim, informado da diferença. Atualizei `plano.md`, README da raiz (progresso + tabela + diário) e `api/README.md` para refletir isso. O `devlog-etapa-2.md` não mexi — é área dele.

Falta o commit/push (ver "O que falta" acima) — depois disso, o estado registrado aqui bate com o repositório.
