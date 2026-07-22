# Tema 3 — TypeScript · Enunciados

> Pasta: `etapas/etapa-2/t03-typescript/` · **Projeto novo e autocontido**: `npm init`, TypeScript instalado aqui, e `npm run dev` / `npm run build` / `npm test` funcionam nesta pasta. As pastas do T1 e do T2 ficam congeladas — não edite nada lá.
> Regra da etapa: **fase REVISOR** — nada de código pronto. Você escreve, roda, e só depois eu reviso (antes→depois).
> **Nomes de arquivo e identificadores em inglês**; enunciados, comentários e respostas em português.
> **Commit por exercício.** Mensagem no formato `t03: ex04 union narrowing`.
> **Formato dos enunciados:** cada exercício abre com **Estudar** — o conceito explicado com exemplo em código — e fecha com o bullet **Ex NN**, que é o que você faz. Dúvida sobre o conceito, pergunta no chat; não é cola.

## Onde este tema chega

Os Ex 02–11 são de tipo puro, num playground. Os Ex 12–14 juntam tudo: **o Ex 14 porta a API do T2 (`t02-express/ex13/`) para TypeScript**, com os tipos que você construiu ao longo do tema. É essa API tipada que o Tema 4 pluga no PostgreSQL — o tema não termina em exercício de compilador, termina em servidor que sobe.

> São **14 exercícios**; o plano lista 13 tópicos. O Ex 14 é integração dos anteriores, não matéria nova.

## Antes de começar — ambiente (checklist)

- [X] Pasta nova `t03-typescript/` com `npm init` respondido (sem `-y`)
- [X] **`"type": "module"` no package.json** — ver a nota abaixo, é a armadilha de dia 1
- [X] `npm install -D typescript @types/node tsx vitest` — **tudo em devDependencies**. O TypeScript não roda em produção; produção roda o JavaScript que ele gerou.
- [X] `npx tsc --init`, e então **ajuste o que ele gerou** (ele vem com `"module": "commonjs"`, que não é o que queremos)
- [X] Estrutura de pastas montada como abaixo — **todo código `.ts` vive dentro de `src/`**
- [X] Dois arquivos de config (Ex 12 explica o porquê; crie agora)
- [X] Scripts no package.json: `"dev": "tsx watch src/server.ts"`, `"build": "tsc -p tsconfig.build.json"`, `"typecheck": "tsc --noEmit"`, `"test": "npm run typecheck && vitest run"`
- [X] `.gitignore` com `node_modules/` **e `dist/`** — código gerado não vai pro repo

### A armadilha de dia 1: ESM × CommonJS

`npx tsc --init` gera `"module": "commonjs"`. Você vem do T1/T2 escrevendo `import`/`export` com `"type": "module"` no package.json. Misturar os dois dá erro de import que **não** diz "você misturou ESM com CJS" — diz `ERR_MODULE_NOT_FOUND`, ou `Cannot use import statement outside a module`, ou reclama de `require`. É a hora perdida mais boba deste tema.

Pin nos dois lugares, e eles têm que concordar:

```jsonc
// package.json
{ "type": "module" }
```
```jsonc
// tsconfig.json
{ "module": "nodenext", "moduleResolution": "nodenext" }
```

Consequência prática, que aparece já no Ex 03: **o import leva `.js`, mesmo o arquivo sendo `.ts`.**

```ts
import { isTask } from './task.js';   // ← .js, e o arquivo no disco é task.ts
```
Não é erro de digitação. Com `nodenext`, o especificador do import é o caminho **em runtime**, e em runtime o arquivo é `.js`. O TS resolve `./task.js` para `task.ts` na hora de checar. Estranha uma vez e depois nunca mais.

### Estrutura

```
t03-typescript/
├── tsconfig.json           ← checa TUDO em src/, testes incluídos
├── tsconfig.build.json     ← estende o de cima, exclui teste e playground → dist/
├── ex01.md  ex12.md        ← exercícios escritos (fora de src/, não são código)
└── src/
    ├── playground/         ← Ex 02 a Ex 11
    │   └── ex02.ts ... ex11.ts
    ├── task.ts             ← Ex 13: os tipos e validadores, extraídos do playground
    ├── task.test.ts
    ├── app.ts              ← Ex 14: a API do T2, agora em TS
    ├── server.ts
    ├── app.test.ts
    └── routes/
        └── tasks.routes.ts
```

**Por que tudo dentro de `src/`:** o `rootDir` e o `include` do tsconfig apontam para lá. Arquivo `.ts` fora de `src/` fica **fora do projeto** — o `npm run typecheck` não o vê, e o editor deixa de aplicar o seu `strict` nele. Como este tema inteiro depende do sublinhado vermelho estar certo, um arquivo fora do `include` é um exercício mudo. Se o VS Code parecer permissivo demais em algum arquivo, a primeira suspeita é essa.

```jsonc
// tsconfig.json — a checagem completa
{
  "compilerOptions": {
    "target": "es2022",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "sourceMap": true
  },
  "include": ["src/**/*"]
}
```
```jsonc
// tsconfig.build.json — o que vai pro ar
{
  "extends": "./tsconfig.json",
  "exclude": ["src/**/*.test.ts", "src/playground"]
}
```

**Uma mudança de rotina em relação ao T1 e T2:** ali o feedback vinha de rodar o código. Aqui boa parte vem **antes de rodar**, do editor. O sublinhado vermelho é a resposta do exercício tanto quanto a saída do terminal. Quando o enunciado disser "cole a mensagem do compilador", é a mensagem inteira — código do erro (`TS2322`) incluído.

