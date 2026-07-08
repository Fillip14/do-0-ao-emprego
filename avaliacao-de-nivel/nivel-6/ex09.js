produtos = [
  { nome: 'teclado', preco: 120.0, estoque: 3 },
  { nome: 'mouse', preco: 55.5, estoque: 0 },
  { nome: 'monitor', preco: 899.9, estoque: 7 },
  { nome: 'cabo hdmi', preco: 25.0, estoque: 0 },
];

more_value = { product: '', total_value: 0 };

for (let i = 0; i < 4; i++) {
  if (produtos[i]['estoque'] > 0) {
    total_value = produtos[i]['preco'] * produtos[i]['estoque'];
    console.log(`${produtos[i]['nome']} - Valor total do estoque: R$ ${total_value}`);

    if (total_value > more_value['total_value']) {
      more_value = {
        product: produtos[i]['nome'],
        total_value: produtos[i]['preco'] * produtos[i]['estoque'],
      };
    }
  }
}

console.log(
  `O produto mais caro é: ${more_value['product']}. Com o valor total de: R$ ${more_value['total_value']}`,
);
