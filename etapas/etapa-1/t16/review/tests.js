const assert = require('node:assert');
const { createCounter } = require('./ex03.js');
const { gradeStats } = require('./ex09.js');
const { countWords } = require('./ex10.js');

const countA = createCounter();
const countB = createCounter();

assert.strictEqual(countA(), 1);
assert.strictEqual(countA(), 2);
assert.strictEqual(countB(), 1);

const original = [8, 4, 10, 6.5];
const emptyGrades = [];

assert.deepStrictEqual(gradeStats(original), {
  average: 7.125,
  highest: 10,
  lowest: 4,
  approved: 2,
});

assert.deepStrictEqual(gradeStats(emptyGrades), null);

const text = 'o rato roeu a roupa do rato o a';
const emptyText = '';

assert.deepStrictEqual(countWords(text), [
  ['o', 2],
  ['rato', 2],
  ['a', 2],
  ['roeu', 1],
  ['roupa', 1],
  ['do', 1],
]);

assert.deepStrictEqual(countWords(emptyText), null);

console.log('Todos testes passaram');
