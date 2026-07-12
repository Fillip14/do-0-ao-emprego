const assert = require('node:assert');
const { wait } = require('./ex13.js');

const dateBefore = Date.now();
let resolved = false;

wait(50)
  .then(() => assert.ok(Date.now() - dateBefore >= 50))
  .then(() => console.log('Teste assíncrono de 50ms ok!'));
assert.ok(wait(0) instanceof Promise);

wait(50).then(() => (resolved = true));
assert.strictEqual(resolved, false);

console.log(`Todos testes síncronos passaram!`);
