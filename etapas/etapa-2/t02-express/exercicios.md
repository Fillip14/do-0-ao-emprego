# Tema 2 — Express · Enunciados

> Pasta: `etapas/etapa-2/t02-express/` · **Projeto novo e autocontido**: `npm init`, `npm install express`, e `npm start` / `npm test` funcionam aqui dentro. A pasta do Tema 1 fica congelada — não edite nada lá.
> Regra da etapa: **fase REVISOR** — nada de código pronto. Você escreve, roda, e só depois eu reviso (antes→depois).
> **Nomes de arquivo e identificadores em inglês**; enunciados, comentários e respostas em português.
> **Commit por exercício.** Mensagem no formato `t02: ex03 params query body`.

## Antes de começar — ambiente (checklist)

- [ ] Pasta nova `t02-express/` com `npm init` respondido (sem `-y`)
- [ ] `npm install express` — o Express entra em `dependencies`, não em devDeps. Confira no package.json.
- [ ] `vitest` + `supertest` em `devDependencies` (vão ser usados do Ex 13, mas instale agora)
- [ ] Cliente HTTP com collection salva: **Bruno** ou Postman, arquivo da collection commitado nesta pasta
- [ ] `.gitignore` com `node_modules/`

O `curl` continua sendo obrigatório: a collection é conforto, o `curl -i` é a prova.

---

## Ex 01 — 📖 O que o Express acrescenta ao `http` cru

**Arquivo:** `ex01-why-express.md` (+ `ex01-server.js`)

1. Reescreva **em Express** o servidor do Ex 03 do Tema 1 (JSON em `/`, texto em `/about`, 404 no resto). Mesmo comportamento visível, código novo.
2. Coloque os dois arquivos lado a lado — o cru (copiado do T1, como referência) e o novo — e liste **3 coisas concretas que o Express fez por você**. Nada genérico tipo "facilita": aponte a linha do código cru que sumiu.
3. Responda: o Express **substitui** o `node:http` ou **usa** ele por baixo? Ache a evidência (o que `app.listen()` devolve?) e cole.
4. Uma frase: o 404 do Express aparece sozinho — de onde ele vem, se você não escreveu nenhum `if`?

---

## Ex 02 — 🔨 `express.json()` e o `req.body`

**Arquivo:** `ex02-json-body.js`

Rota `POST /echo` que devolve o corpo recebido de volta, como JSON.

Comprove nesta ordem e cole as saídas:

```bash
curl -i -X POST localhost:3000/echo -H "Content-Type: application/json" -d '{"title":"comprar pão"}'
```

1. **Com** `app.use(express.json())` — o que veio no `req.body`?
2. **Sem** o middleware (comente a linha) — o que veio? Exatamente o quê: `undefined`, `{}`, ou erro?
3. Com o middleware ligado, mande um JSON **quebrado** (`-d '{"title":'`). Que status volta? Quem respondeu isso?
4. Mande sem o header `Content-Type`. O que muda?

**Responda no fim:**

- Ligando com o Tema 1: o `express.json()` está fazendo qual trabalho que você viu na mão no Ex 04 (streams)?
- Uma frase: por que isso é *opt-in* e não vem ligado por padrão?

---

## Ex 03 — 🔨 As três portas: `params` × `query` × `body`

**Arquivo:** `ex03-three-inputs.js`

Rota `POST /inspect/:id` que responde:

```json
{ "params": {...}, "query": {...}, "body": {...} }
```

Escreva **um único curl** que preencha os três de uma vez, e cole comando + resposta no arquivo.

**Responda:**

- Qual dos três é obrigatório pela rota, e quais são opcionais?
- Qual o `typeof` de cada valor que chegou? Alguma surpresa?
- Onde **não** se manda senha: query, body ou header? Por quê? (Pense em log de servidor e histórico do navegador.)

---

## Ex 04 — 🔨 Rotas com parâmetro

**Arquivo:** `ex04-route-params.js`

`GET /tasks/:id` que devolve `{ id, typeofId }`.

1. Chame com `/tasks/7` e com `/tasks/abc`. Cole as duas respostas.
2. O `typeof` do id é o que você esperava? Escreva sua previsão **antes** de rodar.
3. Faça a rota devolver **400** quando o id não for um inteiro positivo. Decisão sua: `{ "error": "..." }` em qual formato? Escreva o formato escolhido no arquivo — **ele vale pra etapa inteira** a partir daqui.
4. Adicione `GET /tasks/:listId/items/:itemId` e mostre o `req.params` com dois parâmetros.

