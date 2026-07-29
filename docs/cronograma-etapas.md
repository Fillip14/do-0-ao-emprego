# Cronograma de Etapas — Do 0 ao Emprego

Baseado na avaliação de 06/07/2026. **Rotina definida em 07/07:** projeto seg–sex 8h–17h + 4h no sábado + 4h no domingo (~45h/semana).

## Diagnóstico consolidado

Avaliação de 06/07: **iniciante avançado** em lógica; conceitos web com boa intuição e baixa precisão. Experiência prévia relevante: back-end estilo "reclame aqui" com Express e TypeScript — isso decide a stack. Detalhes e correção exercício a exercício em `avaliacao-de-nivel/correcao-avaliacao-de-nivel.md`; os padrões de erro identificados são acompanhados de forma viva nas avaliações de etapa.

## Decisão de stack: JavaScript/TypeScript full stack

Node + Express + TypeScript no back, React no front, PostgreSQL no banco. Motivos: você já começou nela, é a de maior volume de vagas júnior, e cobre front e back com uma linguagem só. **Travada até janeiro/2027.**


## Etapas

> **Contagem das semanas:** a **semana 1 é 06–12/07/2026** — o início do projeto. Daí em diante as semanas correm de segunda a domingo, sem reset por etapa. Logo, **semana 20 = 16–22/11/2026**, o fim previsto da trilha.

Regras transversais: commits diários no GitHub desde a Etapa 0 · uso de IA segue a Trilha de IA (abaixo) · ao final de cada etapa me avise, eu avalio e libero (ou não) a próxima.

> ### 🔁 Inversão em 28/07/2026 — a Etapa 3 vem antes do fim da Etapa 2
>
> A ordem de execução passou a ser **Etapa 2 (parcial) → Etapa 3 → Etapa 2 (retomada) → Etapa 4 → Etapa 5**. A Etapa 2 foi pausada no meio do Tema 5 com os Temas 1–4 fechados (Node, Express, TypeScript, PostgreSQL) e retoma exatamente daí depois do front.
>
> **O que isso custa, dito com todas as letras:** o front da Etapa 3 consome a API **local**, sem autenticação e sem URL pública — porque auth (Tema 8) e deploy (Tema 9) ficaram do outro lado da pausa. Login, guarda de rota e front apontando para produção entram como emenda na retomada da Etapa 2.
>
> **O que isso preserva:** os Temas 1–4 entregaram uma API que já responde CRUD com banco de verdade — que é tudo que o front precisa para existir. A pausa é no meio de um tema, não no meio da API.
>
> Detalhes do estado congelado em [`../etapas/etapa-2/plano.md`](../etapas/etapa-2/plano.md) · plano do front em [`../etapas/etapa-3/plano.md`](../etapas/etapa-3/plano.md).

### Etapa 0 — Rigor e Git (semana 1)

- Refazer Ex 1, 3, 4, 5 e 7 cumprindo o enunciado exatamente; corrigir os bugs apontados no Ex 6 e Ex 8.
- Git de verdade: instalar, criar repositório desta pasta, entender `init`, `add`, `commit`, `push`, `status`, `log`. Subir tudo para o GitHub.
- **Avaliação:** exercícios refeitos + repositório público com histórico de commits.

### Etapa 1 — JavaScript sólido + fundamentos web (semanas 1-2)

- JS moderno: `let`/`const`, template strings, `map`/`filter`/`reduce`, objetos, módulos, async/await, `this`/classes/protótipos.
- HTML/CSS funcional (sem perfeccionismo visual) + HTTP na prática.
- **Projeto:** gerenciador de tarefas (Ex 8) como página web — interface no navegador, lógica em JS.
- **Avaliação:** projeto + exercícios de array methods que eu passar.

### Etapa 2 — Back-end: Node, Express, TypeScript e banco (semanas 3-4 · ⏸️ pausada 28/07, retoma após a Etapa 3)

> API funcional para servir a Etapa 3. **Temas 1–4 fechados; pausada no meio do Tema 5.**

- Fundamentos por dentro antes do atalho: HTTP cru e `node:http` → Express (rotas, middleware, validação, erro centralizado com formato único).
- Testes automatizados desde o primeiro tema (Vitest + supertest) + um tema só de técnica: pirâmide, mocks, cobertura, TDD.
- TypeScript `strict`: a API nasce em JS no Tema 2 e migra pra TS no Tema 3 — migrar código que já funciona é a experiência mais comum do mercado.
- PostgreSQL de verdade: SQL puro, `pg` com pool e queries parametrizadas, SQL injection demonstrada, transações; schema versionado com migrations; ORM (Prisma) comparado ao SQL cru.
- Arquitetura em camadas (rota/serviço/repositório), validação com zod, paginação, filtros e ordenação segura.
- Autenticação (bcrypt, JWT, 401×403) e segurança de borda (CORS, helmet, rate limiting, OWASP) — antecipação do capstone.
- Deploy: banco gerenciado, env vars, `/health`, logs estruturados, auto-ataque na URL pública — back-end no ar antes do front da Etapa 3.
- Docker (imagem, compose com Postgres) + CI no GitHub Actions rodando a suíte a cada push.
- **Avaliação:** API pública com banco funcionando + eu quebro sua API com requisições maliciosas + suíte verde na hora + oral sobre decisões e conceitos.

