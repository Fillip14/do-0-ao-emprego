# Etapa 2 — Back-end: Node, Express, TypeScript e banco

> **Plano vigente da etapa** · Reinício em **21/07/2026** (decisão do Fillip, 20/07: a v1 da etapa, 16–20/07, foi rápida demais pra fixar — trabalho arquivado em `arquivo-v1/`, etapa recomeça por este plano). · **Avaliação alvo: 28/09/2026, antecipável** no checkpoint.
>
> **Organizado por TEMAS, não por datas** (mudança de 21/07, mesmo formato da Etapa 1). Cada tema traz a **semana sugerida** — referência de ritmo, não prazo — e recebe a data real de conclusão quando fecha. A avaliação alvo é confirmada ou antecipada no checkpoint do Tema 3.

## Objetivo

Construir o **lado do servidor**: uma API REST de tarefas completa — rotas com validação e status corretos, testes automatizados, PostgreSQL, TypeScript strict e deploy — **pública no ar** ao fim da etapa. É ela que a Etapa 3 (React) vai consumir: o front do mês seguinte conversa com a URL que esta etapa entrega, formando o primeiro sistema completo do portfólio.

## Regras da etapa

1. **Trilha de IA — fase REVISOR:** proibido pedir código pronto. A IA explica conceitos, escreve enunciados e faz **code review depois que o seu código funciona** (bugs, casos de borda, alternativas — em formato antes→depois). Quem digita é você.
2. **Commits diários** no GitHub, push conferido.
3. **Checkpoint a cada tema** (verde/amarelo/vermelho) contra a âncora da avaliação. Amarelo/vermelho → replaneja, e a marca pessoal pausa primeiro.
4. **Stack travada:** Node + Express + TypeScript + PostgreSQL. Ideia nova no meio do caminho → `ideias-depois.md`.
5. **Decisões técnicas são suas** (formato de erro, PUT×PATCH, plataforma de deploy…), sempre com justificativa — saber defender escolha é matéria de entrevista.
6. **Testes desde o Tema 1** — todo tema tem sua fatia de teste; nunca ficam "pra depois".
7. **`exercicios.md` na abertura de cada tema:** a IA escreve o enunciado completo de todos os exercícios do tema (arquivos, passos, o que esperar ver). O plano diz *o quê*; o `exercicios.md` diz *como*; a pasta guarda o resultado — um arquivo por exercício.
8. **Watchlist leve** (restaurada 20/07, zerada na entrada): a IA mantém em silêncio uma lista de erros recorrentes — entra com evidência (2x, ou 1x se grave/em verificação 📖), sai com 2 checkpoints limpos. Revisão dos ativos só no checkpoint de tema; **drill amplo antes da avaliação**. Sem drills anunciados no meio do tema, sem cobrança item a item.

## O que deve existir no final

**A API de tarefas, no ar**, com o CRUD completo:

| Rota | Sucesso | Erros |
|---|:---:|---|
| `GET /tasks` · `GET /tasks/:id` | 200 | 400 id inválido · 404 não existe |
| `POST /tasks` | 201 | 400 entrada inválida |
| `PUT/PATCH /tasks/:id` · `DELETE /tasks/:id` | 200/204 | 400 · 404 |

E por trás dela: fila de middlewares com erro centralizado (formato único em JSON, nunca crash nem stack trace vazado) · PostgreSQL com pool e queries 100% parametrizadas, schema versionado em migrations · suíte de testes cobrindo sucesso e erro de toda rota · TypeScript strict de ponta a ponta · deploy com banco gerenciado e segredos em env vars, resistente a abuso · README completo com rotas documentadas e URL de produção.

## Estrutura de pastas — uma pasta por tema

Cada tema nasce numa pasta nova, projeto autocontido (`npm install` + `npm start`/`npm test` funcionam nela); a anterior fica congelada como histórico. Recriar a base do tema anterior é revisão embutida. A versão oficial da API (a que vai pro ar e serve a Etapa 3) é a do último tema em que ela é tocada.

```
etapas/etapa-2/
├── arquivo-v1/              ← trabalho de 16–20/07 (api/, sql/, resumo, planos antigos) — histórico
├── t01-node/
│   ├── exercicios.md        ← enunciados do tema (criado na abertura)
│   ├── ex03-raw-http.js     ← um arquivo por exercício
│   └── ...
├── t02-express/
├── ... (até t10-docker-ci/)
```