**tsx × tsc:** `tsx` roda `.ts` direto, sem gerar arquivo — conforto de desenvolvimento. `tsc` **compila** para `dist/` — é o que vai pro ar no Tema 9. Os dois convivem: você desenvolve com um e entrega com o outro.

---

## Ex 01 — 📖 O que o TS resolve e o que cobra

**Arquivo:** `ex01.md`

**Estudar:** tipagem estática × dinâmica, erro em tempo de compilação × em tempo de execução, o que o TS **não** faz.

```ts
// JavaScript: passa, quebra depois
function totalPrice(order) {
  return order.price * order.quantity;
}
totalPrice({ price: '10', quantity: 3 });   // "101010" — nenhum erro, resultado errado

// TypeScript: nem compila
function totalPrice(order: { price: number; quantity: number }) {
  return order.price * order.quantity;
}
totalPrice({ price: '10', quantity: 3 });
// TS2322: Type 'string' is not assignable to type 'number'
```

O JS só descobre problema de tipo **quando a linha executa** — e uma linha dentro de um `if` raro pode não executar em meses. O TS verifica o programa inteiro **antes de rodar**, incluindo os caminhos que você não testou.

**O que ele pega de verdade:** `undefined is not a function`, `Cannot read property 'x' of undefined`, argumento na ordem errada, campo digitado errado (`titel`), esquecer de tratar um caso possível.

**O que ele cobra:**

- **Sintaxe a mais** — anotações, `tsconfig`, um passo de build entre você e o código rodando.
- **Ele te obriga a decidir.** Em JS você adia "e se vier null?". Em TS o compilador cobra na hora. Isso é o valor e o custo na mesma frase.
- **Erros que parecem enigma** no começo. Leia de baixo pra cima: a última linha da mensagem costuma ser o motivo real.

**O limite que mais confunde iniciante:** **o TS some em runtime.** Ele checa, gera JavaScript e sai de cena — não existe `if (typeof x === 'Task')` gerado por ele. Um JSON que chega num `POST` pode ser qualquer coisa, e o compilador não tem como saber. Tipo é promessa sobre o código que **você** escreveu; dado que vem de fora precisa de validação em runtime — é o Ex 06 e o Ex 07 deste tema, e o `zod` do Tema 6.

- **Ex 01** — abra o `t02-express/ex13/app.js` e o `routes/tasks.routes.js` ao lado, e ache **3 lugares onde o TypeScript mudaria alguma coisa**. Não bugs que já aconteceram — **buracos que estão lá agora**, abertos, esperando a entrada errada. Para cada um: o trecho como está, o que o compilador exigiria de você, e como o código ficaria depois. Onde olhar: `req.params.id`, que chega string e você trata como número · `req.body`, que pode ser literalmente qualquer coisa · alguma busca no array que pode não achar nada e devolver `undefined` sem ninguém checar.

  Depois, o item que vale mais que os três juntos: **1 buraco que o TypeScript NÃO fecha**, e por quê. Você já tem o candidato — o `POST` sem `Content-Type` que derrubava o handler em 500. O compilador teria como saber que o `req.body` chegaria `undefined` ali? Responda isso e você entendeu o limite da ferramenta.

  > *Versão trocada em 22/07. A original era caçar 3 bugs reais do passado no devlog e no `git log`; virou análise do código atual porque a memória não rendeu. Mesmo objetivo, matéria-prima fresca.*

---

## Ex 02 — 🔨 Tipos básicos, inferência, `any` × `unknown`

**Arquivo:** `src/playground/ex02.ts`

**Estudar:** `string`/`number`/`boolean`/`null`/`undefined`, arrays, inferência, anotação explícita, `any` × `unknown`.

```ts
let name = 'Ana';              // inferido: string — NÃO escreva `: string` aqui
let age: number;               // sem valor inicial: anote
const tags: string[] = [];     // array vazio: anote, senão vira never[]

name = 42;                     // TS2322: Type 'number' is not assignable to type 'string'
```

```ts
const fromApi: any = JSON.parse(raw);
fromApi.whatever.deep.nonsense;     // compila. explode em runtime.

const safe: unknown = JSON.parse(raw);
safe.whatever;                      // TS18046: 'safe' is of type 'unknown'
if (typeof safe === 'string') safe.toUpperCase();   // aqui pode: você provou
```

**Inferência primeiro.** O TS deduz o tipo do valor inicial, e o estilo idiomático é **deixar inferir** — anotar `const name: string = 'Ana'` é ruído. Anote quando não há valor inicial, em parâmetro de função (ele nunca infere isso) e no retorno quando quiser travar o contrato.

**`let` × `const` mudam a inferência:** `let status = 'todo'` infere `string` (pode mudar depois); `const status = 'todo'` infere o tipo literal `"todo"` — só esse valor. Isso volta no Ex 05 e no Ex 11.

**`any` × `unknown` é a distinção que mais separa TS bom de TS de fachada:**

| | `any` | `unknown` |
|---|---|---|
| Aceita qualquer valor | ✅ | ✅ |
| Deixa usar sem checar | ✅ — **desliga o compilador** | ❌ — tem que provar antes |
| Erro aparece | em runtime, no cliente | na hora, no editor |

`any` é uma escotilha: o valor entra e a checagem **para de existir** dali pra frente, inclusive nas variáveis que derivam dele. `unknown` diz a mesma coisa ("não sei o que é") sem abrir mão da segurança — você só usa depois de estreitar com `typeof`, `in`, ou um type predicate (Ex 07). Regra prática: **`unknown` na borda, `any` nunca** — quando `any` parecer a única saída, o problema quase sempre é falta de validação.

