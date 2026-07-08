# Etapa 1 — Fundamentos JavaScript (09 a 22/07/2026)

**Objetivo:** dominar a base da linguagem que sustenta todo o resto do plano (Node, APIs, front-end). Sair da etapa lendo e escrevendo JS com segurança, sempre com testes.

**Regras da etapa (Trilha de IA — fase TUTOR):**

- IA só para explicar conceitos e revisar código DEPOIS de pronto. Proibido pedir código.
- Checklist do enunciado ANTES de codar, em todo exercício.
- Todo exercício tem asserts em `testes.js`, incluindo pelo menos 1 caso inválido/negativo.
- Commit diário no GitHub (mínimo 10 dos 14 dias). Devlog: 3 linhas por dia.
- Tudo em `etapa-1/`, uma subpasta por dia (`d01/`, `d02/`...).
- **Nomes de arquivo:** cada exercício vai em `ex<numero>.js` seguindo a numeração do plano (Ex 1.1 → `ex1-1.js`, Ex 1.3 → `ex1-3.js`); os testes do dia ficam em `testes.js`. Exceção: quando o enunciado der um nome explícito (`predictions.js`, `array-predictions.js`, `products.json`, `tasks.js`, `lib.js`), esse nome é contrato e vale sobre a regra geral.
- **Código em inglês:** nomes de variáveis, funções, arquivos e chaves de objetos em inglês. Comentários, devlog e mensagens de commit podem ser em português.
- **Regra nova — profundidade > velocidade:** máximo 1 dia à frente do plano. Na Etapa 0 acelerar funcionou porque era revisão; aqui o conteúdo é novo. Se sobrar tempo no dia, aprofunde (mais casos de teste, refazer de memória), não avance.

---

## Dia 1 — Qui 09/07 — Tipos e coerção

Estudar: `typeof`, number/string/boolean/null/undefined, `NaN`, conversões, `==` vs `===`, truthy/falsy.

- **Ex 1.1** — `getType(value)`: retorna `"number"`, `"string"`, `"boolean"`, `"null"`, `"undefined"`, `"array"` ou `"object"`. Atenção: `typeof null` e arrays têm pegadinhas.
- **Ex 1.2** — Arquivo `predictions.js` com 15 expressões (ex.: `"1" + 1`, `"1" - 1`, `null == undefined`, `[] + []`, `0 == false`...). Escreva a previsão em comentário ANTES de rodar. Depois rode e anote os erros de previsão no devlog.

## Dia 2 — Sex 10/07 — Funções a fundo

Estudar: function vs arrow, parâmetros default, rest (`...`), escopo, `let` vs `const` vs `var` (e por que `var` não se usa mais), hoisting, closure.

- **Ex 1.3** — `createCounter()`: retorna uma função que a cada chamada retorna 1, 2, 3... Dois contadores criados separadamente não se misturam (teste isso).
- **Ex 1.4** — `applyToEach(fn, list)`: retorna nova lista com `fn` aplicada a cada item, SEM usar `.map` (loop manual). Teste passando duas funções diferentes.

## Dia 3 — Sáb 11/07 (4h) — Strings e regex

Estudar: métodos de string (`slice`, `split`, `trim`, `toLowerCase`, `includes`, `padStart`), template literals, regex básico (`test`, classes `\d \w`, quantificadores, `[A-Z]`).

- **Ex 1.5** — `formatName(name)`: `"  joão da SILVA "` → `"João Da Silva"`.
- **Ex 1.6** — Refazer o validador de senha (Ex 0.5) usando regex nas verificações. Agora como `validatePassword(password)` retornando `{ valid, errors }` — sim, o contrato que você entregou "errado" na Etapa 0 virou o certo. O hábito de conferir o contrato à risca continua valendo.

## Dia 4 — Dom 12/07 (4h) — Arrays parte 1: mutação e referência

Estudar: `push/pop/shift/unshift`, `slice` vs `splice`, `indexOf`, `includes`, referência vs cópia (`[...arr]`).

- **Ex 1.7** — `array-predictions.js`: 10 trechos que mutam ou copiam arrays. Prever a saída em comentário antes de rodar. Depois: `copyWithoutLast(list)` que retorna cópia sem o último item, SEM alterar a original (teste que a original não mudou).

## Dia 5 — Seg 13/07 — Arrays parte 2: map, filter, find

Estudar: `map`, `filter`, `find`, `some`, `every` — e diferença de `forEach` vs `map`.

- **Ex 1.8** — Refazer o exercício dos produtos (ex05 da avaliação) SEM nenhum `for`: (a) com estoque, (b) valor total, (c) mais caro, (d) novo: lista de nomes em maiúsculas dos produtos abaixo de R$100.

## Dia 6 — Ter 14/07 — reduce e sort

Estudar: `reduce` (acumulador), `sort` com função comparadora (cuidado: sort de números sem comparador quebra — teste isso).