### Etapa 3 — Front-end: React (🔨 antecipada — 29/07 a ~12/08/2026)

> Detalhada tema a tema em [`../etapas/etapa-3/plano.md`](../etapas/etapa-3/plano.md) — 14 temas, app vivo em `web/`.

- React + TypeScript + Vite: JSX, props e composição, estado, formulários controlados, efeitos e o que **não** é efeito.
- **Estilo cedo (T3), não no fim:** tokens, layout responsivo, estados visuais e acessibilidade de teclado — o app é apresentável antes de ser complexo.
- Consumo da própria API: camada de requisição tipada, os quatro estados de tela (carregando, erro, vazio, sucesso), CORS pelo lado de quem apanha, CRUD completo com atualização otimista.
- Rotas com React Router — a URL é estado.
- **Motion (T10):** `transition` e `transform`, o que anima de graça e o que trava, entrada e saída de item da lista, transição de rota, gesto de arrastar, `prefers-reduced-motion` e medição de frame rate. Uma lib entra aqui — Framer Motion ou GSAP.
- **Deploy no T11, não no fim:** a partir dele existe URL pública e todo tema fechado redeploya.
- Hooks a fundo (`useReducer`, `useRef`) e custom hooks, com performance medida no Profiler antes de memoizar; Context como transporte, não como gerenciador de estado.
- Testes de componente com Vitest + Testing Library + MSW.
- **Projeto:** front React conectado à API de tarefas da Etapa 2 → primeiro sistema completo rodando de ponta a ponta.
- **Limitação assumida da inversão:** sem login e contra API local — os dois entram na retomada da Etapa 2 (Temas 8 e 9).
- **Avaliação:** front no ar + eu quebro a UI (API fora do ar, link público sem API, 400 do servidor, lista vazia, duplo submit, animação derrubando o frame rate, navegação só por teclado) + oral, uma pergunta por tema.

### Etapa 4 — Capstone: o "reporte-aqui" concluído (semanas 11-15)

- Refazer do zero, agora sabendo o que faz: cadastro/login (auth), CRUD de reclamações, banco, front React, deploy.
- README caprichado, testes básicos. Este é o projeto central do portfólio — e a resposta para "o site que não foi concluído".
- **Avaliação:** simulo um code review de empresa.

### Etapa 5 — Portfólio e busca (semanas 16-20)

- GitHub organizado, LinkedIn, currículo, devlog do processo.
- Algoritmos básicos de entrevista + entrevistas simuladas comigo.
- Início das aplicações para vagas. Meta: **pronto para aplicar** — o emprego em si pode levar mais tempo, e tudo bem.



## Trilha de IA — do tutor ao agente

Desenvolvimento assistido por IA é habilidade de mercado e faz parte do plano — mas ela se constrói em camadas, porque quem não domina a base não consegue avaliar o que a IA produz, e avaliar é exatamente o que a empresa espera de quem usa IA. A progressão:

**Etapas 0–1 — IA como tutor.** Explica conceitos, tira dúvidas, revisa seu código *depois* de pronto. Nunca gera solução. Habilidade treinada: fazer boas perguntas técnicas e entender respostas — a base de todo o resto.

**Etapa 2 — IA como revisor.** Ao fechar cada tema, peça um code review à IA: bugs, casos de borda, alternativas. Confronte o que ela aponta com as decisões que você tomou e entenda os trade-offs. Habilidade treinada: ler código criticamente e defender a própria escolha.

**Etapa 3 — IA como par de programação.** Liberada a geração de trechos pequenos (uma função, um componente), com duas condições: você entende cada linha antes de commitar e escreve o teste que prova que funciona. Habilidade treinada: validar código que você não escreveu.

> Com a inversão de 28/07, a fase **Par** começa na Etapa 3 e **vale dali em diante — inclusive na retomada da Etapa 2**. A trilha de IA avança com o calendário, não volta atrás: o back-end retomado já é trabalhado em regime de par, não de revisor.

**Etapa 4 — IA como agente.** No capstone, partes do projeto são construídas com um agente de código (Claude Code ou similar): você especifica, o agente implementa, você revisa e testa. O README documenta o que foi assistido e como foi validado — isso vira *diferencial* de portfólio, não algo a esconder. Habilidade treinada: especificação, revisão e orquestração — o trabalho real de dev assistido por IA.

**Etapa 5 — IA como pauta de entrevista.** Saber contar essa progressão é resposta forte para "como você usa IA?" — pergunta cada vez mais comum. Você terá evidência pública (commits, READMEs) de uso com critério, não dependência.


## Trilha de Marca Pessoal — do perfil à audiência

Presença pública é ativo de empregabilidade, construída em camadas: perfil → rede → conteúdo → colheita.
> O plano detalhado (camada por etapa, backlog de posts, formato, estado atual) vive em [`marca-pessoal.md`](marca-pessoal.md) — documento vivo e fonte única desta trilha.


## Contra os desafios pessoais (seção 7 do plano original)

- Mudança de interesse no meio do caminho → a regra da stack travada existe para isso. Anote a ideia nova num `ideias-depois.md` e volte ao plano.
- Distração → estude com celular fora do alcance em blocos de 50min + 10min de pausa; YouTube/WhatsApp nas pausas.
- Constância
