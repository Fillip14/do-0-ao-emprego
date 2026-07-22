export interface Task {
  readonly id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
  author?: string;
}

const coAuhor = 'Creator';
// @ts-expect-error
const t1: Task = { id: 1, title: 'Titulo' }; // A propriedade 'status' está ausente no tipo '{ id: number; title: string; }', mas é obrigatória no tipo 'Task'.
// @ts-expect-error
const t2: Task = { id: 1, title: 'Titulo', status: 'todo', coAuhor: coAuhor }; // O literal de objeto pode especificar apenas propriedades conhecidas e 'coAuhor' não existe no tipo 'Task'.
const raw = { id: 1, title: 'Titulo', status: 'todo' as const, coAuhor: coAuhor };

const t3: Task = raw;
// @ts-expect-error
t1.id = 99; // Não é possível atribuir a 'id' porque é uma propriedade de somente leitura.

// Pois ele não identificou como se eu tivesse passado errado, o objeto já veio assim.
// Interface pois fica mais explicativo
// optei por as const para manter a estrutura dos testes propostos
