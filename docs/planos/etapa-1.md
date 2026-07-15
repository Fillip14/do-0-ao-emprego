# Etapa 1 — Fundamentos JavaScript (início 08/07/2026 — avaliação alvo 21/07)

> Reorganizada em 11/07: o plano é por TEMAS, não por datas. Cada tema tem um dia sugerido (ritmo livre — a data real é a que você fizer). A avaliação alvo (21/07) é confirmada ou antecipada no checkpoint do fim do Tema 11.

**Objetivo:** dominar a base da linguagem que sustenta todo o resto do plano (Node, APIs, front-end) + fundamentos web prometidos no cronograma: HTML/CSS funcional, DOM e HTTP na prática. Sair da etapa lendo e escrevendo JS com segurança, sempre com testes, e com o gerenciador de tarefas rodando NO NAVEGADOR.

> Ajustes de 12/07: (1) HTML/CSS, DOM e HTTP adicionados — estavam no cronograma-mestre e faltavam neste plano (falha minha, apontada pelo Fillip); o projeto virou a versão WEB. (2) `this`/classes/protótipos adicionado como **Tema 12**, fechando o bloco de LINGUAGEM antes do bloco web (a pedido do Fillip). Estrutura final: linguagem T1–T12, web T13–T15, revisão T16, projeto T17, entrega T18. Avaliação movida de 20/07 → **21/07** (recalibragem explícita, custo: 1 dia).

**Regras da etapa (Trilha de IA — fase TUTOR):**

- IA só para explicar conceitos e revisar código DEPOIS de pronto. Proibido pedir código.
- Checklist do enunciado ANTES de codar, em todo exercício.
- Todo exercício tem asserts em `tests.js`, incluindo pelo menos 1 caso inválido/negativo.
- Commit diário no GitHub. Devlog: 3 linhas por dia.
- Tudo em `etapa-1/`, uma subpasta por tema: `t01/` = Tema 1, `t02/` = Tema 2... (renomeadas de d0X em 11/07).
- **Nomes de arquivo:** `Ex 03` → `ex03.js`, `Ex 12` → `ex12.js`; testes do dia em `tests.js`. **Exceção:** quando o enunciado der um nome explícito (`products.json`, `in-stock.json`, `tasks.js`, `tasks.json`, `lib.js`), esse nome é contrato e vale sobre a regra geral. Mudanças neste plano: só na conversa oficial da etapa.
- **Código em inglês:** nomes de variáveis, funções, arquivos e chaves de objetos em inglês. Comentários, devlog e mensagens de commit podem ser em português.
- **Ritmo — regra do "tema selado" (definida em 11/07, a pedido do Fillip):** sem dias, sem limite. O próximo tema só abre quando o atual recebe o **selo DoD** (*Definition of Done* — o checklist que times profissionais usam pra declarar algo pronto; você já está treinando o hábito da profissão). O selo tem 5 travas:

  1. **Verde agora** — `node tests.js` rodado NA HORA do fechamento, tudo passando, ≥1 caso negativo por função. "Rodei mais cedo" não conta.
  2. **Revisão zerada** — revisão do Claude feita e TODAS as correções aplicadas. Correção ignorada reabre o tema (já aconteceu 2x na etapa).
  3. **Devlog no ato** — anotou o que destravou e o "travei/faltou" do tema (ou "nada"), antes de abrir o próximo.
  4. **Pergunta-selo** — 1 pergunta-relâmpago do Claude sobre o tema, sem consulta. Errou → fecha a lacuna, recebe outra. É selo, não punição: 30 segundos quando está firme.
  5. **Commit pushed** com mensagem que descreve o que foi feito.

  Selou → abre o próximo, quantos couberem no dia. **T10 e T11 (assíncrono): recomendação mantida de um por dia** — é o conteúdo que mais derruba iniciante; a pergunta-selo desses dois vai ser mais funda.

---

## Tema 1 — Tipos e coerção ✅ (feito 08/07)

Estudar: `typeof`, number/string/boolean/null/undefined, `NaN`, conversões, `==` vs `===`, truthy/falsy.

