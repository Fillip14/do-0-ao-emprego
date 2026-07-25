# Estudo — Banco de dados / PostgreSQL (Tema 4)

> Formato do plano (regra 6): **Parte A** = manual de consulta (por tópico: o que resolve · quando usar · exemplo · armadilhas) · **Parte B** = aplicação na `api/` · **Parte C** = questionário (respondido no devlog).
>
> **A API ganha:** tarefas persistidas em PostgreSQL via `pg`, com pool e queries parametrizadas — o array em memória morre.

---

# Parte A — Manual de consulta

## 1. Servidor × cliente: o processo na 5432 e o `psql`

**O que resolve?** Postgres não é um arquivo que você abre: é **outro processo**, rodando e escutando uma porta (5432), igual à sua API na 3000. Quem fala com ele é um **cliente** — o `psql` (terminal) ou a lib `pg` (seu Node).
**Quando usar?** `psql` pra inspecionar/consertar à mão; `pg` pra o código.
**Exemplo:**

```bash
sudo service postgresql start          # sobe o processo
psql -h localhost -U fillip -d tasks_dev
\l   \dt   \d tasks   \q               # bancos · tabelas · colunas · sair
```

**Armadilhas:** um **cluster** (processo) contém vários **bancos**; cada banco tem **schemas** (`public` por padrão) e tabelas. `ECONNREFUSED 5432` = processo caído, não senha errada. No WSL o Postgres **não sobe sozinho** ao abrir o terminal — `sudo service postgresql start` toda sessão. Autenticação `peer` (socket local) ignora sua senha e usa o usuário do SO; por isso conectar via `-h localhost` (TCP, `md5`/`scram`) é mais parecido com produção.

## 2. Criar banco e tabela: tipos, `NOT NULL`, `DEFAULT`, `CHECK`, PK

**O que resolve?** O schema é **validação que não depende do seu código**. Se a regra está na tabela, nenhuma rota, script ou `psql` distraído consegue furá-la.
**Quando usar?** Toda regra que vale sempre: campo obrigatório, conjunto fechado de valores, identidade da linha.
**Exemplo:**

```sql
CREATE TABLE tasks (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      text        NOT NULL CHECK (btrim(title) <> ''),
  status     text        NOT NULL DEFAULT 'todo'
               CHECK (status IN ('todo','doing','done')),
  term       text,                       -- nullable de propósito
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Armadilhas:** `varchar(n)` sem motivo é herança de outros bancos — no Postgres `text` tem o mesmo desempenho; use limite só se o limite for regra de negócio. `serial` é o jeito velho; `GENERATED ALWAYS AS IDENTITY` é o padrão SQL atual. `timestamp` **sem** `tz` guarda um horário sem fuso e vira dor no deploy — `timestamptz` sempre. `DEFAULT` só age quando a coluna **não é citada** no INSERT: mandar `NULL` explícito num campo com default grava... erro de `NOT NULL`, não o default. E `CHECK` não valida `NULL` (ver tópico 5).

## 3. Aspas simples × duplas; snake_case

**O que resolve?** Em SQL as duas aspas são coisas **diferentes**: `'texto'` é valor, `"Texto"` é identificador (nome de coluna/tabela).
**Quando usar?** Aspas simples pra string. Aspas duplas: idealmente nunca — nomeie tudo em `snake_case` e você não precisa delas.
**Exemplo:**

```sql
SELECT * FROM tasks WHERE title = 'comprar pão';  -- valor
SELECT "createdAt" FROM tasks;                    -- identificador case-sensitive
```

**Armadilhas:** identificador **sem aspas é dobrado pra minúsculo**: `CREATE TABLE Tasks (createdAt ...)` cria `tasks(createdat)`. Se você criar `"createdAt"` com aspas, vai ser obrigado a usar aspas **pra sempre**, em toda query. Daí a convenção: `snake_case` no banco, `camelCase` no JS, e a tradução acontece numa camada só (`SELECT created_at AS "createdAt"` ou no mapeamento em código — decisão sua, mas **uma** só). Apóstrofo dentro de string se escapa dobrando (`'pão d''alho'`) — e isso é exatamente o que você **não** vai fazer na mão (tópico 11).

## 4. SQL essencial: `WHERE`, `RETURNING`, `BEGIN`/`ROLLBACK`

**O que resolve?** Os quatro verbos (`SELECT`/`INSERT`/`UPDATE`/`DELETE`) cobrem o CRUD inteiro. `RETURNING` te devolve a linha afetada **na mesma ida** ao banco. `BEGIN`/`ROLLBACK` te deixa testar um comando destrutivo sem medo.
**Quando usar?** `RETURNING` em todo INSERT/UPDATE/DELETE cujo resultado você precisa responder ao cliente. `BEGIN` antes de rodar UPDATE/DELETE à mão no `psql`.
**Exemplo:**

```sql
INSERT INTO tasks (title, status) VALUES ('comprar pão', 'todo') RETURNING *;
UPDATE tasks SET status = 'done' WHERE id = 1 RETURNING id, status;
DELETE FROM tasks WHERE id = 1 RETURNING id;

