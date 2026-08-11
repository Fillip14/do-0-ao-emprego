import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import * as tasksRepository from '../repositories/tasks.repository.js';
import { newTaskSchema, taskPatchSchema, taskListQuerySchema } from '../validation/tasks.schema.js';
import { zodIssuesToDetails } from '../validation/to-error-details.js';
import type { NewTask, TaskPatch } from '../validation/tasks.schema.js';

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

export const listTasks = async (query: unknown) => {
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
    tasksRepository.findAll({ limit, offset, status, orderBy, orderDir }),
    tasksRepository.count(status),
  ]);

  const total = Number(countResult.rows[0]?.count ?? 0);

  return { tasks: rowsResult.rows, page, pageSize, total };
};

export const getTaskById = async (id: string) => {
  const result = await tasksRepository.findById(id);
  const task = result.rows[0];
  if (!task) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');
  return task;
};

export const createTask = async (input: unknown) => {
  const newTask = parseNewTask(input);
  const result = await tasksRepository.insert(newTask);
  const task = result.rows[0];
  if (!task) throw new AppError('Insert error in DB', HttpStatus.INTERNAL_SERVER_ERROR, 'Insert DB');
  return task;
};

export const updateTask = async (id: string, input: unknown) => {
  const patch = parseTaskPatch(input);
  const result = await tasksRepository.update(id, patch);
  const task = result.rows[0];
  if (!task) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');
  return task;
};

export const deleteTask = async (id: string) => {
  const result = await tasksRepository.remove(id);
  if (!result.rows[0]) throw new AppError('Not Found', HttpStatus.NOT_FOUND, 'id');
};
