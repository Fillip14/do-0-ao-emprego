# API de Tarefas

API REST de tarefas — o back-end da Etapa 2. Nasce aqui (Tema 3, em TypeScript) e cresce até o deploy (Tema 10). É ela que a Etapa 3 (React) vai consumir.

**Status:** em construção · tarefas persistidas em **PostgreSQL** (Tema 4) · sem URL de produção ainda (Tema 9).

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

O schema versionado é o **`sql/schema.sql`** — rodado à mão via `psql`. Migrations chegam no Tema 7.

### 2. Variáveis de ambiente

`.env` na raiz da `api/` (fora do git). O `pg` lê estas variáveis sozinho quando o pool é criado sem argumento:

```
PGHOST=localhost
PGPORT=5432
PGUSER=fillip
PGPASSWORD=dev
PGDATABASE=tasks_dev
```

Os testes sobrescrevem `PGDATABASE` para `tasks_test` — nenhum teste toca o banco de desenvolvimento.

### 3. Comandos

```bash
npm install
npm run dev          # tsx watch — desenvolvimento
npm run typecheck    # tsc --noEmit
npm test             # typecheck + vitest
npm run build        # gera dist/
node dist/server.js  # sobe o build (produção)
```

## Testar à mão

A collection do [Bruno](https://www.usebruno.com/) fica em **`bruno/`** — abra a pasta no Bruno e as requests das rotas já estão montadas, incluindo os casos de erro (id inválido, corpo inválido).

> **Desatualizada desde o Tema 4:** os ids nas requests são os inteiros do armazenamento antigo, e agora `:id` é uuid — as requests por id respondem `400` até serem regravadas.

## Rotas

| Método | Rota | O que faz | Sucesso |
|---|---|---|---|
| `GET` | `/tasks` | lista todas as tarefas, da mais antiga pra mais nova (`created_at`) | `200` |
| `GET` | `/tasks/:id` | uma tarefa pelo id | `200` |
| `POST` | `/tasks` | cria uma tarefa | `201` + header `Location` |
| `PATCH` | `/tasks/:id` | altera campos de uma tarefa | `200` |
| `DELETE` | `/tasks/:id` | remove uma tarefa | `204` |

`:id` é um **uuid**. Id fora do formato é `400` (não chega ao banco); uuid bem formado que não existe é `404`.

### Página não encontrada (404)

Qualquer rota fora das acima cai num handler no fim da cadeia, que responde `404`.

### Middleware de erro central

Um error handler central (middleware de 4 parâmetros) concentra o tratamento — sem `try/catch` espalhado pelas rotas. Os handlers assíncronos são embrulhados num **`asyncHandler`**, que captura a rejeição da Promise e encaminha pro middleware central via `next(err)`. Assim um erro em qualquer rota async vira resposta tratada, não um `500` solto.

### Formato de erro

```json
{ "errors": [ { "field": "title", "message": "título é obrigatório" } ] }
```

`field` é opcional — erros que não são de um campo específico vêm só com `message`.

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
