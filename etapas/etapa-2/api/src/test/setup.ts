import { beforeEach, afterAll } from 'vitest';
import { queryDb, closePool } from '../db.js';

process.loadEnvFile('.env');

// Guarda do banco alvo: sem isto, um erro de variável de ambiente faria o
// TRUNCATE abaixo apagar dado de desenvolvimento por engano. O erro aqui
// acontece no carregamento do módulo, antes de qualquer beforeEach — a
// suíte falha imediatamente, sem tocar em nenhuma linha da tabela.
if (process.env.PGDATABASE !== 'tasks_test') {
  throw new Error(
    `Suíte de teste apontando para PGDATABASE="${process.env.PGDATABASE}", esperava "tasks_test". ` +
      'Rode via "npm test" (já exporta NODE_ENV=test e PGDATABASE=tasks_test).',
  );
}

beforeEach(async () => {
  // TRUNCATE em vez de DELETE: mais rápido e reseta a sequência de identidade.
  await queryDb('TRUNCATE tasks RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await closePool();
});
