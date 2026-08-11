import { queryDb } from '../db.js';
import type { Task } from '../tasks.js';
import type { NewTask, TaskPatch } from '../validation/tasks.schema.js';

// Repositório: só sabe falar SQL com a tabela tasks. Nenhuma regra de
// negócio mora aqui — quem decide o que fazer com o resultado é o
// serviço (tasks.service.ts).
const TASK_COLUMNS = 'id, title, status, term';

export type ListOptions = {
  limit: number;
  offset: number;
  status: Task['status'] | undefined;
  orderBy: 'created_at' | 'title';
  orderDir: 'ASC' | 'DESC';
};

export const findAll = (opts: ListOptions) => {
  const values: unknown[] = [];
  let where = '';

  if (opts.status) {
    values.push(opts.status);
    where = `WHERE status = $${values.length}`;
  }

  values.push(opts.limit, opts.offset);
  const limitPos = values.length - 1;
  const offsetPos = values.length;

  // orderBy/orderDir nunca vêm da query string direto — o serviço só
  // repassa valores já validados contra um allow-list (zod enum).
  return queryDb<Task>(
    `SELECT ${TASK_COLUMNS} FROM tasks ${where} ORDER BY ${opts.orderBy} ${opts.orderDir} LIMIT $${limitPos} OFFSET $${offsetPos}`,
    values,
  );
};

export const count = (status: Task['status'] | undefined) => {
  if (status) return queryDb<{ count: string }>('SELECT count(*) FROM tasks WHERE status = $1', [status]);
  return queryDb<{ count: string }>('SELECT count(*) FROM tasks');
};

export const findById = (id: string) =>
  queryDb<Task>(`SELECT ${TASK_COLUMNS} FROM tasks WHERE id = $1`, [id]);

export const insert = (task: NewTask) =>
  queryDb<Task>(
    `INSERT INTO tasks (title, status, term) VALUES ($1, $2, $3) RETURNING ${TASK_COLUMNS}`,
    [task.title, task.status, task.term],
  );

export const update = (id: string, patch: TaskPatch) => {
  const setClauses: string[] = [];
  const values: Array<string | null> = [];

  if (patch.title !== undefined) {
    values.push(patch.title);
    setClauses.push(`title = $${values.length}`);
  }
  if (patch.status !== undefined) {
    values.push(patch.status);
    setClauses.push(`status = $${values.length}`);
  }
  if (patch.term !== undefined) {
    values.push(patch.term);
    setClauses.push(`term = $${values.length}`);
  }

  values.push(id);
  const idPos = values.length;

  return queryDb<Task>(
    `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = $${idPos} RETURNING ${TASK_COLUMNS}`,
    values,
  );
};

export const remove = (id: string) =>
  queryDb<Pick<Task, 'id'>>('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