- **Ex 1.9** — `gradeStats(grades)`: retorna `{ average, highest, lowest, approved }` (aprovado ≥ 7) usando reduce/filter. Lista vazia retorna `null`. Ordene as notas da maior para a menor.

## Dia 7 — Qua 15/07 — Objetos

Estudar: acesso com `.` e `[]`, `Object.keys/values/entries`, desestruturação, spread em objetos.

- **Ex 1.10** — `countWords(phrase)`: refazer o ex04 da avaliação em JS. Retorna array de pares `[word, count]` ordenado da mais frequente para a menos.

## Dia 8 — Qui 16/07 — JSON e arquivos (Node)

Estudar: `JSON.parse/stringify`, `fs.readFileSync/writeFileSync`, `module.exports`/`require` e a diferença CommonJS vs ESM (`import/export`) — você misturou os dois na avaliação; hora de fixar.

- **Ex 1.11** — Criar `products.json` com os produtos do Ex 1.8 (chaves em inglês: `name`, `price`, `stock`). Programa que lê o arquivo, filtra os com estoque e salva em `in-stock.json`. Funções em um módulo separado, importadas no arquivo principal.

## Dia 9 — Sex 17/07 — Erros e validação

Estudar: `throw`, `try/catch`, `assert.throws`, mensagens de erro úteis.

- **Ex 1.12** — `parseAge(text)`: converte texto em número inteiro de idade. Lança erro com mensagem clara se: não for número, for negativo, for decimal. Testes cobrindo os 3 erros com `assert.throws` + casos válidos.

## Dia 10 — Sáb 18/07 (4h) — Assíncrono parte 1

Estudar: por que JS é assíncrono, callbacks, `setTimeout`, Promise (`then/catch`), estados de uma promise.

- **Ex 1.13** — `wait(ms)`: retorna uma Promise que resolve depois de `ms` milissegundos. Usar para imprimir "1"... "2"... "3" com 1s de intervalo, primeiro com `then`, depois encadeado.

## Dia 11 — Dom 19/07 (4h) — Assíncrono parte 2: async/await e fetch

Estudar: `async/await`, `try/catch` com await, `fetch` no Node.

- **Ex 1.14** — `fetchAddress(cep)`: consulta `https://viacep.com.br/ws/{cep}/json/` e retorna `{ street, district, city, state }` (a API responde em português — traduzir as chaves é parte do exercício). CEP inexistente ou mal formado lança erro com mensagem clara. Testar com CEP válido e inválido.

## Dia 12 — Seg 20/07 — Revisão espaçada + planejamento do projeto

- Refazer DE MEMÓRIA (sem olhar o código antigo): Ex 1.3, 1.9 e 1.10. Comparar com a versão original.
- Quiz oral comigo no chat: closure, map vs forEach, referência vs cópia, `==` vs `===`, promise vs async/await.
- À tarde — **Projeto integrador: planejamento**

**Gerenciador de tarefas v2** — CLI em Node, comandos via `process.argv`:

```
node tasks.js add "estudar reduce"
node tasks.js list
node tasks.js done 2
node tasks.js remove 3
```

- Persistência em `tasks.json`. Lógica em módulo separado (`lib.js`) com funções puras; `tasks.js` só lê argv e chama.
- Hoje: checklist completo de requisitos + esqueleto das funções + testes vazios.

## Dia 13 — Ter 21/07 — Projeto: implementação e acabamento

- Implementar as 4 operações com testes em `testes.js` (a lógica pura é testável sem mexer no arquivo real).
- Commits pequenos, um por funcionalidade que passa nos testes.

- Erros amigáveis: comando inexistente, id inválido, título vazio.

## Dia 14 — Qua 22/07 — Acabamento e entrega

- README da pasta `etapa-1/` explicando o projeto e como rodar.
- Reler todos os enunciados da etapa palavra por palavra (na Etapa 0 escapou `valid/errors` no lugar de `valida/erros` — releitura final é pra pegar exatamente isso).

- Devlog final. Push de tudo.
- **Me avisar aqui no chat** → avaliação da Etapa 1 (escrita + oral).

---

## Critérios da avaliação

- Enunciados seguidos à risca (nomes, contratos de retorno, formatos).
- Código em inglês em todos os arquivos (identificadores, funções, chaves); comentários/commits podem ser PT.
- `testes.js` em todos os dias, com casos negativos e `assert.throws` no Ex 1.12.
- Exercícios de previsão (1.2 e 1.7) com previsões escritas antes e erros anotados no devlog.
- Projeto funcionando de ponta a ponta com persistência, módulos e testes da lógica.
- Oral (sem consultar): closure, map vs forEach, referência vs cópia, reduce, JSON, promise vs async/await, CommonJS vs ESM.
- Commits em pelo menos 10 dias, devlog em dia.

**Aprovado →** Etapa 2 (Node a fundo + primeira API). **Pendências →** ajustamos antes de avançar.
