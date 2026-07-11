# Etapa 1 — Fundamentos JavaScript (início 08/07/2026 — avaliação alvo 20/07)

> Reorganizada em 11/07: o plano é por TEMAS, não por datas. Cada tema tem um dia sugerido (ritmo livre — a data real é a que você fizer). A avaliação alvo (20/07) é confirmada ou antecipada no checkpoint do fim do Tema 11.

**Objetivo:** dominar a base da linguagem que sustenta todo o resto do plano (Node, APIs, front-end). Sair da etapa lendo e escrevendo JS com segurança, sempre com testes.

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

## Tema 9 — Erros e validação — dia sugerido: dom 12/07

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

## Tema 10 — Assíncrono parte 1 — dia sugerido: seg 13/07 (recomendo não juntar com outro tema)

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

## Tema 11 — Assíncrono parte 2: async/await e fetch — dia sugerido: ter 14/07 (idem: melhor sozinho)

Estudar: `async/await`, `try/catch` com await, `fetch` no Node, refazer mentalmente o Ex 13 parte C com await.

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

**→ Checkpoint: ao fechar o Tema 11, confirmamos, antecipamos ou movemos a data da avaliação.**

## Tema 12 — Revisão espaçada + planejamento do projeto — dia sugerido: qua 15/07

*Parte A — revisão de memória (manhã):*

- Refazer DE MEMÓRIA, em `t12/review/`, sem abrir o código antigo: Ex 03 (`createCounter`), Ex 09 (`gradeStats`) e Ex 10 (`countWords`). Mesmos contratos dos enunciados originais (pode reler o ENUNCIADO, não o código).
- Depois de pronto: comparar com a versão original e anotar no devlog o que saiu diferente/esquecido.

*Parte B — quiz oral comigo no chat:* closure, map vs forEach, referência vs cópia, `==` vs `===`, promise vs async/await + os selos retroativos que ficaram pendentes.

*Parte C — planejamento do projeto (tarde):* entregáveis do dia, em `t13/`:

1. `requirements.md` — checklist de TODOS os requisitos do Tema 13, com suas palavras.
2. `lib.js` — só as assinaturas das funções (corpo `// TODO`), com um comentário por função dizendo entrada → saída.
3. `tests.js` — asserts escritos porém comentados (viram sua lista de "o que falta passar").

## Tema 13 — Projeto: implementação — dia sugerido: qui 16/07

**Gerenciador de tarefas v2** — CLI em Node.

*Arquivos:* `t13/tasks.js` (só lê argv e chama lib), `t13/lib.js` (toda a lógica, funções puras), `t13/tasks.json` (criado em runtime), `t13/tests.js`.

*Formato da tarefa:* `{ id: number, title: string, done: boolean }`. `id` = maior id existente + 1 (lista vazia → 1). Ids NÃO são reaproveitados após remoção.

*Contratos de `lib.js`* (funções puras: recebem array, retornam ARRAY NOVO, nunca mutam, nunca tocam em arquivo):

- `addTask(tasks, title)` → novo array com a tarefa no fim. `title` vazio, só espaços ou não-string → `throw new Error('invalid title')`.
- `completeTask(tasks, id)` → novo array com `done: true` na tarefa. `id` inexistente → `throw new Error('task not found')`.
- `removeTask(tasks, id)` → novo array sem a tarefa. `id` inexistente → `throw new Error('task not found')`.
- `loadTasks(path)` / `saveTasks(path, tasks)` → únicas que tocam arquivo. Arquivo inexistente no load → retorna `[]` (não quebra).

*CLI (`node tasks.js <comando>`):*

```
node tasks.js add "estudar reduce"   → adiciona e imprime: added: 1 - estudar reduce
node tasks.js list                   → imprime uma por linha: [ ] 1 - estudar reduce / [x] 2 - ...
node tasks.js done 2                 → marca e imprime: done: 2
node tasks.js remove 3               → remove e imprime: removed: 3
```

*O que os testes cobrem:* as 4 operações usando arrays em memória (SEM tocar no `tasks.json` real); os 2 erros com `assert.throws`; imutabilidade (array de entrada intacto após cada chamada); `loadTasks` de caminho inexistente → `[]`.

*Processo:* commits pequenos — um por função que passa nos testes (mínimo 4 commits neste tema).

## Tema 14 — Acabamento e entrega — dia sugerido: sex 17/07

1. *Erros amigáveis no CLI* (sem stack trace pro usuário): comando inexistente → `unknown command: xyz` + lista dos comandos válidos; `done`/`remove` com id não numérico → `invalid id: xyz`; erros da lib capturados com try/catch e impressos como mensagem simples.
2. *README* da pasta `etapa-1/` com estas seções: o que é o projeto, como rodar, comandos com exemplos, o que aprendi na etapa, uso de IA (mesmo formato da Etapa 0).
3. *Releitura final:* todos os enunciados do plano palavra por palavra vs. o que você entregou (na Etapa 0 escapou `valid/errors` no lugar de `valida/erros` — é pra pegar exatamente isso). Anotar no devlog o que a releitura pegou (ou "nada").
4. Devlog final da etapa. Push de tudo.
5. **Me avisar aqui no chat** → avaliação da Etapa 1 (escrita + oral) — alvo Seg 20/07.

---

## Critérios da avaliação

- Enunciados seguidos à risca (nomes, contratos de retorno, formatos).
- Código em inglês em todos os arquivos (identificadores, funções, chaves); comentários/commits podem ser PT.
- `tests.js` em todos os dias, com casos negativos e `assert.throws` no Ex 12.
- Exercícios de previsão (Ex 02 e Ex 07) com previsões escritas antes e erros anotados no devlog.
- Projeto funcionando de ponta a ponta com persistência, módulos e testes da lógica.
- Oral (sem consultar): closure, map vs forEach, referência vs cópia, reduce, JSON, promise vs async/await, CommonJS vs ESM.
- Commits diários (mínimo 9 dos ~11 dias corridos), devlog em dia.

**Aprovado →** Etapa 2 (Node a fundo + primeira API). **Pendências →** ajustamos antes de avançar.
