# Estudo — Hooks a fundo e Estado global (Temas 11 + 12)

> **Temas mesclados em 11/08.** O T11 (Hooks a fundo, custom hooks e performance) e o T12 (Estado global: Context) viraram um arquivo só. **Quarta mescla da etapa**, e o motivo continua sendo de conteúdo: o **T11 tópico 8** — _"custom hook compartilha lógica, não estado: dois componentes usando o mesmo hook têm dois estados separados"_ — **é o enunciado do problema que o T12 resolve**. O plano já escrevia isso com todas as letras naquele tópico: _"e a ponte para o Tema 12"_.
>
> Separá-los é extrair o `useTasks`, descobrir no fim do dia que ele não serve para compartilhar estado entre páginas, e passar a noite com um custom hook que a manhã seguinte vai reabrir. Na outra direção vale o mesmo: o **T12 tópico 6** (todo consumidor re-renderiza quando o contexto muda) **não tem como ser visto sem o Profiler do T11 tópico 9** — sem medição, o custo do Context é boato.
>
> Os tópicos mantêm a numeração do `plano.md` (**A1 = T11 1–15**, **A2 = T12 1–12**), porque é essa numeração que o simulado de entrevista da regra 8 usa. A **A3** é nova e só existe por causa da mescla. Continuam contando como **dois temas** para efeito de avaliação e de oral — duas perguntas, não uma.

> **O tema, em uma frase:** o app para de crescer por acumulação e passa a ter **arquitetura** — a lógica sai de dentro da tela, o estado passa a ter dono declarado, e pela primeira vez uma decisão de performance é tomada com um número na mão.

**Onde o app está antes deste tema.** A `TasksPage` tem 215 linhas e **cinco `useState`** (`state`, `editingId`, `reloadKey`, `pendingIds`, `notice`), um `useEffect` de busca, cinco handlers `async` e a filtragem derivada — tudo no mesmo arquivo. A `TaskDetailPage` tem a **sua própria** máquina de estado com a mesma forma (`loading | error | success`), o mesmo `AbortController`, o mesmo `catch` de três ramos e o seu próprio `deleting`. As duas páginas fazem a mesma coisa duas vezes, com código diferente. Nenhum custom hook existe: a pasta `hooks/` **não existe**. Nenhuma medição de re-render foi feita na etapa inteira — o único número medido até hoje é o do bundle (T10). E o `notice` ("Esta tarefa não existe mais", "Não foi possível salvar") **só existe na `TasksPage`**: o mesmo aviso, na página de detalhe, é dado de um jeito completamente diferente, misturado com o estado de tela.

**A mudança de eixo.** Até aqui a pergunta foi sempre _"o que o app faz?"_ — e a resposta foi crescendo dentro dos componentes. As duas perguntas deste tema são outras: **quem é dono de cada estado** e **quanto custa o que eu escrevi**. É a primeira vez que se mexe no app **sem que a tela mude**: se o usuário perceber alguma diferença visual ao fim do T11, algo saiu errado. Refatoração e otimização são exatamente isso — comportamento idêntico, estrutura melhor. E, no T12, a pergunta ganha uma terceira camada: **o que é global de verdade** e o que só parece.

---

# Parte A — Os tópicos

## A1 · Hooks a fundo, custom hooks e performance

### 1. As regras dos hooks — e o porquê delas

**O que é.** Duas regras, e uma explicação que faz as duas virarem uma só:

1. Hook só é chamado no **topo do componente** — nunca dentro de `if`, `for`, `while`, `try`, ou depois de um `return` antecipado.
2. Hook só é chamado de dentro de **componente** ou de **outro hook** — nunca de uma função comum.

**Para que serve.** O motivo é que o React **não sabe o nome do seu hook**. Ele guarda os hooks de um componente numa lista ligada e os identifica pela **ordem da chamada**: o primeiro `useState` é o slot 1, o segundo é o slot 2. Não há chave, não há etiqueta — há posição.

**Exemplo — por que a regra 1 não é frescura:**

```tsx
// ERRADO
const [title, setTitle] = useState('');
if (!validId) return <p>inválido</p>; //  ← sai antes
const [task, setTask] = useState(null); //  ← nem sempre é chamado
```

No render em que `validId` é falso, o React vê **um** hook; no seguinte, vê dois. O slot 2 do segundo render é comparado com o slot 2 que não existia — e o estado da tarefa aparece com o valor da busca dentro. O bug não estoura na linha errada: ele estoura em qualquer lugar, depois.

**A regra a decorar é a consequência:** o `return` antecipado vem **depois** de todos os hooks. A `TaskDetailPage` já obedece isso hoje sem que ninguém tivesse dito — os quatro `if` de saída estão embaixo do `useEffect`, e é por isso que ela funciona.

### 2. `useReducer` — quando o estado tem transições, não só valores

**O que é.** Uma alternativa ao `useState` para quando **a próxima versão do estado depende do que aconteceu**, não só do que você quer escrever. Três peças:

| Peça       | O que é                                                          |
| ---------- | ---------------------------------------------------------------- |
| `action`   | um objeto que descreve **o que aconteceu** (`{ type: 'loaded', tasks }`) |
| `reducer`  | uma função pura `(estado, action) => novoEstado` — fora do componente |
| `dispatch` | o que o componente chama: `dispatch({ type: 'loaded', tasks })`    |

**Para que serve.** A diferença com o `useState` não é estilo, é **onde mora a regra**. Com `useState`, cada handler sabe montar o próximo estado inteiro — e a regra fica espalhada por cinco handlers. Com `useReducer`, os handlers só **contam o que aconteceu** e a regra mora num lugar só, que dá para ler de cima a baixo e testar sem renderizar nada.

Dois ganhos que aparecem imediatamente neste app: `dispatch` **é estável entre renders** (o React garante), então ele nunca suja o array de dependências nem invalida um `React.memo` — o problema que o tópico 11 vai descrever; e transições impossíveis (marcar como "salvando" uma tarefa que já sumiu) viram um caso que **não existe** no reducer, em vez de um `if` esquecido num handler.

**Exemplo — a forma que a lista deste app tem hoje, em `action`:**

```ts
type Action =
  | { type: 'loaded'; tasks: Task[] }
  | { type: 'failed'; message: string }
  | { type: 'created'; task: Task }
  | { type: 'updated'; task: Task }
  | { type: 'removed'; id: string };

function tasksReducer(state: TasksState, action: Action): TasksState {
  switch (action.type) {
    case 'loaded':
      return { status: 'success', tasks: action.tasks };
    case 'failed':
      return { status: 'error', message: action.message };
    case 'updated':
      if (state.status !== 'success') return state; // ← não existe "atualizar" fora do sucesso
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)),
      };
    // ...
  }
}
```

