# Tema 2 — Express · Enunciados

> Pasta: `etapas/etapa-2/t02-express/` · **Projeto novo e autocontido**: `npm init`, `npm install express`, e `npm start` / `npm test` funcionam aqui dentro. A pasta do Tema 1 fica congelada — não edite nada lá.
> Regra da etapa: **fase REVISOR** — nada de código pronto. Você escreve, roda, e só depois eu reviso (antes→depois).
> **Nomes de arquivo e identificadores em inglês**; enunciados, comentários e respostas em português.
> **Commit por exercício.** Mensagem no formato `t02: ex03 params query body`.
> **Formato dos enunciados:** cada exercício abre com **Estudar** — o conceito explicado com exemplo em código — e fecha com o bullet **Ex NN**, que é o que você faz. Dúvida sobre o conceito, pergunta no chat; não é cola.

## Antes de começar — ambiente (checklist)

- [X] Pasta nova `t02-express/` com `npm init` respondido (sem `-y`)
- [X] `npm install express` — o Express entra em `dependencies`, não em devDeps. Confira no package.json.
- [X] `vitest` + `supertest` em `devDependencies` (vão ser usados do Ex 13, mas instale agora)
- [X] Cliente HTTP com collection salva: **Bruno** ou Postman, arquivo da collection commitado nesta pasta
- [X] `.gitignore` com `node_modules/`

O `curl` continua sendo obrigatório: a collection é conforto, o `curl -i` é a prova.

---

## Ex 01 — 🔨 O que o Express acrescenta ao `http` cru

**Arquivo:** `ex01.js`

**Estudar:** `express()`, `app.get`, `res.json` × `res.send` × `res.status`, `app.listen`, a fila de rotas e o `finalhandler`.

```js
import express from 'express';
const app = express();

app.get('/ping', (req, res) => {
  res.json({ pong: true });
});

app.listen(3000, () => console.log('ouvindo na 3000'));
```

`res.json(obj)` = `JSON.stringify` + `Content-Type: application/json` + fecha a resposta, tudo numa linha. `res.send('texto')` adivinha o `Content-Type` pelo tipo do argumento. `res.status(404)` só muda o número, não responde — encadeia: `res.status(404).json({...})`.

Comparado ao `ex03-raw-http.js` do T1, sumiram três coisas: o roteamento (`if (req.url === ...)` → `app.get`), a serialização (`writeHead` + `end(JSON.stringify(x))` → `res.json(x)`) e o 404 na mão.

O Express **não substitui** o `node:http` — usa por baixo. `app.listen()` devolve um `Server`, a mesma classe que o `createServer()` do T1 devolvia.

O 404 aparece sozinho porque suas rotas são uma **fila**, não um `switch`: o Express percorre de cima pra baixo e, se ninguém casar, cai no `finalhandler` — registrado por último, responde 404. Repare que vem em HTML, não JSON; você troca isso no Ex 11.

- **Ex 01** — servidor em Express com o mesmo comportamento do Ex 03 do T1: JSON em `/`, texto puro em `/about`. **Não escreva o 404**, deixe o Express dar o dele. Comprove com `curl -i` nas três situações e cole as saídas. Repare no `Content-Type` do `/about`: no cru você cravou `text/plain`, com `res.send()` o Express decide sozinho e vem diferente.

---

## Ex 02 — 🔨 `express.json()` e o `req.body`

**Arquivo:** `ex02.js`

**Estudar:** `app.use` e o conceito de middleware, `express.json()`, `req.body`.

```js
app.use(express.json());        // antes das rotas

app.post('/users', (req, res) => {
  console.log(req.body.nome);   // "Ana"
});
```

No Ex 04 do T1 você viu o corpo chegar picado em pedaços via `req.on('data')`. Juntar os pedaços, virar string, dar `JSON.parse` e tratar erro é trabalho repetido em toda rota que recebe dados. O `express.json()` é um **middleware** que faz isso uma vez, antes das rotas, e pendura o resultado em `req.body`.

Quatro detalhes que pegam:

- **Sem a linha, `req.body` é `undefined`** — não `{}`.
- **`undefined` some do JSON.** `res.json({ body: undefined })` sai como `{}`, porque `JSON.stringify` descarta chaves `undefined`. Confira com `console.log` no servidor, não pela resposta.
- **Só age se o `Content-Type` for `application/json`.** Por isso é *opt-in*: nem toda API recebe JSON (upload, formulário, XML), e parsear tudo por padrão é desperdício e superfície de ataque.
- **JSON quebrado → 400 automático**, respondido pelo próprio Express.

- **Ex 02** — rota `POST /echo` que devolve o corpo recebido de volta. Rode os quatro casos e cole as saídas: (a) com `express.json()`, (b) com a linha comentada, (c) com JSON quebrado (`-d '{"title":'`), (d) sem o header `Content-Type`.

  ```bash
  curl -i -X POST localhost:3000/echo -H "Content-Type: application/json" -d '{"title":"comprar pão"}'
  ```

---

## Ex 03 — 🔨 As três portas: `params` × `query` × `body`

**Arquivo:** `ex03.js`

**Estudar:** `req.params` × `req.query` × `req.body` — as três entradas de dados de uma requisição.

| Onde | Na URL / corpo | No código | Obrigatório? |
|---|---|---|---|
| `params` | `/users/`**`7`** | `req.params.id` | **Sim** — é parte do caminho; sem ele a rota nem casa |
| `query` | `/users?`**`ativo=true`** | `req.query.ativo` | Não — `undefined` se ausente |
| `body` | corpo do POST | `req.body.nome` | Não — e depende do `express.json()` |

```js
app.post('/users/:id', (req, res) => {
  console.log(req.params.id);    // "7"     ← caminho
  console.log(req.query.ativo);  // "true"  ← depois do ?
  console.log(req.body.nome);    // "Ana"   ← corpo
});
```

Cada um tem seu papel: `params` identifica *qual* recurso, `query` filtra/ordena/pagina, `body` carrega o conteúdo novo. Trocar de lugar é erro clássico de júnior — tipo mandar filtro no body de um GET.

**Tipos:** `params` e `query` chegam **sempre como string** (a URL é texto puro). O `body` mantém os tipos, porque passou por `JSON.parse` — `{"done": true}` chega boolean de verdade.

**Senha nunca vai na query.** A URL aparece no histórico do navegador, no log de acesso do servidor, no header `Referer` mandado pra terceiros e em qualquer proxy no caminho. Senha e token vão no body ou no header `Authorization`.

- **Ex 03** — `POST /inspect/:id` respondendo `{ params, query, body }`. Escreva **um único curl** que preencha os três de uma vez; cole comando e resposta.

---

## Ex 04 — 🔨 Rotas com parâmetro

**Arquivo:** `ex04.js`

**Estudar:** sintaxe `:param`, múltiplos params, validação na borda, formato de erro da API.

```js
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});
// GET /users/7   → { "id": "7" }
// GET /users/abc → { "id": "abc" }   ← casa também!
```

Vários params no mesmo caminho funcionam: `/lists/:listId/items/:itemId` enche `req.params` com as duas chaves.

**A pegadinha:** a rota casa com **qualquer coisa**. `/users/abc`, `/users/-1`, `/users/999999999999` — todas entram no handler, todas como string. Quem valida e converte é você. Repassar isso direto pro banco é o buraco que o Tema 4 explora.

**Formato de erro — decisão sua, vale pra etapa inteira.** Quando a validação falha você responde 400 com um JSON. O formato é escolha sua, mas escolha agora e mantenha até o deploy: cliente de API precisa de erro previsível.

```js
{ "error": "invalid id" }                               // simples
{ "error": { "code": "INVALID_ID", "message": "..." } }  // com código
{ "errors": [{ "field": "id", "message": "..." }] }      // lista, boa pra formulário
```

A terceira escala melhor quando um POST tem 5 campos inválidos de uma vez; a primeira é a mais rápida de escrever. Saber defender a escolha é matéria de entrevista.