## Os temas

> Legenda: **🔨 Ex:** exercício de código · **📖 Verif.:** tópico teórico com verificação rápida (responder/demonstrar prova que entendeu).

### Tema 1 — Node · *semana sugerida 1* · ✅ feito 20–21/07

> 12/12 exercícios · **checkpoint 🟡 amarelo**: tema árido e abstrato; Ex 07, 10 e 12 voltam pra revisão. Pasta: [`t01-node/`](t01-node/).

**Ambiente:** WSL/Ubuntu (projeto DENTRO do WSL) · Node LTS via nvm (nunca o instalador do Windows) · VS Code + extensão WSL · git + `.gitignore` com `node_modules/`.

1. O que é um servidor: um processo vivo escutando uma porta. — 📖 **Verif.:** desenhar o caminho navegador→porta→processo→resposta e apontar onde mora a porta.
2. Anatomia do HTTP: linha inicial, headers, corpo; métodos; famílias de status. — 📖 **Verif.:** rodar `curl -i` num site real e marcar as 3 partes na saída.
3. O módulo `node:http` cru: `createServer`, `req`/`res`, `listen`. — 🔨 **Ex:** servidor que responde JSON em `/` e texto em `/sobre`; conferir as 3 partes com `curl -i`.
4. Streams: `req`/`res` são fluxos, não blocos. — 🔨 **Ex:** logar cada pedaço do body chegando (`req.on('data')`) mandando um corpo grande.
5. Event loop: uma thread, um evento por vez. — 🔨 **Ex:** rota com `while` de 5s; provar com 2 terminais que ela trava as outras.
6. `uncaughtException`/`unhandledRejection`. — 🔨 **Ex:** provocar um throw sem try e uma promise sem catch; ver como o processo morre em cada caso.
7. `process.env`: código vs ambiente. — 🔨 **Ex:** porta vinda de `PORT=4000`, com default quando ausente.
8. Projeto npm: package.json, lock, scripts, deps × devDeps, semver, `--watch`. — 🔨 **Ex:** projeto do zero com scripts `start`/`dev`; saber explicar cada linha do package.json.
9. ESM vs CommonJS. — 📖 **Verif.:** alternar o `"type"` do package.json e prever o que quebra ANTES de rodar.
10. Módulos nativos: `path`, `fs/promises`, `crypto`. — 🔨 **Ex:** script que gera UUID, monta caminho com `path.join` e grava/lê um JSON.
11. Debugging: `node --inspect` + VS Code. — 🔨 **Ex:** breakpoint dentro do handler; inspecionar `req.url` e headers com o processo pausado.
12. Testes: Vitest, `describe`/`it`/`expect`. — 🔨 **Ex:** 2 funções puras testadas com caso feliz + caso de borda cada; `npm test` verde.

### Tema 2 — Express · *semana sugerida 2* · ✅ feito 21–22/07

> 13/13 exercícios · **checkpoint 🟢 verde**: todos escritos por mim, decisões de contrato justificadas e um bug real (`POST` sem `Content-Type` → 500) achado por raciocínio e coberto por teste. Ponto de atenção: ritmo — tema de uma semana fechado em dois dias. Pasta: [`t02-express/`](t02-express/).

**Ambiente:** pasta nova, projeto npm novo, `npm install express` · curl + Bruno/Postman com collection salva na pasta da semana.

1. O que o Express acrescenta ao `http` cru. — 📖 **Verif.:** reescrever o servidor da S1 em Express e listar 3 coisas que ele fez por você.
2. `express.json()` e o `req.body`. — 🔨 **Ex:** POST que ecoa o body; remover o middleware e ver o `undefined`.
3. As três portas: `params` × `query` × `body`. — 🔨 **Ex:** rota que devolve `{params, query, body}` + um curl que preenche os três de uma vez.
4. Rotas com parâmetro (`/tasks/:id`). — 🔨 **Ex:** GET que devolve o id recebido e o `typeof` dele (surpresa: string).
5. `express.Router`. — 🔨 **Ex:** mover as rotas de tarefas pra um `tasks.routes.js` plugado com `app.use`.
6. Semântica REST: verbos e status de escrita. — 📖 **Verif.:** montar de memória a tabela verbo→status do CRUD, justificando 201/204/400/404.
7. Idempotência. — 📖 **Verif.:** rodar o mesmo DELETE 2x e explicar por que a 2ª resposta muda — e por que está certo.
8. Resposta bem-feita: 201 + `Location`; 405. — 🔨 **Ex:** POST devolvendo o header `Location`; método errado em rota certa devolvendo 405.
9. Middleware: `app.use`, ordem, `next()`. — 🔨 **Ex:** logger artesanal (método, url, status, ms); inverter a ordem com `express.json` e observar o efeito.
10. `morgan`. — 🔨 **Ex:** plugar `morgan('dev')`, comparar com o artesanal e decidir qual fica (justificando).
11. Validação + erro centralizado. — 🔨 **Ex:** `validateTitle` + handler de 4 parâmetros + 404 coringa; title vazio → 400 no SEU formato de erro.
12. Erro em handler async (Express 4 × 5). — 🔨 **Ex:** handler async que lança; ver o pedido pendurar (ou não) e corrigir.
13. Testes: supertest. — 🔨 **Ex:** separar `app` de `server`; suíte com caso feliz + erro de cada rota da semana.

