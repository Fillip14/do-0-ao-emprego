import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request, { type Response } from 'supertest';
import app from './app.js';
import { HttpStatus } from './constants/http-constants.js';
import { isNewTask, parseTask } from './tasks.js';
import { AppError } from './errors.js';
import { pool, queryDb } from './db.js';

process.loadEnvFile('.env');

beforeEach(async () => {
  await queryDb('DELETE FROM tasks');
});

afterAll(async () => {
  await pool.end();
});

const TASKS_PREFIX = '/tasks';

const expectError = (res: Response, httpStatus: number, field: string, message: string) => {
  expect(res.status).toBe(httpStatus);
  expect(res.body.errors).toEqual([{ field, message }]);
};

const postTask = async () => {
  const resPost = await request(app)
    .post(TASKS_PREFIX)
    .send({ title: 'Teste', status: 'todo', term: 'term test' });
  expect(resPost.status).toBe(201);
  return resPost;
};

describe('Routes errors', () => {
  it('responde 404 em rota inexistente', async () => {
    const res = await request(app).get('/oi');
    expectError(res, HttpStatus.NOT_FOUND, 'route', 'Not Found');
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
    await postTask();

    const res = await request(app).get(TASKS_PREFIX);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /tasks/:id', () => {
  it('responde 200 em get id com post primeiro', async () => {
    const resPost = await postTask();

    const resGet = await request(app).get(`${TASKS_PREFIX}/${resPost.body.id}`);
    expect(resGet.status).toBe(200);
    expect(resGet.body).toMatchObject({
      title: 'Teste',
      status: 'todo',
      term: 'term test',
    });
  });

  it('responde 400 em get id inválido', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/-2`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 em get id inexistente', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5dc`);
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 em get id string', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/oi`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });
});

describe('POST /tasks', () => {
  it('responde 201 em post com term null', async () => {
    const res = await request(app)
      .post(TASKS_PREFIX)
      .send({ title: 'Teste', status: 'todo', term: null });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'Teste',
      status: 'todo',
      term: null,
    });
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.headers.location).toBe(`${TASKS_PREFIX}/${res.body.id}`);
  });

  it('responde 201 em post com term string e get provando', async () => {
    const res = await request(app)
      .post(TASKS_PREFIX)
      .send({ title: 'Teste', status: 'todo', term: 'Teste' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'Teste',
      status: 'todo',
      term: 'Teste',
    });
    expect(res.headers.location).toBe(`${TASKS_PREFIX}/${res.body.id}`);

    const resGet = await request(app).get(`${TASKS_PREFIX}/${res.body.id}`);
    expect(resGet.status).toBe(200);
    expect(resGet.body).toMatchObject({
      title: 'Teste',
      status: 'todo',
      term: 'Teste',
    });
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
    const resPost = await postTask();

    const res = await request(app)
      .patch(`${TASKS_PREFIX}/${resPost.body.id}`)
      .send({ title: 'Novo titulo', term: null });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: resPost.body.id,
      title: 'Novo titulo',
      status: 'todo',
      term: null,
    });
  });

  it('responde 200 em patch com term string', async () => {
    const resPost = await postTask();

    const res = await request(app)
      .patch(`${TASKS_PREFIX}/${resPost.body.id}`)
      .send({ title: 'Novo titulo', term: 'Teste' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: resPost.body.id,
      title: 'Novo titulo',
      status: 'todo',
      term: 'Teste',
    });
  });

  it('responde 400 em patch com id inválido', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d`)
      .send({ title: 'Novo titulo' });
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 em patch com id inexistente', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d3`)
      .send({ title: 'Novo titulo' });
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 em patch sem body', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d3`)
      .send();
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com body vazio', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d3`)
      .send({});
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com title vazio', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d3`)
      .send({ title: '' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com title não string', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d3`)
      .send({ title: 42 });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com chave inválida', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d3`)
      .send({ banana: 'Teste' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com term inválido', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d3`)
      .send({ term: '' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });

  it('responde 400 em patch com status inválido', async () => {
    const res = await request(app)
      .patch(`${TASKS_PREFIX}/75316765-6ebd-4de3-938f-3d4372f0b5d3`)
      .send({ status: 'Teste' });
    expectError(res, HttpStatus.BAD_REQUEST, 'task', 'Invalid Task');
  });
});

describe('DELETE /tasks', () => {
  it('responde 204 quando delete', async () => {
    const resPost = await request(app)
      .post(TASKS_PREFIX)
      .send({ title: 'Teste', status: 'todo', term: 'Teste' });
    expect(resPost.status).toBe(201);
    expect(resPost.body).toMatchObject({
      title: 'Teste',
      status: 'todo',
      term: 'Teste',
    });
    expect(resPost.headers.location).toBe(`${TASKS_PREFIX}/${resPost.body.id}`);

    const res = await request(app).delete(`${TASKS_PREFIX}/${resPost.body.id}`);
    expect(res.status).toBe(204);

    const resSecond = await request(app).delete(`${TASKS_PREFIX}/${resPost.body.id}`);
    expectError(resSecond, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 quando id inválido', async () => {
    const res = await request(app).delete(`${TASKS_PREFIX}/-2`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 quando id inexistente', async () => {
    const res = await request(app).delete(`${TASKS_PREFIX}/cd6c5dfe-d49a-455b-b56d-2d47eda36017`);
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });
});
