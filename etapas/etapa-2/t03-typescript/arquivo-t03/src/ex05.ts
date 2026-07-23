// npm run typecheck

// > t03-typescript@1.0.0 typecheck
// > tsc --noEmit

// src/playground/ex03.ts:15:7 - error TS2322: Type '{ id: number; title: string; done: boolean; coAuhor: string; }' is not assignable to type 'Task'.
//   Types of property 'done' are incompatible.
//     Type 'boolean' is not assignable to type '"doing" | "done" | "todo"'.

// 15 const t3: Task = raw;
//          ~~

// Found 1 error in src/playground/ex03.ts:15

import { type Task } from './ex03.js';

// @ts-expect-error
const t1: Task = { id: 1, title: 'Teste', status: 'doen' }; //O tipo '"doen"' não pode ser atribuído ao tipo '"todo" | "doing" | "done"'.ts(2322)

type Status = Task['status'];

const returnStatus = (status: Status): string => {
  switch (status) {
    case 'todo':
      return 'A fazer';
    case 'doing':
      return 'Em andamento';
    case 'done':
      return 'Concluída';
    default:
      const exhaustive: never = status; // O tipo '"done"' não pode ser atribuído ao tipo 'never'.
      return exhaustive;
  }
};

const STATUS_LABEL: Record<Status, string> = {
  todo: 'A fazer',
  doing: 'Em andamento',
  done: 'Concluída',
};

STATUS_LABEL['todo'];

// switch + never é para quando existe uma lógica por trás, cada opção faz algo
// Record quando é para coisas mais simples como mapear valor, também tem o exhaustive

const STATUSES = ['todo', 'doing', 'done'] as const; // as const mantem com que os dados daquele array sejam sempre iguais, nao fica apenas uma "caixa" de objetos
type StatusFromArray = (typeof STATUSES)[number];

// Perde compatibilidade pois o dado vem de fora como string, com união literal a string já serve
// com enum não pois ela precisa ser exatamente o que está declarado.
