# Etapa 3 — Front-end: React

> **Inversão do cronograma (28/07/2026):** a Etapa 2 foi **pausada no meio do Tema 5** e o front entra no lugar. O back-end volta depois, do ponto onde parou — nada foi descartado. · **Início: 29/07/2026** · **Avaliação alvo: 12/08/2026**
>
> **Reordenado em 28/07** para casar com o perfil de programação (front de movimento e interação): estilo saiu do fim para o **Tema 3**, entrou um tema novo de **Motion**, e o **deploy foi adiantado** — link público com temas ainda pela frente.
>
> **Reordenado de novo em 10/08**, nos temas 10–14: **T10 deploy · T11 hooks · T12 Context · T13 testes · T14 motion** (antes era motion, deploy, hooks, Context, testes). Deploy colou em rotas para pagar o 404 no F5 no tema seguinte e adiantar a regra 7; motion foi para o fim, com bundle e suíte já de pé para cobrá-lo. Detalhe e custos no devlog.

## Objetivo

Construir o **lado do cliente**: uma SPA em React + TypeScript que consome a API de tarefas da Etapa 2 e faz o CRUD inteiro na tela — com estados de carregando, erro e vazio tratados, rotas, movimento de verdade, testes e deploy. Ao fim da etapa existe um **sistema completo**: `web/` público na internet conversando com a `api/` local, os dois seus.

O que a etapa **não** entrega, e por quê: **login/cadastro** (a API ainda não tem auth — Tema 8 da Etapa 2) e **front consumindo URL pública** (a API ainda não foi para produção — Tema 9 da Etapa 2). Ambos entram quando o back voltar, como uma emenda curta sobre um front que já funciona. Isto é consequência escolhida da inversão, não esquecimento.

## O estado do back-end nesta etapa

A API está **congelada** em: TypeScript strict, PostgreSQL via `pg` com pool e queries parametrizadas, erro central no formato `{ errors: [{ field?, message }] }`, rotas `GET/POST/PATCH/DELETE /tasks` e `GET /tasks/:id` com `:id` uuid. O contrato completo está em [`../etapa-2/api/README.md`](../etapa-2/api/README.md) — **é ele que o front lê**, não o código da API.

**Exceção única ao congelamento:** habilitar **CORS** para a origem do Vite (`http://localhost:5173`). Sem isso o navegador bloqueia toda requisição e o Tema 7 não anda. É uma linha de middleware, e o assunto CORS a fundo continua sendo do Tema 8 da Etapa 2.

Qualquer outra vontade de mexer na API durante esta etapa (paginação, filtro, campo novo, rota nova) vai para o `ideias-depois.md` e é resolvida quando o back voltar. Front que se vira com o contrato que existe é exatamente a situação real de trabalho.

## Regras da etapa

1. **Trilha de IA — fase PAR DE PROGRAMAÇÃO.** Liberada a geração de **trechos pequenos** (uma função, um componente, um tipo), com **uma condição: você entende cada linha antes de commitar** — se não entende, pergunta ou reescreve. Habilidade treinada: validar e entender código que você não escreveu.
2. **Commits diários** no GitHub, push conferido.
3. **Stack travada:** React + TypeScript + Vite e outros frameworks se necessário.
4. **O contrato do front mora no `web/README.md`:** O que é o app. Como rodar (variáveis de ambiente). Mapa de rotas atualizado. Frameworks utilizados atualizado. Estrutura de pastas simples. O que o app faz atualizado.
5. **`studie-tNN-tema.md` na abertura de cada tema**, feito pela IA em três partes. **Parte A:** _1- O que é (descrever funções/metódos do tópico). 2- Para que serve, o que substitui, diminui algo do código, refatora, facilita, etc? 3- Exemplo pequeno. **Parte B:** alterações no app — \_1- Preparação do ambiente_ (setup de ferramenta se tiver); _2- Os blocos_: Bloco 1: o que é para o app fazer/ter agora. Bloco 2: sugestões de alterações médio/avançado para colocar no app. Toda a Parte B em tópicos, simples, breve. **Parte C:** revisão do código. Verificar se o app foi migrado para o assunto do tema (as alterações obrigatórias do tema), se ele está typecheck ok e se os testes estão verdes (caso já tenha testes).
6. **Um tema só fecha quando a parte C estiver concluida**
7. **A partir do Tema 10, o que está na `main` está no ar.** Tema fechado sem redeploy é tema não fechado. Sem link público, não conta como terminado.
8. **A defesa oral acontece uma vez, no fim: o simulado de entrevista**, depois do Tema 14 e imediatamente antes da avaliação de 12/08 — é o último bloco da etapa, não um extra opcional. São as 14 perguntas da Avaliação, uma por tema, no formato de entrevista — eu respondo falado e curto (2–3 frases), a IA contra-argumenta em cima, e o que não se sustentar me manda de volta à Parte A daquele tema.

## Estrutura de pastas

**`web/` — o app vivo.** Mesmo papel que a `api/` teve na Etapa 2: nasce no Tema 1 e cresce a cada tema. Nada de recomeçar do zero por tema.

**`studies/` — a pasta de estudo dos temas.** Guarda tudo que **não** é o app: os `studie-tNN-tema.md`, o **Tema 0** em `base-html.md` + `base-css.md`.

```
etapas/etapa-3/
├── web/                ← o app vivo (React + TS + Vite)
│   ├── src/
│   ├── public/
│   └── README.md       ← contrato do front
├── studies/            ← estudo dos temas, o que não vai no app
│   ├── base-html.md        ← Tema 0, parte 1 — a base que faltou, fechada
│   ├── base-css.md         ← Tema 0, parte 2 — idem
│   └── studie-tNN-*.md     ← as decisões de cada tema
├── devlog-etapa-3.md   ← devlog da etapa
└── plano.md            ← este arquivo
```

