export type ErrorDetail = { message: string; field?: string };

export class AppError extends Error {
  status: number;
  field?: string;
  // Quando presente, o tratador central devolve um erro por item aqui em
  // vez do erro único de message/field — é o caso da validação com zod
  // (Tema 6), que sabe apontar qual campo falhou e por quê.
  details?: ErrorDetail[];

  constructor(message: string, status: number, field?: string, details?: ErrorDetail[]) {
    super(message);
    this.status = status;
    if (field !== undefined) this.field = field;
    if (details !== undefined) this.details = details;
  }
}
