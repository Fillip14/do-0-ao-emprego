const assert = require('node:assert');
const { parseAge } = require('./ex12.js');

assert.strictEqual(parseAge('25'), 25);
assert.strictEqual(parseAge(' 30 '), 30);
assert.strictEqual(parseAge('0'), 0);
assert.strictEqual(parseAge('1e2'), 100);

assert.throws(() => parseAge('abc'), { message: 'invalid age: not a number' });
assert.throws(() => parseAge(''), { message: 'invalid age: not a number' });
assert.throws(() => parseAge(' '), { message: 'invalid age: not a number' });
assert.throws(() => parseAge('12px'), { message: 'invalid age: not a number' });
assert.throws(() => parseAge('-5'), { message: 'invalid age: negative' });
assert.throws(() => parseAge(' 3.5 '), { message: 'invalid age: not an integer' });
assert.throws(() => parseAge(-3.5), { message: 'invalid age: negative' });

console.log('Todos testes passaram!');