### Tema 3 — TypeScript · *semana sugerida 3*

**Ambiente:** pasta nova · `typescript` + `@types/*` em devDeps · `tsconfig` strict desde o dia 1 · tsx pra dev + `tsc` → `dist/` pra produção · sub-pasta playground.

1. O que o TS resolve e o que cobra. — 📖 **Verif.:** achar 3 bugs seus de JS (da Etapa 1 vale) que o TS teria pego e dizer como.
2. Tipos básicos, inferência, `any` vs `unknown`. — 🔨 **Ex:** no playground, deixar inferir, forçar erros de atribuição e comparar `any` × `unknown` no mesmo dado.
3. `interface`/`type`. — 🔨 **Ex:** modelar `Task`; criar objeto com campo faltando e com campo extra — ler as duas mensagens do compilador.
4. União e narrowing. — 🔨 **Ex:** função que recebe `string | number`; ver no hover o tipo afunilar dentro do `if`.
5. União literal no lugar de enum. — 🔨 **Ex:** `status: "todo" | "done"`; atribuir `"doen"` e ver o typo virar erro de compilação.
6. Tipar funções e bordas (`unknown` até provar o contrário). — 🔨 **Ex:** entrada `unknown` → validação → sai `Task`; sem validar, o compilador barra.
7. Type predicates. — 🔨 **Ex:** `isTask(x): x is Task`; usar num `if` e ver o `unknown` virar `Task` do outro lado.
8. Discriminated unions. — 🔨 **Ex:** `Result = {ok:true, task} | {ok:false, error}`; consumir com narrowing exaustivo.
9. Generics. — 🔨 **Ex:** `firstItem<T>` e um embrulho `ApiResponse<T>`; ver o tipo fluir sem `as`.
10. Utility types. — 🔨 **Ex:** `Partial<Task>` pro PATCH e `Omit<Task,'id'>` pro POST — derivar em vez de redigitar.
11. `as` e `satisfies`. — 🔨 **Ex:** mentir um tipo com `as` e provocar o crash em runtime que o compilador engoliu; refazer com `satisfies`.
12. O `tsconfig`. — 🔨 **Ex:** desligar o `strict`, ver erros sumirem, religar; excluir testes do build e conferir o `dist/`.
13. Testes em TS. — 🔨 **Ex:** suíte compilando; `tsc --noEmit` rodando ANTES do vitest no script `test`.

### Tema 4 — Banco (PostgreSQL) · *semana sugerida 4*

**Ambiente:** Postgres via `apt` no WSL (serviço sobe com `sudo service postgresql start`) · role própria + banco · pasta nova com `pg` · `.env` fora do git + `.env.example` no repo.

