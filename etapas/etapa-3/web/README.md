# web — Do 0 ao Emprego

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

Nenhuma. O app é uma tela só (`HomePage`) montada direto no `App`. React Router entra no Tema 9.

## Stack

React 19.2.7 · TypeScript 6.0.2 · Vite 8.1.1 · Tailwind CSS 4.3.3 · lucide-react 1.28. Fonte da verdade é o `package.json`.

## Estrutura

| Pasta         | O que mora                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------- |
| `api/`        | `http` (o `request` genérico e o `ApiError`) e `tasks` (as quatro funções do domínio)        |
| `assets/`     | Imagens a serem utilizadas no app                                                            |
| `components/` | Componentes reutilizáveis, sem domínio: `Card`, `Button`, `Typography`, `TaskField`          |
| `layout/`     | Layouts genéricos usados em mais de uma página ou estado: `header/`                          |
| `pages/`      | `home/` onde ficam as páginas do app; `home/content/` guarda os componentes de tarefa        |
| `types/`      | Tipos do TypeScript: `Task`, `Status`, `TaskForm`, `FieldErrors`, `NewTask`, `TaskPatch`     |
| `utils/`      | `taskRules` (transição e validação), `classNames`                                            |

O corte de `api/` é o mesmo de `components/` × `pages/`: **`http.ts` não sabe o que é uma tarefa** e `tasks.ts` não sabe o que é um `Response`. Nenhum `fetch` mora dentro de componente.

## Decisões

**Tailwind** Usar tailwind para estilização do app. Mais rápido de visualizar as alterações de estilização, não precisa ficar viajando entre arquivos.

**Começou em CSS Modules e migrou para Tailwind — de propósito.** O app foi todo estilizado em CSS Modules primeiro e depois migrado, para resolver os mesmos problemas duas vezes e poder comparar em vez de escolher por indicação.

**Sem biblioteca de classe condicional.** `utils/classNames` junta as classes à mão. `clsx` (filtrar valor falso, aceitar objeto) e `tailwind-merge` (resolver utilitário em conflito) resolvem problemas reais e entram quando aparecerem — hoje todas as listas de classe são fixas.

**O `localStorage` foi substituído pela API (T7), não abandonado.** Duas fontes da verdade seria o pior dos mundos: o storage abriria a tela com dado velho e a requisição substituiria depois — a tela mostraria tarefas que talvez não existam mais, e o estado de **erro nunca apareceria de verdade**, porque sempre haveria algo pintado por baixo. Os quatro estados só são honestos sem rede de segurança. O preço assumido: o app não funciona sem a API de pé, e a dívida tem endereço (T10, tópico 7). O código antigo (`utils/taskStorage`, ler por inicializador e gravar por efeito) está no histórico do commit e no `studie-t05-t06`.

**A tela atualiza com a resposta da escrita, não com refetch.** `POST` e `PATCH` da API devolvem a entidade inteira (`RETURNING`), então dá para colocar a resposta no array sem uma segunda viagem; o `DELETE` só remove do array. Refetch acontece uma vez, na abertura da tela (e no "Tentar de novo"). O gatilho para mudar de ideia está escrito: no dia em que houver mais de um cliente escrevendo, isso vira refetch ou invalidação.

**Otimista só onde o servidor não decide nada.** Ciclar status pinta antes de confirmar e desfaz no `catch` — o clique tem que responder na hora, e o T14 vai animar essa troca de coluna. Criar, editar título e apagar são **pessimistas**: o `POST` depende do `id` do banco, e `id` que muda no meio do caminho quebra a `key` e, com ela, a animação de saída do T14. Otimista não abre mão da verdade — mostra uma aposta com plano de desfazer.

**"Salvando" é por item, não global.** Um `Set` de `pendingIds` no `Content`; a linha que grava é aquela. Um booleano único travaria os botões das outras tarefas enquanto uma é apagada. Foi essa guarda que resolveu um bug real: dois cliques rápidos em "Alterar" liam a mesma fotografia do estado, mandavam o mesmo `PATCH` e avançavam a tela duas vezes — tela em `done`, banco em `doing`, sem erro nenhum.

**`window.confirm` antes de apagar, com a limitação assumida.** É feio, bloqueia a aba e não é estilizável, mas é uma linha e não inventa infraestrutura. O modal acessível (foco preso, `Esc`, foco devolvido) e o "desfazer" ficam para quando houver um `Modal` em `components/` — e o desfazer honesto custa caro, porque o `DELETE` da API é destrutivo e a tarefa voltaria com **id novo**.

**O botão "Alterar" cicla o status: `todo → doing → done → todo`.** As alternativas eram um `<select>` de status (mais explícito, mas antecipa o formulário do Tema 5) e um botão único de "marcar como feita" (mais simples, mas sem caminho de volta). O ciclo foi escolhido porque o botão **sempre faz algo** — não existe estado em que ele fique clicável e morto — e porque fechar o ciclo em `todo` dá como desfazer um clique errado sem precisar de tela de edição.

## Limitações

- **O app não funciona sem a API local de pé.** Dívida deliberada, criada ao matar o `localStorage`; endereço para pagar: T10, tópico 7.
- **A tela é uma fotografia, não uma sincronia.** O que muda no banco por fora (outra aba, `psql`, outra pessoa) não chega até aqui. O app só descobre a divergência **quando tenta escrever** e leva `404` — aí tira o item da tela e avisa. Para tarefa criada por fora, não há defesa. As curas (revalidar ao focar a aba, polling, tempo real) são de temas seguintes.
- **A resposta da API é afirmada, não validada.** `res.json() as Task[]` não prova nada em runtime — se a API mudar e o tipo não, ninguém reclama. É a terceira aparição da mesma fronteira (`queryDb<T>` no back, `JSON.parse` no storage); o remédio é validação de schema (Zod) e continua anotado como dívida.
- **O erro de validação do servidor não cai no campo.** A API devolve um erro só, com `field: 'task'`, para qualquer dado inválido — não um erro por campo. Então o `400` vira mensagem de formulário, e a validação por campo continua sendo a do cliente. O `ApiError.fieldErrors` está escrito e **sem cliente**, esperando a API ganhar erro por campo na retomada da Etapa 2.
- **O rollback do otimista restaura a lista inteira.** Se algo mudar na lista enquanto o `PATCH` está em voo, o desfazer leva essa mudança junto. Aceitável com um usuário e lista pequena; o correto seria reverter só aquele item.
- Sem rotas, testes ou deploy.
- Só o título é editável depois de criada — status muda pelo botão, e o prazo não muda.
- A edição na linha rejeita título vazio **sem avisar**; só o formulário de criar mostra mensagem.
