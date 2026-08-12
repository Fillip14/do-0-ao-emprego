import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import * as tasksRepository from '../repositories/tasks.repository.js';
import type { TaskRow } from '../repositories/tasks.repository.js';
import { newTaskSchema, taskPatchSchema, taskListQuerySchema } from '../validation/tasks.schema.js';
import { zodIssuesToDetails } from '../validation/to-error-details.js';
import type { NewTask, TaskPatch } from '../validation/tasks.schema.js';
import type { Task } from '../tasks.js';

// Serviço: a regra de negócio e a validação de entrada moram aqui — a
// rota só lê request e monta response; o repositório só sabe SQL.

export const parseNewTask = (input: unknown): NewTask => {
  const result = newTaskSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(
      'Invalid Task',
      HttpStatus.BAD_REQUEST,
      undefined,
      zodIssuesToDetails(result.error.issues),
    );
  }
  return result.data;
};

export const parseTaskPatch = (input: unknown): TaskPatch => {
  const result = taskPatchSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(
      'Invalid Task',
      HttpStatus.BAD_REQUEST,
      undefined,
      zodIssuesToDetails(result.error.issues),
    );
  }
  return result.data;
};

// 403, não 404: a tarefa existe, só não é do usuário do token. Tarefa
// órfã (owner_id null, de antes do Tema 8) também cai aqui — não é de
// ninguém, então não é de quem está pedindo.
const requireOwnership = (row: TaskRow, ownerId: string): void => {
  if (row.owner_id !== ownerId) throw new AppError('Forbidden', HttpStatus.FORBIDDEN);
};

// Tira o owner_id antes de devolver — a resposta pública nunca expõe
// essa coluna (mesmo padrão do created_at, desde o Tema 4).
const toPublicTask = (row: TaskRow): Task => {
  const { owner_id: _ownerId, ...task } = row;
  return task;
};

export const listTasks = async (query: unknown, ownerId: string) => {
  const parsed = taskListQuerySchema.safeParse(query);
  if (!parsed.success) {
    throw new AppError(
      'Invalid Query',
      HttpStatus.BAD_REQUEST,
      undefined,
      zodIssuesToDetails(parsed.error.issues),
    );
  }

  const { page, pageSize, status, orderBy, orderDir } = parsed.data;
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const [rowsResult, countResult] = await Promise.all([
    tasksRepository.findAll({ limit, offset, status, orderBy, orderDir, ownerId }),
    tasksRepository.count(ownerId, status),
  ]);

  const total = Number(countResult.rows[0]?.count ?? 0);

  return { tasks: rowsResult.rows, page, pageSize, total };
};

export const getTaskById = async (id: string, ownerId: string) => {
  const result = await tasksRepository.findById(id);
  const row = result.rows[0];
  if (!row) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');
  requireOwnership(row, ownerId);
  return toPublicTask(row);
};

export const createTask = async (input: unknown, ownerId: string) => {
  const newTask = parseNewTask(input);
  const result = await tasksRepository.insert(newTask, ownerId);
  const task = result.rows[0];
  if (!task) throw new AppError('Insert error in DB', HttpStatus.INTERNAL_SERVER_ERROR, 'Insert DB');
  return task;
};

export const updateTask = async (id: string, input: unknown, ownerId: string) => {
  const existing = (await tasksRepository.findById(id)).rows[0];
  if (!existing) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');
  requireOwnership(existing, ownerId);

  const patch = parseTaskPatch(input);
  const result = await tasksRepository.update(id, patch);
  const task = result.rows[0];
  if (!task) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');
  return task;
};

export const deleteTask = async (id: string, ownerId: string) => {
  const existing = (await tasksRepository.findById(id)).rows[0];
  if (!existing) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');
  requireOwnership(existing, ownerId);

  const result = await tasksRepository.remove(id);
  if (!result.rows[0]) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');
};
