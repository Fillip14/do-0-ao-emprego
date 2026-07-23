# Etapa 2 — Back-end completo

> **Históricos** · `arquivo-v1/`, `t03-typescript/arquivo-t03/` · **23/07/2026** alterado metodologia de estudo · **Avaliação alvo: 28/09/2026, antecipável** no checkpoint.

## Objetivo

Construir o **lado do servidor**: uma API REST de tarefas completa — rotas com validação e status corretos, testes automatizados, PostgreSQL, TypeScript strict e deploy — **pública no ar** ao fim da etapa. É ela que a Etapa 3 (React) vai consumir: o front do mês seguinte conversa com a URL que esta etapa entrega, formando o primeiro sistema completo.

## Regras da etapa

1. **Trilha de IA — fase REVISOR:** proibido pedir código pronto. A IA explica conceitos, escreve enunciados e faz **code review depois que o seu código funciona** (bugs, casos de borda, alternativas — em formato antes→depois). Quem digita é você.
2. **Commits diários** no GitHub, push conferido.
3. **Checkpoint a cada tema** (verde/amarelo/vermelho) contra a âncora da avaliação. Amarelo/vermelho → replaneja, e a marca pessoal pausa primeiro.
4. **Stack travada:** Node + Express + TypeScript + PostgreSQL. Ideia nova no meio do caminho → `ideias-depois.md`.
5. **A API é progressiva — todo tema entrega ela mais completa.** O que for estudado tem que estar *dentro* da `api/`, rodando e commitado, antes do checkpoint, só assim o tema fecha.
6. **O contrato da API mora no `api/README.md`** rotas, status, formato de erro, arquitetura, como rodar, URL de produção. Uma fonte de verdade só, e é a que quem visita o repositório lê.
7. **`estudo.md` na abertura de cada tema:** dividido em duas partes: Parte A: a IA detalha cada ponto do tema, colocando uma explicação simples e direta. Parte B: relacionado a mudança da API, dividido em marcos, cada marco precisa ter descrito o que é para ser entregue, desde preparação do ambiente (instalação de pacotes, configurações) até o final.
8. **Decisões técnicas** adicionadas a medida que cada tema avança, sempre ao iniciar a parte B de um tema deve-se conversar, discutir e avaliar quais as melhores opções para a API referente àquele tema e se é viável aplica-la. Com a decisão tomada deve-se adicionar no `api/README.md` com novo tópico.

Exemplo de explicação de métodos:
### interface
`interface` faz *declaration merging* e costuma ser preferida.
```ts
interface User {
  readonly id: number;   // não pode ser reatribuído depois
  email: string;
  nickname?: string;     // opcional: string | undefined
}
```

Exemplo de tópico:
Tema 2 TypeScript: optado por usar interface.

## Estrutura de pastas

Dois lugares, com papéis distintos:

**`api/` — a API viva.** projeto de estudo da etapa. Ela vai evoluindo a cada tema que passa, cada tema aberto é adicionado os novos conceitos. Ex.: quando entra no TS, todo codigo é transofrmado em Ts.

**`tNN-*/` — a pasta de estudo do tema.** Guarda tudo que **não** é a API: playground, respostas escritas, conceitos.

```
etapas/etapa-2/
├── arquivo-v1/              ← trabalho de 16–20/07 — histórico
├── api/
│   ├── src/
│   ├── package.json
│   └── README.md
├── t01-node/
├── t02-express/
├── t03-typescript/
├── t04-postgres/
├── t05-testes/
├── t06-camadas/
├── t07-migrations-orm/
├── t08-auth/
├── t09-deploy/
└── t10-docker-ci/
```

## Os temas

### Tema 1 — Node · *semana sugerida 1* · ✅

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

> 20/07 e 21/07: 12/12 exercícios · **checkpoint 🟡 amarelo**: tema árido e abstrato; Ex 07, 10 e 12 voltam pra revisão. Pasta: [`t01-node/`](t01-node/).

### Tema 2 — Express · *semana sugerida 2* · ✅

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

> 21/07 e 22/07: 3/13 exercícios · **checkpoint 🟢 verde**: todos escritos por mim, decisões de contrato justificadas e um bug real (`POST` sem `Content-Type` → 500) achado por raciocínio e coberto por teste. Ponto de atenção: ritmo — tema de uma semana fechado em dois dias. Pasta: [`t02-express/`](t02-express/).

### Tema 3 — TypeScript · *semana sugerida 3*

> **`api/`** criada a partir do ex13 do tema 2.

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
14. **Aplicar na `api/`**

### Tema 4 — Banco (PostgreSQL) · *semana sugerida 4*

1. Servidor × cliente: o processo na 5432 e o `psql`.
2. Como criar banco e tabela: tipos, `NOT NULL`, `DEFAULT`, `CHECK`, PK.
3. Aspas simples × duplas; snake_case.
4. SQL essencial com WHERE; `RETURNING`; `BEGIN`/`ROLLBACK`.
5. `NULL` de verdade.
6. `LIKE`/`ILIKE`.
7. Agregações.
8. `UNIQUE`, índices, `EXPLAIN`.
9. Duas tabelas: FK, `JOIN`, `CASCADE`.
10. O `pg`: pool + queries parametrizadas.
11. SQL injection.
12. Transação pelo Node.
13. Testes com banco.
14. **Aplicar na `api/`**

### Tema 5 — Testes a fundo · *semana sugerida 5*

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
15. **Aplicar na `api/`**

### Tema 6 — Arquitetura em camadas + listas de verdade · *semana sugerida 6*

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
11. **Aplicar na `api/`**

### Tema 7 — Migrations + ORM · *semana sugerida 7*

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
11. **Aplicar na `api/`**

### Tema 8 — Autenticação + segurança de borda · *semana sugerida 8*

1. Hash com salt; por que não é reversível.
2. `bcrypt.compare` e timing attacks.
3. Cadastro e login.
4. Mensagens que não entregam.
5. Sessão × JWT.
6. Cookie httpOnly × header; CSRF.
7. Refresh token; limites do logout com JWT.
8. Middleware de auth: 401 × 403..
9. Mass assignment.
10. CORS a fundo.
11. Helmet + rate limiting.
12. Dados sensíveis fora dos logs.
13. OWASP Top 10.
14. 2FA e OAuth.
15. **Aplicar na `api/`**

### Tema 9 — Deploy · *semana sugerida 9*

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
12. **Aplicar na `api/`**

### Tema 10 — Docker + CI · *semana sugerida 10*

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
13. **Aplicar na `api/`**

---

## Avaliação

Demo ao vivo · o avaliador ataca a API com requisições maliciosas · suíte verde na hora · oral: status codes, middleware, por que queries parametrizadas, pool, o que o strict deu, e as decisões de contrato tomadas.
