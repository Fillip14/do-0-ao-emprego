# Resumo — métodos e ferramentas da Etapa 1

## Números e conversão (T1)

| Método | Serve para | Exemplo |
|---|---|---|
| `typeof x` | descobrir o tipo primitivo | `typeof 'oi'` → `'string'` (pegadinha: `typeof null` → `'object'`) |
| `Number(x)` | converter para number (string inteira) | `Number('3.5')` → `3.5` (cuidado: `Number('')` → `0`) |
| `Number.parseInt(x, 10)` | converter pegando só o inteiro do início | `parseInt('12px', 10)` → `12` |
| `Number.parseFloat(x)` | converter pegando o decimal do início | `parseFloat('3.5kg')` → `3.5` |
| `Number.isNaN(x)` | testar se é NaN de verdade | `Number.isNaN(NaN)` → `true` |
| `Number.isInteger(x)` | testar se é inteiro | `Number.isInteger(3.5)` → `false` |
| `Array.isArray(x)` | testar se é array (typeof não serve) | `Array.isArray([])` → `true` |

## Funções a fundo (T2)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `function nome() {}` vs `() => {}` | declarar função; a arrow não tem `this` nem `arguments` próprios | `const dobro = x => x * 2` |
| parâmetro default | valor quando o argumento vem `undefined` | `function f(x = 10) {}` → `f()` usa `10` |
| rest `...args` | juntar o resto dos argumentos num array | `function soma(...n) { return n.reduce((a,b)=>a+b, 0) }` |
| escopo `let`/`const` vs `var` | `let`/`const` têm escopo de BLOCO; `var` vaza pra função | dentro de `if {}`, `let` só existe ali |
| hoisting | declarações sobem; `function` inteira sobe, `let`/`const` não usáveis antes | chamar `var` antes → `undefined`; `let` antes → erro |
| closure | função lembra as variáveis de onde nasceu | `createCounter()` mantém `count` privado entre chamadas |

> Closure é o motor do `createCounter`: cada contador tem SUA variável presa no escopo — dois contadores não se misturam.

## Strings (T3) — string nunca muta; métodos retornam string NOVA

| Método | Serve para | Exemplo |
|---|---|---|
| `slice(start, end)` | fatiar (end NÃO incluso) | `'javascript'.slice(0, 4)` → `'java'` |
| `split(sep)` | quebrar em array | `'a-b-c'.split('-')` → `['a','b','c']` |
| `trim()` | tirar espaços das pontas | `' oi '.trim()` → `'oi'` |
| `toLowerCase()` / `toUpperCase()` | minúsculas / maiúsculas | `'Oi'.toLowerCase()` → `'oi'` |
| `includes(text)` | contém o trecho? | `'banana'.includes('nan')` → `true` |
| `padStart(len, char)` | completar à esquerda até len | `'5'.padStart(3, '0')` → `'005'` |
| `regex.test(str)` | a string bate com o padrão? | `/^\d{8}$/.test('01001000')` → `true` |

> Regex: `^` prende no INÍCIO, `$` no FIM — sem âncoras, `test` acha o padrão em qualquer pedaço. `\d` = dígito, `\w` = letra/número/_, `{8}` = exatamente 8.

## Arrays parte 1 — os que MUTAM o original (T4)

| Método | Serve para | Exemplo (`a = [1,2,3]`) |
|---|---|---|
| `push(x)` | adicionar no FIM (retorna length) | `a.push(4)` → `4`, a = `[1,2,3,4]` |
| `pop()` | remover do FIM (retorna o removido) | `a.pop()` → `3`, a = `[1,2]` |
| `unshift(x)` | adicionar no INÍCIO | `a.unshift(0)` → a = `[0,1,2,3]` |
| `shift()` | remover do INÍCIO | `a.shift()` → `1`, a = `[2,3]` |
| `splice(i, qtd)` | remover qtd itens a partir de i | `a.splice(1, 1)` → a = `[1,3]` |
| `sort(fn)` | ordenar NO LUGAR (ver parte 3) | `a.sort((x,y) => y-x)` → a = `[3,2,1]` |
| `reverse()` | inverter NO LUGAR | `a.reverse()` → a = `[3,2,1]` |

## Arrays parte 1 — os que NÃO mutam (T4)

| Método | Serve para | Exemplo (`a = [1,2,3]`) |
|---|---|---|
| `slice(start, end)` | copiar fatia (end não incluso) | `a.slice(0, 2)` → `[1,2]`, a intacto |
| `[...a]` (spread) | cópia RASA do array | `const b = [...a]` — b novo, mas objetos DENTRO são compartilhados |
| `concat(b)` | juntar arrays num novo | `[1].concat([2])` → `[1,2]` |
| `indexOf(x)` | posição do item (-1 se não achar) | `a.indexOf(2)` → `1` |
| `includes(x)` | o item existe? | `a.includes(9)` → `false` |

## Arrays parte 2 — métodos com callback, nenhum muta (T5)

