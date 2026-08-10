# Devlog — Etapa 3 (Front-end: React)

> Inversão do cronograma · 28/07/2026 — Etapa 2 pausada no meio do Tema 5, front antecipado. O back volta do ponto onde parou. Motivo e consequências no [`plano.md`](plano.md).

## 📅 28/07

- **⏸️ Etapa 2** — pausada no meio do Tema 5 (Testes a fundo). Temas 5 a 10 ficam de pé, congelados.
- **📄 Etapa 3** — plano detalhado escrito: 14 temas, app vivo em `web/`, avaliação alvo 12/08.
- **🔀 Plano reordenado no mesmo dia**, depois do diagnóstico de perfil de programação: estilo subiu do T11 para o **T3**, entrou o tema novo de **Motion (T10)**, e o **deploy desceu do T13 para o T11** — link público com quatro temas ainda pela frente.

**Anotações**

1. O front consome a API **local**, sem auth e sem URL pública — consequência escolhida da inversão. Login e deploy da API entram quando o back voltar.
2. Exceção única ao congelamento do back: habilitar CORS para `http://localhost:5173`, no Tema 7.
3. Duas decisões ficaram pendentes de escolha minha, dentro dos temas: **qual sistema de estilo** (T3) e **Framer Motion ou GSAP** (T10). As duas vão para o `web/README.md` quando eu decidir.
4. Custos assumidos da reordenação: estilizar lista estática no T3 gera retrabalho de CSS depois do CRUD, e os testes ficaram por último (T14) — mesmo padrão do questionário pendente do T4 da Etapa 2. A regra 1 segura até lá.

- Amanhã: abrir o Tema 1 (React e ferramental).

## 📅 29/07

### T1 · React e ferramental — ✅ Feito (29/07)

**O app ganhou** — a `web/` nasceu: projeto Vite com React + TypeScript rodando em `localhost:5173`. Primeira árvore de componentes minha (`App` → `Header` e `Content`), asset importado de `src/assets/`, favicon servido de `public/`, e o boilerplate do Vite apagado.

**⚠️** — re-render: eu achava que o React só re-renderiza quem mudou. É o contrário: o pai re-renderizando chama todos os descendentes. O seletivo é o commit no DOM.

### T2 · Props, composição e listas — ✅ Feito (29/07)

Estudo em [`studies/studie-t02-props-composicao-listas.md`](studies/studie-t02-props-composicao-listas.md). Sem preparação de ambiente: código meu do começo ao fim.

**O app ganhou** — a lista de tarefas na tela a partir de `mockTasks`, com `TaskList` → `TaskItem` tipados e `key={task.id}` (uuid, o mesmo formato que virá do banco). `Content` decide vazio × lista com early return, `EmptyTask` diz o que fazer em vez de deixar a tela branca. `TaskSummary` calcula os contadores por status — o `{1 + 1}` chumbado do T1 morreu. `Section` com `children` e `AddTaskField` reaproveitado nos dois caminhos. A `Task` entrou como **cópia deliberada** do `api/README.md`, com o porquê registrado no `web/README.md`.

**Plano ajustado (29/07):** entraram tópicos de **componente de UI × componente de domínio**, quando encapsular a tag crua e quando o componente vira pasta (**T3, tópicos 13–15**), e **decomposição de tela + a pasta `pages/`** (**T9, tópicos 13–14**). Rejeitada a ideia de prescrever a árvore de pastas completa no T1: `hooks/`, `pages/`, `services/` e `utils/` seriam pastas vazias para problemas que não existem no dia 1, e eu teria posto o `TaskList` em `components/` por regra em vez de ter chegado no `components/tasks/` por necessidade.

### T3 · Estilos, layout e acessibilidade — ⏳ aberto (29/07)

Estudo em [`studies/studie-t03-estilos-layout-acessibilidade.md`](studies/studie-t03-estilos-layout-acessibilidade.md).

Nasceu o **Tema 0**, em dois arquivos fechados:

- [`studies/base-html.md`](studies/base-html.md) — tag/elemento/atributo, atributo booleano (de onde vem o `<TaskItem done />` do T2), a árvore e o aninhamento, block × inline, o inventário de tags que importam, landmarks, semântica (`<button>` × `<div onClick>`), `<label for>` ↔ `<input id>`, tabela com `<th scope>`, o DOM × HTML, e a tabela de diferenças JSX × HTML.
- [`studies/base-css.md`](studies/base-css.md) — como o CSS chega no elemento (`className` → `class` → seletor), regra/propriedade/valor, seletores, as quatro famílias de unidade + `fr`, box model e `box-sizing`, `display`, herança e especificidade, `@`, `:` × `::`, e — na frente de tudo — como se **consulta** CSS (DevTools e MDN) em vez de decorar.

**Parte B ganhou formato (29/07).** Os 18 bullets soltos num bloco viraram unidades de entrega, cada uma com o que o app ganha e um _Pronto quando_ que absorveu a lista de critérios — deu menos texto, não mais. Ganhos: ponto de parada limpo (contra o meu risco de começar muito e fechar pouco) e a ordem de execução explícita, que antes estava escondida (token antes de componente, estrutura antes de layout, auditoria de pasta antes de mover arquivo). Sem estimativa e sem coluna de status — o estado continua no devlog e nos commits. Regra 6 do plano ajustada.