BEGIN;  UPDATE tasks SET status = 'done';  -- ops, sem WHERE
ROLLBACK;                                   -- nada aconteceu
```

**Armadilhas:** `UPDATE`/`DELETE` **sem `WHERE` pegam a tabela inteira** e não pedem confirmação. Sem `RETURNING`, você não sabe se atingiu 0 ou 1 linha sem fazer um `SELECT` extra — e é justamente essa contagem que decide entre 200 e 404. `COUNT(*)` volta como **string** no `pg` (ver tópico 10). Em `psql`, esquecer o `;` deixa o prompt pendurado (`tasks-#`).

## 5. `NULL` de verdade

**O que resolve?** `NULL` é "desconhecido", não "vazio". Toda comparação com ele dá **`NULL`** (nem true, nem false), e um `WHERE` que resulta em `NULL` não retorna a linha.
**Quando usar?** Quando a ausência tem significado (`term` não definido ≠ `term` vazio).
**Exemplo:**

```sql
SELECT * FROM tasks WHERE term = NULL;      -- 0 linhas, SEMPRE
SELECT * FROM tasks WHERE term IS NULL;     -- o jeito certo
SELECT * FROM tasks WHERE term IS DISTINCT FROM 'x';  -- inclui os NULL
SELECT coalesce(term, 'sem prazo') FROM tasks;
```

**Armadilhas:** `WHERE term <> 'x'` **exclui as linhas com `term IS NULL`** — o bug de relatório clássico. `CHECK (title <> '')` passa quando `title` é `NULL` (a checagem dá `NULL`, e `CHECK` só barra o `false`) — por isso `NOT NULL` **e** `CHECK` juntos. `COUNT(coluna)` ignora `NULL`, `COUNT(*)` não. `UNIQUE` deixa passar vários `NULL`.

## 6. `LIKE` / `ILIKE`

**O que resolve?** Busca por padrão de texto. `%` = qualquer coisa, `_` = um caractere. `ILIKE` = igual, ignorando maiúsculas.
**Quando usar?** Filtro de busca simples (`GET /tasks?search=pão`).
**Exemplo:**

```sql
SELECT * FROM tasks WHERE title ILIKE '%pão%';
```

**Armadilhas:** `'%termo%'` **não usa índice** B-tree comum — em tabela grande é varredura completa (só prefixo, `'termo%'`, aproveita índice). O `%` faz parte do **valor**, não da query: o parâmetro é `` `%${s}%` ``, e o SQL fica `ILIKE $1` — nunca concatenado. Se o usuário digitar `%` ou `_`, ele vira curinga; escapar isso é decisão sua. Busca séria (acento, plural, relevância) é full-text search, não `LIKE`.

## 7. Agregações

**O que resolve?** Responder "quantos/quanto" sobre um conjunto: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, com `GROUP BY` pra quebrar por categoria.
**Quando usar?** Contadores e resumos (tarefas por status, total pra paginação).
**Exemplo:**

```sql
SELECT status, COUNT(*) AS total
  FROM tasks
 GROUP BY status
HAVING COUNT(*) > 1
 ORDER BY total DESC;
```

**Armadilhas:** toda coluna do `SELECT` que **não** está dentro de uma função de agregação tem que estar no `GROUP BY` — senão erro. `WHERE` filtra **linhas antes** de agrupar; `HAVING` filtra **grupos depois** — usar `WHERE` no lugar de `HAVING` (ou o contrário) muda o resultado. `COUNT(*)` em tabela sem linhas devolve `0`; `SUM` devolve `NULL`. Agregação sem `GROUP BY` sempre devolve **uma** linha.

## 8. `UNIQUE`, índices e `EXPLAIN`

