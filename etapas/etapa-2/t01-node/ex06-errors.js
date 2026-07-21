import { createServer } from 'node:http';

process.on('uncaughtException', (err) => {
  console.log('EXCEPTION:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.log('REJECTION:', err.message);
});

const hostname = '127.0.0.1';
const port = 3000;

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

// Sem os handlers: o processo morre nas duas rotas, o curl fica pendurado.
// Com os handlers: o log aparece e o servidor continua vivo.
// Perigoso continuar vivo: o processo pode estar num estado quebrado
// (transação aberta, memória inconsistente). Em produção: logar e reiniciar.
