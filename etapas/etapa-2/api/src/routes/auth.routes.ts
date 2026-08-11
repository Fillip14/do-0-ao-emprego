import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { HttpStatus } from '../constants/http-constants.js';

const authRoutes = Router();

// Freia força bruta contra login/cadastro. Só nestas duas rotas — não faz
// sentido no resto da API ainda, e adicionar rate limit global sem testar
// contra o front ao vivo é risco desnecessário fora deste tema.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

authRoutes.use(authLimiter);

authRoutes.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(HttpStatus.CREATED).json(result);
  }),
);

authRoutes.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(HttpStatus.OK).json(result);
  }),
);

export default authRoutes;
