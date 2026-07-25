# Estudo — TypeScript (Tema 3)

> Formato do plano (regra 6): **Parte A** = manual de consulta (por tópico: o que resolve · quando usar · exemplo · armadilhas) · **Parte B** = aplicação na `api/` · **Parte C** = questionário (respondido no devlog).

---

# Parte A — Manual de consulta

## 1. O que o TS faz (e o que não faz)
**O que resolve?** Pega erro de tipo **antes de rodar** (compilação), inclusive nos caminhos que você nunca testou — em vez de o JS quebrar em produção quando a linha executa.
**Quando usar?** Sempre, num projeto novo. É a base do resto.
**Exemplo:**
```ts
function totalPrice(order: { price: number; quantity: number }) { return order.price * order.quantity; }
totalPrice({ price: '10', quantity: 3 }); // TS2322: 'string' não é 'number'
```
**Armadilhas:** o TS **some em runtime** — não existe checagem gerada por ele. Dado que vem de fora (`req.body`, `JSON.parse`) pode ser qualquer coisa; tipo não valida, só promete. Validação de verdade é em runtime (tópico 7).

## 2. Tipos, inferência, `any` × `unknown`
**O que resolve?** Deixa o TS deduzir o tipo do valor (inferência) e te dá duas portas pra "não sei o que é": uma insegura (`any`) e uma segura (`unknown`).
**Quando usar?** Deixa inferir por padrão. Anota só parâmetro, valor sem inicialização, e retorno que quer travar. `unknown` na borda; `any` nunca.
**Exemplo:**
```ts
let name = 'Ana';               // inferido string — não anote
const x: unknown = JSON.parse(s);
if (typeof x === 'string') x.toUpperCase(); // só depois de provar
```
**Armadilhas:** `any` **desliga o compilador** dali pra frente — o erro reaparece em runtime, no cliente. `let` infere o tipo largo (`string`), `const` infere o literal (`'todo'`).

## 3. `interface` × `type`, `?`, `readonly`
**O que resolve?** Descrever a forma de um objeto. `?` = campo opcional; `readonly` = não reatribui.
**Quando usar?** Convenção do projeto: **entidade = `interface`** (`Task`), **derivados/uniões = `type`**. `readonly` em id; `?` no que pode faltar.
**Exemplo:**
```ts
interface Task { readonly id: number; title: string; term?: string }
type Id = string | number; // só type faz união
```
**Armadilhas:** excess property checking — objeto literal com campo a mais dá `TS2353`, mas só quando atribuído direto (via variável intermediária, passa). `campo?` é "ausente ou o tipo", não `null`.

## 4. União e narrowing
**O que resolve?** `A | B` diz "um dos dois"; narrowing é você estreitar pro tipo certo com uma checagem, e o TS acompanhar.
**Quando usar?** Sempre que um valor pode ser mais de um tipo (ou `null`).
**Exemplo:**
```ts
function f(v: string | number) {
  if (typeof v === 'number') return v.toFixed(2); // aqui é number
  return v.toUpperCase();                         // aqui só string
}
```
**Armadilhas:** `typeof` **não distingue objetos** — todos são `"object"`. Pra objeto teu, use type predicate (tópico 7).

## 5. União literal (no lugar de `enum`)
**O que resolve?** `'todo' | 'doing' | 'done'` = conjunto fechado; typo vira erro de compilação.
**Quando usar?** Todo campo com valores fixos (status, role, etc.). Prefira à `enum`.
**Exemplo:**
```ts
type Status = 'todo' | 'doing' | 'done';
let s: Status = 'todo';
s = 'doen'; // TS2322
```
**Armadilhas:** `enum` gera JS (quebra "tipos somem") e atrapalha na borda com string crua. Pra exaustividade, `const x: never = valor` no `default` do switch avisa quando falta um caso.

## 6. Tipar funções e a borda
**O que resolve?** Contrato da função. E deixa claro que dado externo chega sem garantia.
**Quando usar?** Anota **parâmetro** (o TS nunca infere) e o retorno quando quer travar. `void` = retorno não importa.
**Exemplo:**
```ts
const task = req.body as Task; // MENTIRA: o cliente pode ter mandado {}
```
**Armadilhas:** a fronteira do processo (`req.body`, `req.query`, `env`, `fetch`) chega **sem garantia**. Declare `unknown` e valide em runtime — nunca `as` pra "convencer" o compilador.