- **Ex 02** — três blocos com comentário separando: (a) declare 5 variáveis deixando inferir e uma que precise de anotação — em cada uma, force um erro de atribuição e cole a mensagem; (b) prove a diferença `let` × `const` na inferência de um literal (hover do editor, anote o que aparece); (c) o **mesmo dado** vindo de `JSON.parse`, uma vez como `any` e uma como `unknown` — acesse uma propriedade inexistente nos dois, mostre que só um reclama, e faça a versão `unknown` compilar com uma checagem. Feche com uma linha: quando você usaria `any` de propósito?

---

## Ex 03 — 🔨 `interface` × `type`

**Arquivo:** `src/playground/ex03.ts`

**Estudar:** `interface`, `type`, campo opcional `?`, `readonly`, excess property checking.

```ts
interface User {
  readonly id: number;      // não pode ser reatribuído depois
  email: string;
  nickname?: string;        // opcional: string | undefined
}

type Point = { x: number; y: number };          // type também descreve objeto
type Id = string | number;                      // mas só type faz união
```

```ts
const u: User = { id: 1 };
// TS2741: Property 'email' is missing in type '{ id: number; }'

const v: User = { id: 1, email: 'a@b.com', admin: true };
// TS2353: Object literal may only specify known properties, and 'admin' does not exist in type 'User'
```

**As duas mensagens são bem diferentes,** e a segunda surpreende: o objeto tem tudo que `User` pede, só traz um campo **a mais** — em JS isso é inofensivo. O TS reclama mesmo assim, e a regra se chama **excess property checking**: ela só vale para **objeto literal atribuído direto**. Se o objeto passar por uma variável intermediária, o extra passa. Existe porque campo a mais em literal é quase sempre typo (`nickname` → `nickName`) ou dado que você acha que está salvando e não está.

**Campo opcional não é campo nullable.** `nickname?: string` significa `string | undefined` — a chave pode nem existir. Você é obrigado a checar antes de usar (`user.nickname?.toUpperCase()`), e é justamente por isso que o `strict` vale a pena.

**`interface` × `type`:** para descrever objeto, os dois funcionam e a diferença é quase estética. `interface` faz **declaration merging** e costuma ser preferida para contratos públicos; `type` é obrigatório para união, interseção e tipos derivados de utilities (Ex 10). Escolha uma convenção e mantenha no tema inteiro — e saiba defender.

> ⚠️ **A `Task` deste exercício vai mudar no Ex 05.** Modele com `done: boolean` agora; o Ex 05 vai **substituir** esse campo por `status`, e você vai voltar aqui para acertar os objetos que quebrarem. Isso é de propósito — ver o compilador te levar até cada lugar afetado é metade do valor do Ex 05.

- **Ex 03** — modele a `Task` da sua API do T2: `id`, `title`, `done`, e um campo opcional à sua escolha. Depois: (a) objeto sem campo obrigatório, cole a mensagem; (b) objeto com campo extra atribuído **direto**, cole a mensagem; (c) o **mesmo objeto extra** passando por uma variável intermediária antes — mostre que compila e escreva por que; (d) marque `id` como `readonly` e tente reatribuir. Feche com sua convenção `interface` × `type` justificada em uma linha.

---

## Ex 04 — 🔨 União e narrowing

**Arquivo:** `src/playground/ex04.ts`

**Estudar:** tipo união `A | B`, narrowing com `typeof`/`Array.isArray`/`in`, o hover como ferramenta.

```ts
function describe(value: string | number) {
  value.toFixed(2);              // TS2339: não existe em string

  if (typeof value === 'number') {
    return value.toFixed(2);     // aqui é number — o TS sabe
  }
  return value.toUpperCase();    // aqui só sobrou string
}
```

Um tipo união diz "**um destes**, não sei qual". Enquanto o TS não souber qual, ele só deixa você usar o que os dois têm em comum — daí o erro na primeira linha.

**Narrowing** é o TS acompanhando o seu raciocínio: dentro do `if` o tipo *afunila* para `number`; depois do `return`, o `else` implícito só pode ser `string`. Você não anotou nada — o **fluxo do código** foi a prova, e isso se chama control flow analysis.

**Passe o mouse por cima da variável em cada linha.** Ver `string | number` virar `number` dentro do `if` e `string` depois do return é a coisa mais útil que você faz aqui — é assim que se depura tipo, não decorando regra.

Ferramentas de narrowing: `typeof` para primitivos · `Array.isArray()` · `in` para checar chave · `instanceof` para classes · comparação com literal · checagem de null (`if (value != null)`). Para objetos que você mesmo definiu, `typeof` não serve — todos são `"object"`; a solução é o Ex 07.

- **Ex 04** — função que recebe `string | number` e faz algo diferente em cada caso. Antes do `if`, tente usar um método que só existe num dos dois e cole o erro. Depois: (a) implemente com narrowing e **anote o que o hover mostra em 3 pontos** (antes do `if`, dentro, depois); (b) uma segunda função com `string[] | string` usando `Array.isArray`; (c) tente estreitar dois **objetos** com `typeof` e mostre por que não funciona — deixe registrado, é a ponte pro Ex 07.

---

## Ex 05 — 🔨 União literal no lugar de enum

**Arquivo:** `src/playground/ex05.ts`

**Estudar:** tipo literal, união literal, `as const`, por que não usar `enum`, exaustividade com `never`.

```ts
type Role = 'admin' | 'editor' | 'viewer';

let role: Role = 'editor';
role = 'editorr';
// TS2322: Type '"editorr"' is not assignable to type 'Role'

const ROLES = ['admin', 'editor', 'viewer'] as const;   // readonly ["admin", ...]
type RoleFromArray = typeof ROLES[number];              // mesma união, derivada
```

