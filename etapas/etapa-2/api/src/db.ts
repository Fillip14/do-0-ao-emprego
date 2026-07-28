import pg, { type QueryResult, type QueryResultRow } from 'pg';
const { Pool } = pg;

const pool = new Pool();

export const queryDb = <T extends QueryResultRow>(
  text: string,
  values?: unknown[],
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, values);
};

export { pool };