**O que resolve?** Índice = estrutura extra que evita varrer a tabela inteira. `UNIQUE` é uma **regra** que, de brinde, cria um índice. `EXPLAIN` mostra o plano que o Postgres escolheu.
**Quando usar?** Índice em coluna usada em `WHERE`/`JOIN`/`ORDER BY` com frequência. `UNIQUE` em identidade natural (e-mail do usuário — vai importar no Tema 8).
**Exemplo:**

```sql
CREATE INDEX idx_tasks_status ON tasks (status);
EXPLAIN ANALYZE SELECT * FROM tasks WHERE status = 'todo';
--  Seq Scan on tasks  (varredura)   ×   Index Scan using idx_tasks_status
```

**Armadilhas:** índice **custa** — cada `INSERT`/`UPDATE` atualiza também o índice, e ele ocupa disco. Índice em coluna de baixa cardinalidade (3 status) muitas vezes é ignorado. Em tabela pequena `Seq Scan` é **mais rápido** e o planejador sabe disso — não conclua nada de `EXPLAIN` com 5 linhas. `EXPLAIN` só planeja; `EXPLAIN ANALYZE` **executa de verdade** (num `DELETE`, apaga — rode dentro de `BEGIN`/`ROLLBACK`). Função sobre a coluna (`WHERE lower(title) = ...`) desliga o índice comum.

## 9. Duas tabelas: FK, `JOIN`, `CASCADE`

**O que resolve?** Chave estrangeira liga uma linha a outra tabela e o **banco garante** que o alvo existe. `JOIN` monta as duas de volta numa consulta.
**Quando usar?** Assim que uma entidade pertence a outra — no Tema 8, `tasks.user_id → users.id`.
**Exemplo:**

```sql
CREATE TABLE users (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text UNIQUE NOT NULL);
ALTER TABLE tasks ADD COLUMN user_id integer REFERENCES users(id) ON DELETE CASCADE;

SELECT t.id, t.title, u.email
  FROM tasks t
  JOIN users u ON u.id = t.user_id;      -- INNER: só quem tem par
```

**Armadilhas:** `INNER JOIN` **descarta** as linhas sem par (tarefa sem dono some do resultado); `LEFT JOIN` mantém e preenche com `NULL`. `ON DELETE CASCADE` apaga os filhos junto — cômodo e perigoso; `RESTRICT` (padrão) barra o delete e é mais seguro por default. FK **não cria índice** no lado filho: `WHERE user_id = $1` sem índice é varredura. Adicionar coluna `NOT NULL` numa tabela que já tem linhas exige `DEFAULT` ou preencher antes.

## 10. O `pg`: pool + queries parametrizadas

**O que resolve?** Abrir conexão é caro. O **pool** mantém N conexões prontas e empresta/devolve. `pool.query(text, values)` manda o SQL com **buracos** (`$1`, `$2`) e os valores **separados** — o Postgres nunca interpreta o valor como comando.
**Quando usar?** Um pool por processo, criado uma vez, importado por quem precisa.
**Exemplo:**

```ts
import pg from 'pg';                 // pacote CJS: import default, depois desestrutura
const { Pool } = pg;

const pool = new Pool();             // lê PGHOST/PGUSER/PGPASSWORD/PGDATABASE do ambiente
const { rows, rowCount } = await pool.query<Task>(
  'SELECT * FROM tasks WHERE status = $1',
  ['todo'],
);
```

**Armadilhas:** `new Pool()` **em cada request** vaza conexões até o servidor recusar (`too many clients`). Os tipos: `pool.query<T>()` **não valida nada** — `T` é uma promessa sua, exatamente o problema da borda do Tema 3, agora com o banco no lugar do `req.body`. `int8`/`COUNT(*)` chegam como **string** (não cabem em `number` com segurança); `timestamptz` chega como `Date`, e `JSON.stringify` de `Date` vira ISO — isso muda o corpo da sua resposta. `$1` **só substitui valor**, nunca nome de tabela/coluna nem `ASC`/`DESC` (isso é allow-list em código — vai doer no Tema 6). O array de valores é posicional: `$1` é `values[0]`. Em teste, pool aberto **segura o processo** — feche no final.

## 11. SQL injection

**O que resolve?** Nada, se você concatenar. Interpolar entrada do usuário na string de SQL faz o **dado virar comando**.
**Quando usar?** A regra é absoluta: **todo** valor que veio de fora entra como `$n`.
**Exemplo:**

