interface Task {
  id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
  author?: string;
  priority: 'low' | 'high';
}

const tasks: Task[] = [];

type NewTask = Omit<Task, 'id'>;
type PatchTask = Partial<Omit<Task, 'id'>>;
type ResumeTask = Pick<Task, 'id' | 'title'>;
const t2 = { id: 1, title: 'Ola', status: 'todo' as const };

// (1) CRIAR — o id é gerado aqui (Date.now), não vem de fora.
// frouxo: input é Task inteira → o cliente pode mandar um id e sobrescrever o seu.
function createTask(input: NewTask): Task {
  const task: Task = { ...input, id: Date.now() };
  tasks.push(task);
  return task;
}

// (2) ALTERAR — o cliente manda só os campos que quer mudar.
// frouxo: changes é Task inteira → obriga reenviar tudo e ainda deixa trocar o id.
function patchTask(id: number, changes: PatchTask): Task {
  const task = tasks.find((t) => t.id === id)!;
  Object.assign(task, changes);
  return task;
}

// (3) RESUMIR — a listagem mostra só id e title.
// frouxo: retorno é Task inteira → vaza status e author sem necessidade.
function toPreview(task: Task): ResumeTask {
  const newTask: ResumeTask = { id: task.id, title: task.title };
  return newTask;
}

const newTask = createTask({ title: 'Ola', status: 'todo', priority: 'low' });
console.log(patchTask(newTask.id, { title: 'Novo Titulo' }));
console.log(toPreview(newTask));
