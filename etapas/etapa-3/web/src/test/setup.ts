// Roda antes de cada suíte (registrado em `setupFiles` no vite.config.ts).
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { server } from './server';
import { resetDb } from './handlers';

// Toda animação salta direto para o valor final: nenhum teste espera movimento.
MotionGlobalConfig.skipAnimations = true;

// O jsdom não tem `matchMedia` e o Motion chama (T14, decisão 4).
beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
});

// `onUnhandledRequest: 'error'`: rota sem handler derruba o teste em vez de virar erro de tela.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

beforeEach(() => resetDb());

afterEach(() => {
  server.resetHandlers();
  cleanup(); // com `globals: false` a Testing Library não registra o cleanup sozinha
  vi.restoreAllMocks();
});

afterAll(() => server.close());
