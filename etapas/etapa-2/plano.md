# Etapa 2 — Back-end: Node, Express, TypeScript e banco

> Refeito em 16/07/2026 do zero, usando apenas o cronograma-mestre (`docs/cronograma-etapas.md`) e as regras vivas do projeto. Organização própria desta etapa: **5 semanas, cada uma com um entregável que funciona** — no back-end, "estudei" não conta; "está no ar e responde" conta.

**Objetivo (do cronograma):** API REST completa de tarefas — rotas, validação, status codes corretos, testada em cliente HTTP — com testes automatizados, PostgreSQL conectado pelo Node, TypeScript sobre o que já funciona em JS, e deploy: o back-end no ar antes do front da Etapa 3.

**Decisões de ferramenta (Fillip, 16/07):** cliente HTTP = **Bruno** (no lugar do Postman; collections viram arquivos `.bru` commitáveis no repo — vantagem real pra portfólio) · framework de teste = **Vitest**.

**Início:** 16/07/2026 · **Avaliação alvo:** fim da semana 5 (**19/08**) — pode ser antecipada no checkpoint semanal se os entregáveis vierem antes.

## Regras da etapa

- **Trilha de IA — fase REVISOR:** proibido pedir código pronto. Após cada exercício/feature funcionando, pedir um code review à IA (bugs, casos de borda, alternativas), comparar a solução dela com a sua e registrar no devlog o que acatou/recusou e por quê. A habilidade em treino: ler código alheio criticamente.
- **Commits diários** no GitHub (regra transversal do projeto). Devlog curto por dia — ele também é matéria-prima da trilha de marca pessoal.
- **Checkpoint semanal** (fim de cada semana, aqui no chat): verde/amarelo/vermelho. Amarelo ou vermelho → replanejamos a semana seguinte e a marca pessoal pausa primeiro.
- **Watchlist:** zerada na entrada da etapa; itens entram por evidência nova. Drills periódicos + drill amplo antes da avaliação.
- **Stack travada:** Node + Express + TypeScript + PostgreSQL. Ideia nova no meio do caminho → `ideias-depois.md`.
- Estrutura: tudo em `etapas/etapa-2/`; a API vive em `api/` e evolui semana a semana no mesmo lugar.

---

## Semana 1 (16–22/07) — Node e Express: a primeira API

**Bloco A — HTTP e Node cru.** Entender o ciclo request → response: método, URL, headers, body, status code. Criar um servidor com o módulo `http` puro do Node (sem Express) que responde qualquer coisa — o objetivo é ver o que o Express vai abstrair depois. De Node por dentro: ideia geral do event loop (por que Node atende muita gente com uma thread) e `process.env`.

**Bloco B — Projeto npm decente.** `npm init` na pasta `api/`, entender `package.json` (scripts, dependencies vs devDependencies), `.gitignore` com `node_modules`, script `start` e um modo dev com reinício automático (`node --watch` resolve). Critério: você sabe explicar cada linha do seu `package.json`.

**Bloco C — Express.** Instalar, primeira rota GET devolvendo JSON, `express.json()` (e o que acontece sem ele), rota POST lendo `req.body`, escolher e mandar status code na resposta. Aqui nasce a API de tarefas: array em memória, GET lista, POST cria.

**Bloco D — Bruno e fechamento.** Criar a collection dentro de `api/bruno/`, montar as requests GET e POST, ler a response com atenção (status, headers, body). README mínimo, teste de clone limpo (`git clone` → `npm install` → `npm start` funciona?), code review da IA, checkpoint.

**Entregável 1 — API de tarefas em memória rodando local, com duas rotas:**

- Uma rota **GET** que retorna a lista de tarefas em JSON (array em memória, começa vazio).
- Uma rota **POST** que recebe um JSON com o título da tarefa, adiciona à lista e responde com a tarefa criada e o status code adequado.
- Cada rota testada no Bruno, com a collection (`.bru`) commitada em `api/bruno/`.
- Projeto npm organizado: `npm start` funciona numa máquina que acabou de clonar o repo (com `README` mínimo dizendo como).

## Semana 2 (23–29/07) — API REST completa + testes automatizados

**Bloco A — Desenho REST antes de codar.** Semântica de GET/POST/PUT/PATCH/DELETE e status de escrita (201, 204, 400, 404). Desenhar no papel as 5 rotas de `/tasks`: método, caminho, o que entra, o que sai no sucesso, o que sai em cada erro. Só depois implementar buscar-por-id, atualizar e remover.

**Bloco B — Validação e erro centralizado.** Middleware do Express: o que é, a ordem importa, `next()`. Validar toda entrada do cliente (título vazio? id que não é número? body sem JSON?). Definir SEU formato de erro JSON — decisão sua, justificada no devlog — e um handler de erro central que garante que a API inteira responde erro sempre do mesmo jeito.

**Bloco C — Vitest.** Instalar e configurar, primeiro teste trivial pra ver rodando, depois testes de rota (supertest ou fetch contra o app). Cobrir caso feliz E caso de erro de cada uma das 5 rotas. Devlog: 2–3 linhas de POR QUE Vitest e não Jest — justificar ferramenta é habilidade de entrevista.

**Bloco D — Fechamento.** Collection Bruno com as 5 operações + casos de erro, `npm test` verde, code review da IA, checkpoint.

**Entregável 2 — CRUD completo e testado:**

- `/tasks` com as 5 operações: listar, buscar por id, criar, atualizar, remover.
- Validação em toda entrada do cliente; erro sempre responde com status 4xx adequado e um corpo JSON explicando o problema — formato de erro consistente na API inteira (você define o formato e o mantém).
- Suíte Vitest rodando com `npm test`: caso feliz E caso de erro de cada rota. Nenhuma rota sem teste.
- Collection do Bruno atualizada (as 5 operações + casos de erro).

