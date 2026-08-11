import type { Request, Response, NextFunction } from 'express';

// Embrulha um handler async: captura a rejeição da Promise e encaminha
// pro tratador central via next(err), sem try/catch espalhado pelas
// rotas. Compartilhado entre tasks.routes.ts e auth.routes.ts (Tema 8).
export const asyncHandler =
  <P = Request['params']>(
    fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<unknown>,
  ) =>
  (req: Request<P>, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
