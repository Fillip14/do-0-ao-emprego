# Devlog — Etapa 3 (Front-end: React)

> Inversão do cronograma · 28/07/2026 — Etapa 2 pausada no meio do Tema 5, front antecipado. O back volta do ponto onde parou. Motivo e consequências no [`plano.md`](plano.md).

## 28/07

- **⏸️ Etapa 2** — pausada no meio do Tema 5 (Testes a fundo). Temas 5 a 10 ficam de pé, congelados.
- **📄 Etapa 3** — plano detalhado escrito: 14 temas, app vivo em `web/`, avaliação alvo 12/08.
- **🔀 Plano reordenado no mesmo dia**, depois do diagnóstico de perfil de programação: estilo subiu do T11 para o **T3**, entrou o tema novo de **Motion (T10)**, e o **deploy desceu do T13 para o T11** — link público com quatro temas ainda pela frente.

- **🗣️ Parte C virou defesa oral** — 6 a 8 perguntas no meio do tema, faladas, com contra-argumento; no devlog fica uma linha por pergunta, só o que ficou de pé. O questionário escrito de 30+ perguntas no fim do dia não pegou (o do T4 da Etapa 2 ficou sem resposta). Aplicado no `studie-t01` e na regra 6 do plano.

**Anotações**

1. O front consome a API **local**, sem auth e sem URL pública — consequência escolhida da inversão. Login e deploy da API entram quando o back voltar.
2. Exceção única ao congelamento do back: habilitar CORS para `http://localhost:5173`, no Tema 7.
3. Duas decisões ficaram pendentes de escolha minha, dentro dos temas: **qual sistema de estilo** (T3) e **Framer Motion ou GSAP** (T10). As duas vão para o `web/README.md` quando eu decidir.
4. Custos assumidos da reordenação: estilizar lista estática no T3 gera retrabalho de CSS depois do CRUD, e os testes ficaram por último (T14) — mesmo padrão do questionário pendente do T4 da Etapa 2. A regra 1 segura até lá.

- Amanhã: abrir o Tema 1 (React e ferramental).

## 29/07

### T1 · React e ferramental
**O app ganhou** — a `web/` nasceu: projeto Vite com React + TypeScript rodando em
`localhost:5173`. Primeira árvore de componentes minha (`App` → `Header` e `Content`),
asset importado de `src/assets/`, favicon servido de `public/`, e o boilerplate do
Vite apagado.

**Pedra do tema** — o `npm run typecheck` que eu escrevi não checava nada. O `tsconfig.json`
da raiz é solution-style (`"files": []` + `references`), e `tsc --noEmit` não segue
`references` — lia zero arquivo e saía limpo sempre. Corrigido para `tsc -b --noEmit`.

**⚠️** — re-render: eu achava que o React só re-renderiza quem mudou. É o contrário:
o pai re-renderizando chama todos os descendentes. O seletivo é o commit no DOM.

### T2 · Props, composição e listas — ✅ Feito (29/07)
Estudo em [`studies/studie-t02-props-composicao-listas.md`](studies/studie-t02-props-composicao-listas.md).
Sem preparação de ambiente: código meu do começo ao fim.

**O app ganhou** — a lista de tarefas na tela a partir de `mockTasks`, com `TaskList` →
`TaskItem` tipados e `key={task.id}` (uuid, o mesmo formato que virá do banco). `Content`
decide vazio × lista com early return, `EmptyTask` diz o que fazer em vez de deixar a tela
branca. `TaskSummary` calcula os contadores por status — o `{1 + 1}` chumbado do T1 morreu.
`Section` com `children` e `AddTaskField` reaproveitado nos dois caminhos. A `Task` entrou
como **cópia deliberada** do `api/README.md`, com o porquê registrado no `web/README.md`.

**Pedra do tema** — o `0 &&`. Escrevi `{todo && <p>...}` com `todo` sendo `number`: quando
zera, o JSX **renderiza o `0`** na tela, porque `a && b` devolve `a`, não `false`. As duas
linhas vizinhas estavam com `> 0` e essa não. Não apareceu na hora só porque o mock tinha
uma tarefa `todo`.

**⚠️** — a `TaskSummary` nasceu como função auxiliar (`calculateTypeTasks`) que não
retornava nada: copiei o JSX com as chaves junto, e `{...}` fora do JSX é **bloco**, não
interpolação. Se recebe dado e devolve JSX, é componente — maiúscula, arquivo próprio,
`<TaskSummary />`. Chamado como função comum ele nem aparece na árvore do DevTools.

**Também caiu na revisão:** `;` solto dentro do JSX vira texto na tela · `type Text`
sombreando o tipo global do DOM · ternário de 3 vias trocado por `Record<Status, string>`,
que obriga o TS a cobrar o ícone quando um status novo entrar.

**Dívida anotada:** `id="task"` fixo dentro do `AddTaskField`. Funciona hoje porque só um
aparece por vez (o early return do `Content`); com os dois na mesma tela o `htmlFor` passa a
apontar para o input errado. Resolve com `useId`, T12.

**Decisão registrada:** organização **por tipo**, com subpasta por área em `components/`.
Sem árvore de pastas no README — envelhece e vira mentira; ficou a decisão e a convenção.

**Plano ajustado (29/07):** entraram tópicos de **componente de UI × componente de domínio**,
quando encapsular a tag crua e quando o componente vira pasta (**T3, tópicos 13–15**), e
**decomposição de tela + a pasta `pages/`** (**T9, tópicos 13–14**). Rejeitada a ideia de
prescrever a árvore de pastas completa no T1: `hooks/`, `pages/`, `services/` e `utils/`
seriam pastas vazias para problemas que não existem no dia 1, e eu teria posto o `TaskList`
em `components/` por regra em vez de ter chegado no `components/tasks/` por necessidade.

### T3 · Estilos, layout e acessibilidade — ⏳ aberto (29/07)
Estudo em [`studies/studie-t03-estilos-layout-acessibilidade.md`](studies/studie-t03-estilos-layout-acessibilidade.md).

**Decisão pendente, e é minha:** qual sistema de estilo — CSS global, CSS Modules, CSS-in-JS
ou Tailwind. Vai para o `web/README.md` com o porquê. Preparação de ambiente só existe se eu
escolher Tailwind ou CSS-in-JS.

**O que a Parte B pediu além do estilo em si:** `components/ui/` nasce com a auditoria do
critério UI × domínio (`Section` e o campo de texto saem de onde estão, `Content` vai para
`tasks/` porque importa `Task`), a grade de colunas fixas em px vira flexível, e a linha
`li.task-header` tem que ser resolvida — ou vira `<table>` de verdade, ou a linha de cabeçalho
morre. Deixar como está é a única opção que não vale.

**Dívidas do T2 que este tema toca:** o `style={{ color: 'gray' }}` do `AddTaskField` e o
`p { color: gray }` global morrem (os dois reprovam no contraste); o `#f5ead8` duplicado vira
token único. O `id="task"` chumbado **não** se resolve com CSS Modules — `id` é global em
qualquer sistema de estilo, continua sendo `useId` no T12.