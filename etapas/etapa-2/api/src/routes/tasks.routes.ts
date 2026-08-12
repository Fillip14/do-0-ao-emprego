import { type Request, type Response, type NextFunction, Router } from 'express';
import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import * as tasksService from '../services/tasks.service.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { requireAuth } from '../middlewares/require-auth.js';
const tasksRoutes = Router();

// Toda rota daqui pra baixo exige token — vem antes de qualquer .get/.post,
// inclusive dos handlers de 405 no fim do arquivo (Express roda middleware
// de .use() na ordem de registro, não importa o método da request).
tasksRoutes.use(requireAuth);

const validateId = (req: Request<{ id: string }>, _res: Response, next: NextFunction) => {
  const id = req.params.id;

  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!UUID.test(id)) return next(new AppError('Invalid id', HttpStatus.BAD_REQUEST, 'id'));

  next();
};

// req.user é opcional no tipo (Request['user']?), porque nem toda rota da
// API passa por requireAuth — mas toda rota DESTE arquivo passa (linha 11).
// Isto é defesa em profundidade, não o que realmente barra quem não tem
// token: se chegou aqui sem user, é bug no middleware, não payload malicioso.
// Tipado com Pick<Request, 'user'> em vez de Request pra aceitar tanto
// Request quanto Request<{ id: string }> sem atrito de generics.
const getOwnerId = (req: Pick<Request, 'user'>): string => {
  if (!req.user) throw new AppError('Missing token', HttpStatus.UNAUTHORIZED);
  return req.user.sub;
};

// A rota só lê request e monta response — regra de negócio e SQL saíram
// daqui (Tema 6): moram em services/tasks.service.ts e
// repositories/tasks.repository.ts.

tasksRoutes.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { tasks, total } = await tasksService.listTasks(req.query, getOwnerId(req));

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
    const newTask = await tasksService.createTask(req.body, getOwnerId(req));
    return res.status(HttpStatus.CREATED).location(`/tasks/${newTask.id}`).json(newTask);
  }),
);

tasksRoutes.get(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const task = await tasksService.getTaskById(req.params.id, getOwnerId(req));
    return res.json(task);
  }),
);

tasksRoutes.patch(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const task = await tasksService.updateTask(req.params.id, req.body, getOwnerId(req));
    return res.json(task);
  }),
);

tasksRoutes.delete(
  '/:id',
  validateId,
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await tasksService.deleteTask(req.params.id, getOwnerId(req));
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
