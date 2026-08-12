import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import tasksRoutes from './routes/tasks.routes.js';
import authRoutes from './routes/auth.routes.js';
import morgan from 'morgan';
import { AppError, type ErrorDetail } from './errors.js';
import { HttpStatus } from './constants/http-constants.js';

const app = express();
const TASKS_PREFIX = '/tasks';
const AUTH_PREFIX = '/auth';
const WEB_ORIGIN = 'http://localhost:5173';

// Helmet: headers de segurança padrão (X-Content-Type-Options,
// Strict-Transport-Security etc.). Primeiro middleware, antes até do CORS
// — não interfere no que o CORS faz, só soma headers.
app.use(helmet());

// Middleware - CORS para o front da Etapa 3.
// Exceção única ao congelamento da API. Vem antes de tudo para que a resposta de
// erro também carregue o header — senão o navegador esconde o 400 atrás do CORS.
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', WEB_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  // Authorization somado no Tema 8 — sem isto, o preflight bloqueia o
  // header do token antes mesmo da requisição sair do navegador.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight: responde e encerra, sem passar pelas rotas.
  if (req.method === 'OPTIONS') {
    res.sendStatus(HttpStatus.NO_CONTENT);
    return;
  }

  next();
});

app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Tarefa tem dono desde o Tema 8: /tasks exige token (requireAuth, ligado
// dentro de tasks.routes.ts) e cada rota confere posse — 401 sem token,
// 403 com token de outro usuário.
app.use(AUTH_PREFIX, authRoutes);
app.use(TASKS_PREFIX, tasksRoutes);

// Middleware - Pagina não encontrada
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const err = new AppError('Not Found', HttpStatus.NOT_FOUND, 'route');
  next(err);
});

// Middleware - Tratador de erro central
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let field: string | undefined;
  let details: ErrorDetail[] | undefined;

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
    field = err.field;
    details = err.details;
  }

  if (status >= 500) console.error(err);

  // Erro de validação (zod, Tema 6): um item por campo — é o formato que
  // o front consome via ApiError.fieldErrors.
  if (details && details.length > 0) {
    res.status(status).json({ errors: details });
    return;
  }

  const errorDetails: ErrorDetail = { message };
  if (field) errorDetails.field = field;

  res.status(status).json({ errors: [errorDetails] });
});

export default app;
