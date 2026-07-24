import express, { type Request, type Response, type NextFunction } from 'express';
import tasksRoutes from './routes/tasks.routes.js';
import morgan from 'morgan';
import { AppError, type ErrorDetail } from './errors.js';
import { HttpStatus } from './constants/http-constants.js';

const app = express();
const TASKS_PREFIX = '/tasks';

app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.use(TASKS_PREFIX, tasksRoutes);

// Middleware - Pagina não encontrada
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const err = new AppError('Not Found', HttpStatus.NOT_FOUND, 'Route');
  next(err);
});

// Middleware - Tratador de erro central
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let field: string | undefined;

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
    field = err.field;
  }

  if (status >= 500) console.error(err);

  const errorDetails: ErrorDetail = { message };
  if (field) errorDetails.field = field;

  res.status(status).json({ errors: [errorDetails] });
});

export default app;
