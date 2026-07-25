# Tema 2 — Express

Segundo tema da Etapa 2. Sai do `node:http` cru do Tema 1 e chega numa API de tarefas com rotas, validação, tratamento de erro centralizado e suíte de testes automatizados.

Stack: Node LTS (WSL/Ubuntu) · Express 5 · ESM · Vitest + supertest.

## Como rodar

```bash
npm install

node exNN.js          # sobe o servidor de um exercício específico
node ex13/server.js   # sobe a API final
npm test              # roda a suíte (vitest run)
```

Porta via `PORT`, com default 3000: `PORT=4000 node ex13/server.js`.

As requisições de cada exercício estão como comentário `curl -i` no fim do respectivo arquivo, junto com a saída obtida.

## Os arquivos

| Arquivo | O que faz |
|---|---|
| `ex01.js` | O mesmo servidor do Ex 03 do Tema 1, agora em Express — mostra o que o framework tira do caminho |
| `ex02.js` | `POST /echo` com `express.json()`; os quatro cenários de `req.body` |
| `ex03.js` | `POST /inspect/:id` devolvendo `params`, `query` e `body` juntos |
| `ex04.js` | `GET /tasks/:id` com validação de id e o primeiro 400 no formato de erro da etapa |
| `ex05.js` | As rotas de tarefas movidas para `express.Router`, montado com prefixo |
| `ex06.md` | Famílias de status, métodos HTTP e a tabela do CRUD de `/tasks` |
| `ex07.md` | Idempotência: por que o DELETE repetido muda a resposta sem mudar o estado |
| `ex08.js` | `POST` com 201 + header `Location`; 405 + header `Allow` na coleção |
| `ex09.js` | Logger artesanal com `res.on('finish')` e os experimentos de ordem/`next()` |
| `ex10.js` | `morgan` plugado ao lado do logger próprio, para comparação |
| `ex11.js` | Validação como middleware, 404 coringa e tratador de erro central |
| `ex12.js` | Erro em handler `async`: comportamento no Express 5 e as duas formas de tratar |
| `ex13/` | Versão final: `app.js` separado do `server.js`, com a suíte em `app.test.js` |
| `routes-t02/` | Router compartilhado pelos exercícios 05 a 12 |

## A API

| Rota | Sucesso | Erros |
|---|:---:|---|
| `GET /tasks` | 200 | — |
| `GET /tasks/:id` | 200 | 400 id inválido · 404 não existe |
| `POST /tasks` | 201 + `Location` | 400 title inválido |
| `PATCH /tasks/:id` | 200 | 400 · 404 |
| `DELETE /tasks/:id` | 204 | 400 · 404 |
| outro método em `/tasks` | — | 405 + `Allow` |
| rota inexistente | — | 404 |

Persistência em array na memória — some a cada restart. Postgres entra no Tema 4.

## Formato de erro

Contrato da API a partir daqui:

```json
{ "errors": [{ "field": "title", "message": "title is required" }] }
```

Sempre uma lista, mesmo com um erro só — assim um POST com vários campos inválidos cabe na mesma estrutura sem mudar o shape da resposta.

O `field` é opcional: aparece quando o erro é atribuível a uma entrada específica (`id`, `title`), permitindo que um formulário destaque o campo certo. Toda resposta de erro sai do tratador central em `app.js`; nenhuma rota responde erro direto.

## Decisões

| Decisão | Escolha | Por quê |
|---|---|---|
| Formato de erro | `{ errors: [...] }` | Organizado e explícito; suporta múltiplos erros sem mudar o shape |
| Logger | `morgan('combined')` | Mais detalhado que o logger próprio; formato que ferramentas de log já leem |
| Erro em async | wrapper `asyncHandler` | Centralizado, sem chance de esquecer um `try/catch` |
| Atualização parcial | `PATCH`, sem `PUT` | PUT substitui o recurso inteiro; PATCH altera só o que foi enviado |

## Testes

`ex13/app.test.js` — caso feliz e caso de erro de cada rota, incluindo assert do header `Location` no 201 e o DELETE repetido devolvendo 404. `resetTasks()` no `beforeEach` devolve o array ao estado inicial entre os testes.

## 3 coisas que me surpreenderam

1. O tratador de erro central — toda resposta de erro da API saindo de um lugar só
2. O `.all` com o header `Allow` para responder 405
3. O `res.location()` devolvendo o endereço do recurso recém-criado

## 1 coisa que ficou mal resolvida

Nada