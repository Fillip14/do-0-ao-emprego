const assert = require('node:assert');
const { countWords } = require('./ex10');

const phrase = 'o rato roeu a roupa do rei de roma e o rei nao gostou';
const name = 'ana de  ana';
const nameTwo = 'Ana de  ana';
const empty = '';
const notObject = [];
const number = 48;

assert.deepStrictEqual(countWords(phrase), [
  ['o', 2],
  ['rei', 2],
  ['rato', 1],
  ['roeu', 1],
  ['a', 1],
  ['roupa', 1],
  ['do', 1],
  ['de', 1],
  ['roma', 1],
  ['e', 1],
  ['nao', 1],
  ['gostou', 1],
]);

assert.deepStrictEqual(countWords(name), [
  ['ana', 2],
  ['de', 1],
]);

assert.deepStrictEqual(countWords(nameTwo), [
  ['ana', 2],
  ['de', 1],
]);

assert.deepStrictEqual(countWords(empty), []);
assert.deepStrictEqual(countWords(notObject), null);
assert.deepStrictEqual(countWords(number), null);

console.log('Todos os testes passaram!');
