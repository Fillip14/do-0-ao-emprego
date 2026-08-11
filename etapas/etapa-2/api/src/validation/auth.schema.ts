import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('e-mail inválido'),
    password: z.string().min(8, 'senha precisa de pelo menos 8 caracteres'),
  })
  .strict();

export const loginSchema = registerSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
