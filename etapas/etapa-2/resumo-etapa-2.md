# Resumo de estudos — Etapa 2 (Semanas 1 e 2)

> Material de revisão compilado pela IA (fase revisor) a pedido do Fillip, 19/07/2026. O código e as decisões descritas aqui são dele.

## Semana 1 — HTTP, Node e Express (16–17/07)

**Anatomia do HTTP.** Toda mensagem (pedido ou resposta) tem 3 partes: linha inicial (método + caminho + versão, ou versão + status), headers (pares chave: valor) e corpo — separado dos headers por uma linha em branco. `Content-Length` delimita onde o corpo termina (delimitação, não segurança). `Content-Type` é promessa, não verificação: o servidor não confere se o corpo bate com o tipo declarado.

**Servidor com `node:http` puro.** `createServer` recebe a função "atendente" que roda uma vez por requisição, com `req` (pedido pronto para ler) e `res` (resposta para preencher: `statusCode`, `setHeader`, `end`). `listen` liga o servidor e o processo fica vivo esperando. Toda requisição exige uma resposta — handler que não responde deixa o cliente pendurado.

**Event loop.** O Node roda o JavaScript numa única thread; o event loop pega um evento por vez e roda a função associada até o fim. Provado no experimento do `while` de 5s: uma rota lenta segurou todas as outras. Node escala porque espera (I/O) é delegada e libera a thread; CPU travada é veneno.

**`process.env`.** Variáveis de ambiente vivem fora do programa (no shell/SO); `process.env` é a janela do Node para elas. Código = o que é igual em todo lugar; ambiente = o que muda (porta, banco, segredos). `PORT=4000 node server.js` é sintaxe do terminal, não JavaScript.

**Projeto npm.** `package.json` = receita do projeto; `node_modules/` = bolo pronto (regenerável, fora do git); `package-lock.json` = foto exata das versões. `npm install` reconstrói tudo a partir da receita. Scripts: `start`/`test` têm atalho direto; nomes próprios exigem `npm run`. `main` só é lido quando a pasta é consumida como pacote. `node --watch` reinicia a cada save.

**ESM vs CommonJS.** O Node decide a gramática dos `.js` pelo campo `"type"` do package.json mais próximo (`"module"` → `import/export`; ausente → `require`). Extensões `.mjs`/`.cjs` mandam mais que tudo. O projeto usa ESM por decisão do Fillip.

**Express (base).** Envelopa o `http` cru com um roteador: uma função por rota (`app.get('/tasks', fn)`) em vez de ifs de método+URL. `res.json` = setHeader + end; `res.status(201)` encadeia porque retorna o próprio `res` (fluent interface). `express.json()` é middleware que lê e parseia o corpo JSON — sem ele, `req.body` não existe. `app.use` registra middleware (roda antes das rotas, na ordem de registro; `next()` passa a vez). `app` é, por baixo, uma função atendente: `app.listen` ≈ `createServer(app).listen`. Extras: rota não registrada cai no 404 HTML padrão do Express; `app.disable('x-powered-by')` esconde o framework (segurança).

**Ferramentas.** curl = cliente HTTP de terminal (`-i` mostra headers, `-X` método, `-H` header, `-d` corpo). Bruno = mesmo papel com interface; collection = pasta de arquivos de texto commitáveis (a versão atual gera `.yml`, não mais `.bru`). nvm instala o Node dentro do WSL (o npm do Windows vazava pela ponte de interop e quebrava em caminho UNC). Regra: rode as ferramentas no mundo onde os arquivos moram.

## Semana 2 — REST, validação, erro central e testes (17–19/07)

**Contrato antes do código.** As 5 rotas desenhadas em tabela (método, caminho, entra, sai, erros) antes de abrir o editor. Identificador viaja no caminho (`/tasks/:id` → `req.params.id`, sempre string); dados viajam no body. Decisões do Fillip, com justificativa: PATCH em vez de PUT (atualização parcial sobrevive a campos novos); DELETE responde 200 + `{message}` ciente da alternativa 204; validação de title = string não vazia, senão 400 (`{"title": 42}` → 400).

**CRUD completo.** `find` (item ou undefined) para buscar, `findIndex` (posição ou -1) + `splice` para remover. Callbacks de `find`/`map` devem ser puros — teste e retorno, sem mutação escondida. Objeto viaja por referência: alterar o objeto achado altera o item no array. Express usa a primeira rota que casa — ordem de registro importa.

**Erro centralizado.** Formato único da API (decisão do Fillip): `{"message": "..."}` em todo 4xx/5xx, mensagens em inglês. Fila completa: `express.json` → logger → rotas → 404 coringa (`app.use` sem caminho, depois das rotas) → tratador de erro (assinatura de 4 parâmetros `(err, req, res, next)`, registrado por último; `throw`/`next(err)` caem nele). `err.status || 500` respeita o status sugerido pelo erro (JSON quebrado do `express.json` → 400). Stack trace nunca vai ao cliente — `console.error` do lado do servidor, mensagem genérica do lado de fora. Validação extraída para middleware de rota (`validateTitle` plugado em POST e PATCH — escrito uma vez, usado duas). `req.body?.title` (optional chaining) evita crash quando não há body — bug real encontrado por teste: sem o `?.`, requisição sem corpo derrubava a validação num 500; o contrato manda 400.

**Testes (Vitest + supertest).** app.js (comportamento, exportado) separado de server.js (rede) para testar sem ocupar porta. `-D` → devDependencies. Suíte: 15 testes verdes cobrindo caso feliz e casos de erro de todas as rotas + rota inexistente + sem body + JSON quebrado. Aprendizados de ofício: teste tautológico (comparar a resposta com ela mesma) passa sempre e não vale nada — `toMatchObject` + `expect.any(String)` para valores gerados; testes devem ser independentes (cada um cria o que precisa) — testes acorrentados caem em cascata; estado compartilhado entre testes suja resultados — `beforeEach` com `tasks.length = 0` zera antes de cada um; descrição de `it` é documentação e deve dizer a verdade. `async/await`: a requisição devolve uma promessa; `await` espera sem travar o event loop. Vitest sobre Jest: suporte nativo a ESM, zero config (Jest exigiria Babel ou flag experimental); mesma API, conhecimento transferível. Script `test` = `vitest run` (roda e sai, pronto para CI); `test:watch` = modo vigia.

**Pendente para as próximas semanas:** persistência real (PostgreSQL, S3), tipos (TS strict, S4), deploy + auto-ataque (S5).
