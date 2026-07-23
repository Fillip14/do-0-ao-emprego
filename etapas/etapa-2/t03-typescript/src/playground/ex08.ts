import { type Task } from './ex03.js';

type Result = { ok: true; task: Task } | { ok: false; error: string };

const parseTask = (value: unknown): Result => {
  if (typeof value !== 'object' || value === null) {
    return { ok: false, error: 'Invalid value' };
  }

  if ('author' in value && typeof value.author !== 'string') {
    return { ok: false, error: 'Invalid value' };
  }

  if (
    'id' in value &&
    typeof value.id === 'number' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'status' in value &&
    (value.status === 'todo' || value.status === 'doing' || value.status === 'done')
  ) {
    return { ok: true, task: { id: value.id, title: value.title, status: value.status } };
  }
  return { ok: false, error: 'Invalid value' };
};

const t2: unknown = { id: 1, title: 'Titulo', status: 'todo' };

const task = parseTask(t2);

// @ts-expect-error
task.task; // A propriedade 'task' não existe no tipo 'Result'. A propriedade 'task' não existe no tipo '{ ok: false; error: string; }'.

if (task.ok) {
  console.log(task.task);
} else {
  console.log(task.error);
}

const statusLabel = (task: Task): string => {
  switch (task.status) {
    case 'todo':
      return 'A fazer';
    case 'doing':
      return 'Fazendo';
    case 'done':
      return 'Concluído';
    default:
      const exhaustive: never = task.status; //O tipo '"done"' não pode ser atribuído ao tipo 'never'.
      return exhaustive;
  }
};

if (task.ok) console.log(statusLabel(task.task));

// Usar a com trhow new Error para utilizar o asyncHandler, assim fica tudo centralizado
// sem chance de uma hora retornar um tipo de resul e outra hora outro
