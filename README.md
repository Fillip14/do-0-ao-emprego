<h1 align="center">🚀 Do 0 ao Emprego</h1>

<p align="center">
  <em>Diário público de uma transição de carreira para a área de TI — do primeiro <code>console.log</code> ao primeiro emprego.</em>
</p>

<p align="center">
  <img alt="Stack" src="https://img.shields.io/badge/stack-JS%2FTS%20full%20stack-f7df1e?style=for-the-badge&logo=javascript&logoColor=black">
  <img alt="Etapa atual" src="https://img.shields.io/badge/etapa%20atual-2%20de%205-3178c6?style=for-the-badge">
  <img alt="Status" src="https://img.shields.io/badge/status-em%20andamento-2ea44f?style=for-the-badge">
  <img alt="Meta" src="https://img.shields.io/badge/meta-pronto%20para%20aplicar-8a2be2?style=for-the-badge">
</p>

<p align="center">
  <a href="#-quem-sou-eu">Quem sou eu</a> ·
  <a href="#-o-projeto">O projeto</a> ·
  <a href="#-cronograma-das-etapas">Cronograma</a> ·
  <a href="#-progresso-da-etapa-2">Progresso</a> ·
  <a href="#-diário-de-bordo">Diário de bordo</a> ·
  <a href="#-estrutura-do-projeto">Estrutura</a> ·
  <a href="#-trilha-de-ia">Trilha de IA</a> ·
  <a href="#-onde-me-encontrar">Contato</a>
</p>

---

## 👋 Quem sou eu

Olá, me chamo **Fillip** e sou apaixonado por informática, em plena transição de carreira. Sempre buscando aprender, me aprofundar, otimizar e, acima de tudo, mudar a vida das pessoas.

Este repositório é a prova viva desse caminho: cada erro, cada conceito que destravou e cada projeto entregue estão documentados aqui, à vista de todos.

---

## 🎯 O projeto

Transição de carreira em aproximadamente **6 meses**, com stack **JavaScript/TypeScript full stack**, baseada em prática e portfólio. A meta honesta ao fim do período é estar **pronto para aplicar** — o emprego em si pode levar mais tempo, e tudo bem.

