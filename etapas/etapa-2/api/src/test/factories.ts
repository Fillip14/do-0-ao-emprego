import type { NewTask } from '../validation/tasks.schema.js';

// Factory: monta o payload com valor padrão, sobrescrevendo só o que o
// teste discute. Função (não const) para nunca devolver o mesmo objeto —
// um objeto compartilhado e mutado por um teste vazaria para o vizinho.
export const makeTask = (over: Partial<NewTask> = {}): NewTask => ({
  title: 'Comprar pão',
  status: 'todo',
  term: null,
  ...over,
});
