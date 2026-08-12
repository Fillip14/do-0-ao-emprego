# O que ficou pra trás — Etapa 2, encerrada 11/08

Registro enxuto, não material de estudo. Só pra eu saber, se um dia quiser voltar aqui, o que nunca cheguei a ver. Detalhe do porquê e da decisão de fechar está em [`../plano.md`](../plano.md#encerramento).

## Tema 4 — questionário
Nunca respondido. Era pra ser absorvido pelo simulado do fim (regra 8) — o simulado não aconteceu, então isso também não.

## Tema 7 — Migrations + ORM
Cheguei a escolher Prisma e instalar (`prisma init`, `db pull` introspectando `tasks`/`users`), depois revertido — nada ficou integrado ao código.

Tópicos que ficaram sem ver:
- O problema do schema sem histórico; migration up/down; rollback; seeds.
- O que o ORM abstrai e cobra; o problema N+1; transações no ORM.
- Por que SQL primeiro, ORM depois.

## Tema 8 — o que faltou dentro dele
Básico fechado (hash+salt, JWT, register/login, `requireAuth`, dono da tarefa, 403, CORS pro header `Authorization`, Helmet). Ficou de fora:

- **Front:** login de verdade, `RequireAuth` real (hoje sempre `true`), token no fetch. Efeito: o front não fala mais com a API (401 em tudo).
- Refresh token e os limites do logout com JWT.
- Mass assignment a fundo (a defesa básica — dono vem do token, não do corpo — já está feita).
- 2FA e OAuth.
- OWASP Top 10 (passada formal, além do que já foi aplicado sem nomear).
- Dados sensíveis fora dos logs — não verificado a fundo.

## Tema 9 — Deploy
Nada feito. A API só roda local.

Tópicos: dev × teste × produção, banco gerenciado, `/health`, graceful shutdown, logs estruturados, monitor de uptime, backup, auto-ataque.

## Tema 10 — Docker + CI
Nada feito.

Tópicos: `Dockerfile` multi-stage, cache de camadas, `docker compose` com Postgres, CI no GitHub Actions rodando a suíte a cada push, cache/secrets no CI, badge, CD.

## A oral
Não aconteceu — nem a rodada de perguntas por tema, prevista na regra 7 do `plano.md`.