**Responda:** por que tudo chega como string, se você mandou um número na URL?

---

## Ex 05 — 🔨 `express.Router`

**Arquivos:** `ex05-app.js` + `routes/tasks.routes.js`

Mova todas as rotas de tarefas para um router próprio, plugado com `app.use('/tasks', tasksRouter)`.

1. As rotas dentro do router **não** repetem o prefixo `/tasks` — confirme que continuam respondendo na mesma URL de antes.
2. Mude o prefixo pra `/api/tasks` mexendo em **uma linha só**. Prove com curl.
3. Volte pro `/tasks`.

**Responda:**

- O que o Router é, na prática? (Dica: o que acontece se você der `console.log(typeof tasksRouter)`?)
- Que problema isso resolve num arquivo de 40 rotas?

---

## Ex 06 — 📖 Semântica REST: verbos e status

**Arquivo:** `ex06-rest-table.md`

**De memória, sem consultar** (consulte só depois, para corrigir em outra cor/seção): monte a tabela do CRUD completo de `/tasks`.

| Ação | Verbo | URL | Status de sucesso | Erros possíveis |
|---|---|---|---|---|

Depois justifique, uma frase cada:

- Por que **201** no POST e não 200?
- Por que **204** e não 200 com corpo no DELETE?
- **400** × **404**: qual a diferença exata? Dê um exemplo de cada na sua API.
- **422** existe — por que você vai (ou não vai) usar? Decisão sua.
- Por que `GET /tasks/delete/7` é errado, se "funciona"?

Marque o que você errou na versão de memória. Isso é matéria de entrevista.

---

## Ex 07 — 📖 Idempotência

**Arquivo:** `ex07-idempotency.md`

1. Com a API rodando, rode o **mesmo DELETE duas vezes**. Cole as duas respostas.
2. A segunda mudou. Explique por que isso está **certo** e não é um bug.
3. Classifique GET, POST, PUT, PATCH, DELETE em idempotente / não idempotente — e diga qual é o único **inseguro e não idempotente**.
4. Cenário: o app do celular manda um POST, a rede cai antes da resposta chegar, e o app tenta de novo. O que acontece? E se fosse PUT?
5. Uma frase: idempotente é o mesmo que "devolve sempre a mesma resposta"? (Cuidado — não é.)

---

## Ex 08 — 🔨 Resposta bem-feita: `Location` e 405

**Arquivo:** `ex08-good-responses.js`

1. `POST /tasks` devolvendo **201** + header `Location: /tasks/<id>` apontando pro recurso criado. Comprove com `curl -i` e depois faça um `GET` na URL que veio no `Location` — tem que achar.
2. Faça `DELETE /tasks` (na coleção, sem id) devolver **405** com o header `Allow` listando os métodos válidos.
3. Cole os `curl -i` dos dois casos.

**Responda:**

- Qual a diferença entre 405 e 404 pro cliente que tá chamando errado?
- O `Location` é obrigatório? O que o cliente ganha com ele?

---

## Ex 09 — 🔨 Middleware: ordem e `next()`

**Arquivo:** `ex09-middleware.js`

Logger artesanal, escrito por você, que imprime por request: **método · url · status · duração em ms**.

O pulo do gato: o status só existe *depois* da resposta. Descubra como esperar por isso (procure `res.on('finish')`).

Depois, experimentos — registre a observação de cada um:

1. Ponha o logger **antes** de `express.json()` e depois **depois**. Muda alguma coisa no que ele consegue ver?
2. Ponha o logger **depois** das rotas. Ele ainda roda? Por quê?
3. Num middleware qualquer, **esqueça o `next()`** de propósito. O que o curl faz? Quanto tempo fica assim?
4. Chame `next()` **e** `res.send()` no mesmo middleware. O que o Node reclama?

**Responda:** o que é, em uma frase, a "fila de middlewares"? E o que o `next()` realmente faz?

---

## Ex 10 — 🔨 `morgan`

**Arquivo:** `ex10-morgan.js` (+ nota no fim)

1. `npm install morgan`, plugue `morgan('dev')` junto com o seu logger do Ex 09.
2. Faça 3 requests e cole a saída dos dois lado a lado.
3. Teste outro formato (`combined`) e cole.