- **Ex 01** — `getType(value)`: retorna `"number"`, `"string"`, `"boolean"`, `"null"`, `"undefined"`, `"array"` ou `"object"`. Atenção: `typeof null` e arrays têm pegadinhas.
- **Ex 02** — Arquivo `ex02.js` com 15 expressões (ex.: `"1" + 1`, `"1" - 1`, `null == undefined`, `[] + []`, `0 == false`...). Escreva a previsão em comentário ANTES de rodar. Depois rode e anote os erros de previsão no devlog.
- **Ex 02b (extra)** — `ex02-extra.js`: função `safeNumber(text)` que recebe uma string e retorna um NUMBER, ou NULL se a conversão não for possível. O retorno nunca é string. Casos que os testes devem cobrir:

  ```js
  safeNumber('42')     // 42        (number)
  safeNumber(' 42 ')   // 42        (espaços nas pontas são ok)
  safeNumber('3.5')    // 3.5       (decimais valem)
  safeNumber('12px')   // null      (não é totalmente numérico)
  safeNumber('abc')    // null
  safeNumber('')       // null      (cuidado: Number('') retorna 0)
  safeNumber('   ')    // null      (mesmo problema)
  ```

## Tema 2 — Funções a fundo ✅ (feito 09/07)

Estudar: function vs arrow, parâmetros default, rest (`...`), escopo, `let` vs `const` vs `var`, hoisting, closure.

- **Ex 03** — `createCounter()`: retorna uma função que a cada chamada retorna 1, 2, 3... Dois contadores criados separadamente não se misturam (teste isso).
- **Ex 04** — `applyToEach(fn, list)`: retorna nova lista com `fn` aplicada a cada item, SEM usar `.map` (loop manual). Teste passando duas funções diferentes.

## Tema 3 — Strings e regex ✅ (feito 09/07)

Estudar: métodos de string (`slice`, `split`, `trim`, `toLowerCase`, `includes`, `padStart`), template literals, regex básico (`test`, classes `\d \w`, quantificadores, `[A-Z]`).

- **Ex 05** — `formatName(name)`: `"  joão da SILVA "` → `"João Da Silva"`.
- **Ex 06** — Refazer o validador de senha (Ex 0.5 da Etapa 0) usando regex nas verificações. Como `validatePassword(password)` retornando `{ valid, errors }`.

## Tema 4 — Arrays parte 1: mutação e referência ✅ (feito 09/07)

Estudar: `push/pop/shift/unshift`, `slice` vs `splice`, `indexOf`, `includes`, referência vs cópia (`[...arr]`).

- **Ex 07** — `ex07.js`: 10 trechos que mutam ou copiam arrays. Prever a saída em comentário antes de rodar. Depois: `copyWithoutLast(list)` que retorna cópia sem o último item, SEM alterar a original (teste que a original não mudou).

## Tema 5 — Arrays parte 2: map, filter, find ✅ (feito 09/07)

Estudar: `map`, `filter`, `find`, `some`, `every` — e diferença de `forEach` vs `map`.

- **Ex 08** — Refazer o exercício dos produtos (ex05 da pasta `avaliacao/`) SEM nenhum `for`: (a) com estoque, (b) valor total, (c) mais caro, (d) novo: lista de nomes em maiúsculas dos produtos abaixo de R$100.

## Tema 6 — reduce e sort ✅ (feito 10/07)

Estudar: `reduce` (acumulador), `sort` com função comparadora (cuidado: sort de números sem comparador quebra — teste isso).

- **Ex 09** — `gradeStats(grades)`: retorna `{ average, highest, lowest, approved }` (aprovado ≥ 7) usando reduce/filter. Lista vazia retorna `null`. Ordene as notas da maior para a menor.

## Tema 7 — Objetos ✅ (feito 10/07)

Estudar: acesso com `.` e `[]`, `Object.keys/values/entries`, desestruturação, spread em objetos.

- **Ex 10** — `countWords(phrase)`: refazer o ex04 da avaliação em JS. Retorna array de pares `[word, count]` ordenado da mais frequente para a menos.

