# Estudo — Falando com a API e o CRUD completo (Temas 7 + 8)

> **Temas mesclados em 09/08.** O T7 (Falando com a API) e o T8 (Escrita: o CRUD completo na tela) viraram um arquivo só. O motivo é de conteúdo, não de pressa: os dois montam **a mesma camada** — `src/api/tasks.ts` — e separá-los significa escrever `request`, tratamento de erro e tipagem de resposta no T7 e voltar a mexer nos mesmos arquivos no dia seguinte. Além disso, metade dos tópicos do T8 (erro no campo certo, refetch × estado local, salvando por item) só faz sentido depois que os quatro estados de tela do T7 existirem, e a lição central do T7 ("erro HTTP não rejeita a Promise") só dói de verdade quando existe um `POST` que pode voltar 400.
>
> Os tópicos mantêm a numeração do `plano.md` (A1 = T7 1–12, A2 = T8 1–12), porque é essa numeração que o simulado de entrevista da regra 8 usa. A **A3** é nova e só existe por causa da mescla. Continuam contando como **dois temas** para efeito de avaliação e de oral — duas perguntas, não uma.

> **O tema, em uma frase:** o app para de ser dono dos dados e vira **cliente** de quem é — e a partir daí toda tela precisa dizer a verdade sobre uma coisa que pode demorar, falhar, ou ter mudado sem você.

**Onde o app está antes deste tema.** `Content` é dono de `useState<Task[]>(loadTasks)` e de quatro handlers síncronos (`handleAddTask`, `handleEditTask`, `handleChangeTask`, `handleDeleteTask`). Todos eles mexem no array e voltam no mesmo instante — nenhum pode falhar. O `id` é gerado no cliente (`crypto.randomUUID()`). A persistência é `localStorage` sob `do-0-ao-emprego:tasks`, com `loadTasks` no inicializador e `saveTasks` num `useEffect([tasks])`. `types/task.ts` já tem `Task`, `Status`, `TaskForm` e `FieldErrors` — todos alinhados ao contrato da API desde o T5. Não existe nenhum `fetch` no projeto.

**A mudança de eixo.** Até aqui, "o estado" e "a verdade" eram a mesma coisa. A partir daqui são duas coisas separadas por uma rede: a verdade está no Postgres, o estado é uma **cópia** dela na memória do navegador, e todo o tema é sobre a distância entre as duas.

---

# Parte A — Os tópicos

## A1 · Falando com a API

### 1. Onde a requisição mora

**O que é.** Uma camada `src/api/` com funções tipadas — `getTasks()`, `createTask(input)`, `updateTask(id, patch)`, `deleteTask(id)` — e **nenhum `fetch` dentro de componente**. O componente pede a tarefa; ele não sabe que existe HTTP.

**Para que serve.** Três ganhos concretos, não estéticos:

- **A URL, os headers e o formato de erro ficam num lugar só.** Quando a API for para produção (T9 da Etapa 2), muda um arquivo.
- **O componente vira testável.** No T13, o MSW intercepta na borda da rede — mas mesmo antes disso, um componente que chama `getTasks()` é mais fácil de raciocinar que um que monta `fetch` no meio do JSX.
- **É a mesma decisão que a API tomou.** Lá, `db.ts` exporta um `query` fino e as rotas não sabem o que é um pool. Aqui, `api/http.ts` exporta um `request` fino e os componentes não sabem o que é um `Response`.

**Exemplo.**

```
src/api/
├── http.ts      ← o `request` genérico: URL base, headers, erro, parse
└── tasks.ts     ← as quatro funções do domínio, tipadas
```

```ts
// api/tasks.ts
export const getTasks = () => request<Task[]>('/tasks');
export const createTask = (input: NewTask) => request<Task>('/tasks', { method: 'POST', body: input });
```

O critério de corte: `http.ts` **não sabe o que é uma tarefa** — é o mesmo critério de `components/ui/` × `components/tasks/` do T3, aplicado a outra pasta.

### 2. `fetch` revisitado

**O que é.** `fetch` devolve uma Promise que resolve com um `Response`. O ponto que pega todo mundo: **a Promise só rejeita quando a requisição não aconteceu** — DNS falhou, servidor fora do ar, CORS bloqueou, rede caiu. Um `404` ou um `500` é uma requisição que **deu certo** e trouxe uma resposta ruim.

**Para que serve.** Explica por que `try/catch` sozinho em volta de um `fetch` é uma armadilha: ele pega o servidor desligado e deixa passar o 400 em silêncio. A checagem obrigatória é `res.ok` (true para 200–299).

**Exemplo.**

```ts
const res = await fetch(url); // não estoura em 404, 400 ou 500
if (!res.ok) {
  /* aqui é onde o erro de aplicação vira erro */
}
const data = await res.json();
```

Detalhe: `res.json()` também estoura por conta própria — corpo vazio ou HTML de página de erro não é JSON válido. É o mesmo defeito do `204` do A2, tópico 2.

### 3. Traduzir o erro da API para um erro do front

**O que é.** Uma função só, num lugar só, que recebe um `Response` com `!res.ok` e devolve **um** tipo de erro do front. A API fala `{ errors: [{ field?, message }] }`; o resto do app não deveria precisar saber disso.

**Para que serve.** Sem isso, cada componente desembrulha o formato do servidor na mão, e o dia em que o formato mudar são dez arquivos. Com isso, o formulário do T5 pergunta `err.fieldErrors.title` e pronto — que é exatamente o encaixe pedido pelo tópico 7 do A2.

