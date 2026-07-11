const assert = require('node:assert');
const { readProducts, filterInStock, saveProducts } = require('./lib.js');
const fs = require('fs');

const products = [
  { name: 'teclado', price: 120.0, stock: 3 },
  { name: 'mouse', price: 55.5, stock: 0 },
  { name: 'monitor', price: 899.9, stock: 7 },
  { name: 'cabo hdmi', price: 25.0, stock: 0 },
];

const productsStockEmpty = [
  { name: 'teclado', price: 120.0, stock: 0 },
  { name: 'mouse', price: 55.5, stock: 0 },
  { name: 'monitor', price: 899.9, stock: 0 },
  { name: 'cabo hdmi', price: 25.0, stock: 0 },
];

const notArray = {};
const string = 'abs';
const PATH = './products.json';

assert.deepStrictEqual(filterInStock(products), [
  { name: 'teclado', price: 120, stock: 3 },
  { name: 'monitor', price: 899.9, stock: 7 },
]);

assert.deepStrictEqual(products, [
  { name: 'teclado', price: 120.0, stock: 3 },
  { name: 'mouse', price: 55.5, stock: 0 },
  { name: 'monitor', price: 899.9, stock: 7 },
  { name: 'cabo hdmi', price: 25.0, stock: 0 },
]);

assert.deepStrictEqual(filterInStock(productsStockEmpty), []);
assert.deepStrictEqual(filterInStock(notArray), null);
assert.deepStrictEqual(filterInStock(string), null);

assert.deepStrictEqual(readProducts(PATH), [
  { name: 'teclado', price: 120.0, stock: 3 },
  { name: 'mouse', price: 55.5, stock: 0 },
  { name: 'monitor', price: 899.9, stock: 7 },
  { name: 'cabo hdmi', price: 25.0, stock: 0 },
]);

assert.deepStrictEqual(saveProducts('./tmp-test.json', products), undefined);
fs.unlinkSync('./tmp-test.json');

console.log('Todos os testes passaram!');