## 7. Type predicates
**O que resolve?** Uma função que devolve `value is T`: se der `true`, o TS trata o valor como `T` dali pra frente. É o narrowing que funciona pra objeto teu.
**Quando usar?** Validar dado da borda (o `req.body`).
**Exemplo:**
```ts
function isTask(v: unknown): v is Task { /* checa cada campo */ return true; }
if (isTask(data)) data.title; // aqui é Task
```
**Armadilhas:** o TS **não confere** se a checagem está certa — predicate mentiroso (`return true`) compila e é pior que `any`. Por isso anda com teste.

## 8. Discriminated unions e `Result`
**O que resolve?** União de objetos com um campo literal diferente em cada; comparar esse campo estreita o objeto inteiro. Torna estado impossível não-representável.
**Quando usar?** Modelar estados (loading/success/error) ou retorno que pode falhar (`Result`).
**Exemplo:**
```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
```
**Armadilhas:** exceção não aparece na assinatura; `Result` deixa a falha visível no tipo, ao custo de verbosidade. (Decisão deste projeto: `parseTask` lança, não devolve `Result` — pra reusar o tratador central.)

## 9. Generics e `strictNullChecks`
**O que resolve?** `<T>` preserva o tipo através da função (em vez de apagar como `any`). `strictNullChecks` te obriga a tratar `undefined`.
**Quando usar?** Generics: função/estrutura que serve pra vários tipos. `strictNullChecks`: sempre ligado.
**Exemplo:**
```ts
const found = tasks.find(t => t.id === id); // Task | undefined
if (!found) return next(new AppError('Not Found', 404, 'id'));
found.title;
```
**Armadilhas:** sem tratar o `undefined` do `find`, o TS barra (`TS18048`) — é a flag que te salva no Postgres do T4 (`rows[0]` vazio). Numa rota `:id`, o certo é early return com 404.

## 10. Utility types
**O que resolve?** Derivar um tipo de outro em vez de redigitar. `Omit`/`Partial`/`Pick`/`Required`/`Readonly`.
**Quando usar?** As formas da entidade nas bordas: corpo do POST, do PATCH, listagem.
**Exemplo:**
```ts
type NewTask   = Omit<Task, 'id'>;
type TaskPatch = Partial<Omit<Task, 'id'>>;
```
**Armadilhas:** `Partial` aceita `{}` — um PATCH vazio passa pelo tipo. A regra "pelo menos um campo" é validação de runtime.

## 11. `as` × `satisfies`
**O que resolve?** `as` desliga a checagem (não converte nada). `satisfies` valida contra um alvo **sem** trocar o tipo inferido.
**Quando usar?** `as` quase nunca (só `as const`, ou `as unknown as T` em teste). `satisfies` pra validar um objeto mantendo o tipo específico.
**Exemplo:**
```ts
const cfg = { port: 3000, env: 'dev' } satisfies { port: number; env: 'dev' | 'prod' };
cfg.env; // 'dev' (específico), não alargado
```
**Armadilhas:** `as` na borda de dado externo é dívida — cobra o preço em runtime, longe da linha que causou.

## 12. `tsconfig` e o ambiente
**O que resolve?** Configura o compilador. `strict` liga as flags que pegam a maioria dos bugs. Dois configs: um checa tudo, o outro (`build`) exclui teste/playground do `dist/`.
**Quando usar?** No dia 1 do projeto.
**Exemplo:**
```jsonc
{ "compilerOptions": { "module": "nodenext", "moduleResolution": "nodenext", "strict": true } }
```
**Armadilhas:** ESM×CJS — `"type": "module"` (package.json) e `"module": "nodenext"` (tsconfig) têm que concordar, senão `ERR_MODULE_NOT_FOUND`. E o import leva `.js` mesmo o arquivo sendo `.ts`.

## 13. Testes em TS
**O que resolve?** Vitest roda `.ts` direto, mas **não checa tipo** — por isso `tsc --noEmit` entra antes (`"test": "npm run typecheck && vitest run"`).
**Quando usar?** Testa **o que o tipo não garante**: os validadores de borda com lixo real.
**Exemplo:**
```ts
it('rejeita objeto sem title', () => {
  expect(() => parseTask({})).toThrow(AppError);
});
```
**Armadilhas:** suíte verde não quer dizer tipos certos — sem o `typecheck` na frente, um arquivo cheio de erro de tipo passa. A borda (`{}`, `null`, `{ status: 'doen' }`) é onde o teste ganha do compilador.

---

# Parte B — Aplicação na `api/`

