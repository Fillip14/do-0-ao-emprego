import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/tasks/:id', (req, res) => {
  const idNumber = Number(req.params.id);

  if (idNumber <= 0 || !Number.isInteger(idNumber))
    return res.status(400).json({ errors: [{ field: 'id', message: 'invalid id' }] });
  return res.json({ id: req.params.id, typeofId: typeof req.params.id });
});

app.get('/tasks/:listId/items/:itemId', (req, res) => {
  res.json({ listId: req.params.listId, itemId: req.params.itemId });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// curl -i  http://localhost:3000/tasks/abc
// curl -i  http://localhost:3000/tasks/abc/items/123
// formato de erro: {errors: [lista erros]} assim fica mais organizado e mais explicito
