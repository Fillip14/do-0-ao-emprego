# Resumo de estudos — Etapa 2 (Semanas 1 a 3)

> Material de revisão compilado pela IA (fase revisor) a pedido do Fillip, 19/07/2026 — atualizado em 20/07/2026 com a Semana 3. O código e as decisões descritas aqui são dele.

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

## Semana 3 — PostgreSQL · Bloco A: SQL puro (20/07)

**Duas peças, como na S1.** O **servidor PostgreSQL** é um processo que fica rodando em segundo plano escutando a porta 5432 e guarda os dados em disco; o **psql** é um cliente de terminal que manda SQL e mostra a resposta — mesmo papel do Bruno em relação à API. Dentro do servidor existem bancos, dentro dos bancos existem tabelas, e existem também **roles** (usuários do banco, independentes dos usuários do Linux). No WSL o servidor **não sobe sozinho**: `sudo service postgresql start` a cada sessão.

**Instalação e acesso.** `sudo apt install postgresql postgresql-contrib` → `sudo service postgresql start` → `sudo -u postgres psql` (superusuário, prompt `postgres=#`). Role e banco criados de dentro: `CREATE ROLE fillip WITH LOGIN CREATEDB PASSWORD '...'` e `CREATE DATABASE tarefas OWNER fillip`. Com o nome do role igual ao do usuário Linux, basta `psql tarefas` (prompt `tarefas=>`; `=>` = usuário comum, `=#` = superusuário).

