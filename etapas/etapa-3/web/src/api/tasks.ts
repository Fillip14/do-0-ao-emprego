import { request } from './http';
import type { NewTask, Task, TaskPatch } from '../types/task';

export const getTasks = (signal?: AbortSignal) => request<Task[]>('/tasks', { signal });

export const getTask = (id: string, signal?: AbortSignal) =>
  request<Task>(`/tasks/${id}`, { signal });

export const createTask = (input: NewTask) =>
  request<Task>('/tasks', { method: 'POST', body: input });

export const updateTask = (id: string, patch: TaskPatch) =>
  request<Task>(`/tasks/${id}`, { method: 'PATCH', body: patch });

export const deleteTask = (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' });