Rodar os dois ao mesmo tempo é parte da etapa: um terminal com `npm run dev` na `api/` (com o Postgres de pé), outro com `npm run dev` na `web/`.

---

## Os temas

Quatorze temas, um por dia sugerido. **O dia é guia, não contrato** — na Etapa 2 o ritmo real foi de ~1,3 dia por tema, e tema que rende aprendizado de verdade pode furar a fila. O que não desliza é a regra 6: tema só fecha com a Parte C concluída.

**A ordem tem lógica:** os temas 1–3 põem algo apresentável na tela rápido; 4–8 constroem o comportamento e a conversa com o banco; 9–10 transformam isso num produto, com rotas e URL pública; 11–13 são o rigor por baixo — arquitetura de estado, performance medida e testes; e o 14 devolve movimento a um app já medido e coberto. _(Frase corrigida em 11/08: ela ainda descrevia a ordem anterior à reordenação de 10/08, com motion no meio.)_

### Tema 0 — Base css e base html · ✅ Tema fechado

**Tópicos de estudo sugeridos**

1. A base de css e html sobre o que foi estudado na etapa 1.
2. É um complemento para relembrar a base de front-end.

### Tema 1 — React e ferramental · _dia sugerido 29/07_ · ✅ Feito (29/07)

**O app ganha:** ele nasce aqui — projeto Vite com React + TypeScript rodando em `localhost:5173`, com a primeira árvore de componentes na tela.

**Tópicos de estudo sugeridos**

1. O problema que o React resolve: manipular o DOM na mão (o que você fez na Etapa 1) versus descrever o estado e deixar a biblioteca reconciliar.
2. SPA × páginas servidas: uma casca HTML e o JS montando o resto; o que se ganha e o que se perde (primeiro carregamento, SEO, botão voltar).
3. Declarativo × imperativo: `document.createElement` versus JSX.
4. JSX de verdade: é açúcar para chamada de função, por isso `className`, `htmlFor`, chaves para expressão, um só nó raiz, fragmento `<>`.
5. Componente é função que devolve JSX. Convenção da maiúscula e por que ela não é estética.
6. Vite: dev server com HMR × build de produção; por que não se usa `create-react-app` em 2026.
7. Anatomia do projeto: `index.html`, `main.tsx`, `App.tsx`, `vite.config.ts` — quem chama quem.
8. `tsconfig` do front × o da API: `jsx`, `lib: ["DOM"]`, `moduleResolution`, tipos `.tsx`.
9. `StrictMode`: o que ele é, por que monta o componente duas vezes em desenvolvimento e por que isso é feature, não bug.
10. Renderização: o que dispara um render, o que o React faz com a árvore, e por que "re-render" não é "redesenhar tudo no DOM".
11. React DevTools: instalar e olhar a árvore desde o primeiro dia.
12. Import de asset e CSS no Vite.

### Tema 2 — Props, composição e listas · _dia sugerido 30/07_ · ✅ Feito (29/07)

**O app ganha:** a lista de tarefas na tela a partir de um array fixo em código — `TaskList` e `TaskItem` tipados, sem API ainda.

**Tópicos de estudo sugeridos**

1. Props: entrada da função. Fluxo de dados de cima para baixo e por que ele é de mão única.
2. Tipar props com `interface`/`type`; props opcionais e `exactOptionalPropertyTypes` mordendo aqui também.
3. Props são somente-leitura — mutar prop é bug, não atalho.
4. Valor padrão de prop no TypeScript moderno (parâmetro com default, não `defaultProps`).
5. `children` e a diferença entre **composição** (passar JSX) e **configuração** (passar mais uma prop booleana).
6. Renderizar lista com `map` e por que `key` existe: identidade entre renders, o que quebra com `key={index}`, e por que o id do banco é a boa chave aqui.
7. Renderização condicional: `&&`, ternário, early return — e a armadilha do `0 && <algo>`.
8. Estado vazio como caso de primeira classe: lista sem itens não é tela em branco.
9. Quando quebrar um componente em dois — e o custo de quebrar cedo demais.
10. Colocação de arquivos: um componente por arquivo, pasta por feature × pasta por tipo.
11. Tipos compartilhados com a API: onde mora a `interface Task` no front e por que ela é uma **cópia deliberada** do contrato, não um import de dentro da `api/`.

### Tema 3 — Estilos, layout e acessibilidade · _dia sugerido 31/07_ · ✅ Feito (06/08)

**O app ganha:** deixa de ser HTML cru — sistema de estilo escolhido, tokens definidos, layout responsivo e a lista apresentável, com os primeiros componentes de UI (`ui/`) separados do domínio. **É o tema que paga o combustível da etapa inteira.**

> **Por que aqui e não no fim:** estilizar uma lista estática significa voltar ao CSS depois do CRUD. É retrabalho de propósito — pago em motivação, e a decisão está registrada.

**Tópicos de estudo sugeridos**

