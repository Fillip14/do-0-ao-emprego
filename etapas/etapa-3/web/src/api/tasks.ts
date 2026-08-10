import { request } from './http';
import type { Task } from '../types/task';

export const getTasks = (signal?: AbortSignal) => request<Task[]>('/tasks', signal);