- **Ex 04** — `GET /tasks/:id` devolvendo `{ id, typeofId }`; chame com `/tasks/7` e `/tasks/abc` e cole as respostas. Depois: 400 no **seu formato** quando o id não for inteiro positivo (cole o `curl -i`), e uma rota `GET /tasks/:listId/items/:itemId` mostrando os dois params. No topo do arquivo, o formato de erro escolhido + justificativa em uma linha.

---

## Ex 05 — 🔨 `express.Router`

**Arquivos:** `ex05.js` + `routes/tasks.routes.js`

**Estudar:** `express.Router`, montagem com prefixo, router como middleware.

```js
// routes/users.routes.js
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => { ... });      // vira GET /users
router.get('/:id', (req, res) => { ... });   // vira GET /users/:id

export default router;
```

```js
// ex05.js
import usersRouter from './routes/users.routes.js';

app.use('/users', usersRouter);   // o prefixo mora AQUI, uma vez só
```

Dentro do router os caminhos são **relativos** — `'/'` e `'/:id'`, sem repetir `/users`. O prefixo é colado no `app.use`.

**Pra que serve:** num app de 40 rotas sem router você tem um arquivo de 600 linhas, o prefixo repetido 40 vezes (trocar `/users` por `/api/users` = 40 edições) e zero separação entre domínios. Com routers, cada recurso ganha seu arquivo e o app vira um índice de 10 linhas.

**O detalhe que importa:** `Router()` devolve uma **função** — `console.log(typeof router)` mostra. É a mesma natureza de um middleware, recebe `(req, res, next)`. Por isso entra num `app.use` igualzinho ao `express.json()`. Router e middleware são a mesma coisa por baixo: o Express é uma pilha de funções do começo ao fim.

- **Ex 05** — mova as rotas de tarefas pra `routes/tasks.routes.js`, plugado com `app.use('/tasks', tasksRouter)`; confirme com curl que respondem nas mesmas URLs. Depois mude o prefixo pra `/api/tasks` mexendo em **uma linha só**, prove com curl, e volte pro `/tasks`.

---

## Ex 06 — 📖 Semântica REST: verbos e status

**Arquivo:** `ex06.md`

**Estudar:** o contrato REST do CRUD — qual verbo, qual URL, qual status.

| Ação | Verbo | URL | Sucesso | Erros |
|---|---|---|---|---|
| listar | GET | `/tasks` | 200 | — |
| ler uma | GET | `/tasks/:id` | 200 | 400 id inválido · 404 não existe |
| criar | POST | `/tasks` | **201** + `Location` | 400 entrada inválida |
| substituir | PUT | `/tasks/:id` | 200 | 400 · 404 |
| alterar campo | PATCH | `/tasks/:id` | 200 | 400 · 404 |
| apagar | DELETE | `/tasks/:id` | **204** (sem corpo) | 404 |

Por quê:

- **201, não 200, no POST** — 200 diz "deu certo"; 201 diz "deu certo **e criei um recurso novo**, ele está no `Location`". O cliente sabe que agora existe uma URL nova.
- **204 no DELETE** — não sobrou nada pra devolver. 204 significa "sucesso, e o corpo está vazio de propósito" — o cliente não fica tentando parsear um JSON que não existe.
- **400 × 404** — 400 é *"o que você mandou está errado"* (id `abc`, title vazio). 404 é *"o que você mandou está bem formado, mas não existe aqui"* (id `99` válido, tarefa apagada). Confundir os dois faz o cliente tentar corrigir o que não tem conserto.
- **422** — alguns times usam pra "sintaxe ok, semântica inválida" (JSON válido mas `title` vazio), reservando 400 pra JSON quebrado. É legítimo e é decisão sua; o importante é ser consistente.
- **`GET /tasks/delete/7` é errado** porque põe a ação na URL. Em REST o **verbo** diz a ação e a **URL** diz o recurso. Além de feio, é perigoso: GET é presumido seguro — um crawler, um preload do navegador ou um antivírus abrindo links apagaria suas tarefas.

