const assert = require('node:assert');
const { formatName } = require('./ex05');
const { validatePassword } = require('./ex06');

assert.strictEqual(formatName('  joão da SILVA '), 'João Da Silva');
assert.strictEqual(formatName('  joão da Teste'), 'João Da Teste');
assert.strictEqual(formatName('Leandro Da Rosa  '), 'Leandro Da Rosa');
assert.strictEqual(formatName('ana da ana  '), 'Ana Da Ana');
assert.strictEqual(formatName('Ana  Da Ana '), 'Ana Da Ana');

assert.deepStrictEqual(validatePassword('321'), {
  valid: false,
  errors: ['minimo 8 caracteres', 'minimo 1 letra maiuscula'],
});
assert.deepStrictEqual(validatePassword('Abcd!ef1'), {
  valid: true,
  errors: [],
});
assert.deepStrictEqual(validatePassword('abc1'), {
  valid: false,
  errors: ['minimo 8 caracteres', 'minimo 1 letra maiuscula'],
});
assert.deepStrictEqual(validatePassword('asdfasd'), {
  valid: false,
  errors: ['minimo 8 caracteres', 'minimo 1 numero', 'minimo 1 letra maiuscula'],
});
assert.deepStrictEqual(validatePassword('Asdfasd'), {
  valid: false,
  errors: ['minimo 8 caracteres', 'minimo 1 numero'],
});
assert.deepStrictEqual(validatePassword('Asdfasddd'), {
  valid: false,
  errors: ['minimo 1 numero'],
});
assert.deepStrictEqual(validatePassword('Asdfasddd1'), {
  valid: true,
  errors: [],
});
assert.deepStrictEqual(validatePassword('Aabbccd1'), {
  valid: true,
  errors: [],
});

console.log('Todos os testes passaram!');
