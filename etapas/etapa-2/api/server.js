import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.disable('x-powered-by');
const tasks = [];

app.use((req, res, next) => {
  console.log(req.method, req.url);
  console.log(req.headers);
  next();
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = { id: crypto.randomUUID(), title: req.body.title };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