1. Servidor × cliente: o processo na 5432 e o `psql`. — 📖 **Verif.:** mapear os pares (Postgres↔?, psql↔?) com a API e o Bruno da S2.
2. Criar banco e tabela: tipos, `NOT NULL`, `DEFAULT`, `CHECK`, PK. — 🔨 **Ex:** criar a tabela `tasks` e violar CADA restrição de propósito, lendo os erros.
3. Aspas simples × duplas; snake_case. — 📖 **Verif.:** prever o resultado de `SELECT 'title'` vs `SELECT "title"` antes de rodar.
4. SQL essencial com WHERE; `RETURNING`; `BEGIN`/`ROLLBACK`. — 🔨 **Ex:** ciclo INSERT→SELECT→UPDATE→DELETE; rodar um UPDATE sem WHERE dentro de transação e desfazer.
5. `NULL` de verdade. — 🔨 **Ex:** inserir NULL e provar que `= NULL` não acha e `IS NULL` acha; `COALESCE` com default.
6. `LIKE`/`ILIKE`. — 🔨 **Ex:** busca por pedaço do título com `ILIKE '%...%'` — parametrizado.
7. Agregações. — 🔨 **Ex:** contar tarefas por `done` com `GROUP BY`; filtrar grupos com `HAVING`.
8. `UNIQUE`, índices, `EXPLAIN`. — 🔨 **Ex:** violar um UNIQUE e ler o erro; criar índice e comparar o `EXPLAIN` antes/depois.
9. Duas tabelas: FK, `JOIN`, `CASCADE`. — 🔨 **Ex:** tabela `lists` + FK em `tasks`; JOIN listando tarefa+lista; DELETE em cascata visto acontecer.
10. O `pg`: pool + queries parametrizadas. — 🔨 **Ex:** `db.js` com pool via env; `getAllTasks`/`createTask` com `$1`; script smoke provando.
11. SQL injection. — 🔨 **Ex:** versão concatenada + entrada maliciosa (ver o estrago numa tabela sacrificável); a mesma entrada na versão `$1` falhando inofensiva.
12. Transação pelo Node. — 🔨 **Ex:** duas escritas no MESMO client com BEGIN/COMMIT; forçar erro no meio e ver o ROLLBACK salvar.
13. Testes com banco. — 🔨 **Ex:** banco `_test` + `beforeEach` de limpeza + `afterAll` fechando o pool; suíte verde.

### Tema 5 — Testes a fundo · *semana sugerida 5*

**Ambiente:** pasta nova · cobertura habilitada (`--coverage`) · supertest já conhecido — semana de técnica, não de ferramenta.

1. A pirâmide: unitário × integração × e2e. — 📖 **Verif.:** classificar seus testes da S4 nas categorias e justificar.
2. Padrão AAA. — 🔨 **Ex:** refatorar 3 testes seus marcando Arrange/Act/Assert com comentários.
3. Hooks de ciclo de vida. — 🔨 **Ex:** mover setup repetido pra `beforeEach`; provar com `.only` que cada teste roda sozinho.
4. Fixtures e factories. — 🔨 **Ex:** `makeTask(overrides)` substituindo todo objeto copiado na suíte.
5. `it.each`. — 🔨 **Ex:** tabela de títulos inválidos (vazio, número, null, espaços) num teste só.
6. Dublês: mock, spy, stub. — 🔨 **Ex:** testar uma função que usa o banco passando `vi.fn()` no lugar — e conferir com que argumentos foi chamada.
7. Tempo falso. — 🔨 **Ex:** função com `setTimeout` testada em 0ms reais com `useFakeTimers` + `advanceTimersByTime`.
8. Testar o tratador de erro. — 🔨 **Ex:** app de teste com rota que sempre lança; asserts do status e do formato do erro.
9. `.skip`/`.only`/`.todo`. — 📖 **Verif.:** explicar o que acontece com a suíte no CI se um `.only` for commitado.
10. Snapshot testing. — 📖 **Verif.:** explicar em 2 frases por que "aprovar sem ler" é a armadilha.
11. Cobertura. — 🔨 **Ex:** rodar `--coverage`, achar a linha descoberta, escrever o teste que a cobre — e dizer o que os 100% ainda não provam.
12. TDD. — 🔨 **Ex:** uma função nova (ex.: filtro de tarefas) escrita teste-primeiro: vermelho → verde → refatora.
13. O que NÃO testar. — 📖 **Verif.:** achar 1 teste seu que testa implementação (ou lib alheia) e dizer o que testaria no lugar.
14. Property-based. — 📖 **Verif.:** ler um exemplo de fast-check e descrever que casos ele inventaria pro seu validador de título.

### Tema 6 — Arquitetura em camadas + listas de verdade · *semana sugerida 6*

**Ambiente:** pasta nova já em camadas (`routes/`, `services/`, `repositories/`) · `zod` instalado.

