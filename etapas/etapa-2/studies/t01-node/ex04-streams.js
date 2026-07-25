import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  console.log(req.url);

  if (req.method === 'POST') {
    let count = 0;

    req.on('data', (chunk) => {
      count++;
      console.log(`chunk ${count}: ${chunk.length} bytes`);
    });

    req.on('end', () => {
      console.log(`fim: ${count} chunks`);
      res.end('ok');
    });
    return;
  }

  res.writeHead(200);
  return res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Chegaram 32 chunks, 65536 bytes cada
// Pois o dado é muito grande, chega em pedaços
// É perigoso um dado inteiro desse de uma vez só, nao tem RAM suficiente
// Pra ter o corpo como string: acumular os chunks num array,
// juntar com Buffer.concat e converter com toString().
// (É o que o express.json() faz, + JSON.parse no fim.)
