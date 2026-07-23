import { type Task } from './ex03.js';

const isTask = (value: unknown): value is Task => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if ('author' in value && typeof value.author !== 'string') {
    return false;
  }

  return (
    'id' in value &&
    typeof value.id === 'number' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'status' in value &&
    (value.status === 'todo' || value.status === 'doing' || value.status === 'done')
  );
};

const t2: unknown = { id: 1, title: 'Titulo', status: 'todo' };

// @ts-expect-error
t2.title;

if (isTask(t2)) {
  console.log(t2.title);
}

const lixo: unknown = {};
// Ele só confia no retorno, se for true está certo
const isTaskFake = (value: unknown): value is Task => {
  return true;
};

if (isTaskFake(lixo)) {
  console.log(lixo.title.trim());
}

const items: (Task | null)[] = [
  { id: 1, title: 'a', status: 'todo' },
  null,
  { id: 2, title: 'b', status: 'done' },
];

const semPredicate = items.filter((v) => v !== null);
const comPredicate = items.filter((v): v is Task => v !== null);
