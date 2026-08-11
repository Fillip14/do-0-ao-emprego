<h1 align="center">🚀 Do 0 ao Emprego</h1>

<p align="center">
  <em>Diário público de uma transição de carreira para a área de TI — do primeiro <code>console.log</code> ao primeiro emprego.</em>
</p>

<p align="center">
  <img alt="Stack" src="https://img.shields.io/badge/stack-JS%2FTS%20full%20stack-f7df1e?style=for-the-badge&logo=javascript&logoColor=black">
  <img alt="Etapa atual" src="https://img.shields.io/badge/etapa%20atual-2%20(retomada)-339933?style=for-the-badge">
  <img alt="Status" src="https://img.shields.io/badge/status-em%20andamento-2ea44f?style=for-the-badge">
  <img alt="Meta" src="https://img.shields.io/badge/meta-pronto%20para%20aplicar-8a2be2?style=for-the-badge">
</p>

<p align="center">
  <a href="#-quem-sou-eu">Quem sou eu</a> ·
  <a href="#-o-projeto">O projeto</a> ·
  <a href="#-trilha-de-ia-e-cronograma-das-etapas">Trilha de IA e cronograma</a> ·
  <a href="#-progresso">Progresso</a> ·
  <a href="#-diário-de-bordo">Diário de bordo</a> ·
  <a href="#-estrutura-do-projeto">Estrutura</a> ·
  <a href="#-onde-me-encontrar">Contato</a>
</p>



## 👋 Quem sou eu

Olá, me chamo **Fillip** e sou apaixonado por informática, em plena transição de carreira. Sempre buscando aprender, me aprofundar, otimizar e, acima de tudo, mudar a vida das pessoas.

Este repositório é a prova viva desse caminho: cada erro, cada conceito que destravou e cada projeto entregue estão documentados aqui, à vista de todos.


## 🎯 O projeto

Transição de carreira em aproximadamente **6 meses**, com stack **JavaScript/TypeScript full stack**, baseada em prática e portfólio. A meta honesta ao fim do período é estar **pronto para aplicar** — o emprego em si pode levar mais tempo, e tudo bem.

| | |
|:---:|---|
| 🧭 **Stack** | Node + Express + TypeScript · React · PostgreSQL |
| ⏱️ **Ritmo** | ~45h/semana (seg–sex 8h–17h + fins de semana) |
| 🧪 **Método** | Prática com testes desde o dia 1, portfólio público, commit diário |
| 🤖 **IA** | Tutor no início → agente no fim |

## 🤖 Trilha de IA e Cronograma das etapas

Liberada a geração de **trechos pequenos** (uma função, um componente, um tipo), com **uma condição: entender cada linha antes de commitar** — se não entendo, pergunto ou reescrevo. Habilidade treinada: validar e entender código que não fui eu que escrevi.

```
Tutor   · explica e revisa; nunca gera solução      ██████████████████████  100%  ✅ Etapas 0–1
Revisor · review depois que o meu código funciona   ██████████████████████  100%  ✅ Etapa 2, temas 1–4
Par     · trechos pequenos que eu entendo e testo   ███████████████░░░░░░░   70%  🔨 fase atual — 14 de 20 temas
Agente  · implementa sob a minha especificação      ░░░░░░░░░░░░░░░░░░░░░░    0%  🔒 abre na Etapa 4
Pauta   · a progressão vira resposta de entrevista  ░░░░░░░░░░░░░░░░░░░░░░    0%  🔒 abre na Etapa 5
```

> A fase **Par** começou em 29/07 e **não volta atrás**: ela cobre os 14 temas da Etapa 3 (fechados) e os 6 que faltam na retomada da Etapa 2 — daí os 70%. O teste dela veio no T13 do front, quando delegei a suíte inteira de uma vez e depois cobrei a explicação **arquivo por arquivo**: código que eu não escrevi só entra se eu souber defender.

Cronograma de datas está dentro do `cronograma-etapas.md`, datas detalhadas nos planos das etapas.

