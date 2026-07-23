export class AppError extends Error {
  status: number; // declara o campo do status (o tipo você já sabe)
  field?: string; // declara o field, opcional, com o tipo dele

  constructor(message: string, status: number, field?: string) {
    super(message); // o que o Error pai precisa receber?
    this.status = status; // guarda o status na instância
    if (field !== undefined) this.field = field; // guarda o field na instância
  }
}
