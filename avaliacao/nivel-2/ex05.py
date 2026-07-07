produtos = [
    {"nome": "teclado", "preco": 120.0, "estoque": 3},
    {"nome": "mouse", "preco": 55.5, "estoque": 0},
    {"nome": "monitor", "preco": 899.9, "estoque": 7},
    {"nome": "cabo hdmi", "preco": 25.0, "estoque": 0},
]

more_value = {"product": "", "total_value": 0}

for produto in produtos:
    if produto["estoque"] > 0:
        total_value = produto['preco']*produto['estoque']
        print(f"{produto['nome'].capitalize()} - Valor total do estoque: R$ {total_value:.2f}")

        if total_value > more_value["total_value"]:
            more_value.update({"product": produto['nome'].capitalize(),
                         "total_value": produto['preco']*produto['estoque']})

print(f'O produto mais caro é: {more_value["product"]}. Com o valor total de: R$ {more_value["total_value"]:.2f}')