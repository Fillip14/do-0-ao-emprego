import { describe, it, expect } from 'vitest';
import { parseNewTask, parseTaskPatch } from './services/tasks.service.js';
import { AppError } from './errors.js';

// Unitário: valida entrada via zod, sem I/O — não sobe Express nem toca
// o banco. Substituiu isNewTask/parseTask (que viviam neste arquivo antes
// do Tema 6); a validação agora é declarativa, no schema.
describe('parseNewTask', () => {
  it('retorna a task quando válida', () => {
    const task = parseNewTask({ title: 'Teste', status: 'todo', term: null });
    expect(task).toEqual({ title: 'Teste', status: 'todo', term: null });
  });

  it('lança AppError com detalhe por campo quando o título está vazio', () => {
    let caught: unknown;
    try {
      parseNewTask({ title: '', status: 'todo', term: null });
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(AppError);
    expect((caught as AppError).details?.some((d) => d.field === 'title')).toBe(true);
  });

  it('lança AppError quando a task tem chave desconhecida', () => {
    expect(() => parseNewTask({ banana: 'Teste' })).toThrow(AppError);
  });
});

describe('parseTaskPatch', () => {
  it('aceita patch parcial só com título', () => {
    const patch = parseTaskPatch({ title: 'Novo título' });
    expect(patch).toEqual({ title: 'Novo título' });
  });

  it('lança AppError quando o patch vem vazio', () => {
    expect(() => parseTaskPatch({})).toThrow(AppError);
  });
});
