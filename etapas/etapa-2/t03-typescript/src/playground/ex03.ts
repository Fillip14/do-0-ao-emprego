interface Task {
  readonly id: number;
  title: string;
  done: boolean;
  author?: string;
}

const coAuhor = 'Creator';
// @ts-expect-error
const t1: Task = { id: 1, title: 'Titulo' }; // A propriedade 'done' está ausente no tipo '{ id: number; title: string; }', mas é obrigatória no tipo 'Task'.
// @ts-expect-error
const t2: Task = { id: 1, title: 'Titulo', done: false, coAuhor: coAuhor }; // O literal de objeto pode especificar apenas propriedades conhecidas e 'coAuhor' não existe no tipo 'Task'.
const raw = { id: 1, title: 'Titulo', done: false, coAuhor: coAuhor };

const t3: Task = raw;
// @ts-expect-error
t1.id = 99; // Não é possível atribuir a 'id' porque é uma propriedade de somente leitura.

// Pois ele não identificou como se eu tivesse passado errado, o objeto já veio assim.
// Interface pois fica mais explicativo