**Exemplo.**

```ts
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly details: ErrorDetail[],
  ) {
    super(details[0]?.message ?? 'Erro na requisição');
  }

  get fieldErrors(): FieldErrors {
    // { field, message } → { title: 'título é obrigatório' }
  }
}
```

Repare no espelho: a API tem uma `AppError` e um tratador central; o front ganha uma `ApiError` e um tradutor central. **Mesma ideia, lados opostos do cabo.**

### 4. Tipar a resposta — o que `as Task[]` prova

**O que é.** `res.json()` devolve `Promise<any>` (na prática, `unknown` bem tratado). Escrever `request<Task[]>('/tasks')` não valida nada em runtime: é uma **afirmação** de que a resposta tem aquele formato.

**Para que serve.** Saber exatamente o que você está garantindo e o que não está. É a terceira vez que essa lição aparece — `queryDb<T>` no T4 da Etapa 2, `JSON.parse(raw) as Task[]` no T6 desta etapa, `res.json() as Task[]` agora. **Toda fronteira do sistema tem o mesmo buraco**, e o remédio é sempre o mesmo: validação de schema em runtime (Zod), que continua anotada como dívida.

**Exemplo.**

```ts
const data: unknown = await res.json();
return data as T; // ⚠️ afirmação, não prova
```

O que o TypeScript pega de graça mesmo assim: se a API mudar e você **atualizar o tipo**, todo consumidor quebra no typecheck. O que ele não pega: a API mudou e ninguém atualizou o tipo.

### 5. Os quatro estados de toda tela que busca dado

**O que é.** **Carregando · erro · vazio · sucesso.** Nenhum é opcional. Não são "casos de borda" — são os quatro valores possíveis da tela, e três deles não têm dado nenhum para mostrar.

**Para que serve.** É o tópico que a avaliação vai testar de três jeitos ("derrubo a API no meio da sessão", "lista vazia e primeiro acesso", "devolvo 400"). E é onde o T3 paga dividendo: os quatro **já têm estilo**, porque a decisão de estilizar antes do CRUD foi tomada lá atrás. O `EmptyTasks` já existe.

**Exemplo — e o modelo importa.** Três booleanos soltos são 8 combinações para 4 estados válidos, com pérolas como `isLoading && error`. A união discriminada não deixa o estado impossível existir:

```ts
type TasksState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; tasks: Task[] }; // vazio é `tasks.length === 0`
```

É o tópico 9 do T4 (estado impossível) voltando com dado de verdade, e é o ensaio do `useReducer` do T11. **"Vazio" não é um quarto ramo da união** — é um caso de sucesso, porque lista vazia é uma resposta legítima do servidor. Confundir os dois é como o app trata hoje o `localStorage` corrompido: erro disfarçado de vazio.

### 6. Buscar no `useEffect`, com limpeza e proteção de race

**O que é.** A aplicação direta do A2 do tema passado: função `async` **declarada dentro** do efeito (a do efeito não pode ser `async`), flag `ignore` ou `AbortController` na limpeza, dependências honestas.

**Para que serve.** No T6 a race condition foi ensaiada com `setTimeout`. Agora ela é real: em dev, o `StrictMode` monta–desmonta–monta e **dispara duas requisições** — se o efeito não tiver limpeza, o defeito aparece no primeiro F5. O `StrictMode` como detector deixa de ser teoria.

**Exemplo.**

```tsx
useEffect(() => {
  const ac = new AbortController();

  const run = async () => {
    try {
      const data = await getTasks(ac.signal);
      setState({ status: 'success', tasks: data });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return; // cancelamento não é erro
      setState({ status: 'error', message: mensagemDe(err) });
    }
  };

  void run();
  return () => ac.abort();
}, []);
```

A linha que quase todo mundo esquece: **`AbortError` cai no `catch`**. Sem a guarda, cancelar a requisição pinta a tela de erro.

### 7. Variáveis de ambiente no Vite

**O que é.** Só o que começa com `VITE_` é exposto ao código do cliente, e é lido em `import.meta.env.VITE_API_URL`. O valor é **injetado no build** — não é lido em runtime.

**Para que serve.** Duas consequências práticas:

1. **Tudo que entra aqui é público.** Está no bundle, em texto, para qualquer um que abrir o DevTools. Chave de API secreta no front não existe — é chave vazada com passo extra.
2. **Trocar a URL exige rebuild.** Fica anotado desde já para o T10, tópico 6, e para o dia em que a API tiver URL pública.

**Exemplo.**

```
# web/.env.local  (fora do git)
VITE_API_URL=http://localhost:3000
```

```ts
const BASE_URL = import.meta.env.VITE_API_URL;
```

Combina com um `.env.example` **dentro** do git, com a chave e sem o valor — quem clonar o repositório precisa saber que a variável existe. E o `web/README.md` deixa de dizer "variáveis de ambiente: nenhuma".

### 8. CORS pelo lado de quem apanha

**O que é.** A **política de mesma origem**: por padrão, o navegador não deixa o JavaScript de `localhost:5173` ler a resposta de `localhost:3000`. Origem é a trinca **protocolo + host + porta** — porta diferente já é outra origem.

**Para que serve.** Entender as três coisas que o erro de CORS **não** é:

- **Não é o servidor bloqueando.** A requisição chega, a API responde 200, o Postgres é consultado. Quem se recusa a entregar a resposta ao seu código é o **navegador**. Por isso o `curl` e o Bruno funcionam e o front não — os dois não são navegadores e não implementam a política.
- **Não é segurança da API.** É proteção do **usuário**, para que um site qualquer não leia a resposta autenticada de outro em nome dele.
- **Não é problema do seu código de front.** Nenhum header que você mandar resolve. A cura está do lado do servidor: `Access-Control-Allow-Origin`.

**O preflight.** Antes de um `POST` com `Content-Type: application/json`, ou de qualquer `PATCH`/`DELETE`, o navegador manda sozinho um **`OPTIONS`** perguntando "posso?". Se ele não vier respondido com os headers certos, a requisição de verdade **nunca sai**. É por isso que o `GET` do T7 pode funcionar e o `POST` do T8 falhar logo depois — quem só testou a leitura acha que CORS está resolvido.

**Como ler o erro.** A mensagem do console diz qual header faltou, e é para lê-la, não para chutar: `No 'Access-Control-Allow-Origin' header` (origem não liberada) × `Method PATCH is not allowed` (falta no `Allow-Methods`) × `Request header field content-type is not allowed` (falta no `Allow-Headers`). Na aba Network, o preflight aparece como uma linha `OPTIONS` separada — e é ela que está vermelha.

**O que foi entregue na `api/`** (Parte B, e é a exceção única ao congelamento):

```ts
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
res.setHeader('Vary', 'Origin');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') return res.sendStatus(204);
```

Duas decisões dentro dessas cinco linhas: o middleware é o **primeiro** da cadeia, para que a resposta de **erro** também carregue o header — senão o 400 chega ao navegador sem permissão de leitura e você vê um erro de CORS onde havia um erro de validação. E a origem é **fixa**, não `*` — `*` é o que se usa para API pública sem credencial, e assumir esse hábito custa caro quando o login chegar (T8 da Etapa 2, com `Allow-Credentials`, onde `*` é proibido).

### 9. Ler a aba Network

**O que é.** A ferramenta que responde "de quem é a culpa" sem chute. Por requisição: **método e URL** (a barra a mais no fim é um clássico), **status**, **headers** de ida e volta, **payload**, **response** crua, e **tempo**.

**Para que serve.** É o hábito que separa depurar de adivinhar. O roteiro curto:

| O que você vê                     | O que significa                                     |
| --------------------------------- | --------------------------------------------------- |
| Requisição não aparece            | o código nem chamou — o erro é antes do `fetch`     |
| `(failed)` / `net::ERR_`          | servidor fora do ar, ou CORS derrubando              |
| `OPTIONS` vermelho antes da real  | preflight (A1, tópico 8)                             |
| `404` na URL certa                | prefixo errado, ou id que não existe                 |
| `200` com corpo estranho          | você acertou o servidor errado                       |
| duas requisições idênticas em dev | `StrictMode` — esperado, e prova que a limpeza funciona |

Vale marcar "Disable cache" e olhar a coluna de tempo desde já: o T10 vai medir e o T14 vai animar em cima disso.

### 10. Erro de rede × erro de aplicação

**O que é.** Duas famílias que exigem respostas diferentes na tela:

- **Erro de rede** — a Promise do `fetch` rejeitou. API desligada, wifi caiu, CORS. Não há resposta. Não é culpa do que o usuário digitou, e **tentar de novo é uma ação razoável**.
- **Erro de aplicação** — veio resposta, com status ruim. `400` (você mandou algo inválido), `404` (não existe), `500` (o servidor quebrou). Tem `message`, e às vezes `field`.

**Para que serve.** Decidir o que a tela oferece. "Não conseguimos falar com o servidor" + botão **Tentar de novo** é honesto para o primeiro; para um `400`, "tentar de novo" com o mesmo corpo dá 400 de novo — o que serve é mostrar a mensagem no campo. E "Erro ao carregar tarefas" para as duas famílias é a tela que não ajuda ninguém.

**Exemplo.**

```ts
try {
  await getTasks();
} catch (err) {
  if (err instanceof ApiError) {
    /* houve resposta: err.status, err.details */
  } else {
    /* não houve: rede, CORS, ou bug no seu código */
  }
}
```

O `else` engole bug de verdade (um `TypeError` seu vira "erro de rede" na tela). Um `console.error(err)` ali dentro é barato e evita meia hora de caça.

### 11. Timeout e a tela que gira para sempre

**O que é.** `fetch` **não tem timeout padrão**. Servidor que aceita a conexão e não responde deixa a Promise pendente indefinidamente — e o seu `status: 'loading'` nunca sai do lugar.

**Para que serve.** É o item "não pode ficar girando para sempre" da avaliação. A cura usa a mesma peça do tópico 6, o `AbortController`, agora disparado por um relógio.

**Exemplo.**

```ts
const ac = new AbortController();
const timer = setTimeout(() => ac.abort(), 8000);
try {
  const res = await fetch(url, { signal: ac.signal });
} finally {
  clearTimeout(timer);
}
```

Existe `AbortSignal.timeout(8000)` nativo, mais curto — e combinar com `AbortSignal.any([...])` quando você precisa cancelar por desmontagem **e** por tempo. O `finally` com `clearTimeout` não é firula: sem ele, um timer por requisição fica pendurado.