1. As opções: CSS global, CSS Modules, CSS-in-JS, Tailwind — o que cada uma resolve. Escolher **uma** e registrar a decisão no `web/README.md`.
2. O problema que CSS Modules resolve: escopo e colisão de nome.
3. Variáveis CSS como design tokens: cor, espaçamento, raio, tipografia num lugar só. É delas que o Tema 14 vai tirar duração e curva de animação.
4. Classe condicional por prop, sem virar sopa de ternário (estado vem no Tema 4 e usa o mesmo caminho).
5. Layout com Flexbox e Grid — o suficiente para uma lista, um formulário e um cabeçalho.
6. Responsivo com mobile-first e media query.
7. Estados visuais que a maioria esquece: `:hover`, `:focus-visible`, `:disabled`, carregando, vazio, erro.
8. HTML semântico: `button` é botão, `nav` é navegação; `div` clicável é dívida.
9. Foco: ordem de tabulação, foco visível, para onde o foco vai depois de apagar um item ou fechar um modal.
10. `aria-live` para avisar a mudança que aconteceu sem clique.
11. Contraste e tamanho de alvo — dois testes rápidos que pegam a maior parte dos problemas.
12. **Acessibilidade é comportamento, não enfeite:** o que o leitor de tela acha é o que o Testing Library acha (Tema 13) e é o que o teclado alcança na avaliação.
13. **Componente de UI × componente de domínio.** O critério: componente reutilizável **não sabe nada do domínio** — `Button` não sabe o que é uma tarefa, `TaskItem` sabe. Teste prático: se o arquivo fosse copiado para outro projeto, funcionaria sem alteração? Consequência na pasta: `components/ui/` × `components/tasks/`. Auditar o que já existe da `web/` — `Section` e `AddTaskField` não importam `Task` e estão do lado errado.
14. **Quando encapsular a tag crua e quando não.** Embrulhar `<button>` num `Button` que não acrescenta nada é custo puro (mais um arquivo, mais um import, zero ganho). Vale quando há **decisão repetida** para encapsular: estilo, estado visual (`:hover`/`:disabled`/carregando), acessibilidade. É por isso que este tópico é do Tema 3 e não do Tema 2 — antes de existir estilo não há decisão nenhuma a encapsular. Os habitantes típicos de `ui/`: `Button`, `TextField` (label + input + erro juntos), `Select`, `Modal`, `Card`, `Badge`, `Spinner`, `Alert`.
15. **Quando o componente vira pasta.** `Button.tsx` solto × `Button/` com `Button.tsx` + `Button.module.css` + (no Tema 13) `Button.test.tsx`. O gatilho é o arquivo irmão — enquanto o componente é um arquivo só, pasta é cerimônia.

### Tema 4 — Estado e eventos · _dia sugerido 07/08_ · ✅ Feito (07/08)

**O app ganha:** interação real — marcar tarefa como feita, filtrar por status na memória, tudo com `useState`.

**Tópicos de estudo sugeridos**

1. O que é estado: o que o componente precisa lembrar entre renders. Por que variável comum não serve.
2. `useState`: o par valor/setter, o inicializador, e o fato de que o setter agenda — não altera na hora.
3. Estado é imutável no React: `[...arr]`, `{...obj}`, `map` para trocar um item — nunca `push`/atribuição direta.
4. Atualização funcional `setX(prev => ...)` e quando ela é obrigatória.
5. Eventos no React: `onClick`, `onChange`, o objeto de evento sintético, `preventDefault`.
6. Passar função como prop — o filho avisa o pai (callback para cima).
7. **Lifting state up:** onde o estado precisa morar para dois componentes enxergarem.
8. **Estado derivado:** o que dá para calcular na renderização não vira estado. Contadores, filtrados e "tem algum selecionado" são derivados.
9. Estado redundante e estado impossível: modelar para que o estado inválido nem seja representável.
10. Um objeto grande de estado × vários `useState` pequenos.
11. Estado local × estado que sobe: o critério prático.
12. Ler o estado no DevTools para conferir o que você acha que está acontecendo.

### Temas 5 + 6 — Formulários controlados e efeitos · _dias sugeridos 08/08–09/08_ · ✅ Feitos (08/08)

> **Mesclados em 07/08.** Estudo único em [`studies/studie-t05-t06-formularios-e-efeitos.md`](studies/studie-t05-t06-formularios-e-efeitos.md), com a numeração dos tópicos preservada (A1 = T5, A2 = T6) porque é ela que o simulado da regra 8 usa. Continuam contando como **dois temas** para efeito de avaliação e de oral — duas perguntas, não uma.
>
> **O motivo é de conteúdo.** O efeito escolhido para o T6 é **persistir as tarefas no `localStorage`**, e ele só tem material depois que o formulário do T5 existir. A lição central do T6 — quando **não** usar `useEffect` — também precisa do formulário por perto para ter o que sincronizar errado. Separados, o T6 seria teoria sobre um app que não pede efeito nenhum.
>
> **Duas decisões tomadas na abertura:** o efeito do T6 é a persistência no `localStorage` (as alternativas eram título da aba e simular `fetch` com `setTimeout`), e o T5 entrega o **formulário completo mais a edição inline**, como o plano já previa. A escolha efeito × handler para gravar no storage fica registrada no `web/README.md`.

#### Tema 5 — Formulários controlados · ✅ Feito (08/08)

**O app ganha:** formulário de criar tarefa (descrição, status, prazo) com validação no cliente, e edição inline da descrição — tudo ainda em memória.

**Tópicos de estudo sugeridos**

1. Controlado × não controlado: quem é a fonte da verdade, o React ou o DOM.
2. `value` + `onChange`: o loop completo, e por que `value` sem `onChange` congela o campo.
3. Um handler para vários campos (`name` + `setForm(prev => ...)`).
4. `select`, `checkbox`, `radio`, `input type="date"` — cada um com sua peculiaridade de valor.
5. `onSubmit` no `<form>` × `onClick` no botão: por que o formulário é a resposta certa (Enter, acessibilidade, botão `type="submit"`).
6. Validação no cliente é conveniência; a validação que vale é a do servidor. Como conviver com as duas sem duplicar regra escondida.
7. Mostrar erro por campo — e o formato de erro da sua API (`field` + `message`) mapeando direto na tela.
8. `label` ligado ao input (`htmlFor`/`id`): acessibilidade e por que isso também facilita teste.
9. Limpar formulário depois do sucesso; manter o que foi digitado depois do erro.
10. Botão desabilitado durante o envio e o problema do duplo submit.
11. Formulário grande: quando `useState` por campo deixa de servir (gancho para o `useReducer` do Tema 11).
12. Bibliotecas de formulário existem — por que não usar nenhuma agora.

#### Tema 6 — Efeitos e ciclo de vida · ✅ Feito (08/08)

**O app ganha:** o primeiro efeito honesto do app (sincronizar título da aba, ou persistir o filtro) e a base para o Tema 7.

