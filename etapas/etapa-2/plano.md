# Etapa 2 — Back-end completo

> ✅ **Encerrada incompleta em 11/08/2026, por decisão dele.** Retomada nesse mesmo dia a partir do Tema 5 (pausada desde 28/07 enquanto a Etapa 3 corria) e fechada horas depois — cansaço declarado do projeto, prioridade em seguir para outros estudos. Nada do que já rodava foi descartado; o que ficou sem fazer está registrado, resumido, em [`studies/pendencias-nao-feitas-11-08.md`](studies/pendencias-nao-feitas-11-08.md). Detalhe completo do fechamento na seção **Encerramento**, no fim deste arquivo. Front encerrado e no ar: [`../etapa-3/plano.md`](../etapa-3/plano.md).
>
> **Históricos** · `archived/archive-stage-complete/`, `archived/archive-t03/` · **23/07/2026** alterado metodologia de estudo

## Estado no encerramento (11/08)

**Fechados:** Temas 1 a 6 e 8 (básico, back-end) — 7 de 10 temas. A API roda em TypeScript strict, com Express, erro central, camadas (rota/serviço/repositório), validação com zod, tarefas persistidas em PostgreSQL via `pg`, e autenticação: hash com `bcrypt`, JWT, `requireAuth` em `/tasks`, dono da tarefa (`owner_id`), `403` pra quem não é dono, CORS liberando `Authorization`, Helmet.

**Não fechados — e não serão nesta etapa:**