- **Ex 06** — monte essa tabela **de memória, sem consultar**, e só depois compare com a de cima marcando o que errou. Escreva as justificativas com as suas palavras. É matéria de entrevista.

---

## Ex 07 — 📖 Idempotência

**Arquivo:** `ex07.md`

**Estudar:** idempotência, métodos seguros × inseguros, o que acontece quando o cliente reenvia.

**Idempotente** = repetir a chamada deixa o **servidor** no mesmo estado. Não quer dizer "devolve sempre a mesma resposta" — essa é a confusão clássica.

| Método | Seguro (não altera nada) | Idempotente |
|---|:---:|:---:|
| GET | ✅ | ✅ |
| PUT | ❌ | ✅ — mandar o mesmo objeto 5× dá o mesmo resultado de 1× |
| DELETE | ❌ | ✅ — depois da 1ª, já não existe; continua não existindo |
| PATCH | ❌ | ⚠️ depende (`{done:true}` sim; `{views: +1}` não) |
| **POST** | ❌ | ❌ — **o único inseguro e não idempotente** |

**O DELETE repetido:** 1ª vez 204, 2ª vez 404. A resposta mudou, mas o estado do servidor não — a tarefa está ausente nos dois casos. Isso é idempotente e está certo.

**Por que isso importa na prática:** o app manda um POST, a rede cai antes da resposta chegar, o app não sabe se deu certo e tenta de novo → **duas tarefas criadas**. Com PUT o mesmo cenário é inofensivo, porque o cliente escolhe o id e reenviar sobrescreve. É por isso que sistemas de pagamento usam chave de idempotência: transformam um POST num "só uma vez, mesmo que chegue dez".

- **Ex 07** — com a API rodando, rode o mesmo DELETE duas vezes e cole as duas respostas. Escreva com as suas palavras por que a resposta mudar não é bug, e monte a tabela de idempotência de memória antes de olhar a de cima.

---

## Ex 08 — 🔨 Resposta bem-feita: `Location` e 405

**Arquivo:** `ex08.js`

**Estudar:** `res.set`/`res.location`, header `Location` no 201, status 405 e header `Allow`.

```js
app.post('/tasks', (req, res) => {
  const task = { id: 7, ...req.body };
  res.status(201).location(`/tasks/${task.id}`).json(task);
});

app.all('/tasks', (req, res) => {          // pega os métodos não tratados
  res.set('Allow', 'GET, POST').status(405).json({ error: 'method not allowed' });
});
```

**`Location`** é opcional pela spec, mas é o que fecha o ciclo: o cliente acabou de criar algo e ainda não sabe o id. Sem o header ele teria que cavar o JSON de resposta ou listar tudo de novo. Com ele, o próximo request já sai pronto — e é assim que cliente automatizado (e o supertest do Ex 13) navega.

**405 × 404** dizem coisas diferentes pro cliente: 404 = "essa URL não existe, procura outra". 405 = "a URL existe, o **método** é que está errado". O header `Allow` completa a dica, listando o que vale ali. Devolver 404 pra método errado manda o cliente caçar um bug que não existe.

- **Ex 08** — `POST /tasks` devolvendo 201 + `Location`; comprove com `curl -i` e depois faça um GET na URL que veio no header (tem que achar). Depois faça `DELETE /tasks` (na coleção, sem id) devolver 405 com `Allow`. Cole os dois `curl -i`.

---

## Ex 09 — 🔨 Middleware: ordem e `next()`

**Arquivo:** `ex09.js`

**Estudar:** anatomia de um middleware, ordem de registro, `next()`, `res.on('finish')`.

```js
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {                 // dispara quando a resposta termina
    console.log(req.method, req.url, res.statusCode, Date.now() - start + 'ms');
  });

  next();                                  // passa a bola pro próximo
});
```

Um middleware é só uma função `(req, res, next)` na fila. Cada request percorre a fila **na ordem em que você registrou** até alguém responder. `next()` chama o próximo da fila; `next(err)` pula direto pro tratador de erro (Ex 11).