> **Formato dos enunciados do T8 em diante:** todo exercício traz Arquivos, Contrato (entrada/saída/erros), Exemplos e O que os testes cobrem. Se algo ainda estiver ambíguo, pergunta ANTES de codar — dúvida de enunciado não é cola.

## Tema 8 — JSON e arquivos (Node) ✅ (feito 10/07)

Estudar: `JSON.parse/stringify`, `fs.readFileSync/writeFileSync`, `module.exports`/`require` e a diferença CommonJS vs ESM (`import/export`) — você misturou os dois na avaliação; hora de fixar. No devlog: explicar CommonJS vs ESM com suas palavras.

**Ex 11**

*Arquivos:* `t08/products.json`, `t08/lib.js`, `t08/ex11.js`, `t08/tests.js`

*Passo 1 —* criar `products.json` exatamente com este conteúdo:

```json
[
  { "name": "teclado", "price": 120.0, "stock": 3 },
  { "name": "mouse", "price": 55.5, "stock": 0 },
  { "name": "monitor", "price": 899.9, "stock": 7 },
  { "name": "cabo hdmi", "price": 25.0, "stock": 0 }
]
```

*Passo 2 —* `lib.js` exporta 3 funções:

- `readProducts(path)` → lê o arquivo e retorna o array já convertido (parse).
- `filterInStock(products)` → retorna ARRAY NOVO só com `stock > 0`. Não muta o original. Se `products` não for array → retorna `null`.
- `saveProducts(path, products)` → grava o array como JSON no caminho dado, formatado com 2 espaços de indentação.

*Passo 3 —* `ex11.js` importa de `lib.js` e, ao rodar `node ex11.js`: lê `products.json`, filtra, salva em `in-stock.json`.

*Resultado esperado em `in-stock.json`:* só teclado e monitor.

*O que os testes cobrem (`tests.js`):* filterInStock com o array normal → 2 itens; com todos `stock: 0` → `[]`; com não-array (`{}`, `"abc"`) → `null`; original NÃO mutado (assert do array original depois da chamada).

## Tema 9 — Erros e validação ✅ (feito 11/07)

Estudar: `throw new Error(...)`, `try/catch`, `assert.throws`, mensagens de erro úteis.

**Ex 12**

*Arquivos:* `t09/ex12.js`, `t09/tests.js`

*Contrato:* `parseAge(text)` recebe uma string e retorna um número inteiro ≥ 0.

*Erros (throw new Error com EXATAMENTE estas mensagens):*

| Entrada | Comportamento |
|---|---|
| `'25'` | retorna `25` (number) |
| `' 30 '` | retorna `30` (espaços nas pontas ok) |
| `'0'` | retorna `0` (fronteira: zero é idade válida) |
| `'abc'`, `''`, `'  '`, `'12px'` | `throw new Error('invalid age: not a number')` |
| `'-5'` | `throw new Error('invalid age: negative')` |
| `'3.5'` | `throw new Error('invalid age: not an integer')` |

*O que os testes cobrem:* os 3 erros com `assert.throws` (conferindo a MENSAGEM, não só que lançou) + os 3 casos válidos com `assert.strictEqual` (valor E tipo number).

## Tema 10 — Assíncrono parte 1 ✅ (feito 12/07)

Estudar: por que JS é assíncrono (event loop na ideia geral), callbacks, `setTimeout`, Promise (`then/catch`), os 3 estados de uma promise (pending/fulfilled/rejected).

**Ex 13**

*Arquivos:* `t10/ex13.js`, `t10/tests.js`