Repare no `case 'updated'`: aquela guarda é hoje a função `updateTasks` da `TasksPage`, repetida por dentro de cada handler. No reducer ela existe **uma vez**.

**Quando `useState` continua sendo a resposta certa:** valor solto sem transição — `isOpen` do formulário, `deleting` do detalhe. `useReducer` para isso é cerimônia.

**A dívida que este tópico herdou, e o que foi feito com ela.** O T5 tópico 11 deixou o sintoma escrito de propósito: _"neste tema você **não** troca por `useReducer` — escreve o sintoma no devlog para o T11 encontrar"_, e o sintoma era o **`InputTask`** com cinco `useState` (`form`, `isOpen`, `errors`, `formError`, `isSubmitting`). O T11 encontrou. A escolha da abertura foi levar o reducer para a **lista** e mandar o formulário para o Bloco 2 — não porque o formulário não sirva, mas porque a lista é a mesma refatoração do `useTasks` (um arquivo, uma passada) e tem a transição mais interessante: ela envolve o servidor, o otimista e o rollback. O formulário continua sendo um exercício legítimo, agora opcional e com o material já mapeado.

### 3. Carregando/erro/dado como união discriminada

**O que é.** O padrão que o app já usa desde o T7, agora com nome e com o porquê:

```ts
type TasksState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; tasks: Task[] };
```

**Para que serve.** A alternativa que quase todo mundo escreve primeiro é `isLoading`, `error`, `tasks` — três estados soltos, **oito combinações**, das quais quatro são mentira: carregando **e** com erro, pronto **sem** dado, erro **com** dado. A união discriminada não deixa a mentira ser escrita: não existe `message` no ramo de sucesso, e o TypeScript **estreita** o tipo dentro de cada `if`.

É a mesma lição do `Record<Status, Status>` do T4 e das discriminated unions do T3 da Etapa 2 — terceira aparição, agora estruturando a tela inteira.

**O que este tema acrescenta:** a `TaskDetailPage` tem a **mesma** união escrita de novo, com um campo `id` a mais para descartar resposta de rota antiga. Duas cópias do mesmo desenho é o sinal de que ele quer virar um tipo compartilhado — e é o que o custom hook do tópico 7 vai fazer.

### 4. `useRef` para valor mutável que não dispara render

**O que é.** `useRef(inicial)` devolve um objeto `{ current }` que **sobrevive aos renders** e cujo `.current` você pode alterar à vontade. Trocar `.current` **não re-renderiza nada**.

**Para que serve.** É a caixa para o que o componente precisa **lembrar** mas não precisa **mostrar**: o id do `setTimeout` para poder cancelar, o `AbortController` da requisição em voo, o valor anterior de uma prop, se o componente já montou uma vez.

O critério de escolha entre `useState` e `useRef` é uma pergunta só: **isso aparece na tela?** Se aparece, é estado. Se não aparece, é ref — usar estado aqui é pedir um render que não pinta nada diferente.

**Exemplo — o caso que este app tem:**

```ts
const timerRef = useRef<number | null>(null);

const showNotice = (message: string) => {
  setNotice(message);
  if (timerRef.current) clearTimeout(timerRef.current); // ← cancela o anterior
  timerRef.current = window.setTimeout(() => setNotice(null), 4000);
};
```

Sem a ref, dois avisos seguidos deixam dois timers correndo e o segundo aviso some antes da hora. Com `useState` para guardar o id, cada aviso causaria um render a mais e o timer entraria nas dependências de algum efeito — trabalho para nada.

**A armadilha:** ler `ref.current` **durante o render** é bug, porque a mudança não avisou ninguém e a tela pode estar mostrando um valor velho. Ref se lê e se escreve em handler e em efeito.

### 5. `useRef` para nó do DOM

**O que é.** A mesma ferramenta, outro uso: `ref={inputRef}` num elemento JSX faz o React colocar o nó do DOM em `inputRef.current` depois de montar (e `null` ao desmontar).

**Para que serve.** É a válvula de escape para o que o React não descreve: **foco, scroll e medição**. Não existe jeito declarativo de dizer "este input está focado" — foco é uma ação, não um atributo.

