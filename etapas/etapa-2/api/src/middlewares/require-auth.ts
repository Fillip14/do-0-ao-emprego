import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import { verifyToken, type JwtPayload } from '../auth/jwt.js';

// Express não conhece req.user por padrão — este augment declara o campo
// só aqui, no módulo que de fato o preenche.
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

// 401 = não autenticado (sem token ou token inválido/expirado).
// 403 (não usado aqui, é do handler de dono da tarefa) = autenticado mas
// sem permissão sobre aquele recurso específico.
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) return next(new AppError('Missing token', HttpStatus.UNAUTHORIZED));

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError('Invalid token', HttpStatus.UNAUTHORIZED));
  }
};