**Tópicos de estudo sugeridos**

1. O que é um efeito: sincronizar o componente com algo **fora** do React.
2. **Quando NÃO usar `useEffect`** — e este é o tópico mais importante do tema: transformar dado para exibir, responder a evento do usuário, derivar estado. Efeito não é "roda depois que a tela pinta".
3. O array de dependências: o que entra, o que o linter cobra, e por que dependência mentirosa vira bug intermitente.
4. Os três formatos: sem array, `[]`, `[deps]` — o que cada um significa de verdade.
5. Função de limpeza (`return () => ...`): timer, listener, assinatura, requisição em voo.
6. Ordem real: render → DOM → efeito. Por que ler layout dentro de efeito, não durante o render.
7. `StrictMode` monta-desmonta-monta em dev: o efeito que não sobrevive a isso está mal escrito.
8. Loop infinito: as três causas clássicas (setar estado sem deps, objeto/array recriado nas deps, função recriada nas deps).
9. Efeito com `async`: por que a função do efeito não pode ser `async` e o que se faz em vez disso.
10. **Race condition:** a resposta antiga chegando depois da nova. `AbortController` e a flag `ignore`.
11. `useEffect` × `useLayoutEffect` — saber que existe e quando importa (volta no Tema 14, medindo elemento para animar).
12. Efeito em componente pai × filho: ordem de execução.

### Temas 7 + 8 — Falando com a API e o CRUD completo · _dias sugeridos 10/08–11/08_ · ✅ Feitos (10/08)

> **Mesclados em 09/08.** Estudo único em [`studies/studie-t07-t08-api-e-crud.md`](studies/studie-t07-t08-api-e-crud.md), com a numeração dos tópicos preservada (A1 = T7, A2 = T8) porque é ela que o simulado da regra 8 usa. Continuam contando como **dois temas** para efeito de avaliação e de oral — duas perguntas, não uma.
>
> **O motivo é de conteúdo.** Os dois montam a **mesma camada** (`src/api/`): separá-los significa escrever `request`, tradução de erro e tipagem de resposta no T7 e voltar aos mesmos arquivos no dia seguinte. Metade dos tópicos do T8 (erro no campo certo, refetch × estado local, salvando por item) só tem sentido depois que os quatro estados de tela do T7 existirem, e a lição central do T7 — erro HTTP não rejeita a Promise — só dói quando existe um `POST` que pode voltar 400.
>
> **Três decisões tomadas na abertura:** o `localStorage` **morre** (a API vira fonte única da verdade, e o preço — app não funciona sem API de pé — é a dívida que o T10 tópico 7 paga); a tela atualiza com a **resposta** da escrita, não com refetch; e a atualização otimista fica só no ciclo de status, porque criar depende do id do banco e id que muda quebra a `key`. Todas vão para o `web/README.md`.

#### Tema 7 — Falando com a API · ✅ Feito (10/08)

**O app ganha:** a lista de tarefas vem do **PostgreSQL via sua API** — o array fixo em código morre. Estados de carregando, erro e vazio na tela.

> **Preparação do ambiente — ✅ entregue (09/08):** CORS habilitado na `api/` para `http://localhost:5173`, middleware na mão em `app.ts`, primeiro da cadeia. É a exceção única ao congelamento do back-end.

**Tópicos de estudo sugeridos**

1. Onde a requisição mora: uma camada `src/api/` com funções tipadas, não `fetch` espalhado dentro de componente.
2. `fetch` revisitado: `res.ok`, status, `res.json()`, e por que erro HTTP **não** rejeita a Promise.
3. Traduzir o erro da API (`{ errors: [...] }`) para um erro do front — uma função só, um formato só.
4. Tipar a resposta: o retorno de `res.json()` é `any`/`unknown`. O que significa afirmar `as Task[]` e o que essa afirmação não prova (mesma lição do `queryDb<T>` do Tema 4 da Etapa 2).
5. **Os quatro estados de toda tela que busca dado:** carregando, erro, vazio, sucesso. Nenhum é opcional — e os quatro já têm estilo, porque o Tema 3 veio antes.
6. Buscar no `useEffect` com limpeza e proteção de race — aplicação direta do Tema 6.
7. Variáveis de ambiente no Vite: `VITE_API_URL`, `import.meta.env`, `.env.local` fora do git, e por que tudo que entra aqui é **público**.
8. **CORS pelo lado de quem apanha:** o que é a política de mesma origem, por que o navegador bloqueia e o servidor não, o que é a requisição de preflight `OPTIONS`, e como ler o erro no console em vez de chutar.
9. Ler a aba Network: request, response, status, headers, tempo.
10. Erro de rede × erro de aplicação: API fora do ar não é o mesmo que 400.
11. Timeout e a tela que fica girando para sempre.
12. Por que existe TanStack Query e por que você vai passar sem ele agora — saber o problema antes da solução.

#### Tema 8 — Escrita: o CRUD completo na tela · ✅ Feito (10/08)

**O app ganha:** criar, editar e apagar tarefa indo até o banco. O front vira, de fato, o cliente da sua API.

**Tópicos de estudo sugeridos**

1. `POST`/`PATCH`/`DELETE` com `fetch`: método, `Content-Type`, corpo, e o que cada rota devolve (201 + `Location`, 200, 204).
2. `204 No Content`: chamar `res.json()` nele estoura — o caso de borda que todo mundo esquece.
3. Depois de escrever, como a tela atualiza: refetch da lista × atualizar o estado local com a resposta. Trade-off honesto.
4. `PATCH` parcial casando com o contrato: mandar só o que mudou, `term: null` limpa, campo ausente não é tocado.
5. **Atualização otimista:** pintar antes de confirmar, e o rollback quando dá errado. Quando vale e quando é armadilha.
6. Estado de "salvando" por item, não global — a linha que está gravando é aquela, não a página toda.
7. Erro de validação do servidor caindo no campo certo do formulário.
8. Confirmação antes de apagar; desfazer como alternativa.
9. Duplo clique, clique durante o envio, e a requisição repetida — idempotência vista do lado do cliente.
10. Chave de identidade nas listas quando o item ainda não tem id do banco (item otimista) — e por que isso decide se a animação do Tema 14 vai funcionar.
11. O que fazer quando o `PATCH` responde 404: o item sumiu debaixo dos seus pés.
12. Erro que aparece e some: onde vive a mensagem de erro e quem a limpa.

