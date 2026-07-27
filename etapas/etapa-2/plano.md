# Etapa 2 — Back-end completo

> **Históricos** · `archived/archive-stage-complete/`, `archived/archive-t03/` · **23/07/2026** alterado metodologia de estudo · **Avaliação alvo: 30/07/2026**

## Objetivo

Construir o **lado do servidor**: uma API REST de tarefas completa — rotas com validação e status corretos, testes automatizados, PostgreSQL, TypeScript strict e deploy — **pública no ar** ao fim da etapa. É ela que a Etapa 3 (React) vai consumir: o front do mês seguinte conversa com a URL que esta etapa entrega, formando o primeiro sistema completo.

## Regras da etapa

1. **Trilha de IA — fase REVISOR:** proibido pedir código pronto. A IA explica conceitos, escreve enunciados e faz **code review depois que o seu código funciona** (bugs, casos de borda, alternativas — em formato antes→depois). Quem digita é você.
2. **Commits diários** no GitHub, push conferido.
3. **Stack travada:** Ideias novas no meio do caminho → `ideias-depois.md`.
4. Um tema só fecha quando os quatro estão feitos: (a) o que o tema entrega está na api/, rodando; (b) npm test verde; (c) revisão da Parte B feita e as correções aplicadas; (d) questionário da Parte C respondido no devlog e tudo commitado e no push.
5. **O contrato da API mora no `api/README.md`** rotas, status, formato de erro, arquitetura, como rodar, URL de produção. Uma fonte de verdade só, e é a que quem visita o repositório lê.
6. **`studie-tNN-tema.md` na abertura de cada tema:** dividido em três partes: **Parte A**: a IA detalha cada tópico de estudo sugerido na estrutura: 1- O que resolve? 2- Quando usar? 3- Exemplo pequeno. 4- Armadilhas. **Parte B**: alterações na API: 1- Preparação do ambiente (setup de ferramenta — instalar/subir Postgres, criar base, variável de ambiente — é a única coisa que a IA entrega pronta; é atrito, não aprendizado). 2- O que do tema deve ser usado na API. 3- Critérios. 4- Aguardar execução. 5- Revisão do código (apontar de forma simples onde estão os erros e o que faltou para eu corrigir). **Parte C**: questionário enumerado sobre o tema, as respostas ficarão no devlog da etapa.
7. Autonomia na aplicação. A Parte A é consulta e a Parte B é enunciado — não roteiro. Aberto o tema, eu aplico sozinho na api/: decido o desenho, erro, corrijo e commito sem pedir passo a passo. A IA só volta a falar na revisão (Parte B item 5) e no questionário (Parte C). Se eu travar, a pergunta é minha — a IA responde o conceito, não a implementação. Validado no Tema 3 (24/07): API inteira portada pra TS sem guia. 

## Estrutura de pastas

**`api/` — a API viva.** projeto de estudo da etapa. Ela vai evoluindo a cada tema que passa, cada tema aberto é adicionado os novos conceitos. Ex.: quando entra no TS, todo codigo é transformado em TS.

**`studies/` — a pasta de estudo dos temas.** Guarda tudo que **não** é a API.

```
etapas/etapa-2/
├── api/                ← API viva
├── archived/           ← histórico
├── studies/            ← tudo relacionado ao estudo do projeto que não vai na API
├── devlog-etapa-2.md   ← devlog da etapa
└── plano.md            ← plano da etapa
```

## Os temas

### Tema 1 — Node · *dia sugerido 21/07* · ✅ Feito (21/07)
**Tópicos de estudo sugeridos**

1. O que é um servidor: um processo vivo escutando uma porta.
2. Anatomia do HTTP: linha inicial, headers, corpo; métodos; famílias de status.
3. O módulo `node:http` cru: `createServer`, `req`/`res`, `listen`.
4. Streams: `req`/`res` são fluxos, não blocos.
5. Event loop: uma thread, um evento por vez.
6. `uncaughtException`/`unhandledRejection`.
7. `process.env`: código vs ambiente.
8. Projeto npm: package.json, lock, scripts, deps × devDeps, semver, `--watch`.
9. ESM vs CommonJS.
10. Módulos nativos: `path`, `fs/promises`, `crypto`.
11. Debugging: `node --inspect` + VS Code.
12. Testes: Vitest, `describe`/`it`/`expect`.

### Tema 2 — Express · *dia sugerido 22/07* · ✅ Feito (22/07)
**Tópicos de estudo sugeridos**

1. O que o Express acrescenta ao `http` cru.
2. `express.json()` e o `req.body`.
3. As três portas: `params` × `query` × `body`.
4. Rotas com parâmetro (`/tasks/:id`).
5. `express.Router`.
6. Semântica REST: verbos e status de escrita.
7. Idempotência.
8. Resposta bem-feita: 201 + `Location`; 405.
9. Middleware: `app.use`, ordem, `next()`.
10. `morgan`.
11. Validação + erro centralizado.
12. Erro em handler async (Express 4 × 5).
13. Testes: supertest.

### Tema 3 — TypeScript · *dia sugerido 23/07* · ✅ Feito (24/07)
**A API ganha:** ela nasce aqui — criada a partir do ex13 do Tema 2 e portada inteira para TypeScript strict.

**Tópicos de estudo sugeridos**

1. O que o TS resolve e o que cobra.
2. Tipos básicos, inferência, `any` vs `unknown`.
3. `interface`/`type`.
4. União e narrowing.
5. União literal no lugar de enum.
6. Tipar funções e bordas (`unknown` até provar o contrário).
7. Type predicates.
8. Discriminated unions.
9. Generics + `strictNullChecks` na prática.
10. Utility types.
11. `as` e `satisfies`.
12. O `tsconfig`.
13. Testes em TS.

