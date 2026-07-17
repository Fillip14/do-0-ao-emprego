import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  console.log(req.method, req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end('{ "ok": true }');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