*Parte A — previsão:* no topo do `ex13.js`, este trecho em comentário. Escreva a ordem dos logs ANTES de rodar, depois rode e confira:

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');
// minha previsão da ordem: ???
```

*Parte B — contrato:* `wait(ms)` → retorna uma Promise que resolve (sem valor) depois de `ms` milissegundos. Não usa nada além de `setTimeout` por dentro.

*Parte C — uso:* usando SÓ `wait` e `.then` encadeado (sem async/await — isso é o T11), imprimir `1`, depois de 1s `2`, depois de 1s `3`, depois de 1s `done`.

*O que os testes cobrem:* `wait(50).then(...)` — o teste marca `Date.now()` antes e dentro do then, e afirma que passaram ≥ 50ms; e que `wait(0)` retorna uma Promise (`instanceof Promise`).

## Tema 11 — Assíncrono parte 2: async/await e fetch ✅ (feito 13/07)

Estudar: `async/await`, `try/catch` com await, `fetch` no Node, refazer mentalmente o Ex 13 parte C com await. De passagem (sem exercício): `Promise.all` — rodar várias promises em paralelo e esperar todas.

**Ex 14**

*Arquivos:* `t11/ex14.js`, `t11/tests.js`

*Contrato:* `fetchAddress(cep)` — função `async`.

- *Entrada:* string; aceita com ou sem hífen (`'01001-000'` e `'01001000'` são o mesmo CEP). Normalizar removendo o hífen antes de validar.
- *Validação:* depois de remover o hífen, precisa ter exatamente 8 dígitos. Falhou → `throw new Error('invalid cep format')` (SEM chamar a API).
- *Consulta:* `https://viacep.com.br/ws/{cep}/json/`. Se a API responder `{ "erro": true }` (CEP bem formado mas inexistente) → `throw new Error('cep not found')`.
- *Saída (sucesso):* objeto com estas 4 chaves, mapeadas da resposta em português:

| Chave da API | Chave do retorno |
|---|---|
| logradouro | street |
| bairro | district |
| localidade | city |
| uf | state |

*Exemplo:* `await fetchAddress('01001-000')` → `{ street: 'Praça da Sé', district: 'Sé', city: 'São Paulo', state: 'SP' }`

*O que os testes cobrem:* caso válido (conferir as 4 chaves); formato inválido (`'123'`, `'abcdefgh'`) → rejeita com `invalid cep format` (usar `assert.rejects`); CEP inexistente (`'99999999'`) → rejeita com `cep not found`. Testes com rede real, ok nesta fase.

**→ Checkpoint: ao fechar o Tema 11, confirmamos, antecipamos ou movemos a data da avaliação.** ✅ Feito 13/07: T11 fechou no dia sugerido, ritmo verde — avaliação **21/07 CONFIRMADA**.

## Tema 12 — JS orientado a objetos: this, classes e protótipos ✅ (feito 14/07) — dia sugerido: ter 14/07

> Adicionado em 12/07 (recalibragem acima). Fecha o bloco de LINGUAGEM antes do bloco web: você já domina funções e closures — agora o outro jeito de organizar estado.

Estudar: `this` (método vs arrow vs função solta), `class`, `constructor`, métodos, `extends`/`super` (incluindo `extends Error`), `instanceof`, protótipos por baixo do capô (métodos vivem em `Classe.prototype`), quando usar classe vs função pura.

**Ex 15**

*Arquivos:* `t12/ex15.js`, `t12/tests.js`

*Parte A — previsão:* no topo do `ex15.js`, este trecho em comentário. Prever cada item ANTES de rodar; erros de previsão no devlog:

```js
const user = {
  name: 'Ana',
  hi() { return `hi ${this.name}`; },
  bye: () => `bye ${this.name}`,
};
// 1: user.hi() → ?
// 2: user.bye() → ? (arrow não tem this próprio)
const f = user.hi;
// 3: f() → ? (o que é this numa chamada solta?)
class A { constructor() { this.x = 1; } get() { return this.x; } }
const a = new A();
// 4: a.get() → ?
// 5: A.prototype.get === a.get → ?
```

*Parte B — contrato:* no mesmo `ex15.js`, exportar 3 classes (CommonJS — a pasta t12/ não tem package.json):

- `ValidationError` e `NotFoundError`, ambas `extends Error`, com `this.name` ajustado no constructor.
- `TaskStore`:
  - `new TaskStore()` → começa vazio.
  - `add(title)` → cria `{ id, title, done: false }` (id = maior existente + 1; vazio → 1, mesma regra que a lib do projeto T17 vai usar), guarda internamente e RETORNA a tarefa criada. `title` vazio, só espaços ou não-string → `throw new ValidationError('invalid title')`.
  - `toggle(id)` → inverte `done` e retorna a tarefa. Id inexistente → `throw new NotFoundError('task not found')`.
  - `remove(id)` → remove a tarefa, retorna `undefined`. Id inexistente → `throw new NotFoundError('task not found')`.
  - `list()` → retorna CÓPIA do array interno (mutar o retorno não pode afetar o store).