**Exemplo — a dívida do T3 tópico 9, que na verdade já estava paga.** Ao abrir o tema, descobriu-se que o `EditTitleField` já tinha `autoFocus`: o campo abria com foco desde o T5. O que **não** existia era o `select()` — o cursor ficava no fim do texto, e trocar o título inteiro exigia apagar letra por letra. É esse o ganho real da ref aqui, e a diferença entre os dois é o ponto: `autoFocus` é atributo, seleção é ação sobre o nó.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
  inputRef.current?.select(); // texto inteiro selecionado, dá para sobrescrever direto
}, []);
```

O `?.` não é decoração: entre o render e o efeito o nó pode não existir, e no desmonte ele vira `null`.

**A ponte para o T14:** o tópico 5 do plano diz "e o elemento que a animação precisa medir". Animar a saída de um item exige saber **onde ele estava** (`getBoundingClientRect`), e isso só se lê do nó de verdade — via ref, num `useLayoutEffect` (T6 tópico 11).

### 6. `useId` para acessibilidade em componente reutilizado

**O que é.** Um hook que devolve um identificador **único e estável** por instância de componente — `useId()` → `«r1»`. Não serve para `key` de lista; serve para amarrar `label`/`input`/`aria-describedby`.

**Para que serve.** O problema é concreto e está no código deste app. O `TaskField` recebe um `id` por prop e monta `id={\`task-${id}\`}`:

```tsx
<TaskField id="title" label="Tarefa" ... />   // vira id="task-title"
```

Enquanto existir **um** formulário na tela, funciona. No dia em que houver dois (o rodapé e um modal de edição, por exemplo), existem **dois elementos com `id="task-title"`** — e um `id` duplicado quebra o `htmlFor`: clicar no label do segundo campo foca o primeiro. O leitor de tela lê errado, e o `getByLabelText` do T13 acha o elemento errado sem reclamar.

**Exemplo — a cura, dentro do próprio componente:**

```tsx
export const TaskField = ({ label, value, error, onChange }: TaskFieldProps) => {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={error ? errorId : undefined} ... />
      {error && <p id={errorId} role="alert">{error}</p>}
    </>
  );
};
```

O ganho colateral é de API: a prop `id` **some** da assinatura. Quem usa o componente para de ter a obrigação de inventar um identificador único no projeto inteiro — uma decisão a menos, e uma decisão que só dá para errar.

### 7. Custom hook — o que é, e o que este app extrai

**O que é.** Uma função que **começa com `use`** e chama outros hooks. Não há API nova, não há registro, não há herança: é composição de função. O prefixo `use` é o que o linter usa para cobrar as regras do tópico 1 dentro dela.

**Para que serve.** Separar **o que a tela faz** de **como o dado é obtido**. Hoje a `TasksPage` é as duas coisas: ela decide o que pintar e ela sabe que existe uma API, um `AbortController`, um `ApiError` de status 404 e um `Set` de ids pendentes. Componente que sabe disso tudo é componente difícil de ler, e — o que importa mais no T13 — difícil de testar.

**Exemplo — a assinatura do `useTasks`, que é a decisão do tema:**

```ts
export function useTasks() {
  const [state, dispatch] = useReducer(tasksReducer, { status: 'loading' });
  // busca, AbortController, pendingIds, tradução de erro… tudo aqui dentro

  return {
    state, // { status: 'loading' | 'error' | 'success', … }
    pendingIds,
    reload,
    addTask,
    editTitle,
    cycleStatus,
    removeTask,
  };
}
```

E a `TasksPage` que sobra:

```tsx
const { state, pendingIds, reload, addTask, cycleStatus, removeTask } = useTasks();
```

**O critério do que expõe e do que esconde** é a parte que vale a pena pensar antes de escrever: **expõe** o que a tela precisa para decidir o que pintar (o estado) e o que o usuário pode fazer (os verbos). **Esconde** tudo que é meio: `AbortController`, `reloadKey`, a instância de `ApiError`, a forma da resposta. Se a `TasksPage` continuar importando `ApiError`, a extração não terminou — ficou uma função com o estado do lado de fora.

**O que não sobe para o hook:** `editingId`. Ele é estado de **interface** ("qual linha está com o campo aberto"), não de dado — sobreviveria a uma troca de API sem mudar uma linha. Fica na página. Essa distinção é o T12 tópico 10 chegando com uma semana de antecedência.

### 8. Custom hook compartilha lógica, não estado

**O que é.** O ponto que mais confunde, e o mais importante do tema. Dois componentes que chamam `useTasks()` **não conversam**: cada chamada cria o seu próprio `useReducer`, o seu próprio efeito, a sua própria requisição. O hook é uma **receita**, não um lugar.

**Para que serve.** É a fronteira entre este tema e o próximo, e a diferença entre entender e decorar. O teste mental: se a `TasksPage` e um contador no `Header` chamassem `useTasks()`, seriam **duas** requisições `GET /tasks` e **dois** arrays — e apagar uma tarefa na lista deixaria o contador do cabeçalho mentindo, sem erro nenhum no console.

**Exemplo:**

```tsx
function Header() {
  const { state } = useTasks(); // ← 2ª requisição, 2º estado
  ...
}
function TasksPage() {
  const { state } = useTasks(); // ← 1ª requisição, 1º estado
  ...
}
```

A prova de que são separados é a aba Network: **duas** chamadas ao abrir a página.

**As três saídas, e é o A2 que vai escolher:** subir o estado para o pai comum e passar por props (funciona, e vira prop drilling se a árvore for funda); **Context** (o A2 inteiro); ou uma biblioteca de estado de servidor com cache compartilhado (TanStack Query — o T7 tópico 12 já deixou o nome anotado). Saber que o custom hook **não** é uma dessas saídas é o que impede a próxima frase errada de aparecer numa entrevista.

### 9. React DevTools Profiler — medir antes de otimizar

**O que é.** A aba **Profiler** do React DevTools: aperta gravar, usa o app, para de gravar. Ela mostra cada _commit_, quais componentes renderizaram, quanto tempo cada um levou e — no painel lateral — **por que** cada um renderizou.

**Para que serve.** É a regra do tema, e ela vem antes de qualquer `useMemo`: **sem medição, memoização é superstição.** Nas configurações do Profiler existe a opção _"Record why each component rendered"_ — é ela que transforma "acho que está re-renderizando à toa" em uma frase verificável.

**Exemplo — o roteiro de medição deste app, na ordem:**

1. `npm run build && npm run preview` (T10 tópico 1: medir em `dev` não vale nada — o modo de desenvolvimento é mais lento de propósito). Para o Profiler, que precisa das ferramentas de desenvolvimento, vale medir em `dev` **comparando dev com dev**, nunca dev com produção.
2. Gravar: digitar uma letra na busca; ciclar o status de uma tarefa; apagar uma tarefa.
3. Anotar **quantos componentes renderizam por tecla digitada** e o tempo do commit.
4. Só então decidir se há o que otimizar — e escrever o número no devlog.

**A honestidade que o tema exige:** este app tem poucas tarefas e o resultado provável é _"3 ms, não há nada para otimizar"_. **Esse resultado é um sucesso do tema, não um fracasso.** A habilidade treinada é medir e concluir — inclusive concluir que não se faz nada.

### 10. Por que um componente re-renderiza

**O que é.** Quatro causas, e só quatro:

| Causa                 | Detalhe                                                            |
| --------------------- | ------------------------------------------------------------------ |
| O estado dele mudou   | `setX` com valor **diferente** (o React compara por `Object.is`)    |
| Uma prop dele mudou   | mudou de verdade ou mudou de **identidade** (objeto/função novos)   |
| **O pai renderizou**  | por padrão, o filho renderiza junto — mesmo sem prop nenhuma mudar  |
| Um contexto que ele consome mudou | o assunto do A2 tópico 6                               |

**Para que serve.** A terceira linha é a que corrige a intuição errada, e ela já apareceu no devlog do T1 como o primeiro **⚠️** da etapa: _"eu achava que o React só re-renderiza quem mudou; é o contrário"_. Este tema é onde essa frase deixa de ser anotação e vira medição.

E vale a segunda metade daquela anotação: **re-render não é repintar.** O React executa a função do componente, compara o resultado com o anterior e só toca no DOM no que diferiu. Render é barato; DOM é caro. É por isso que a maior parte dos re-renders "extras" **não custa nada** — e por que otimizá-los sem medir costuma piorar o código sem melhorar o app.

### 11. `useMemo` e `useCallback`

**O que é.** Dois hooks que guardam um resultado entre renders enquanto as dependências não mudarem:

- `useMemo(() => calcular(a, b), [a, b])` — guarda o **valor**.
- `useCallback(fn, [deps])` — guarda a **função** (é `useMemo(() => fn, deps)` com açúcar).

**Para que serve.** O ponto que quase todo mundo erra: **eles não existem para deixar o cálculo mais rápido.** Existem para preservar a **identidade** — o fato de que, entre dois renders, é o *mesmo* objeto/função. Identidade importa em exatamente três lugares: dependência de `useEffect`, prop de componente embrulhado em `React.memo`, e valor de Context (A2 tópico 7).

**Exemplo — o caso deste app, e ele é real:**

```tsx
// Sem useCallback: cycleStatus é uma função NOVA a cada render do useTasks
const cycleStatus = useCallback(async (id: string) => { ... }, []);
```

Se `FilledTasks` virar `React.memo` e receber `onChangeTask={cycleStatus}`, sem o `useCallback` o `memo` **nunca** funciona — a prop muda de identidade em todo render, e a comparação sempre dá "diferente". O `memo` fica ali, custando uma comparação por render, sem evitar um único trabalho. É o tópico 12.

**A regra prática:** `useMemo`/`useCallback` **primeiro têm que ter um motivo nomeado**. "Deixei aqui porque não custa nada" é falso — cada um custa uma alocação, uma comparação de dependências e uma linha a mais para ler. Escrevê-los antes do Profiler é otimizar o que não foi medido, e o plano diz isso no tópico 11 com todas as letras: _"quase todo `useMemo` que você quer escrever no começo é desnecessário"_.

**Nota de versão (React 19).** Existe o **React Compiler**, que insere essa memoização automaticamente na build. Ele muda o veredito prático — não a habilidade cobrada: você precisa saber **o que ele faria e por quê**, senão não dá para diagnosticar o dia em que ele não fizer. Conferir o estado dele antes de adotar, e não adotar dentro deste tema: o tema é o problema, não a terceirização dele.

### 12. `React.memo`

**O que é.** Um embrulho: `React.memo(Componente)` faz o React **pular** o render do componente quando as props forem as mesmas. A comparação é **rasa** (`Object.is` prop a prop) — ele não olha dentro de objetos.

**Para que serve.** Cortar a terceira causa do tópico 10 (o pai renderizou) numa subárvore cara. E entender por que ele falha na maioria das vezes: basta **uma** prop ser objeto ou função criada no corpo do pai para a comparação dar sempre "diferente".

**Exemplo — o que quebra e o que salva:**

```tsx
// quebra o memo:
<FilledTasks tasks={visibleTasks} onDeleteTask={(id) => handleDeleteTask(id)} />
//            ↑ array novo do filter    ↑ arrow function nova a cada render

// salva:
<FilledTasks tasks={visibleTasks} onDeleteTask={handleDeleteTask} />
//                                              ↑ referência estável (useCallback ou dispatch)
```

O `visibleTasks` deste app é **um array novo em todo render** — é o resultado de um `.filter()`. Ou seja: embrulhar `FilledTasks` em `memo` hoje **não pularia um único render**, e é exatamente o tipo de otimização que parece feita e não é. Para funcionar, o `visibleTasks` precisaria de `useMemo`, e aí são dois hooks para pular um render que o Profiler ainda nem provou ser caro. Este é o exercício do tema: **chegar até aqui e decidir com o número.**

### 13. `key` instável — lentidão e perda de estado

**O que é.** A `key` é a identidade do item entre dois renders. Se ela muda, o React entende que aquele item **é outro**: desmonta o antigo e monta um novo do zero.

**Para que serve.** As duas consequências são de gravidade diferente, e a segunda é a perigosa:

- **Custo:** desmontar e montar é muito mais caro que atualizar.
- **Perda de estado:** o estado interno do componente antigo **morre**. O input de edição na linha fecha sozinho, o foco vai para o `body`, o texto digitado some.

**Exemplo — as três `key` erradas:**

```tsx
{tasks.map((task, i) => <ItemTask key={i} … />)}              // índice: apagar o 1º renumera todos
{tasks.map((task) => <ItemTask key={Math.random()} … />)}     // nova a cada render: remonta tudo, sempre
{tasks.map((task) => <ItemTask key={`${task.id}-${task.status}`} … />)}  // muda quando o item muda
```

A terceira é a mais traiçoeira porque **parece** cuidadosa. Neste app ela seria fatal: ciclar o status é justamente o que a `key` não pode notar — o item tem que **atravessar** a mudança, senão a animação de saída/entrada do T14 nunca dispara (ela precisa do mesmo elemento mudando, não de um elemento morrendo). O app usa `key={task.id}` desde o T2, e o T2 tópico 6 já tinha registrado o porquê. Aqui só se descobre o preço de ter errado.

### 14. Lista grande: paginar, limitar, virtualizar

**O que é.** Três saídas para quando "renderizar todos os itens" deixa de ser viável, com custos diferentes:

| Saída           | O que faz                                              | Custo                                           |
| --------------- | ------------------------------------------------------ | ----------------------------------------------- |
| **Paginar**     | o servidor manda um pedaço por vez                      | precisa de `?limit`/`?offset` na **API**        |
| **Limitar**     | mostra os N primeiros e um "ver mais"                   | trivial; a busca só enxerga o que foi baixado   |
| **Virtualizar** | renderiza só o que cabe na tela e simula o resto        | biblioteca, altura conhecida, e briga com animação e com Ctrl+F |

**Para que serve.** Reconhecer o limite antes de bater nele, e saber que **a resposta certa quase sempre está do lado do servidor**. Neste app a saída correta é **paginar** — e ela está bloqueada: a `api/` está **congelada**, e paginação foi explicitamente mandada para o `ideias-depois.md` (plano, seção "O estado do back-end nesta etapa"). O `GET /tasks` traz tudo.

**Exemplo.** A conclusão honesta deste tópico é um parágrafo no devlog, não código: com uma lista de dezenas de itens, virtualizar seria adicionar uma dependência, perder a animação do T14 e o Ctrl+F do navegador para resolver um problema que o app não tem. O que fica registrado é o **gatilho**: no dia em que a lista passar de algumas centenas de itens, a ordem é paginar na API primeiro, virtualizar por último.

### 15. Memoização também custa — medir depois

**O que é.** O fechamento do A1, e a régua que o T10 instalou: **medir antes, mexer, medir depois, comparar.** Sem a segunda medição, não há prova de que a mudança resolveu — só a sensação de ter trabalhado.

**Para que serve.** Todo `useMemo`, `useCallback` e `React.memo` cobra três coisas: memória (o valor guardado não é liberado), uma comparação de dependências em todo render, e **legibilidade** — cada um é uma linha a mais entre o leitor e a lógica. Quando o ganho é zero, os três custos continuam de pé.

**Exemplo — o que vai para o devlog no fim do tema, com números de verdade:**

```
Antes:  digitar 1 letra na busca → 14 componentes renderizam, commit de 4,2 ms
Depois: (nenhuma memoização adicionada — nada a otimizar neste tamanho de lista)
Gatilho registrado: revisar se o commit passar de 16 ms (1 frame a 60fps)
```

**16 ms é a régua**: é o orçamento de um quadro a 60fps, e é o mesmo número que o T14 vai perseguir na aba Performance. Abaixo disso, otimizar é procurar problema; acima, há problema de verdade e ele tem nome.

---

## A2 · Estado global: Context

### 1. Prop drilling — o sintoma, e quando ele não é problema

**O que é.** Passar uma prop por componentes que **não a usam**, só para entregá-la lá embaixo. Cada andar intermediário ganha uma prop na assinatura, um nome para manter e um motivo para ser alterado quando o de baixo mudar.

**Para que serve.** Reconhecer a diferença entre **incômodo** e **defeito**. Prop drilling de um ou dois andares é o fluxo de dados do React funcionando: explícito, rastreável, e você lê a assinatura e sabe de onde veio o dado. O plano diz "e por que ele nem sempre é um problema" de propósito — trocar duas props por um Context é piorar.

**Exemplo — o app já viveu isso e já resolveu uma vez.** No T5, seis props atravessavam três andares até o item; a refatoração que matou o `ListTasks` apagou **um andar inteiro** e foi registrada no devlog como "a melhor coisa do dia". Note o que resolveu: **não foi Context** — foi apagar o intermediário. É o tópico 2.

Hoje o que sobra é modesto: `FilledTasks` recebe `editingId`, `onEditingChange`, `onEditTask`, `onChangeTask`, `onDeleteTask` e repassa **tudo** para `ItemTask`. Dois andares, e o do meio não usa quase nada.

### 2. Composição (`children`) — a solução mais barata, e a de tentar primeiro

**O que é.** Em vez de passar dado **através** de um componente, passar o JSX **pronto** para ele. O intermediário recebe `children` e não sabe o que está carregando.

**Para que serve.** É a saída que resolve a maior parte do prop drilling **sem** introduzir uma peça nova, e ela precisa ser tentada antes do Context — senão o Context vira martelo e todo estado vira prego.

**Exemplo:**

```tsx
// antes: Card precisa saber de tudo para poder repassar
<Card tasks={t} editingId={e} onEdit={…} onDelete={…} />

// depois: Card só desenha a moldura
<Card title="A fazer">
  {todo.map((task) => (
    <ItemTask key={task.id} task={task} onDelete={handleDeleteTask} />
  ))}
</Card>
```

O dado nem passa pelo `Card` — ele é criado onde já existe e entregue montado. O `Card` volta a ser o que o T3 dizia que ele é: componente de UI que **não sabe o que é uma tarefa**.

**O limite da composição:** ela resolve profundidade, não **distância lateral**. Um aviso disparado na `TaskDetailPage` e mostrado no `AppLayout` não é um problema de andar — os dois estão em galhos diferentes da árvore. É aí que o Context deixa de ser exagero.

### 3. `createContext`, `Provider`, `useContext`

**O que é.** Três peças, e nenhuma delas é um gerenciador de estado:

| Peça             | Papel                                                              |
| ---------------- | ------------------------------------------------------------------ |
| `createContext`  | cria o **canal** (e o valor padrão, para quem não tiver Provider)   |
| `<Ctx.Provider value={…}>` | injeta um valor para **toda a subárvore** abaixo dele     |
| `useContext(Ctx)`| lê o valor do Provider **mais próximo** acima na árvore             |

**Para que serve.** Entregar um valor a qualquer profundidade **sem** atravessar os intermediários. O React sobe a árvore procurando o Provider mais próximo — é a mesma ideia de escopo que o CSS tem com herança (base-css) e que o JS tem com closure (Etapa 1).

**Exemplo — o esqueleto, em três arquivos:**

```tsx
// 1. o canal
const ToastContext = createContext<ToastValue | null>(null);

// 2. o Provider (componente próprio, com o estado dentro)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  return <ToastContext.Provider value={{ message, show, dismiss }}>{children}</ToastContext.Provider>;
}

// 3. o consumo
const { show } = useToast();
```

**Nota de versão (React 19):** dá para renderizar `<ToastContext>` direto como Provider, sem o `.Provider`. As duas formas funcionam; escolher uma e não misturar, pelo mesmo motivo do `react-router` × `react-router-dom` registrado no `web/README.md`.

### 4. Tipar o contexto, e o hook guardião

**O que é.** O problema aparece no primeiro `createContext`: qual é o valor padrão? Ele é usado quando alguém chama `useContext` **fora** de qualquer Provider — e, para um toast, não existe padrão que faça sentido.

**Para que serve.** As duas saídas ruins são conhecidas: inventar um objeto falso (`{ show: () => {} }`, que **engole** a chamada em silêncio — o pior tipo de bug) ou tipar como `| undefined` e obrigar todo consumidor a checar. A saída boa é `null` como padrão + um **hook guardião** que estoura uma vez, alto e claro, com o nome do que faltou.

**Exemplo:**

```ts
const ToastContext = createContext<ToastValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>');
  return ctx; // ← daqui para baixo, o tipo é ToastValue, sem null
}
```

Dois ganhos num só: o erro é **de desenvolvedor, na montagem**, não um `undefined` misterioso três telas depois; e o `if` faz o **narrowing** que tira o `null` do tipo para todo mundo que usa o hook. É a mesma lição de borda do `isUuid` do T9 e da validação de resposta do T7 — validar uma vez, na entrada, e trabalhar tipado depois.

### 5. Onde o Provider entra na árvore

**O que é.** A posição do Provider decide **duas** coisas ao mesmo tempo: quem enxerga o valor (só a subárvore abaixo) e **quem re-renderiza** quando ele muda (também só a subárvore abaixo).

**Para que serve.** É a decisão de desenho do tema, e ela tem uma regra: **o mais baixo que ainda cubra todos os consumidores.** Provider na raiz porque "é global" é o jeito mais fácil de fazer o app inteiro re-renderizar a cada aviso.

**Exemplo — as duas posições possíveis neste app:**

```tsx
// A) na raiz, em volta do BrowserRouter — cobre até o que não é rota
<ToastProvider><BrowserRouter>…</BrowserRouter></ToastProvider>

// B) no AppLayout, em volta do <Outlet /> — cobre as páginas, não o Header
<ToastProvider><Header /><main><Outlet /></main></ToastProvider>
```

**A decisão deste app é (B)**, o `AppLayout`: é onde o aviso vai ser **desenhado** (acima do `<Outlet />`, dentro do layout que não desmonta ao navegar), e é o menor nó que contém as duas páginas que disparam avisos. O `Header` fica de fora e não re-renderiza por causa de toast — o que também mostra, na prática, o que o tópico 6 vai cobrar.

### 6. O custo: todo consumidor re-renderiza

**O que é.** Quando o `value` do Provider muda, **todos** os componentes que chamam `useContext` daquele contexto re-renderizam. Todos, inclusive quem só usa uma parte do valor. E `React.memo` **não** protege: o contexto não chega por prop, chega por baixo.

**Para que serve.** É a razão de "estado global" não ser de graça, e o tema deu o Profiler (A1 tópico 9) uma semana antes justamente para isto poder ser **visto**, não acreditado.

**Exemplo — a medição obrigatória do tema:**

1. Profiler gravando, com _"why did this render"_ ligado.
2. Disparar um aviso (apagar uma tarefa que não existe mais, por exemplo).
3. Ler quem renderizou. O esperado: o `Toast`, e todo consumidor do contexto. O sinal de alarme: componentes que **não** consomem nada aparecerem na lista — aí o problema não é o Context, é o `value` (tópico 7).

**O caso famoso, para ter na ponta da língua:** um contexto com `{ user, theme, cart }`. Mudar o carrinho re-renderiza quem só lia o tema. A cura é dividir em contextos por **frequência de mudança**, não por assunto — o que muda muito não anda junto com o que quase nunca muda.

### 7. O `value` recriado a cada render

**O que é.** O bug silencioso, e o mais comum de todos:

```tsx
<ToastContext.Provider value={{ message, show, dismiss }}>
//                             ↑ objeto NOVO em todo render do Provider
```

**Para que serve.** O objeto literal tem identidade nova a cada render. O React compara o `value` por `Object.is` — e conclui "mudou" **mesmo que os três campos sejam idênticos**. Resultado: todo consumidor re-renderiza a cada render do Provider, para nada. É o tópico 11 do A1 aparecendo no lugar em que ele **não** é otimização prematura — aqui a identidade é o mecanismo, não um detalhe.

**Exemplo — a cura, e a cura melhor:**

```tsx
// cura: memoizar o valor
const value = useMemo(() => ({ message, show, dismiss }), [message, show, dismiss]);

// cura melhor: as funções serem estáveis por construção
const show = useCallback((m: string) => setMessage(m), []);
const dismiss = useCallback(() => setMessage(null), []);
```

E a melhor de todas, quando dá: **`dispatch` do `useReducer` é estável por garantia do React** — não precisa de `useCallback` nenhum. É o A1 tópico 2 pagando dividendo aqui, e é o argumento do tópico 8.

### 8. Separar contexto de estado e contexto de dispatch

**O que é.** Dois contextos em vez de um: `ToastStateContext` (o que muda) e `ToastActionsContext` (as funções, que nunca mudam).

**Para que serve.** Porque os dois grupos têm **frequências de mudança opostas**, e o tópico 6 disse que é isso que decide a divisão. Quem só **dispara** um aviso (a `TasksPage`, a `TaskDetailPage`) não precisa re-renderizar quando o aviso muda — só quem **desenha** o aviso precisa. Com um contexto só, todo mundo renderiza junto.

**Exemplo:**

```tsx
<ToastActionsContext.Provider value={actions}>   {/* nunca muda */}
  <ToastStateContext.Provider value={message}>   {/* muda a cada aviso */}
    {children}
  </ToastStateContext.Provider>
</ToastActionsContext.Provider>
```

Com isso, `useToastActions()` é seguro de chamar em qualquer lugar: ele **não** assina mudança nenhuma. E o `Toast` — único a chamar `useToastState()` — é o único a renderizar quando um aviso aparece. É um padrão pequeno com um efeito grande, e é o tipo de coisa que se explica em quinze segundos numa entrevista **se** você tiver visto no Profiler.

### 9. Context não é gerenciador de estado — é transporte

**O que é.** A frase do plano, e ela é literal: `useContext` **não guarda nada**. Quem guarda é o `useState`/`useReducer` que você pôs dentro do componente Provider. O Context só evita a passagem por props.

**Para que serve.** Desfazer a confusão que faz gente escrever "usei Context em vez de Redux". Não são a mesma categoria: Redux (ou Zustand, ou Jotai) traz **loja, seleção granular, middleware, devtools de time-travel**; Context traz **um cano**. Comparar os dois é comparar o cano com a caixa d'água.

A consequência prática: tudo que o A1 ensinou continua valendo dentro do Provider. Estado imutável, atualização funcional, reducer para transição, cuidado com identidade. Context não substitui nada disso — ele só muda **quem enxerga**.

### 10. Estado de servidor × estado de cliente

**O que é.** Dois tipos de estado com naturezas diferentes, e é a distinção que decide o que entra no Context:

| | **Estado de servidor** | **Estado de cliente** |
| --- | --- | --- |
| Exemplos aqui | a lista de tarefas, a tarefa do detalhe | `notice`, `editingId`, `isOpen`, tema |
| Dono | o Postgres — o front tem uma **cópia** | o front, e só ele |
| Problemas | fica velho, precisa refetch/invalidação, cache, race | nenhum: some no F5 e tudo bem |

**Para que serve.** **É por isso que a coleção de tarefas não entra no Context deste app.** Botar estado de servidor num Provider parece resolver — e você acaba escrevendo, à mão e mal, um cache com invalidação: é literalmente o que o TanStack Query faz, e o T7 tópico 12 já mandou anotar o nome.

O `notice` é o oposto exato: nasce no cliente, morre no cliente, ninguém precisa revalidá-lo. **É o candidato certo** — e a razão de a decisão da abertura ter sido essa e não a outra.

E ela não é uma escolha nova: o `studie-t07-t08`, no tópico sobre "erro que aparece e some", já tinha escrito o endereço com o nome certo — _"o T12 (toast num Context) é o endereço definitivo; aqui é um estado no `Content`, com a dívida anotada"_. Este tema paga uma dívida que estava marcada há quatro dias, e o sintoma previsto lá — **"dois lugares diferentes mostrando a mesma mensagem"** — é exatamente o que a `TasksPage` e a `TaskDetailPage` fazem hoje.

**Exemplo — a régua, em uma pergunta:** _se eu recarregar a página, esse dado precisa voltar?_ Se sim, ele é do servidor e o problema é de cache. Se não, é do cliente e Context resolve.

### 11. Redux, Zustand, Jotai — o que cada um resolve

**O que é.** Três respostas para problemas que este app não tem, e vale saber **qual** problema, porque a pergunta cai em entrevista:

| Lib | A ideia | O problema que resolve |
| --- | --- | --- |
| **Redux (Toolkit)** | uma loja única, reducers, actions | app grande, muita gente, e a necessidade de **auditar** por que o estado mudou (devtools com histórico) |
| **Zustand** | uma loja fora do React, com **seletor** | o custo do tópico 6: com seletor, só re-renderiza quem lê **aquele pedaço** |
| **Jotai** | átomos pequenos e independentes | granularidade por construção — cada pedaço é sua própria unidade |

**Para que serve.** O padrão a enxergar: os três atacam a mesma limitação do Context — ele não tem **seleção**. Quem consome, consome tudo. Saber isso é o que transforma "não usei porque não precisei" numa resposta com conteúdo.

**E por que nenhum entra agora:** o app tem um estado de cliente global (o aviso), um usuário, e uma lista pequena. Instalar uma loja aqui seria colecionar dependência — a mesma régua do T10 tópico 2 ("dependência tem preço") e do `clsx` recusado no T3.

### 12. Critério final: quando o Context é a resposta

**O que é.** O fechamento do A2, em três perguntas em ordem. Só se chega ao Context quando as três forem respondidas:

1. **Dá para resolver com composição?** (tópico 2) Se sim, resolve — é mais barato e mais explícito.
2. **É estado de cliente?** (tópico 10) Se for do servidor, o problema é cache, e Context não é cache.
3. **Muda pouco, ou dá para separar o que muda?** (tópicos 6 e 8) Se muda a cada tecla digitada e todo mundo consome, o Context vai custar mais do que economiza.

**Para que serve.** Ter uma resposta curta e defensável — que é o que a regra 8 (simulado de entrevista) vai cobrar, e o que "Reprova se: você não sabe defender uma decisão que você tomou" cobra na avaliação.

**Exemplo — as respostas deste app, para não ter que reconstruí-las na hora:**

- **Aviso/toast → Context.** Composição não resolve (a `TasksPage` e a `TaskDetailPage` estão em galhos diferentes); é estado de cliente; muda pouco e o que muda foi separado do que não muda (tópico 8).
- **Lista de tarefas → não.** É estado de servidor; a solução certa tem nome (cache com invalidação) e endereço (TanStack Query, ou o `useTasks` continuando onde está).
- **`editingId`, `isOpen` → não.** São locais de uma tela só. Subir seria o erro contrário: global por hábito.

---

## A3 · Onde os dois temas se encontram

### 1. O T11 escreve o problema; o T12 assina embaixo

O A1 tópico 8 termina com uma frase que não é conclusão, é pergunta: **dois componentes com o mesmo hook têm dois estados separados.** O A2 é a resposta — e a resposta inclui "e às vezes você não quer compartilhar mesmo".

É a mesma estrutura de dívida do par anterior (T9 cria o 404 no F5, T10 paga), mas de outra natureza: lá era um defeito, aqui é um **limite de ferramenta**. Custom hook é composição de lógica; Context é distribuição de valor. Confundir os dois é o erro que este arquivo existe para não deixar acontecer.

### 2. Identidade é o assunto secreto dos dois

Metade dos tópicos deste arquivo é a mesma pergunta em roupas diferentes: **é o mesmo objeto do render anterior?**

- `useCallback`/`useMemo` (A1 11) existem para preservar identidade;
- `React.memo` (A1 12) falha quando a identidade não se preserva;
- `key` (A1 13) é identidade declarada à mão;
- o `value` do Provider (A2 7) é o mesmo bug, num lugar onde ele custa mais caro;
- e `dispatch` (A1 2) é a única identidade que vem estável de graça.

Quem entende `Object.is` entre renders entende os cinco de uma vez. Quem decora os cinco separados vai errar o sexto.

### 3. É o primeiro tema que não muda a tela

Todos os temas até aqui terminaram com algo novo aparecendo: lista, estilo, formulário, dado do banco, rotas, URL pública. Este termina com a tela **igual** e o código diferente — mais o aviso, que muda de lugar sem mudar de aparência.

Isso tem duas consequências. A primeira é sobre o perfil registrado no diagnóstico ("front de movimento e interação; retorno visual é combustível"): este é o tema com menos retorno visual da etapa, e o combustível dele tem que vir do **número** — o Profiler é o que faz o trabalho invisível ficar visível. A segunda é a prova de fechamento: sem testes ainda (T13), a verificação é a lista de provas do Bloco 1, uma por uma, com o app aberto — porque refatoração que muda comportamento não é refatoração, é bug com boas intenções.

---

# Parte B — Alterações no app

### 1. Preparação do ambiente

- **Nenhuma dependência nova.** `useReducer`, `useRef`, `useId`, `useMemo`, `useCallback`, `memo`, `createContext` e `useContext` vêm no React. Terceiro tema da etapa com atrito zero de instalação — e o único em que isso é o ponto: o tema inteiro é sobre não instalar nada.
- **React DevTools com o Profiler ligado:** abrir a aba **Profiler**, entrar nas configurações (engrenagem) e marcar **"Record why each component rendered"**. Sem essa opção, o Profiler mostra _que_ renderizou e não _por quê_ — que é a metade que interessa.
- **Os dois servidores de sempre:** `sudo service postgresql start` → `npm run dev` na `api/` → `npm run dev` na `web/`.
- **Medir antes de encostar em qualquer arquivo.** A primeira medição é a linha de base do tema e vai para o devlog — depois de refatorar, não dá mais para tirá-la.

### 2. Os blocos

#### Bloco 1 — o que o app tem que fazer agora

**Medir (T11) — antes de tudo**

- [ ] Profiler gravado com _"why did this render"_ ligado, em três cenários: digitar na busca, ciclar status, apagar tarefa
- [ ] Números anotados no devlog: **quantos componentes** por interação e **tempo do commit**
- [ ] A régua registrada: 16 ms é um quadro a 60fps — abaixo disso não há o que otimizar

**Os hooks a fundo (T11)**

- [ ] `useReducer` no lugar dos `useState` da lista: `tasksReducer` **fora** do componente, `action` por evento (`loaded`, `failed`, `created`, `updated`, `removed`)
- [ ] A guarda `state.status !== 'success'` mora no reducer, **uma vez** — a função `updateTasks` da página some
- [ ] `useRef` para o timer do aviso: aviso novo cancela o timer do anterior
- [x] `useRef` no input da edição na linha: o `autoFocus` já dava o foco (a dívida do T3 estava paga); a ref entrou pelo `select()`, que é o que deixa sobrescrever o título direto
- [ ] `useId` no `TaskField`: a prop `id` sai da assinatura e o `htmlFor`/`aria-describedby` passam a ser únicos por instância

**O custom hook (T11)**

- [ ] `hooks/useTasks.ts` criado — a pasta `hooks/` nasce aqui, com conteúdo
- [ ] Ele expõe `state`, `pendingIds` e os verbos (`reload`, `addTask`, `editTitle`, `cycleStatus`, `removeTask`); esconde `AbortController`, `reloadKey`, `ApiError`
- [ ] A `TasksPage` **não importa mais** `ApiError` nem `../../api/tasks` — se importar, a extração não terminou
- [ ] `editingId` **fica** na página: é estado de interface, não de dado
- [ ] A `TasksPage` cabe numa tela de editor sem rolar (hoje são 215 linhas)

**Performance com número (T11)**

- [ ] Segunda medição depois da refatoração, comparada com a primeira, **no devlog**
- [ ] `useMemo`/`useCallback`/`React.memo` só entram com um motivo nomeado e um número atrás — **"nada foi memoizado porque nada precisou" é um resultado válido e tem que estar escrito**
- [ ] Se algo for memoizado: a prova de que funcionou é o Profiler mostrando o render que sumiu

**O Context (T12)**

- [ ] `ToastProvider` (ou `NoticeProvider`) com o estado do aviso dentro, montado no `AppLayout` — não na raiz
- [ ] Dois contextos: **estado** (a mensagem) e **ações** (`show`/`dismiss`), pelo tópico 8
- [ ] Hooks guardiões `useToastState`/`useToastActions`, que **estouram com mensagem clara** fora do Provider
- [ ] O `value` das ações é estável (`useCallback` ou `dispatch`) — não é objeto literal novo a cada render
- [ ] O `notice` sai da `TasksPage`; a `TaskDetailPage` passa a usar o **mesmo** aviso em vez do jeito próprio dela
- [ ] O aviso é acessível: `role="status"` + `aria-live="polite"`, como já está hoje, e some sozinho pelo timer da ref
- [ ] A lista de tarefas **não** entra em Context — e o porquê fica escrito no `web/README.md`

**Provas (regra 1 — trecho gerado precisa de prova)**

- [ ] O CRUD inteiro continua funcionando: criar, ciclar, editar título, apagar, buscar, filtrar
- [ ] Duplo clique rápido em "Alterar": continua mandando **um** `PATCH` (a guarda de `pendingIds` sobreviveu ao reducer)
- [ ] `PATCH` numa tarefa apagada por fora (`psql`): vira aviso, o item some da tela, nada no console
- [ ] Rollback do otimista: derrubar a API no meio de um "Alterar" e ver a tarefa voltar para a coluna anterior
- [ ] Clicar no título para editar: o campo abre **com foco**, e Enter/Esc continuam funcionando
- [ ] Dois `TaskField` na mesma tela (basta abrir o rodapé): os `id` gerados são diferentes, e clicar em cada label foca o campo certo
- [ ] Aviso disparado do **detalhe** aparece na mesma caixa que o da lista
- [ ] Profiler: disparar um aviso e conferir que o `Header` **não** renderiza
- [ ] `npm run typecheck` limpo
- [ ] `npm run build` rodado e o tamanho comparado com a linha de base do T10 (a expectativa é ~igual: nada foi instalado)
- [ ] **Push na `main` e link público conferido** — regra 7

#### Bloco 2 — sugestões, médio/avançado

- `useReducer` também no `InputTask` (`digitando → validando → enviando → erro`), fechando o gancho deixado no T5 tópico 11
- `useDebounce` como custom hook para a busca, e medir a diferença de commits por tecla no Profiler
- `useTaskFilters` embrulhando o `useSearchParams` — a sugestão que ficou anotada no Bloco 2 do T9/T10
- `useLocalStorage` genérico, só para ver a mesma lógica virar hook depois de ter morrido no T7
- Contexto de **tema** (claro/escuro) como segundo Provider, para comparar frequência de mudança com o toast
- Fila de avisos em vez de um só (`Toast[]`), com id e remoção individual — e a `key` do A1 tópico 13 valendo de novo
- `useSyncExternalStore`: o hook que existe justamente para ler de uma loja fora do React (é o que Zustand usa por baixo)
- `useOptimistic` e `useActionState` do React 19 — comparar com o otimista escrito à mão no T8
- Medir o mesmo cenário com 500 tarefas geradas no banco, para ver o tópico 14 deixar de ser teórico
- React Compiler: rodar em uma branch, medir, e comparar com a memoização manual
- Extrair um `useApiResource<T>` genérico do `useTasks` e do `TaskDetailPage` — e decidir se a abstração vale ou se é cedo demais

---

# Parte C — Revisão do código

> Preencher no fechamento do tema. **Regra 6: o tema só fecha quando esta parte estiver concluída** — e vale a **regra 7**: sem redeploy, o tema não fechou.

## O app foi migrado para o assunto do tema?

Sim, e em sete arquivos. **Dois nasceram** — `hooks/useTasks.ts` (a pasta `hooks/` não existia) e `contexts/ToastContext.tsx` + `components/Toast.tsx`.

- **`useReducer`** substituiu o `useState` da lista. O `tasksReducer` mora fora do componente, com cinco actions (`loaded`, `failed`, `created`, `updated`, `removed`) e a guarda `state.status !== 'success'` escrita **uma vez** — a função `updateTasks` morreu. O `default` usa `action satisfies never` como alarme de action nova sem `case`.
- **O rollback do otimista deixou de guardar o estado inteiro.** Era `const previous = state` + `setState(previous)`; virou `dispatch({ type: 'updated', task })` com a tarefa original, que já estava em mãos. Desfazer passou a ser o mesmo evento com o valor velho.
- **`useRef`** em dois lugares: o timer do aviso (aviso novo cancela o anterior — antes o aviso **não sumia sozinho**) e o nó do input de edição, para o `select()`.
- **`useId`** no `TaskField`: a prop `id` saiu da assinatura e das duas chamadas no `InputTask`.
- **`useTasks`** expõe `state`, `pendingIds` e os cinco verbos; esconde `AbortController`, `reloadKey` e `ApiError`. A `TasksPage` não importa mais `api/tasks`, `ApiError` nem `nextStatus`, e caiu de **215 para 86 linhas**.
- **Context em dois** — `ToastStateContext` (a mensagem) e `ToastActionsContext` (`show`/`dismiss`), com hooks guardiões que estouram fora do Provider. Provider no `AppLayout`, com o `Header` **fora** dele. O `notice` saiu da `TasksPage` e a `TaskDetailPage` parou de trocar a tela inteira por erro quando a exclusão falha.
- **Nenhuma memoização entrou no app.** O único `useMemo` do tema está no `value` das ações do Provider — onde identidade é o mecanismo, não otimização.
- **A lista de tarefas não entrou em Context**, e o porquê está no `web/README.md`: é estado de servidor, o problema seria cache, e cache tem nome (TanStack Query).

**Duas coisas que o tema encontrou diferentes do que o estudo previa:**

1. A **dívida de foco do T3 estava paga** — o `EditTitleField` já tinha `autoFocus`. O que faltava era o `select()`. O tópico A1·5 foi corrigido.
2. O **`useId` não corrigiu bug nenhum hoje**: o app tem um formulário só, e `task-title`/`task-term` já eram distintos. É prevenção para o dia do segundo formulário, não cura.

## Typecheck

`npm run typecheck` **limpo**.

## Testes

Testes de front são o Tema 13. Até lá, as provas do Bloco 1 — rodadas com os dois servidores de pé.

Uma nota para o T13: o `tasksReducer` é função pura e **testável sem renderizar nada** — `tasksReducer({ status: 'success', tasks: [...] }, { type: 'removed', id })`. Foi o ganho real da extração, mais do que qualquer número de performance.
