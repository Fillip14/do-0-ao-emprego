import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT inválida:', process.env.PORT);
  process.exit(1);
}

const server = createServer((req, res) => {
  console.log(req.url);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// 1. typeof string. Importa: listen() aceita string numérica, mas se
//    não for número ele trata como caminho de socket unix.
// 2. Com PORT=abc o servidor "sobe" e cria um arquivo chamado abc — não
//    escuta porta nenhuma. Falha silenciosa. Correto: converter com Number()
//    e sair com process.exit(1) se for inválido.
// 3. Porque o que muda entre ambientes sai do código: a porta é 3000 aqui e
//    outra em produção, definida pela plataforma. Fixa no código, trocar de
//    ambiente exigiria editar e reempacotar o app.
