import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// `msw/node` e não `msw/browser`: o jsdom roda dentro do Node.
export const server = setupServer(...handlers);