Um tipo literal é um tipo com **um valor só**. A união de literais vira um conjunto fechado, e o typo vira erro de compilação em vez de bug silencioso — em JS `status = 'doen'` só aparece quando o filtro não acha nada, três telas depois.

**`as const`** congela o array (`readonly`) e preserva os literais em vez de alargar para `string[]`. O `typeof ROLES[number]` extrai a união a partir dele — você tem a lista em runtime (pra validar, pra popular um select) e o tipo derivado dela, sem manter as duas em sincronia na mão.

**Por que não `enum`:** o `enum` **gera código JavaScript** — é a única construção de tipo que sobrevive à compilação, o que quebra a regra mental "tipos somem". Ele cria um tipo nominal que não aceita a string equivalente (`'admin'` não é `Role.Admin`), atrapalha na borda onde o dado chega como string crua, e não funciona com `isolatedModules`. A união literal é mais simples, some no build e conversa direto com JSON. É pergunta de entrevista que separa quem decorou de quem entendeu.

**Exaustividade** — o compilador te avisando quando você esquece um caso:

```ts
function label(role: Role): string {
  switch (role) {
    case 'admin':  return 'Administrador';
    case 'editor': return 'Editor';
    default:
      const exhaustive: never = role;   // se faltar 'viewer', ERRO aqui
      return exhaustive;
  }
}
```

Se todos os casos foram tratados, o que chega no `default` é `never` (nada sobrou) e a atribuição compila. Falta um? O tipo restante não cabe em `never` e o erro **aponta exatamente o esquecido**. Amanhã, quando alguém adicionar `'guest'` à união, este switch quebra o build — que é o comportamento que você quer.

- **Ex 05** — **substitua** o `done: boolean` da sua `Task` por `status: 'todo' | 'doing' | 'done'` (substituir, não adicionar: dois campos para o mesmo estado permitem `done: false` com `status: 'done'`, e aí nenhum dos dois é confiável). Antes de consertar nada, rode `npm run typecheck` e **cole a lista de tudo que quebrou** — é o compilador te dando o roteiro da refatoração. Depois: (a) atribua `'doen'` e cole o erro; (b) função que devolve rótulo por status com `switch` + `never` no default; (c) **remova um `case`** de propósito e cole o erro na linha do `never` — leia com atenção, o tipo que sobrou está escrito nele; (d) declare a lista com `as const` e derive o tipo com `typeof ...[number]`. Uma linha: o que você perde ao usar `enum` aqui?

---

## Ex 06 — 🔨 Tipar funções e bordas (`unknown` até provar o contrário)

**Arquivo:** `src/playground/ex06.ts`

**Estudar:** parâmetros e retorno, `void`, a fronteira do sistema.

```ts
function createUser(email: string, nickname?: string): User {
  return { id: Date.now(), email, nickname };
}

const log = (msg: string): void => { console.log(msg); };   // não retorna nada
```

**Parâmetro o TS nunca infere** — sem anotação ele é `any` implícito, e com `strict` isso já é erro (`noImplicitAny`). **Retorno ele infere bem**, mas anotar tem uma vantagem: o erro aparece *dentro* da função, na linha errada de verdade, em vez de estourar lá longe em quem chamou.

**Onde `unknown` entra na sua API:** tudo que atravessa a fronteira do processo chega sem garantia nenhuma — `req.body`, `req.query`, `JSON.parse`, resposta de `fetch`, variável de ambiente. O tipo que você *declara* para esses dados é uma **promessa que ninguém verificou**:

```ts
const task = req.body as Task;    // mentira. o cliente pode ter mandado {}
task.title.trim();                // compila liso, explode em produção
```

O compilador aceita porque você mandou. Daí a regra: **borda recebe `unknown`, e a única saída de `unknown` é validação em runtime.** A função de validação é o ponto de tradução entre "dado que chegou" e "tipo em que confio". No Tema 6 o `zod` faz isso gerando o tipo a partir do schema; aqui você escreve na mão pra entender o que ele automatiza.

**Sobre `void`:** "o retorno não interessa" — diferente de `undefined`, que é um valor específico.

- **Ex 06** — escreva `parseTask(input: unknown): Task` que checa cada campo e lança em caso inválido. Antes: (a) tente ler `input.title` sem checar nada e cole o erro; (b) escreva a versão preguiçosa com `as Task`, mostre que **compila**, e prove com um objeto vazio que quebra em runtime — cole o erro do Node; (c) agora a versão honesta; (d) chame as duas com `JSON.parse('{}')` e compare. Feche com uma frase: por que o `as` compilou?

---

## Ex 07 — 🔨 Type predicates

**Arquivo:** `src/playground/ex07.ts`

**Estudar:** assinatura `x is T`, predicate × função booleana comum, `.filter` com predicate.

```ts
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' && value !== null &&
    'email' in value && typeof (value as User).email === 'string'
  );
}

const data: unknown = JSON.parse(raw);

if (isUser(data)) {
  data.email.toLowerCase();   // aqui data é User — o TS aceitou a prova
}
```

O problema do Ex 04 volta: `typeof` não distingue objetos, todos são `"object"`. Um **type predicate** resolve trocando o retorno `boolean` por `value is User` — "se esta função devolver true, pode tratar o argumento como `User` dali pra frente". Sem o `is`, a função devolve só `boolean` e o narrowing **não acontece**: dentro do `if` o valor continua `unknown`.

**O que o TS não faz: ele não confere se a checagem está certa.** Você pode escrever `function isUser(v: unknown): v is User { return true; }` e o compilador aceita numa boa. O predicate é uma **promessa sua** — o TS te dá o poder de estreitar e a responsabilidade de merecer. Predicate mentiroso é pior que `any`, porque parece seguro. Por isso ele anda de mãos dadas com teste: no Ex 13 essa função ganha caso feliz e casos de borda.

