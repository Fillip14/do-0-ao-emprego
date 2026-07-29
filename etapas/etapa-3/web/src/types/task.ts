export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  readonly id: string;
  title: string;
  status: Status;
  term: string | null;
}