### Temas 9 + 10 — Rotas e Build/Deploy · _dias sugeridos 12/08–13/08_ · ✅ Feitos (11/08) · **no ar: https://do-0-ao-emprego.vercel.app**

> **Mesclados em 10/08.** Estudo único em [`studies/studie-t09-t10-rotas-e-deploy.md`](studies/studie-t09-t10-rotas-e-deploy.md), com a numeração dos tópicos preservada (A1 = T9, A2 = T10) porque é ela que o simulado da regra 8 usa. Continuam contando como **dois temas** para efeito de avaliação e de oral — duas perguntas, não uma.
>
> **O motivo é de conteúdo, e já estava escrito no plano.** O T9 tópico 12 deixa a dívida do 404 no F5 explicitamente para o T10 tópico 5; e o T10 tópico 2 (medir o bundle) e tópico 3 (`lazy` por rota) **não têm material sem rotas**. Foi exatamente por isso que o deploy subiu de 11 para 10 na reordenação de 10/08 — a mescla é a consequência dela.
>
> **Quatro decisões tomadas na abertura:** hospedagem na **Vercel** (Hobby aceita até 200 projetos, então o site que já existe lá não atrapalha); **os dois** — busca (`q`) e filtro de status — vão para a query string; `pages/home/` vira `pages/tasks/`, e o que nasce no T9 não é a pasta (ela chegou adiantada no T3) mas o conteúdo dela; e o tópico 7 do T10 é **mensagem honesta**, sem modo de demonstração — dado de demonstração é a segunda fonte da verdade que o T7 acabou de enterrar.
>
> **A descoberta que reescreve o T10 tópico 6:** o link público **não vai alcançar a API local — nem na sua própria máquina**. Página `https` chamando `http://localhost` é mixed content, e site público pedindo algo para a máquina do usuário é bloqueio de rede local (preflight com permissão explícita, que a `api/` congelada não manda). O desenvolvimento continua em `localhost:5173`; o link público é vitrine até a API subir no T9 da Etapa 2.

#### Tema 9 — Rotas · ✅ Feito (11/08)

**O app ganha:** navegação de verdade — lista em `/tasks`, detalhe em `/tasks/:id`, 404, layout compartilhado, URL que funciona no F5 e no botão voltar.

**Tópicos de estudo sugeridos**

1. O que o roteador de SPA faz: History API sem recarregar a página.
2. React Router: `BrowserRouter`, `Routes`, `Route`, `Outlet`.
3. Rota aninhada e layout compartilhado (cabeçalho e navegação que não repintam).
4. `Link`/`NavLink` × `<a href>` — por que a âncora crua mata a SPA.
5. `useParams` tipado e a validação do parâmetro: `:id` inválido é problema seu antes de ser da API.
6. `useNavigate`: redirecionar depois de criar, e o `replace` para não sujar o histórico.
7. **A URL é estado.** Filtro e busca em query string (`useSearchParams`) — a tela vira link compartilhável.
8. Rota `*`: página 404 do front, que não é o 404 da API.
9. `useLocation` e voltar para onde o usuário estava.
10. Buscar dado ao trocar de rota: a race condition do Tema 6 volta, agora entre rotas.
11. Rota protegida: o desenho do componente-guarda — montado agora, ativado quando o login existir (Tema 8 da Etapa 2).
12. Deploy de SPA e a rota que dá 404 ao recarregar: por que acontece, o que é o fallback para o `index.html` (resolvido no Tema 10).
13. **Decompor uma tela antes de escrever código.** Desenhar a árvore primeiro — `TaskPage` → `Header` · `Filters` · `TaskForm` · `TaskList` → `TaskItem`. A mecânica é trivial; o difícil é **onde parar**: dividir demais gera prop drilling (Tema 12), dividir de menos gera o arquivo de 300 linhas. Aqui a hierarquia deixa de ser exercício porque a página passa a existir de verdade.
14. **`pages/` (ou `routes/`) nasce aqui, e só aqui.** O componente de página é o que casa com uma rota, orquestra os componentes de domínio e é dono da busca de dado. Por que ele não podia existir no Tema 1: sem rota, "página" e "componente raiz" são a mesma coisa — a pasta seria nome sem conteúdo.

#### Tema 10 — Build e deploy · ✅ Feito (11/08)

**O app ganha:** **URL pública.** A partir daqui, tema fechado sem redeploy é tema não fechado (regra 7).

**Tópicos de estudo sugeridos**

1. `dev` × `preview` × `build`: três coisas diferentes, e por que medir performance em modo de desenvolvimento não vale nada.
2. Ler o resultado do `vite build`: tamanho do bundle, o que entrou nele, `rollup-plugin-visualizer`. O React Router do Tema 9 aparece aqui — e é para vê-lo. Esta medição é a **linha de base**: você repete depois do Tema 14 para ver o que a lib de motion custou.
3. `lazy` + `Suspense`: dividir o bundle por rota, aproveitando as rotas do Tema 9.
4. Deploy de estático (Vercel/Netlify/Pages): o que sobe é a pasta `dist/`.
5. **Fallback de SPA:** a regra de rewrite que faz `/tasks/:id` funcionar no F5 — a dívida deixada no Tema 9.
6. Variável de ambiente no build: `VITE_API_URL` é decidida na hora do build, não em runtime. Consequência para o dia em que a API tiver URL pública.
7. **O front no ar sem API no ar:** o que a pessoa que abrir o link vai ver. Decidir e implementar o que aparece — mensagem honesta, dados de demonstração, ou modo somente-leitura. Esta decisão é o coração do tema.
8. Deploy automático a cada push na `main`; preview de branch.
9. Cache e hash no nome do arquivo: por que o usuário não fica com a versão velha.
10. Imagem e fonte: o que pesa de verdade numa página simples.
11. Lighthouse: rodar, ler as quatro notas, corrigir o que é barato.
12. O `web/README.md` com link no topo, print/GIF do app, e a limitação da API local escrita com todas as letras.

