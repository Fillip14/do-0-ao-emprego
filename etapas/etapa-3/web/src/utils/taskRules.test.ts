import { describe, expect, it } from 'vitest';
import { nextStatus, validateTaskForm } from './taskRules';
import type { TaskForm } from '../types/task';

describe('nextStatus', () => {
  it('cicla todo → doing → done → todo', () => {
    // O ciclo fecha: partindo de 'todo' e andando três vezes, volta para 'todo'.
    // Testar o mapa inteiro num `it` só é honesto aqui porque a regra É o ciclo —
    // três testes separados provariam três setas soltas, não que elas fecham.
    expect(nextStatus.todo).toBe('doing');
    expect(nextStatus.doing).toBe('done');
    expect(nextStatus.done).toBe('todo');
  });
});

describe('validateTaskForm', () => {
  const form = (title: string): TaskForm => ({ title, status: 'todo', term: '' });

  it('não reclama de nada quando o título tem conteúdo', () => {
    // Objeto vazio é o contrato de "sem erro" — é o que a TasksPage checa
    // para decidir se manda o POST.
    expect(validateTaskForm(form('Comprar pão'))).toEqual({});
  });

  it('reclama do título vazio', () => {
    expect(validateTaskForm(form(''))).toEqual({ title: 'Escreva um título para a tarefa' });
  });

  it('reclama do título que só tem espaço', () => {
    // O caso que passa despercebido: '   ' não é vazio para o JavaScript,
    // mas é vazio para uma pessoa. Quem resolve é o .trim() da regra.
    expect(validateTaskForm(form('   '))).toEqual({ title: 'Escreva um título para a tarefa' });
  });
});