```ts
// NUNCA — `id` = "1 OR 1=1" apaga a tabela; "1; DROP TABLE tasks" é literal
await pool.query(`DELETE FROM tasks WHERE id = ${req.params.id}`);

// SEMPRE
await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
```

**Armadilhas:** validar antes (`Number.isInteger`) ajuda mas **não substitui** o parâmetro — um dia a validação muda e a query fica exposta. Template literal com crase engana: parece seguro, é a mesma concatenação. `pool.query({ text, values })` é a mesma coisa em outra forma. Escapar aspas na mão é o caminho errado — sempre falta um caso. Isso vai cair na avaliação: eu ataco a API no ar.

## 12. Transação pelo Node

**O que resolve?** Vários comandos que precisam valer **tudo ou nada**. No pool, transação exige **a mesma conexão** — `pool.query` pode pegar conexões diferentes a cada chamada, então `BEGIN` num cliente e `COMMIT` noutro não funciona.
**Quando usar?** Quando duas escritas dependem uma da outra (Tema 8: criar usuário + primeira tarefa).
**Exemplo:**

```ts
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO ... ', [a]);
  await client.query('UPDATE ... ', [b]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();                 // sem isso, a conexão nunca volta pro pool
}
```

**Armadilhas:** esquecer `client.release()` no `finally` é o vazamento clássico — a API funciona por 10 minutos e depois congela. Um `throw` no meio sem `ROLLBACK` devolve ao pool uma conexão **com transação aberta**, que envenena o próximo request. Transação longa segura locks e trava outras escritas. Uma query só **já é** uma transação implícita — não envolva tudo em `BEGIN` por reflexo.

---

# Parte B — Aplicação na `api/`

### 1. Preparação do ambiente

Só isto é mastigado; o resto é seu.

```bash
# instalar e subir (WSL Ubuntu)
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo service postgresql start          # precisa repetir a cada sessão do WSL

# usuário e bancos (dev + test, isolados)
sudo -u postgres psql -c "CREATE USER fillip WITH PASSWORD 'dev' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE tasks_dev  OWNER fillip;"
sudo -u postgres psql -c "CREATE DATABASE tasks_test OWNER fillip;"

# conferir
psql -h localhost -U fillip -d tasks_dev -c '\l'
```

`.env` na raiz da `api/` (o `pg` lê estas variáveis sozinho quando você faz `new Pool()` sem argumento):

```
PGHOST=localhost
PGPORT=5432
PGUSER=fillip
PGPASSWORD=dev
PGDATABASE=tasks_dev
```

Carregar: `--env-file=.env` nos scripts (`tsx watch --env-file=.env src/server.ts`), e um `.env.test` com `PGDATABASE=tasks_test` pro vitest. **`.env` no `.gitignore`**, `.env.example` versionado.

Dependências já estão no `package.json` (`pg`, `@types/pg`) — nada a instalar.

Um aviso de setup, não de revisão: o `src/db.ts` que você adiantou importa de `'../node_modules/@types/pg/index.js'`. Isso é o **pacote de tipos**, não a lib. O import é do pacote: `import pg from 'pg'`.

### 2. O que do tema deve ser usado na API

Partindo da linha "A API ganha" e expandindo:

- **Schema no banco**, criado por um `.sql` versionado no repo (rodado à mão via `psql` — migrations são o Tema 7): tabela `tasks` com PK identity, `NOT NULL`, `DEFAULT` e `CHECK` cobrindo as mesmas regras que hoje só existem no `isNewTask`. Decida o tipo de `term` (`text` × `timestamptz`) sabendo que `timestamptz` muda o JSON da resposta — e **registre a decisão no `api/README.md`**.
- **`db.ts`**: um pool único, exportado, com um `query` fino por cima. Todo código dentro da `api/` é seu, incluindo este.
- **As 5 rotas passando a ler/escrever no banco** — o array e o `nextId` somem, e os handlers viram `async`. Repare no que o Express 5 faz com `throw` dentro de `async` (Tema 2, tópico 12).
- **`RETURNING`** no POST/PATCH/DELETE, e `rowCount` decidindo 404 — sem `SELECT` extra pra "ver se existe".
- **Todo valor externo como `$n`**. Zero concatenação, inclusive no PATCH parcial (que precisa montar o `SET` dinâmico: os **nomes** de coluna saem de allow-list em código, os **valores** de `$n`).
- **A borda do banco tipada com o mesmo rigor do Tema 3**: `pool.query<Task>` é uma promessa, não uma prova — decida o que faz com isso e defenda a escolha.
- **Testes contra o `tasks_test`**: schema aplicado, limpeza entre testes (`TRUNCATE ... RESTART IDENTITY`), pool fechado no fim. Improviso aceito aqui — o Tema 5 organiza isso.
- **`api/README.md`** atualizado: como subir o banco, variáveis de ambiente, schema, decisões do tema.

