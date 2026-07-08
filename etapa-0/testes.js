const assert = require('node:assert');
const { classificarIdade } = require('./ex01');
const { contarVogais } = require('./ex02');
const { aprovado } = require('./ex03');
const { dentroDoIntervalo } = require('./ex04');

assert.strictEqual(classificarIdade(-1), null);
assert.strictEqual(classificarIdade(11), 'criança');
assert.strictEqual(classificarIdade(12), 'adolescente');
assert.strictEqual(classificarIdade(17), 'adolescente');
assert.strictEqual(classificarIdade(18), 'adulto');
assert.strictEqual(classificarIdade(19), 'adulto');

assert.strictEqual(contarVogais('banana'), 3);
assert.strictEqual(contarVogais('banana'), 3);
assert.strictEqual(contarVogais('BANANA'), 3);
assert.strictEqual(contarVogais(''), 0);

assert.strictEqual(aprovado(7), true);
assert.strictEqual(aprovado(6.9), false);
assert.strictEqual(aprovado(7.1), true);

assert.strictEqual(dentroDoIntervalo(7, 6, 10), true);
assert.strictEqual(dentroDoIntervalo(6, 6, 10), true);
assert.strictEqual(dentroDoIntervalo(10, 6, 10), true);
assert.strictEqual(dentroDoIntervalo(6.1, 6, 10), true);
assert.strictEqual(dentroDoIntervalo(9.9, 6, 10), true);
assert.strictEqual(dentroDoIntervalo(5.9, 6, 10), false);
assert.strictEqual(dentroDoIntervalo(10.1, 6, 10), false);

console.log('Todos os testes passaram!');
