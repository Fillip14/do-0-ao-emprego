import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { resetTasks } from './routes/tasks.routes.js';

beforeEach(() => {
  resetTasks();
});

const TASKS_PREFIX = '/tasks';

describe('ROTAS ERRADAS', () => {
  it('responde 404 em rota inexistente', async () => {
    const res = await request(app).get(`/oi`);
    expect(res.status).toBe(404);
    expect(res.body.errors).toEqual([
      {
        field: 'Route',
        message: 'Not Found',
      },
    ]);
  });

  it('responde 405 em method inexistente', async () => {
    const res = await request(app).put(TASKS_PREFIX);
    expect(res.status).toBe(405);
    expect(res.body.errors).toEqual([
      {
        field: 'method',
        message: 'Method Not Allowed',
      },
    ]);
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
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'Invalid id',
      },
    ]);
  });

  it('responde 404 em get id inexistente', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/3`);
    expect(res.status).toBe(404);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'Not Found',
      },
    ]);
  });

  it('responde 400 em get id string', async () => {
    const res = await request(app).get(`${TASKS_PREFIX}/oi`);
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'Invalid id',
      },
    ]);
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
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });

  it('responde 400 em post body vazio', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });

  it('responde 400 em post com campo vazio', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });

  it('responde 400 em post com title não string', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({ title: 42 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });

  it('responde 400 em post com key diferente', async () => {
    const res = await request(app).post(TASKS_PREFIX).send({ banana: 'Teste' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });
});

describe('PATCH /tasks', () => {
  it('responde 200 em patch', async () => {
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

  it('responde 200 em patch', async () => {
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
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'Invalid id',
      },
    ]);
  });

  it('responde 404 em patch com id inexistente', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/10`).send({ title: 'Novo titulo' });
    expect(res.status).toBe(404);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'Not Found',
      },
    ]);
  });

  it('responde 400 em patch sem body', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send();
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });

  it('responde 400 em patch com body vazio', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });

  it('responde 400 quando title vazio', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });

  it('responde 400 quando title não string', async () => {
    const res = await request(app).patch(`${TASKS_PREFIX}/2`).send({ title: 42 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'task',
        message: 'Invalid Task',
      },
    ]);
  });
});

describe('DELETE /tasks', () => {
  it('responde 204 quando delete', async () => {
    const res = await request(app).delete(`${TASKS_PREFIX}/2`);
    expect(res.status).toBe(204);

    const resSecond = await request(app).delete(`${TASKS_PREFIX}/2`);
    expect(resSecond.status).toBe(404);
    expect(resSecond.body.errors).toEqual([
      {
        field: 'id',
        message: 'Not Found',
      },
    ]);
  });

  it('responde 400 quando id inválido', async () => {
    const res = await request(app).delete(`${TASKS_PREFIX}/-2`);
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'Invalid id',
      },
    ]);
  });

  it('responde 404 quando id inexistente', async () => {
    const res = await request(app).delete(`${TASKS_PREFIX}/10`);
    expect(res.status).toBe(404);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'Not Found',
      },
    ]);
  });
});
