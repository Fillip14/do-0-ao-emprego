# API de Tarefas

Uma API desenvolvida para o plano desta etapa a qual faz parte do projeto maior chamado do-0-ao-emprego. Posteriormente ela será utilizada em outras partes.

## Stack

Node.js com Express (padrão ESM), **TypeScript com `strict` ligado** e PostgreSQL, acessado pelo driver `pg` com pool de conexões. Testes com Vitest + supertest.

O código-fonte fica em `src/` (`.ts`) e o `tsc` gera o JavaScript executável em `dist/` — é o `dist/` que o Node roda, e ele não é versionado.

## Banco de dados

A API precisa de um PostgreSQL rodando. No WSL/Ubuntu:

```bash
sudo apt install postgresql postgresql-contrib
sudo service postgresql start          # não sobe sozinho: repetir a cada sessão
```

Crie o seu usuário do banco e os dois bancos (um de desenvolvimento, um de teste):

```bash
sudo -u postgres psql
```

```sql
CREATE ROLE seu_usuario WITH LOGIN CREATEDB PASSWORD 'sua_senha';
CREATE DATABASE tasks OWNER seu_usuario;
CREATE DATABASE tasks_test OWNER seu_usuario;
\q
```

Crie a tabela nos dois bancos a partir do schema versionado:

```bash
psql tasks      -f sql/schema.sql
psql tasks_test -f sql/schema.sql
```

Confira com `psql tasks -c '\dt'` — a tabela `tasks` deve aparecer.

### Variáveis de ambiente

A conexão é configurada pelas variáveis padrão do PostgreSQL, lidas automaticamente pelo `pg` — nenhuma credencial fica no código:

| Variável | Valor usado no projeto | Para quê |
|---|---|---|
| `PGHOST` | `/var/run/postgresql` | socket Unix local (autenticação `peer`, dispensa senha) |
| `PGDATABASE` | `tasks` / `tasks_test` | qual banco usar |
| `PGUSER` | (padrão: usuário do sistema) | role do banco |
| `PGPASSWORD` | — | só necessário em conexão TCP |

Elas já vêm definidas nos scripts do `package.json`, então `npm start` e `npm test` funcionam sem configuração extra. Conectar por socket é o que permite versionar esses valores com segurança: nenhum deles é segredo. Numa conexão remota (deploy, semana 5) a senha entra por variável de ambiente da plataforma, nunca no repositório.

## Como rodar

```bash
git clone https://github.com/Fillip14/do-0-ao-emprego.git
cd do-0-ao-emprego/etapas/etapa-2/api
npm install
npm run build
npm start
```

A API sobe em `http://localhost:3000`.

| Script | O que faz |
|---|---|
| `npm run build` | compila `src/*.ts` para `dist/` (obrigatório antes do `start`) |
| `npm start` | roda `dist/server.js` |
| `npm test` | roda a suíte no banco `tasks_test` |

O Vitest lê os arquivos `.ts` direto, **sem checar tipos**. Suíte verde não significa TypeScript limpo — quem valida isso é `npx tsc --noEmit`.

## Rotas

| Método | Caminho | O que faz | Body | Resposta |
|---|---|---|---|---|
| GET | /tasks | Lista as tarefas, da mais antiga para a mais recente | Vazio | 200 + array de tarefas |
| GET | /tasks/:id | Obtém a tarefa específica pelo id | Vazio | 200 + `{"id": "<uuid>", "title": "...", "done": false}` |
| POST | /tasks | Cria uma tarefa | `{"title": "..."}` | 201 + `{"id": "<uuid>", "title": "...", "done": false}` |
| PATCH | /tasks/:id | Atualiza o title de uma tarefa | `{"title": "..."}` | 200 + `{"id": "<uuid>", "title": "...", "done": false}` |
| DELETE | /tasks/:id | Remove uma tarefa pelo id | Vazio | 200 + `{"message": "Removed"}` |

O id é um UUID gerado pelo próprio banco. A coluna `created_at` existe na tabela (é o critério de ordenação do `GET /tasks`), mas não é exposta na resposta — as queries listam apenas as colunas do contrato.

### Erros

Todos os erros respondem `{"message": "..."}`:

| Status | Quando | Exemplo |
|---|---|---|
| 400 | `title` ausente, vazio ou não-string | `{"message": "Invalid title"}` |
| 400 | id fora do formato UUID (validado antes de chegar ao banco) | `{"message": "Invalid id"}` |
| 400 | JSON malformado no corpo | `{"message": "An unexpected error occurred"}` |
| 400 | erro do Postgres causado pelo cliente (`22P02` tipo inválido, `23514` restrição violada) | `{"message": "Invalid request data"}` |
| 404 | id válido, mas inexistente | `{"message": "Task not found"}` |
| 404 | rota não registrada | `{"message": "Not found"}` |
| 500 | falha inesperada (banco fora do ar, erro de query) | `{"message": "An unexpected error occurred"}` |

Id malformado e id inexistente são casos distintos: o primeiro é barrado na validação de entrada (400), o segundo é a ausência de linhas afetadas pela query (404).

O mapeamento de `err.code` do Postgres para 400 é uma **segunda camada de defesa**: hoje `validateId` e a validação de `title` barram esses casos antes de chegar ao banco, então ele não é alcançável pelas rotas atuais. Existe para que uma query ou restrição futura não vire 500 silenciosamente.

## Validação e tipos

TypeScript garante formato em tempo de compilação; nas bordas da aplicação (URL, corpo da requisição, resposta do banco) o tipo é apenas uma declaração de intenção. Por isso a validação em runtime continua:

- `validateId` — regex de UUID sobre `req.params.id`
- `hasValidTitle` — *type predicate* (`body is { title: string }`): checa o corpo em runtime **e** estreita o tipo para o compilador
- `query<T>` — o generic informa o formato esperado das linhas; não verifica o que o banco devolve

## Persistência

Os dados vivem no PostgreSQL — reiniciar o servidor não perde nada. Todas as queries são parametrizadas (`$1`, `$2`), sem nenhuma string do cliente concatenada no SQL. A demonstração do porquê está em [`sql/ataque.js`](sql/ataque.js).

## Testando

A pasta `bruno/` contém uma collection do [Bruno](https://www.usebruno.com) com as requisições prontas — abra no app e dispare, incluindo os casos de erro.

`npm test` roda a suíte (Vitest + supertest) cobrindo sucesso e erro de todas as rotas. Os testes usam o banco `tasks_test`, separado do de desenvolvimento, e cada teste começa com a tabela vazia.
