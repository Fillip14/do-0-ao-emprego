const fs = require('fs');

const readProducts = (path) => {
  const file = fs.readFileSync(path, 'utf8');
  const parsed = JSON.parse(file);
  return parsed;
};

const filterInStock = (products) => {
  if (!Array.isArray(products)) return null;
  return products.filter((product) => product.stock > 0);
};

const saveProducts = (path, products) => {
  if (!Array.isArray(products)) return null;
  const stringify = JSON.stringify(products, null, 2);
  fs.writeFileSync(path, stringify);
};

module.exports = { readProducts, filterInStock, saveProducts };
