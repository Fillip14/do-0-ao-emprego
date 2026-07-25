import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  console.log(req.url);

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Hello World' }));
  }

  if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Texto puro');
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// curl -i http://127.0.0.1:3000/
// HTTP/1.1 200 OK
// Content-Type: application/json
// Date: Tue, 21 Jul 2026 01:47:07 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5
// Transfer-Encoding: chunked

// {"message":"Hello World"}

// curl -i http://127.0.0.1:3000/about
// HTTP/1.1 200 OK
// Content-Type: text/plain
// Date: Tue, 21 Jul 2026 01:46:33 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5
// Transfer-Encoding: chunked

// Texto puro

// curl -i http://127.0.0.1:3000/a
// HTTP/1.1 404 Not Found
// Content-Type: application/json
// Date: Tue, 21 Jul 2026 01:48:02 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5
// Transfer-Encoding: chunked

// {"error":"Not found"}
