import { randomUUID } from 'node:crypto';
import { describe, it, expect, beforeAll } from 'vitest';
import request, { type Response } from 'supertest';
import app from '../app.js';
import { HttpStatus } from '../constants/http-constants.js';
import { makeTask } from '../test/factories.js';
import { asUser, createTask, expectError, registerTestUser, TASKS_PREFIX } from '../test/helpers.js';

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

// Um usuário só, reaproveitado pela maioria dos testes deste arquivo —
// eles testam o comportamento de CRUD, não a posse em si (isso é a
// describe própria no fim, com um segundo usuário).
let token: string;

beforeAll(async () => {
  ({ token } = await registerTestUser());
});

describe('Autenticação em /tasks', () => {
  it('responde 401 sem token', async () => {
    const res = await request(app).get(TASKS_PREFIX);
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('responde 401 com token inválido', async () => {
    const res = await request(app).get(TASKS_PREFIX).set('Authorization', 'Bearer coisa-invalida');
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});

describe('GET /tasks', () => {
  it('responde 200 quando get all', async () => {
    await createTask(token, makeTask());

    const res = await asUser(token).get(TASKS_PREFIX);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('pagina, filtra por status e devolve o total no header', async () => {
    await createTask(token, makeTask({ title: 'A', status: 'todo' }));
    await createTask(token, makeTask({ title: 'B', status: 'done' }));
    await createTask(token, makeTask({ title: 'C', status: 'done' }));

    const res = await asUser(token).get(`${TASKS_PREFIX}?status=done&page=1&pageSize=1`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe('done');
    expect(res.headers['x-total-count']).toBe('2');
  });

  it('responde 400 quando orderBy não é uma coluna permitida', async () => {
    const res = await asUser(token).get(`${TASKS_PREFIX}?orderBy=senha_do_admin`);
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('ordena decrescente quando orderDir=desc', async () => {
    await createTask(token, makeTask({ title: 'A' }));
    await createTask(token, makeTask({ title: 'B' }));

    const res = await asUser(token).get(`${TASKS_PREFIX}?orderBy=title&orderDir=desc`);
    expect(res.status).toBe(200);
    expect(res.body.map((task: { title: string }) => task.title)).toEqual(['B', 'A']);
  });
});

describe('GET /tasks/:id', () => {
  it('responde 200 em get id com post primeiro', async () => {
    const resPost = await createTask(token, makeTask());

    const res = await asUser(token).get(`${TASKS_PREFIX}/${resPost.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'Comprar pão', status: 'todo', term: null });
  });

  it('responde 400 em get id inválido', async () => {
    const res = await asUser(token).get(`${TASKS_PREFIX}/-2`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 em get id inexistente', async () => {
    const res = await asUser(token).get(`${TASKS_PREFIX}/${randomUUID()}`);
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 em get id string', async () => {
    const res = await asUser(token).get(`${TASKS_PREFIX}/oi`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });
});

describe('POST /tasks', () => {
  it('responde 201 e Location, com term null', async () => {
    const res = await createTask(token, makeTask({ term: null }));
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Comprar pão', status: 'todo', term: null });
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.headers.location).toBe(`${TASKS_PREFIX}/${res.body.id}`);
    // owner_id nunca aparece na resposta — a API não expõe essa coluna.
    expect(res.body.owner_id).toBeUndefined();
  });

  it('responde 201 com term string, e o GET seguinte confirma', async () => {
    const res = await createTask(token, makeTask({ term: 'Teste' }));
    expect(res.status).toBe(201);

    const resGet = await asUser(token).get(`${TASKS_PREFIX}/${res.body.id}`);
    expect(resGet.status).toBe(200);
    expect(resGet.body).toMatchObject({ title: 'Comprar pão', status: 'todo', term: 'Teste' });
  });

  it('responde 400 sem body', async () => {
    const res = await asUser(token).post(TASKS_PREFIX);
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });

  it('responde 400 com body vazio (três campos obrigatórios faltando)', async () => {
    const res = await asUser(token).post(TASKS_PREFIX).send({});
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });

  it.each([
    ['title vazio', { title: '', status: 'todo', term: null }, 'title'],
    ['title não string', { title: 42, status: 'todo', term: null }, 'title'],
    ['status inválido', { title: 'Comprar pão', status: 'Teste', term: null }, 'status'],
    ['term vazio', { title: 'Comprar pão', status: 'todo', term: '' }, 'term'],
  ] as const)('responde 400 em POST com %s', async (_label, body, field) => {
    const res = await asUser(token).post(TASKS_PREFIX).send(body);
    expectFieldError(res, HttpStatus.BAD_REQUEST, field);
  });

  it('responde 400 em post com chave desconhecida', async () => {
    const res = await asUser(token)
      .post(TASKS_PREFIX)
      .send({ title: 'Comprar pão', status: 'todo', term: null, banana: 'x' });
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });
});

describe('PATCH /tasks/:id', () => {
  it('responde 200 com term null', async () => {
    const resPost = await createTask(token, makeTask());

    const res = await asUser(token)
      .patch(`${TASKS_PREFIX}/${resPost.body.id}`)
      .send({ title: 'Novo título', term: null });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: resPost.body.id, title: 'Novo título', status: 'todo', term: null });
  });

  it('responde 200 com term string', async () => {
    const resPost = await createTask(token, makeTask());

    const res = await asUser(token)
      .patch(`${TASKS_PREFIX}/${resPost.body.id}`)
      .send({ title: 'Novo título', term: 'Teste' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: resPost.body.id, title: 'Novo título', status: 'todo', term: 'Teste' });
  });

  it('responde 200 alterando só o status', async () => {
    const resPost = await createTask(token, makeTask({ status: 'todo' }));

    const res = await asUser(token).patch(`${TASKS_PREFIX}/${resPost.body.id}`).send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: resPost.body.id,
      title: 'Comprar pão',
      status: 'done',
      term: null,
    });
  });

  it('responde 400 em id inválido', async () => {
    const res = await asUser(token).patch(`${TASKS_PREFIX}/-2`).send({ title: 'Novo título' });
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 em id inexistente', async () => {
    const res = await asUser(token)
      .patch(`${TASKS_PREFIX}/${randomUUID()}`)
      .send({ title: 'Novo título' });
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  // Os testes de validação daqui pra baixo usam uma tarefa REAL, criada
  // pelo próprio usuário do token — desde que a posse passou a ser
  // checada antes do corpo (Tema 8), um id aleatório (que não existe)
  // responde 404 antes de a validação do body rodar. Isso é o
  // comportamento certo: não vale a pena validar payload de recurso que
  // nem existe/não é seu — só não é o que estes casos querem testar.

  it('responde 400 sem body', async () => {
    const resPost = await createTask(token, makeTask());
    const res = await asUser(token).patch(`${TASKS_PREFIX}/${resPost.body.id}`).send();
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });

  it('responde 400 com body vazio (nenhum campo informado)', async () => {
    const resPost = await createTask(token, makeTask());
    const res = await asUser(token).patch(`${TASKS_PREFIX}/${resPost.body.id}`).send({});
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });

  it.each([
    ['title vazio', { title: '' }, 'title'],
    ['title não string', { title: 42 }, 'title'],
    ['status inválido', { status: 'Teste' }, 'status'],
    ['term vazio', { term: '' }, 'term'],
  ] as const)('responde 400 em PATCH com %s', async (_label, body, field) => {
    const resPost = await createTask(token, makeTask());
    const res = await asUser(token).patch(`${TASKS_PREFIX}/${resPost.body.id}`).send(body);
    expectFieldError(res, HttpStatus.BAD_REQUEST, field);
  });

  it('responde 400 em patch com chave desconhecida', async () => {
    const resPost = await createTask(token, makeTask());
    const res = await asUser(token).patch(`${TASKS_PREFIX}/${resPost.body.id}`).send({ banana: 'Teste' });
    expectFieldError(res, HttpStatus.BAD_REQUEST, undefined);
  });
});

describe('DELETE /tasks/:id', () => {
  it('responde 204 e depois 404 no segundo delete', async () => {
    const resPost = await createTask(token, makeTask());

    const res = await asUser(token).delete(`${TASKS_PREFIX}/${resPost.body.id}`);
    expect(res.status).toBe(204);

    const resSecond = await asUser(token).delete(`${TASKS_PREFIX}/${resPost.body.id}`);
    expectError(resSecond, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });

  it('responde 400 quando id inválido', async () => {
    const res = await asUser(token).delete(`${TASKS_PREFIX}/-2`);
    expectError(res, HttpStatus.BAD_REQUEST, 'id', 'Invalid id');
  });

  it('responde 404 quando id inexistente', async () => {
    const res = await asUser(token).delete(`${TASKS_PREFIX}/${randomUUID()}`);
    expectError(res, HttpStatus.NOT_FOUND, 'id', 'Not Found');
  });
});

describe('Posse da tarefa (Tema 8)', () => {
  it('responde 403 em GET quando o token é de outro usuário', async () => {
    const owner = await registerTestUser();
    const intruder = await registerTestUser();
    const resPost = await createTask(owner.token, makeTask());

    const res = await asUser(intruder.token).get(`${TASKS_PREFIX}/${resPost.body.id}`);
    expect(res.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('responde 403 em PATCH quando o token é de outro usuário', async () => {
    const owner = await registerTestUser();
    const intruder = await registerTestUser();
    const resPost = await createTask(owner.token, makeTask());

    const res = await asUser(intruder.token)
      .patch(`${TASKS_PREFIX}/${resPost.body.id}`)
      .send({ title: 'Invadido' });
    expect(res.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('responde 403 em DELETE quando o token é de outro usuário', async () => {
    const owner = await registerTestUser();
    const intruder = await registerTestUser();
    const resPost = await createTask(owner.token, makeTask());

    const res = await asUser(intruder.token).delete(`${TASKS_PREFIX}/${resPost.body.id}`);
    expect(res.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('a listagem de um usuário nunca inclui tarefa de outro', async () => {
    const owner = await registerTestUser();
    const other = await registerTestUser();
    await createTask(owner.token, makeTask({ title: 'Só do dono' }));

    const res = await asUser(other.token).get(TASKS_PREFIX);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
