import { describe, it, expect, beforeEach } from 'vitest';
import request, { type Response } from 'supertest';
import app from './app.js';
import { resetTasks } from './routes/tasks.routes.js';
import { HttpStatus } from './constants/http-constants.js';
import { isNewTask, parseTask } from './tasks.js';
import { AppError } from './errors.js';

beforeEach(() => {
  resetTasks();
});

const TASKS_PREFIX = '/tasks';

const expectError = (res: Response, httpStatus: number, field: string, message: string) => {
  expect(res.status).toBe(httpStatus);
  expect(res.body.errors).toEqual([{ field, message }]);
};

describe('Routes errors', () => {
  it('responde 404 em rota inexistente', async () => {
    const res = await request(app).get('/oi');
    expectError(res, HttpStatus.NOT_FOUND, 'Route', 'Not Found');
  });

  it('responde 405 em method inexistente em /', async () => {
    const res = await request(app).put(TASKS_PREFIX);
    expectError(res, HttpStatus.METHOD_NOT_ALLOWED, 'method', 'Method Not Allowed');
  });

  it('responde 405 em method inexistente em /:id', async () => {
    const res = await request(app).put(`${TASKS_PREFIX}/1`);
    expectError(res, HttpStatus.METHOD_NOT_ALLOWED, 'method', 'Method Not Allowed');
  });
});

describe('tasks.ts', () => {
  it('retorna true para uma task válida', () => {
    expect(
      isNewTask({
        title: 'Teste',
        status: 'todo',
        term: null,
      }),
    ).toBe(true);
  });

  it('retorna false para uma task com chave inválida', () => {
    expect(
      isNewTask({
        banana: 'Teste',
      }),
    ).toBe(false);
  });

  it('retorna a task quando válida', () => {
    const task = parseTask({
      title: 'Teste',
      status: 'todo',
      term: null,
    });

    expect(task).toEqual({
      title: 'Teste',
      status: 'todo',
      term: null,
    });
  });

  it('lança AppError quando a task é inválida', () => {
    expect(() =>
      parseTask({
        banana: 'Teste',
      }),
    ).toThrow(AppError);
  });
});

describe('GET /tasks', () => {
  it('responde 200 quando get all', async () => {
    const res = await request(app).get(TASKS_PREFIX);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /tasks/:id', () => {
  it('responde 200 em get id', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/2`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 2,
      title: 'estudar express',
      status: 'todo',
      term: null,
    });
  });

  it('responde 400 em get id inválido', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/-2`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 em get id inexistente', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/3`);
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 em get id string', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/oi`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });
});

describe('POST /tasks', () => {
  it('responde 201 em post', async () => {
    const res = await request(app)
      .post(TASKS_PREFIX)
      .send({ title: 'Teste', status: 'todo', term: null });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 3,
      title: 'Teste',
      status: 'todo',
      term: null,
    });
    expect(res.headers.location).toBe('/tasks/3');
  });

  it('responde 400 em post sem body', async () => {
    const res = await request(app).post(TASKS_PREFIX);
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em post body vazio', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({});
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em post com campo vazio', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({ title: '' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em post com title não string', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({ title: 42 });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em post com key diferente', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({ banana: 'Teste' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em post com status inválido', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({ status: 'Teste' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em post com term inválido', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({ term: '' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });
});

describe('PATCH /tasks', () => {
  it('responde 200 em patch com term null', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/1`)
      .send({ title: 'Novo titulo', term: null });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      title: 'Novo titulo',
      status: 'todo',
      term: null,
    });
  });

  it('responde 200 em patch com term string', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/2`)
      .send({ title: 'Novo titulo', term: 'Teste' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 2,
      title: 'Novo titulo',
      status: 'todo',
      term: 'Teste',
    });
  });

  it('responde 400 em patch com id inválido', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/-2`).send({ title: 'Novo titulo' });
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 em patch com id inexistente', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/10`).send({ title: 'Novo titulo' });
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 em patch sem body', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send();
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com body vazio', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({});
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com title vazio', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({ title: '' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com title não string', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({ title: 42 });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com chave inválida', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({ banana: 'Teste' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com term inválido', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({ term: '' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com status inválido', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({ status: 'Teste' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });
});

describe('DELETE /tasks', () => {
  it('responde 204 quando delete', async () => {
    const res = await request(app).delete(`${TASKS_PREFIX}/2`);
    expect(res.status).toBe(204);

    const resSecond = await request(app).delete(`${TASKS_PREFIX}/2`);
    expectError(resSecond, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 quando id inválido', async () => {
    const res = await request(app).delete(`${TASKS_PREFIX}/-2`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 quando id inexistente', async () => {
    const res = await request(app).delete(`${TASKS_PREFIX}/10`);
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });
});
