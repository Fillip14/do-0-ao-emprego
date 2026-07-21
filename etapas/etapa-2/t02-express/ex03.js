import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/inspect/:id', (req, res) => {
  res.json({ params: req.params, query: req.query, body: req.body });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// curl -i -X POST  http://localhost:3000/inspect/2/?active=false -H "Content-Type: application/json" -d '{"title":"comprar pão"}'
