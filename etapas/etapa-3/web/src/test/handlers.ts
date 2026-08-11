import { http, HttpResponse } from 'msw';
import type { Task } from '../types/task';

// Uma tarefa de cada status: é o que faz a lista cair nas três colunas da FilledTasks.
export const tasksFixture: Task[] = [
  { id: 'task-1', title: 'Comprar pão', status: 'todo', term: null },
  { id: 'task-2', title: 'Lavar louça', status: 'doing', term: '2026-08-20' },
  { id: 'task-3', title: 'Estudar testes', status: 'done', term: null },
];

// Um "banco" em memória em vez de respostas fixas. O motivo: o PATCH do app manda
// só o campo que mudou (`{ status }`), e o front usa a RESPOSTA para atualizar a tela.
// Com resposta fixa, a tarefa perderia o título no meio do teste — por um defeito do
// mock, não do app. O reset roda antes de cada teste (setup.ts).
let db: Task[] = [];

export const resetDb = () => {
  db = tasksFixture.map((task) => ({ ...task }));
};

// O formato de erro é o do `http.ts`: ele lê `errorBody.errors` e monta o ApiError.
const notFound = () =>
  HttpResponse.json({ errors: [{ message: 'Tarefa não encontrada' }] }, { status: 404 });

// `*/tasks` e não a URL inteira: em teste o VITE_API_URL não existe e o fetch
// pede "undefined/tasks". O `*` casa com qualquer começo (decisão do T13, tópico 8).
export const handlers = [
  http.get('*/tasks', () => HttpResponse.json(db)),

  http.get('*/tasks/:id', ({ params }) => {
    const task = db.find((item) => item.id === params.id);
    return task ? HttpResponse.json(task) : notFound();
  }),

  http.post('*/tasks', async ({ request }) => {
    const body = (await request.json()) as Omit<Task, 'id'>;
    const created: Task = { ...body, id: `task-${db.length + 1}` };
    db.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('*/tasks/:id', async ({ params, request }) => {
    const index = db.findIndex((item) => item.id === params.id);
    const current = db[index];
    if (!current) return notFound();

    const patch = (await request.json()) as Partial<Task>;
    const updated: Task = { ...current, ...patch };
    db[index] = updated;
    return HttpResponse.json(updated);
  }),

  http.delete('*/tasks/:id', ({ params }) => {
    const index = db.findIndex((item) => item.id === params.id);
    if (index === -1) return notFound();

    db.splice(index, 1);
    // 204 não tem corpo: é o ramo do `res.status === 204` do http.ts rodando de verdade.
    return new HttpResponse(null, { status: 204 });
  }),
];
