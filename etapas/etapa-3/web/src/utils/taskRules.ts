import type { Status } from '../types/task';

export const nextStatus: Record<Status, Status> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
};
