# API de Tarefas

API REST de tarefas — o back-end da Etapa 2. Nasce aqui (Tema 3, em TypeScript) e cresce até o deploy (Tema 10). É ela que a Etapa 3 (React) vai consumir.

**Status:** em construção · armazenamento em memória (array) → PostgreSQL no Tema 4 · sem URL de produção ainda (Tema 9).

## Como rodar

```bash
npm install
npm run dev          # tsx watch — desenvolvimento
npm run typecheck    # tsc --noEmit
npm test             # typecheck + vitest
npm run build        # gera dist/
node dist/server.js  # sobe o build (produção)
```

## Rotas

Base: `/tasks`. Corpo e respostas em JSON.

| Método | Rota | O que faz | Sucesso |
|---|---|---|---|
| `GET` | `/tasks` | lista todas as tarefas | `200` |
| `GET` | `/tasks/:id` | uma tarefa pelo id | `200` |
| `POST` | `/tasks` | cria uma tarefa | `201` + header `Location` |
| `PATCH` | `/tasks/:id` | altera campos de uma tarefa | `200` |
| `DELETE` | `/tasks/:id` | remove uma tarefa | `204` |

## Página não encontrada (404 coringa)

Qualquer rota fora das acima cai num handler coringa no fim da cadeia, que responde `404` no formato de erro padrão.

## Tratador de erro central

Um error handler central (middleware de 4 parâmetros) concentra o tratamento — sem `try/catch` espalhado pelas rotas. Os handlers assíncronos são embrulhados num **`asyncHandler`**, que captura a rejeição da Promise e encaminha pro tratador central via `next(err)`. Assim um erro em qualquer rota async vira resposta tratada, não um `500` solto.

## Formato de erro

Toda resposta de erro segue:

```json
{ "errors": [ { "field": "title", "message": "título é obrigatório" } ] }
```

`field` é opcional — erros que não são de um campo específico vêm só com `message`.

## Decisões-contrato

Registradas conforme o tema avança (regra 8 do plano).

### Tema 3 — TypeScript
- **Rigor máximo:** `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `verbatimModuleSyntax` — escolhido pra aprender, encarando na mão o que o compilador cobra.
- Convenção `interface` × `type`: *a decidir no Marco 1.*
- `Result` × exceção no `parseTask`: *a decidir no Marco 3.*

### Herdadas do Tema 2 — Express
- Formato de erro `{ errors: [{ field?, message }] }`.
- `asyncHandler` no lugar de `try/catch`.
- `morgan('combined')` como logger.
- Só `PATCH` (alteração parcial), sem `PUT`.
- `validateId` como middleware — valida o `:id` antes do handler.

## Arquitetura

- Armazenamento: array em memória (Tema 3) → PostgreSQL (Tema 4).
- `src/` tem o código-fonte; `dist/` é o build gerado (fora do git).
