import { randomUUID } from 'node:crypto';
import { expect } from 'vitest';
import request, { type Response } from 'supertest';
import app from '../app.js';
import type { NewTask } from '../validation/tasks.schema.js';

export const TASKS_PREFIX = '/tasks';
export const AUTH_PREFIX = '/auth';

// Registra um usuário com e-mail aleatório (evita colidir com a UNIQUE
// constraint se a suíte rodar mais de uma vez — a tabela users não é
// truncada entre testes, só a de tasks, ver test/setup.ts) e devolve o
// token pronto pra usar em Authorization.
export const registerTestUser = async (): Promise<{ token: string; email: string }> => {
  const email = `${randomUUID()}@teste.com`;
  const res = await request(app).post(`${AUTH_PREFIX}/register`).send({ email, password: 'senha1234' });
  return { token: res.body.token as string, email };
};

// Um "cliente" pré-autenticado: mesma interface do supertest, cada
// chamada já vem com o header Authorization. Usar em vez de request(app)
// direto em qualquer teste que precise de token.
export const asUser = (token: string) => ({
  get: (path: string) => request(app).get(path).set('Authorization', `Bearer ${token}`),
  post: (path: string) => request(app).post(path).set('Authorization', `Bearer ${token}`),
  patch: (path: string) => request(app).patch(path).set('Authorization', `Bearer ${token}`),
  delete: (path: string) => request(app).delete(path).set('Authorization', `Bearer ${token}`),
});

// createTask insere de verdade via POST (integração) e devolve a resposta
// crua, sem asserção — quem chama decide o que verificar. Separado de
// makeTask (só monta o payload) e sem expect() dentro, ao contrário do
// antigo postTask() que misturava preparo com verificação.
export const createTask = (
  token: string,
  payload: NewTask = { title: 'Comprar pão', status: 'todo', term: null },
) => asUser(token).post(TASKS_PREFIX).send(payload);

export const expectError = (res: Response, httpStatus: number, field: string, message: string) => {
  expect(res.status).toBe(httpStatus);
  expect(res.body.errors).toEqual([{ field, message }]);
};