Decisão de UX que acompanha: **carregando só aparece depois de ~200ms**. Spinner que pisca em requisição de 40ms é pior que spinner nenhum.

### 12. Por que existe TanStack Query e por que passar sem ele agora

**O que é.** Uma biblioteca de **estado de servidor**. Ela nasceu porque o par `useState` + `useEffect` que você vai escrever neste tema é um começo, não um fim: falta cache entre componentes, deduplicação de requisições simultâneas, revalidação ao focar a aba, retentativa com espera crescente, invalidação depois de escrever, paginação, e mutação otimista com rollback pronto.

**Para que serve.** Reconhecer **cada um desses problemas** quando ele aparecer no seu código, em vez de aprender o nome de uma lib. Metade deles vai aparecer no A2: "depois do `POST`, como a lista atualiza?" é literalmente invalidação de cache feita à mão.

**Por que não agora.** Porque o tema existe para você sentir o problema. Escrever `useQuery` hoje ensina a API do TanStack Query, não o que é uma race condition. Numa entrevista, "escrevi na mão, senti a falta de cache e invalidação, e é por isso que usaria TanStack Query num projeto real" vale mais que ter usado.

**A ponte:** o `useTasks` do T11 é o esqueleto de um `useQuery` caseiro. Quando ele existir, a comparação fica de graça.

---

## A2 · Escrita: o CRUD completo na tela

### 1. `POST`/`PATCH`/`DELETE` com `fetch`

**O que é.** Três verbos, três formatos de resposta. O que a **sua** API devolve (conferido no `tasks.routes.ts`, não chutado):

| Rota                | Corpo enviado                  | Sucesso                                 | Corpo devolvido    |
| ------------------- | ------------------------------ | --------------------------------------- | ------------------ |
| `POST /tasks`       | `title`, `status`, `term`      | `201` + header `Location: /tasks/:id`   | a `Task` criada    |
| `PATCH /tasks/:id`  | subconjunto, pelo menos um     | `200`                                   | a `Task` atualizada |
| `DELETE /tasks/:id` | nenhum                         | `204`                                   | **nada**           |

**Para que serve.** O `POST` e o `PATCH` devolverem a entidade inteira é uma sorte de projeto que decide o tópico 3: dá para atualizar o estado local **com a resposta**, sem refetch e sem inventar o objeto.

**Exemplo.**

```ts
await request<Task>('/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(input),
});
```

Esquecer o `Content-Type` faz o `express.json()` não popular o `req.body`, e a API responde 400 dizendo que `title` é obrigatório — em um corpo que tem `title`. Erro que parece do servidor e é do cliente.

**O `id` sai do cliente.** Hoje `handleAddTask` chama `crypto.randomUUID()`. A partir daqui, **o banco gera o id** (`gen_random_uuid()`) e o front recebe. O `crypto.randomUUID()` não morre de vez: volta como id **temporário** na atualização otimista (tópico 10) — e aí ele é claramente provisório, não uma verdade fabricada.

### 2. `204 No Content` — o caso de borda que todo mundo esquece

**O que é.** `204` significa "deu certo e não há corpo". Chamar `res.json()` nele estoura com `Unexpected end of JSON input`: você fez o `DELETE` com sucesso e a tela mostra erro.

**Para que serve.** É o motivo de o `request` genérico precisar de um ramo, não de um `return res.json()` reto. E não é o único caso: `Content-Length: 0` e resposta sem `Content-Type: application/json` têm o mesmo efeito.

**Exemplo.**

```ts
if (res.status === 204) return undefined as T;
return (await res.json()) as T;
```

Um `request<void>` para o `DELETE` diz isso no tipo, e é mais honesto que o `as`. Sintoma que confirma o diagnóstico: **a tarefa some do banco e a tela mostra erro** — o efeito colateral aconteceu, a leitura da resposta é que falhou.

### 3. Depois de escrever, como a tela atualiza

**O que é.** A pergunta central do tema, com duas respostas legítimas:

- **Refetch:** escreveu, chama `getTasks()` de novo. Simples, sempre certo, e enxerga o que mudou por fora. Custa uma viagem a mais e um instante de tela em transição.
- **Atualizar o estado local com a resposta:** o `POST` devolveu a `Task`, você a coloca no array. Instantâneo, uma viagem só. Custa **divergência**: se o servidor calculou algo que você não previu, sua cópia está errada e ninguém avisa.

**Para que serve.** É o trade-off honesto, e ele muda por rota, não por app. `DELETE` não devolve nada — sobra remover do array (ou refetch). `PATCH` devolve a linha — vale usar. Uma lista compartilhada por várias pessoas puxa para refetch; um app de um usuário só puxa para o estado local.

**Exemplo.**

```ts
const criada = await createTask(input);
setTasks((prev) => [...prev, criada]); // a resposta do servidor, não o objeto que você mandou
```

**A decisão deste app, e o motivo:** **atualizar com a resposta** para `POST` e `PATCH`, **remover do array** no `DELETE`, e refetch só no carregamento da tela. A API devolve a entidade inteira nos dois primeiros, é um usuário só, e a lista é pequena. Vai para o `web/README.md` com o motivo — e com o gatilho para mudar de ideia: no dia em que existir mais de um cliente escrevendo, a resposta vira refetch (ou invalidação, e aí o A1 tópico 12 volta à mesa).

### 4. `PATCH` parcial casando com o contrato

