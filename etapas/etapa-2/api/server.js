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

const validateTitle = (req, res, next) => {
  const title = req.body.title;

  if (typeof title !== 'string' || title.trim() === '')
    return res.status(400).json({ message: 'Invalid title' });

  next();
};

app.get('/tasks', (req, res) => res.json(tasks));

app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const task = tasks.find((task) => task.id === taskId);

  if (typeof task === 'undefined') return res.status(404).json({ message: 'Task not found' });

  return res.status(200).json(task);
});

app.post('/tasks', validateTitle, (req, res) => {
  const title = req.body.title;

  const newTask = { id: crypto.randomUUID(), title: title };
  tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.patch('/tasks/:id', validateTitle, (req, res) => {
  const taskId = req.params.id;
  const newTitle = req.body.title;

  const task = tasks.find((task) => task.id === taskId);

  if (typeof task === 'undefined') return res.status(404).json({ message: 'Task not found' });

  task.title = newTitle;

  return res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const posTask = tasks.findIndex((task) => task.id === taskId);

  if (posTask === -1) return res.status(404).json({ message: 'Task not found' });

  tasks.splice(posTask, 1);

  return res.status(200).json({ message: 'Removed' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: 'An unexpected error occurred' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
