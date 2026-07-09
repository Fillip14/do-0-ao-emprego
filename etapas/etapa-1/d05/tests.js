const assert = require('node:assert');
const { inStock, totalValue, mostExpensive, cheapNames } = require('./ex08');

const products = [
  { name: 'teclado', price: 120.0, stock: 3 },
  { name: 'mouse', price: 55.5, stock: 0 },
  { name: 'monitor', price: 899.9, stock: 7 },
  { name: 'cabo hdmi', price: 25.0, stock: 0 },
];

const productsZero = [
  { name: 'teclado', price: 120.0, stock: 0 },
  { name: 'mouse', price: 55.5, stock: 0 },
  { name: 'monitor', price: 899.9, stock: 0 },
  { name: 'cabo hdmi', price: 25.0, stock: 0 },
];

const productsEmpty = [];
const notArray = {};

assert.deepStrictEqual(inStock(products), [
  { name: 'teclado', price: 120, stock: 3 },
  { name: 'monitor', price: 899.9, stock: 7 },
]);

assert.deepStrictEqual(totalValue(products), [
  { name: 'teclado', total: 360 },
  { name: 'monitor', total: 6299.3 },
]);
assert.deepStrictEqual(mostExpensive(products), { name: 'monitor', total: 6299.3 });
assert.deepStrictEqual(cheapNames(products), ['MOUSE', 'CABO HDMI']);

assert.deepStrictEqual(inStock(productsEmpty), null);
assert.deepStrictEqual(mostExpensive(notArray), null);
assert.deepStrictEqual(mostExpensive(productsZero), null);

console.log('Todos os testes passaram!');