**O que é.** O `PATCH` aceita **qualquer subconjunto** de `title`, `status`, `term` — pelo menos um. E as três situações do `term` são diferentes:

| O que você manda    | O que a API faz         |
| ------------------- | ----------------------- |
| `{ term: '2026-08-20' }` | grava o prazo       |
| `{ term: null }`    | **limpa** o prazo       |
| `{}` sem `term`     | **não toca** no prazo   |

**Para que serve.** A diferença entre "apagar" e "não mexer" é a razão de o `PATCH` existir. E ela morde o TypeScript do jeito que o `exactOptionalPropertyTypes` já ensinou: `{ term: undefined }` **não** é o mesmo que a chave ausente — mas `JSON.stringify` apaga a chave com valor `undefined`, então os dois viram a mesma requisição. Contar com isso é contar com um detalhe de serialização; montar o objeto só com o que mudou é explícito.

**Exemplo.**

```ts
export type TaskPatch = Partial<Pick<Task, 'title' | 'status' | 'term'>>;

updateTask(id, { status: nextStatus[task.status] }); // o ciclo do botão manda só o status
updateTask(id, { title: novoTitulo }); // a edição na linha manda só o título
```

Os dois handlers que hoje fazem `{ ...task, campo }` mandam, a partir daqui, **só o campo**. Menos corpo, menos chance de reenviar dado velho por cima de uma alteração que você não viu.

### 5. Atualização otimista

**O que é.** Pintar a tela **antes** de o servidor confirmar, e desfazer se ele recusar. Três passos: guardar o estado anterior, aplicar a mudança, e no `catch` restaurar o que foi guardado e avisar.

**Para que serve.** É a diferença entre um app que responde e um app que espera. Quando vale: ação **muito provável de dar certo**, barata de desfazer, e cujo resultado o cliente sabe prever — marcar como feita, apagar, reordenar. Quando é armadilha: quando o servidor decide algo que você não consegue prever (id, `created_at`, saldo, número de pedido), e quando desfazer confunde mais do que esperar teria confundido.

**Exemplo.**

```ts
const handleChangeTask = async (id: string) => {
  const anterior = tasks; // 1. guarda
  setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus[t.status] } : t))); // 2. pinta
  try {
    await updateTask(id, { status: proximo });
  } catch {
    setTasks(anterior); // 3. rollback
    setAviso('Não foi possível alterar o status.');
  }
};
```

**O rollback ingênuo tem um bug**, e é o que separa quem entendeu de quem copiou: restaurar `anterior` inteiro **descarta outras alterações** que aconteceram no meio do caminho. Numa lista pequena e sequencial é aceitável; a solução correta é reverter só aquele item. Vale escrever no devlog em vez de resolver agora.

**A decisão deste app:** otimista no `handleChangeTask` (o clique tem que responder na hora, e o T14 vai animar essa troca de coluna) e **pessimista** — espera, mostra "salvando" — na criação e na edição de título, porque o `POST` depende do id do servidor e o título é conteúdo que o usuário digitou e não quer ver pular. O `DELETE` fica otimista com desfazer (tópico 8).

### 6. Estado de "salvando" por item, não global

**O que é.** A linha que está gravando é aquela. Um `isSaving` booleano no `Content` trava a página inteira quando o usuário só clicou num item.

**Para que serve.** É a diferença entre "o app está ocupado" e "esta tarefa está sendo salva" — e a segunda é a verdade. Sem isso, apagar uma tarefa desabilita os botões das outras cinco.

**Exemplo.**

```tsx
const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
// no item:
<ItemTask task={task} isPending={pendingIds.has(task.id)} />;
```

Cuidados: `Set` é mutável — trocar por um `new Set(prev)` no setter, senão o React não vê mudança (imutabilidade do T4, tópico 3). E o `finally` é obrigatório para tirar o id do conjunto: item que fica "salvando" para sempre depois de um erro é pior que erro nenhum.

### 7. Erro de validação do servidor caindo no campo certo

**O que é.** O `400` volta com `{ errors: [{ field: 'title', message: '...' }] }`. Esse `field` precisa achar o input correspondente — e acha, porque o `FieldErrors` do T5 já é exatamente `Partial<Record<keyof TaskForm, string>>` e o campo já se chama `title` nos dois lados.

**Para que serve.** É o dividendo da divergência que foi fechada no T5 (`description` → `title`). O trabalho de hoje é ligar dois fios que já existem, não desenhar nada:

```tsx
try {
  await onAddTask(form);
} catch (err) {
  if (err instanceof ApiError) {
    setErrors(err.fieldErrors); // erro com `field`
    setFormError(err.semCampo); // erro sem `field`
  }
}
```

**A consequência de projeto:** `onAddTask` precisa devolver uma Promise para o `InputTask` saber se deu certo. Ou seja, a prop deixa de ser `(form) => void` e vira `(form) => Promise<void>` — e a regra do T5 ("sucesso limpa, erro preserva") passa a depender da resposta do servidor, não de um `if` local. Essa é a mudança de assinatura mais importante do tema.

E o erro sem `field` (o `route`, o `500`, o "Insert error in DB") precisa de um lugar na tela. Sem ele, o formulário falha em silêncio.

### 8. Confirmação antes de apagar; desfazer como alternativa

**O que é.** Duas estratégias opostas para a mesma ação destrutiva. **Confirmar** intercepta antes (`window.confirm`, ou um modal). **Desfazer** deixa acontecer e oferece a volta por alguns segundos.

