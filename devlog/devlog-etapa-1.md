## 08/07 - Dia 1

**Anotações**

1. null tem typeof object e array também pois tudo fora os primitivos é considerado objeto.
2. As comparações e logicas matematicas entre diferentes primitivos. Simbolos matemáticos sempre converte para o primitivo number, com excessao de + com string vira concatenação, os demais operadores só existem para números "1" + 1 = 11, "1" - 1 = 0, "oi" - 1 = NaN, "oi" + 1 = oi1.
3. No predictions.js errei 11 previsões. O que mais me surpreendeu foi string com number e os null/undefined.

**Fechamento**

- O que aprendi: primitivo e typeof
- Travei/faltou: entender melhor array/object, métodos primitivos (string, number, etc)
- Amanhã: dia 2

## 09/07 - Dia 2, 3, 4 e 5

**Anotações**

### D2
1. Closure: consigo fazer com que uma let/const persista dentro de uma function para ser reutilizada depois, geralmente tem uma callback no return.
2. slice(start, end): fatia a string, indice do start até o end (end não incluso). Sem end ele vai até o fim.
3. trim(): remove espaços das pontas
4. split(sep): separa a string em array, quebra no local do sep que eu colocar. Ex. sep = " ", quebra sempre no espaço, sep "-", quebra no hífen.
5. toLowerCase() / toUpperCase(): todas minusculas/todas maiusculas
6. includes(text): verifica se a string contem exatamente o text nela
7. padStart(len, char): completa, com o char, a string à esquerda até ela chegar no tamanho do len.
### D3
8. regex: padrao de regex sempre vai entre //, ele procura o que esta ali dentro no que tu colocar para test.
9. classes regex: \d: verifica se tem um digito; \w: tem uma letra, digito ou _; [A-Z]: tem uma letra maiuscula; [aeiou]: tem vogal minuscula; [^A-Z]: ^ simbolo de negação, não tem letra maiuscula; .: qualquer caracter;
10. quantificadores regex: \d+: 1 ou mais digitos; \d*: 0 ou mais; \d{3}: exatamente 3; \d{2,}: 2 ou mais; \d?: 0 ou 1; /a{3}/: tem tres "a" seguidos
11. ancoras regex: ^: inicio da string; $: fim da string
### D4
12. array.push(): adiciona no fim da fila, retorna length; .pop(): remove do fim e o retorna; .unshift(): adiciona no inicio; .shift(): remove do inicio e o retorna; .splice(indice, quantidade): remove quantidade apartir do indice (ele muda).
13. array.slice(start, end): pega o que esta no intervalo (copia), end exclusivos, sem end vai até o final; ...: rest = junta varios args num array (pega), spread =  espalhar em itens soltos, "desempacota" (entrega).
### D5
14. map, filter, find, some, every e forEach: todos recebem uma callback, a diferença é no que retornam, nenhum deles muta o original; .forEach(): só executa, imprimir, salvar, retorna undefined; .map(): transforma de acordo com o que foi pedido, retorna array do mesmo tamanho; .filter(): filtra, retorna quem passou no filtro; .find(): retorna o primeiro item que passar no filtro, undefined se não achar; .some(): retorna boolean se algum passar, para no primeiro true; .every(): boolean se todos passam, para no primeiro false.

**Fechamento**

- O que aprendi: closure, callback, fn dentro de fn, regex e métodos de array
- Travei/faltou: declaração esqueci duas vezes de const/let em fn. Errei 6 das 10 previsões do ex07, errei pois não estava analisando o retorno e sim como o array ficaria. Usar map, filter, find, some, every, forEach separados e juntos.
- Amanhã: dia 6