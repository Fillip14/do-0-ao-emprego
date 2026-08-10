const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  readonly status: number;
  readonly details: { field?: string; message: string }[];

  constructor(status: number, details: { field?: string; message: string }[]) {
    super(details[0]?.message ?? 'Erro na requisição');
    this.status = status;
    this.details = details;
  }
}

export async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const timeout = AbortSignal.timeout(8000);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  const res = await fetch(`${BASE_URL}${path}`, { signal: combined });

  if (!res.ok) {
    const body = await res.json();
    throw new ApiError(res.status, body.errors);
  }

  return (await res.json()) as T;
}
