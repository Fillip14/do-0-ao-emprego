import pg, { type QueryResult, type QueryResultRow } from 'pg';
const { Pool } = pg;

const pool = new Pool();
let closed = false;

export const queryDb = <T extends QueryResultRow>(
  text: string,
  values?: unknown[],
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, values);
};

// Idempotente de propósito: em teste, cada arquivo registra um afterAll
// que fecha o pool compartilhado — sem essa guarda, o primeiro arquivo a
// terminar quebraria os outros ("Cannot use a pool after calling end").
export const closePool = async (): Promise<void> => {
  if (closed) return;
  closed = true;
  await pool.end();
};

export { pool };
