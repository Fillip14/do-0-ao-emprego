import { z } from 'zod';

// Fonte única da forma de uma task nova/patch — o tipo (NewTask/TaskPatch)
// é inferido do schema (z.infer), não duplicado à mão como antes.
export const taskStatusSchema = z.enum(['todo', 'doing', 'done']);

export const newTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'título é obrigatório'),
    status: taskStatusSchema,
    term: z.string().trim().min(1, 'term não pode ser vazio').nullable(),
  })
  // .strict() rejeita chave desconhecida — equivalente ao "hasInvalidField"
  // manual que existia em tasks.ts antes deste tema.
  .strict();

export const taskPatchSchema = newTaskSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, { message: 'informe ao menos um campo' });

export type NewTask = z.infer<typeof newTaskSchema>;
export type TaskPatch = z.infer<typeof taskPatchSchema>;

// Colunas em que é seguro ordenar. Nunca aceitar o nome da coluna vindo
// direto da query string — ORDER BY não é protegido por query
// parametrizada ($1), então isso é a defesa contra SQL injection ali.
export const orderableColumns = ['created_at', 'title'] as const;

export const taskListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: taskStatusSchema.optional(),
  orderBy: z.enum(orderableColumns).default('created_at'),
  orderDir: z
    .enum(['asc', 'desc'])
    .default('asc')
    .transform((value) => (value === 'asc' ? ('ASC' as const) : ('DESC' as const))),
});

export type TaskListQuery = z.infer<typeof taskListQuerySchema>;