**Para que serve.** Confirmar cobra o pedágio de **todo mundo, sempre**, inclusive de quem clicou certo — e vira reflexo, que é o mesmo que não existir. Desfazer não cobra nada de quem acertou e resolve o de quem errou. O custo do desfazer é técnico: alguém precisa segurar a tarefa apagada.

**Exemplo.** O `DELETE` da sua API é destrutivo de verdade — não há _soft delete_. Então o desfazer honesto é um `POST` da tarefa de volta, **com id novo**. Se o id importar (e no T9 ele vira URL), isso é uma mentira sutil.

**A decisão deste app:** `window.confirm` agora, com a limitação anotada — é feio, bloqueia a aba e não é estilizável, mas é uma linha e não inventa infraestrutura. O modal acessível (foco preso, `Esc`, foco devolvido) e o desfazer vão para o Bloco 2, com o `Modal` do T3 como candidato natural a habitante de `components/`.

### 9. Duplo clique e a requisição repetida

**O que é.** Entre o clique e a resposta há uma janela de segundos, não de milissegundos. Sem guarda, dois cliques em "Adicionar" são **duas tarefas no banco** — e a segunda não some sozinha.

**Para que serve.** É item de avaliação ("duplo clique no botão de salvar: não pode criar duas tarefas"), e é a lição do T5 tópico 10 saindo do papel: lá a janela era teórica, aqui é real.

**Idempotência vista do cliente:** `GET`, `PUT` e `DELETE` são idempotentes por definição — repetir não muda o resultado. **`POST` não é.** Por isso ele é o único que precisa de guarda de verdade; repetir o `DELETE` só produz um 404 inofensivo.

**Exemplo.** As duas camadas, e as duas são necessárias:

```tsx
if (status === 'submitting') return; // guarda no handler — pega o Enter, que `disabled` não pega
setStatus('submitting');
...
<Button type="submit" disabled={status === 'submitting'}>  {/* guarda visual */}
```

O `disabled` sozinho não basta e ainda tira o botão da ordem de tabulação (T5, tópico 10). A guarda no handler é a que vale.

### 10. Chave de identidade quando o item ainda não tem id do banco

**O que é.** Num item otimista, a tarefa existe na tela antes de existir no banco — e `key` precisa de alguma coisa. Se você usa o índice, ou um id temporário que **muda** quando a resposta chega, o React desmonta e remonta a linha.

**Para que serve.** É o T2 tópico 6 cobrando a fatura, e é a razão de este tópico estar aqui e não no T14: **`key` que muda mata a animação de saída** e faz o item piscar. O T14 vai animar entrada e saída de item da lista, e essa animação depende inteiramente de a `key` ser estável do primeiro render até o último.

**Exemplo.**

```ts
const tempId = crypto.randomUUID(); // provisório, mas estável enquanto o item viver
setTasks((prev) => [...prev, { id: tempId, ...input, pending: true }]);

const criada = await createTask(input);
setTasks((prev) => prev.map((t) => (t.id === tempId ? criada : t))); // ⚠️ a key muda aqui
```

O trecho acima é o problema, não a solução: no instante da troca, a `key` vai de `tempId` para o id do banco e o React trata como item novo. As saídas: manter uma `clientId` estável separada do `id` do servidor, ou — a escolha deste app — **não ser otimista na criação** (tópico 5), que é justamente onde o id importa. A decisão de hoje é o que faz a animação do T14 funcionar mais tarde.

### 11. Quando o `PATCH` responde `404`

**O que é.** O item sumiu debaixo dos seus pés: outra aba, outra pessoa, ou o `psql` na avaliação. Sua cópia local mente, e o servidor acabou de avisar.

**Para que serve.** É a demonstração mais clara de que o estado é uma **cópia**, não a verdade. E é item de prova prática: "apago a tarefa por fora e você tenta editar — o 404 precisa virar mensagem, não erro no console".

**Exemplo.** A resposta certa é a coerente com a informação nova:

```ts
catch (err) {
  if (err instanceof ApiError && err.status === 404) {
    setTasks((prev) => prev.filter((t) => t.id !== id)); // some da tela, porque sumiu de verdade
    setAviso('Esta tarefa não existe mais.');
    return;
  }
  throw err;
}
```

Repare no contraste: `404` na leitura de uma lista é uma coisa (rota errada — bug seu); `404` na escrita de um item é outra (o item foi embora — realidade). Mesmo status, diagnósticos opostos.

### 12. Erro que aparece e some: onde a mensagem vive e quem a limpa

**O que é.** Toda mensagem de erro precisa de três respostas: **onde ela mora** no estado, **quem a limpa**, e **quando**. Faltando qualquer uma, você tem erro fantasma — o do `POST` de dez minutos atrás ainda na tela — ou erro invisível, apagado antes de ser lido.

**Para que serve.** A regra que resolve a maioria: **erro é limpo no início da próxima tentativa**, não por um `setTimeout`. Erro que some sozinho depois de 3 segundos é erro que ninguém leu.

E há dois lugares distintos, não um:

| Tipo de erro                          | Onde mora                     | Quem limpa                          |
| ------------------------------------- | ----------------------------- | ----------------------------------- |
| erro de campo (`400` com `field`)     | `errors` do `InputTask` (T5)  | o próximo submit, ou digitar no campo |
| erro de tela (rede, `500`, `404` de item) | um aviso no `Content`     | a próxima ação, ou um botão de fechar |