| | |
|---|---|
| 🧭 **Stack** | Node + Express + TypeScript · React · PostgreSQL |
| ⏱️ **Ritmo** | ~45h/semana (seg–sex 8h–17h + fins de semana) |
| 🧪 **Método** | Prática com testes desde o dia 1, portfólio público, commit diário |
| 🤖 **IA** | Tutor no início → agente no fim (ver [Trilha de IA](#-trilha-de-ia)) |

> Planejamento completo e cronograma das etapas estão em [`docs/`](docs/); o plano de cada etapa fica na própria pasta em [`etapas/`](etapas/).

---

## 🗺️ Cronograma das etapas

Progresso geral do plano de 6 meses. A única data fixa de cada etapa é a **avaliação** — dentro dela, o ritmo é livre.

```
Etapa 0 · Rigor e Git                 ██████████████████████  100%  ✅ aprovada
Etapa 1 · JS sólido + fundamentos web ██████████████████████  100%  ✅ aprovada
Etapa 2 · Back-end (Node/Express/TS)  ████████████░░░░░░░░░░   55%  🔨 em andamento
Etapa 3 · Front-end (React)           ░░░░░░░░░░░░░░░░░░░░░░    0%  🔒 bloqueada
Etapa 4 · Capstone "reclame aqui"     ░░░░░░░░░░░░░░░░░░░░░░    0%  🔒 bloqueada
Etapa 5 · Portfólio e busca           ░░░░░░░░░░░░░░░░░░░░░░    0%  🔒 bloqueada
```

| Etapa | Foco | Entregável central | Status |
|:---:|---|---|:---:|
| **0** | Rigor e Git | Exercícios refeitos + repositório público | ✅ Aprovada |
| **1** | JS sólido + fundamentos web | Gerenciador de tarefas **web** (HTML/CSS/DOM) | ✅ Aprovada |
| **2** | Back-end | API REST de tarefas + PostgreSQL + deploy | 🔨 Em andamento |
| **3** | Front-end | React consumindo a própria API (1º full stack) | 🔒 Bloqueada |
| **4** | Capstone | "Reclame aqui" completo: auth, CRUD, banco, deploy | 🔒 Bloqueada |
| **5** | Portfólio e busca | LinkedIn, currículo, entrevistas, aplicações | 🔒 Bloqueada |

> 🔓 Cada etapa só abre depois que eu **avalio e aprovo** a anterior — reprovação ou pendência bloqueia a próxima.

---

## 📊 Progresso da Etapa 2

**Back-end: Node, Express, TypeScript e banco** · 🔨 iniciada em **16/07** · avaliação alvo **19/08** (antecipável).

Organização própria: **5 semanas, cada uma com um entregável que funciona** — "estudei" não conta; "está no ar e responde" conta. Plano completo em [`etapas/etapa-2/plano.md`](etapas/etapa-2/plano.md).

| Semana | Foco | Entregável | Status |
|:---:|---|---|:---:|
| **S1** (16–17/07) | Node e Express | API de tarefas em memória: GET lista + POST cria, testada no Bruno | ✅ |
| **S2** (18–19/07) | REST completo + testes | CRUD `/tasks` com validação, formato de erro consistente e suíte Vitest | ✅ |
| **S3** (30/07–05/08) | PostgreSQL | API persistindo no banco via `pg`, queries 100% parametrizadas | ⬜ |
| **S4** (06–12/08) | TypeScript | API migrada para TS com `strict` ligado, testes verdes | ⬜ |
| **S5** (13–19/08) | Deploy e robustez | API pública no ar + auto-ataque + README completo | ⬜ |

> Ferramentas escolhidas (e justificadas no devlog): cliente HTTP **Bruno** (collections `.yml` commitadas em `api/bruno/`) · testes com **Vitest**.

> ⚡ **S1 fechou em 2 dias** (checkpoint verde) e a **S2 também** (18–19/07): CRUD completo, formato de erro unificado, suíte Vitest 15/15 e collection do Bruno com casos de erro — **10 dias à frente do cronograma**. As datas das semanas são teto, não meta; a avaliação pode antecipar.

**Legenda:** ✅ concluída · ⏳ em andamento · ⬜ a fazer

---

## 📅 Diário de bordo

Catálogo dia a dia do que foi estudado.

### Etapa 0 — Rigor e Git

| Data | Conteúdo estudado |
|:---:|---|
| 06/07 | **Terminal** — `pwd`, `ls`, `mkdir`, `mv`, wildcard `*`, Tab, `nano` |
| 07/07 | **Git** — `config`, `init`, `.gitignore`, `remote add`, `add`, `commit`, `push`, `status`, `log` |
| 08/07 | **Rigor + Git avançado** — arrow reduzida, `assert.strictEqual`, testes de fronteira, `branch`/`switch`/`merge`/`restore`/`reset`, `==` vs `===` |

### Etapa 1 — Fundamentos JavaScript

| Data | Conteúdo estudado |
|:---:|---|
| 08/07 | **T1** — Tipos e coerção: `typeof`, primitivos, `NaN`, `==` vs `===` |
| 09/07 | **T2–T5** — Closure, strings/regex, arrays (mutação/referência, `map`/`filter`/`find`) |
| 10/07 | **T6–T8** — `reduce`, `sort`, objetos, JSON, `fs`, CommonJS vs ESM |
| 11/07 | **T9** — Erros: `throw new Error`, `try/catch`, `assert.throws` |
| 12/07 | **T10** — Assíncrono I: `async`, callback, `setTimeout`, Promise e seus 3 estados |
| 13/07 | **T11** — Assíncrono II: `async/await`, `fetch`, `Promise.all` |
| 14/07 | **T12–T14** — OO (`this`, classes, protótipos) + HTML/CSS (tags semânticas, box model, flexbox) + DOM e eventos (`querySelector`, `createElement`, `addEventListener`, `preventDefault`) |
| 15/07 | **T15–T16** — HTTP na prática (request/response, status 2xx/4xx/5xx, 404 vs 500, DevTools Network, página busca-CEP em ESM) + revisão espaçada (Ex 03/09/10 de memória) e planejamento do projeto web |
| 16/07 | **T17–T18 + avaliação** — Gerenciador de tarefas **web** (lib pura em ESM, `app.js` com DOM + `localStorage`, fluxo evento→lib→save→render, sobrevive ao F5) + acabamento, README da etapa e **avaliação da Etapa 1 (aprovada)** |

### Etapa 2 — Back-end: Node, Express, TypeScript e banco

| Data | Conteúdo estudado |
|:---:|---|
| 16/07 | **Abertura da etapa** — plano de 5 semanas criado (blocos por tema); decisões de ferramenta: Bruno e Vitest |
| 17/07 | **S1 — do HTTP puro à API no Express** — servidor com `node:http` (`createServer`, `req.method`/`req.url`, `statusCode`, `server.listen`); projeto npm (`npm init`, scripts `start`/`dev`, dependencies vs devDependencies); Express: `GET /tasks` + `POST /tasks` (array em memória, `express.json()`, status 201, id com `crypto.randomUUID`, middleware de log); collection do Bruno commitada e README da API. **Entregável 1 concluído — checkpoint verde** |
| 18/07 | **S2 — CRUD, erros e testes** — contrato REST das 5 rotas selado (PATCH vs PUT justificado, DELETE 200 + mensagem); CRUD completo fiel ao contrato; formato de erro `{message}` estilo GitHub, validação de `title` extraída como middleware de rota, 404 coringa e handler de erro 4-params (`err.status \|\| 500`); `app.js`/`server.js` separados; **Vitest + supertest**: suíte com 15 testes verdes cobrindo o contrato inteiro — um teste achou bug real (`req.body` undefined) e `beforeEach` resolveu estado sujo entre testes |
| 19/07 | **S2 — fechamento (bloco D)** — collection do Bruno completa: 5 operações + casos de erro (título inválido, 404, JSON quebrado com `Content-Type` manual) e variável `{{taskId}}`; README da API atualizado com o contrato completo e formato de erro; resumo de estudos das semanas 1–2. **Entregável 2 concluído** |

> 💡 A matéria-prima detalhada de cada dia está no devlog de cada etapa, em [`etapas/`](etapas/).

---

## 📂 Estrutura do projeto

```
do-0-ao-emprego/
├── README.md                → você está aqui
├── docs/                    → docs globais: planejamento, cronograma das etapas e marca pessoal
├── avaliacao-de-nivel/      → avaliação de nível inicial e correção
├── etapas/                  → uma pasta por etapa, autocontida
│   ├── etapa-0/             → plano, devlog, avaliação, resumo e exercícios
│   ├── etapa-1/             → idem + código por tema (t01/…t17/)
│   └── etapa-2/             → plano, devlog e a API (api/ evolui semana a semana)
└── playground/              → drills e experimentos avulsos
```

---

## 🤖 Trilha de IA

Usar IA é habilidade de mercado — mas se constrói em camadas, porque quem não domina a base não consegue avaliar o que a IA produz. A progressão ao longo do projeto:

| Etapa | Papel da IA | Habilidade treinada |
|:---:|---|---|
| 0–1 | **Tutor** — explica e revisa código já pronto; nunca gera solução | Fazer boas perguntas técnicas |
| **2** | **Revisor** — code review após cada feature *(fase atual 🔨)* | Ler código criticamente |
| 3 | **Par de programação** — gera trechos pequenos que eu entendo e testo | Validar código que não escrevi |
| 4 | **Agente** — constrói partes do capstone sob minha especificação e revisão | Especificar, revisar, orquestrar |
| 5 | **Pauta de entrevista** — evidência pública de uso com critério | Contar a história do processo |

---

## 🌟 Onde me encontrar

<p align="left">
  <a href="https://www.linkedin.com/in/anfillip">
    <img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-anfillip-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white">
  </a>
  <a href="https://github.com/Fillip14">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-Fillip14-181717?style=for-the-badge&logo=github&logoColor=white">
  </a>
</p>

---

<p align="center">
  <sub>⭐ Acompanhe o repositório para ver a jornada do 0 ao emprego acontecendo em tempo real.</sub>
</p>
