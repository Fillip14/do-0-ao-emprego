import { queryDb } from '../db.js';
import type { Task } from '../tasks.js';
import type { NewTask, TaskPatch } from '../validation/tasks.schema.js';

// Repositório: só sabe falar SQL com a tabela tasks. Nenhuma regra de
// negócio mora aqui — quem decide o que fazer com o resultado é o
// serviço (tasks.service.ts).
const TASK_COLUMNS = 'id, title, status, term';

// Linha crua com o dono — só usada internamente pra checar posse (Tema 8).
// O serviço tira o owner_id antes de devolver pro cliente; a resposta
// pública nunca expõe essa coluna, igual já era com created_at.
export type TaskRow = Task & { owner_id: string | null };

export type ListOptions = {
  limit: number;
  offset: number;
  status: Task['status'] | undefined;
  orderBy: 'created_at' | 'title';
  orderDir: 'ASC' | 'DESC';
  ownerId: string;
};

export const findAll = (opts: ListOptions) => {
  const values: unknown[] = [opts.ownerId];
  let where = 'WHERE owner_id = $1';

  if (opts.status) {
    values.push(opts.status);
    where += ` AND status = $${values.length}`;
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

export const count = (ownerId: string, status: Task['status'] | undefined) => {
  if (status) {
    return queryDb<{ count: string }>(
      'SELECT count(*) FROM tasks WHERE owner_id = $1 AND status = $2',
      [ownerId, status],
    );
  }
  return queryDb<{ count: string }>('SELECT count(*) FROM tasks WHERE owner_id = $1', [ownerId]);
};

// Sem filtro de dono de propósito: o serviço precisa da linha inteira
// (owner_id incluso) pra decidir 404 × 403 — ver requireOwnership.
export const findById = (id: string) =>
  queryDb<TaskRow>(`SELECT ${TASK_COLUMNS}, owner_id FROM tasks WHERE id = $1`, [id]);

export const insert = (task: NewTask, ownerId: string) =>
  queryDb<Task>(
    `INSERT INTO tasks (title, status, term, owner_id) VALUES ($1, $2, $3, $4) RETURNING ${TASK_COLUMNS}`,
    [task.title, task.status, task.term, ownerId],
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