1. Por que separar camadas. — 📖 **Verif.:** dizer qual camada muda se você trocar o Express — e qual muda se trocar o Postgres.
2. O caminho do pedido pelas camadas. — 📖 **Verif.:** desenhar o fluxo de `GET /tasks?done=true` da rota até o SQL e de volta.
3. Injeção de dependência. — 🔨 **Ex:** service recebendo o repositório por parâmetro; teste do service com repo falso, sem banco.
4. Erros de domínio. — 🔨 **Ex:** `NotFoundError` lançado no service; tratador central mapeando classe → 404.
5. DTO: banco ≠ resposta. — 🔨 **Ex:** repo devolve `created_at`, a API responde `createdAt`; mapper na borda + teste.
6. Validação com zod. — 🔨 **Ex:** schemas do POST/PATCH com `z.infer` substituindo a validação manual; erro do zod saindo 400 no seu formato.
7. Paginação. — 🔨 **Ex:** `GET /tasks?page=2&limit=5` com LIMIT/OFFSET + metadados `{total, page}` na resposta.
8. Cursor vs offset. — 📖 **Verif.:** explicar por que `OFFSET 100000` é caro e como cursor evita.
9. Filtros e busca. — 🔨 **Ex:** `?done=` e `?q=` combináveis, validados, SQL parametrizado.
10. Ordenação segura. — 🔨 **Ex:** `?sort=` com whitelist; tentar `?sort=;DROP TABLE tasks` e receber 400.

### Tema 7 — Migrations + ORM · *semana sugerida 7*

**Ambiente:** pasta nova · node-pg-migrate (ou similar) com `migrations/` versionada · Prisma/Drizzle num sub-projeto à parte só pra comparação.

1. O problema do schema sem histórico. — 📖 **Verif.:** explicar como alguém reproduziria seu banco hoje só com o repo — e o que quebra.
2. Migration up/down. — 🔨 **Ex:** migration que cria `tasks`; rodar num banco ZERADO e chegar no schema completo.
3. Schema × dados. — 📖 **Verif.:** dizer qual migration é "criar coluna priority" e qual é "preencher priority nas linhas antigas".
4. Rollback. — 🔨 **Ex:** rodar o down, conferir que voltou, rodar o up de novo — os dois sentidos funcionam.
5. Seeds. — 🔨 **Ex:** seed com 5 tarefas; banco zerado + migrations + seed = ambiente pronto em um comando.
6. O que o ORM abstrai e cobra. — 📖 **Verif.:** listar 2 coisas que ele faz por você e 2 que ele esconde de você.
7. Comparação prática. — 🔨 **Ex:** as 5 operações do CRUD escritas no Prisma, lado a lado com as suas no `pg`.
8. O problema N+1. — 🔨 **Ex:** listar listas+tarefas do jeito ingênuo com log de queries ligado; contar as queries; refazer com include/join.
9. Transações no ORM; Prisma Studio. — 🔨 **Ex:** duas escritas atômicas; conferir o resultado no Studio.
10. Por que SQL primeiro, ORM depois. — 📖 **Verif.:** responder com argumento SEU, em 3 frases.

### Tema 8 — Autenticação + segurança de borda · *semana sugerida 8*

**Ambiente:** pasta nova · `bcrypt` + `jsonwebtoken` (segredo via env) · `helmet` + `express-rate-limit` na fila de middlewares.

1. Hash com salt; por que não é reversível. — 📖 **Verif.:** explicar por que vazar hashes ≠ vazar senhas, e o que o salt impede.
2. `bcrypt.compare` e timing attacks. — 📖 **Verif.:** explicar por que comparar com `===` seria errado duas vezes.
3. Cadastro e login. — 🔨 **Ex:** `POST /users` guardando hash (nunca a senha) + `POST /login` comparando.
4. Mensagens que não entregam. — 🔨 **Ex:** login errado devolve "invalid credentials" sem dizer qual campo; teste cobrindo usuário inexistente E senha errada.
5. Sessão × JWT. — 📖 **Verif.:** tabela de memória com 3 trade-offs; escolher um pro projeto e justificar.
6. Cookie httpOnly × header; CSRF. — 📖 **Verif.:** explicar que roubo o httpOnly evita e que truque o CSRF explora.
7. Refresh token; limites do logout com JWT. — 📖 **Verif.:** explicar por que access curto + refresh, em 3 frases.
8. Middleware de auth: 401 × 403. — 🔨 **Ex:** `requireAuth` protegendo as escritas (leitura pública); testes dos dois status.
9. Mass assignment. — 🔨 **Ex:** mandar `{done:true, admin:true}` no PATCH e provar que só a whitelist entra.
10. CORS a fundo. — 🔨 **Ex:** página HTML local com `fetch` pra API; ver o bloqueio e o preflight no DevTools; liberar só a origem certa.
11. Helmet + rate limiting. — 🔨 **Ex:** comparar headers antes/depois do helmet; estourar o limite e receber 429.
12. Dados sensíveis fora dos logs. — 📖 **Verif.:** revisar seus logs e apontar onde senha/token poderiam vazar.
13. OWASP Top 10. — 📖 **Verif.:** marcar os 3 que sua API já mitiga e dizer como.
14. 2FA e OAuth. — 📖 **Verif.:** explicar em 2 frases o que "entrar com Google" delega e pra quem.

