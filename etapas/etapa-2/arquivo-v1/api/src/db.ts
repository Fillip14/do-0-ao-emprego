import pg, { type QueryResult, type QueryResultRow } from '../node_modules/@types/pg/index.js';
const { Pool } = pg;

const pool = new Pool(); // uma vez, no arquivo inteiro

export function query<T extends QueryResultRow>(
  text: string,
  values?: Array<string>,
): Promise<QueryResult<T>> {
  return pool.query<T>(text, values);
}

export { pool }; // exportar o pool também: os testes vão precisar dele para fechar no final
