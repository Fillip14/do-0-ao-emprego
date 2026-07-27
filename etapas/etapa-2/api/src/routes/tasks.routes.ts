import { type Request, type Response, type NextFunction, Router } from 'express';
import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import { parsePatchTask, parseTask, type NewTask, type Task } from '../tasks.js';
import { pool, queryDb } from '../db.js';
const tasksRoutes = Router();

const validateId = (req: Request, _res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return next(new AppError('Invalid id', HttpStatus.BAD_REQUEST, 'id'));
  }
  req.taskId = id;
  next();
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

tasksRoutes.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const tasks = await queryDb('SELECT * FROM tasks');

    res.json(tasks.rows);
  }),
);

tasksRoutes.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const parsedTask = parseTask(req.body);
    const result = await queryDb<Task>(
      'INSERT INTO tasks (title, status, term) VALUES ($1, $2, $3) RETURNING id, title, status, term',
      [parsedTask.title, parsedTask.status, parsedTask.term],
    );

    const newTask = result.rows[0];

    if (!newTask)
      throw new AppError('Insert error in DB', HttpStatus.INTERNAL_SERVER_ERROR, 'Insert DB');

    return res.status(HttpStatus.CREATED).location(`/tasks/${newTask.id}`).json(newTask);
  }),
);

// tasksRoutes.get('/:id', validateId, (req: Request, res: Response, next: NextFunction) => {
//   const task = tasks.find((task) => task.id === req.taskId);

//   if (!task) return next(new AppError('Not Found', HttpStatus.NOT_FOUND, 'id'));

//   return res.json(task);
// });

// tasksRoutes.patch('/:id', validateId, (req: Request, res: Response, next: NextFunction) => {
//   const patchTask = parsePatchTask(req.body);

//   const task = tasks.find((task) => task.id === req.taskId);

//   if (!task) return next(new AppError('Not Found', HttpStatus.NOT_FOUND, 'id'));

//   if (patchTask.title !== undefined) task.title = patchTask.title;
//   if (patchTask.status !== undefined) task.status = patchTask.status;
//   if (patchTask.term !== undefined) task.term = patchTask.term;

//   return res.json(task);
// });

// tasksRoutes.delete('/:id', validateId, (req: Request, res: Response, next: NextFunction) => {
//   const index = tasks.findIndex((task) => task.id === req.taskId);

//   if (index === -1) return next(new AppError('Not Found', HttpStatus.NOT_FOUND, 'id'));

//   tasks.splice(index, 1);

//   return res.status(204).send();
// });

// tasksRoutes.all('/', (_req: Request, res: Response, next: NextFunction) => {
//   res.set('Allow', 'GET, POST');
//   const err = new AppError('Method Not Allowed', HttpStatus.METHOD_NOT_ALLOWED, 'method');
//   return next(err);
// });

// tasksRoutes.all('/:id', (_req: Request, res: Response, next: NextFunction) => {
//   res.set('Allow', 'GET, PATCH, DELETE');
//   const err = new AppError('Method Not Allowed', HttpStatus.METHOD_NOT_ALLOWED, 'method');
//   return next(err);
// });

export default tasksRoutes;
