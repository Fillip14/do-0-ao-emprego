# web — Do 0 ao Emprego

**No ar: https://do-0-ao-emprego.vercel.app**

> **Leia antes de clicar.** O link abre o front, mas **a lista de tarefas não carrega lá** — a API deste projeto roda localmente e ainda não foi publicada (é o Tema 9 da Etapa 2). O app detecta isso no build e mostra uma mensagem de demonstração em vez de um erro técnico. Para ver o CRUD funcionando é preciso rodar os dois localmente, como descrito em [Como rodar](#como-rodar).

Front-end do gerenciador de tarefas: SPA em React + TypeScript que consome a [API da Etapa 2](../../etapa-2/api/README.md). Este README é o contrato do front.

## O que faz hoje

Quadro de tarefas em três colunas por status — concluídas, em andamento e a fazer — **falando com a API de verdade**:

- **Criar** tarefa por um formulário no rodapé: título, status e prazo. O rodapé começa como um campo rápido de título e **expande ao receber foco**, revelando status e prazo; fecha ao enviar
- **Validação no cliente:** título vazio não cria tarefa e mostra a mensagem no próprio campo, amarrada por `aria-describedby`; o que foi digitado é preservado
- **Editar o título na linha:** clicar no título troca por um campo; **Enter** salva, **Esc** cancela
- **Alterar** o status pelo botão da tarefa, em ciclo `todo → doing → done → todo`; a tarefa troca de coluna na hora
- **Apagar** tarefa pelo botão no canto do item — ou **arrastando o item para a direita** (o botão continua lá: gesto é atalho, não substituto)
- **O app se move:** a tarefa entra e sai da lista com transição, **viaja** de uma coluna para a outra ao mudar de status em vez de teletransportar, a troca de rota é costurada, e o clique responde na hora. Quem liga `prefers-reduced-motion` no sistema continua vendo tudo acontecer, sem deslocamento
- Coluna sem tarefa mostra mensagem própria em vez de espaço branco
- Estado vazio próprio quando não existe nenhuma tarefa — e é o primeiro acesso de todo mundo
- **Buscar por título e filtrar por status**, com os dois na query string (`/tasks?q=comprar&status=doing`) — a tela cabe num link
- **Abrir uma tarefa** em `/tasks/:id`, com página própria e exclusão de lá de dentro
- **404 do front** para qualquer URL desconhecida, dentro do mesmo layout
- Layout responsivo para mobile e desktop

**Os quatro estados de tela**, todos com estilo: `LoadingTasks` enquanto busca, `ErrorTasks` (com "Tentar de novo") quando falha, `EmptyTasks` quando o servidor responde uma lista vazia, e a lista quando há dado. "Vazio" é um caso de **sucesso**, não um estado à parte.

**As tarefas vivem no Postgres.** O `localStorage` foi **substituído** no Tema 7: a API é a fonte única da verdade, o `id` vem do banco, e o app não funciona sem a API de pé. O que está na tela é uma **cópia** do banco, tirada quando a tela abriu.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b --noEmit
npm test           # vitest run — a suíte inteira, uma vez
npm run test:watch # vitest em modo observador
```

**O teste não precisa de API nem de banco.** É a única verificação do projeto que roda com um terminal só: o MSW responde no lugar do servidor.

O `-b` é obrigatório: o `tsconfig.json` da raiz é _solution-style_, e sem ele o `tsc` lê zero arquivo e sai limpo sempre.

**A API precisa estar rodando.** Três processos: `sudo service postgresql start`, `npm run dev` na `api/` (porta 3000) e `npm run dev` aqui (porta 5173). A porta 5173 não é opcional — é a origem liberada no CORS da `api/`.

**Variáveis de ambiente**

| Chave          | Para que serve                   | Exemplo                 |
| -------------- | -------------------------------- | ----------------------- |
| `VITE_API_URL` | URL base da API que o front chama | `http://localhost:3000` |

Copie o `.env.example` para `.env.local` (que fica fora do git) e preencha. Só o que começa com `VITE_` chega ao código do cliente, e o valor é **injetado no build** — ou seja, é público, aparece no bundle, e trocá-lo exige rebuild. Segredo nenhum entra aqui.

## Rotas

| Rota         | Página            | Observação                                                        |
| ------------ | ----------------- | ----------------------------------------------------------------- |
| `/`          | —                 | Redireciona para `/tasks` com `replace`                            |
| `/tasks`     | `TasksPage`       | Quadro; aceita `?q=` e `?status=`                                  |
| `/tasks/:id` | `TaskDetailPage`  | `:id` validado como uuid antes de qualquer requisição; carregada com `lazy` |
| `*`          | `NotFoundPage`    | 404 do front, dentro do layout                                     |

Todas ficam dentro do `AppLayout` (`Header` + `<Outlet />`), que não desmonta ao navegar. As duas de tarefas ficam também dentro do `RequireAuth`, hoje chumbado em `true`.

## Build e deploy

Hospedado na **Vercel**, com **Root Directory `etapas/etapa-3/web`** e deploy automático a cada push na `main`. O que sobe é a pasta `dist/`.

```bash
npm run build      # tsc -b && vite build
npm run preview    # serve o dist/, que é o que a Vercel serve
```

**O bundle, medido três vezes (T14).** A linha de base do T10 (248,29 / 79,84) estava velha na hora de usar: o build imediatamente antes de instalar o Motion deu **250,36 kB (80,43 gzip)**, e os +2,07 kB são o `useTasks`, o reducer e o Context do T11–T13.

| | Baseline | Motion direto | Com `LazyMotion` |
| --- | --- | --- | --- |
| Caminho crítico (gzip) | 80,43 | 121,53 | **96,42** |
| Chunk assíncrono | — | — | 27,66 |
| **Total baixado** | 80,43 | 121,53 | **124,08** |

**O `LazyMotion` não economizou bytes — piorou o total em 2,55 kB**, que é o preço de dividir. O que ele fez foi tirar **25,11 kB gzip do caminho crítico**: a lib chega num chunk que não bloqueia a primeira tela, e o custo da animação no primeiro carregamento cai de +51% para +20% sobre a base. O mapa do bundle sai em `dist/stats.html` (`rollup-plugin-visualizer`).

**Quadros:** `preview` com **CPU 4× slowdown**, criando e apagando cinco tarefas seguidas — **nenhum quadro perdido**. É consequência de só animar `transform` e `opacity`, que ficam no compositor; o dia em que alguma animação tocar `width`, `height` ou `box-shadow`, a medição precisa ser refeita.

**Lighthouse na URL pública:** Performance 100 · Acessibilidade 100 · Boas práticas 96 · SEO 91 — medido em 11/08/2026, antes do `robots.txt` e do corte da requisição condenada.

## Stack

React 19.2.7 · TypeScript 6.0.2 · Vite 8.1.1 · Tailwind CSS 4.3.3 · lucide-react 1.28 · react-router-dom 7.18.2 · motion 13.1.0. Fonte da verdade é o `package.json`.

## Estrutura

| Pasta         | O que mora                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------- |
| `api/`        | `http` (o `request` genérico e o `ApiError`) e `tasks` (as quatro funções do domínio)        |
| `assets/`     | Imagens a serem utilizadas no app                                                            |
| `components/` | Componentes reutilizáveis, sem domínio: `Card`, `Button`, `Typography`, `TaskField`, `Toast` |
| `contexts/`   | `ToastContext` — o Provider do aviso global e os dois hooks guardiões                         |
| `hooks/`      | `useTasks` (efeito de busca, `pendingIds`, os verbos do CRUD) e `tasksReducer` (a função pura) |
| `layout/`     | `AppLayout` (casca de todas as rotas) e `header/`                                             |
| `pages/`      | Uma pasta por rota: `tasks/`, `taskDetail/`, `notFound/`                                      |
| `routes/`     | `RequireAuth` — o guarda de rota, desenhado agora e ativado quando a API tiver auth           |
| `test/`       | Infraestrutura da suíte: `setup`, `server`/`handlers` do MSW, `renderWithProviders`, `columns` |
| `types/`      | Tipos do TypeScript: `Task`, `Status`, `TaskForm`, `FieldErrors`, `NewTask`, `TaskPatch`     |
| `utils/`      | `taskRules` (transição e validação), `classNames`, `validationId` (uuid), `environment` (vitrine), `motion` (tokens de duração e curva), `motionFeatures` (o alvo do `import()` do `LazyMotion`) |

O corte de `api/` é o mesmo de `components/` × `pages/`: **`http.ts` não sabe o que é uma tarefa** e `tasks.ts` não sabe o que é um `Response`. Nenhum `fetch` mora dentro de componente.

## Decisões

**Tailwind** Usar tailwind para estilização do app. Mais rápido de visualizar as alterações de estilização, não precisa ficar viajando entre arquivos.

**Começou em CSS Modules e migrou para Tailwind — de propósito.** O app foi todo estilizado em CSS Modules primeiro e depois migrado, para resolver os mesmos problemas duas vezes e poder comparar em vez de escolher por indicação.

**Sem biblioteca de classe condicional.** `utils/classNames` junta as classes à mão. `clsx` (filtrar valor falso, aceitar objeto) e `tailwind-merge` (resolver utilitário em conflito) resolvem problemas reais e entram quando aparecerem — hoje todas as listas de classe são fixas.

**O `localStorage` foi substituído pela API (T7), não abandonado.** Duas fontes da verdade seria o pior dos mundos: o storage abriria a tela com dado velho e a requisição substituiria depois — a tela mostraria tarefas que talvez não existam mais, e o estado de **erro nunca apareceria de verdade**, porque sempre haveria algo pintado por baixo. Os quatro estados só são honestos sem rede de segurança. O preço assumido: o app não funciona sem a API de pé, e a dívida tem endereço (T10, tópico 7). O código antigo (`utils/taskStorage`, ler por inicializador e gravar por efeito) está no histórico do commit e no `studie-t05-t06`.

**A tela atualiza com a resposta da escrita, não com refetch.** `POST` e `PATCH` da API devolvem a entidade inteira (`RETURNING`), então dá para colocar a resposta no array sem uma segunda viagem; o `DELETE` só remove do array. Refetch acontece uma vez, na abertura da tela (e no "Tentar de novo"). O gatilho para mudar de ideia está escrito: no dia em que houver mais de um cliente escrevendo, isso vira refetch ou invalidação.

**Otimista só onde o servidor não decide nada.** Ciclar status pinta antes de confirmar e desfaz no `catch` — o clique tem que responder na hora, e o T14 vai animar essa troca de coluna. Criar, editar título e apagar são **pessimistas**: o `POST` depende do `id` do banco, e `id` que muda no meio do caminho quebra a `key` e, com ela, a animação de saída do T14. Otimista não abre mão da verdade — mostra uma aposta com plano de desfazer.

**A lista de tarefas mora num custom hook, não em Context.** `useTasks` tem o `useReducer`, o efeito de busca com `AbortController`, o `pendingIds` e os cinco verbos; a `TasksPage` só decide o que pintar e não conhece `ApiError`, `api/tasks` nem `nextStatus`. O que **não** subiu: `editingId`, que é estado de interface — sobreviveria a uma troca de API sem mudar uma linha. E o motivo de a lista **não** entrar em Context é a distinção que decide tudo neste tema: ela é **estado de servidor**, uma cópia do que está no Postgres. Estado de servidor fica velho, precisa de invalidação e de cache — pôr isso num Provider é escrever à mão, e mal, o que o TanStack Query faz. O aviso é o oposto: nasce no cliente, morre no cliente, ninguém revalida. A régua, em uma pergunta: _se eu recarregar a página, esse dado precisa voltar?_

**Aviso global em dois contextos, não um.** `ToastStateContext` (a mensagem) e `ToastActionsContext` (`show`/`dismiss`) são separados porque as frequências de mudança são opostas: as ações nunca mudam, a mensagem muda a cada aviso. Com um contexto só, toda página que apenas **dispara** um aviso re-renderizaria quando ele aparecesse. O `value` das ações passa por `useMemo` — objeto literal teria identidade nova a cada render e o React concluiria "mudou" mesmo com os campos idênticos. Os hooks guardiões estouram com o nome do Provider que faltou, em vez de devolver um objeto falso que engole a chamada em silêncio.

**O Provider mora no `AppLayout`, não na raiz.** É o menor nó que cobre as duas páginas que disparam aviso, e a posição decide **quem re-renderiza**: o `Header` fica de fora e não renderiza por causa de toast. Foi Context e não composição porque `TasksPage` e `TaskDetailPage` estão em **galhos diferentes** da árvore — nem são renderizadas por props, e sim pelo `<Outlet />`. Composição resolve profundidade; isto era distância lateral. O prop drilling que sobrou (`FilledTasks` repassando cinco props para `ItemTask`) **ficou de pé de propósito**: um andar é o fluxo de dados do React funcionando, e trocá-lo por Context esconderia a origem do dado para economizar duas linhas.

**Nenhuma memoização entrou no app, e isso foi decidido com número.** Profiler antes e depois da refatoração, nos mesmos três cenários: 5,5 / 3,2 / 6,2 ms antes, 2,8 / 4,4 / 3,5 ms depois. A leitura correta não é "melhorou 50%" — o segundo cenário **piorou**, o que denuncia ruído de medição (uma amostra, modo `dev`). E não havia como melhorar: a refatoração não tirou trabalho do React. Os seis estão bem abaixo dos **16 ms** de um quadro a 60fps, então não há o que otimizar neste tamanho de lista. Gatilho registrado: revisar se algum commit passar de 16 ms.

**"Salvando" é por item, não global.** Um `Set` de `pendingIds` no `useTasks`; a linha que grava é aquela. Um booleano único travaria os botões das outras tarefas enquanto uma é apagada. Foi essa guarda que resolveu um bug real: dois cliques rápidos em "Alterar" liam a mesma fotografia do estado, mandavam o mesmo `PATCH` e avançavam a tela duas vezes — tela em `done`, banco em `doing`, sem erro nenhum.

**`window.confirm` antes de apagar, com a limitação assumida.** É feio, bloqueia a aba e não é estilizável, mas é uma linha e não inventa infraestrutura. O modal acessível (foco preso, `Esc`, foco devolvido) e o "desfazer" ficam para quando houver um `Modal` em `components/` — e o desfazer honesto custa caro, porque o `DELETE` da API é destrutivo e a tarefa voltaria com **id novo**.

**O botão "Alterar" cicla o status: `todo → doing → done → todo`.** As alternativas eram um `<select>` de status (mais explícito, mas antecipa o formulário do Tema 5) e um botão único de "marcar como feita" (mais simples, mas sem caminho de volta). O ciclo foi escolhido porque o botão **sempre faz algo** — não existe estado em que ele fique clicável e morto — e porque fechar o ciclo em `todo` dá como desfazer um clique errado sem precisar de tela de edição.

**Import de `react-router`, não de `react-router-dom`.** Na v7 os dois pacotes são o mesmo código: `react-router-dom` virou reexport e só continua publicado para não quebrar projetos da v6. O instalado é o `-dom` (é ele que traz o outro), mas todo import do projeto aponta para `react-router`, que é o que a documentação da v7 usa. Misturar os dois faria uma busca no editor achar metade dos resultados.

**Guarda de rota com `Outlet`, não com `children`.** `RequireAuth` é uma rota-pai sem `path`: tudo que estiver aninhado dentro dela é protegido de uma vez, e uma rota nova no bloco já nasce protegida. A forma `<ProtectedRoute><Page /></ProtectedRoute>` é explícita rota a rota e seria melhor para uma rota solta no meio de rotas públicas. **Nenhuma das duas é segurança** — qualquer pessoa muda a condição no DevTools. Quem protege é o middleware da API; o guarda do front evita mostrar uma tela que vai quebrar em 401.

**A URL é estado: busca e filtro em query string.** `q` e `status` vivem no `useSearchParams`, nunca em `useState` — duas fontes da verdade seria o mesmo erro do `localStorage`. A lista filtrada é **derivada** na renderização. Escrever na URL usa `replace: true`, senão cada tecla digitada empilharia uma entrada no histórico; parâmetro vazio é removido, para não acumular `?q=&status=`. O ganho: `/tasks?q=x&status=doing` é um link que abre a mesma tela em qualquer aba.

**`lazy` só na `TaskDetailPage`.** O ganho medido foi de 1,3 kB — quase nada, porque o que ela compartilha com a lista (React, roteador, componentes de UI, camada de API) continua no bundle principal. O mecanismo é que importa: no dia em que uma rota arrastar uma dependência exclusiva e pesada, o corte é de centenas de kB. O `Suspense` fica em volta do `<Outlet />`, e não no topo do app, para que o `Header` não pisque a cada navegação.

**Fallback de SPA por rewrite, com o custo declarado.** `vercel.json` manda qualquer caminho para o `index.html`; sem isso, F5 em `/tasks/:id` dá 404 da Vercel, porque esse caminho não existe como arquivo. O preço: o servidor responde **200 para tudo**, inclusive para URLs inexistentes — a `NotFoundPage` aparece na tela com status de sucesso. É o preço de uma SPA; SSR (Next, Remix) é o que devolve 404 de verdade. Efeito colateral já sentido: `/robots.txt` recebia o HTML do app até o arquivo passar a existir em `public/`, porque arquivo real é servido antes do rewrite.

**No link público, mensagem honesta — sem dados de demonstração e sem "Tentar de novo".** `utils/environment` detecta, no build, produção apontando para `localhost` e liga o modo vitrine: o app **nem tenta** a requisição condenada (console limpo, sem espera de timeout) e explica que a API roda localmente. Dado de demonstração foi recusado por ser a segunda fonte da verdade que o T7 acabou de enterrar; o botão de repetir foi recusado por prometer o que não pode cumprir.

**Testes em jsdom, com MSW, no caminho crítico.** O ambiente é **jsdom** e não o Browser Mode do Vitest: instala um pacote, roda em segundos e é o que a documentação da Testing Library assume. O preço são três buracos, e o app esbarra nos três — `window.confirm` não existe (o teste de apagar precisa de `vi.spyOn`), não há layout (`getBoundingClientRect` é zero, e por isso **animação não se testa aqui**) e não há `matchMedia` (o `prefers-reduced-motion` do T14 vai precisar de stub). A rede é interceptada por **MSW** e não por `fetch` mockado, para o `http.ts` rodar de verdade dentro do teste — o `res.ok`, o `ApiError`, o ramo do `204`. O escopo é o **caminho crítico** (reducer, regras, os quatro estados, os fluxos de escrita), não um teste por componente: `Card` e `Typography` não têm o que quebrar, e testá-los custaria manutenção a cada troca de layout.

**A URL nos testes: `*/tasks` no handler e uma base falsa no ambiente.** São dois problemas diferentes. O handler precisa **casar** com o endereço pedido, e o wildcard resolve isso sem `.env.test`. Mas o `fetch` do Node exige URL absoluta, e sem `VITE_API_URL` o app pede `"undefined/tasks"` — que estoura no parse antes de o MSW ver a requisição. Daí o `test.env.VITE_API_URL` no `vite.config.ts`: `http://localhost:3000`, uma base para a URL ser parseável. Ninguém escuta nessa porta.

**`globals: false`, igual à `api/`.** `describe`/`it`/`expect` são importados de `'vitest'` em cada arquivo, e não injetados no escopo global. A consequência que custa tempo se não for sabida: a Testing Library registra o `cleanup` automático procurando um `afterEach` global que, assim, não existe — então o `cleanup()` é chamado à mão no `src/test/setup.ts`. Sem ele, o DOM de um teste sobra para o seguinte e as queries acham dois de cada coisa.

**Motion (ex-Framer Motion), não GSAP.** Os dois problemas difíceis do movimento deste app são recurso de primeira classe nela e código meu no GSAP: animar a **saída** de um elemento que o React já desmontou (`AnimatePresence`) e o item **mudando de posição** entre colunas (`layout`/`layoutId`, que é FLIP embutido). Ela também fala a língua que a etapa treinou — descrever o estado e deixar a lib reconciliar. **O gatilho para trocar de ideia:** coreografia com linha do tempo (abertura sincronizada, `scroll` costurado), onde a `timeline` do GSAP não tem equivalente. Nota de nome: o pacote é `motion` e o import é `motion/react`; `framer-motion` continua publicado como alias do mesmo código, e é o nome que a maioria dos tutoriais usa.

**`LazyMotion` com `import()`, e o ganho não é o que parece.** A lib sai do bundle principal e vira chunk assíncrono; `motion.*` vira `m.*` e o `strict` derruba quem esquecer. Isso **não reduz** o total baixado (aumenta em 2,55 kB), só tira 25 kB gzip do caminho crítico — os números estão em [Build e deploy](#build-e-deploy). O `features` é o `domMax` porque o app usa `drag` e `layout`, que não existem no `domAnimation`; um app só de entrada e saída cortaria bem mais.

**A entrada de item não usa opacidade — só `transform`.** Não é gosto: enquanto o estado inicial for invisível, existe uma janela em que o item **está no DOM e não pode ser visto**, e foi exatamente ali que um teste do T13 quebrou (`findByRole` resolve no quadro do `initial`). A saída pode usar opacidade porque ninguém afirma coisa alguma sobre um elemento que está indo embora.

**`layout` desligado enquanto há filtro ativo.** A busca escreve na URL a cada tecla e `layout` mede o DOM a cada render — com filtro ligado, cada caractere faria a lista inteira recalcular posição. A alternativa era _debounce_ na busca, recusada por mexer na escrita da URL (T9) para resolver um problema de animação. Sem filtro, `layout` fica ligado, que é quando ele informa: o item **viaja** entre colunas ao mudar de status.

**Arrastar apaga; reordenar não existe.** O gesto dispara por **distância ou velocidade** (`offset.x > 120` ou `velocity.x > 500`), para que um empurrão curto e rápido conte tanto quanto um arrasto longo. Reordenar por arrasto foi recusado pelo contrato, não pela dificuldade: a `Task` da API **não tem campo de ordem**, e uma ordem que some no F5 é a UI mentindo sobre o banco. As fases do gesto são um estado nomeado (`'idle' | 'dragging' | 'deleting'`), não três booleanos — três booleanos são oito combinações, cinco impossíveis.

**`prefers-reduced-motion` respeitado em dois lugares, porque são dois mundos.** `<MotionConfig reducedMotion="user">` cobre o que passa pela lib: desliga deslocamento e `layout`, e **mantém a opacidade**, para a mudança continuar sendo percebida. O bloco `@media (prefers-reduced-motion: reduce)` no `style.css` cobre o que é CSS puro (a transição do `Button`). Respeitar não é desligar tudo — quem pediu menos movimento ainda precisa entender o que aconteceu na tela.

**Nos testes, animação não existe — e não foi teste nenhum que mudou.** Três linhas de ambiente: stub de `matchMedia` (o jsdom não tem, e o Motion chama), `MotionGlobalConfig.skipAnimations = true`, e o `LazyMotion` com `domMax` **direto** no `renderWithProviders`, sem `import()`, porque em teste carregamento assíncrono só traria espera. O `MotionConfig` mora no `AppLayout` e não no `main.tsx` justamente porque o `renderWithProviders` espelha o `AppLayout`.

## Limitações

- **O app não funciona sem a API local de pé.** Dívida deliberada, criada ao matar o `localStorage`; endereço para pagar: T10, tópico 7.
- **A tela é uma fotografia, não uma sincronia.** O que muda no banco por fora (outra aba, `psql`, outra pessoa) não chega até aqui. O app só descobre a divergência **quando tenta escrever** e leva `404` — aí tira o item da tela e avisa. Para tarefa criada por fora, não há defesa. As curas (revalidar ao focar a aba, polling, tempo real) são de temas seguintes.
- **A resposta da API é afirmada, não validada.** `res.json() as Task[]` não prova nada em runtime — se a API mudar e o tipo não, ninguém reclama. É a terceira aparição da mesma fronteira (`queryDb<T>` no back, `JSON.parse` no storage); o remédio é validação de schema (Zod) e continua anotado como dívida.
- **O erro de validação do servidor não cai no campo.** A API devolve um erro só, com `field: 'task'`, para qualquer dado inválido — não um erro por campo. Então o `400` vira mensagem de formulário, e a validação por campo continua sendo a do cliente. O `ApiError.fieldErrors` está escrito e **sem cliente**, esperando a API ganhar erro por campo na retomada da Etapa 2.
- **O erro do servidor no formulário não é anunciado por leitor de tela.** O `InputTask` passa `aria-live="polite"` para o `Typography`, mas o `Typography` não repassa props — o atributo é descartado e nunca chega ao DOM. O TypeScript não reclama porque **atributo JSX com hífen é isento de checagem de prop excedente** (`ariaLive` teria dado erro; `aria-live` passa calado). Achado ao escrever o teste do 400 no T13, depois de doze temas de verificação manual não o verem. **O T14 era o endereço e não pagou:** o tema mexeu no `Toast`, não no rodapé do formulário. Continua em aberto, agora sem tema com endereço marcado.
- **No modo vitrine, o aviso de demonstração aparece duas vezes.** A `TasksPage` renderiza o card fixo e, quando a busca falha, o `main` renderiza **o mesmo** `ErrorTasks` — dois cards iguais, com dois `role="alert"`. Só acontece na janela em que `isShowcase` é `true` (build de produção apontando para `localhost`), e **desaparece sozinho** quando a API tiver URL pública e a variável apontar para ela: o modo vitrine desliga e o erro volta a ser o card normal. Fica para ser resolvido na retomada da Etapa 2, junto com o T9 de lá — consertar agora seria remendar um caminho que vai deixar de existir.
- **O rollback do otimista restaura a lista inteira.** Se algo mudar na lista enquanto o `PATCH` está em voo, o desfazer leva essa mudança junto. Aceitável com um usuário e lista pequena; o correto seria reverter só aquele item.
- **O link público não alcança a API local — nem na sua própria máquina.** A `api/` libera no CORS apenas `http://localhost:5173`, então a resposta é descartada pelo navegador (o servidor responde 200; quem bloqueia é o cliente). E, mesmo com o CORS liberado, `localhost:3000` significa "o computador de quem abriu o link" — para qualquer outra pessoa não há API nenhuma ali. A cura é a API ter URL pública: Tema 9 da Etapa 2. Até lá o link é vitrine.
- **`VITE_API_URL` é decidida no build, não em runtime.** Trocar a URL da API exige rebuild e redeploy — não basta mudar a variável no painel.
- **A suíte não prova que o front e a API concordam.** O handler do MSW é escrito por mim, com a minha crença sobre a API dentro dele — então **nenhum teste daqui jamais vai achar** a divergência de contrato do `field: 'task'` logo acima. O mesmo vale para CORS e para o fallback de SPA da Vercel. Quem pega isso é teste de ponta a ponta contra a API real (Playwright), anotado e fora do escopo por enquanto.
- **A suíte cobre o caminho crítico, não o app inteiro.** São **25 testes** em cinco arquivos: o `tasksReducer` e o `taskRules` puros, os quatro estados de tela, e os fluxos de escrita (criar, validar, duplo submit, 400 do servidor, ciclar status, rollback, apagar, 404 na escrita, editar na linha). Fora dela hoje: a `TaskDetailPage`, os filtros pela URL, o `AbortController` ao trocar de rota e o timer do `Toast`. Estão listados no Bloco 2 do `studie-t13`, não esquecidos.
- **Animação não é testável aqui.** jsdom não faz layout nem roda `transition`, então a suíte **não prova** que o movimento funciona — prova que ele não atrapalha. Nenhum dos 25 testes depende de a animação ter terminado, e o que garante isso é o ambiente (`skipAnimations`), não o texto dos testes. Quem verifica movimento é olho e a aba Performance.
- **O arrasto para apagar não pede confirmação.** O botão "X" passa por `window.confirm`; o gesto executa direto. Arrastar 120px é mais difícil de fazer sem querer que clicar, mas a assimetria está aqui declarada — a cura honesta é o "desfazer", que esbarra no `DELETE` destrutivo da API (a tarefa voltaria com id novo).
- Só o título é editável depois de criada — status muda pelo botão, e o prazo não muda.
- A edição na linha rejeita título vazio **sem avisar**; só o formulário de criar mostra mensagem.
