import { screen } from '@testing-library/react';

// Os títulos das três colunas, como a FilledTasks os escreve.
export const COLUMN = {
  done: 'Olha o que você tem pronto!',
  doing: 'Essas estão em andamento ^^',
  todo: 'Que tal iniciar essas?',
} as const;

// "A tarefa está NESTA coluna" é a asserção que prova o ciclo de status,
// e para fazê-la é preciso apontar a coluna. O Card é uma <div> sem papel,
// então não dá para pedir por role; o heading do card é filho direto dele.
// É a única concessão a estrutura de DOM na suíte, e mora isolada aqui:
// se um dia o Card ganhar `aria-labelledby`, só este arquivo muda.
export const column = (title: string) => screen.getByRole('heading', { name: title }).parentElement!;
