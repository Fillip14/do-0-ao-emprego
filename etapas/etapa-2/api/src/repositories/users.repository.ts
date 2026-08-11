import { queryDb } from '../db.js';

// Depende da tabela users, que ainda NÃO existe no schema aplicado —
// ver sql/tema8-draft-users.sql. Este repositório não roda até alguém
// aplicar aquele SQL a mão (dev e test) e confirmar o pg instalado.
export type UserRow = { id: string; email: string; password_hash: string };

export const findByEmail = async (email: string): Promise<UserRow | undefined> => {
  const result = await queryDb<UserRow>(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email],
  );
  return result.rows[0];
};

export const insert = async (email: string, passwordHash: string): Promise<Pick<UserRow, 'id' | 'email'>> => {
  const result = await queryDb<Pick<UserRow, 'id' | 'email'>>(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [email, passwordHash],
  );
  const user = result.rows[0];
  if (!user) throw new Error('Insert error in DB');
  return user;
};
