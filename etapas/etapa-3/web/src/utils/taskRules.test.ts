import { describe, expect, it } from 'vitest';
import { nextStatus, validateTaskForm } from './taskRules';
import type { TaskForm } from '../types/task';

describe('nextStatus', () => {
  it('cicla todo → doing → done → todo', () => {
    // Um `it` só porque a regra É o ciclo: setas separadas não provam que ele fecha.
    expect(nextStatus.todo).toBe('doing');
    expect(nextStatus.doing).toBe('done');
    expect(nextStatus.done).toBe('todo');
  });
});

describe('validateTaskForm', () => {
  const form = (title: string): TaskForm => ({ title, status: 'todo', term: '' });

  it('não reclama de nada quando o título tem conteúdo', () => {
    // Objeto vazio é o contrato de "sem erro": é o que a TasksPage checa antes do POST.
    expect(validateTaskForm(form('Comprar pão'))).toEqual({});
  });

  it('reclama do título vazio', () => {
    expect(validateTaskForm(form(''))).toEqual({ title: 'Escreva um título para a tarefa' });
  });

  it('reclama do título que só tem espaço', () => {
    // '   ' não é vazio para o JavaScript, mas é para uma pessoa: quem resolve é o .trim().
    expect(validateTaskForm(form('   '))).toEqual({ title: 'Escreva um título para a tarefa' });
  });
});
