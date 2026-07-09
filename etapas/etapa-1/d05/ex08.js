// SEM nenhum `for`:
// (a) com estoque,
// (b) valor total,
// (c) mais caro,
// (d) novo: lista de nomes em maiúsculas dos produtos abaixo de R$100.

const products = [
  { name: 'teclado', price: 120.0, stock: 0 },
  { name: 'mouse', price: 55.5, stock: 0 },
  { name: 'monitor', price: 899.9, stock: 1 },
  { name: 'cabo hdmi', price: 25.0, stock: 0 },
];

const inStock = (products) => {
  if (!Array.isArray(products) || products.length === 0) return null;
  return products.filter((n) => n.stock > 0);
};

const totalValue = (products) => {
  if (!Array.isArray(products) || products.length === 0) return null;
  return inStock(products).map((n) => ({ name: n.name, total: n.price * n.stock }));
};

const mostExpensive = (products) => {
  if (!Array.isArray(products) || products.length === 0) return null;
  const justTotal = totalValue(products).map((n) => n.total);
  if (justTotal.length === 0) return null;
  const bigger = Math.max(...justTotal);

  return totalValue(products).find((n) => n.total === bigger);
};

const cheapNames = (products) => {
  if (!Array.isArray(products) || products.length === 0) return null;
  return products.filter((n) => n.price < 100).map((n) => n.name.toUpperCase());
};

// console.log(inStock(products));
// console.log(totalValue(products));
// console.log(mostExpensive(products));
// console.log(cheapNames(products));

module.exports = { inStock, totalValue, mostExpensive, cheapNames };
