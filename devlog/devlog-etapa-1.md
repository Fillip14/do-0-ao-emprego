## 08/07 - Tema 1

**Anotações**

1. null tem typeof object e array também pois tudo fora os primitivos é considerado objeto.
2. As comparações e logicas matematicas entre diferentes primitivos. Simbolos matemáticos sempre converte para o primitivo number, com excessao de + com string vira concatenação, os demais operadores só existem para números "1" + 1 = 11, "1" - 1 = 0, "oi" - 1 = NaN, "oi" + 1 = oi1.
3. No predictions.js errei 11 previsões. O que mais me surpreendeu foi string com number e os null/undefined.

**Fechamento**

- O que aprendi: primitivo e typeof
- Travei/faltou: nada
- Amanhã: dia 2

## 09/07 - Temas 2, 3, 4 e 5

**Anotações**

### T2
1. Closure: consigo fazer com que uma let/const persista dentro de uma function para ser reutilizada depois, geralmente tem uma callback no return.
2. slice(start, end): fatia a string, indice do start até o end (end não incluso). Sem end ele vai até o fim.
3. trim(): remove espaços das pontas
4. split(sep): separa a string em array, quebra no local do sep que eu colocar. Ex. sep = " ", quebra sempre no espaço, sep "-", quebra no hífen.
5. toLowerCase() / toUpperCase(): todas minusculas/todas maiusculas
6. includes(text): verifica se a string contem exatamente o text nela
7. padStart(len, char): completa, com o char, a string à esquerda até ela chegar no tamanho do len.
### T3
8. regex: padrao de regex sempre vai entre //, ele procura o que esta ali dentro no que tu colocar para test.
9. classes regex: \d: verifica se tem um digito; \w: tem uma letra, digito ou _; [A-Z]: tem uma letra maiuscula; [aeiou]: tem vogal minuscula; [^A-Z]: ^ simbolo de negação, não tem letra maiuscula; .: qualquer caracter;
10. quantificadores regex: \d+: 1 ou mais digitos; \d*: 0 ou mais; \d{3}: exatamente 3; \d{2,}: 2 ou mais; \d?: 0 ou 1; /a{3}/: tem tres "a" seguidos
11. ancoras regex: ^: inicio da string; $: fim da string
### T4
12. array.push(): adiciona no fim da fila, retorna length; .pop(): remove do fim e o retorna; .unshift(): adiciona no inicio; .shift(): remove do inicio e o retorna; .splice(indice, quantidade): remove quantidade apartir do indice (ele muda).
13. array.slice(start, end): pega o que esta no intervalo (copia), end exclusivos, sem end vai até o final; ...: rest = junta varios args num array (pega), spread =  espalhar em itens soltos, "desempacota" (entrega).
### T5
14. map, filter, find, some, every e forEach: todos recebem uma callback, a diferença é no que retornam, nenhum deles muta o original; .forEach(): só executa, imprimir, salvar, retorna undefined; .map(): transforma de acordo com o que foi pedido, retorna array do mesmo tamanho; .filter(): filtra, retorna quem passou no filtro; .find(): retorna o primeiro item que passar no filtro, undefined se não achar; .some(): retorna boolean se algum passar, para no primeiro true; .every(): boolean se todos passam, para no primeiro false.

**Fechamento**

- O que aprendi: closure, callback, fn dentro de fn, regex e métodos de array
- Travei/faltou: declaração esqueci duas vezes de const/let em fn. Errei 6 das 10 previsões do ex07, errei pois não estava analisando o retorno e sim como o array ficaria.
- Amanhã: dia 6

## 10/07 - Temas 6, 7 e 8

**Anotações**

### T6
1. .reduce((acc, n)): transforma o array em uma coisa só, o acc é um acumulador do que está sendo feito; o que meu callback retorna nesta volta vira o acc da próxima volta. O valor inicial é o acc da primeira volta; sem ele, array vazio dá erro., n é o elemento do array. reduce com acc objeto: inicial {}, cada volta cria/incrementa a chave e retorna o acc.
2. .sort(): ordena o array, "sort", se não tiver comparadora ordena como string, ele muta o original, para preservar faz um spread; comparadora retorna número: negativo = a antes, positivo = b antes, zero = empate; a - b só funciona para números
3. Métodos que mutam: push, pop, shift, unshift, splice, sort e reverse (antigos); não mutam: slice, map, filter, find, concat, reduce, spread (novos) 

### T7
3. ".": quando tu sabe o nome da chave (player.name); [key]: pra quando a key está numa variável
4. Object.keys(): pega as chaves; .values(): pega os valores; .entries(): pega cada chave/valor do objeto e transforma num array. Todos retornam array, .entries retorna array de pares [chave, valor].
5. Desestruturação: pega um objeto inteiro e "separa" pelo nome da chave; em array ele separa em ordem.
6. spread: copia rasa de tudo, se colocar uma chave ele sobreescreve a chave original. Métodos que copiam o array copiam a "caixa" nao os objetos dentro, por isso eu consigo alterar o que tem dentro e o original muda junto.

### T8
7. JSON: um arquivo de texto. Uma forma unificada de conversas entre API. JSON.parse(): transforma no que a string descreve: array, objeto, numero etc. JSON.stringify(): transforma de volta para string (nesse você consegue colocar um terceiro argumento que coloca espaços por nível de profundidade para deixar mais legivel.)
8. fs: modulo do node para mexer em arquivos. fs.readFileSync(): le o arquivo e retorna string; fs.writeFileSync(): escreve o texto no arquivo. Usar utf8. Ler arquivo > JSON.parse(). JSON.stringify() > escrever arquivo.
9. CommonJS: padrão antigo (module.exports/require). ESM: padrão novo (export/import). Se misturar os dois vai dar erro.

**Fechamento**

- O que aprendi: reduce, sort, metodos de objetos, json, fs e padrões JS.
- Travei/faltou: nada
- Amanhã: tema 9

## 11/07 - Temas 9

**Anotações**

### T9
1. throw new Error(): serve para sinalizar/lançar erros, exemplo ao inves de a funcao retornar null ou undefined numa conta errada, por exemplo, ela cria um objeto de erro, existe o err.message(string passada), err.stack (caminho de chamadas)
2. try/catch: captura de erros lançados para o programa não quebrar, o bloco dentro de try roda normal, se nada lançar erro ele passa, se nao o erro é capturado e vai para o catch. NUNCA usar catch vazio. 
3. assert.throws: ele mesmo chama a função não executada dentro para testar se ela quebra do jeito certo e confere error.message esperado.
4. "1e2" notacoes cientificas tambem devem ser consideradas com number quando precisamos converter.

**Fechamento**

- O que aprendi: como usar throw new Error, try/catch, assert.throws, [...] COPIA SÓ A CAIXA EXTERNA E NAO OS OBJETOS, SE EU ALTERAR ALTERA O ORIGINAL. push > length
- Travei/faltou: leitura de enunciado ainda inconsistente.
- Amanhã: tema 10