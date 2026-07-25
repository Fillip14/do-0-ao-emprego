import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/echo', (req, res) => {
  res.json({ body: req.body });
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// curl -i -X POST localhost:3000/echo -H "Content-Type: application/json" -d '{"title":"comprar pão"}'
// {"title":"comprar pão"}
// fica {} vazio, ele transforma o undefined em {}
// Unexpected end of JSON input
// ele nao retorna nada