### 3. Critérios

- `npm test` verde (typecheck + vitest) rodando contra `tasks_test`, e verde **duas vezes seguidas** sem limpar nada à mão.
- Servidor reiniciado → as tarefas continuam lá. O array em memória não existe mais em lugar nenhum.
- `DELETE /tasks/9999` → 404; `GET /tasks/abc` → 400; corpo inválido → o formato de erro de sempre, nunca 500.
- Nenhuma query com valor concatenado. `title` com aspas simples (`pão d'alho`) grava e volta certo.
- Banco derrubado (`sudo service postgresql stop`) → a API responde erro tratado, não trava pendurada.
- `api/README.md` atualizado e commits `t04: ...` no push.

### 4. Aguardar execução

Você constrói, ponta a ponta. Eu fico quieto. Se travar, a pergunta é sua e eu respondo o conceito.

### 5. Revisão do código

Me chama no fim; eu leio a `api/` inteira e aponto de forma simples onde estão os erros e o que faltou, pra você corrigir.

---

# Parte C — Questionário

> Respostas curtas no `devlog-etapa-2.md`.

1. Por que o Postgres é "outro processo" e não um arquivo? O que isso muda na hora do deploy?
2. Qual a diferença entre cluster, banco, schema e tabela?
3. Você recebeu `ECONNREFUSED 5432`. O que isso te diz e o que **não** te diz?
4. Cite três regras que você moveu do código pro schema. Por que vale a pena duplicar a validação nos dois lugares?
5. Por que `timestamptz` e não `timestamp`?
6. Quando um `DEFAULT` age e quando ele é ignorado?
7. `'x'` × `"x"` em SQL: qual é qual, e por que `snake_case` te livra das aspas duplas?
8. `WHERE term = NULL` devolve zero linhas mesmo tendo linhas com `term` nulo. Por quê?
9. Por que `NOT NULL` e `CHECK` juntos, se o `CHECK` já parece cobrir?
10. Que bug o `WHERE status <> 'done'` esconde numa tabela com `NULL`?
11. O que `RETURNING` te economizou nas rotas de escrita? Como o `rowCount` virou seu 404?
12. Por que rodar um `UPDATE` à mão dentro de `BEGIN`/`ROLLBACK`?
13. Por que `ILIKE '%termo%'` não usa índice? Onde entra o `%` — no SQL ou no parâmetro?
14. Diferença entre `WHERE` e `HAVING` numa query com `GROUP BY`.
15. Por que `COUNT(*)` e `COUNT(term)` podem dar números diferentes?
16. O que um índice custa? Cite um caso em que criar índice é má ideia.
17. `EXPLAIN` na sua tabela deu `Seq Scan`. Por que isso não é necessariamente um problema?
18. `INNER JOIN` × `LEFT JOIN`: o que muda no resultado quando falta o par?
19. O que o `ON DELETE CASCADE` faz e por que ele é conveniente e perigoso ao mesmo tempo?
20. O que o pool resolve? O que acontece se você criar um `Pool` por request?
21. Por que `pool.query<Task>(...)` é a mesma mentira que `req.body as Task` do Tema 3? O que você decidiu fazer a respeito?
22. Cite duas coisas que o `pg` te devolve num tipo diferente do que você esperava, e o efeito disso na resposta JSON.
23. `$1` serve pra valor mas não pra nome de coluna. Como você resolveu o `SET` dinâmico do PATCH?
24. Por que validar o id como inteiro **não** substitui a query parametrizada?
25. Por que transação exige `pool.connect()` e não dá pra fazer com `pool.query`?
26. O que acontece se faltar o `client.release()` no `finally`? E se faltar o `ROLLBACK` no `catch`?
27. Como você isolou o banco de teste, e o que garante que `npm test` roda duas vezes seguidas dando o mesmo resultado?
28. **(fecho)** O que ficou pior na API depois de trocar o array pelo banco, e o que ficou mal resolvido pro Tema 5 ou 6 arrumar?
