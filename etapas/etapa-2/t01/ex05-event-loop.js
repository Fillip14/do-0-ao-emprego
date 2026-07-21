import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer(async (req, res) => {
  console.log(req.url);

  if (req.url === '/slow') {
    // const dateBefore = Date.now();
    // while (Date.now() - dateBefore < 5000) {}
    await new Promise((resolve) => setTimeout(resolve, 5000));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Slow ok' }));
  }

  if (req.url === '/fast') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Fast ok' }));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ message: 'Not found' }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Demorou pois como era sincrono, o codigo estava bloqueando o event loop,
// enquanto nada retornava o Node nao processa mais nada.
// Agora o codigo se tornou assincrono e com isso nao ficou travado na promise
// JS é uma thread só, mas o NODE faz mais coisas por trás ao mesmo tempo.
// SYNC slow: 5.000s, fast: 3.000s; ASYNC slow: 5.000s, fast: 0.100 s
