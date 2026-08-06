export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  readonly id: string;
  description: string;
  status: Status;
  term: string | null;
}
