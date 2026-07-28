import { type Request, type Response, type NextFunction, Router } from 'express';
import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import { parsePatchTask, parseTask, type Task } from '../tasks.js';
import { queryDb } from '../db.js';
const tasksRoutes = Router();

const validateId = (req: Request<{ id: string }>, _res: Response, next: NextFunction) => {
  const id = req.params.id;

  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!UUID.test(id)) return next(new AppError('Invalid id', HttpStatus.BAD_REQUEST, 'id'));

  next();
};

export const asyncHandler =
  <P = Request['params']>(
    fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<unknown>,
  ) =>
  (req: Request<P>, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

tasksRoutes.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const tasks = await queryDb<Task>(
      'SELECT id, title, status, term FROM tasks ORDER BY created_at',
    );

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

tasksRoutes.get(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    const result = await queryDb<Task>('SELECT id, title, status, term FROM tasks WHERE id = $1', [
      id,
    ]);
    if (!result.rows[0]) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');

    return res.json(result.rows[0]);
  }),
);

tasksRoutes.patch(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const patchTask = parsePatchTask(req.body);
    const id = req.params.id;
    let stringPatch = 'UPDATE tasks SET';
    let posArray = 1;
    const arrayUpdate: Array<string | null> = [];

    if (patchTask.title !== undefined) {
      stringPatch = stringPatch + ` title = $${posArray++}`;
      arrayUpdate.push(patchTask.title);
    }
    if (patchTask.status !== undefined) {
      if (posArray > 1) stringPatch = stringPatch + ',';
      stringPatch = stringPatch + ` status = $${posArray++}`;
      arrayUpdate.push(patchTask.status);
    }
    if (patchTask.term !== undefined) {
      if (posArray > 1) stringPatch = stringPatch + ',';

      stringPatch = stringPatch + ` term = $${posArray++}`;
      arrayUpdate.push(patchTask.term);
    }

    arrayUpdate.push(id);

    const result = await queryDb<Task>(
      stringPatch + ` WHERE id = $${posArray++} RETURNING id, title, status, term`,
      arrayUpdate,
    );

    const task = result.rows[0];

    if (!task) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');

    return res.json(result.rows[0]);
  }),
);

tasksRoutes.delete(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    const result = await queryDb<Pick<Task, 'id'>>('DELETE FROM tasks WHERE id = $1 RETURNING id', [
      id,
    ]);

    if (!result.rows[0]) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');

    return res.status(HttpStatus.NO_CONTENT).send();
  }),
);

tasksRoutes.all('/', (_req: Request, res: Response, next: NextFunction) => {
  res.set('Allow', 'GET, POST');
  const err = new AppError('Method Not Allowed', HttpStatus.METHOD_NOT_ALLOWED, 'method');
  return next(err);
});

tasksRoutes.all('/:id', (_req: Request, res: Response, next: NextFunction) => {
  res.set('Allow', 'GET, PATCH, DELETE');
  const err = new AppError('Method Not Allowed', HttpStatus.METHOD_NOT_ALLOWED, 'method');
  return next(err);
});

export default tasksRoutes;