O pulo do gato do logger: **o status não existe ainda** quando o middleware roda — a resposta nem começou. Por isso você registra um listener em `res.on('finish')` e loga depois, com a duração fechada.

Três erros que valem provocar de propósito:

- **esquecer o `next()`** → o request fica pendurado até o timeout do cliente; nenhum erro aparece no servidor. É o bug mais confuso do Express.
- **chamar `next()` e responder no mesmo middleware** → a fila continua e alguém tenta responder de novo: `ERR_HTTP_HEADERS_SENT`.
- **registrar depois das rotas** → só roda se nenhuma rota tiver respondido, porque a fila é sequencial.

- **Ex 09** — logger artesanal imprimindo método · url · status · ms. Depois registre a observação de cada experimento: (a) logger antes × depois do `express.json()`, (b) logger depois das rotas, (c) middleware sem `next()`, (d) `next()` + `res.send()` juntos.

---

## Ex 10 — 🔨 `morgan`

**Arquivo:** `ex10.js`

**Estudar:** `morgan`, formatos `dev` × `combined`, quando usar lib pronta × código próprio.

```js
import morgan from 'morgan';

app.use(morgan('dev'));        // colorido, curto, pra desenvolvimento
app.use(morgan('combined'));   // formato Apache, pra produção/análise
```

O `morgan` é o logger do Ex 09 pronto, testado e configurável. `dev` é enxuto e colorido por faixa de status; `combined` é verboso (IP, timestamp, user-agent, referer) e é o formato que ferramentas de análise de log já sabem ler.

O que ele **não** faz: log estruturado em JSON, correlação por request-id, campos do seu domínio. Pra isso existe o `pino`, que entra no Tema 9. Escrever o seu no Ex 09 não foi desperdício — foi pra você saber o que a lib faz por baixo antes de confiar nela.

- **Ex 10** — instale, plugue `morgan('dev')` junto com o seu logger, faça 3 requests e cole as duas saídas lado a lado. Teste o `combined` e cole. **Decisão sua, justificada em 2 frases:** qual fica na API final. Anote o que o perdedor fazia melhor.

---

## Ex 11 — 🔨 Validação + tratador de erro central

**Arquivo:** `ex11.js`

**Estudar:** middleware de validação, tratador de erro de 4 parâmetros, 404 coringa, `err.status`.

```js
// 1. validação — vira middleware, não código solto na rota
function validateTitle(req, res, next) {
  const { title } = req.body;
  if (typeof title !== 'string' || title.trim() === '') {
    const err = new Error('title is required');
    err.status = 400;                 // o tratador lê isso
    return next(err);                 // NÃO responde aqui
  }
  next();
}

app.post('/tasks', validateTitle, (req, res) => { ... });

// 2. 404 coringa — depois de todas as rotas
app.use((req, res, next) => {
  const err = new Error('not found');
  err.status = 404;
  next(err);
});

// 3. tratador central — 4 parâmetros, sempre o ÚLTIMO
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });   // seu formato do Ex 04
});
```

**O tratador tem 4 parâmetros.** É assim que o Express o distingue de um middleware comum — ele conta os argumentos da função. Com 3, vira middleware normal e nunca recebe erro nenhum.

**Tem que ser o último registrado** porque a fila é sequencial: `next(err)` pula os middlewares normais e procura o próximo tratador *daí pra frente*. Registrado no meio, os erros das rotas abaixo dele não o alcançam.

**Erro síncrono chega sozinho.** Um `throw` dentro de um handler síncrono é capturado pelo Express e vira `next(err)` automaticamente. Em handler `async` isso muda — é o Ex 12.

**Por que centralizar:** sem isso você repete `res.status(400).json(...)` em 20 lugares, e no dia que o formato mudar são 20 edições — com uma esquecida garantida. Com o tratador central, o formato de erro tem um dono só.

**Nunca vaze stack trace em produção.** Ela expõe caminho de arquivo, versão de lib e estrutura interna — mapa pronto pra quem está atacando. Logue completo no servidor, responda enxuto pro cliente.