### Tema 4 — Banco (PostgreSQL) · *dia sugerido 24/07*
**A API ganha:** tarefas persistidas em PostgreSQL via `pg`, com pool e queries parametrizadas — o array em memória morre.

**Tópicos de estudo sugeridos**

1. Servidor × cliente: o processo na 5432 e o `psql`.
2. Como criar banco e tabela: tipos, `NOT NULL`, `DEFAULT`, `CHECK`, PK.
3. Aspas simples × duplas; snake_case.
4. O CRUD em SQL: `SELECT` (colunas, operadores do `WHERE`, `ORDER BY`, `LIMIT`/`OFFSET`, ordem das cláusulas), `INSERT`, `UPDATE`, `DELETE`; `RETURNING`; `BEGIN`/`ROLLBACK`.
5. `NULL` de verdade.
6. `LIKE`/`ILIKE`.
7. Agregações.
8. `UNIQUE`, índices, `EXPLAIN`.
9. Duas tabelas: FK, `JOIN`, `CASCADE`.
10. O `pg`: pool + queries parametrizadas.
11. SQL injection.
12. Transação pelo Node.

### Tema 5 — Testes a fundo · *dia sugerido 25/07*
**A API ganha:** suíte reorganizada — banco de teste isolado, fixtures e factories no lugar do improviso do Tema 4, cobertura medida.

**Tópicos de estudo sugeridos**

1. A pirâmide: unitário × integração × e2e.
2. Padrão AAA.
3. Hooks de ciclo de vida.
4. Fixtures e factories.
5. `it.each`.
6. Dublês: mock, spy, stub.
7. Tempo falso.
8. Testar o tratador de erro.
9. `.skip`/`.only`/`.todo`.
10. Snapshot testing.
11. Cobertura.
12. TDD.
13. O que NÃO testar.
14. Property-based.
15. Testes contra banco: banco de teste, limpeza entre testes, o que isolar e o que não.

### Tema 6 — Arquitetura em camadas + listas de verdade · *dia sugerido 26/07*
**A API ganha:** rota, serviço e repositório separados; `GET /tasks` com paginação, filtro e ordenação segura; validação com zod na borda.

**Tópicos de estudo sugeridos**

1. Por que separar camadas.
2. O caminho do pedido pelas camadas.
3. Injeção de dependência.
4. Erros de domínio.
5. DTO: banco ≠ resposta.
6. Validação com zod.
7. Paginação.
8. Cursor vs offset.
9. Filtros e busca.
10. Ordenação segura.

### Tema 7 — Migrations + ORM · *dia sugerido 27/07*
**A API ganha:** schema versionado em migrations com up/down + seed — nenhuma tabela criada à mão sobrevive.

**Tópicos de estudo sugeridos**

1. O problema do schema sem histórico.
2. Migration up/down.
3. Schema × dados.
4. Rollback.
5. Seeds.
6. O que o ORM abstrai e cobra.
7. Comparação prática.
8. O problema N+1.
9. Transações no ORM; Prisma Studio.
10. Por que SQL primeiro, ORM depois.

### Tema 8 — Autenticação + segurança de borda · *dia sugerido 28/07*
**A API ganha:** `POST /auth/register` e `POST /auth/login`; tarefas passam a ter dono e as rotas exigem token — mais helmet, CORS e rate limiting na borda.

**Tópicos de estudo sugeridos**

1. Hash com salt; por que não é reversível.
2. `bcrypt.compare` e timing attacks.
3. Cadastro e login.
4. Mensagens que não entregam.
5. Sessão × JWT.
6. Cookie httpOnly × header; CSRF.
7. Refresh token; limites do logout com JWT.
8. Middleware de auth: 401 × 403...
9. Mass assignment.
10. CORS a fundo.
11. Helmet + rate limiting.
12. Dados sensíveis fora dos logs.
13. OWASP Top 10.
14. 2FA e OAuth.

### Tema 9 — Deploy · *dia sugerido 29/07*
**A API ganha:** URL pública no ar com banco gerenciado, `/health`, logs estruturados e graceful shutdown.

**Tópicos de estudo sugeridos**

1. Dev × teste × produção.
2. Banco gerenciado.
3. O caminho do deploy.
4. Processo que cai e volta.
5. `/health`.
6. Graceful shutdown.
7. Logs estruturados.
8. Monitor de uptime.
9. Free tier na prática.
10. Backup.
11. Auto-ataque.

### Tema 10 — Docker + CI · *dia sugerido 30/07*
**A API ganha:** `Dockerfile` multi-stage + `docker compose` com Postgres + CI no GitHub Actions rodando a suíte verde a cada push.

**Tópicos de estudo sugeridos**

1. Imagem × container.
2. `Dockerfile` da API.
3. Cache de camadas.
4. Multi-stage build.
5. `docker compose`.
6. Volumes.
7. Kit de inspeção.
8. CI: workflow no push.
9. Postgres no CI.
10. Cache e secrets no CI.
11. Badge.
12. CD.

---

## Avaliação

Entregáveis: URL pública respondendo · api/README.md como contrato completo · repositório com CI verde no último push.

Prova prática: eu ataco a API no ar — SQL injection, mass assignment, payload gigante, id inválido, token de outro usuário, rota sem auth. Suíte roda na hora, na sua máquina. Eu derrubo o processo e ele volta.

Oral: uma pergunta por tema — event loop, middleware, o que o strict pegou, query parametrizada e pool, o que você não testa e por quê, por que camadas, por que migration e não CREATE TABLE, 401 × 403, o que muda de dev pra produção, o que o Docker resolveu.

Reprova se: um ataque passa · a API cai e não volta · você não sabe defender uma decisão que você tomou.