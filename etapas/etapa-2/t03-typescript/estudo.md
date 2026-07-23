# Tema 3 — TypeScript · `estudo.md`

> Aberto seguindo a **regra 7** do plano: **Parte A** = referência de cada ponto do tema, pra consultar como doc · **Parte B** = a mudança na `api/`, em marcos.
> Regras da etapa: **fase REVISOR** (você constrói, eu reviso) · **identificadores e nomes de arquivo em inglês** · **commit conforme avança** (`t03: ...`).
> **Antes da Parte B (regra 8):** a gente conversa e decide as opções técnicas do tema, e registra a decisão no `api/README.md`.

---

# Parte A — Referência dos conceitos

> Leitura de **consulta**. Cada bloco: o que é · exemplo · a pegadinha · **na API:** onde bate.

---

## 1. O que o TS faz (e o que não faz)

### Estático × dinâmico
TS é tipagem **estática**: checa o programa inteiro **antes de rodar** (compilação), incluindo caminhos que você nunca testou. JS é **dinâmico**: só descobre o problema **quando a linha executa** — e uma linha num `if` raro pode não rodar em meses.
```ts
// JS: passa liso, quebra (ou dá resultado errado) depois
function totalPrice(order) { return order.price * order.quantity; }
totalPrice({ price: '10', quantity: 3 }); // "101010" — sem erro, resultado errado
```
```ts
// TS: nem compila
function totalPrice(order: { price: number; quantity: number }) { return order.price * order.quantity; }
totalPrice({ price: '10', quantity: 3 });
// TS2322: Type 'string' is not assignable to type 'number'
```

### O que ele pega
`undefined is not a function`, `Cannot read property 'x' of undefined`, argumento na ordem errada, campo digitado errado (`titel`), caso possível não tratado.

### O que ele cobra
Sintaxe a mais (anotações, `tsconfig`, um passo de build) e a obrigação de decidir "e se vier `null`?" na hora, não depois.

### A pegadinha: some em runtime
O TS checa, gera JavaScript e **sai de cena** — não existe `if (x é Task)` gerado por ele. Um JSON que chega num `POST` pode ser qualquer coisa. Tipo é promessa sobre o código que **você** escreveu; dado de fora precisa de validação em runtime.

**Na API:** o compilador te protege dentro do teu código; no `req.body` ele para — por isso a validação (item 7) existe.

---

## 2. Tipos, inferência, `any` × `unknown`

### Tipos
O TS deduz o tipo pelo valor inicial.
```ts
let name = 'Ana';            // inferido: string — não precisa anotar
// `let name: string = 'Ana'` seria redundante: o valor já diz que é string
```

### Inferência
**`let` × `const` mudam a inferência:**
`let status = 'todo'` infere `string` (pode mudar);
`const status = 'todo'` infere o **literal** `'todo'` (só esse valor).

### any
`any` é uma escotilha: o valor entra e a checagem **para de existir** dali pra frente. Não explode erro — deixa passar.
```ts
const x: any = JSON.parse(raw);
x.whatever.deep.nonsense;   // compila. explode em runtime.
```

### unknown
`unknown` diz a mesma coisa que `any` ("não sei o que é") **sem** abrir mão da segurança — você só usa depois de estreitar.
```ts
const x: unknown = JSON.parse(raw);
x.whatever;                                   // TS18046: 'x' is of type 'unknown'
if (typeof x === 'string') x.toUpperCase();   // aqui pode: você provou
```

**Regra:** `unknown` na borda, `any` nunca. Quando `any` parecer a única saída, o problema quase sempre é falta de validação.

**Na API:** `req.body` chega como `any` — teu trabalho é tratá-lo como `unknown` e validar.

---

## 3. `interface` × `type`, `?`, `readonly`

Para descrever objeto, `interface` e `type` funcionam igual; a diferença é quase estética.

### interface
`interface` faz *declaration merging* e costuma ser preferida para contratos públicos.
```ts
interface User {
  readonly id: number;   // não pode ser reatribuído depois
  email: string;
  nickname?: string;     // opcional: string | undefined
}
```

### type
Só `type` faz união, interseção e tipos derivados de utilities.
```ts
type Point = { x: number; y: number };   // type também descreve objeto
type Id = string | number;               // mas só type faz união
```

### ?
Significa opcional: o campo não é obrigatório, não explode sem ele (`string | undefined`).
```ts
interface User { nickname?: string; }
```

