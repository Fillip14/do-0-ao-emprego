import { randomUUID } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import request, { type Response } from 'supertest';
import app from '../app.js';
import { HttpStatus } from '../constants/http-constants.js';
import { makeTask } from '../test/factories.js';
import { createTask, expectError, TASKS_PREFIX } from '../test/helpers.js';

// Desde o Tema 6, erro de validação vem por campo (array de detalhes),
// não mais um erro único com field: 'task' — este helper checa que existe
// um detalhe para o campo esperado, sem exigir posição/ordem exata.
const expectFieldError = (res: Response, status: number, field: string | undefined) => {
  expect(res.status).toBe(status);
  expect(Array.isArray(res.body.errors)).toBe(true);
  expect(res.body.errors.length).toBeGreaterThan(0);
  if (field) {
    expect(
      res.body.errors.some((detail: { field?: string }) => detail.field === field),
    ).toBe(true);
  }
};

describe('GET /tasks', () => {
  it('responde 200 quando get all', async () => {
    await createTask(makeTask());

    const res = await request(app).get(TASKS_PREFIX);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('pagina, filtra por status e devolve o total no header', async () => {
    await createTask(makeTask({ title: 'A', status: 'todo' }));
    await createTask(makeTask({ title: 'B', status: 'done' }));
    await createTask(makeTask({ title: 'C', status: 'done' }));

    const res = await request(app).get(`${TASKS_PREFIX}?status=done&page=1&pageSize=1`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe('done');
    expect(res.headers['x-total-count']).toBe('2');
  });

  it('responde 400 quando orderBy não é uma coluna permitida', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}?orderBy=senha_do_admin`);
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('ordena decrescente quando orderDir=desc', async () => {
    await createTask(makeTask({ title: 'A' }));
    await createTask(makeTask({ title: 'B' }));

    const res = await request(app).get(`${TASKS_PREFIX}?orderBy=title&orderDir=desc`);
    expect(res.status).toBe(200);
    expect(res.body.map((task: { title: string }) => task.title)).toEqual(['B', 'A']);
  });
});

describe('GET /tasks/:id', () => {
  it('responde 200 em get id com post primeiro', async () => {
    const resPost = await createTask(makeTask());

    const res = await request(app).get(`${TASKS_PREFIX}/${resPost.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'Comprar pão', status: 'todo', term: null });
  });

  it('responde 400 em get id inválido', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/-2`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 em get id inexistente', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/${randomUUID()}`);
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 em get id string', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/oi`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });
});

describe('POST /tasks', () => {
  it('responde 201 e Location, com term null', async () => {
    const res = await createTask(makeTask({ term: null }));
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Comprar pão', status: 'todo', term: null });
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.headers.location).toBe(`${TASKS_PREFIX}/${res.body.id}`);
  });

  it('responde 201 com term string, e o GET seguinte confirma', async () => {
    const res = await createTask(makeTask({ term: 'Teste' }));
    expect(res.status).toBe(201);

    const resGet = await request(app).get(`${TASKS_PREFIX}/${res.body.id}`);
    expect(resGet.status).toBe(200);
    expect(resGet.body).toMatchObject({ title: 'Comprar pão', status: 'todo', term: 'Teste' });
  });

  it('responde 400 sem body', async () => {
    const res = await request(app).post(TASKS_PREFIX);
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });

  it('responde 400 com body vazio (três campos obrigatórios faltando)', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({});
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });

  it.each([
    ['title vazio', { title: '', status: 'todo', term: null }, 'title'],
    ['title não string', { title: 42, status: 'todo', term: null }, 'title'],
    ['status inválido', { title: 'Comprar pão', status: 'Teste', term: null }, 'status'],
    ['term vazio', { title: 'Comprar pão', status: 'todo', term: '' }, 'term'],
  ] as const)('responde 400 em POST com %s', async (_label, body, field) => {
    const res = await request(app).post(TASKS_PREFIX).send(body);
    expectFieldError(res, HttpStatus.BAD_REQUEST, field);
  });

  it('responde 400 em post com chave desconhecida', async () => {
    const res = await request(app)
      .post(TASKS_PREFIX)
      .send({ title: 'Comprar pão', status: 'todo', term: null, banana: 'x' });
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });
});

describe('PATCH /tasks/:id', () => {
  it('responde 200 com term null', async () => {
    const resPost = await createTask(makeTask());

    const res = await request(app)
      .patch(`${TASKS_PREFIX}/${resPost.body.id}`)
      .send({ title: 'Novo título', term: null });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: resPost.body.id, title: 'Novo título', status: 'todo', term: null });
  });

  it('responde 200 com term string', async () => {
    const resPost = await createTask(makeTask());

    const res = await request(app)
      .patch(`${TASKS_PREFIX}/${resPost.body.id}`)
      .send({ title: 'Novo título', term: 'Teste' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: resPost.body.id, title: 'Novo título', status: 'todo', term: 'Teste' });
  });

  it('responde 200 alterando só o status', async () => {
    const resPost = await createTask(makeTask({ status: 'todo' }));

    const res = await request(app)
      .patch(`${TASKS_PREFIX}/${resPost.body.id}`)
      .send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: resPost.body.id,
      title: 'Comprar pão',
      status: 'done',
      term: null,
    });
  });

  it('responde 400 em id inválido', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/-2`).send({ title: 'Novo título' });
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 em id inexistente', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/${randomUUID()}`).send({ title: 'Novo título' });
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 sem body', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/${randomUUID()}`).send();
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });

  it('responde 400 com body vazio (nenhum campo informado)', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/${randomUUID()}`).send({});
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });

  it.each([
    ['title vazio', { title: '' }, 'title'],
    ['title não string', { title: 42 }, 'title'],
    ['status inválido', { status: 'Teste' }, 'status'],
    ['term vazio', { term: '' }, 'term'],
  ] as const)('responde 400 em PATCH com %s', async (_label, body, field) => {
    const res = await request(app).patch(`${TASKS_PREFIX}/${randomUUID()}`).send(body);
    expectFieldError(res, HttpStatus.BAD_REQUEST, field);
  });

  it('responde 400 em patch com chave desconhecida', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/${randomUUID()}`).send({ banana: 'Teste' });
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });
});

describe('DELETE /tasks/:id', () => {
  it('responde 204 e depois 404 no segundo delete', async () => {
    const resPost = await createTask(makeTask());

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
    const res = await request(app).delete(`${TASKS_PREFIX}/${randomUUID()}`);
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });
});