- **Ex 11** — as três peças na ordem: `validateTitle`, 404 coringa, tratador central. Comprove com `curl -i`: title vazio → 400 no seu formato · rota fantasma → 404 no seu formato · id inexistente → 404. Provoque um erro não tratado e confira que a resposta não vaza stack trace.

---

## Ex 12 — 🔨 Erro em handler async

**Arquivo:** `ex12.js`

**Estudar:** erro em handler `async`, diferença Express 4 × 5, `try/catch` + `next(err)`, wrapper `asyncHandler`.

```js
app.get('/boom', async (req, res) => {
  await algumaCoisa();
  throw new Error('boom');        // Express 4: pendura. Express 5: vira 500.
});
```

**Por que o Express 4 não vê:** ele envolve a chamada do handler num `try/catch` síncrono. Uma função `async` **retorna imediatamente** uma Promise — o `throw` acontece depois, quando o `try` já fechou. O erro vira `unhandledRejection` (o mesmo do Ex 06 do T1), ninguém responde, e o cliente fica pendurado até o timeout. **Express 5 corrigiu isso**: ele passou a esperar a Promise do handler e mandar a rejeição pro tratador. Você está no 5 — confirme com `npm ls express`.

Duas formas de tratar explicitamente:

```js
// A) try/catch em cada handler
app.get('/a', async (req, res, next) => {
  try { ... } catch (err) { next(err); }
});

// B) wrapper que faz isso sozinho
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/b', asyncHandler(async (req, res) => { ... }));
```

O wrapper existe porque o try/catch em 30 handlers é ruído repetido — e basta esquecer um. No Express 5 nenhum dos dois é obrigatório, mas o wrapper continua útil quando o código precisa rodar também no 4, e o try/catch continua necessário quando você quer **tratar** o erro, não só repassá-lo.

- **Ex 12** — handler `async` que lança depois de um `await`. Chame com curl e registre o que aconteceu (pendurou? qual status? o que apareceu no terminal do servidor?). Confirme sua versão do Express. Depois implemente as duas correções e deixe as duas no arquivo. **Decisão sua:** qual vai pra API final e por quê.

---

## Ex 13 — 🔨 Testes com supertest

**Arquivos:** `app.js` + `server.js` + `app.test.js`

**Estudar:** separação app × server, `supertest`, asserts de status, corpo e header.

```js
// app.js — monta e exporta, SEM listen
const app = express();
app.get('/tasks', ...);
export default app;

// server.js — só sobe
import app from './app.js';
app.listen(process.env.PORT || 3000);

// app.test.js
import request from 'supertest';
import app from './app.js';

it('lista tarefas', async () => {
  const res = await request(app).get('/tasks');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
```

**Por que separar:** o supertest recebe o `app` e sobe um servidor efêmero numa porta aleatória, sozinho. Se o `app.js` já desse `listen`, cada arquivo de teste brigaria pela porta 3000 e daria `EADDRINUSE`. Separado, os testes rodam em paralelo sem conflito e sem você gerenciar servidor.

**O que essa suíte não cobre:** se o `server.js` estiver quebrado, os testes passam mesmo assim — eles nunca o importam. Testar o app não é testar o processo; isso volta no Tema 9, com a rota `/health`.

- **Ex 13** — separe `app.js` de `server.js` e escreva a suíte cobrindo, para cada rota do tema, um caso feliz e um de erro:

  - `GET /tasks` → 200 e corpo array
  - `GET /tasks/:id` → 200 · id inválido → 400 · id inexistente → 404
  - `POST /tasks` → 201, com `Location` no header e o corpo criado · title vazio → 400 **no seu formato de erro**
  - `DELETE /tasks/:id` → 204 · repetido → 404
  - rota fantasma → 404 no seu formato

  `npm test` verde. Depois quebre uma validação de propósito e veja vermelho — cole as duas saídas. Pelo menos um teste tem que verificar **header**, não só status.

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
