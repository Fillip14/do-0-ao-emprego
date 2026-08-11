// Roda antes de cada suíte (registrado em `setupFiles` no vite.config.ts).
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './server';
import { resetDb } from './handlers';

// Ciclo de vida do MSW: liga uma vez, devolve os handlers padrão entre os testes
// (o `server.use` de um teste não pode vazar para o seguinte) e desliga no fim.
// `onUnhandledRequest: 'error'` derruba o teste se o app pedir uma rota sem handler —
// é melhor errar alto do que ver um estado de erro inexplicável na tela.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

beforeEach(() => resetDb());

afterEach(() => {
  server.resetHandlers();
  // Com `globals: false`, a Testing Library NÃO consegue registrar o cleanup
  // automático (ela procura um `afterEach` global que não existe). Sem esta linha,
  // o DOM de um teste sobra para o próximo e as queries acham dois de cada coisa.
  cleanup();
  vi.restoreAllMocks();
});

afterAll(() => server.close());