## 📅 31/07

### T3 · Estilos, layout e acessibilidade — ⏳ os quatro blocos feitos (31/07), falta a migração para Tailwind

**O app ganhou** — CSS Modules aplicado em todo componente, `reset.css` mais `box-sizing`, paleta própria em escala numérica no `:root`, e `components/ui/` (`Card`, `Heading`, `TextField`, `CustomButton`) separado de `components/tasks/`. A lista virou responsiva de verdade: item empilhado na base, em linha a partir de 40rem.

**Parte B reorganizada em blocos (31/07).** O formato anterior picava o tema em unidades pequenas demais e a ordem de leitura não era a ordem de execução — dava para ler tudo e ainda não saber por onde começar. Agora são quatro blocos na ordem em que se faz, cada um com nome que diz o que o app ganha e um `Pronto quando` só. Sumiram o _Depende de_ (num arquivo lido de cima para baixo, a ordem **é** a dependência) e os ids. Regra 6 do plano reescrita.

**Próximo: a migração para Tailwind**, escolha minha, para aprender os dois e poder comparar. Não é bloco do T3 — o tema fecha antes.

## 📅 01/08 - 05/08

Realizado projeto pessoal para estudar HTML/CSS/Tailwind. Fiz uma cópia da home do Facebook estilizando o mais próximo possível.

## 📅 06/08

### T3 · Estilos, layout e acessibilidade — ✅ Feito (06/08)

Projeto completamente reestruturado e migrado para Tailwind. Novo designe, responsivo para mobile e desktop.

### T4 · Estado e eventos — ⏳ aberto (06/08)

Estudo em [`studies/studie-t04-estado-eventos.md`](studies/studie-t04-estado-eventos.md). **Sem preparação de ambiente** — `useState` já vem no React instalado; é o primeiro tema com atrito zero.

**O que o tema entrega:** o `const tasks = mockTasks` do `Content` vira `useState`, o botão **Alterar** passa a mudar o status de verdade (evento no filho → callback → atualização imutável no pai), e entra um filtro derivado. Tudo em memória.

## 📅 07/08

### T4 · Estado e eventos — ✅ Feito (07/08)

**O app ganhou** — interação de verdade, a primeira da etapa. `const tasks = mockTasks` virou `useState` no `Content`, e a partir daí três handlers: **alterar** o status pelo botão da tarefa (ciclo `todo → doing → done → todo`, com a tarefa trocando de coluna na hora), **criar** pelo campo do rodapé, e **apagar** pelo botão do item. Os três usam a forma funcional (`setTasks(prev => ...)`) e atualização imutável — `map` com spread, `filter`, spread de array. Coluna sem tarefa ganhou mensagem própria, que antes era título com espaço branco embaixo.

**Decisões minhas, registradas no `web/README.md`:**

1. **"Alterar" cicla o status** em vez de `<select>` ou de "marcar como feita". O critério foi o botão nunca ficar clicável e morto — na primeira versão o `done` não tinha transição e o botão não fazia nada, sem avisar ninguém.
2. **A transição virou `Record<Status, Status>`**, não escada de `if`. O ganho é exaustividade: faltar um caso é erro de compilação. Fez a decisão do item 1 aparecer — o `if` escondia que `done` não ia para lugar nenhum.

### T5 + T6 · Formulários controlados e efeitos — ⏳ aberto (07/08)

Estudo em [`studies/studie-t05-t06-formularios-e-efeitos.md`](studies/studie-t05-t06-formularios-e-efeitos.md). **Sem preparação de ambiente** — `useEffect` vem no React e `localStorage` é do navegador; segundo tema seguido com atrito zero.

**Os dois temas foram mesclados**, por conteúdo e não por pressa: o efeito escolhido para o T6 é persistir as tarefas, e ele só tem material depois que o formulário do T5 existir. A numeração dos tópicos foi preservada (A1 = T5, A2 = T6) e eles continuam valendo como **dois temas** na avaliação e na oral.

**O que o tema entrega:** o `InputTask` de um campo vira formulário de três (`description`, `status`, `term`) com validação e erro por campo; a descrição ganha edição inline com Enter/Esc/blur; e as tarefas passam a **sobreviver ao F5** via `localStorage`. Tudo ainda sem API.

**Decisões da abertura:**

1. **O efeito do T6 é a persistência no `localStorage`.** As alternativas eram título da aba (barato demais) e simular `fetch` com `setTimeout` (código descartável). A persistência mata a limitação nº 1 do `web/README.md` e, melhor, **morre no T7** quando a API chegar — dá para ver o efeito ser substituído em vez de só ler sobre isso.
2. **Ler o storage é inicializador preguiçoso, escrever é efeito.** A assimetria é o tópico 2 do A2 aplicado no próprio tema: com efeito na leitura, o primeiro render pinta vazio e o segundo pinta as tarefas — pisca.
3. **O formulário de criar tarefa expande ao focar.** O rodapé `sticky` continua sendo o campo rápido de hoje; ao focar o título, `status` e `term` aparecem abaixo. Alternativas descartadas: três campos sempre visíveis (com erro por campo, a barra come metade da tela no celular) e botão abrindo modal (exige um `Modal` com foco preso, Esc e scroll travado — trabalho de T3 pago no meio do T5). O `status` é escolha do usuário: dá para criar tarefa já em `doing` ou `done`, com padrão `todo`. **Fica em aberto de propósito, para eu resolver:** quando o rodapé fecha.

