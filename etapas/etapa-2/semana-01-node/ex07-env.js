import { createServer } from 'node:http';

process.on('uncaughtException', (err) => {
  console.log('EXCEPTION:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.log('REJECTION:', err.message);
});

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  console.log(req.url);

  if (req.url === '/throw') {
    throw new Error('boom');
  }

  if (req.url === '/promise') {
    Promise.reject(new Error('boom'));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ message: 'Not found' }));
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