### readonly
Campo só de leitura, não pode ser reatribuído depois.
```ts
interface User { readonly id: number; }
```

> A pegadinha (excess property checking): objeto literal com campo **a mais** dá erro (`TS2353`), mesmo tendo tudo que o tipo pede — mas só quando atribuído **direto**; passando por uma variável antes, o extra escapa.

**Na API:** a modelagem da `Task`.

---

## 4. União e narrowing

### União `A | B`
Diz "**um destes**, não sei qual". Enquanto o TS não souber qual, só deixa usar o que os dois têm em comum.
```ts
function describe(value: string | number) {
  value.toFixed(2);            // TS2339: 'toFixed' não existe em 'string | number'
  if (typeof value === 'number') return value.toFixed(2); // aqui é number
  return value.toUpperCase();  // aqui só sobrou string
}
```

### Narrowing
É o TS acompanhando o teu raciocínio: dentro do `if` o tipo afunila pra `number`; depois do `return`, só sobra `string`. Você não anotou nada — o **fluxo do código** foi a prova (control flow analysis). Passa o mouse na variável em cada linha pra ver o tipo mudar.

### Ferramentas de narrowing
`typeof` (primitivos) · `Array.isArray()` · `in` (checar chave) · `instanceof` (classes) · comparação com literal · checagem de null (`if (value != null)`).

### A pegadinha: objetos
Pra **objetos que você definiu**, `typeof` não serve — todos são `"object"`. A solução é o item 7 (type predicate).
```ts
function isString(x: string[] | string): x is string { return !Array.isArray(x); }
```

**Na API:** um valor que pode ser `null`, um handler que trata mais de um tipo.

---

## 5. União literal (no lugar de `enum`)

### Tipo literal
Um tipo com **um valor só**. A união de literais vira um conjunto fechado, e um typo vira erro de compilação em vez de bug silencioso.
```ts
type Role = 'admin' | 'editor' | 'viewer';
let role: Role = 'editor';
role = 'editorr';   // TS2322: '"editorr"' não é atribuível a 'Role'
```

### `as const`
Congela um array (vira `readonly`) e preserva os literais em vez de alargar pra `string[]`. Aí você deriva a união da lista, sem manter as duas em sincronia na mão.
```ts
const ROLES = ['admin', 'editor', 'viewer'] as const; // readonly ["admin", "editor", "viewer"]
type RoleFromArray = typeof ROLES[number];            // 'admin' | 'editor' | 'viewer'
```

### Por que não `enum`
O `enum` **gera código JavaScript** — a única construção de tipo que sobrevive à compilação, quebrando a regra "tipos somem". Cria tipo nominal que não aceita a string equivalente (`'admin'` não é `Role.Admin`), atrapalha na borda e não conversa bem com JSON. A união literal é mais simples e some no build.

### Exaustividade com `never`
O compilador te avisando quando esquece um caso:
```ts
function label(role: Role): string {
  switch (role) {
    case 'admin':  return 'Administrador';
    case 'editor': return 'Editor';
    case 'viewer': return 'Leitor';
    default:
      const exhaustive: never = role;   // se faltar um case, ERRO aqui
      return exhaustive;
  }
}
```
**A pegadinha (o valor disso):** com todos os casos tratados, o `default` recebe `never` e compila. Falta um? O tipo restante não cabe em `never`, e o erro **nomeia o esquecido** (`Type '"viewer"' is not assignable to type 'never'`). Quando alguém adicionar `'guest'`, o build quebra — que é o que você quer.

**Na API:** o `status` da Task; um `switch` que rotula status.

---

## 6. Tipar funções e a borda

### Parâmetro e retorno
**Parâmetro o TS nunca infere** — sem anotação é `any` implícito, e com `strict` já é erro (`noImplicitAny`). **Retorno ele infere**, mas anotar faz o erro aparecer *dentro* da função, não longe em quem chamou.
```ts
function createUser(email: string, nickname?: string): User {
  return { id: Date.now(), email, nickname };
}
```

### `void`
"O retorno não interessa" — diferente de `undefined`, que é um valor.
```ts
const log = (msg: string): void => { console.log(msg); };
```

