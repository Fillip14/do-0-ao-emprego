import jwt from 'jsonwebtoken';

// Falha rápido e claro se ninguém configurou o segredo, em vez de assinar
// token com um valor previsível. Gerar com `openssl rand -hex 32` e pôr
// em .env como JWT_SECRET — nunca commitado (ver api/README.md).
const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET não definido. Gere um valor aleatório (ex.: openssl rand -hex 32) e ponha no .env.',
    );
  }
  return secret;
};

export type JwtPayload = { sub: string; email: string };

// Token de vida curta — não existe refresh token nem lista de revogação
// ainda (limitação registrada: ver Tema 8 no resumo-temas-5-10-miolo.md).
export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, getSecret(), { expiresIn: '1h' });

export const verifyToken = (token: string): JwtPayload => jwt.verify(token, getSecret()) as JwtPayload;
