import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { resetTasks } from './routes/tasks.routes.js';

beforeEach(() => {
  resetTasks();
});

describe('GET /tasks', () => {
  it('responde 200 quando get all', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('responde 404 quando rota inexistente', async () => {
    const res = await request(app).get('/oi');
    expect(res.status).toBe(404);
    expect(res.body.errors).toEqual([
      {
        field: 'route',
        message: 'not found',
      },
    ]);
  });
});

describe('GET /tasks/:id', () => {
  it('responde 200 quando get id', async () => {
    const res = await request(app).get('/tasks/2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      done: true,
      id: 2,
      title: 'estudar express',
    });
  });

  it('responde 400 quando get id inválido', async () => {
    const res = await request(app).get('/tasks/-2');
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'invalid id',
      },
    ]);
  });

  it('responde 404 quando get id inexistente', async () => {
    const res = await request(app).get('/tasks/3');
    expect(res.status).toBe(404);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'not found',
      },
    ]);
  });
});

describe('POST /tasks', () => {
  it('responde 201 quando post', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Teste' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      done: false,
      id: 3,
      title: 'Teste',
    });
    expect(res.headers.location).toBe('/tasks/3');
  });

  it('responde 400 quando sem title', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'title',
        message: 'title is required',
      },
    ]);
  });

  it('responde 400 quando title vazio', async () => {
    const res = await request(app).post('/tasks').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'title',
        message: 'title is required',
      },
    ]);
  });

  it('responde 400 quando title não string', async () => {
    const res = await request(app).post('/tasks').send({ title: 42 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'title',
        message: 'title is required',
      },
    ]);
  });
});

describe('PATCH /tasks', () => {
  it('responde 200 quando patch', async () => {
    const res = await request(app).patch('/tasks/2').send({ title: 'Novo titulo' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      done: true,
      id: 2,
      title: 'Novo titulo',
    });
  });

  it('responde 400 quando id inválido', async () => {
    const res = await request(app).patch('/tasks/-2').send({ title: 'Novo titulo' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'invalid id',
      },
    ]);
  });

  it('responde 404 quando id inexistente', async () => {
    const res = await request(app).patch('/tasks/10').send({ title: 'Novo titulo' });
    expect(res.status).toBe(404);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'not found',
      },
    ]);
  });

  it('responde 400 quando sem title', async () => {
    const res = await request(app).patch('/tasks/2').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'title',
        message: 'title is required',
      },
    ]);
  });

  it('responde 400 quando title vazio', async () => {
    const res = await request(app).patch('/tasks/2').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'title',
        message: 'title is required',
      },
    ]);
  });

  it('responde 400 quando title não string', async () => {
    const res = await request(app).patch('/tasks/2').send({ title: 42 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'title',
        message: 'title is required',
      },
    ]);
  });
});

describe('DELETE /tasks', () => {
  it('responde 204 quando delete', async () => {
    const res = await request(app).delete('/tasks/2');
    expect(res.status).toBe(204);

    const resSecond = await request(app).delete('/tasks/2');
    expect(resSecond.status).toBe(404);
    expect(resSecond.body.errors).toEqual([
      {
        field: 'id',
        message: 'not found',
      },
    ]);
  });

  it('responde 400 quando id inválido', async () => {
    const res = await request(app).delete('/tasks/-2');
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'invalid id',
      },
    ]);
  });

  it('responde 404 quando id inexistente', async () => {
    const res = await request(app).delete('/tasks/10');
    expect(res.status).toBe(404);
    expect(res.body.errors).toEqual([
      {
        field: 'id',
        message: 'not found',
      },
    ]);
  });
});