### A borda (`unknown` até provar)
Tudo que atravessa a fronteira do processo — `req.body`, `req.query`, `JSON.parse`, `fetch`, env — chega **sem garantia**. O tipo que você declara aí é promessa que ninguém verificou:
```ts
const task = req.body as Task;   // mentira: o cliente pode ter mandado {}
task.title.trim();               // compila liso, explode em produção
```
**A regra:** borda recebe `unknown`, e a única saída de `unknown` é **validação em runtime**. No Tema 6 o `zod` automatiza isso; aqui você escreve na mão pra entender.

**Na API:** toda entrada de rota é borda.

---

## 7. Type predicates

### O que é (`value is T`)
Resolve o "typeof não distingue objeto" do item 4: troca o retorno `boolean` por `value is T` — "se devolver `true`, trate o argumento como `T` dali pra frente".
```ts
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null &&
    'email' in value && typeof (value as User).email === 'string';
}
const data: unknown = JSON.parse(raw);
if (isUser(data)) data.email.toLowerCase();   // aqui data é User
```

### Sem o `is`, não estreita
Com retorno `boolean` puro, dentro do `if` o valor continua `unknown`:
```ts
function isUserBool(value: unknown): boolean { /* ...mesma checagem... */ return true; }
if (isUserBool(data)) data.email;   // TS18046: 'data' is of type 'unknown'
```

### A pegadinha: predicate mentiroso
O TS **não confere** se a checagem está certa. Isto compila e é mentira:
```ts
function isUser(v: unknown): v is User { return true; }
```
O predicate é promessa sua — pior que `any` porque parece seguro. Por isso anda de mãos dadas com teste (item 13).

### `.filter` com predicate
```ts
const values: (string | null)[] = ['a', null, 'b'];
values.filter(v => v !== null);                 // (string | null)[] — não estreitou
values.filter((v): v is string => v !== null);  // string[] — estreitou
```

**Na API:** o `isTask` que valida o `req.body`.

---

## 8. Discriminated unions e o padrão `Result`

### Discriminated union
União de objetos que compartilham um campo **literal e diferente** em cada membro; comparar esse campo estreita o objeto inteiro.
```ts
type FetchState =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string };
function render(state: FetchState) {
  if (state.status === 'success') return state.data.length; // só aqui `data` existe
  if (state.status === 'error')   return state.message;     // só aqui `message` existe
  return 'carregando...';
}
```

### O que substitui
O objeto tudo-opcional (`{ ok?; data?; error? }`), que permite estados impossíveis (`ok: true` com `error`). Na união, o estado impossível **não é representável** — *make illegal states unrepresentable*.

### O padrão `Result`
Aplica isso a operações que podem falhar: o erro vira **valor de retorno tipado**, e quem chama é obrigado a checar `ok` antes de acessar `value`.
```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const r = parseTask(input);
r.value;             // TS2339: 'value' não existe em '{ ok: false; error: string }'
if (r.ok) r.value;   // aqui pode
```

### A pegadinha (contrato)
Exceção **não aparece na assinatura** — nada em `parse(x): Task` avisa que ela lança. Com `Result`, a falha está no tipo; o custo é verbosidade. Times usam os dois: `Result` pro erro esperado (validação), exceção pro excepcional (banco caiu).

**Na API:** o `parseTask` devolvendo `Result` — ou lançando; **você decide e justifica** (vira contrato).

---

## 9. Generics e `strictNullChecks`

### Generic `<T>`
Parâmetro de tipo: a função recebe o tipo junto com o valor e devolve conforme entrou. `any[]` também aceitaria tudo, mas o retorno viraria `any` e a checagem morreria — o generic **preserva** a informação.
```ts
function firstItem<T>(items: T[]): T | undefined { return items[0]; }
firstItem([1, 2, 3]);   // number | undefined — T virou number sozinho
firstItem(['a', 'b']);  // string | undefined
```

### Inferência de `T`
Você não escreve `firstItem<number>(...)` — o TS **infere** `T` do argumento.

### `extends` (restrição)
Restringe o que `T` pode ser (sem ele, não pode assumir nada sobre `T` dentro da função):
```ts
function getId<T extends { id: number }>(item: T): number { return item.id; }
getId({ nome: 'x' });   // TS2345: falta 'id'
```

### `strictNullChecks` (a parte mais importante do tema)
`items[0]` num array vazio é `undefined` — quem coloca o `| undefined` ali é essa flag, e ela não é decorativa:
```ts
const found = tasks.find(t => t.id === 7);
found.title;              // TS18048: 'found' is possibly 'undefined'
if (!found) return null;  // agora sim
found.title;              // ok
```
Sem ela, `find()` retornaria `Task` seco e você descobriria em produção. É a flag que **paga o preço do TS** — e a que te salva no Tema 4 (`result.rows[0]` vazio do Postgres).

