import { describe, expect, it } from 'vitest';
import { tasksReducer, type TasksState } from './tasksReducer';
import type { Task } from '../types/task';

// Fixtures locais: o reducer é puro, então não precisa de servidor, de DOM nem de React.
const taskA: Task = { id: 'a', title: 'Comprar pão', status: 'todo', term: null };
const taskB: Task = { id: 'b', title: 'Lavar louça', status: 'doing', term: null };

// Atalho para o estado que a maioria dos casos usa como ponto de partida.
const success = (tasks: Task[]): TasksState => ({ status: 'success', tasks });

describe('tasksReducer', () => {
  it('loaded troca o estado por success com as tarefas recebidas', () => {
    const state = tasksReducer({ status: 'loading' }, { type: 'loaded', tasks: [taskA, taskB] });

    expect(state).toEqual({ status: 'success', tasks: [taskA, taskB] });
  });

  it('failed troca o estado por error com a mensagem recebida', () => {
    const state = tasksReducer({ status: 'loading' }, { type: 'failed', message: 'boom' });

    expect(state).toEqual({ status: 'error', message: 'boom' });
  });

  it('created acrescenta a tarefa no fim da lista', () => {
    const state = tasksReducer(success([taskA]), { type: 'created', task: taskB });

    // A ordem importa: é ela que decide onde a tarefa nova aparece na tela.
    expect(state).toEqual(success([taskA, taskB]));
  });

  it('updated troca só a tarefa de mesmo id e mantém as outras', () => {
    const renamed: Task = { ...taskA, title: 'Comprar pão integral' };

    const state = tasksReducer(success([taskA, taskB]), { type: 'updated', task: renamed });

    expect(state).toEqual(success([renamed, taskB]));
  });

  it('removed tira da lista a tarefa daquele id', () => {
    const state = tasksReducer(success([taskA, taskB]), { type: 'removed', id: 'a' });

    expect(state).toEqual(success([taskB]));
  });

  it('ignora escrita quando o estado ainda não é success', () => {
    // A guarda `if (state.status !== 'success') return state`: sem lista carregada,
    // não há o que criar, atualizar ou remover. `toBe` porque a prova aqui é de
    // identidade — o reducer devolve o MESMO objeto, não uma cópia igual.
    const loading: TasksState = { status: 'loading' };

    expect(tasksReducer(loading, { type: 'created', task: taskA })).toBe(loading);
    expect(tasksReducer(loading, { type: 'updated', task: taskA })).toBe(loading);
    expect(tasksReducer(loading, { type: 'removed', id: 'a' })).toBe(loading);
  });

  it('não muta o estado que recebeu', () => {
    // O React compara o estado velho com o novo por referência. Se o reducer
    // alterar o array recebido, os dois são o mesmo objeto e a tela não re-renderiza.
    const before = success([taskA, taskB]);
    const snapshot = structuredClone(before);

    tasksReducer(before, { type: 'removed', id: 'a' });
    tasksReducer(before, { type: 'created', task: { ...taskA, id: 'c' } });

    expect(before).toEqual(snapshot);
  });
});
