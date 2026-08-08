import { type Task } from '../types/task';

export const mockTasks: Task[] = [
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d1',
    title: 'Comprar uma lampada',
    status: 'done',
    term: 'Dia 27/07',
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d2',
    title:
      'Esse é um texto muito grande para testar as quebras de linhas no card com tamanho máximo definido.',
    status: 'done',
    term: 'Dia 27/07',
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d3',
    title:
      'Esse texto tem umas palavras muitooooooooooooooooooooooooooo grandessssssssssssssssssssss palavraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa muito grandeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee aqui',
    status: 'done',
    term: 'Dia 27/07',
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d4',
    title:
      'Esse texto tem umas palavras muitooooooooooooooooooooooooooo grandessssssssssssssssssssss palavraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa muito grandeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee aqui',
    status: 'done',
    term: 'Dia 27/07',
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d5',
    title: 'Nada',
    status: 'doing',
    term: 'Dia 28/07',
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d6',
    title: 'Trocar a lampada',
    status: 'doing',
    term: 'Dia 28/07',
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d7',
    title: 'Desligar a energia',
    status: 'done',
    term: null,
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d8',
    title: 'Colocar a lampada',
    status: 'doing',
    term: null,
  },
  {
    id: '75316765-6ebd-4de3-938f-3d4372f0b5d9',
    title: 'Ligar a energia',
    status: 'todo',
    term: null,
  },
];