*Diferença didática:* a lib do projeto (T17) será PURA (recebe array, devolve array novo); a classe guarda ESTADO interno. Os dois estilos existem no mercado — quando fizer o T17, anote no devlog qual preferiu e por quê.

*O que os testes cobrem (`tests.js`):* fluxo add/toggle/remove; os 2 erros com `assert.throws` conferindo a MENSAGEM e o `instanceof` (ValidationError ≠ NotFoundError); `list()` é cópia (mutar o retorno e afirmar que o interno não mudou); `store.add === TaskStore.prototype.add` → `true` (prova de onde o método vive).

## Tema 13 — HTML/CSS funcional ✅ (feito 14/07) — dia sugerido: qua 15/07

Estudar: estrutura mínima de um documento (`<!DOCTYPE html>`, `html/head/body`, `<meta charset>`), tags semânticas (`header`, `main`, `ul/li`, `form`, `label`), `input`/`button`, classes, como ligar o CSS (`<link rel="stylesheet">`); CSS: seletor de tag e de classe, box model (margin/padding/border), flexbox básico (`display: flex`, `gap`, `justify-content`, `align-items`). Abrir arquivo local no navegador.

**Ex 16 — página estática do gerenciador de tarefas** (só aparência; comportamento é o T14)

*Arquivos:* `t13/index.html`, `t13/style.css`. SEM JavaScript neste tema.

*Estrutura obrigatória do HTML:*

1. `<h1>` com o texto `Task Manager`.
2. `<form id="task-form">` contendo: `<input id="task-input" type="text" placeholder="new task">` e `<button type="submit">add</button>`.
3. `<ul id="task-list">` com exatamente 3 `<li>` de exemplo escritos à mão, cada um contendo, nesta ordem: `<span class="title">texto da tarefa</span>`, `<button class="done">done</button>`, `<button class="remove">x</button>`.
4. O 2º `<li>` deve ter a classe `completed`.

*CSS obrigatório:*

1. `.completed .title` → `text-decoration: line-through`.
2. Lista sem marcadores (`list-style: none`).
3. Form e cada `<li>` organizados com flex, com espaçamento visível (`gap`/`padding`) — nada grudado.
4. Página legível: largura máxima do `main` (~600px) e margem centralizando.

*Verificação (este tema não tem `tests.js` — o selo usa checklist visual):* abrir no navegador e conferir os 8 itens acima, um a um, marcando no devlog. Feio é aceitável; ilegível não.

## Tema 14 — DOM e eventos ✅ (feito 14/07) — dia sugerido: qui 16/07

Estudar: `document.querySelector`, `createElement`, `appendChild`, `element.remove()`, `classList.add/toggle/contains`, `addEventListener` (`click` e `submit`), `event.preventDefault()`, `input.value`, `<script src>` no fim do body.

**Ex 17 — dar vida à página**

*Arquivos:* `t14/index.html`, `t14/style.css` (copiados do T13, REMOVENDO os 3 `<li>` de exemplo), `t14/app.js`.

*Contrato de comportamento:*

| Ação | Resultado |
|---|---|
| Submeter o form com texto | cria `<li>` novo no fim da lista (mesma estrutura do T13: span.title + button.done + button.remove), limpa o input e devolve o foco pra ele |
| Submeter com input vazio ou só espaços | NÃO cria item, nada quebra |
| Clicar no `done` de um item | o `<li>` ganha/perde a classe `completed` (toggle) |
| Clicar no `x` de um item | o `<li>` some da página |
| Apertar F5 | tudo some — esperado; persistência é no T17 |

*Estrutura exigida:* uma função `renderTask(title)` que cria e retorna o `<li>` completo — proibido montar o mesmo HTML em dois lugares.

*Verificação:* checklist manual das 5 linhas da tabela no navegador + console do DevTools sem NENHUM erro vermelho. Marcar no devlog.

