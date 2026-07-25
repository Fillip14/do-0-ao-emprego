import { Router } from 'express';

const tasksRoutes = Router();

const tasks = [
  { id: 1, title: 'comprar pão', done: false },
  { id: 2, title: 'estudar express', done: true },
];
let nextId = 3;

export const resetTasks = () => {
  tasks.length = 0;
  tasks.push({ id: 1, title: 'comprar pão', done: false });
  tasks.push({ id: 2, title: 'estudar express', done: true });
  nextId = 3;
};

const validateTitle = (req, res, next) => {
  const title = req.body?.title;
  if (typeof title !== 'string' || title.trim() === '') {
    const err = new Error('title is required');
    err.status = 400;
    err.field = 'title';
    return next(err);
  }
  next();
};

const validateId = (req, res, next) => {
  const idNumber = Number(req.params.id);

  if (idNumber <= 0 || !Number.isInteger(idNumber)) {
    const err = new Error('invalid id');
    err.status = 400;
    err.field = 'id';
    return next(err);
  }

  req.id = idNumber;
  next();
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

tasksRoutes.get('/', (req, res) => {
  return res.json(tasks);
});

tasksRoutes.get('/:id', validateId, (req, res, next) => {
  const task = tasks.find((task) => task.id === req.id);

  if (typeof task === 'undefined') {
    const err = new Error('not found');
    err.status = 404;
    err.field = 'id';
    return next(err);
  }

  return res.json(task);
});

tasksRoutes.post('/', validateTitle, (req, res) => {
  const newTask = { id: nextId++, title: req.body.title, done: false };
  tasks.push(newTask);
  return res.status(201).location(`/tasks/${newTask.id}`).json(newTask);
});

tasksRoutes.patch('/:id', validateId, validateTitle, (req, res, next) => {
  const task = tasks.find((task) => task.id === req.id);

  if (typeof task === 'undefined') {
    const err = new Error('not found');
    err.status = 404;
    err.field = 'id';
    return next(err);
  }

  task.title = req.body.title;

  return res.status(200).json(task);
});

tasksRoutes.delete('/:id', validateId, (req, res, next) => {
  const index = tasks.findIndex((task) => task.id === req.id);

  if (index === -1) {
    const err = new Error('not found');
    err.status = 404;
    err.field = 'id';
    return next(err);
  }

  tasks.splice(index, 1);

  return res.status(204).send();
});

tasksRoutes.all('/', (req, res, next) => {
  res.set('Allow', 'GET, POST');
  const err = new Error('method not allowed');
  err.status = 405;
  err.field = 'method';
  return next(err);
});

export default tasksRoutes;