**O prompt do psql é um diagnóstico.** `=#` pronto para comando novo · `-#` comando aberto, faltando `;` · `'#` aspa aberta · `(#` parêntese aberto · `=*>` transação em andamento. Meta-comandos começam com `\` e **não** levam `;`: `\l` (bancos), `\c` (conectar), `\dt` (tabelas), `\d tabela` (descrever), `\du` (roles), `\q` (sair), `\i arquivo.sql` (executar arquivo).

**Aspas têm significados diferentes** (ao contrário do JavaScript): `'simples'` = **valor** de texto; `"duplas"` = **identificador** (nome de coluna/tabela). Por isso a convenção de nomes em `snake_case` minúsculo — evita precisar de aspas duplas.

**Anatomia da definição de coluna:** `nome  TIPO  [restrições e DEFAULT]`, sempre nessa ordem. Funções como `gen_random_uuid()` e `now()` produzem valores, não são tipos: entram depois da palavra `DEFAULT`, que é obrigatória.

**A tabela `tasks` (decisões do Fillip, com justificativa):**

| Coluna | Definição | Por quê |
|---|---|---|
| `id` | `UUID PRIMARY KEY DEFAULT gen_random_uuid()` | id gerado no **banco**, não no Node: o banco é dono da identidade da linha, e qualquer cliente (psql, seed, script) recebe id válido de graça. Custo zero porque o POST já precisa de `RETURNING`. |
| `title` | `TEXT NOT NULL CHECK (length(trim(title)) > 0)` | `TEXT` e `VARCHAR(n)` têm a mesma performance no Postgres; o CHECK é defesa em profundidade contra inserções que não passam pelo Express. |
| `done` | `BOOLEAN NOT NULL DEFAULT false` | tarefa nasce não concluída. |
| `created_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` | `TIMESTAMPTZ` converte para UTC na entrada e reconverte na saída — o `TIMESTAMP` sem TZ guarda horário sem contexto e vira bug quando o servidor está em outro fuso (S5). |

**`DEFAULT` não é `NOT NULL`.** O default só age quando a coluna é **omitida**; `NULL` explícito passa por ele. E **omitir a coluna não é "não mandar nada"**: o banco preenche com o `DEFAULT` e, se não houver, com `NULL`.

**`NOT NULL` e `CHECK` cobrem buracos diferentes** e se somam: `NOT NULL` barra a **ausência** de valor; `CHECK` avalia o **conteúdo**. Sozinho, `NOT NULL` aceitaria `''` e `'   '`. Sozinho, o `CHECK` aceitaria `NULL` — porque `length(trim(NULL)) > 0` resulta em `NULL`, e o Postgres só rejeita quando o CHECK dá explicitamente `false`.

**O que o `\d tasks` revelou de brinde.** `PRIMARY KEY` não é uma restrição, são duas: `NOT NULL` + `UNIQUE` — por isso o `id` apareceu como `not null` sem ter sido declarado. E a parte `UNIQUE` virou um **índice** (`tasks_pkey`, btree), estrutura de busca ordenada que torna a checagem de unicidade barata e deixa o `GET /tasks/:id` rápido de graça. O CHECK ganhou nome automático `tasks_title_check` — é esse nome que aparece na mensagem de erro do `pg`.

**As quatro operações.** `INSERT INTO tabela (colunas) VALUES (...)` — parênteses obrigatórios mesmo com uma coluna só · `SELECT * FROM tabela WHERE ...` · `UPDATE tabela SET coluna = valor WHERE ...` — o `SET` exige **coluna = valor** · `DELETE FROM tabela WHERE ...` — apaga a linha inteira, não tem lista de colunas. `RETURNING *` (ou `RETURNING id, title, done`) devolve a linha gravada: é a peça que o `POST` da API precisa, já que ele responde com a tarefa criada.

**`WHERE` decide o alcance; o número de linhas afetadas decide a resposta.** Sem `WHERE`, `UPDATE`/`DELETE` alcançam a tabela inteira (`UPDATE 3`) — e não há como desfazer, porque o `UPDATE` não guarda o valor anterior. Defesa: transação. `BEGIN` abre (prompt vira `=*>`), nada é definitivo até `COMMIT`, e `ROLLBACK` volta ao estado anterior. Truque complementar: antes de um `DELETE` duvidoso, troque o `DELETE` por `SELECT *` mantendo o mesmo `WHERE` — o que aparecer é o que vai sumir.

**Não encontrar nada NÃO é erro.** `UPDATE 0`, `DELETE 0` e `(0 rows)` são respostas legítimas: "procurei, o conjunto está vazio". O banco não tem opinião sobre isso ser um problema — quem tem é a aplicação. É daí que sai o 404.

**As classes de erro do Postgres:**

| Código | Erro | Natureza | Vira, na API |
|---|---|---|---|
| `23514` | check constraint | dado inválido (`''`, `'   '`) | 400 |
| `23502` | not-null | dado ausente (title omitido) | 400 |
| `22P02` | invalid input syntax | tipo errado / uuid malformado | 400 |
| `42601` | syntax error | SQL malformado = **bug do programador** | 500 (nunca deveria acontecer) |

Distinguir pelo **código**, nunca pelo texto da mensagem — texto muda de versão para versão.

**A regra dos dois portões.** *Portão 1 — a forma é válida?* Se não, o banco reclama com erro e **nem chega a procurar** (`/tasks/banana` → `22P02`) → **400**. *Portão 2 — existe?* Se não, sem erro nenhum, `0 rows` → **404**. Ou seja: id malformado e id inexistente são casos **diferentes**. Uuid só aceita `0-9a-f` no formato 8-4-4-4-12 — um caractere a mais, a menos ou fora do hexadecimal já barra no portão 1.

**Tradução banco → API (o roteiro da S3-C):** `SELECT` com 1 linha → 200 · `SELECT` com 0 linhas → 404 · `UPDATE 1` → 200 + tarefa · `UPDATE 0` → 404 · `DELETE 1` → 200 + `{message}` · `DELETE 0` → 404 · erro `23514`/`23502`/`22P02` → 400 · erro `42601` → 500.

**Arquivos `.sql`.** Rodam de ponta a ponta, sem perguntar: `psql tarefas -f arquivo.sql` (de fora) ou `\i arquivo.sql` (de dentro). Por isso `schema.sql` (script, feito para rodar e recriar a estrutura) e `drills.sql` (registro de sessão, contém falhas propositais e um `UPDATE` sem `WHERE` — **não rodar**) têm naturezas opostas, e o segundo leva cabeçalho de aviso. Recriar a estrutura num banco que já a tem dá `relation already exists`; as saídas são `DROP TABLE IF EXISTS` antes do `CREATE` (começa do zero — certo para banco de teste, veneno perto de produção) ou `CREATE TABLE IF NOT EXISTS` (não recria, mas também **não atualiza** estrutura antiga e não avisa — o problema que *migrations* resolvem).

**Decisão em aberto:** a tabela tem `created_at`, que o contrato atual da API não expõe. Escolha do Fillip: **filtrar** o campo, mantendo o contrato da S2 intacto e os testes verdes — e filtrar **na query** (`RETURNING id, title, done`), não em JavaScript, para não trafegar dado que será descartado nem vazar colunas novas no futuro.

**Pendente para as próximas semanas:** conectar o Node ao banco (`pg`, pool, queries parametrizadas — S3 blocos B–D), tipos (TS strict, S4), deploy + auto-ataque (S5).
