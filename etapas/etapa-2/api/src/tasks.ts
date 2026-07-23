import { AppError } from './errors.js';

export interface Task {
  readonly id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
  term?: string;
}

const STATUSES = ['todo', 'doing', 'done'] as const;

export type NewTask = Omit<Task, 'id'>;
export type TaskPatch = Partial<Omit<Task, 'id'>>;
export type TaskPreview = Pick<Task, 'id' | 'title'>;

export const isTask = (value: unknown): value is Task => {
  if (!(typeof value === 'object' && value !== null)) return false;
  if ('term' in value && typeof value.term !== 'string') return false;

  if (
    !(
      'id' in value &&
      typeof value.id === 'number' &&
      'title' in value &&
      typeof value.title === 'string' &&
      'status' in value &&
      (value.status === 'todo' || value.status === 'doing' || value.status === 'done')
    )
  )
    return false;
  return true;
};

export const parseTask = (input: unknown) => {
  if (!isTask(input)) {
    throw new AppError('invalid task', 400, 'task');
  }
  return input;
};
