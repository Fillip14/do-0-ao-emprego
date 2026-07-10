# Etapa 1 — Fundamentos JavaScript (08 a 19/07/2026, avaliação 20/07)

> Recalibrada em 09/07 (D2+D3 feitos num dia): dias corridos, avaliação alvo 20/07 — confirmada no checkpoint do fim do D11; se o assíncrono pedir mais tempo, desliza sem culpa.

**Objetivo:** dominar a base da linguagem que sustenta todo o resto do plano (Node, APIs, front-end). Sair da etapa lendo e escrevendo JS com segurança, sempre com testes.

**Regras da etapa (Trilha de IA — fase TUTOR):**

- IA só para explicar conceitos e revisar código DEPOIS de pronto. Proibido pedir código.
- Checklist do enunciado ANTES de codar, em todo exercício.
- Todo exercício tem asserts em `tests.js`, incluindo pelo menos 1 caso inválido/negativo.
- Commit diário no GitHub. Devlog: 3 linhas por dia.
- Tudo em `etapa-1/`, uma subpasta por dia (`d01/`, `d02/`...).
- **Nomes de arquivo:** `Ex 03` → `ex03.js`, `Ex 12` → `ex12.js`; testes do dia em `tests.js`. **Exceção:** quando o enunciado der um nome explícito (`products.json`, `in-stock.json`, `tasks.js`, `tasks.json`, `lib.js`), esse nome é contrato e vale sobre a regra geral. Mudanças neste plano: só na conversa oficial da etapa.
- **Código em inglês:** nomes de variáveis, funções, arquivos e chaves de objetos em inglês. Comentários, devlog e mensagens de commit podem ser em português.
- **Ritmo (alterada em 10/07):** dias corridos, sem limite de temas por dia — desde que cada tema feche redondo antes de abrir o próximo: tests completos com casos negativos, correções da revisão zeradas, devlog do tema escrito. A partir do 3º tema no mesmo dia: quiz oral rápido comigo no chat antes de seguir (detector de raso). **D10 e D11 (assíncrono) seguem invioláveis: um por dia, sem juntar com nada.**

---

## Dia 1 — Qua 08/07 — Tipos e coerção ✅

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

## Dia 2 — Qui 09/07 (manhã) — Funções a fundo ✅

Estudar: function vs arrow, parâmetros default, rest (`...`), escopo, `let` vs `const` vs `var`, hoisting, closure.

- **Ex 03** — `createCounter()`: retorna uma função que a cada chamada retorna 1, 2, 3... Dois contadores criados separadamente não se misturam (teste isso).
- **Ex 04** — `applyToEach(fn, list)`: retorna nova lista com `fn` aplicada a cada item, SEM usar `.map` (loop manual). Teste passando duas funções diferentes.

## Dia 3 — Qui 09/07 — Strings e regex ✅

Estudar: métodos de string (`slice`, `split`, `trim`, `toLowerCase`, `includes`, `padStart`), template literals, regex básico (`test`, classes `\d \w`, quantificadores, `[A-Z]`).

- **Ex 05** — `formatName(name)`: `"  joão da SILVA "` → `"João Da Silva"`.
- **Ex 06** — Refazer o validador de senha (Ex 0.5 da Etapa 0) usando regex nas verificações. Como `validatePassword(password)` retornando `{ valid, errors }`.

## Dia 4 — Qui 09/07 (tarde) — Arrays parte 1: mutação e referência ✅

Estudar: `push/pop/shift/unshift`, `slice` vs `splice`, `indexOf`, `includes`, referência vs cópia (`[...arr]`).

- **Ex 07** — `ex07.js`: 10 trechos que mutam ou copiam arrays. Prever a saída em comentário antes de rodar. Depois: `copyWithoutLast(list)` que retorna cópia sem o último item, SEM alterar a original (teste que a original não mudou).

## Dia 5 — Sex 10/07 — Arrays parte 2: map, filter, find ✅ (feito 09/07)

Estudar: `map`, `filter`, `find`, `some`, `every` — e diferença de `forEach` vs `map`.

- **Ex 08** — Refazer o exercício dos produtos (ex05 da pasta `avaliacao/`) SEM nenhum `for`: (a) com estoque, (b) valor total, (c) mais caro, (d) novo: lista de nomes em maiúsculas dos produtos abaixo de R$100.

## Dia 6 — Sáb 11/07 (4h) — reduce e sort ✅ (feito 10/07)