### Tema 9 — Deploy · *semana sugerida 9*

**Ambiente:** conta em banco gerenciado free tier (Neon ou similar) · plataforma de deploy comparada na hora (Render/Railway/Fly) · `.env.example` completo; env vars na plataforma.

1. Dev × teste × produção. — 📖 **Verif.:** listar tudo que muda entre seu ambiente e produção (banco, porta, segredos, logs).
2. Banco gerenciado. — 🔨 **Ex:** criar no Neon; API LOCAL apontando pro banco na nuvem via env; criar uma tarefa.
3. O caminho do deploy. — 🔨 **Ex:** subir; acompanhar o build nos logs da plataforma; abrir a URL pública no celular (4G, fora do wifi).
4. Processo que cai e volta. — 📖 **Verif.:** explicar o que aconteceria com tarefas guardadas em array quando a plataforma reinicia.
5. `/health`. — 🔨 **Ex:** rota com `{status:'ok'}` + um `SELECT 1` provando que o banco responde.
6. Graceful shutdown. — 🔨 **Ex:** handler de SIGTERM fechando servidor e pool; testar local com `kill`.
7. Logs estruturados. — 🔨 **Ex:** pino no lugar do console.log; um info por request, um error no tratador central.
8. Monitor de uptime. — 🔨 **Ex:** monitor externo no `/health`; derrubar de propósito e receber o alerta.
9. Free tier na prática. — 📖 **Verif.:** medir o cold start real (primeira request após dormir) e anotar o número.
10. Backup. — 📖 **Verif.:** descobrir na doc do seu banco gerenciado o que é automático e o que é por sua conta.
11. Auto-ataque. — 🔨 **Ex:** bateria hostil na URL pública (JSON quebrado, tipos errados, ids absurdos, injection, rotas fantasma); cada correção vira teste.

### Tema 10 — Docker + CI · *semana sugerida 10*

**Ambiente:** Docker Engine no WSL (ou Docker Desktop com integração) · `.github/workflows/` no repo.

1. Imagem × container. — 📖 **Verif.:** explicar com uma analogia sua (classe × instância vale).
2. `Dockerfile` da API. — 🔨 **Ex:** construir a imagem e responder um request vindo de dentro do container (porta mapeada).
3. Cache de camadas. — 🔨 **Ex:** mudar um `.ts` e medir o rebuild; inverter a ordem dos `COPY` e medir de novo.
4. Multi-stage build. — 🔨 **Ex:** build em 2 estágios; `docker images` comparando os tamanhos.
5. `docker compose`. — 🔨 **Ex:** API + Postgres subindo juntos com um comando, do zero.
6. Volumes. — 🔨 **Ex:** criar tarefa → `compose down` → `up`: sobrevive com volume, morre sem — ver os dois casos.
7. Kit de inspeção. — 🔨 **Ex:** provocar um erro e diagnosticar usando só `docker logs` e `docker exec`.
8. CI: workflow no push. — 🔨 **Ex:** suíte rodando a cada push; fazer um push que quebra de propósito e ver o X vermelho.
9. Postgres no CI. — 🔨 **Ex:** service container; testes de integração verdes no Actions.
10. Cache e secrets no CI. — 🔨 **Ex:** cache do npm (medir a diferença de tempo); um secret do repo lido no workflow.
11. Badge. — 🔨 **Ex:** badge de build no README refletindo o último push.
12. CD. — 📖 **Verif.:** explicar o passo que falta entre "CI verde" e "produção atualizada".

---

## Avaliação

Demo ao vivo · o avaliador ataca a API com requisições maliciosas · suíte verde na hora · oral: status codes, middleware, por que queries parametrizadas, pool, o que o strict deu, e as decisões de contrato tomadas.
