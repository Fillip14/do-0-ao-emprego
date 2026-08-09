export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  readonly id: string;
  title: string;
  status: Status;
  term: string | null;
}

export type TaskForm = { title: string; status: Status; term: string };

export type FieldErrors = Partial<Record<keyof TaskForm, string>>;