Estudar: `reduce` (acumulador), `sort` com função comparadora (cuidado: sort de números sem comparador quebra — teste isso).

- **Ex 09** — `gradeStats(grades)`: retorna `{ average, highest, lowest, approved }` (aprovado ≥ 7) usando reduce/filter. Lista vazia retorna `null`. Ordene as notas da maior para a menor.

## Dia 7 — Dom 12/07 (4h) — Objetos ✅ (feito 10/07)

Estudar: acesso com `.` e `[]`, `Object.keys/values/entries`, desestruturação, spread em objetos.

- **Ex 10** — `countWords(phrase)`: refazer o ex04 da avaliação em JS. Retorna array de pares `[word, count]` ordenado da mais frequente para a menos.

## Dia 8 — Seg 13/07 — JSON e arquivos (Node)

Estudar: `JSON.parse/stringify`, `fs.readFileSync/writeFileSync`, `module.exports`/`require` e a diferença CommonJS vs ESM (`import/export`) — você misturou os dois na avaliação; hora de fixar.

- **Ex 11** — Criar `products.json` com os produtos do Ex 08 (chaves em inglês: `name`, `price`, `stock`). Programa que lê o arquivo, filtra os com estoque e salva em `in-stock.json`. Funções em um módulo separado, importadas no arquivo principal.

## Dia 9 — Ter 14/07 — Erros e validação

Estudar: `throw`, `try/catch`, `assert.throws`, mensagens de erro úteis.

- **Ex 12** — `parseAge(text)`: converte texto em número inteiro de idade. Lança erro com mensagem clara se: não for número, for negativo, for decimal. Testes cobrindo os 3 erros com `assert.throws` + casos válidos.

## Dia 10 — Qua 15/07 — Assíncrono parte 1 🔒 (um por dia)

Estudar: por que JS é assíncrono, callbacks, `setTimeout`, Promise (`then/catch`), estados de uma promise.

- **Ex 13** — `wait(ms)`: retorna uma Promise que resolve depois de `ms` milissegundos. Usar para imprimir "1"... "2"... "3" com 1s de intervalo, primeiro com `then`, depois encadeado.

## Dia 11 — Qui 16/07 — Assíncrono parte 2: async/await e fetch 🔒 (um por dia)

Estudar: `async/await`, `try/catch` com await, `fetch` no Node.

- **Ex 14** — `fetchAddress(cep)`: consulta `https://viacep.com.br/ws/{cep}/json/` e retorna `{ street, district, city, state }` (a API responde em português — traduzir as chaves é parte do exercício). CEP inexistente ou mal formado lança erro com mensagem clara. Testar com CEP válido e inválido.

**→ Checkpoint: ao fechar o D11, confirmamos (ou movemos) a data da avaliação.**

## Dia 12 — Sex 17/07 — Revisão espaçada + planejamento do projeto

- Manhã: refazer DE MEMÓRIA (sem olhar o código antigo): Ex 03, Ex 09 e Ex 10. Comparar com a versão original.
- Quiz oral comigo no chat: closure, map vs forEach, referência vs cópia, `==` vs `===`, promise vs async/await.
- Tarde — **planejamento do projeto integrador**: checklist completo de requisitos + esqueleto das funções + testes vazios.

**Gerenciador de tarefas v2** — CLI em Node, comandos via `process.argv`:

```
node tasks.js add "estudar reduce"
node tasks.js list
node tasks.js done 2
node tasks.js remove 3
```

- Persistência em `tasks.json`. Lógica em módulo separado (`lib.js`) com funções puras; `tasks.js` só lê argv e chama.

## Dia 13 — Sáb 18/07 (4h) — Projeto: implementação

- Implementar as 4 operações com testes em `tests.js` (a lógica pura é testável sem mexer no arquivo real).
- Commits pequenos, um por funcionalidade que passa nos testes.
- Erros amigáveis: comando inexistente, id inválido, título vazio.

## Dia 14 — Dom 19/07 (4h) — Acabamento e entrega

- README da pasta `etapa-1/` explicando o projeto e como rodar.
- Reler todos os enunciados da etapa palavra por palavra (na Etapa 0 escapou `valid/errors` no lugar de `valida/erros` — releitura final é pra pegar exatamente isso).
- Devlog final. Push de tudo.
- **Me avisar aqui no chat** → avaliação da Etapa 1 (escrita + oral) na Seg 20/07.

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
