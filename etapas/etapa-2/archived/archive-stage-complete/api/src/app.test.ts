import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { query, pool } from './db.js';

beforeEach(async () => {
  await query('DELETE FROM tasks');
});

afterAll(async () => {
  await pool.end();
});

describe('GET /tasks', () => {
  it('responde 200 com array com objetos', async () => {
    const resTest = await request(app).post('/tasks').send({ title: 'Titulo' });
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: resTest.body.id, title: 'Titulo', done: false }]);
  });
});

describe('GET /tasks/:id', () => {
  it('responde 200 com objeto contendo id e title', async () => {
    const resTest = await request(app).post('/tasks').send({ title: 'Titulo' });
    const res = await request(app).get(`/tasks/${resTest.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: resTest.body.id, title: 'Titulo', done: false });
  });

  it('responde 400 com message Invalid id', async () => {
    const res = await request(app).get(`/tasks/12`);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid id' });
  });

  it('responde 404 com message Task not found', async () => {
    const res = await request(app).get(`/tasks/00000000-0000-4000-8000-000000000000`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Task not found' });
  });
});

describe('DELETE /tasks/:id', () => {
  it('responde 200 com message Removed', async () => {
    const resTest = await request(app).post('/tasks').send({ title: 'Titulo' });
    const res = await request(app).delete(`/tasks/${resTest.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Removed' });
  });

  it('responde 400 com message Invalid id', async () => {
    const res = await request(app).delete(`/tasks/12`);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid id' });
  });

  it('responde 404 com message Task not found', async () => {
    const res = await request(app).delete(`/tasks/00000000-0000-4000-8000-000000000000`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Task not found' });
  });
});

describe('POST /tasks', () => {
  it('responde 201 com objeto contendo id e title', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Titulo' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Titulo', done: false });
    expect(res.body.id).toEqual(expect.any(String));
  });

  it('responde 400 com message invalid title quando sem title', async () => {
    const res = await request(app).post(`/tasks`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid title' });
  });

  it('responde 400 com message invalid title quando title vazio', async () => {
    const res = await request(app).post(`/tasks`).send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid title' });
  });

  it('responde 400 com message invalid title quando title number', async () => {
    const res = await request(app).post(`/tasks`).send({ title: 42 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid title' });
  });

  it('responde 400 com message invalid title sem .send', async () => {
    const res = await request(app).post(`/tasks`);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid title' });
  });
});

describe('rota inexistente', () => {
  it('responde 404 com message Not found', async () => {
    const res = await request(app).post(`/tasks/12`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Not found' });
  });
});

describe('PATCH /tasks/:id', () => {
  it('responde 200 com objeto contendo id e title', async () => {
    const resTest = await request(app).post('/tasks').send({ title: 'Titulo' });
    const res = await request(app)
      .patch(`/tasks/${resTest.body.id}`)
      .send({ title: 'Novo titulo' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: resTest.body.id, title: 'Novo titulo', done: false });
  });

  it('responde 400 com message Invalid id — id inválido tem prioridade sobre título inválido', async () => {
    const res = await request(app).patch(`/tasks/12`).send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid id' });
  });

  it('responde 400 com message An unexpected error occurred', async () => {
    const res = await request(app)
      .patch(`/tasks/12`)
      .set('Content-Type', 'application/json')
      .send('{quebrado');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'An unexpected error occurred' });
  });

  it('responde 404 com message Task not found', async () => {
    const res = await request(app)
      .patch(`/tasks/00000000-0000-4000-8000-000000000000`)
      .send({ title: 'Novo titulo' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Task not found' });
  });
});
