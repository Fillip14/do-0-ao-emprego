const assert = require('node:assert');
const { getType } = require('./ex01');
const { safeNumber } = require('./ex02-extra');

assert.strictEqual(getType(1), 'number');
assert.strictEqual(getType('string'), 'string');
assert.strictEqual(getType(true), 'boolean');
assert.strictEqual(getType(null), 'null');
assert.strictEqual(getType(), 'undefined');
assert.strictEqual(getType([]), 'array');
assert.strictEqual(getType({}), 'object');
assert.strictEqual(getType(NaN), 'number');

assert.strictEqual(safeNumber('0'), 0);
assert.strictEqual(safeNumber('0.0'), 0.0);
assert.strictEqual(safeNumber('42'), 42);
assert.strictEqual(safeNumber(' 42 '), 42);
assert.strictEqual(safeNumber('3.5'), 3.5);
assert.strictEqual(safeNumber('12px'), null);
assert.strictEqual(safeNumber('abc'), null);
assert.strictEqual(safeNumber(''), null);
assert.strictEqual(safeNumber('   '), null);
assert.strictEqual(safeNumber('.5'), 0.5);
assert.strictEqual(safeNumber('NaN'), null);

console.log('Todos os testes passaram!');
