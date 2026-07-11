const { readProducts, filterInStock, saveProducts } = require('./lib.js');

const PATH = './products.json';

const productsRead = readProducts(PATH);
const filtered = filterInStock(productsRead);
saveProducts('./in-stock.json', filtered);