### 1. Preparação do ambiente
Copiar `t02-express/ex13/` → `etapas/etapa-2/api/`, renomear `.js` → `.ts`. `package.json` com `"type": "module"`. devDeps: `typescript`, `@types/node`, `tsx`, `vitest`, `@types/express`, `supertest`, `@types/supertest`, `@types/morgan`. runtime: `express`, `morgan`. Dois `tsconfig` (`strict` + `nodenext`; o `.build` exclui teste). Scripts `dev`/`typecheck`/`test`/`build`. `.gitignore` com `node_modules/` e `dist/`.

### 2. O que do tema deve ser usado na API
- **`Task`** modelada (`interface`, `id` readonly, `status` união literal) e **derivados** (`NewTask`, `TaskPatch`) das bordas.
- **`isNewTask`/`isPatchTask`** (type predicates) + **`parseTask`/`parsePatchTask`** (lançam `AppError`) — `req.body` só vira `Task` depois de provado, **sem `as`**.
- **5 rotas tipadas** (`req`/`res`/`next`), tratador de erro central tipado (`err: unknown` + `instanceof`), 404 coringa, 405.
- `req.params.id` → `number`; `find` por id → 404.
- Build gerando `dist/` executável com `node`.
- Testes (supertest) cobrindo caso feliz e erro de cada rota + os validadores com lixo.

### 3. Critérios
- `npm run typecheck` verde com o rigor escolhido; **nenhum `any`, nenhum `as` de borda**.
- API responde às 5 rotas; corpo inválido cai no formato de erro (não 500); id inexistente → 404.
- `npm test` verde (typecheck + vitest). `npm run build` roda e `node dist/server.js` sobe.
- `api/README.md` atualizado com as decisões do tema.

### 4. Aguardar execução
Você constrói. Commit conforme avança (`t03: ...`).

### 5. Revisão do código
Me chama no fim; eu leio a `api/` inteira e aponto de forma simples onde estão os erros e o que faltou, pra você corrigir.

---

# Parte C — Questionário

> Respostas no devlog da Etapa 2. Pelo menos uma pergunta por tópico da Parte A.

1. Qual a diferença entre um erro que o TypeScript pega e um que só aparece em runtime? Dê um exemplo de cada.
2. Por que se diz que "o TS some em runtime"? O que isso implica pra um dado que chega num `POST`?
3. Quando você deve **deixar inferir** e quando deve **anotar** um tipo? Cite os três casos em que anotar é obrigatório/recomendado.
4. Qual a diferença prática entre `any` e `unknown`? Por que a regra é "`unknown` na borda, `any` nunca"?
5. `let x = 'todo'` e `const x = 'todo'` inferem tipos diferentes. Quais, e por quê?
6. Quando você usa `interface` e quando usa `type` neste projeto? Justifique a convenção.
7. O que é excess property checking e em que situação ele **não** dispara?
8. O que é narrowing? Por que `typeof` não serve pra distinguir dois objetos que você definiu?
9. Por que preferir união literal (`'todo' | 'doing' | 'done'`) a `enum`? Cite dois motivos.
10. Como o truque do `never` no `default` de um `switch` te avisa que você esqueceu um caso?
11. O que significa "a borda pede `unknown` + validação"? Por que `const t = req.body as Task` é uma mentira?
12. O que um type predicate (`v is T`) faz que uma função `boolean` comum não faz? O que o TS **não** garante sobre ele?
13. O que é uma discriminated union e por que ela torna "estado impossível não-representável"?
14. No `parseTask`, você escolheu lançar exceção em vez de devolver `Result`. Qual o trade-off, e por que essa escolha aqui?
15. O que a flag `strictNullChecks` te obriga a fazer com o retorno de um `find()`? Cite as três formas de tratar o `undefined`.
16. O que um generic (`<T>`) preserva que o `any` apagaria? Pra que serve o `extends` num generic?
17. Por que derivar `NewTask`/`TaskPatch` com utility types é melhor que redigitar os campos na mão?
18. Por que `{}` é um `TaskPatch` válido, e onde essa regra ("pelo menos um campo") precisa ser checada de verdade?
19. Qual a diferença entre `as` e `satisfies`? Em que raros casos `as` é legítimo?
20. Por que existem **dois** `tsconfig` no projeto? O que cada um faz?
21. O que é a armadilha ESM×CJS e como os dois arquivos de config a evitam? Por que o import leva `.js` sendo o arquivo `.ts`?
22. Por que `tsc --noEmit` entra **antes** do vitest no script `test`? O que aconteceria sem ele?
23. Num tema de tipos, o que faz sentido testar e o que não faz? Por que "a borda é onde o teste ganha do compilador"?
24. **(fecho)** Cite 3 lugares onde o TypeScript te obrigou a mudar o código que já funcionava em JavaScript, e 1 coisa que ficou mal resolvida.