**Exemplo.** Para o aviso de tela, `aria-live="polite"` (T3, tópico 10) — mudança sem clique precisa ser anunciada, senão quem usa leitor de tela não fica sabendo que a ação falhou. E o erro não pode depender só de cor: ícone ou texto junto.

O sintoma de que isto está mal resolvido: dois lugares diferentes mostrando a mesma mensagem, ou uma mensagem que sobrevive à troca de tela. O T12 (toast num Context) é o endereço definitivo — aqui é um estado no `Content`, com a dívida anotada.

---

## A3 · Onde os dois temas se encontram

### 1. O `localStorage` morre aqui

Esta é a decisão de abertura, e ela é deliberada: **a API vira a fonte única da verdade.** `utils/taskStorage.ts` sai do app, o `useEffect([tasks])` que gravava some junto, e `loadTasks` deixa de ser o inicializador do `useState`.

**Por quê.** Duas fontes da verdade é o pior dos mundos: o storage abriria a tela com dado velho e a requisição substituiria depois — a tela mostraria tarefas que talvez não existam mais, e o **estado de erro nunca apareceria de verdade**, porque sempre haveria algo pintado por cima. Os quatro estados do A1 tópico 5 só são honestos se não houver dado de reserva mascarando a falha.

**O que se perde, dito com todas as letras:** o app deixa de funcionar sem a API de pé. Isso é uma regressão real, e é a dívida que o **T10, tópico 7** ("o front no ar sem API no ar") existe para pagar — lá, com a decisão tomada de propósito e não por acidente de implementação.

O código do T6 não é jogado fora: ele fica no histórico do commit e no `studie-t05-t06`, e o `web/README.md` registra que o storage foi **substituído**, não abandonado.

### 2. Uma camada, dois sentidos

Ler e escrever passam pelo **mesmo** `request`: mesma URL base, mesmo tratamento de `!res.ok`, mesma tradução de erro. A diferença entre `getTasks()` e `createTask()` são três linhas de opções.

É por isso que os dois temas juntos rendem um arquivo e não dois. E é o teste de que a camada ficou boa: se `createTask` precisar do próprio tratamento de erro, a abstração do A1 tópico 1 falhou.

### 3. O `Content` vai ficar grande — de propósito

Ao fim do tema, o `Content` vai ter: o estado da união discriminada, o efeito de busca, quatro handlers `async` com `try/catch/finally`, o conjunto de ids pendentes, e o aviso de erro. É muita coisa para um componente, e **é para ficar assim**.

O nome disso é o sintoma que o **T11** vem resolver com o `useTasks`, do mesmo jeito que o T5 deixou o sintoma do `useReducer` escrito e não trocou na hora. Extrair agora é otimizar antes de doer, e tira do T11 o material dele.

O que **não** é aceitável é o componente ficar grande **e** confuso: cada handler faz uma coisa, o nome diz o que ela é, e o `try/catch/finally` tem sempre a mesma forma. Repetição legível é dívida; improviso não é.

---

# Parte B — Alterações no app

### 1. Preparação do ambiente

- **CORS na `api/` — entregue (09/08).** Middleware na mão em `api/src/app.ts`, primeiro da cadeia, com `Allow-Origin: http://localhost:5173`, `Allow-Methods`, `Allow-Headers: Content-Type`, `Vary: Origin` e resposta `204` ao `OPTIONS`. Sem dependência nova: a API continua congelada em tudo o mais.
- **`web/.env.local`** com `VITE_API_URL=http://localhost:3000` (confirmar a porta no `api/src/server.ts`), fora do git. Um `.env.example` com a chave e sem o valor **dentro** do git.
- **Os dois servidores de pé:** `sudo service postgresql start` → `npm run dev` na `api/` → `npm run dev` na `web/`. Três terminais.
- **DevTools na aba Network**, com "Disable cache" marcado, e o Bruno aberto ao lado para comparar (ele não sofre CORS — é o controle do experimento).

### 2. Os blocos

#### Bloco 1 — o que o app tem que fazer agora

**A camada (T7)**

- [ ] `src/api/http.ts`: `request<T>` com URL base de `import.meta.env`, `Content-Type`, checagem de `res.ok`, ramo do `204`, `signal` opcional
- [ ] `ApiError` com `status` e `details`, e o `fieldErrors` derivado
- [ ] `src/api/tasks.ts`: `getTasks`, `createTask`, `updateTask`, `deleteTask` — tipadas, sem JSX por perto
- [ ] `TaskPatch = Partial<Pick<Task, 'title' | 'status' | 'term'>>` em `types/task.ts`

**A leitura (T7)**

- [ ] A lista vem do `GET /tasks`; `data/mockTasks.ts` sai do caminho
- [ ] `utils/taskStorage.ts` some do app, junto com o `useEffect([tasks])` que gravava
- [ ] Estado da tela como união discriminada (`loading` / `error` / `success`), não três booleanos
- [ ] Os quatro estados na tela, com estilo — o `EmptyTasks` continua sendo o de sucesso vazio
- [ ] Busca no `useEffect` com `AbortController` na limpeza e `AbortError` ignorado no `catch`
- [ ] Erro de rede × erro de aplicação com mensagens diferentes; "Tentar de novo" só onde faz sentido
- [ ] Timeout, para a tela não girar para sempre
- [ ] Provar: `StrictMode` dispara duas requisições em dev e nada quebra

