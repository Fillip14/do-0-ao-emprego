const assert = require('node:assert');
const { createCounter } = require('./ex1-3');
const { applyToEach, triple, toUpper } = require('./ex1-4');

const countA = createCounter();
const countB = createCounter();

assert.strictEqual(countA(), 1);
assert.strictEqual(countA(), 2);
assert.strictEqual(countA(), 3);
assert.strictEqual(countB(), 1);

const numbers = [1, 2];

assert.deepStrictEqual(applyToEach(triple, numbers), [3, 6]);
assert.deepStrictEqual(applyToEach(triple, numbers), [3, 6]);
assert.deepStrictEqual(applyToEach(toUpper, ['text1', 'text2']), ['TEXT1', 'TEXT2']);
assert.deepStrictEqual(applyToEach(toUpper, 'text'), null);

console.log('Todos os testes passaram!');
