import { HttpStatus } from './constants/http-constants.js';
import { AppError } from './errors.js';

export interface Task {
  readonly id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
  term: string | null;
}

const allowedFields = ['title', 'status', 'term'];

export type NewTask = Omit<Task, 'id'>;
export type TaskPatch = Partial<Omit<Task, 'id'>>;

export const isNewTask = (body: unknown): body is NewTask => {
  if (typeof body !== 'object' || body === null) return false;

  const task = body as Record<string, unknown>;

  const hasInvalidField = Object.keys(task).some((key) => !allowedFields.includes(key));
  if (hasInvalidField) return false;

  return (
    typeof task.title === 'string' &&
    task.title.trim() !== '' &&
    (task.status === 'todo' || task.status === 'doing' || task.status === 'done') &&
    (task.term === null || (typeof task.term === 'string' && task.term.trim() !== ''))
  );
};

export const parseTask = (input: unknown): NewTask => {
  if (!isNewTask(input)) throw new AppError('Invalid Task', HttpStatus.BAD_REQUEST, 'task');

  return input;
};

export const isPatchTask = (body: unknown): body is TaskPatch => {
  if (typeof body !== 'object' || body === null) return false;

  const task = body as Record<string, unknown>;
  const hasFields = Object.keys(task).length > 0;

  const hasInvalidField = Object.keys(task).some((key) => !allowedFields.includes(key));
  if (hasInvalidField) return false;

  return (
    hasFields &&
    (task.title === undefined || (typeof task.title === 'string' && task.title.trim() !== '')) &&
    (task.status === undefined ||
      task.status === 'todo' ||
      task.status === 'doing' ||
      task.status === 'done') &&
    (task.term === undefined ||
      task.term === null ||
      (typeof task.term === 'string' && task.term.trim() !== ''))
  );
};

export const parsePatchTask = (input: unknown): TaskPatch => {
  if (!isPatchTask(input)) throw new AppError('Invalid Task', HttpStatus.BAD_REQUEST, 'task');

  return input;
};
