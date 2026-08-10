import type { FieldErrors, TaskForm } from '../types/task';

const BASE_URL = import.meta.env.VITE_API_URL;

type RequestOptions = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal | undefined;
};

export class ApiError extends Error {
  readonly status: number;
  readonly details: { field?: string; message: string }[];

  constructor(status: number, details: { field?: string; message: string }[]) {
    super(details[0]?.message ?? 'Erro na requisição');
    this.status = status;
    this.details = details;
  }

  get fieldErrors(): FieldErrors {
    const result: FieldErrors = {};
    for (const detail of this.details) {
      if (detail.field) result[detail.field as keyof TaskForm] = detail.message;
    }
    return result;
  }

  get formError(): string | undefined {
    return this.details.find((detail) => !detail.field)?.message;
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;

  const timeout = AbortSignal.timeout(8000);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal: combined,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? null : JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    throw new ApiError(res.status, errorBody.errors);
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}
