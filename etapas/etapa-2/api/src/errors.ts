export class AppError extends Error {
  status: number;
  field?: string;

  constructor(message: string, status: number, field?: string) {
    super(message);
    this.status = status;
    if (field !== undefined) this.field = field;
  }
}

export type ErrorDetail = { message: string; field?: string };
