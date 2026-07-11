# Resumo — métodos e ferramentas da Etapa 1

> Material de consulta. Regra dos drills continua: tenta de memória PRIMEIRO, consulta depois.

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

> Erro clássico (você já cometeu): usar `map` com push externo = trabalho de `forEach`; usar `forEach` esperando retorno = trabalho de `map`.

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

> Cópia RASA (3ª chance na avaliação!): spread/slice/filter/map copiam a "caixa", mas os OBJETOS dentro são os mesmos — alterar `copia[0].x` altera `original[0].x`. Cópia profunda: `JSON.parse(JSON.stringify(obj))`.

## JSON e arquivos (T8)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `JSON.parse(str)` | string JSON → estrutura NOVA (constrói tudo do zero) | `JSON.parse('[1,2]')` → `[1, 2]` |
| `JSON.stringify(x, null, 2)` | estrutura → string JSON (2 = indentação) | `JSON.stringify({a:1}, null, 2)` |
| `fs.readFileSync(path, 'utf8')` | ler arquivo → string | `const raw = fs.readFileSync('p.json', 'utf8')` |
| `fs.writeFileSync(path, str)` | escrever string no arquivo | `fs.writeFileSync('out.json', json)` |
| `module.exports` / `require` | exportar/importar (CommonJS) | `module.exports = { fn }` / `const { fn } = require('./lib.js')` |

> Fluxo: ler → `parse` → mexer → `stringify` → escrever. (parse = string PARA dados; stringify = dados PARA string — você inverteu uma vez, cuidado.)

## Erros (T9)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `throw new Error(msg)` | sinalizar problema e PARAR a função na hora | `throw new Error('invalid age: negative')` |
| `try/catch` | capturar erro lançado e reagir (quem sabe reagir captura) | `try { parseAge(x) } catch (e) { console.log(e.message) }` |
| `assert.throws(() => fn(x), { message })` | testar que lança O erro certo (passa a função SEM executar) | `assert.throws(() => parseAge('-5'), { message: 'invalid age: negative' })` |
| `assert.strictEqual(a, b)` | igualdade com `===` (confere valor E tipo) | `assert.strictEqual(parseAge('25'), 25)` |
| `assert.deepStrictEqual(a, b)` | igualdade profunda de arrays/objetos | `assert.deepStrictEqual(f(), { a: 1 })` |