### Tratar o `undefined` (3 formas)
`if (!found) return ...` (early return) · `found?.title` (optional chaining) · `found ?? default` (valor padrão). Numa rota `GET /tasks/:id`, a certa é **early return com 404** — id inexistente é resposta esperada, não exceção.

**Na API:** todo `find` por id numa rota `:id`.

---

## 10. Utility types

Derivam um tipo de outro em vez de duplicar. Base dos exemplos:
```ts
interface Task { id: number; title: string; status: 'todo' | 'doing' | 'done'; author?: string }
```

### `Omit<T, K>`
Remove as chaves `K`.
```ts
type NewTask = Omit<Task, 'id'>;   // corpo do POST — sem id, o servidor gera
```

### `Partial<T>`
Deixa todos os campos opcionais.
```ts
type TaskPatch = Partial<Omit<Task, 'id'>>;   // corpo do PATCH — tudo opcional, menos o id
```

### `Pick<T, K>`
Mantém só as chaves escolhidas.
```ts
type TaskPreview = Pick<Task, 'id' | 'title'>;   // resposta de listagem
```

### `Required<T>` e `Readonly<T>`
`Required` faz o inverso do `Partial` (tudo obrigatório); `Readonly` trava a reatribuição de todos os campos.

### Derivar × redigitar
Derivar faz um campo novo se propagar sozinho. Redigitado à mão, você adiciona `priority` na `Task`, esquece de atualizar uma das definições, e o compilador não reclama.

### A pegadinha do `Partial`
Torna tudo opcional, inclusive tudo ao mesmo tempo — `{}` é um `TaskPatch` válido:
```ts
const patch: TaskPatch = {};   // compila — e um PATCH vazio não deveria passar pela rota
```
Tipo não é validação: "pelo menos um campo" vive em runtime.

**Na API:** POST (`NewTask`), PATCH (`TaskPatch`), listagem (`TaskPreview`).

---

## 11. `as` × `satisfies`

### `as`
Não converte nada — é você mandando o compilador parar de checar. Nenhum código roda, nenhuma verificação acontece.
```ts
const user = {} as User;
user.email.toLowerCase();   // compila. TypeError em runtime, longe da linha que causou.
```

### `satisfies` (TS 4.9+)
Valida contra um alvo **sem** trocar o tipo inferido. Com `:` o tipo da variável vira o declarado (alarga); com `satisfies` ele continua o inferido (mantém o específico).
```ts
const a: { port: number; env: 'dev' | 'prod' } = { port: 3000, env: 'dev' };
a.env;   // 'dev' | 'prod'  ← alargou

const b = { port: 3000, env: 'dev' } satisfies { port: number; env: 'dev' | 'prod' };
b.env;   // 'dev'  ← o específico sobreviveu
```

### O ganho (alvo mais largo)
Fica mais claro quando o alvo é mais largo que o valor:
```ts
const palette = { red: [255, 0, 0], green: '#00ff00' } satisfies Record<string, string | number[]>;
palette.green.toUpperCase();   // ok: green é string
palette.red[0];                // ok: red é number[]
```
Com anotação `: Record<...>`, as duas linhas exigiriam narrowing antes.

### Quando `as` é legítimo
`as const` (congela literais) · `as unknown as T` em teste, de propósito · estreitar depois de uma checagem que o TS não segue. Fora disso, `as` na borda de dado externo é dívida.

> ⚠️ Alargamento de literal em propriedade mutável varia por versão do TS. Se o hover do teu editor divergir de um exemplo, **o certo é o editor** — me avisa.

**Na API:** teu voto é **nunca** `as Task` numa rota — o dado vai pelo `parseTask`.

---

## 12. `tsconfig` e o ambiente

### `strict`
Um guarda-chuva de flags. As duas que mais mudam o dia: **`strictNullChecks`** (item 9 — sem ela `null`/`undefined` cabem em qualquer tipo) e **`noImplicitAny`** (parâmetro sem anotação vira erro, não `any` calado). Desligar em projeto novo = ficar só com o custo da sintaxe.