**O uso que economiza mais tempo no dia a dia:**

```ts
const values: (string | null)[] = ['a', null, 'b'];

values.filter(v => v !== null);                    // (string | null)[]  ← não estreitou
values.filter((v): v is string => v !== null);     // string[]           ← estreitou
```

- **Ex 07** — escreva `isTask(value: unknown): value is Task` cobrindo todos os campos (incluindo o `status` do Ex 05 — cheque contra a lista de valores válidos). Depois: (a) use num `if` e mostre com hover o `unknown` virando `Task`; (b) **remova o `is Task`**, deixe `boolean`, e cole o erro que aparece dentro do `if`; (c) escreva a versão mentirosa (`return true`), mostre que compila, e prove em runtime que ela quebra; (d) um array `(Task | null)[]` filtrado com e sem predicate — cole o tipo resultante nos dois casos.

---

## Ex 08 — 🔨 Discriminated unions

**Arquivo:** `src/playground/ex08.ts`

**Estudar:** campo discriminante, narrowing por literal, o padrão `Result`.

```ts
type FetchState =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string };

function render(state: FetchState) {
  if (state.status === 'success') return state.data.length;   // só aqui `data` existe
  if (state.status === 'error')   return state.message;       // só aqui `message` existe
  return 'carregando...';
}
```

Uma **discriminated union** é uma união de objetos que compartilham um campo com valor **literal e diferente** em cada membro. Comparar esse campo estreita o objeto inteiro: no ramo do `'success'`, o `data` existe e o `message` não. Ler `state.message` no ramo errado é erro de compilação, não `undefined` silencioso.

**O que isso substitui:** o objeto com tudo opcional — `{ ok?: boolean; data?: User[]; error?: string }` — que obriga `if (result.data)` em todo lugar e permite estados impossíveis, como `ok: true` com `error` preenchido. Na união, o estado impossível **não é representável**. Essa frase — *make illegal states unrepresentable* — é o resumo do exercício.

**O padrão `Result`** aplica isso a operações que podem falhar:

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
```

É a alternativa a lançar exceção: o erro vira **valor de retorno tipado**, e quem chama é obrigado pelo compilador a olhar o `ok` antes de acessar o `value`. Exceção não aparece na assinatura — nada em `function parse(x): Task` avisa que ela pode lançar. Com `Result`, a possibilidade de falha está no tipo. O custo é verbosidade. Times sérios usam os dois: `Result` em erro esperado (validação falhou), exceção em erro excepcional (banco caiu).

- **Ex 08** — defina `type Result = { ok: true; task: Task } | { ok: false; error: string }` e reescreva o `parseTask` do Ex 06 para **devolver `Result` em vez de lançar**. Depois: (a) consuma com narrowing e mostre que acessar `result.task` antes de checar `result.ok` é erro — cole a mensagem; (b) um `switch` exaustivo sobre o `status` com o truque do `never`; (c) 2 frases: qual das duas versões do `parseTask` você leva pra API do Ex 14, e por quê. **Guarde a resposta** — é decisão de contrato, igual às do T2.

---

## Ex 09 — 🔨 Generics (e o `undefined` que o `strict` te obriga a encarar)

**Arquivo:** `src/playground/ex09.ts`

**Estudar:** parâmetro de tipo `<T>`, inferência de `T`, `extends` como restrição, `strictNullChecks` na prática.

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

firstItem([1, 2, 3]);          // number | undefined  — T virou number sozinho
firstItem(['a', 'b']);         // string | undefined
```

```ts
interface ApiResponse<T> {
  data: T;
  requestId: string;
}

const res: ApiResponse<User[]> = { data: [], requestId: 'abc' };
res.data[0].email;             // tipado até o fim, sem nenhum `as`
```

Um generic é um **parâmetro de tipo**: em vez de fixar `number[]`, a função recebe o tipo junto com o valor e devolve conforme o que entrou. Com `any[]` a função também aceitaria tudo, mas o retorno viraria `any` e a checagem morreria ali. O generic **preserva** a informação em vez de apagá-la. E você não escreve `firstItem<number>([1,2,3])` — o TS infere `T` do argumento; anota só quando não há de onde inferir.

**Restrição com `extends`** — `<T>` sozinho aceita qualquer coisa, então dentro da função você não pode assumir nada sobre `T`:

```ts
function getId<T extends { id: number }>(item: T): number {
  return item.id;              // só compila por causa do extends
}
```

**Agora a parte que mais vai te incomodar — e a mais importante do tema.** Repare no `| undefined` do retorno: `items[0]` num array vazio é `undefined`. Quem coloca isso ali é o `strictNullChecks`, e ele não é decorativo:

```ts
const found = tasks.find(t => t.id === 7);
found.title;                   // TS18048: 'found' is possibly 'undefined'

if (!found) return null;       // agora sim
found.title;
```

Sem `strictNullChecks`, `find()` retornaria `Task` e essa linha compilaria — e você descobriria em produção, no dia em que o id não existisse. **É essa flag que paga o preço do TypeScript**, e ela é exatamente o que vai te salvar no Tema 4, quando `result.rows[0]` do Postgres vier vazio numa query que não achou nada.

