# Semana 1 — Node

Etapa 2 · 20–21/07/2026 · Fundamentos de Node sem framework: HTTP cru, streams, event loop, erros, ambiente, npm, módulos e primeiros testes.

## Como rodar

```bash
npm install
npm start      # node ex07-env.js
npm run dev    # node --watch ex07-env.js
npm test       # vitest
```

Cada exercício também roda solto: `node exNN-nome.js`

## Exercícios

| # | Arquivo | O que faz |
|---|---|---|
| 01 | `ex01-server.md` | O que é um servidor: caminho navegador → porta → processo → resposta |
| 02 | `ex02-http.md` | Anatomia do HTTP com `curl`: linha inicial, headers, corpo, status e métodos |
| 03 | `ex03-raw-http.js` | Servidor com `node:http` puro: JSON em `/`, texto em `/about`, 404 no resto |
| 04 | `ex04-streams.js` | `req.on('data')` — o corpo chega em pedaços, não de uma vez |
| 05 | `ex05-event-loop.js` | Código síncrono bloqueia o event loop e trava as outras requisições |
| 06 | `ex06-errors.js` | Erros não tratados derrubam o processo; `uncaughtException` e `unhandledRejection` |
| 07 | `ex07-env.js` | Porta vinda de variável de ambiente, com default |
| 08 | `ex08-package.md` | package.json linha por linha, semver e o papel do lock |
| 09 | `ex09-modules.md` | ESM × CommonJS: o que muda e o que quebra |
| 10 | `ex10-core-modules.js` | Módulos nativos: `crypto`, `path`, `fs/promises` |
| 11 | `ex11-debug.md` | Debug com `--inspect` e breakpoint no VS Code |
| 12 | `ex12-functions.js` + `.test.js` | Funções puras testadas com Vitest |


**3 coisas que me surpreenderam**: o ex04 sobre como dados grandes são processados; como usar a ferramente de debug; e errors.
**1 coisa que ficou mal resolvida**: o ex03 a parte do req.on

## Checkpoint

🟡 **Amarelo** — 12/12 exercícios feitos e o conteúdo entrou, mas foi a semana mais árida da etapa: tudo abstrato, sem nada visível funcionando no fim. Os exercícios 07, 10 e 12 ficaram travados e voltam pra revisão.
