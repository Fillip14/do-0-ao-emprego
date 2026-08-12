# API de Tarefas

API REST de tarefas — o back-end da Etapa 2. Nasce aqui (Tema 3, em TypeScript) e cresce até o deploy (Tema 10). É ela que a Etapa 3 (React) vai consumir.

**Status:** Etapa 2 **encerrada incompleta em 11/08/2026** (decisão dele, ver [`../plano.md`](../plano.md#encerramento)) · tarefas persistidas em **PostgreSQL** (Tema 4) · roda só **local**, sem URL de produção (Tema 9 não feito).

> **11/08 — Temas 5, 6 e 8 fechados no back-end, fora do método normal (sem par de programação).** `npm install`+`typecheck`+`test` verdes em cada passo, cobertura lida e decisão registrada, suíte isolada confirmada. Tema 8: `/tasks` agora exige token e checa dono (403 pra tarefa de outro usuário) — testado com dois usuários reais na suíte. **O front nunca chegou a mandar token** — decisão registrada de fechar a etapa sem essa emenda, não pendência esquecida.

> **Este contrato tem um cliente de verdade desde 10/08/2026:** o front da Etapa 3, em [`../../etapa-3/web/`](../../etapa-3/web/README.md), publicado e consumindo estas rotas. **Desde o Tema 8, `/tasks` responde `401` pra quem não manda token, e o front nunca foi atualizado pra mandar um — o CRUD contra esta API está quebrado, local e em produção**, até alguém retomar o Tema 8 do lado do front.

## Como rodar

### 1. Postgres

O banco é um processo separado, não um arquivo do projeto — precisa estar de pé antes da API.

```bash
# instalar (WSL Ubuntu)
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo service postgresql start          # repetir a cada sessão do WSL

# usuário e os dois bancos (dev e test, isolados)
sudo -u postgres psql -c "CREATE USER fillip WITH PASSWORD 'dev' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE tasks_dev  OWNER fillip;"
sudo -u postgres psql -c "CREATE DATABASE tasks_test OWNER fillip;"

# aplicar o schema nos dois
npm run db:schema
```

O schema versionado é o **`sql/schema.sql`** — rodado à mão via `psql`. Migrations de verdade (Tema 7) não chegaram a acontecer; ficou registrado como pendência em [`../plano.md`](../plano.md#encerramento).

### 2. Variáveis de ambiente

`.env` na raiz da `api/` (fora do git). O `pg` lê estas variáveis sozinho quando o pool é criado sem argumento:

```
PGHOST=localhost
PGPORT=5432
PGUSER=fillip
PGPASSWORD=dev
PGDATABASE=tasks_dev
JWT_SECRET=            # Tema 8 — gerar com `openssl rand -hex 32`; sem isto, /auth derruba com erro claro
```

Os testes sobrescrevem `PGDATABASE` para `tasks_test` — nenhum teste toca o banco de desenvolvimento.

### 3. Comandos

```bash
npm install
npm run dev            # tsx watch — desenvolvimento
npm run typecheck      # tsc --noEmit
npm test               # typecheck + vitest run (uma passada, não fica em watch)
npm run test:watch     # vitest em watch, sem typecheck — pro dia a dia
npm run test:coverage  # vitest run --coverage
npm run build           # gera dist/
node dist/server.js     # sobe o build (produção)
```

## Testar à mão

A collection do [Bruno](https://www.usebruno.com/) fica em **`bruno/`** — abra a pasta no Bruno e as requests das rotas já estão montadas, incluindo os casos de erro (id inválido, corpo inválido).

> **Desatualizada desde o Tema 4:** os ids nas requests são os inteiros do armazenamento antigo, e agora `:id` é uuid — as requests por id respondem `400` até serem regravadas.

## Rotas

| Método | Rota | O que faz | Auth | Sucesso |
|---|---|---|:---:|---|
| `GET` | `/tasks` | lista as tarefas do dono do token, paginada — ver query params abaixo | 🔒 | `200` |
| `GET` | `/tasks/:id` | uma tarefa pelo id (só do dono) | 🔒 | `200` |
| `POST` | `/tasks` | cria uma tarefa pro dono do token | 🔒 | `201` + header `Location` |
| `PATCH` | `/tasks/:id` | altera campos de uma tarefa (só do dono) | 🔒 | `200` |
| `DELETE` | `/tasks/:id` | remove uma tarefa (só do dono) | 🔒 | `204` |
| `POST` | `/auth/register` | cria usuário | — | `201` + `{ token }` |
| `POST` | `/auth/login` | autentica | — | `200` + `{ token }` |

🔒 = exige header `Authorization: Bearer <token>` — sem ele, `401`. Com token de outro usuário numa tarefa que não é dele, `403`.

`:id` é um **uuid**. Id fora do formato é `400` (não chega ao banco); uuid bem formado que não existe é `404`; uuid que existe mas não é do dono do token é `403`. Em `PATCH`/`DELETE`, essa ordem (`400` id → `404` não existe → `403` não é seu) roda **antes** da validação do corpo.

### `GET /tasks` — query params (Tema 6)

| Param | Default | Notas |
|---|---|---|
| `page` | `1` | página, começando em 1 |
| `pageSize` | `20` | máx. `100` |
| `status` | — | filtra por `todo`/`doing`/`done` |
| `orderBy` | `created_at` | ou `title` — allow-list em código, nunca a coluna vinda direto da query |
| `orderDir` | `asc` | ou `desc` |

O corpo continua sendo o **array puro** de tarefas (não virou envelope), para não quebrar o front ao vivo. O total de linhas (sem paginação) vem no header **`X-Total-Count`**.

`/auth` ainda não é exigido por nenhuma rota de `/tasks` — tarefas ainda não têm dono. Isso é o que fecha o Tema 8 de verdade (ver seção própria abaixo).

### Página não encontrada (404)

Qualquer rota fora das acima cai num handler no fim da cadeia, que responde `404`.

### Middleware de erro central

Um error handler central (middleware de 4 parâmetros) concentra o tratamento — sem `try/catch` espalhado pelas rotas. Os handlers assíncronos são embrulhados num **`asyncHandler`**, que captura a rejeição da Promise e encaminha pro middleware central via `next(err)`. Assim um erro em qualquer rota async vira resposta tratada, não um `500` solto.

### CORS

Um middleware escrito à mão em `app.ts`, **primeiro da cadeia**, libera a origem `http://localhost:5173` (o dev server do Vite) e responde ao preflight `OPTIONS`. Sem ele o navegador bloqueia toda requisição do front.

Ser o primeiro é de propósito: assim a resposta de **erro** também carrega o header. Se ele viesse depois, um `400` chegaria ao navegador sem permissão de leitura e um erro de validação apareceria na tela como erro de CORS.

Foi a **exceção única** ao congelamento da API durante a Etapa 3, entregue em 09/08 sem o pacote `cors` — cinco linhas contra uma dependência nova, e o header que resolve o problema fica visível. O assunto **CORS a fundo** (origem, credenciais, cabeçalhos expostos, produção) é do Tema 8.

### Formato de erro

```json
{ "errors": [ { "field": "title", "message": "título é obrigatório" } ] }
```

`field` é opcional — erros que não são de um campo específico vêm só com `message`. Um `POST`/`PATCH` inválido pode devolver **mais de um item** no array (um por campo que falhou) — desde o Tema 6, ver abaixo.

> **Limitação antiga, paga no Tema 6:** dado inválido devolvia um erro só, com `field: 'task'` (`isNewTask`/`isPatchTask` eram um type guard único). O código novo usa zod e reporta por campo — confirmado via curl contra a API local: `{"errors":[{"field":"title","message":"título é obrigatório"}]}`, o formato que o `ApiError.fieldErrors` do front já esperava.

## Schema da `Task`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `string` (uuid) | gerado pelo banco (`gen_random_uuid()`), imutável (`readonly`) |
| `title` | `string` | obrigatório, não vazio |
| `status` | `'todo' \| 'doing' \| 'done'` | um dos três valores |
| `term` | `string \| null` | prazo (data) ou `null` quando sem prazo |

- **Corpo do `POST`:** `title`, `status`, `term` (sem `id` — o banco gera).
- **Corpo do `PATCH`:** qualquer subconjunto dos campos acima, menos `id` — **pelo menos um**. `term: null` limpa o prazo; campo ausente não é tocado.
- A tabela tem uma coluna **`created_at`** (`timestamptz`, `now()`) que **não** é exposta em nenhuma resposta — as queries listam colunas explicitamente, nunca `SELECT *`.

## Decisões de contrato

Registradas conforme o tema avança.

### Tema 8 — Auth (fechado no back-end 11/08; front não feito, etapa encerrada)

- **Tabela `users`** aplicada nos bancos dev e test (`sql/tema8-draft-users.sql`). `/auth/register` e `/auth/login` testados na mão, os dois devolveram token.
- **Senha:** `bcrypt`, custo 12, hash com salt embutido — nunca reversível.
- **Token:** JWT de vida curta (1h), `sub` = id do usuário, `email` no payload. Sem refresh token e sem lista de revogação ainda — limitação conhecida.
- **Mensagem de login inválido é genérica** (`E-mail ou senha inválidos`) tanto para usuário inexistente quanto para senha errada, e sempre `401`. No cadastro, e-mail duplicado é `400` com mensagem específica — é a UX normal de registro, o cuidado de não vazar é só no login.
- **`/tasks` exige token.** `requireAuth` ligado no topo de `tasks.routes.ts` — sem `Authorization: Bearer <token>`, `401` antes de qualquer rota (inclusive nos handlers de 405).
- **Toda tarefa tem dono.** `POST /tasks` grava `owner_id` do token — nunca do corpo da requisição (defesa contra mass assignment: o cliente não escolhe de quem é a tarefa). `GET /tasks` só lista as do dono; tarefa de outro usuário nunca aparece.
- **403 para token de outro usuário.** `GET/PATCH/DELETE /tasks/:id` conferem posse: id inexistente → `404`; id existe mas não é do dono do token → `403`. Tarefas órfãs (criadas antes do Tema 8, `owner_id null`) caem no `403` pra todo mundo — não são de ninguém.
- **Ordem de checagem em `PATCH`/`DELETE`: posse antes do corpo.** Um `PATCH` com corpo inválido em tarefa que não existe ou não é sua responde `404`/`403`, não `400` — não vale a pena validar payload de recurso que você nem pode tocar.
- **`owner_id` nunca aparece na resposta** — mesmo padrão do `created_at` desde o Tema 4: coluna interna, nunca exposta.
- **CORS libera o header `Authorization`** (`Access-Control-Allow-Headers: Content-Type, Authorization`) — sem isso o preflight bloqueava o token antes de sair do navegador.
- **Helmet ligado**, primeiro middleware do `app.ts` — headers de segurança padrão.
- Rate limit (`express-rate-limit`) só em `/auth/register` e `/auth/login`.
- **Falta pro tema fechar de ponta a ponta:** o front ainda não manda token nenhum (login, guarda de rota real, `Authorization` no fetch). Não vai acontecer nesta etapa — decisão de encerramento em 11/08, ver [`../plano.md`](../plano.md#encerramento).

### Tema 6 — Camadas + zod (fechado 11/08)

- **Camadas:** rota (`routes/tasks.routes.ts`) só lê request/monta response; regra de negócio e validação em `services/tasks.service.ts`; SQL isolado em `repositories/tasks.repository.ts`.
- **Validação com zod** (`validation/tasks.schema.ts`) no lugar de `isNewTask`/`isPatchTask` — `NewTask`/`TaskPatch` agora são `z.infer` do schema, fonte única. `title`/`term` passam por `.trim()` antes de salvar (antes só validava, não normalizava).
- **Erro por campo** (ver seção *Formato de erro* acima) — mudança de formato de resposta em rota que o front já consome.
- **Paginação/filtro/ordenação em `GET /tasks`** via query string, documentado acima. `orderBy`/`orderDir` só aceitam valores de um allow-list (`orderableColumns` no schema) — nunca a coluna crua da query, que quebraria a defesa contra SQL injection no `ORDER BY`.
- **Corpo de `GET /tasks` continua array puro** (decisão deliberada, ver acima) — total vem em header, não em envelope, para não quebrar o front ao vivo.

### Tema 4 — PostgreSQL

- **`id` é uuid gerado pelo banco**, não inteiro sequencial.
- **`term` é `text`, não `timestamptz`** — `timestamptz` mudaria o formato do campo no JSON da resposta.
- **As regras de validação existem em dois lugares de propósito:** `isNewTask`/`isPatchTask` no TS e `CHECK`/`NOT NULL` no schema. O código devolve `400` com mensagem útil; o banco é a última linha, que vale mesmo para quem escrever nele por fora da API.
- **Todo valor externo entra como `$n`.** Zero concatenação — inclusive no `SET` dinâmico do PATCH, onde os **nomes** de coluna saem de allow-list em código e os **valores** vão parametrizados.
- **`RETURNING` no POST/PATCH/DELETE**, e a ausência de linha decide o `404` — sem `SELECT` extra pra "ver se existe".
- **Pool único** exportado pelo `db.ts`, com um `query` fino por cima.
- **`queryDb<T>` é uma afirmação, não uma prova:** o genérico não valida nada em runtime, então a lista de colunas do `SELECT`/`RETURNING` precisa bater com o tipo pedido. Validação de verdade na saída do banco fica pro Tema 6 (zod).
- **Banco de teste isolado** (`tasks_test`), limpo entre os testes.

### Tema 3 — TypeScript
- **Rigor máximo:** `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `verbatimModuleSyntax` — escolhido pra aprender, encarando na mão o que o compilador cobra.
- Convenção **`interface` × `type`:** entidade/modelo = `interface` (ex.: `Task`); derivados e uniões = `type` (ex.: `NewTask`, `Status`). Cada um no que é bom, e fica legível pra quem lê o contrato.
- **`parseTask` — validação por exceção, não `Result`:** dado inválido → `throw` no formato de erro padrão, que sobe pelo `asyncHandler` e cai no tratador central (→ 400). Escolhido pra reusar a infra de erro do T2 em vez de abrir um segundo caminho só pro parse.

### Herdadas do Tema 2 — Express
- Formato de erro `{ errors: [{ field?, message }] }`.
- `asyncHandler` no lugar de `try/catch`.
- `morgan` como logger.
- `validateId` como middleware — valida o `:id` antes do handler.

## Arquitetura

- Armazenamento: **PostgreSQL** via `pg`, com pool e queries parametrizadas.
- `src/` — código-fonte · `sql/` — schema versionado · `bruno/` — collection de testes à mão · `dist/` — build gerado (fora do git).
- Desde o Tema 6, dentro de `src/`: `routes/` (lê request/monta response) → `services/` (regra de negócio + validação) → `repositories/` (SQL) — nessa ordem de dependência. `validation/` tem os schemas zod. `middlewares/` tem o que é transversal (`asyncHandler`, `requireAuth`). `auth/` tem hash de senha e JWT, isolados do resto. `test/` tem setup/factories/helpers compartilhados pela suíte.