| Método | Serve para | Retorna | Exemplo (`n = [1,2,3,4]`) |
|---|---|---|---|
| `map(fn)` | TRANSFORMAR cada item | array do MESMO tamanho | `n.map(x => x*2)` → `[2,4,6,8]` |
| `filter(fn)` | manter quem passa no teste | array (0 até n itens) | `n.filter(x => x > 2)` → `[3,4]` |
| `find(fn)` | o PRIMEIRO que passa | o item, ou `undefined` | `n.find(x => x > 2)` → `3` |
| `some(fn)` | ALGUM passa? (para no 1º true) | boolean | `n.some(x => x > 3)` → `true` |
| `every(fn)` | TODOS passam? (para no 1º false) | boolean | `n.every(x => x > 0)` → `true` |
| `forEach(fn)` | só EXECUTAR (imprimir, salvar) | `undefined` | `n.forEach(x => console.log(x))` |

> `map` com push externo = trabalho de `forEach`; `forEach` esperando retorno = trabalho de `map`.

## Arrays parte 3 — reduce e sort (T6)

| Método | Serve para | Exemplo |
|---|---|---|
| `reduce((acc, n) => ..., inicial)` | transformar o array numa coisa só; o retorno de cada volta vira o acc da próxima | `[1,2,3].reduce((acc, n) => acc + n, 0)` → `6` |
| reduce com acc-OBJETO | contar/agrupar por chave | `['a','b','a'].reduce((acc, l) => { acc[l] = (acc[l] ?? 0) + 1; return acc; }, {})` → `{ a: 2, b: 1 }` |
| `sort((a, b) => a - b)` | ordenar números crescente (MUTA! copie antes: `[...arr].sort(...)`) | `[10,2,33].sort((a,b) => a-b)` → `[2,10,33]` |
| `sort()` SEM comparadora | ordena como STRING (quase nunca é o que você quer) | `[10, 9, 2].sort()` → `[10, 2, 9]` (compara `'10'`, `'9'`, `'2'` letra a letra) |

> Fronteiras do reduce: array vazio SEM valor inicial → `TypeError`. Com inicial → retorna o inicial.
> Comparadora: negativo = a antes, positivo = b antes, zero = empate (sort é estável: empate mantém ordem original).

## Objetos (T7)

| Ferramenta | Serve para | Exemplo (`u = { name: 'ana', age: 30 }`) |
|---|---|---|
| `obj.chave` | acesso quando você SABE o nome | `u.name` → `'ana'` |
| `obj[key]` | acesso quando o nome está numa VARIÁVEL | `const k = 'age'; u[k]` → `30` |
| `Object.keys(obj)` | array das chaves | `['name', 'age']` |
| `Object.values(obj)` | array dos valores | `['ana', 30]` |
| `Object.entries(obj)` | array de pares `[chave, valor]` | `[['name','ana'], ['age',30]]` |
| `{ ...obj }` (spread) | cópia RASA + sobrescrever chaves | `{ ...u, age: 31 }` → novo obj com age 31 |
| desestruturação | extrair chaves em variáveis | `const { name } = u` → `name = 'ana'` |

### Cópia RASA vs cópia PROFUNDA

Spread/slice/filter/map copiam a "caixa" de fora, mas os OBJETOS dentro são os MESMOS — alterar `copia[0].x` altera `original[0].x`. Cópia profunda constrói tudo do zero, em todos os níveis.

Formas de copiar um array em PROFUNDIDADE:

| Forma | Como | Cuidado |
|---|---|---|
| `structuredClone(arr)` | nativo, clona qualquer nível | NÃO copia funções (dá erro se houver) |
| `JSON.parse(JSON.stringify(arr))` | serializa e reconstrói | perde `undefined`, funções, `Date` (vira string) |
| `arr.map(item => ({ ...item }))` | spread item a item | só resolve UM nível (array de objetos rasos) |
| lodash `cloneDeep(arr)` | biblioteca, robusto | precisa instalar o lodash |

## JSON e arquivos (T8)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `JSON.parse(str)` | string JSON → estrutura NOVA (constrói tudo do zero) | `JSON.parse('[1,2]')` → `[1, 2]` |
| `JSON.stringify(x, null, 2)` | estrutura → string JSON (2 = indentação) | `JSON.stringify({a:1}, null, 2)` |
| `fs.readFileSync(path, 'utf8')` | ler arquivo → string | `const raw = fs.readFileSync('p.json', 'utf8')` |
| `fs.writeFileSync(path, str)` | escrever string no arquivo | `fs.writeFileSync('out.json', json)` |
| `module.exports` / `require` | exportar/importar (CommonJS) | `module.exports = { fn }` / `const { fn } = require('./lib.js')` |
| `export` / `import` | exportar/importar (ESM) | `export function fn() {}` / `import { fn } from './lib.js'` |

