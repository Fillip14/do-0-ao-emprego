import { Router } from 'express';

const tasksRoutes = Router();

const tasks = [
  { id: 1, title: 'comprar pão', done: false },
  { id: 2, title: 'estudar express', done: true },
];
let nextId = 3;

const validateTitle = (req, res, next) => {
  const { title } = req.body;
  if (typeof title !== 'string' || title.trim() === '') {
    const err = new Error('title is required');
    err.status = 400;
    return next(err);
  }
  next();
};

tasksRoutes.get('/', (req, res) => {
  return res.json(tasks);
});

tasksRoutes.get('/:id', (req, res, next) => {
  const idNumber = Number(req.params.id);

  if (idNumber <= 0 || !Number.isInteger(idNumber)) {
    const err = new Error('invalid id');
    err.status = 400;
    return next(err);
  }

  const task = tasks.find((task) => task.id === idNumber);

  if (typeof task === 'undefined') {
    const err = new Error('not found');
    err.status = 404;
    return next(err);
  }

  return res.json(task);
});

tasksRoutes.get('/:listId/items/:itemId', (req, res) => {
  return res.json({ listId: req.params.listId, itemId: req.params.itemId });
});

tasksRoutes.post('/', validateTitle, (req, res) => {
  const newTask = { id: nextId++, title: req.body.title, done: false };
  tasks.push(newTask);
  return res.status(201).location(`/tasks/${newTask.id}`).json(newTask);
});

tasksRoutes.delete('/:id', (req, res, next) => {
  const idNumber = Number(req.params.id);

  if (idNumber <= 0 || !Number.isInteger(idNumber)) {
    const err = new Error('invalid id');
    err.status = 400;
    return next(err);
  }

  const index = tasks.findIndex((task) => task.id === idNumber);

  if (index === -1) {
    const err = new Error('not found');
    err.status = 404;
    return next(err);
  }

  tasks.splice(index, 1);

  return res.status(204).send();
});

tasksRoutes.all('/', (req, res) => {
  return res
    .set('Allow', 'GET, POST')
    .status(405)
    .json({ errors: [{ message: 'method not allowed' }] });
});

export default tasksRoutes;
