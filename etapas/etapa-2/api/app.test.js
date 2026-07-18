import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('GET /tasks', () => {
  it('responde 200 com array vazio', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
