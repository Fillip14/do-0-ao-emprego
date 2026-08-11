import { expect } from 'vitest';
import request, { type Response } from 'supertest';
import app from '../app.js';
import type { NewTask } from '../validation/tasks.schema.js';

export const TASKS_PREFIX = '/tasks';

// createTask insere de verdade via POST (integração) e devolve a resposta
// crua, sem asserção — quem chama decide o que verificar. Separado de
// makeTask (só monta o payload) e sem expect() dentro, ao contrário do
// antigo postTask() que misturava preparo com verificação.
export const createTask = (payload: NewTask = { title: 'Comprar pão', status: 'todo', term: null }) =>
  request(app).post(TASKS_PREFIX).send(payload);

export const expectError = (res: Response, httpStatus: number, field: string, message: string) => {
  expect(res.status).toBe(httpStatus);
  expect(res.body.errors).toEqual([{ field, message }]);
};
