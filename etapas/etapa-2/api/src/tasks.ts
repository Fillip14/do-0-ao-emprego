import { HttpStatus } from './constants/http-constants.js';
import { AppError } from './errors.js';

export interface Task {
  readonly id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
  term?: string;
}

// export interface Task extends NewTask {
//   readonly id: number;
// }

// const STATUSES = ['todo', 'doing', 'done'] as const;

export type NewTask = Omit<Task, 'id'>;
// export type TaskPatch = Partial<Omit<Task, 'id'>>;
// export type TaskPreview = Pick<Task, 'id' | 'title'>;

export const isNewTask = (body: unknown): body is NewTask => {
  if (typeof body !== 'object' || body === null) return false;

  const task = body as Record<string, unknown>;

  return (
    typeof task.title === 'string' &&
    task.title.trim() !== '' &&
    (task.status === 'todo' || task.status === 'doing' || task.status === 'done') &&
    (task.term === undefined || typeof task.term === 'string')
  );
};

export const parseTask = (input: unknown): NewTask => {
  if (!isNewTask(input)) throw new AppError('Invalid Task', HttpStatus.BAD_REQUEST, 'task');

  return input;
};
