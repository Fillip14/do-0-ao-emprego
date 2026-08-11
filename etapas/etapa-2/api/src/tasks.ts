// Entidade — a forma que sai do banco / vai na resposta. A partir do
// Tema 6, a forma do que ENTRA (NewTask/TaskPatch) mora no schema de
// validação (validation/tasks.schema.ts), não mais aqui — é o schema do
// zod, via z.infer, que define esses tipos agora; ver DTO no resumo do
// Tema 6.
export interface Task {
  readonly id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  term: string | null;
}