> Fluxo: ler → `parse` → mexer → `stringify` → escrever. (parse = string PARA dados; stringify = dados PARA string.)
> CommonJS (`require`/`module.exports`) é o padrão do Node em `.js`; ESM (`import`/`export`) precisa de `"type": "module"` no package.json ou extensão `.mjs`.

## Erros (T9)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `throw new Error(msg)` | sinalizar problema e PARAR a função na hora | `throw new Error('invalid age: negative')` |
| `try/catch` | capturar erro lançado e reagir (quem sabe reagir captura) | `try { parseAge(x) } catch (e) { console.log(e.message) }` |
| `assert.throws(() => fn(x), { message })` | testar que lança O erro certo (passa a função SEM executar) | `assert.throws(() => parseAge('-5'), { message: 'invalid age: negative' })` |
| `assert.strictEqual(a, b)` | igualdade com `===` (confere valor E tipo) | `assert.strictEqual(parseAge('25'), 25)` |
| `assert.deepStrictEqual(a, b)` | igualdade profunda de arrays/objetos | `assert.deepStrictEqual(f(), { a: 1 })` |

## Assíncrono parte 1 — callbacks e Promise (T10)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `setTimeout(fn, ms)` | rodar `fn` depois de `ms` (vai pra fila, não trava o resto) | `setTimeout(() => console.log('B'), 0)` |
| `new Promise((resolve, reject) => ...)` | embrulhar algo assíncrono num objeto que "vai ter" um valor | `wait(ms)` que resolve depois de `ms` |
| `.then(fn)` | rodar quando a promise RESOLVE | `wait(1000).then(() => console.log('1'))` |
| `.catch(fn)` | rodar quando a promise REJEITA | `p.catch(e => console.log(e.message))` |

> 3 estados da promise: pending → fulfilled (resolve) OU rejected (reject). Sync roda tudo primeiro; `setTimeout(...,0)` só corre depois.

## Assíncrono parte 2 — async/await e fetch (T11)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `async function` | marca função que devolve Promise; libera o `await` dentro | `async function fetchAddress(cep) {}` |
| `await promise` | espera a promise resolver e devolve o VALOR (parece síncrono) | `const res = await fetch(url)` |
| `try/catch` com await | capturar erro de promise rejeitada | `try { await f() } catch (e) {}` |
| `fetch(url)` | requisição HTTP; retorna Promise de Response | `const r = await fetch(url); const data = await r.json()` |
| `Promise.all([...])` | rodar várias em PARALELO e esperar TODAS | `await Promise.all([a, b, c])` |
| `assert.rejects(() => fn(), { message })` | testar que uma async REJEITA com o erro certo | `assert.rejects(() => fetchAddress('123'), { message: 'invalid cep format' })` |

> `await r.json()` também é assíncrono (o corpo chega em pedaços) — precisa de `await`. `async` sempre devolve Promise, mesmo com `return` de valor simples.

## Orientação a objetos — this, classes, protótipos (T12)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `this` em método | o objeto ANTES do ponto na chamada | `user.hi()` → `this` é `user` |
| `this` em arrow | NÃO tem `this` próprio; herda de fora | `bye: () => this.name` → `this` não é o objeto |
| `this` em chamada solta | perde o dono → `undefined` (strict) | `const f = user.hi; f()` → `this` indefinido |
| `class` / `constructor` | molde de objetos com estado + métodos | `class TaskStore { constructor() { this.tasks = [] } }` |
| `extends` / `super` | herdar de outra classe (inclui `extends Error`) | `class NotFoundError extends Error {}` |
| `instanceof` | testar de qual classe o objeto veio | `err instanceof ValidationError` → `true` |
| `Classe.prototype.metodo` | onde os métodos VIVEM (compartilhados) | `store.add === TaskStore.prototype.add` → `true` |

> Classe guarda ESTADO interno; função pura recebe e devolve sem guardar. Método (`function`) pega o `this` do dono; arrow NÃO — nunca use arrow como método que precisa de `this`.

## HTML/CSS funcional (T13)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `<!DOCTYPE html>` + `html/head/body` | estrutura mínima da página | `<meta charset="utf-8">` no head |
| tags semânticas | dar significado à estrutura | `header`, `main`, `ul/li`, `form`, `label` |
| `<input>` / `<button>` | campo de texto e botão | `<button type="submit">add</button>` |
| `<link rel="stylesheet">` | ligar o CSS ao HTML | `<link rel="stylesheet" href="style.css">` |
| seletor de tag / de classe | escolher o que estilizar | `li {}` (tag), `.completed {}` (classe) |
| box model | margin (fora) / border / padding (dentro) | espaçamento sem grudar |
| flexbox | alinhar em linha/coluna | `display: flex; gap: 8px; justify-content` |
| `text-decoration: line-through` | riscar item concluído | `.completed .title { text-decoration: line-through }` |

> `list-style: none` tira os marcadores da `<ul>`. `max-width` + `margin: 0 auto` no `main` centraliza e limita a largura.
