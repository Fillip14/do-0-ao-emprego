## NAVEGADOR > PORTA

- Digita no navegador: http://localhost:3000/tasks
- Onde: host `localhost` (endereço IP, localhost resolve para o IP 127.0.0.1) - identificador da máquina
- Porta: `3000` - qual programa daquela máquina
- Pedido: GET /tasks

- Abre uma conexão TCP para o IP + PORTA e manda o texto do HTTP por dentro dela > 

## PORTA > PROCESSO

- A porta 3000 é do OS, quando chama listen(3000) ele diz para o kernel para entregar tudo que chegar na porta 3000.
- O kernel anota tudo numa tabela dele e acorda o processo quando algo chega.
- Dois processos diferentes na mesma porta da erro por isso, conflita

## PROCESSO > RESPOSTA

- O kernel entrega os bytes, o Node monta o req e chama o handler.
- O handler le e monta uma res: status, headers, body. Devolve na mesma conexão já aberta.

## RESPOSTA > NAVEGADOR

- Os bytes voltam pelo mesmo caminho.
- Navegador le o status, os headers e o Content-Type decidindo o que ele faz com o corpo, renderiza HTML, JSON cru, baixa arquivo.

Observação: um servidor não é um lugar e nem um arquivo, é um processo vivo, em loop, esperando o kernel avisar que chegou algum numa porta que ele reservou.