```
Etapa 0 · Rigor e Git                 ██████████████████████  100%  ✅ aprovada
Etapa 1 · JS sólido + fundamentos web ██████████████████████  100%  ✅ aprovada
Etapa 2 · Back-end: da API ao deploy  █████████░░░░░░░░░░░░░   40%  🔨 4 de 10 temas — retomada em andamento
Etapa 3 · Front-end (React)           ██████████████████████  100%  ✅ 14 de 14 temas — encerrada em 11/08
Etapa 4 · Capstone "reporte-aqui"     ░░░░░░░░░░░░░░░░░░░░░░    0%  🔒 bloqueada
Etapa 5 · Portfólio e busca           ░░░░░░░░░░░░░░░░░░░░░░    0%  🔒 bloqueada
```
> 🔁 **Inversão em 28/07:** a Etapa 2 foi pausada no meio do Tema 5 e o front entrou na frente. O back-end retoma do ponto exato onde parou. Consequência assumida: o front consome a API **local, sem login** — auth e deploy ficaram do outro lado da pausa e entram na retomada.
> 🔓 Cada etapa só abre depois que a IA **avalia e aprova** a anterior — pendência bloqueia a próxima.


## 📊 Progresso

### ✅ Etapa 3 — Front-end: React · encerrada em 11/08

**29/07 a 11/08** · 14 de 14 temas · app vivo em `web/`, no ar, com 25 testes verdes.


🌐 **No ar desde 11/08: https://do-0-ao-emprego.vercel.app** — o front está publicado, mas a **API roda localmente** e ainda não foi publicada (é o T9 da Etapa 2). O link abre o app e explica isso na tela; para ver o CRUD funcionando é preciso rodar os dois localmente. Detalhes no [`web/README.md`](etapas/etapa-3/web/README.md).

| Tema | Assunto | Status |
|:---:|---|:---:|
| **T1** | React e ferramental — JSX, Vite, TS, StrictMode | ✅ |
| **T2** | Props, composição e listas — `key`, estado vazio | ✅ |
| **T3** | Estilos, layout e acessibilidade — tokens, responsivo, teclado | ✅ |
| **T4** | Estado e eventos — `useState`, lifting, estado derivado | ✅ |
| **T5** | Formulários controlados — validação, erro por campo | ✅ |
| **T6** | Efeitos — `useEffect`, limpeza, quando **não** usar · _mesclado com o T5_ | ✅ |
| **T7** | Falando com a API — fetch tipado, 4 estados de tela, CORS | ✅ |
| **T8** | CRUD na tela — mutações, atualização otimista · _mesclado com o T7_ | ✅ |
| **T9** | Rotas — React Router, a URL como estado | ✅ |
| **T10** | **Build e deploy** — 🌐 URL pública a partir daqui · _mesclado com o T9_ | ✅ |
| **T11** | Hooks a fundo, custom hooks e performance medida | ✅ |
| **T12** | Context — estado global sem biblioteca, e o custo dele · _mesclado com o T11_ | ✅ |
| **T13** | Testes de front — Vitest, Testing Library, MSW | ✅ |
| **T14** | **Motion e interação** — transition, gesto, **Motion** (ex-Framer Motion), 60fps | ✅ |

### 🔨 Etapa 2 — Back-end · pausada em 28/07 no meio do T5, **retomada liberada em 11/08**

| Tema | Assunto | Status |
|:---:|---|:---:|
| **T1** | Node — HTTP, `node:http`, event loop, npm, ESM | ✅ |
| **T2** | Express — rotas, middleware, validação, erro central, supertest | ✅ |
| **T3** | TypeScript — strict, narrowing, generics, utility types, **API portada para TS** | ✅ |
| **T4** | PostgreSQL — SQL, `pg`, injection, transações | ✅ |
| **T5** | Testes a fundo — pirâmide, mocks, cobertura, TDD · _ponto de retomada_ | ⏳ |
| **T6** | Camadas + paginação, filtros, zod | ⬜ |
| **T7** | Migrations + ORM | ⬜ |
| **T8** | Auth + segurança de borda | ⬜ |
| **T9** | Deploy — banco gerenciado, health, logs, auto-ataque | ⬜ |
| **T10** | Docker + CI | ⬜ |

**Legenda:** ✅ concluída · ⏳ em andamento · ⏸️ congelada · ⬜ a fazer