- **Tema 4** — questionário nunca respondido. Não foi absorvido pelo simulado do fim (regra 8) porque o simulado não aconteceu.
- **Tema 7 (Migrations + ORM)** — aberto e pausado no meio, depois **revertido**: Prisma desinstalado, `prisma/` e `prisma.config.ts` removidos. Nada dele chegou a ficar integrado ao código real (que segue só em `pg`).
- **Tema 8, o front** — `RequireAuth` segue sempre autenticado, sem tela de login, sem token no fetch. Decisão explícita: não fechar hoje. Efeito colateral aceito: `/tasks` agora exige token e o front não manda nenhum, então o CRUD contra a API local está quebrado até isso ser retomado — ver nota no [`web/README.md`](../etapa-3/web/README.md#limitações).
- **Tema 8, avançado** — refresh token/logout, 2FA/OAuth, OWASP Top 10 a fundo: nunca abriram.
- **Tema 9 (Deploy)** — não feito. A API roda só local, sem URL pública.
- **Tema 10 (Docker + CI)** — não iniciado.
- **A oral** (regra 7) — não aconteceu.

Resumo enxuto de cada tema não feito — só o suficiente pra retomar estudo se um dia fizer sentido: [`studies/pendencias-nao-feitas-11-08.md`](studies/pendencias-nao-feitas-11-08.md).

> **11/08 — sessão fora do método normal, a pedido explícito, e exceção registrada:** os Temas 5, 6 e 8 (básico) foram escritos pela IA direto na `api/`, sem par de programação — o Tema 5 já tinha `studie-t05-testes.md` completo (Parte A/B/C) de antes da pausa; **Temas 6 e 8 não tiveram `studie-tNN` próprio** (regra 5 não seguida à risca), só o resumo condensado em [`studies/resumo-temas-5-10-miolo.md`](studies/resumo-temas-5-10-miolo.md). Fechamento decidido por ele, informado do que isso significa: o código rodando e verificado (`npm install`+`typecheck`+`test` verdes, cobertura lida, suíte isolada, formato de erro por campo confirmado contra o front local, `/auth/register`+`/auth/login` testados na mão) substitui o material de estudo formal desta vez. Detalhe completo em [`studies/pendencias-temas-5-8-11-08.md`](studies/pendencias-temas-5-8-11-08.md).

**A API não volta a ficar congelada — e para nesse estado.** O congelamento valeu durante a Etapa 3, com uma exceção única já entregue em 09/08: CORS para `http://localhost:5173`, middleware na mão em `app.ts`, primeiro da cadeia. O contrato continua em [`api/README.md`](api/README.md), e quem lia esse contrato era um front que existe — mas com o Tema 8 fechando só no back-end, esse front hoje **não consegue mais falar com a API**: `/tasks` exige token, o front não manda nenhum, toda chamada recebe `401`.

**O front ficou com três coisas esperando, uma paga:** o **erro por campo** foi pago no Tema 6 (zod na borda) — o `ApiError.fieldErrors` do front, escrito e sem cliente desde a Etapa 3, recebe o formato certo, mas isso não foi verificado pela tela, só via curl. Continuam esperando o **aviso de demonstração duplicado** (morreria com URL pública, Tema 9, que não aconteceu) e, agora, o **login** (Tema 8 front, que não aconteceu). Lista completa nas *Limitações* do [`web/README.md`](../etapa-3/web/README.md).

**O sistema fica incompleto de ponta a ponta — decisão registrada, não pendência esquecida.** O Tema 8 básico deu à API `/auth/register`, `/auth/login` e exigência de token em `/tasks`; o front nunca chegou a consumir isso. Fechar de verdade exigiria o resto do Tema 8 (login no front) e o Tema 9 (deploy, `VITE_API_URL` apontando pra URL pública) — nenhum dos dois vai acontecer nesta etapa.

**Profundidade dos temas 5 a 10 — decidido em 28/07, revisado em 11/08:** um diagnóstico de perfil recomendou rebaixar PostgreSQL, Docker e CI a "nível de sobrevivência de entrevista". Foi **recusado** na ocasião — mas essa recusa valia para quando a etapa fosse retomada de verdade. Ela foi retomada e encerrada no mesmo dia, por decisão dele: os Temas 7 e 10 não chegaram a rodar com esse escopo nem com nenhum outro.

## Objetivo

Construir o **lado do servidor**: uma API REST de tarefas completa — rotas com validação e status corretos, testes automatizados, PostgreSQL, TypeScript strict e deploy — **pública no ar** ao fim da etapa. É ela que a Etapa 3 (React) vai consumir: o front do mês seguinte conversa com a URL que esta etapa entrega, formando o primeiro sistema completo.

## Regras da etapa

1. **Trilha de IA — fase PAR DE PROGRAMAÇÃO** (desde 29/07). Liberada a geração de **trechos pequenos** (uma função, um middleware, um tipo), com **uma condição: você entende cada linha antes de commitar** — se não entende, pergunta ou reescreve. Habilidade treinada: validar e entender código que você não escreveu.
2. **Commits diários** no GitHub, push conferido.
3. **Stack travada:** Ideias novas no meio do caminho → [`ideias-depois.md`](../../ideias-depois.md).
4. **Um tema só fecha quando a Parte C estiver concluída**: o que o tema entrega está na `api/` rodando, `npm run typecheck` limpo, `npm test` verde, tudo commitado e no push. **Pergunta nenhuma trava o fechamento de um tema** (ver regra 8).
5. **O contrato da API mora no `api/README.md`** rotas, status, formato de erro, arquitetura, como rodar, URL de produção. Uma fonte de verdade só, e é a que quem visita o repositório lê — **e a que o front em `../etapa-3/web/` consome**.
5. **`studie-tNN-tema.md` na abertura de cada tema**, feito pela IA em três partes. **Parte A:** _1- O que é (descrever funções/metódos do tópico). 2- Para que serve, o que substitui, diminui algo do código, refatora, facilita, etc? 3- Exemplo pequeno. **Parte B:** alterações no app — \_1- Preparação do ambiente_ (setup de ferramenta se tiver); _2- Os blocos_: Bloco 1: o que é para o app fazer/ter agora. Bloco 2: sugestões de alterações médio/avançado para colocar no app. Toda a Parte B em tópicos, simples, breve. **Parte C:** revisão do código. Verificar se o app foi migrado para o assunto do tema (as alterações obrigatórias do tema), se ele está typecheck ok e se os testes estão verdes (caso já tenha testes).
6. **Um tema só fecha quando a parte C estiver concluida**
7. **A defesa oral acontece uma vez, no fim: o simulado de entrevista**, depois do Tema 14 e imediatamente antes da avaliação de 12/08 — é o último bloco da etapa, não um extra opcional. São as 14 perguntas da Avaliação, uma por tema, no formato de entrevista — eu respondo falado e curto (2–3 frases), a IA contra-argumenta em cima, e o que não se sustentar me manda de volta à Parte A daquele tema.
8. **A partir do Tema 9 (deploy), o que está na `main` está no ar.** Tema fechado sem redeploy é tema não fechado; sem URL pública respondendo, não conta como terminado. Até lá o alvo é a suíte verde no push; do Tema 9 em diante são as duas coisas. Vale para a `api/` e, no dia em que o `VITE_API_URL` do front passar a apontar para a URL pública, para o sistema inteiro.

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

### Tema 4 — Banco (PostgreSQL) · *dia sugerido 24/07* · ✅ Feito (28/07)
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

### Tema 5 — Testes a fundo · *dia sugerido 25/07* · aberto em 28/07, congelado no meio · ✅ **Feito (11/08)**
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

### Tema 6 — Arquitetura em camadas + listas de verdade · *dia sugerido 13/08* · ✅ **Feito (11/08)**
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

### Tema 7 — Migrations + ORM · *dia sugerido 14/08* · ⬜ **não feito** — aberto e revertido em 11/08
**A API ganha:** schema versionado em migrations com up/down + seed — nenhuma tabela criada à mão sobrevive.

> **Ponto de pausa (11/08):** Prisma escolhido (cobre migration + ORM num tool só; o `pg` continua sendo quem a API usa de verdade, o Prisma é schema versionado + estudo/comparação). Já feito: `npm install -D prisma`, `npm install @prisma/client`, `npx prisma init`, `DATABASE_URL` corrigido no `.env` pra apontar `tasks_dev`, `npx prisma db pull` (introspectou `tasks`/`users` certinho, `_check_ constraints` não suportadas pelo Prisma — esperado, continuam valendo no banco). **Faltando decidir:** nome dos models (`@@map`, cosmético) e `ON DELETE` da FK `owner_id → users.id` (cascade / set null / bloquear — decisão de comportamento real). Depois disso: `prisma migrate dev --create-only --name baseline` + `prisma migrate resolve --applied` pra registrar o schema atual como ponto de partida sem recriar as tabelas.
>
> **Revertido no mesmo dia:** decisão de fechar a etapa sem terminar este tema. `prisma/`, `prisma.config.ts`, os pacotes `prisma`/`@prisma/client` e o `DATABASE_URL` no `.env` foram removidos — nada do Prisma chegou a ficar integrado ao código real. Retomar do zero se um dia isso importar; o ponto de decisão (nome dos models, `ON DELETE`) continua registrado acima, caso ajude.

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

### Tema 8 — Autenticação + segurança de borda · *dia sugerido 15/08* · ✅ **back-end fechado (11/08)** — front, refresh token, 2FA/OAuth e OWASP a fundo não feitos, etapa encerrada antes de retomar
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

### Tema 9 — Deploy · *dia sugerido 16/08*
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

### Tema 10 — Docker + CI · *dia sugerido 17/08*
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

## Encerramento

> **Encerrada incompleta em 11/08/2026, por decisão dele.** Não é a avaliação abaixo — essa avaliação pedia URL pública, ataque à API no ar e CI verde, nenhum dos três aconteceu. É encerramento por cansaço declarado do projeto e prioridade em seguir para outros estudos, com o que já tinha rodando (Temas 1–6 e 8 básico, `npm test` verde no último rodar) mantido e organizado, e o resto — Temas 4 (questionário), 7, 9, 10, Tema 8 front/avançado, oral — registrado como não feito, sem fingir que foi. Resumo de estudo do que ficou pra trás: [`studies/pendencias-nao-feitas-11-08.md`](studies/pendencias-nao-feitas-11-08.md). Efeito prático: a API só roda local, e o front da Etapa 3 não fala mais com ela sem token — ver `web/README.md`.

A seção abaixo é a avaliação **original**, planejada antes da decisão de encerrar — fica como registro do que essa etapa pediria se tivesse sido seguida até o Tema 10.

Entregáveis: URL pública respondendo · api/README.md como contrato completo · repositório com CI verde no último push.

Prova prática: eu ataco a API no ar — SQL injection, mass assignment, payload gigante, id inválido, token de outro usuário, rota sem auth. Suíte roda na hora, na sua máquina. Eu derrubo o processo e ele volta.

**Oral — uma pergunta por tema.** Esta lista é também o roteiro do **simulado de entrevista** que roda depois do Tema 10, logo antes da avaliação (regra 8), com prioridade para o que estiver marcado com ⚠️ no devlog: event loop · middleware · o que o strict pegou · query parametrizada e pool · o que você não testa e por quê · por que camadas · por que migration e não CREATE TABLE · 401 × 403 · o que muda de dev pra produção · o que o Docker resolveu.

Reprova se: um ataque passa · a API cai e não volta · a URL pública está quebrada ou desatualizada · você usou um trecho gerado pela IA que não sabe explicar linha a linha · você não sabe defender uma decisão que você tomou.