### Dois configs
`tsconfig.json` checa tudo (testes incluídos); `tsconfig.build.json` estende e exclui teste/playground (não vão pro `dist/`).
```jsonc
// tsconfig.json
{ "compilerOptions": { "target": "es2022", "module": "nodenext", "moduleResolution": "nodenext",
    "rootDir": "./src", "outDir": "./dist", "strict": true, "sourceMap": true },
  "include": ["src/**/*"] }
```
```jsonc
// tsconfig.build.json
{ "extends": "./tsconfig.json", "exclude": ["src/**/*.test.ts", "src/playground"] }
```

### `dist/` não vai pro git
É gerado, reproduzível com `npm run build`; commitá-lo gera conflito em toda alteração.

### A armadilha de dia 1 (ESM × CJS)
`npx tsc --init` gera `"module": "commonjs"`, mas você usa `import`/`export` com `"type": "module"`. Misturar dá `ERR_MODULE_NOT_FOUND` ou `Cannot use import statement outside a module`. Pin nos dois, e eles têm que concordar:
```jsonc
// package.json → { "type": "module" }
// tsconfig.json → { "module": "nodenext", "moduleResolution": "nodenext" }
```
Consequência: **o import leva `.js`, mesmo o arquivo sendo `.ts`** (com `nodenext`, o especificador é o caminho em runtime).
```ts
import { isTask } from './task.js';   // .js no import, task.ts no disco
```

**Na API:** o setup do projeto (Marco 0).

---

## 13. Testes em TS

### vitest roda, mas não checa tipo
Ele apaga as anotações e executa (esbuild) — uma suíte pode ficar verde com erro de tipo. Por isso `tsc --noEmit` entra **antes**:
```jsonc
// package.json
"scripts": {
  "typecheck": "tsc --noEmit",
  "test": "npm run typecheck && vitest run"
}
```
Assim `npm test` reprova por lógica **e** por tipo — o mesmo comando do CI do Tema 10.

### O que testar (o que o tipo não garante)
Testar que `createTask` devolve `title` string é inútil — o compilador já provou. Testa `isTask`/`parseTask` com lixo real, que é onde a promessa do tipo encontra o mundo:
```ts
import { describe, it, expect } from 'vitest';
import { parseTask } from './task.js';

it('rejeita objeto sem title', () => {
  const result = parseTask({ id: 1, status: 'todo' });
  expect(result.ok).toBe(false);
});
```
A borda é onde o teste ganha do compilador — `{}`, `null`, `'texto'`, `{ status: 'doen' }`, campo com tipo errado.

**Na API:** `task.test.ts` (o validador) + `app.test.ts` (supertest nas rotas).

---

# Parte B — A `api/` em TypeScript

> A mudança do tema: **portar a API do T2 para TypeScript.** A `api/` nasce aqui e sobrevive à etapa — o T4 pluga Postgres, o T9 sobe ela, a Etapa 3 consome. Depois desta cópia, nunca mais se copia nada: só evolui por commit.
>
> **Antes de começar (regra 8):** a gente decide juntos as opções técnicas do tema — convenção `interface` × `type`, `Result` × exceção no `parseTask`, regra sobre `as` — e registra cada uma como tópico no `api/README.md`.

**Como nasce:** copie `t02-express/ex13/` para `etapas/etapa-2/api/`, renomeie os `.js` para `.ts`. Daí em diante o compilador te aponta o que falta tipar. Cada marco lista **o que fazer**, **o que entregar** e **o que provar**. Commit por marco.

---

## Marco 0 — o projeto TS roda  *(referência: 12)*

**O que fazer:** monte o projeto npm da `api/`. `package.json` com `"type": "module"`. devDeps: `typescript`, `@types/node`, `tsx`, `vitest`. runtime: `express`; devDeps `@types/express`, `supertest`, `@types/supertest`. Os dois tsconfig (`strict` + `nodenext`; o `.build` exclui teste/playground). Scripts: `typecheck`, `test`, `build`, `dev`. `.gitignore` com `node_modules/` e `dist/`.

**O que entregar:** a pasta `api/` com os dois tsconfig, o `package.json` com scripts, o `.gitignore`.

**O que provar:** `npm run typecheck` roda (pode acusar erros a resolver — importa o comando funcionar, sem erro de ESM×CJS). Commit: `t03: api marco 0 setup`.

---

## Marco 1 — a `Task` modelada  *(referência: 3, 5)*

**O que fazer:** em `src/task.ts`, modele a `Task`: `interface` ou `type` (decisão da regra 8), `id` `readonly`, `status` como **união literal**, um campo opcional.

