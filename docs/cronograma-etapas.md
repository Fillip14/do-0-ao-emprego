# Cronograma de Etapas — Do 0 ao Emprego

Baseado na avaliação de 06/07/2026. **Rotina definida em 07/07:** projeto seg–sex 8h–17h + 4h no sábado + 4h no domingo (~45h/semana; trabalho no laboratório 19h–22h). É mais tempo que o cenário original (~35h) — as durações das etapas ficam mantidas e a folga vira profundidade e margem de segurança, não pressa.

## Diagnóstico consolidado

Avaliação de 06/07: **iniciante avançado** em lógica; conceitos web com boa intuição e baixa precisão. Experiência prévia relevante: back-end estilo "reclame aqui" com Express e TypeScript — isso decide a stack. Detalhes e correção exercício a exercício em `avaliacao-de-nivel/correcao-avaliacao-de-nivel.md`; os padrões de erro identificados são acompanhados de forma viva nas avaliações de etapa.

## Decisão de stack: JavaScript/TypeScript full stack

Node + Express + TypeScript no back, React no front, PostgreSQL no banco. Motivos: você já começou nela, é a de maior volume de vagas júnior, e cobre front e back com uma linguagem só. **Travada até janeiro/2027.**

---

## Etapas

Regras transversais: commits diários no GitHub desde a Etapa 0 · uso de IA segue a Trilha de IA (abaixo) · ao final de cada etapa me avise, eu avalio e libero (ou não) a próxima.

**Formato de enunciado (padrão a partir de 11/07/2026, vale para toda etapa futura):** todo exercício dos planos de etapa traz **Arquivos** (nomes exatos), **Contrato** (entrada → saída, tipos, casos de fronteira), **Erros** (mensagens exatas quando houver `throw`), **Exemplos** concretos e **O que os testes cobrem** (lista fechada). Dúvida de enunciado → perguntar antes de codar (não é cola). Se um enunciado do Claude estiver ambíguo, o erro decorrente não conta contra o Fillip.

**Ritmo (padrão desde a Etapa 1, estendido às demais etapas em 07/2026):** plano organizado por unidades com dia sugerido, não por datas fixas. A unidade muda com o tipo de etapa: **temas** em etapas de fundamento (Etapa 1), **marcos de entrega** em etapas de projeto (Etapas 2–4: pedaço do projeto funcionando de ponta a ponta, ex. "rotas GET/POST no ar", "PostgreSQL conectado") e **entregáveis** na Etapa 5 (LinkedIn pronto, currículo pronto, X aplicações/semana). Unidade seguinte só abre com a atual **selada** (DoD): tests verdes rodados na hora com caso negativo · revisão do Claude zerada · devlog no ato · pergunta-selo respondida sem consulta · commit pushed. Quantas unidades couberem no dia.

**Devlog (padrão a partir da Etapa 2, decidido 16/07):** registra só o fechamento do dia + travas/erros de previsão — a evidência do processo. Explicações de referência ("o que cada método/ferramenta faz") vão direto para o resumo da etapa, não para o devlog: evita escrever a mesma coisa em dois lugares.

**Anti-atraso (3 camadas, vale para toda etapa):**

1. **Âncora única:** só a data da **avaliação** da etapa é fixa (ex. 21/07 na Etapa 1). Dentro da etapa, tudo flutua — é o único compromisso de calendário e é o que protege os 6 meses. Mover a âncora só por recalibragem explícita registrada no plano (feito 1x na Etapa 1: 20→21/07, para incluir this/classes).
2. **Checkpoint semanal (sexta, no fechamento do dia):** comparar unidades seladas vs. dias sugeridos. Semáforo: **verde** = no ritmo ou adiantado; **amarelo** = 1–2 unidades atrás → plano de recuperação escrito no devlog (o quê, quando); **vermelho** = 3+ unidades atrás → recalibragem obrigatória na conversa oficial da etapa: cortar escopo ou mover a avaliação — decisão explícita e registrada no plano, nunca atraso silencioso.
3. **Folga declarada:** os últimos ~10–15% de cada etapa são buffer sem conteúdo novo (revisão/margem). Consumir o buffer antes da hora = sinal amarelo automático. Atraso come a folga, não o prazo.

### Etapa 0 — Rigor e Git (semana 1: 08–14/07)

- Refazer Ex 1, 3, 4, 5 e 7 cumprindo o enunciado exatamente; corrigir os bugs apontados no Ex 6 e Ex 8.
- Git de verdade: instalar, criar repositório desta pasta, entender `init`, `add`, `commit`, `push`, `status`, `log`. Subir tudo para o GitHub.
- **Avaliação:** exercícios refeitos + repositório público com histórico de commits.

### Etapa 1 — JavaScript sólido + fundamentos web (semanas 2–5)