- **Ex 09** — implemente `firstItem<T>` e chame com 3 arrays de tipos diferentes, anotando o tipo inferido (hover). Depois: (a) a mesma função com `any[]`, mostrando com um acesso a propriedade inexistente o que se perdeu; (b) `ApiResponse<T>` usado com `Task` e `Task[]`, acessando um campo em cada, sem `as`; (c) função com `<T extends { id: number }>`, chamada com objeto sem `id` — cole o erro; (d) **o exercício do `undefined`:** array de `Task`, um `find()` por id, e acesse `.title` direto — cole o `TS18048`. Depois trate de **três** formas (early return, `?.`, e `??` com default) e escreva em uma linha qual delas você usaria numa rota `GET /tasks/:id` e por quê.

---

## Ex 10 — 🔨 Utility types

**Arquivo:** `src/playground/ex10.ts`

**Estudar:** `Partial`, `Omit`, `Pick`, `Required`, `Readonly`, tipos derivados × redigitados.

```ts
interface User { id: number; email: string; nickname?: string; createdAt: Date }

type NewUser = Omit<User, 'id' | 'createdAt'>;   // o que o cliente manda no POST
type UserPatch = Partial<Omit<User, 'id'>>;      // o que o cliente manda no PATCH
type UserPreview = Pick<User, 'id' | 'email'>;   // o que aparece numa listagem
```

Utility types **derivam** um tipo de outro em vez de duplicá-lo. `Partial<T>` deixa todos os campos opcionais · `Required<T>` faz o inverso · `Omit<T, K>` remove chaves · `Pick<T, K>` mantém só as escolhidas · `Readonly<T>` trava reatribuição.

**Por que isso importa mais do que parece:** as três variações acima são as três formas da mesma entidade nas bordas da sua API — corpo do POST (sem `id`, que o banco gera), corpo do PATCH (tudo opcional por definição), resposta resumida. Redigitadas à mão, elas **desandam**: você adiciona `priority` na `Task` no Tema 6, atualiza duas das quatro definições, e o compilador não reclama porque cada uma é um tipo válido por si. Derivadas, um campo novo se propaga sozinho e o que precisar de ajuste quebra o build na hora.

**A pegadinha do `Partial` no PATCH:** ele torna tudo opcional, inclusive **tudo ao mesmo tempo** — `{}` é um `TaskPatch` válido. Um PATCH vazio passa pelo tipo e não deveria passar pela sua rota. Lembrete de que tipo não é validação: essa regra ("pelo menos um campo") vive em runtime.

- **Ex 10** — a partir da sua `Task`, derive `NewTask` (corpo do POST, sem `id`), `TaskPatch` (corpo do PATCH) e `TaskPreview` (sua escolha de campos numa listagem). Depois: (a) escreva as assinaturas `createTask(input: NewTask): Task` e `patchTask(id: number, input: TaskPatch): Task`, chame cada uma com objeto inválido e cole os dois erros; (b) prove que `{}` satisfaz `TaskPatch` e escreva em uma linha onde essa regra deveria ser checada de verdade.

  (c) **O experimento do campo novo — leia antes de fazer.** Adicione `priority: 'low' | 'high'` à `Task` e rode `npm run typecheck`. Vai quebrar em vários arquivos anteriores (Ex 03, 06, 07 pelo menos) — **é esse o ponto**: cole a lista de erros e repare que os três tipos derivados se atualizaram sozinhos, sem você tocar neles. Depois **reverta o campo** e confirme que o typecheck volta a ficar limpo antes de commitar. Se quiser manter o `priority` de verdade, mantenha — mas aí conserte todos os arquivos, não deixe o tema com erro pendente.

---

## Ex 11 — 🔨 `as` × `satisfies`

**Arquivo:** `src/playground/ex11.ts`

**Estudar:** type assertion (`as`), `as const`, `satisfies`, quando cada um é legítimo.

**`as` não converte nada.** É você dizendo ao compilador "para de checar, eu sei o que estou fazendo" — nenhum código roda, nenhuma verificação acontece:

```ts
const user = {} as User;
user.email.toLowerCase();   // compila. TypeError em runtime.
```

Essa é a mentira mais comum em código TS de iniciante, e ela sempre cobra o preço em runtime, longe da linha que a causou.

**`satisfies` (TS 4.9+) checa sem substituir.** A diferença com a anotação `:` é sutil e é o ponto do exercício:

```ts
// anotação: o tipo da variável VIRA o tipo declarado
const configA: { port: number; env: 'development' | 'production' } = {
  port: 3000,
  env: 'development',
};
configA.env;   // 'development' | 'production'  ← alargou pro declarado

// satisfies: valida contra o alvo, mas o tipo continua sendo o INFERIDO
const configB = {
  port: 3000,
  env: 'development',
} satisfies { port: number; env: 'development' | 'production' };

configB.env;   // 'development'  ← o específico sobreviveu
```

Nos dois casos, `env: 'developement'` daria erro. A diferença aparece **depois**, em quem consome a variável: com `satisfies` você mantém a informação mais específica.

O ganho fica mais evidente quando o alvo é **mais largo** que o valor:

```ts
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;

palette.green.toUpperCase();   // ok: green é string, não 'string | number[]'
palette.red[0];                // ok: red é number[]
```

Com anotação `: Record<string, string | number[]>`, as duas linhas exigiriam narrowing antes.

> ⚠️ **Verifique você mesmo antes de estudar por isso.** As regras de alargamento de literal em propriedade mutável são das partes mais sutis do TS, e a versão anterior deste arquivo errou exatamente aqui. Passe o mouse em `configA.env` e `configB.env` e **anote o que o seu editor mostra**, na sua versão do TS. Se divergir do que está escrito acima, o certo é o seu editor — me avise que eu corrijo o material.

**Quando `as` é legítimo:** `as const` (que é outra coisa — congela literais) · `as unknown as T` em teste, deliberadamente, para montar um objeto parcial · estreitar depois de uma checagem que o TS não consegue seguir. Fora disso, `as` na borda de dados externos é dívida, e quem paga é o runtime.