### Temas 11 + 12 — Hooks a fundo e Estado global · _dias sugeridos 14/08–15/08_ · ✅ Feitos (11/08)

> **Mesclados em 11/08.** Estudo único em [`studies/studie-t11-t12-hooks-e-context.md`](studies/studie-t11-t12-hooks-e-context.md), com a numeração dos tópicos preservada (A1 = T11, A2 = T12) porque é ela que o simulado da regra 8 usa. Continuam contando como **dois temas** para efeito de avaliação e de oral — duas perguntas, não uma.
>
> **O motivo é de conteúdo, e já estava escrito no plano.** O T11 tópico 8 — "custom hook compartilha lógica, não estado" — termina com "e a ponte para o Tema 12": ele **enuncia** o problema que o T12 resolve. E o T12 tópico 6 (todo consumidor re-renderiza) **não tem como ser visto** sem o Profiler do T11 tópico 9; sem medição, o custo do Context é boato.
>
> **Três decisões tomadas na abertura, e as duas primeiras foram minhas por não haver material ainda para o Fillip decidir:** o `useReducer` entra **dentro do `useTasks`** (a máquina da lista), não no formulário — é a mesma refatoração, num arquivo só, e é a lista que tem transições de verdade; o Context é o **aviso global (toast)**, com o `notice` da `TasksPage` subindo para o `AppLayout`; e a **coleção de tarefas fica fora do Context de propósito**, porque é estado de servidor (T12, tópicos 9 e 10) e Context não é cache — colocá-la lá seria aprender o antipadrão como se fosse o padrão.
>
> **Fechados no mesmo dia da abertura (11/08).** As três decisões da abertura se sustentaram. Duas correções de rota, registradas no devlog: a **dívida de foco do T3 estava paga** (o `EditTitleField` já tinha `autoFocus`; a ref entrou pelo `select()`), e o **`useId` não curou bug nenhum** — o app tem um formulário só, é prevenção. Veredito de performance com número: **nada memoizado porque nada precisou**, os seis commits medidos abaixo dos 16 ms.

#### Tema 11 — Hooks a fundo, custom hooks e performance

**O app ganha:** a lógica de dados sai dos componentes e vira `useTasks`; o que re-renderiza demais é medido e corrigido.

**Tópicos de estudo sugeridos**

1. As regras dos hooks: topo do componente, sempre na mesma ordem, nunca dentro de `if`/loop. **Por quê** — o React identifica o hook pela posição na chamada.
2. `useReducer`: quando o estado tem transições, não só valores. `action`, `reducer`, `dispatch` — a ferramenta que a interação com fases do Tema 14 vai usar para não virar pilha de booleanos.
3. Modelar carregando/erro/dado como uma **união discriminada** em vez de três booleanos soltos — o TypeScript do Tema 3 da Etapa 2 pagando dividendo.
4. `useRef` para valor mutável que não dispara render.
5. `useRef` para nó do DOM: foco, scroll, medir — e o elemento que a animação precisa medir.
6. `useId` para acessibilidade em componente reutilizado.
7. **Custom hook:** função que começa com `use` e chama outros hooks. Extrair `useTasks` — o que ele expõe e o que ele esconde.
8. Custom hook compartilha **lógica**, não **estado**: dois componentes usando o mesmo hook têm dois estados separados. Consequência prática — e a ponte para o Tema 12.
9. **React DevTools Profiler: medir antes de otimizar qualquer coisa.**
10. Por que um componente re-renderiza: mudou estado, mudou prop, o pai renderizou, mudou contexto.
11. `useMemo` e `useCallback`: o que resolvem, a identidade da função entre renders, e por que quase todo `useMemo` que você quer escrever no começo é desnecessário.
12. `React.memo`: o que ele compara e por que ele não funciona quando a prop é objeto/função nova a cada render.
13. `key` instável como causa de lentidão e de perda de estado.
14. Lista grande: paginar, limitar, virtualizar — e o custo de cada saída.
15. Memoização também custa. **Medir depois, para provar que resolveu.**

#### Tema 12 — Estado global: Context

**O app ganha:** um `Provider` para o que é realmente global (tema, notificações/toast, ou a coleção de tarefas) — sem prop drilling e sem biblioteca.

**Tópicos de estudo sugeridos**

1. Prop drilling: o sintoma, e por que ele nem sempre é um problema.
2. Composição (`children`) como a solução mais barata para prop drilling — tentar isso **antes** do Context.
3. `createContext`, `Provider`, `useContext`: as três peças.
4. Tipar o contexto e o problema do valor padrão; o hook guardião que estoura se usado fora do Provider.
5. Onde o Provider entra na árvore e o que isso decide.
6. **O custo:** todo consumidor re-renderiza quando o valor do contexto muda — inclusive quem só usa uma parte dele. Agora você tem o Profiler do Tema 11 para ver isso acontecendo.
7. Valor de contexto recriado a cada render: o bug silencioso de performance e como evitar.
8. Separar contexto de **estado** e contexto de **dispatch**.
9. Context não é gerenciador de estado — é transporte. A diferença importa.
10. Estado de servidor × estado de cliente: o dado que veio da API não é a mesma coisa que "modal aberto".
11. Redux, Zustand, Jotai existem — que problema cada um resolve e por que nenhum entra aqui.
12. Critério final: quando o Context é resposta certa e quando é canhão em mosquito.

