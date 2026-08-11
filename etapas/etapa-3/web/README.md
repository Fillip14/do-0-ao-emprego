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
- **Apagar** tarefa pelo botão no canto do item
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
```

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

**Linha de base do bundle (T10, contra a qual o T14 será medido):** `index.js` 248,29 kB (79,84 kB gzip) + `TaskDetailPage.js` 1,65 kB (0,76 gzip) + CSS 11,59 kB (3,23 gzip). O mapa do bundle sai em `dist/stats.html` (`rollup-plugin-visualizer`).

**Lighthouse na URL pública:** Performance 100 · Acessibilidade 100 · Boas práticas 96 · SEO 91 — medido em 11/08/2026, antes do `robots.txt` e do corte da requisição condenada.

## Stack

React 19.2.7 · TypeScript 6.0.2 · Vite 8.1.1 · Tailwind CSS 4.3.3 · lucide-react 1.28 · react-router-dom 7.18.2. Fonte da verdade é o `package.json`.

## Estrutura

| Pasta         | O que mora                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------- |
| `api/`        | `http` (o `request` genérico e o `ApiError`) e `tasks` (as quatro funções do domínio)        |
| `assets/`     | Imagens a serem utilizadas no app                                                            |
| `components/` | Componentes reutilizáveis, sem domínio: `Card`, `Button`, `Typography`, `TaskField`          |
| `layout/`     | `AppLayout` (casca de todas as rotas) e `header/`                                             |
| `pages/`      | Uma pasta por rota: `tasks/`, `taskDetail/`, `notFound/`                                      |
| `routes/`     | `RequireAuth` — o guarda de rota, desenhado agora e ativado quando a API tiver auth           |
| `types/`      | Tipos do TypeScript: `Task`, `Status`, `TaskForm`, `FieldErrors`, `NewTask`, `TaskPatch`     |
| `utils/`      | `taskRules` (transição e validação), `classNames`, `validationId` (uuid), `environment` (vitrine) |

O corte de `api/` é o mesmo de `components/` × `pages/`: **`http.ts` não sabe o que é uma tarefa** e `tasks.ts` não sabe o que é um `Response`. Nenhum `fetch` mora dentro de componente.

## Decisões

**Tailwind** Usar tailwind para estilização do app. Mais rápido de visualizar as alterações de estilização, não precisa ficar viajando entre arquivos.

**Começou em CSS Modules e migrou para Tailwind — de propósito.** O app foi todo estilizado em CSS Modules primeiro e depois migrado, para resolver os mesmos problemas duas vezes e poder comparar em vez de escolher por indicação.

**Sem biblioteca de classe condicional.** `utils/classNames` junta as classes à mão. `clsx` (filtrar valor falso, aceitar objeto) e `tailwind-merge` (resolver utilitário em conflito) resolvem problemas reais e entram quando aparecerem — hoje todas as listas de classe são fixas.

**O `localStorage` foi substituído pela API (T7), não abandonado.** Duas fontes da verdade seria o pior dos mundos: o storage abriria a tela com dado velho e a requisição substituiria depois — a tela mostraria tarefas que talvez não existam mais, e o estado de **erro nunca apareceria de verdade**, porque sempre haveria algo pintado por baixo. Os quatro estados só são honestos sem rede de segurança. O preço assumido: o app não funciona sem a API de pé, e a dívida tem endereço (T10, tópico 7). O código antigo (`utils/taskStorage`, ler por inicializador e gravar por efeito) está no histórico do commit e no `studie-t05-t06`.

**A tela atualiza com a resposta da escrita, não com refetch.** `POST` e `PATCH` da API devolvem a entidade inteira (`RETURNING`), então dá para colocar a resposta no array sem uma segunda viagem; o `DELETE` só remove do array. Refetch acontece uma vez, na abertura da tela (e no "Tentar de novo"). O gatilho para mudar de ideia está escrito: no dia em que houver mais de um cliente escrevendo, isso vira refetch ou invalidação.

**Otimista só onde o servidor não decide nada.** Ciclar status pinta antes de confirmar e desfaz no `catch` — o clique tem que responder na hora, e o T14 vai animar essa troca de coluna. Criar, editar título e apagar são **pessimistas**: o `POST` depende do `id` do banco, e `id` que muda no meio do caminho quebra a `key` e, com ela, a animação de saída do T14. Otimista não abre mão da verdade — mostra uma aposta com plano de desfazer.

**"Salvando" é por item, não global.** Um `Set` de `pendingIds` na `TasksPage`; a linha que grava é aquela. Um booleano único travaria os botões das outras tarefas enquanto uma é apagada. Foi essa guarda que resolveu um bug real: dois cliques rápidos em "Alterar" liam a mesma fotografia do estado, mandavam o mesmo `PATCH` e avançavam a tela duas vezes — tela em `done`, banco em `doing`, sem erro nenhum.

**`window.confirm` antes de apagar, com a limitação assumida.** É feio, bloqueia a aba e não é estilizável, mas é uma linha e não inventa infraestrutura. O modal acessível (foco preso, `Esc`, foco devolvido) e o "desfazer" ficam para quando houver um `Modal` em `components/` — e o desfazer honesto custa caro, porque o `DELETE` da API é destrutivo e a tarefa voltaria com **id novo**.

**O botão "Alterar" cicla o status: `todo → doing → done → todo`.** As alternativas eram um `<select>` de status (mais explícito, mas antecipa o formulário do Tema 5) e um botão único de "marcar como feita" (mais simples, mas sem caminho de volta). O ciclo foi escolhido porque o botão **sempre faz algo** — não existe estado em que ele fique clicável e morto — e porque fechar o ciclo em `todo` dá como desfazer um clique errado sem precisar de tela de edição.

**Import de `react-router`, não de `react-router-dom`.** Na v7 os dois pacotes são o mesmo código: `react-router-dom` virou reexport e só continua publicado para não quebrar projetos da v6. O instalado é o `-dom` (é ele que traz o outro), mas todo import do projeto aponta para `react-router`, que é o que a documentação da v7 usa. Misturar os dois faria uma busca no editor achar metade dos resultados.

**Guarda de rota com `Outlet`, não com `children`.** `RequireAuth` é uma rota-pai sem `path`: tudo que estiver aninhado dentro dela é protegido de uma vez, e uma rota nova no bloco já nasce protegida. A forma `<ProtectedRoute><Page /></ProtectedRoute>` é explícita rota a rota e seria melhor para uma rota solta no meio de rotas públicas. **Nenhuma das duas é segurança** — qualquer pessoa muda a condição no DevTools. Quem protege é o middleware da API; o guarda do front evita mostrar uma tela que vai quebrar em 401.

**A URL é estado: busca e filtro em query string.** `q` e `status` vivem no `useSearchParams`, nunca em `useState` — duas fontes da verdade seria o mesmo erro do `localStorage`. A lista filtrada é **derivada** na renderização. Escrever na URL usa `replace: true`, senão cada tecla digitada empilharia uma entrada no histórico; parâmetro vazio é removido, para não acumular `?q=&status=`. O ganho: `/tasks?q=x&status=doing` é um link que abre a mesma tela em qualquer aba.

**`lazy` só na `TaskDetailPage`.** O ganho medido foi de 1,3 kB — quase nada, porque o que ela compartilha com a lista (React, roteador, componentes de UI, camada de API) continua no bundle principal. O mecanismo é que importa: no dia em que uma rota arrastar uma dependência exclusiva e pesada, o corte é de centenas de kB. O `Suspense` fica em volta do `<Outlet />`, e não no topo do app, para que o `Header` não pisque a cada navegação.

**Fallback de SPA por rewrite, com o custo declarado.** `vercel.json` manda qualquer caminho para o `index.html`; sem isso, F5 em `/tasks/:id` dá 404 da Vercel, porque esse caminho não existe como arquivo. O preço: o servidor responde **200 para tudo**, inclusive para URLs inexistentes — a `NotFoundPage` aparece na tela com status de sucesso. É o preço de uma SPA; SSR (Next, Remix) é o que devolve 404 de verdade. Efeito colateral já sentido: `/robots.txt` recebia o HTML do app até o arquivo passar a existir em `public/`, porque arquivo real é servido antes do rewrite.

**No link público, mensagem honesta — sem dados de demonstração e sem "Tentar de novo".** `utils/environment` detecta, no build, produção apontando para `localhost` e liga o modo vitrine: o app **nem tenta** a requisição condenada (console limpo, sem espera de timeout) e explica que a API roda localmente. Dado de demonstração foi recusado por ser a segunda fonte da verdade que o T7 acabou de enterrar; o botão de repetir foi recusado por prometer o que não pode cumprir.

## Limitações

- **O app não funciona sem a API local de pé.** Dívida deliberada, criada ao matar o `localStorage`; endereço para pagar: T10, tópico 7.
- **A tela é uma fotografia, não uma sincronia.** O que muda no banco por fora (outra aba, `psql`, outra pessoa) não chega até aqui. O app só descobre a divergência **quando tenta escrever** e leva `404` — aí tira o item da tela e avisa. Para tarefa criada por fora, não há defesa. As curas (revalidar ao focar a aba, polling, tempo real) são de temas seguintes.
- **A resposta da API é afirmada, não validada.** `res.json() as Task[]` não prova nada em runtime — se a API mudar e o tipo não, ninguém reclama. É a terceira aparição da mesma fronteira (`queryDb<T>` no back, `JSON.parse` no storage); o remédio é validação de schema (Zod) e continua anotado como dívida.
- **O erro de validação do servidor não cai no campo.** A API devolve um erro só, com `field: 'task'`, para qualquer dado inválido — não um erro por campo. Então o `400` vira mensagem de formulário, e a validação por campo continua sendo a do cliente. O `ApiError.fieldErrors` está escrito e **sem cliente**, esperando a API ganhar erro por campo na retomada da Etapa 2.
- **O rollback do otimista restaura a lista inteira.** Se algo mudar na lista enquanto o `PATCH` está em voo, o desfazer leva essa mudança junto. Aceitável com um usuário e lista pequena; o correto seria reverter só aquele item.
- **O link público não alcança a API local — nem na sua própria máquina.** A `api/` libera no CORS apenas `http://localhost:5173`, então a resposta é descartada pelo navegador (o servidor responde 200; quem bloqueia é o cliente). E, mesmo com o CORS liberado, `localhost:3000` significa "o computador de quem abriu o link" — para qualquer outra pessoa não há API nenhuma ali. A cura é a API ter URL pública: Tema 9 da Etapa 2. Até lá o link é vitrine.
- **`VITE_API_URL` é decidida no build, não em runtime.** Trocar a URL da API exige rebuild e redeploy — não basta mudar a variável no painel.
- Sem testes. Testes de front são o Tema 13; até lá a verificação é manual, pelas provas registradas no devlog.
- Só o título é editável depois de criada — status muda pelo botão, e o prazo não muda.
- A edição na linha rejeita título vazio **sem avisar**; só o formulário de criar mostra mensagem.