## Semana 3 (30/07–05/08) — PostgreSQL

**Bloco A — SQL puro, sem Node.** Instalar Postgres no WSL, entrar no `psql`, criar banco e tabela de tarefas (escolher tipos de coluna e justificar), praticar SELECT/INSERT/UPDATE/DELETE com WHERE até sair sem consultar. Salvar os scripts comentados em `sql/`.

**Bloco B — `pg` no Node.** O pacote `pg`, criar o pool (e entender por que pool e não uma conexão por request), primeira query saindo do Node, queries parametrizadas (`$1`) — e provar pra si mesmo, com um exemplo, por que SQL concatenado com string do cliente abre SQL injection.

**Bloco C — Trocar o array pelo banco.** Migrar rota a rota, mantendo o comportamento externo idêntico (mesmas respostas, mesmos status). Teste de fogo: criar tarefas, reiniciar o servidor, elas continuam lá.

**Bloco D — Testes de novo verdes.** Os testes da semana 2 vão quebrar — resolver como isolar (banco de teste ou limpeza entre testes é decisão sua). Suíte verde, Bruno conferido, code review da IA, checkpoint.

**Entregável 3 — a API persiste de verdade:**

- Sessão de SQL puro no `psql` registrada em `sql/` (scripts que você rodou, comentados).
- API usando o banco no lugar do array em memória: reiniciar o servidor não perde nada.
- Todas as queries parametrizadas — zero SQL montado com string do cliente.
- Testes da semana 2 adaptados e verdes de novo (banco de teste ou limpeza entre testes — resolver isso faz parte).

## Semana 4 (06–12/08) — TypeScript sobre o que já funciona

**Bloco A — TS isolado, fora da API.** Num playground à parte: o que o TS resolve (erro antes de rodar), tipos básicos, `interface`/`type`, união e narrowing, tipar funções e retornos. Exercitar até o compilador parar de te surpreender no básico.

**Bloco B — Tooling.** `tsconfig` com `strict` ligado desde o início (ligar depois dói mais), rodar TS em dev (tsx ou similar), compilar pra produção, ajustar os scripts npm pra ambos.

**Bloco C — Migrar a API.** Arquivo por arquivo, compilando a cada passo — nunca "converter tudo e rezar". Definir o tipo da tarefa UMA vez e usá-lo em rota, validação e banco. Tipar o que vem do `pg` e do `req.body` é onde mora o aprendizado real.

**Bloco D — Prova de valor.** Testes verdes de novo; devlog com 3 lugares onde o TS pegou (ou pegaria) um erro que o JS deixava passar — exemplos seus, não teóricos. Code review da IA, checkpoint.

**Entregável 4 — API migrada para TS:**

- Código da API inteiro em TypeScript, `strict` ligado, compilando sem erro.
- O tipo da tarefa definido uma vez e usado em toda a API (rota, validação, banco).
- Testes continuam verdes.
- No devlog: 3 lugares onde o TS pegou (ou pegaria) um erro que o JS deixava passar — exemplos seus, não teóricos.

## Semana 5 (13–19/08) — Deploy, robustez e entrega

**Bloco A — Preparar pra produção.** Tirar todo valor fixo do código: conexão do banco e porta via variáveis de ambiente, `.env` local (fora do git) e `.env.example` no repo. Entender o que é CORS — vai importar na Etapa 3.

**Bloco B — Banco gerenciado + deploy.** Criar banco free tier (Neon ou similar), apontar a API pra ele localmente primeiro. Comparar plataformas na hora (Render/Railway/Fly — free tiers mudam), escolher uma justificando no devlog, subir com env vars na plataforma. Nenhum segredo commitado.

**Bloco C — Auto-ataque.** Montar uma lista de requisições hostis (JSON quebrado, tipos errados, ids absurdos, tentativa de SQL injection, rotas inexistentes) e rodar contra a API no ar. Crash, stack trace vazado ou status incoerente → corrigir. Cada caso hostil vira teste automatizado.

**Bloco D — Entrega.** README completo (o que é, stack, rodar local, testar, rotas documentadas, URL de produção, seção de uso de IA), devlog final da etapa, push de tudo, **me avisar no chat**.

**Entregável 5 — back-end no ar:**

- API pública respondendo, com banco gerenciado; nenhum segredo commitado (env vars na plataforma).
- Rodada de robustez ANTES de me avisar: você mesmo ataca sua API (JSON quebrado, tipos errados, ids absurdos, tentativa de SQL injection, rotas inexistentes) e corrige o que derrubar ou vazar stack trace. Cada caso hostil vira teste automatizado.
- `README` da API completo: o que é, stack, como rodar local, como testar, rotas documentadas, URL de produção, seção de uso de IA (fase revisor).
- Devlog final da etapa, push de tudo, **me avisar no chat**.

---

## Avaliação (do cronograma)

1. **API com banco funcionando** — local e no ar, demonstrada ao vivo.
2. **Eu quebro sua API:** mando requisições maliciosas e vejo como ela responde. Crash, stack trace vazado ou status incoerente = pendência.
3. **Testes:** suíte rodando verde na hora, cobrindo sucesso, erro e casos hostis.
4. **Oral:** status codes e quando usar cada um, middleware, validação, por que queries parametrizadas, pool de conexões, o que o TS strict te deu, decisões que você tomou (formato de erro, framework de teste, plataforma de deploy) — e os registros da fase revisor no devlog.

**Aprovado →** Etapa 3 (React consumindo esta API). **Pendências →** ajustamos antes de avançar.
