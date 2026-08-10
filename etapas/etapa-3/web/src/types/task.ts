export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  readonly id: string;
  title: string;
  status: Status;
  term: string | null;
}

export type TaskForm = { title: string; status: Status; term: string };

export type FieldErrors = Partial<Record<keyof TaskForm, string>>;

export type NewTask = Omit<Task, 'id'>;

export type TaskPatch = Partial<Pick<Task, 'title' | 'status' | 'term'>>;
