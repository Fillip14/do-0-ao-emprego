import { type Request, type Response, type NextFunction, Router } from 'express';
import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import { parsePatchTask, parseTask, type Task } from '../tasks.js';

const tasksRoutes = Router();

let nextId = 3;
const tasks: Task[] = [
  { id: 1, title: 'comprar pão', status: 'todo', term: 'Teste' },
  { id: 2, title: 'estudar express', status: 'todo', term: null },
];

// Para o teste
export const resetTasks = () => {
  tasks.length = 0;
  tasks.push({ id: 1, title: 'comprar pão', status: 'todo', term: 'oi' });
  tasks.push({ id: 2, title: 'estudar express', status: 'todo', term: null });
  nextId = 3;
};

const validateId = (req: Request, _res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return next(new AppError('Invalid id', HttpStatus.BAD_REQUEST, 'id'));
  }
  req.taskId = id;
  next();
};

// export const asyncHandler = (fn) => (req: Request, res: Response, next: NextFunction) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

tasksRoutes.get('/', (_req: Request, res: Response) => res.json(tasks));

tasksRoutes.post('/', (req: Request, res: Response) => {
  const receivedTask = parseTask(req.body);
  const newTask: Task = { id: nextId++, ...receivedTask };

  tasks.push(newTask);

  return res.status(HttpStatus.CREATED).location(`/tasks/${newTask.id}`).json(newTask);
});

tasksRoutes.get('/:id', validateId, (req: Request, res: Response, next: NextFunction) => {
  const task = tasks.find((task) => task.id === req.taskId);

  if (!task) return next(new AppError('Not Found', HttpStatus.NOT_FOUND, 'id'));

  return res.json(task);
});

tasksRoutes.patch('/:id', validateId, (req: Request, res: Response, next: NextFunction) => {
  const patchTask = parsePatchTask(req.body);

  const task = tasks.find((task) => task.id === req.taskId);

  if (!task) return next(new AppError('Not Found', HttpStatus.NOT_FOUND, 'id'));

  if (patchTask.title !== undefined) task.title = patchTask.title;
  if (patchTask.status !== undefined) task.status = patchTask.status;
  if (patchTask.term !== undefined) task.term = patchTask.term;

  return res.json(task);
});

tasksRoutes.delete('/:id', validateId, (req: Request, res: Response, next: NextFunction) => {
  const index = tasks.findIndex((task) => task.id === req.taskId);

  if (index === -1) return next(new AppError('Not Found', HttpStatus.NOT_FOUND, 'id'));

  tasks.splice(index, 1);

  return res.status(204).send();
});

tasksRoutes.all('/', (req: Request, res: Response, next: NextFunction) => {
  res.set('Allow', 'GET, POST, PATCH, DELETE');
  const err = new AppError('Method Not Allowed', HttpStatus.METHOD_NOT_ALLOWED, 'method');
  return next(err);
});

export default tasksRoutes;
