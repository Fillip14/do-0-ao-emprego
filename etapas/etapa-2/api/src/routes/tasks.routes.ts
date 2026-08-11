import { type Request, type Response, type NextFunction, Router } from 'express';
import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import * as tasksService from '../services/tasks.service.js';
import { asyncHandler } from '../middlewares/async-handler.js';
const tasksRoutes = Router();

const validateId = (req: Request<{ id: string }>, _res: Response, next: NextFunction) => {
  const id = req.params.id;

  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!UUID.test(id)) return next(new AppError('Invalid id', HttpStatus.BAD_REQUEST, 'id'));

  next();
};

// A rota só lê request e monta response — regra de negócio e SQL saíram
// daqui (Tema 6): moram em services/tasks.service.ts e
// repositories/tasks.repository.ts.

tasksRoutes.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { tasks, total } = await tasksService.listTasks(req.query);

    // Corpo continua sendo o array puro — o front em produção já espera
    // isso de GET /tasks. Paginação/total vêm por header, não por
    // envelope, para não quebrar contrato ao vivo (ver api/README.md).
    res.setHeader('X-Total-Count', String(total));
    res.json(tasks);
  }),
);

tasksRoutes.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const newTask = await tasksService.createTask(req.body);
    return res.status(HttpStatus.CREATED).location(`/tasks/${newTask.id}`).json(newTask);
  }),
);

tasksRoutes.get(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const task = await tasksService.getTaskById(req.params.id);
    return res.json(task);
  }),
);

tasksRoutes.patch(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const task = await tasksService.updateTask(req.params.id, req.body);
    return res.json(task);
  }),
);

tasksRoutes.delete(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await tasksService.deleteTask(req.params.id);
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