## Tema 15 — HTTP na prática — dia sugerido: sex 17/07

Estudar: o que viaja numa request (método, URL, headers, body) e numa response (status, headers, body); métodos GET/POST/PUT/DELETE; famílias de status 2xx/4xx/5xx e os clássicos 200, 201, 301, 404, 500; JSON como corpo; **DevTools aba Network** (encontrar a request do fetch, ver status e response). No devlog: explicar com suas palavras 404 vs 500 (foi fraqueza sua na avaliação de nível — hora de matar).

**Ex 18 — página busca-CEP** (fecha o ciclo: fetch → tela)

*Arquivos:* `t15/index.html`, `t15/style.css`, `t15/address.js`, `t15/app.js`.

*Parte A —* `address.js`: adaptar seu `fetchAddress` do T11 para **ESM de navegador**: `export async function fetchAddress(cep)` (mesmo contrato do Ex 14, mensagens de erro idênticas). No HTML: `<script type="module" src="app.js">`, e `app.js` faz `import { fetchAddress } from './address.js'`. — Aqui o CommonJS vs ESM do T8 vira prática: anote no devlog qual é qual.

*Parte B — comportamento da página:*

| Ação | Resultado |
|---|---|
| Submeter form com CEP | botão desabilita e mostra `...` enquanto espera; reabilita ao terminar (sucesso OU erro) |
| Sucesso | mostra em `<div id="result">`: street, district, city, state (uma linha cada) |
| CEP mal formado / inexistente / falha de rede | a MENSAGEM do erro aparece no mesmo div, em vermelho (classe `.error`), página não quebra (try/catch) |

*Parte C — Network:* fazer uma busca com a aba Network aberta; anotar no devlog: método, URL chamada, status da resposta e 2 headers que você viu.

*Observação:* abrir com `type="module"` direto do arquivo pode esbarrar em CORS dependendo do navegador — se acontecer, rodar `npx serve` na pasta (ou a extensão Live Server do VS Code) e anotar no devlog por que foi preciso.

## Tema 16 — Revisão espaçada + planejamento do projeto — dia sugerido: sáb 18/07

*Parte A — revisão de memória (manhã):*

- Refazer DE MEMÓRIA, em `t16/review/`, sem abrir o código antigo: Ex 03 (`createCounter`), Ex 09 (`gradeStats`) e Ex 10 (`countWords`). Mesmos contratos originais (pode reler o ENUNCIADO, não o código).
- Comparar com a versão original e anotar no devlog o que saiu diferente/esquecido.

*Parte B — quiz oral comigo no chat:* closure, map vs forEach, referência vs cópia, `==` vs `===`, promise vs async/await, CommonJS vs ESM, `this` e classes (T12) + selos retroativos pendentes (T1–T7).

*Parte C — planejamento do projeto (tarde):* entregáveis, em `t17/`:

1. `requirements.md` — checklist de TODOS os requisitos do Tema 17, com suas palavras.
2. `lib.js` — só as assinaturas (corpo `// TODO`), 1 comentário por função: entrada → saída.
3. `tests.js` — asserts escritos porém comentados (sua lista de "o que falta passar").

## Tema 17 — Projeto: gerenciador de tarefas WEB — dia sugerido: dom 19/07

Interface no navegador, lógica testada em Node — o mesmo core serve os dois mundos.

*Arquivos:* `t17/index.html`, `t17/style.css`, `t17/lib.js` (lógica pura, ESM), `t17/app.js` (DOM + storage), `t17/tests.js` (roda com `node tests.js`), `t17/package.json` com `{ "type": "module" }` (para o Node aceitar import/export), `t17/requirements.md` (do T16).

*Formato da tarefa:* `{ id: number, title: string, done: boolean }`. `id` = maior id existente + 1 (lista vazia → 1). Ids NÃO são reaproveitados após remoção.

*Contratos de `lib.js`* (funções puras: recebem array, retornam ARRAY NOVO, nunca mutam, nunca tocam DOM nem storage; exportadas com `export`):