## 📅 Diário de bordo

O que foi estudado dia a dia.

### Etapa 0 — Rigor e Git

| Data | Conteúdo estudado |
|:---:|---|
| 06/07 | **Terminal** — navegação, arquivos, `nano` |
| 07/07 | **Git** — `init`, `commit`, `push`, `.gitignore` |
| 08/07 | **Rigor + Git avançado** — branches e merge · rigor e testes de fronteira |

### Etapa 1 — Fundamentos JavaScript

| Data | Conteúdo estudado |
|:---:|---|
| 08/07 | **T1** — Tipos e coerção |
| 09/07 | **T2–T5** — Closure, strings, arrays |
| 10/07 | **T6–T8** — `reduce`, `sort`, objetos, JSON, módulos |
| 11/07 | **T9** — Erros e `try/catch` |
| 12/07 | **T10** — Assíncrono — callbacks e Promise |
| 13/07 | **T11** — Assíncrono — `async/await` e `fetch` |
| 14/07 | **T12–T14** — Orientação a objetos · HTML/CSS · DOM e eventos |
| 15/07 | **T15–T16** — HTTP na prática · revisão espaçada |
| 16/07 | **T17–T18 + avaliação** — Projeto: gerenciador de tarefas web · **avaliação da Etapa 1 (aprovada)** |

### Etapa 2 — Back-end: Node, Express, TypeScript e banco

| Data | Conteúdo estudado |
|:---:|---|
| 16–20/07 | **v1 da etapa (arquivada)** em [`archive-stage-complete/`](etapas/etapa-2/archived/archive-stage-complete) |
| 21/07 | **T1 — Node** — servidor, HTTP, `node:http`, streams, event loop, npm, testes · **T2 — Express** — rotas, middleware, validação |
| 22/07 | **T2 — Express** — handler `async`, supertest · **T3 — TypeScript** — inferência, `any` × `unknown`, `interface` × `type`, narrowing, união literal, validação de borda |
| 23/07 | **Alterado metodologia de estudo. v1 tema 3 (arquivada)** em [`archive-t03/`](etapas/etapa-2/archived/archive-t03). **T3 — TypeScript** — type predicates, discriminated unions, generics, utility types,`as` e `satisfies`, `tsconfig` |
| 24/07 | **T3 — TypeScript** — API tipada |
| 25/07 | **T4 — PostgreSQL** — Servidor x cliente, criar banco, tabelas e tipos, aspas simples × duplas, snake_case e CRUD em SQL |
| 26/07 | **T4 — PostgreSQL** — null de verdade, LIKE/ILIKE, agregações, UNIQUE, índices, EXPLAIN, FK, JOIN, CASCADE, pg e SQL injection |
| 27–28/07 | **T4 — PostgreSQL** — API persistida: pool, queries parametrizadas, `RETURNING`, banco de teste |
| 28/07 | **T5 — Testes a fundo** — pirâmide, AAA, hooks, fixtures e factories, `it.each`, dublês, cobertura, isolamento de banco · **etapa pausada aqui** |

### Etapa 3 — Front-end: React

