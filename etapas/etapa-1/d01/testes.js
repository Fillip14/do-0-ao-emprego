const assert = require('node:assert');
const { getType } = require('./ex1-1');

assert.strictEqual(getType(1), 'number');
assert.strictEqual(getType('string'), 'string');
assert.strictEqual(getType(true), 'boolean');
assert.strictEqual(getType(null), 'null');
assert.strictEqual(getType(), 'undefined');
assert.strictEqual(getType([]), 'array');
assert.strictEqual(getType({}), 'object');
assert.strictEqual(getType(NaN), 'number');

console.log('Todos os testes passaram!');