**O que entregar:** `src/task.ts` com o tipo `Task`.

**O que provar:** objeto sem campo obrigatório dá `TS2741`; `status` inválido (`'doen'`) dá `TS2322`; reatribuir `id` dá erro de `readonly`. Commit: `t03: api marco 1 task model`.

---

## Marco 2 — os tipos das bordas  *(referência: 10)*

**O que fazer:** derive de `Task`: `NewTask` (POST, sem `id`), `TaskPatch` (PATCH, opcional menos `id`), `TaskPreview` (listagem). Com `Omit`/`Partial`/`Pick` — **não** redigitados.

**O que entregar:** os três tipos derivados em `src/task.ts`.

**O que provar:** que são derivados de verdade — um campo novo na `Task` aparece sozinho em `NewTask`; e `{}` satisfaz `TaskPatch` (a regra "pelo menos um campo" fica pro runtime, Marco 4). Commit: `t03: api marco 2 border types`.

---

## Marco 3 — a validação de borda  *(referência: 2, 6, 7, 8, 11)*

**O que fazer:** trate `req.body` como `unknown`. Escreva em `src/task.ts`: `isTask(value: unknown): value is Task` (todos os campos, `status` contra a lista) e `parseTask(input: unknown): Result<Task>` — ou lançando (decisão da regra 8). **Nenhum `as Task`** em lugar nenhum.

**O que entregar:** `isTask`, `parseTask` e `Result` em `src/task.ts`.

**O que provar:** `parseTask(JSON.parse('{}'))` rejeita; objeto válido passa e volta tipado; dentro de `if (isTask(x))` o `x` vira `Task` no hover. Commit: `t03: api marco 3 border validation`.

---

## Marco 4 — as rotas tipadas  *(referência: 1, 4, 9)*

**O que fazer:** porte as rotas mantendo o comportamento e o **seu formato de erro** do T2: `GET /tasks` e `/tasks/:id`, `POST` (201 + `Location`), `PATCH`, `DELETE`. Router em `src/routes/tasks.routes.ts`, `validateId` middleware, tratador de erro central com os **4 parâmetros tipados**, 404 coringa. `const tasks: Task[] = []` com `Task` importada (não redeclare). `req.params.id` é `string` → converta; todo `find` por id → early return com 404. POST recebe `NewTask`, PATCH `TaskPatch`; **`req.body` só entra via `parseTask`**.

**O que entregar:** `src/app.ts`, `src/server.ts`, `src/routes/tasks.routes.ts`.

**O que provar:** a API responde às cinco rotas; POST inválido cai no seu formato de erro (não num 500); GET de id inexistente devolve 404. Commit: `t03: api marco 4 typed routes`.

---

## Marco 5 — build que roda  *(referência: 12)*

**O que fazer:** `npm run build` (com o `tsconfig.build.json`).

**O que entregar:** o `dist/` gerado (fora do git).

**O que provar:** `dist/` **sem** `.test.js` nem `playground/`; `node dist/server.js` sobe a API (JS puro); um `curl` responde. **Cole o curl.** Commit: `t03: api marco 5 build`.

---

## Marco 6 — testes  *(referência: 13)*

**O que fazer:** `src/task.test.ts` (parseTask/isTask com lixo real) e `src/app.test.ts` (supertest: caso feliz + erro de cada rota). `typecheck` na frente do `test`.

**O que entregar:** os dois arquivos de teste.

**O que provar:** `npm test` verde (typecheck + vitest); um erro de tipo plantado reprova a suíte (e sem o typecheck ela passaria). Ache um lixo que a `parseTask` deixa passar e conserte. Commit: `t03: api marco 6 tests`.

---

## Fecho do tema — no `api/README.md`

- o que cada arquivo faz, em uma linha; como rodar e subir o build (`node dist/server.js`);
- **decisões-contrato** deste tema (as da regra 8): `interface` × `type` · regra sobre `as` · `Result` × exceção no `parseTask`;
- **3 lugares onde o TypeScript te obrigou a mudar** o JS que já funcionava;
- **3 coisas que te surpreenderam** · **1 coisa mal resolvida** (eu uso no checkpoint).

**Checkpoint:** me chame quando a API estiver portada, testada e no push. Code review de tudo (antes→depois), e é aqui que a data da avaliação (28/09) se confirma ou antecipa.
