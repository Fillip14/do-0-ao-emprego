import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.disable('x-powered-by');
const tasks = [];

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/tasks', (req, res) => res.json(tasks));

app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const task = tasks.find((task) => task.id === taskId);

  if (typeof task === 'undefined') return res.status(404).json('Task não encontrada');

  return res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const title = req.body.title;

  if (typeof title !== 'string' || title.trim() === '')
    return res.status(400).json('Titulo inválido');

  const newTask = { id: crypto.randomUUID(), title: title };
  tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const newTitle = req.body.title;

  if (typeof newTitle !== 'string' || newTitle.trim() === '')
    return res.status(400).json('Titulo inválido');

  const task = tasks.find((task) => task.id === taskId);

  if (typeof task === 'undefined') return res.status(404).json('Task não encontrada');

  task.title = newTitle;

  return res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const posTask = tasks.findIndex((task) => task.id === taskId);

  if (posTask === -1) return res.status(404).json('Task não encontrada');

  tasks.splice(posTask, 1);

  return res.status(200).json({ message: 'Removido' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