- **Ex 11** — (a) monte uma `Task` com `as` mentindo (`{} as Task` serve), rode, e **cole o erro de runtime** que o compilador engoliu; (b) o mesmo objeto de config duas vezes, uma com `:` e outra com `satisfies` — **cole o que o hover mostra** em cada, e diga se bate com o texto acima; (c) provoque um erro **de compilação** com `satisfies` (valor fora da união) e cole a mensagem; (d) o caso do alvo mais largo (`Record<...>`), mostrando um método que só funciona na versão `satisfies`. Feche com uma regra sua, em uma linha, sobre quando `as` é aceitável neste projeto.

---

## Ex 12 — 🔨 O `tsconfig`

**Arquivos:** `tsconfig.json` + `tsconfig.build.json` + `ex12.md`

**Estudar:** `strict` e suas flags, `rootDir`/`outDir`, `include`/`exclude`, dois configs, o que vai pro `dist/`.

**`strict: true` é um guarda-chuva** de várias flags. As duas que mais mudam o seu dia:

- **`strictNullChecks`** — a do Ex 09. Sem ela, `null` e `undefined` cabem em qualquer tipo e o TS deixa passar exatamente a classe de bug mais comum de JS.
- **`noImplicitAny`** — parâmetro sem anotação vira erro em vez de virar `any` calado.

Desligar o `strict` em projeto novo é abrir mão da maior parte do valor do TS e ficar só com o custo da sintaxe. Ligue no dia 1 — projeto legado que migra é outra conversa.

**Por que dois arquivos de config.** O `tsconfig.json` é a **checagem**: pega tudo em `src/`, testes e playground incluídos — você quer que o `npm run typecheck` reclame de um teste quebrado. O `tsconfig.build.json` é a **entrega**: estende o primeiro e exclui teste e playground, porque código de teste em produção é peso morto e superfície de ataque a mais. Um `exclude` só no config principal resolveria o build e cegaria a checagem; é por isso que são dois.

E o `dist/` **não vai pro git** — é gerado, reproduzível com `npm run build`, e commitá-lo gera conflito em toda alteração.

- **Ex 12** — três experimentos, resultado anotado no `ex12.md`:

  **(a) O que o `strict` está segurando.** Rode `npm run typecheck` (tem que estar limpo), depois mude `"strict": false` e rode de novo. Conte quantos erros sumiram e cole 3.
  
  > **Se não sumir nenhum**, o experimento não falhou — significa que você escreveu tudo certo. Nesse caso, **plante os casos**: com o `strict` desligado, escreva (1) uma função com parâmetro sem anotação, (2) um acesso direto ao resultado de um `find()` sem checar `undefined`, (3) uma variável `string` recebendo `null`. Confirme que os três compilam. **Religue o `strict`** e cole os três erros que aparecem. Essa é a resposta de verdade do exercício.

  **(b) O build.** `npm run build` e liste o que apareceu em `dist/`. Confirme que **não** há `.test.js` nem `playground/` lá dentro, e que o `dist/` está no `.gitignore`.

  **(c) O JS puro.** Rode um arquivo de `dist/` direto com `node` e mostre que funciona — sem `tsx`, sem TypeScript envolvido. É o que a plataforma de deploy vai fazer no Tema 9.

  Feche com: o que exatamente o `strictNullChecks` te obrigou a fazer no Ex 09?

---

## Ex 13 — 🔨 Testes em TS

**Arquivos:** `src/task.ts` + `src/task.test.ts`

**Estudar:** vitest com TS, `tsc --noEmit` antes dos testes, testar o que o tipo **não** garante.

```jsonc
// package.json
"scripts": {
  "typecheck": "tsc --noEmit",
  "test": "npm run typecheck && vitest run"
}
```

```ts
import { describe, it, expect } from 'vitest';
import { isTask, parseTask } from './task.js';   // .js mesmo em TS — ver a nota do checklist

it('rejeita objeto sem title', () => {
  const result = parseTask({ id: 1, status: 'todo' });
  expect(result.ok).toBe(false);
});
```

O vitest roda `.ts` direto (usa esbuild por baixo), então não há passo de build para testar. **Mas ele não checa tipos** — ele apaga as anotações e executa. Um arquivo cheio de erro de tipo pode ter a suíte verde. Por isso `tsc --noEmit` entra **antes** do vitest: é a checagem completa, sem gerar arquivo. Assim `npm test` reprova tanto por lógica quebrada quanto por tipo quebrado — e é esse mesmo comando que vai rodar no CI do Tema 10.

**O que testar num tema de tipos** — a ideia central: **teste o que o tipo não garante.** Não faz sentido testar que `createTask` devolve um objeto com `title` string; o compilador já provou. Faz todo sentido testar `isTask` e `parseTask` com lixo de verdade — `{}`, `null`, `{ status: 'doen' }`, string no lugar de objeto — porque é aí que a promessa do tipo encontra o mundo real. **A borda é onde o teste ganha do compilador.**

- **Ex 13** — mova `Task`, `Result`, `isTask` e `parseTask` do playground para `src/task.ts` (agora são código de produção, não rascunho) e escreva `src/task.test.ts` cobrindo:

  - `parseTask` com objeto válido → `ok: true` e a task de volta
  - `parseTask` com `{}`, `null`, `undefined`, `'texto'`, `{ status: 'doen' }`, e um campo com tipo errado → `ok: false` em todos
  - `isTask` com caso feliz e pelo menos 3 casos de borda

  Depois: (a) configure o script `test` com o `typecheck` na frente e prove que **um erro de tipo reprova a suíte** — cole a saída; (b) prove que sem o `typecheck` a mesma suíte passaria; (c) ache um caso de lixo que a sua `parseTask` **deixa passar** e conserte (se não achar nenhum, liste os que tentou). `npm test` verde no fim.

