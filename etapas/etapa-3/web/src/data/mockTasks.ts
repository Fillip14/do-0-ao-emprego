import { type Task } from '../types/task';

export const mockTasks: Task[] = [
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d1',
    title:
      'Comprar uma lampadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa lampadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa lampadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    status: 'done',
    term: 'Dia 27/07',
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d2',
    title: 'Trocar a lampada',
    status: 'doing',
    term: 'Dia 28/07',
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d3',
    title: 'Desligar a energia',
    status: 'done',
    term: null,
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d4',
    title: 'Colocar a lampada',
    status: 'doing',
    term: null,
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d5',
    title: 'Ligar a energia',
    status: 'todo',
    term: null,
  },
];

export const emptyTask: Task[] = [];