## 📅 08/08

### T5 + T6 · Formulários controlados e efeitos — ✅ Feitos (08/08)

**O app ganhou** — o campo único do rodapé virou **formulário de três campos** (`title`, `status`, `term`), controlado, com validação e mensagem de erro no campo certo. O rodapé começa como campo rápido e **expande ao receber foco**; fecha ao enviar. O título passou a ser **editável na linha** — clicar troca por um input, Enter salva, Esc cancela. E as tarefas **sobrevivem ao F5**: `localStorage` lido por inicializador do `useState` e gravado por `useEffect`.

**Refatoração não planejada, e foi a melhor coisa do dia.** O `ListTasks` foi eliminado e os três `<Card>` idênticos viraram um `map` sobre um array de dados. Nasceu do incômodo real de estar passando seis props por três andares — resolveu a duplicação tripla **e** apagou um andar inteiro de prop drilling. Junto saíram `utils/taskStorage` (com `loadTasks`/`saveTasks` simétricos) e `utils/taskRules` (`nextStatus` + `validateTaskForm`), e o `Content` foi renomeado de `index.tsx`.

## 📅 09/08

### T7 + T8 · Falando com a API e o CRUD completo — ⏳ abertos (09/08)

Estudo em [`studies/studie-t07-t08-api-e-crud.md`](studies/studie-t07-t08-api-e-crud.md). **Segunda mescla da etapa**, e por conteúdo: os dois temas montam a mesma camada (`src/api/`), e metade dos tópicos do T8 (erro no campo certo, refetch × estado local, salvando por item) só faz sentido depois que os quatro estados de tela do T7 existirem. Numeração preservada (A1 = T7, A2 = T8) e continuam valendo como **dois temas** na avaliação e na oral.

**Preparação do ambiente entregue:** CORS na `api/`, middleware na mão em `app.ts` — a exceção única ao congelamento do back-end. Ficou como o **primeiro** middleware da cadeia de propósito: assim a resposta de **erro** também carrega o header, senão o 400 chega ao navegador sem permissão de leitura e um erro de validação vira erro de CORS na tela.

**O que o tema entrega:** a lista vem do Postgres via `GET /tasks`, e criar/editar/apagar vão até o banco. O app deixa de ser dono do dado e vira cliente de quem é.

**Decisões da abertura:**

1. **O `localStorage` morre.** A API vira fonte única da verdade — `utils/taskStorage.ts` sai do app junto com o `useEffect([tasks])` que gravava. As alternativas eram mantê-lo como cache de leitura ou como fallback. Foram recusadas pelo mesmo motivo: com dado velho pintado por baixo, o **estado de erro nunca aparece de verdade**, e os quatro estados do T7 só são honestos sem rede de segurança. O preço — o app para de funcionar sem a API de pé — é a dívida que o **T10, tópico 7** existe para pagar, agora explícita em vez de acidental.
2. **CORS na mão, sem o pacote `cors`.** Cinco linhas contra uma dependência nova numa API congelada — e o header que resolve o problema fica visível, que é exatamente o tópico 8 do A1.
3. **Atualizar o estado com a resposta, não refetch.** O `POST` e o `PATCH` da API devolvem a entidade inteira (`RETURNING`), é um usuário só e a lista é pequena. O gatilho para mudar de ideia fica escrito: no dia em que houver mais de um cliente escrevendo, vira refetch/invalidação.
4. **Otimista só onde o servidor não decide nada.** Ciclar status é otimista com rollback (o clique tem que responder na hora, e o T14 vai animar essa troca de coluna); criar e editar título são pessimistas — o `POST` depende do id do banco, e id que muda no meio do caminho quebra a `key` e, com ela, a animação de saída do T14.

## 📅 10/08

### T7 + T8 · Falando com a API e o CRUD completo — ✅ Feitos (10/08)

**O app ganhou** — deixou de ser dono dos dados e virou **cliente**. Nasceu `src/api/` com `http.ts` (o `request<T>` genérico: URL base do `.env`, `Content-Type`, checagem de `res.ok`, ramo do `204`, `signal`, timeout) e `tasks.ts` (as quatro funções tipadas). A lista vem do `GET /tasks`, e criar, editar título, ciclar status e apagar vão até o Postgres. O `localStorage` morreu junto com o `useEffect([tasks])` que gravava. Os quatro estados de tela ganharam componentes próprios (`LoadingTasks`, `ErrorTasks` com "Tentar de novo", `EmptyTasks`, lista), modelados como **união discriminada** — três booleanos dariam 8 combinações para 4 estados válidos.

- Próximo: **T9 — Rotas.**