---

## Ex 14 — 🔨 Portar a API do T2 para TypeScript

**Arquivos:** `src/app.ts` + `src/server.ts` + `src/routes/tasks.routes.ts` + `src/app.test.ts`

**Estudar:** `@types/express`, tipar `req`/`res`, o `req.body` que chega como `any`, o tratador de erro tipado.

Este é o exercício que fecha o tema. Os 13 anteriores foram no playground; agora os tipos vão para dentro de um servidor que sobe. **A API que sai daqui é a que o Tema 4 pluga no PostgreSQL** — de hoje em diante a versão oficial é esta, e a do `t02-express/ex13/` fica congelada como histórico.

**Copie, não redigite.** Traga os arquivos do `t02-express/ex13/` para `src/` e renomeie para `.ts` — daí em diante o exercício é consertar o que o compilador reclamar e tipar o que faltou. Do T3 em diante a regra da etapa mudou: a pasta nova nasce da cópia da anterior, e o tema é o que você **acrescenta** nela. Redigitar do zero era revisão embutida enquanto a API cabia numa tarde; agora é hora perdida.

```bash
npm install express
npm install -D @types/express supertest @types/supertest
```

O Express não vem com tipos embutidos — eles moram num pacote separado, `@types/express`, mantido pela comunidade no DefinitelyTyped. Isso vale para boa parte das libs JS antigas: se o editor reclamar `Could not find a declaration file for module 'x'`, a resposta quase sempre é `npm i -D @types/x`.

```ts
import express, { type Request, type Response, type NextFunction } from 'express';

const app = express();
app.use(express.json());

app.get('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);        // params é string — o T2 já tinha ensinado
  // ...
});
```

**A descoberta desconfortável deste exercício:** `req.params.id` é `string` (o TS sabe), mas **`req.body` é `any`**. O Express não tem como saber o que o cliente mandou, então o tipo dele é a escotilha do Ex 02 — o compilador para de te proteger exatamente no ponto de entrada mais perigoso da aplicação. É o Ex 06 virando realidade: `req.body` é a borda, e a borda pede `unknown` + validação. O `parseTask` do Ex 13 é a ponte, e é por isso que ele existe.

**O tratador de erro central** (aquele de 4 parâmetros do T2) precisa dos quatro tipados, senão o TS não o distingue de um middleware comum:

```ts
app.use((err: Error, req: Request, res: Response, next: NextFunction) => { ... });
```

- **Ex 14** — porte para TypeScript, mantendo o comportamento e o **seu formato de erro** do T2:

  - `GET /tasks` e `GET /tasks/:id`
  - `POST /tasks` (201 + `Location`)
  - `PATCH /tasks/:id` e `DELETE /tasks/:id`
  - o router em `routes/tasks.routes.ts`, o `validateId` como middleware, o tratador de erro central, o 404 coringa

  Com estas exigências:

  1. **O armazenamento em memória é tipado:** `const tasks: Task[] = []`, com a `Task` do Ex 13 importada — não redeclare o tipo aqui.
  2. **`req.body` não entra na aplicação sem passar pelo `parseTask`.** Nenhum `as Task` em rota nenhuma. Se der vontade de escrever um, pare e me chame — é o erro que o tema inteiro tenta prevenir.
  3. **Use os derivados do Ex 10:** o POST recebe `NewTask`, o PATCH recebe `TaskPatch`.
  4. **`npm run build` gera um `dist/` que roda:** `node dist/server.js` sobe a API, e um `curl` nela responde. Cole o curl.
  5. **`src/app.test.ts` com supertest**, cobrindo caso feliz e caso de erro de cada rota — a mesma suíte do Ex 13 do T2, agora em TS. `npm test` verde (typecheck + vitest).

  Ao final, no `ex14.md` ou no README: **3 coisas que o TypeScript te obrigou a mudar** no código que já funcionava em JavaScript. Não "3 coisas que ficaram mais bonitas" — 3 lugares onde o compilador apontou algo que o seu JS deixava passar. Se você não achar nenhum, isso também é resposta, e é uma resposta interessante.

---

## Fechamento do tema

**Arquivo:** `README.md` na pasta do tema

- O que cada arquivo faz, em uma linha
- Como rodar (`npm run dev`, `npm run build`, `npm test`) e como subir o build (`node dist/server.js`)
- **As suas decisões deste tema**, que viram contrato daqui pra frente: convenção `interface` × `type` · regra sobre `as` · `Result` × exceção no `parseTask`
- **3 coisas que te surpreenderam**
- **1 coisa que ficou mal resolvida** — eu uso no checkpoint

**Checkpoint do tema** (verde/amarelo/vermelho): me chame quando os 14 estiverem commitados e no push. Faço o **code review de tudo** em formato antes→depois — e é **neste checkpoint que a data da avaliação (28/09) é confirmada ou antecipada**, com o ritmo dos três primeiros temas na mesa.

---

## Como pedir ajuda nesta fase

✅ "Me explica por que esse `unknown` não deixa eu acessar" · "Meu Ex 07 dá esse erro: [erro completo]" · "Terminei o Ex 05, revisa"
❌ "Escreve o type predicate pra mim" · "Me dá o tsconfig pronto"

Travou mais de 30 min no mesmo ponto? Me chame — descrevendo **o que você já tentou**. Erro de TypeScript é longo e assusta: cole ele **inteiro**, com o código do erro; metade da mensagem esconde o motivo real.