- JS moderno: `let`/`const`, template strings, `map`/`filter`/`reduce`, objetos, módulos, async/await, `this`/classes/protótipos.
- HTML/CSS funcional (sem perfeccionismo visual) + HTTP na prática.
- **Projeto:** gerenciador de tarefas (Ex 8) como página web — interface no navegador, lógica em JS.
- **Avaliação:** projeto + exercícios de array methods que eu passar.

### Etapa 2 — Back-end: Node, Express, TypeScript e banco (semanas 6–10)

- Começa terminando o Ex 10 (a API que travou) — primeiro item da etapa.
- API REST completa de tarefas: rotas, validação, status codes corretos, testada no Postman.
- Testes automatizados com framework (Jest ou Vitest) — evolução do node:assert.
- PostgreSQL básico: tabelas, SELECT/INSERT/UPDATE/DELETE, conexão pelo Node.
- TypeScript sobre o que já funciona em JS.
- Deploy da API (back-end no ar antes do front da Etapa 3).
- **Avaliação:** API com banco funcionando + eu quebro sua API com requisições maliciosas e vejo como ela responde.

### Etapa 3 — Front-end: React (semanas 11–15)

- Componentes, props, estado, hooks básicos, consumo da sua própria API.
- **Projeto:** front React conectado à API de tarefas da Etapa 2 → primeiro projeto full stack completo, com deploy.
- **Avaliação:** projeto no ar, código revisado por mim.

### Etapa 4 — Capstone: o "reclame aqui" concluído (semanas 16–20)

- Refazer do zero, agora sabendo o que faz: cadastro/login (auth), CRUD de reclamações, banco, front React, deploy.
- README caprichado, testes básicos. Este é o projeto central do portfólio — e a resposta para "o site que não foi concluído".
- **Avaliação:** simulo um code review de empresa.

### Etapa 5 — Portfólio e busca (semanas 21–24)

- GitHub organizado, LinkedIn, currículo, devlog do processo.
- Algoritmos básicos de entrevista + entrevistas simuladas comigo.
- Início das aplicações para vagas. Meta: **pronto para aplicar** — o emprego em si pode levar mais tempo, e tudo bem.

---

## Trilha de IA — do tutor ao agente

Desenvolvimento assistido por IA é habilidade de mercado e faz parte do plano — mas ela se constrói em camadas, porque quem não domina a base não consegue avaliar o que a IA produz, e avaliar é exatamente o que a empresa espera de quem usa IA. A progressão:

**Etapas 0–1 — IA como tutor.** Explica conceitos, tira dúvidas, revisa seu código *depois* de pronto. Nunca gera solução. Habilidade treinada: fazer boas perguntas técnicas e entender respostas — a base de todo o resto.

**Etapa 2 — IA como revisor.** Após cada exercício/feature, peça um code review à IA: bugs, casos de borda, alternativas. Compare a solução dela com a sua e entenda os trade-offs. Habilidade treinada: ler código alheio criticamente — inclusive o gerado por máquina.

**Etapa 3 — IA como par de programação.** Liberada a geração de trechos pequenos (uma função, um componente), com duas condições: você entende cada linha antes de commitar e escreve o teste que prova que funciona. Habilidade treinada: validar código que você não escreveu.

**Etapa 4 — IA como agente.** No capstone, partes do projeto são construídas com um agente de código (Claude Code ou similar): você especifica, o agente implementa, você revisa e testa. O README documenta o que foi assistido e como foi validado — isso vira *diferencial* de portfólio, não algo a esconder. Habilidade treinada: especificação, revisão e orquestração — o trabalho real de dev assistido por IA.

**Etapa 5 — IA como pauta de entrevista.** Saber contar essa progressão é resposta forte para "como você usa IA?" — pergunta cada vez mais comum. Você terá evidência pública (commits, READMEs) de uso com critério, não dependência.

---

## Trilha de Marca Pessoal — do perfil à audiência

Presença pública é ativo de empregabilidade, construída em camadas: perfil → rede → conteúdo → colheita. Regra de proteção: roda FORA do horário de estudo (máx. 30–60 min/dia) e é a PRIMEIRA coisa a pausar se o checkpoint semanal der amarelo ou vermelho — a âncora da etapa vale mais que qualquer post.

> O plano detalhado (camada por etapa, backlog de posts, formato, estado atual) vive em [`marca-pessoal.md`](marca-pessoal.md) — documento vivo e fonte única desta trilha.

---

## Contra os desafios pessoais (seção 7 do plano original)

- Mudança de interesse no meio do caminho → a regra da stack travada existe para isso. Anote a ideia nova num `ideias-depois.md` e volte ao plano.
- Distração → estude com celular fora do alcance em blocos de 50min + 10min de pausa; YouTube/WhatsApp nas pausas.
- Constância → o commit diário é o termômetro: dia sem commit é dia para me contar o que houve, sem culpa — dado, não derrota.
