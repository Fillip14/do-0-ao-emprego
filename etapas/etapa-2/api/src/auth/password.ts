import bcrypt from 'bcrypt';

// Custo alto o bastante pra ser lento de propósito (dificulta força
// bruta offline), sem pesar demais numa API pequena. 10-12 é a faixa
// recomendada em 2026; ajustar pra cima se o hardware do host aguentar.
const SALT_ROUNDS = 12;

// bcrypt já embute o salt no hash de saída — não existe coluna de salt
// separada, nem precisa: "$2b$12$<salt><hash>" é uma string só.
export const hashPassword = (plain: string): Promise<string> => bcrypt.hash(plain, SALT_ROUNDS);

export const comparePassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);
