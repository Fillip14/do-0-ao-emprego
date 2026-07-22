# Devlog — Etapa 2 (Back-end: Node, Express, TypeScript e banco)

### 16/07 ao 20/07/2026

1. **v1 da etapa (arquivada)** — sob o plano antigo de 5 semanas com entregável semanal, 4 "semanas" fecharam em 5 dias: API Express em memória testada no Bruno (S1) · CRUD completo com validação, erro centralizado e 15 testes Vitest/supertest (S2) · PostgreSQL com queries parametrizadas, SQL injection demonstrada de verdade e banco de teste isolado (S3) · migração TypeScript `strict` com 16 testes verdes (S4). O código funcionou, mas velocidade não virou retenção — **etapa reiniciada em 21/07** com plano novo de 10 semanas; código e detalhes da v1 em [`etapas/etapa-2/arquivo-v1/`](etapas/etapa-2/arquivo-v1/) |


# Reinício da etapa · 21/07/2026

### 21/07

- **Tema 1 (Node) aberto e fechado** — 12/12 exercícios, pasta `t01-node/`, checkpoint 🟡 amarelo.
- **Tema 2 (Express) aberto** — `exercicios.md` criado em `t02-express/` com os 13 tópicos do plano; Ex 01 a 11 feitos no mesmo dia.

- O que aprendi: node · e no Express: a fila de rotas e o `finalhandler`, `express.json()` e as armadilhas do `req.body`, as três entradas (`params`/`query`/`body`), `Router` com prefixo, a tabela do CRUD e os porquês dos status, idempotência, `Location` e 405, middleware com `res.on('finish')`, tratador de erro central
- Travei/faltou: o formato dos enunciados travou logo no começo — muita pergunta escrita pra responder. Pedi pra reescrever e agora é "Estudar (explicação + código) → o que fazer"
- Amanhã: fechar o Tema 2

### 22/07

- **Tema 2 (Express) fechado** — 13/13 exercícios, pasta `t02-express/`, **checkpoint 🟢 verde**. API final em `t02-express/ex13/` com `app.js` separado do `server.js` e suíte em supertest.

- **Tema 3 (TypeScript) aberto** — `exercicios.md` criado em `t03-typescript/` com **14 exercícios**: os 13 tópicos do plano mais um Ex 14 que porta a API do T2 pra TypeScript.
- **Mudança no plano da etapa**, saída da revisão do enunciado do T3: a API passa a ser explicitamente **progressiva** (regra nova nas regras da etapa — tema que não muda a API não fechou), a pasta nova nasce da **cópia** da anterior a partir do T3 em vez de ser redigitada, e T4, T5 e T7 ganharam exercício de fechamento que traz o aprendizado do tema pra dentro da API.

- O que aprendi: erro em handler `async` e por que o Express 4 penduraria o pedido onde o 5 devolve 500 · separar o `app` do `server` pra poder testar · que suíte verde não quer dizer API correta
- Travei/faltou: nada no código. Revisando a primeira versão do enunciado do T3 achei 9 problemas — contradição entre exercícios, `rootDir` apontando pra uma pasta que nenhum exercício criava, um exemplo de `satisfies` errado, e o principal: 13 exercícios de playground sem nada que roda no fim, que é exatamente o que deixou o T1 amarelo. Enunciado refeito antes de começar.
- Amanhã: Ex 01 do Tema 3