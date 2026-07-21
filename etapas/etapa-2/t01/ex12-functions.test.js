import { describe, it, expect } from 'vitest';
import { parsePort, slugify } from './ex12-functions.js';

describe('parsePort', () => {
  it('converte string numérica', () => {
    expect(parsePort('4000')).toBe(4000);
  });

  it('usa default quando undefined', () => {
    expect(parsePort(undefined)).toBe(3000);
  });

  it('usa default quando não é número', () => {
    expect(parsePort('abc')).toBe(3000);
  });

  it(`usa default quando string vazia (Number('') é 0)`, () => {
    expect(parsePort('')).toBe(3000);
  });

  it('usa default quando fora da faixa de portas', () => {
    expect(parsePort('99999')).toBe(3000);
  });
});

describe('slugify', () => {
  it('converte título em slug', () => {
    expect(slugify('Estudar Node')).toBe('estudar-node');
  });

  it('troca TODOS os espaços, não só o primeiro', () => {
    expect(slugify('Estudar Node Hoje')).toBe('estudar-node-hoje');
  });

  it('colapsa espaços repetidos e ignora bordas', () => {
    expect(slugify('  Estudar   Node  ')).toBe('estudar-node');
  });

  it('remove acentos', () => {
    expect(slugify('Introdução à API')).toBe('introducao-a-api');
  });

  it('lança quando o título é vazio', () => {
    expect(() => slugify('')).toThrow();
  });
});