**A escrita (T8)**

- [ ] Criar: `POST`, id vindo do banco, `crypto.randomUUID()` sai do `handleAddTask`
- [ ] `onAddTask` vira `Promise<void>`; sucesso limpa o formulário, erro preserva **e** mostra a mensagem no campo
- [ ] Editar título: `PATCH` com **só** `{ title }`
- [ ] Ciclar status: `PATCH` com **só** `{ status }`, otimista, com rollback
- [ ] Apagar: `DELETE`, tratando o `204`, com `window.confirm` antes
- [ ] `pendingIds` por item — nada de trava global
- [ ] Guarda de duplo submit: `if (status === 'submitting') return` no handler **e** `disabled` no botão
- [ ] `404` no `PATCH`/`DELETE` vira mensagem e tira o item da tela
- [ ] Um lugar para o erro sem `field`, com `aria-live`

**Provas (regra 1 — trecho gerado precisa de prova)**

- [ ] Derrubar a API com a tela aberta e clicar em tudo: nenhuma tela branca, nenhum giro eterno
- [ ] `POST` com título vazio forçado pelo DevTools: o `400` da API cai no campo `title`
- [ ] Apagar uma tarefa pelo `psql` e tentar editá-la: mensagem, não erro no console
- [ ] Duplo clique em "Adicionar": uma tarefa no banco, conferido no `psql`
- [ ] O preflight `OPTIONS` aparecendo na Network antes do primeiro `PATCH`

#### Bloco 2 — sugestões, médio/avançado

- Atraso de ~200ms antes de mostrar o "carregando", para requisição rápida não piscar
- Retentativa com espera crescente no erro de rede (e o limite de quantas vezes)
- Modal de confirmação acessível no lugar do `window.confirm` — `Modal` em `components/`, foco preso, `Esc` fecha, foco devolvido
- Desfazer o apagar, com o custo do id novo assumido e escrito
- Rollback por item em vez de restaurar a lista inteira (o bug do A2, tópico 5)
- Revalidar ao voltar o foco para a aba — o primeiro pedaço do que o TanStack Query faz
- Skeleton no lugar do spinner, aproveitando os tokens do T3
- Extrair `useTasks` — é T11; se fizer, registrar que antecipou
- Validar a resposta com Zod em vez de `as Task[]` — fecha o buraco das três fronteiras de uma vez
- `AbortSignal.any([timeout, unmount])` no lugar das duas guardas separadas
- Título do documento com o número de pendentes, agora vindo do servidor

---

# Parte C — Revisão do código

## O app foi migrado para o assunto do tema?

Sim, e nos dois sentidos.

**Leitura.** Não existe mais array em memória como origem: `data/mockTasks.ts` saiu do caminho, `utils/taskStorage.ts` saiu do app junto com o `useEffect([tasks])` que gravava, e a lista vem do `GET /tasks`. O estado da tela é união discriminada (`loading | error | success`), com componente próprio para cada um — e "vazio" mora dentro do sucesso. A busca acontece no `useEffect` com `AbortController` na limpeza, `AbortError` ignorado no `catch`, timeout de 8s por `AbortSignal.any([signal, AbortSignal.timeout(8000)])`, e erro de rede separado de erro de aplicação por `instanceof ApiError`.

**Escrita.** Os quatro handlers viraram `async` e vão até o banco: `POST` com id gerado pelo Postgres (`crypto.randomUUID()` saiu do `handleAddTask`), `PATCH` mandando **só** o campo que mudou, `DELETE` com `204` tratado. `onAddTask` virou `(form) => Promise<void>` — "sucesso limpa, erro preserva" agora depende da resposta do servidor, não de um `if` local. `pendingIds` marca o item que grava, guarda de duplo submit no handler e no botão, e `404` na escrita tira o item da tela com aviso em `aria-live`.

**O que ficou fora e por quê:** o `ApiError.fieldErrors` existe sem cliente, porque a API devolve `field: 'task'` para qualquer dado inválido — divergência de contrato encontrada durante o tema, com a `api/` congelada. O `Content` ficou grande de propósito (material do T11). Bloco 2 inteiro não foi feito.

## Typecheck

`npm run typecheck` (`tsc -b --noEmit`) — **rodar e colar o resultado antes de considerar o tema fechado.**

Dois atritos do TS 7 apareceram e estão resolvidos no código: `erasableSyntaxOnly` proibindo parameter properties no construtor do `ApiError` (campos declarados e atribuídos à mão) e `exactOptionalPropertyTypes` recusando `{ signal: undefined }` — no `fetch`, curado com `?? null`; no `RequestOptions` próprio, com `signal?: AbortSignal | undefined` explícito.

## Testes

Nenhum, por plano: testes de front são o **Tema 13** (Vitest + Testing Library + MSW), e o MSW vai interceptar exatamente na borda que este tema criou — `src/api/`. A verificação deste tema foi manual, pelas cinco provas do Bloco 1, todas passando:

1. API derrubada com a tela aberta: sem tela branca, sem giro eterno.
2. `POST` inválido: mensagem no formulário (não no campo — ver divergência acima).
3. Tarefa apagada pelo `psql` e editada na tela: vira "Esta tarefa não existe mais" e o item some.
4. Duplo clique em "Adicionar": uma tarefa no banco.
5. Preflight `OPTIONS` na Network antes do primeiro `PATCH`.
