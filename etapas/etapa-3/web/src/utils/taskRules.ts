import type { FieldErrors, Status, TaskForm } from '../types/task';

export const nextStatus: Record<Status, Status> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
};

export const validateTaskForm = (form: TaskForm): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.title.trim()) errors.title = 'Escreva um título para a tarefa';

  return errors;
};