| Data | Conteúdo estudado |
|:---:|---|
| 28/07 | **Inversão do cronograma** — Etapa 2 pausada no T5, plano da Etapa 3 detalhado em 14 temas (estilo cedo, tema de motion, deploy no meio) |
| 29/07 | **T1 — React e ferramental** — declarativo × imperativo, JSX, componentes, Vite e HMR, anatomia do projeto, `tsconfig` do front, `StrictMode`, ciclo de renderização · **T2 — Props, composição e listas** — props tipadas, `children`, `map` e `key`, condicionais e a armadilha do `0 &&`, estado vazio, `Task` como cópia do contrato |
| 29–31/07 | **Tema 0 (a base que faltou)** — anatomia do HTML e do CSS, unidades, box model, `display`, especificidade, `@` e `:` · **T3 — Estilos, layout e acessibilidade** — CSS Modules, design tokens, flexbox e eixo principal, responsivo mobile-first, contraste medido, semântica e `aria-label`, `ui/` × domínio |
| 01–05/08 | **Projeto pessoal** — cópia da home de uma rede social, para praticar HTML, CSS e Tailwind fora do cronograma |
| 06/08 | **T3 — migração para Tailwind** |
| 07/08 | **T4 — Estado e eventos** — `useState`, `Record<Status, Status>` · **T5 + T6 abertos** — formulários controlados e efeitos, persistir no `localStorage` |
| 08/08 | **T5 + T6 — Formulários controlados e efeitos**  |
| 09/08 | **T7 + T8 abertos** — falando com a API e o CRUD completo (mesclados) · CORS habilitado na `api/`, a exceção única ao congelamento |
| 10/08 | **T7 + T8 — Falando com a API e o CRUD completo** — camada `src/api/`, `request<T>` genérico, os quatro estados de tela como união discriminada, CRUD indo até o Postgres, o `localStorage` morto · **T9 + T10 abertos** — rotas e build/deploy (mesclados), Vercel escolhida, a URL como estado |
| 11/08 | **T9 + T10 — Rotas e Build/Deploy** — `BrowserRouter`, layout com `Outlet`, rota com parâmetro validado, 404 do front, busca e filtro na query string, guarda de rota desenhado; bundle medido, `lazy` por rota, deploy na Vercel, fallback de SPA, Lighthouse — **🌐 front no ar** · **T11 + T12 — Hooks a fundo e Estado global** — `useReducer`, `useRef`, `useId`, a pasta `hooks/` nascendo com o `useTasks` (a página caiu de 215 para 86 linhas), `ToastProvider` em dois contextos, e a decisão de performance com número: **nada memoizado porque nada precisou** · **T13 — Testes de front** — jsdom, MSW e escopo no caminho crítico: **25 testes verdes** sem API nem Postgres de pé, escritos **sem um `getByTestId` sequer**; o teste do 400 achou um bug que doze temas de verificação manual não viram — o `aria-live` do erro do servidor nunca chega ao DOM · **T14 — Motion e interação** — o app se move: item entrando e saindo, a tarefa **viajando** de coluna com `layout`/`layoutId`, troca de rota costurada, arrasto para apagar; o `LazyMotion` **não economizou bytes** (piorou 2,55 kB no total), mas tirou **25 kB gzip do caminho crítico** · **avaliação da Etapa 3** — entregáveis e primeira leva da prova prática aprovados (o rollback do otimista funcionou com a API fora do ar); oral e itens 4–11 não realizados, **etapa encerrada incompleta por decisão minha** |

> 💡 A matéria-prima detalhada de cada dia está no devlog de cada etapa, em [`etapas/`](etapas/).


## 📂 Estrutura do projeto

Onde procurar cada coisa — os links deste repositório moram todos aqui.

```
do-0-ao-emprego/
├── README.md
├── docs/
├── avaliacao-de-nivel/
└── etapas/
    ├── etapa-0/
    ├── etapa-1/
    ├── etapa-2/          🔨 retomada a partir do Tema 5
    │   ├── api/          ← a API, servindo o front
    │   ├── archived/
    │   └── studies/
    └── etapa-3/          ✅ encerrada — o app continua vivo
        ├── web/          ← o app React, no ar
        └── studies/
```

[`docs/cronograma-etapas.md`](docs/cronograma-etapas.md) — o plano de 6 meses inteiro ·
[`etapas/etapa-2/plano.md`](etapas/etapa-2/plano.md) — a etapa em andamento ·
[`etapas/etapa-2/api/README.md`](etapas/etapa-2/api/README.md) — o contrato da API ·
[`etapas/etapa-3/plano.md`](etapas/etapa-3/plano.md) — a etapa encerrada, tema a tema ·
[`etapas/etapa-3/web/README.md`](etapas/etapa-3/web/README.md) — o contrato do front


## 🌟 Onde me encontrar

<p align="left">
  <a href="https://www.linkedin.com/in/anfillip">
    <img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-anfillip-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white">
  </a>
  <a href="https://github.com/Fillip14">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-Fillip14-181717?style=for-the-badge&logo=github&logoColor=white">
  </a>
</p>

<p align="center">
  <sub>⭐ Acompanhe o repositório para ver a jornada do 0 ao emprego acontecendo em tempo real.</sub>
</p>