### Tema 13 — Testes de front · _dia sugerido 16/08_ · ✅ Feito (11/08)

**O app ganha:** suíte de testes de componente com Vitest + Testing Library e a API mockada por MSW — `npm test` verde vira condição de fechamento a partir daqui.

> **Tema solo — não mescla.** Estudo em [`studies/studie-t13-testes-de-front.md`](studies/studie-t13-testes-de-front.md). Depois de quatro mesclas seguidas, este fica sozinho de propósito: o T14 tem material próprio e **a suíte precisa existir antes do movimento**, para que o T14 seja cobrado por ela (é o que a regra do tópico 11 escreve com antecedência).
>
> **Três decisões tomadas na abertura, e a primeira foi minha por não haver material ainda para o Fillip decidir:** o ambiente é **jsdom** e não o Browser Mode do Vitest (rápido, é o que a Testing Library assume, e as três limitações dele — `window.confirm`, ausência de layout, ausência de `matchMedia` — viram conteúdo do tema em vez de surpresa); o escopo obrigatório é o **caminho crítico** e não "um teste por componente", pelo motivo que o tópico 13 já dava; e **MSW em vez de mock de `fetch`**, para que o `http.ts` (o `res.ok`, o `ApiError`, o ramo do `204`) rode de verdade dentro do teste.

> **Risco declarado:** deixar os testes para o penúltimo tema é o mesmo padrão do questionário que ficou pendente no Tema 4 da Etapa 2. O que segura até aqui é a regra 1 — todo trecho gerado precisa de prova de que funciona, registrada no devlog.

**Tópicos de estudo sugeridos**

1. O que muda ao testar interface: você testa **comportamento visível**, não implementação.
2. Vitest no front: `jsdom`, `setupFiles`, `globals` — o que o ambiente de navegador simulado é e o que ele não é.
3. Testing Library: `render`, `screen`, e a filosofia "consulte como o usuário consulta".
4. Prioridade de queries: `getByRole` primeiro, `getByLabelText` para formulário, `getByTestId` por último e com culpa. **O HTML semântico do Tema 3 é o que faz isso funcionar.**
5. `getBy` × `queryBy` × `findBy`: o que cada um faz quando o elemento não está lá.
6. `user-event` × `fireEvent`: por que o primeiro é mais parecido com gente de verdade.
7. Testar assíncrono sem `sleep`: `findBy` e `waitFor`.
8. **MSW:** interceptar a requisição na borda da rede em vez de mockar `fetch`. Handlers de sucesso, de erro e de lentidão.
9. Testar os quatro estados de tela do Tema 7 — inclusive o de erro, que é o que ninguém testa.
10. Testar formulário de ponta a ponta: digitar, enviar, ver a mensagem.
11. Testar componente que anima: o que fazer com o tempo e por que a animação não pode ser condição para o teste passar. Nada anima ainda — a regra nasce aqui e é cobrada no Tema 14.
12. Testar custom hook isoladamente — quando vale e quando é melhor testar pelo componente.
13. O que **não** testar no front: cor, classe de CSS, ordem de chamada interna, biblioteca de terceiro.
14. Cobertura no front: por que o número mente mais aqui do que no back.
15. A pirâmide vista do front: componente × integração × e2e (Playwright existe — fica anotado, não entra agora).

### Tema 14 — Motion e interação · _dia sugerido 17/08_ · ✅ Feito (11/08)

**O app ganha:** movimento — item que entra e sai da lista com transição, troca de rota animada, resposta tátil no clique e no arrasto. É o tema que traduz "segurar carrega, soltar arremessa" para vocabulário React.

> **Por que só agora:** animação precisa de material. Item entrando e saindo veio no Tema 8, troca de rota veio no Tema 9. Antes disso seria enfeite sem comportamento. E, por ser o último, ele herda duas exigências: a regra 7 — o que fecha vai para o ar, e o bundle é medido de novo contra a linha de base do Tema 10 — e a suíte do Tema 13, que precisa continuar verde depois do movimento.

> **Tema solo — não mescla.** Estudo em [`studies/studie-t14-motion-e-interacao.md`](studies/studie-t14-motion-e-interacao.md). É o último da etapa: depois dele vem o simulado de entrevista (regra 8) e a avaliação, então não sobra tema para pagar dívida deixada aqui.
>
> **Cinco decisões tomadas na abertura, e só a primeira foi sua** (as outras não tinham material para você decidir ainda): **Motion** (o ex-Framer Motion) e não GSAP, pelos dois problemas difíceis do tema serem recurso de primeira classe nela — `AnimatePresence` para a saída do elemento já desmontado (tópico 5) e `layout` para a troca de coluna (tópico 8); o **gesto de arrastar é para apagar e não para reordenar**, porque a `Task` da API congelada **não tem campo de ordem** e uma ordem que some no F5 é o item de reprova "o estado da UI mente sobre o que está no banco"; `prefers-reduced-motion` respeitado **globalmente** por `MotionConfig`, não caso a caso; **a mesma chave desliga o movimento nos testes** (stub de `matchMedia` no `setup.ts` — é a terceira saída que o T13 tópico 11 escreveu antes de existir animação); e os **tokens de movimento nascem em `src/utils/motion.ts`** e não no CSS, porque quem lê duração e curva agora é JavaScript — é a promessa do T3 tópico 3 cumprida no formato que a migração para Tailwind deixou.
>
> **A pendência do T13 foi paga antes da abertura (11/08):** o teste do formulário com **400 do servidor** foi escrito, a suíte foi de 24 para **25**, e ele achou um bug que doze temas de verificação manual não viram — o `aria-live` do erro do servidor **nunca chega ao DOM**, porque o `Typography` não repassa props e atributo JSX com hífen é isento de checagem de tipo. Registrado nas Limitações do `web/README.md`, com endereço no Bloco 2 deste tema.

