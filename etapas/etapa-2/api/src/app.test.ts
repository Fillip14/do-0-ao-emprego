import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { HttpStatus } from './constants/http-constants.js';
import * as db from './db.js';
import { expectError, registerTestUser, TASKS_PREFIX } from './test/helpers.js';

// Este arquivo cobre o que é do app.ts em si: rota inexistente, método não
// permitido e o tratador de erro central. Teste de rota de tasks mora em
// routes/tasks.routes.test.ts; teste de função pura mora em tasks.test.ts.

let token: string;

beforeAll(async () => {
  ({ token } = await registerTestUser());
});

describe('Routes errors', () => {
  it('responde 404 em rota inexistente', async () => {
    const res = await request(app).get('/oi');
    expectError(res, HttpStatus.NOT_FOUND, 'route', 'Not Found');
  });

  it('responde 405 em method inexistente em /tasks', async () => {
    // Precisa de token: requireAuth roda antes do handler de 405 (é
    // .use(), pega toda requisição pro router, não só as rotas certas).
    const res = await request(app).put(TASKS_PREFIX).set('Authorization', `Bearer ${token}`);
    expectError(res, HttpStatus.METHOD_NOT_ALLOWED, 'method', 'Method Not Allowed');
  });

  it('responde 405 em method inexistente em /tasks/:id', async () => {
    const res = await request(app).put(`${TASKS_PREFIX}/1`).set('Authorization', `Bearer ${token}`);
    expectError(res, HttpStatus.METHOD_NOT_ALLOWED, 'method', 'Method Not Allowed');
  });
});

describe('CORS', () => {
  it('responde 204 e encerra no preflight OPTIONS, sem chegar às rotas', async () => {
    const res = await request(app).options(TASKS_PREFIX);

    expect(res.status).toBe(HttpStatus.NO_CONTENT);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-methods']).toContain('POST');
  });

  it('libera o header Authorization pro front mandar o token', async () => {
    const res = await request(app).options(TASKS_PREFIX);
    expect(res.headers['access-control-allow-headers']).toContain('Authorization');
  });
});

describe('Tratador de erro central', () => {
  it('responde 500 sem vazar detalhe interno em erro inesperado', async () => {
    // Único lugar legítimo para dublê nesta suíte (tópico 6/8 do Tema 5):
    // não dá para derrubar o Postgres de verdade no meio do teste.
    vi.spyOn(db, 'queryDb').mockRejectedValueOnce(new Error('senha do banco no texto'));

    const res = await request(app).get(TASKS_PREFIX).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.stringify(res.body)).not.toContain('senha');
    expect(res.body.errors).toEqual([{ message: 'Internal Server Error' }]);
  });
});
