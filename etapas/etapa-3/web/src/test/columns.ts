import { screen } from '@testing-library/react';

// Os títulos das três colunas, como a FilledTasks os escreve.
export const COLUMN = {
  done: 'Olha o que você tem pronto!',
  doing: 'Essas estão em andamento ^^',
  todo: 'Que tal iniciar essas?',
} as const;

// Única concessão a estrutura de DOM na suíte, isolada aqui: o Card não tem role.
export const column = (title: string) => screen.getByRole('heading', { name: title }).parentElement!;