**Tópicos de estudo sugeridos**

1. `transition` no CSS: propriedade, duração, `delay` e o que a curva (`ease`, `cubic-bezier`) comunica. Duração e curva saem dos tokens do Tema 3, não do chute.
2. `transform` e `opacity` animam de graça; `top`, `left`, `width`, `height` e `box-shadow` travam. **O porquê:** compositor × layout × paint.
3. `@keyframes` e `animation`: quando ela é a resposta e a `transition` não é.
4. Medir: aba Performance do DevTools, o que é uma queda de frame, e por que "parece suave" não é medição.
5. Animar o que **não** existe mais: o problema de animar a saída de um elemento que o React já desmontou — a razão de existir de uma lib de motion.
6. **Escolher a lib e registrar no `web/README.md`: Framer Motion ou GSAP.** Framer Motion é React-nativo, declarativo, entrada/saída resolvida; GSAP é mais poderoso, agnóstico de framework, timeline de verdade. Vaga de produto React puxa para o primeiro; trabalho de agência criativa puxa para o segundo.
7. Entrada e saída de item da lista (`AnimatePresence` ou equivalente) — e por que a `key` do Tema 2 decide se isso funciona.
8. Animação de layout: o item que muda de posição quando a lista é filtrada ou reordenada.
9. Transição entre rotas, ligada ao Tema 9.
10. Gesto: arrastar para reordenar ou para apagar, com `pointerdown`/`pointermove`/`pointerup`. `mousedown` × `pointerdown` e por que o segundo cobre o dedo.
11. Interação com fases (pressionar → carregar → soltar → travar): modelar como **máquina de estados**, não como pilha de booleanos — a mesma lição do "estado impossível" do Tema 4, agora com o `useReducer` do Tema 11 na mão.
12. Feedback tátil sem animação: `:active`, `transform: scale` no clique, e por que 100ms de resposta valem mais que 600ms de firula.
13. `prefers-reduced-motion`: gente que passa mal com movimento. Como respeitar sem matar a interface.
14. Onde a animação atrapalha: carregando que dança, erro que desliza devagar demais para ser lido, lista que anima a cada tecla digitada.
15. Medir de novo depois de tudo pronto — animação é a primeira coisa a derrubar o frame rate no celular.

---

## Avaliação

**Entregáveis:** front no ar em URL pública · `web/README.md` como contrato completo, com link e GIF no topo · `npm test` verde no último push · a API local rodando junto para a demonstração.

**Demonstração:** com a `api/` de pé, o CRUD inteiro na tela — criar, listar, filtrar, editar, apagar — com a URL refletindo o que está sendo visto e o movimento respondendo a cada ação.

**Prova prática — eu quebro o seu front:**

- derrubo a API no meio da sessão: a tela não pode ficar branca nem girar para sempre;
- abro o **link público** sem API nenhuma: tem que aparecer algo honesto, não um erro solto;
- devolvo 400 do servidor: o erro tem que chegar no campo certo;
- lista vazia e primeiro acesso: não pode ser tela em branco sem explicação;
- título de 5.000 caracteres e emoji: layout não pode arrebentar;
- duplo clique no botão de salvar: não pode criar duas tarefas;
- apago a tarefa por fora (pelo `psql`) e você tenta editar: o 404 precisa virar mensagem, não erro no console;
- recarrego a página numa rota interna: tem que abrir;
- ligo `prefers-reduced-motion`: a interface continua usável;
- crio e apago cinco tarefas seguidas com a aba Performance aberta: a animação não pode derrubar o frame rate;
- navego só pelo teclado: dá para criar e apagar uma tarefa sem mouse.

**Oral — uma pergunta por tema.** Esta lista é também o roteiro do **simulado de entrevista** que roda logo antes da avaliação (regra 8), com prioridade para o que estiver marcado com ⚠️ no devlog: por que JSX e o que ele vira · o que `key` resolve de verdade · por que você escolheu esse sistema de estilo · o que é estado derivado e por que ele não vira estado · controlado × não controlado · quando **não** usar `useEffect` · o que é CORS e por que o servidor não apanha · atualização otimista e o rollback · por que a URL é estado · o que o build revelou sobre o tamanho do seu bundle · o que você mediu antes de memoizar · o custo do Context · por que `getByRole` vem antes de `getByTestId` · por que `transform` anima e `top` trava.

**Reprova se:** a tela fica branca em erro de rede · o link público está quebrado ou desatualizado · o estado da UI mente sobre o que está no banco · você usou um trecho gerado pela IA que não sabe explicar linha a linha · você não sabe defender uma decisão que você tomou.

---

## Quando o back-end voltar

Fica registrado aqui para não se perder, e vira a emenda entre as duas etapas: retomar a Etapa 2 do **Tema 5 (Testes a fundo)** e seguir até o Tema 10.

> **Duas dívidas do front esperam esse dia**, e as duas por escolha: o **aviso de demonstração duplicado** no modo vitrine (a `TasksPage` mostra o card fixo e o `main` mostra o mesmo `ErrorTasks` no erro — dois `role="alert"` iguais), que **desaparece sozinho** quando `VITE_API_URL` apontar para a URL pública e o modo vitrine desligar; e o **`ApiError.fieldErrors` sem cliente**, esperando a API ganhar erro por campo. Consertar o primeiro agora seria remendar um caminho que vai deixar de existir. Ao chegar no **Tema 8 (auth)**, o front ganha tela de login/cadastro, guarda de rota (desenhada no Tema 9 desta etapa) e envio de token; ao chegar no **Tema 9 (deploy)**, `VITE_API_URL` aponta para a URL pública, o front é reconstruído e o aviso de "API local" some do README. Só então o sistema está completo de ponta a ponta — e é esse conjunto que a Etapa 4 (capstone) refaz sabendo o que faz.
