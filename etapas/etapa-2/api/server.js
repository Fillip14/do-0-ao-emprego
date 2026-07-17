import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const tasks = [];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = { id: crypto.randomUUID(), title: req.body.titulo };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