- `addTask(tasks, title)` → novo array com a tarefa no fim. `title` vazio, só espaços ou não-string → `throw new Error('invalid title')`.
- `completeTask(tasks, id)` → novo array com `done` INVERTIDO na tarefa (toggle). `id` inexistente → `throw new Error('task not found')`.
- `removeTask(tasks, id)` → novo array sem a tarefa. `id` inexistente → `throw new Error('task not found')`.

*`app.js` (única camada que toca DOM e storage):*

- `loadTasks()` → lê `localStorage.getItem('tasks')` e retorna o array (chave inexistente/JSON inválido → `[]`).
- `saveTasks(tasks)` → `localStorage.setItem('tasks', JSON.stringify(tasks))`.
- Fluxo: toda ação do usuário → chama a função da lib → `saveTasks` → re-render da lista inteira a partir do array. O array na memória é a única fonte da verdade; o DOM é reflexo dele.
- Erros da lib capturados com try/catch e mostrados na página (div `.error`), nunca stack trace no console do usuário.

*Comportamento na página:* igual ao T14 (adicionar/toggle/remover, input inválido não cria) + **sobrevive a F5** (localStorage).

*O que os testes cobrem (`node tests.js`, SÓ a lib):* as 3 operações; os 2 erros com `assert.throws` (conferindo mensagem); imutabilidade (array de entrada intacto após cada chamada); id não reaproveitado (add → remove → add: id novo); toggle duplo volta ao original.

*Processo:* commits pequenos — um por função da lib que passa nos testes + um por comportamento da página funcionando (mínimo 5 commits).

*Bônus opcional (só se sobrar tempo e o web estiver selado):* interface CLI `t17/tasks.js` usando as MESMAS funções da lib, com `fs` para persistir em `tasks.json` — comandos `add`/`list`/`done`/`remove`, saídas: `added: 1 - texto`, `[ ] 1 - texto`/`[x] 2 - texto`, `done: 2`, `removed: 3`.

## Tema 18 — Acabamento e entrega — dia sugerido: seg 20/07

1. *Polimento de erros:* console do navegador sem erro vermelho em NENHUM fluxo; toda falha visível pro usuário como mensagem na página.
2. *README* da pasta `etapa-1/` com estas seções: o que é o projeto, como rodar os exercícios (`node`), como abrir o projeto web, comandos/uso com exemplos, o que aprendi na etapa, uso de IA (mesmo formato da Etapa 0).
3. *Releitura final:* todos os enunciados do plano palavra por palavra vs. o que você entregou (na Etapa 0 escapou `valid/errors` no lugar de `valida/erros` — é pra pegar exatamente isso). Anotar no devlog o que a releitura pegou (ou "nada").
4. Devlog final da etapa. Push de tudo.
5. **Me avisar aqui no chat** → avaliação da Etapa 1 (escrita + oral) — alvo Ter 21/07.

---

## Critérios da avaliação

- Enunciados seguidos à risca (nomes, contratos de retorno, formatos, mensagens de erro exatas).
- Código em inglês em todos os arquivos (identificadores, funções, chaves, classes CSS); comentários/commits podem ser PT.
- `tests.js` em todos os temas de lógica, com casos negativos e `assert.throws` nos Ex 12/14 e na lib do projeto. Temas visuais (T13–T15): checklists de verificação marcados no devlog.
- Exercícios de previsão (Ex 02, Ex 07, parte A do Ex 13 e parte A do Ex 15) com previsões escritas antes e erros anotados no devlog.
- Projeto WEB funcionando de ponta a ponta: adicionar/toggle/remover na página, sobrevive a F5 (localStorage), lib pura em ESM testada via Node, erros visíveis na página.
- Oral (sem consultar): closure, map vs forEach, referência vs cópia, reduce, JSON, promise vs async/await, CommonJS vs ESM, 404 vs 500, o fluxo evento→lib→save→render do projeto, `this` (método vs arrow vs chamada solta), classe vs função pura, onde vivem os métodos (prototype).
- Commits diários (dias válidos conforme regra de piso), devlog em dia.

**Aprovado →** Etapa 2 (Node a fundo + primeira API). **Pendências →** ajustamos antes de avançar.
