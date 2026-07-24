import type { Task } from './ex03.js';

const firstItem = <T>(items: T[]): T | undefined => {
  return items[0];
};

firstItem([0, 1, 2]); //=> number | undefined;
firstItem([null, 'oi', 1]); // => string | number | null | undefined
firstItem(['a', 'b', {}]); // => {} | undefined
firstItem(['a', 'b']); // => string | undefined

const secondItem = (items: any[]): any | undefined => {
  return items[0];
};

// @ts-expect-error
firstItem([0, 1, 2]).foo; // A propriedade 'foo' não existe no tipo 'number'.
secondItem([0, 1, 2]).foo; // Sem erro

interface ApiResponse<T> {
  data: T;
  requestId: string;
}

const r1: ApiResponse<Task> = { data: { id: 1, title: 'a', status: 'todo' }, requestId: 'x' };
r1.data.title; // T é Task → title existe

const r2: ApiResponse<Task[]> = { data: [], requestId: 'y' };
r2.data.length; // T é Task[] → é array

const getId = <T extends { id: number }>(item: T): number => {
  return item.id;
};

getId({ id: 5, nome: 'x' }); // ok — tem id
// @ts-expect-error
getId({ nome: 'x' }); // erro — cola a mensagem

const tasks: Task[] = [
  { id: 1, title: 'a', status: 'todo' },
  { id: 2, title: 'b', status: 'done' },
];

const found = tasks.find((t) => t.id === 7);

// if (!found) throw new Error('not found'); agora compila, o TS sabe que passou do undefined
// @ts-expect-error
found.title; // 'found' é possivelmente 'indefinido'.

found?.title; // vira string | undefined, não quebra

const t = found ?? { id: 0, title: 'vazio', status: 'todo' };
t.title; // sempre existe

// (d) Usaria early return com res.status(404) — id inexistente num GET é
// resposta esperada (404), não exceção. É a distinção do Ex 08: valor pro
// esperado, throw pro excepcional.
