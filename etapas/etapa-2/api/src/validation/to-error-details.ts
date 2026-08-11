import type { ErrorDetail } from '../errors.js';

// Tipo estrutural mínimo (não importa o tipo interno do zod) — assim isto
// não quebra se a versão do zod mudar o nome do tipo de issue.
type ZodLikeIssue = { path: PropertyKey[]; message: string };

// Traduz as issues do zod para o formato de erro da API: um item por
// campo. É isto que finalmente entrega o ApiError.fieldErrors que o front
// já tinha escrito e sem cliente (ver Tema 4 do api/README.md).
export const zodIssuesToDetails = (issues: ZodLikeIssue[]): ErrorDetail[] =>
  issues.map((issue) => {
    const field = issue.path[0];
    const detail: ErrorDetail = { message: issue.message };
    if (typeof field === 'string') detail.field = field;
    return detail;
  });
