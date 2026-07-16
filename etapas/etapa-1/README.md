# Etapa 1 — Fundamentos de JavaScript

> Segunda etapa do projeto **Do 0 ao Emprego**: fundamentos de JS (tipos, closures, regex,
> arrays e seus métodos, módulos, assíncrono, classes) até um projeto web completo com
> persistência. Cada tema tem exercícios com testes; os últimos temas fecham em HTML/CSS/DOM
> e num gerenciador de tarefas.

## Estrutura

Uma pasta por tema (`t01`–`t17`). Cada tema tem seus exercícios (`exNN.js`) e, quando há
contrato, um `tests.js`.

| Pasta | Tema | Arquivos principais |
|---|---|---|
| `t01` | Tipos e `typeof` | `ex01.js`, `ex02.js`, `tests.js` |
| `t02` | Closures e strings | `ex03.js`, `ex04.js`, `tests.js` |
| `t03` | Regex | `ex05.js`, `ex06.js`, `tests.js` |
| `t04` | Arrays (push/pop/slice/splice) | `ex07.js`, `tests.js` |
| `t05` | Métodos de array (map/filter/find…) | `ex08.js`, `tests.js` |
| `t06` | `gradeStats` | `ex09.js`, `warmup.js`, `tests.js` |
| `t07` | `countWords` | `ex10.js`, `drill.js`, `tests.js` |
| `t08` | Módulos (CommonJS × ESM) | `ex11.js`, `lib.js`, `products.json`, `in-stock.json`, `tests.js` |
| `t09` | Erros e validação | `ex12.js`, `tests.js` |
| `t10` | Assíncrono (then/catch) | `ex13.js`, `tests.js` |
| `t11` | Assíncrono (promise, async/await) | `ex14.js`, `tests.js` |
| `t12` | `this`, classes, prototype | `ex15.js`, `tests.js` |
| `t13` | HTML/CSS básico | `index.html`, `style.css` |
| `t14` | DOM e eventos | `index.html`, `style.css`, `app.js` |
| `t15` | HTTP na prática (fetch/CEP) | `index.html`, `style.css`, `address.js`, `app.js` |
| `t16` | Revisão espaçada + planejamento | `review/` |
| `t17` | **Projeto: gerenciador de tarefas web** | `index.html`, `style.css`, `lib.js`, `app.js`, `tests.js`, `package.json` |

## Como rodar os exercícios (Node)

Os exercícios rodam direto no Node. A partir da raiz do repositório:

```bash
node etapas/etapa-1/t01/tests.js
node etapas/etapa-1/t05/tests.js
```

Cada `tests.js` usa `assert` do Node e imprime uma confirmação quando tudo passa
(ou estoura no primeiro assert que falhar).

## Como abrir o projeto web (t17)

O `t17` usa `type="module"`, então abrir o `index.html` direto pelo `file://` esbarra em
CORS. Rode um servidor local:

```bash
npx serve etapas/etapa-1/t17
```

E abra o endereço que ele mostrar (ex.: `http://localhost:3000`). Alternativa: extensão
**Live Server** do VS Code.

Os testes da lógica pura do projeto rodam no Node:

```bash
node etapas/etapa-1/t17/tests.js
```

## Uso / exemplos (t17)

- Digite uma tarefa e clique **add** — ela aparece na lista e é salva no `localStorage`.
- **done** risca/desrisca a tarefa (toggle).
- **x** remove a tarefa.
- Tarefa vazia ou só espaços → mensagem de erro na página, nada é criado.
- **F5** — a lista continua lá (persistência via `localStorage`).

## O que aprendi nesta etapa

Nesta etapa saí dos primeiros contatos com JS e fechei os fundamentos na prática:

- **Tipos e `typeof`**, coerção e comparação entre primitivos.
- **Closures** e por que uma função "lembra" o escopo onde nasceu.
- **Regex**: classes, quantificadores e âncoras (`^`, `$`).
- **Métodos de array** (`map`, `filter`, `find`, `some`, `every`, `forEach`) e a diferença
  entre transformar, filtrar e só executar — nenhum deles muta o original.
- **Módulos**: CommonJS (`require`/`module.exports`) × ESM (`import`/`export`).
- **Assíncrono**: promise, `.then`/`.catch` e `async`/`await`.
- **`this`, classes, prototype**, constructor e herança.
- **HTML/CSS** básico (tags semânticas, box model, flexbox) e **DOM/eventos**.
- **HTTP na prática**: request/response, métodos, famílias de status (404 × 500), JSON e a
  aba Network do DevTools.
- No projeto do `t17`, o conceito que mais mudou minha cabeça: **o array é a única fonte da
  verdade** e o DOM é só reflexo dele. Funções puras (retornam array novo, nunca mutam),
  separadas da camada que toca DOM e `localStorage`, com o fluxo `evento → lib → save → re-render`.

## Uso de IA

Usei IA como **tutor e revisor**, não como geradora de solução. Na prática isso significou:

- Os **enunciados** dos exercícios foram elaborados junto com a IA (contrato, erros, exemplos,
  o que os testes cobrem).
- **Revisão de código**: a IA apontou divergências e bugs, mas quem escreveu a solução fui eu —
  ela não montava o código, nem como "exemplo genérico".
- **Quiz e drills** de revisão espaçada para fixar os pontos fracos (watchlist).
- Explicações de conceito sob demanda (ex.: mutação por referência, event delegation).
