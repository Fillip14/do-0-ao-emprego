import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// `msw/node` e não `msw/browser`: o jsdom roda dentro do Node, então quem
// intercepta é a camada de Node, não o service worker do navegador.
export const server = setupServer(...handlers);