**Decisão sua, justificada em 2 frases:** qual fica na API final — o seu ou o morgan? Não existe resposta certa; existe resposta defendida. Anote o que o perdedor fazia melhor.

---

## Ex 11 — 🔨 Validação + tratador de erro central

**Arquivo:** `ex11-validation.js`

Três peças, nesta ordem:

1. **`validateTitle`** — middleware que barra title ausente, vazio, só espaços, ou que não seja string. Passou → `next()`. Não passou → erro.
2. **Tratador de erro central** — o middleware de **4 parâmetros** `(err, req, res, next)`, registrado por último. Toda resposta de erro da API sai **daqui**, no formato que você definiu no Ex 04. Nada de `res.status(400).json(...)` espalhado pelas rotas.
3. **404 coringa** — `app.use` no fim, pra rota inexistente cair num JSON seu, não no HTML do Express.

Comprove: title vazio → 400 no seu formato · rota fantasma → 404 no seu formato · id inexistente → 404. Cole os três `curl -i`.

**Responda:**

- Como o erro do middleware chega no tratador? (Teste `throw` síncrono e `next(err)` — os dois funcionam?)
- Por que o tratador tem que ser o **último** registrado?
- O que **nunca** pode aparecer na resposta de erro em produção? (Rode um erro de propósito e olhe a resposta com atenção.)

---

## Ex 12 — 🔨 Erro em handler async

**Arquivo:** `ex12-async-errors.js`

1. Handler `async` que faz `throw new Error('boom')` depois de um `await`.
2. Chame com curl. **O pedido pendura ou volta erro?** Registre o tempo real e o que apareceu no terminal do servidor.
3. Descubra a sua versão do Express (`npm ls express`) e explique o comportamento observado — 4 e 5 fazem coisas diferentes aqui.
4. Corrija de duas formas: **try/catch com `next(err)`** e um **wrapper** (`asyncHandler(fn)`) que faz isso sozinho. Deixe as duas no arquivo.

**Responda:**

- Por que o Express 4 não enxerga o erro de uma promise rejeitada? (Volte no Ex 06 do Tema 1.)
- Qual das duas correções vai pra API final e por quê?

---

## Ex 13 — 🔨 Testes com supertest

**Arquivos:** `app.js` + `server.js` + `app.test.js`

O passo que destrava tudo: **separar o app do servidor**. `app.js` monta e exporta o app (sem `listen`); `server.js` importa e dá `listen`. O teste importa o `app.js` e nunca sobe porta nenhuma.

Suíte cobrindo, para cada rota do tema, **um caso feliz e um caso de erro**:

- `GET /tasks` → 200 e corpo array
- `GET /tasks/:id` → 200 · id inválido → 400 · id inexistente → 404
- `POST /tasks` → 201, com `Location` no header e o corpo criado · title vazio → 400 **no seu formato de erro**
- `DELETE /tasks/:id` → 204 · repetido → 404
- rota fantasma → 404 no seu formato

Requisitos:

1. `npm test` **verde**.
2. Quebre uma validação de propósito e veja o teste **vermelho**. Cole as duas saídas.
3. Pelo menos um teste que verifica **header** (`Location` ou `Content-Type`), não só status.

**Responda:**

- Por que o supertest não precisa de `listen`? O que ele faz com o app?
- Se o teste passa mas o `server.js` não sobe, seu teste teria pego? O que isso diz sobre o que ele cobre?

---

## Fechamento do tema

**Arquivo:** `README.md` na pasta do tema

- O que cada arquivo `exNN` faz, em uma linha
- Como rodar (`npm start`, `npm test`)
- **O seu formato de erro** documentado (é contrato da API daqui pra frente)
- **3 coisas que te surpreenderam**
- **1 coisa que ficou mal resolvida** — eu uso no checkpoint

**Checkpoint do tema** (verde/amarelo/vermelho) contra a âncora de 28/09: me chame quando os 13 estiverem commitados e no push. Aí eu faço o **code review de tudo**, em formato antes→depois.

---

## Como pedir ajuda nesta fase

✅ "Me explica por que o `next()` some com a resposta" · "Meu Ex 11 dá esse erro: [erro]" · "Terminei o Ex 05, revisa"
❌ "Escreve o middleware de erro pra mim" · "Me dá o código do supertest"

Travou mais de 30 min no mesmo ponto? Me chame — descrevendo **o que você já tentou**.
