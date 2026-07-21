import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

app.get('/about', (req, res) => {
  res.send('Texto puro');
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

console.log(server.constructor.name);
// O res.end, JSON.stringify e content-type, sem if req.url
// Usa ele por baixo, server
// Ele passa por todas rotas, nenhuma casou, ele chama um finalhanlder que tem res 404
