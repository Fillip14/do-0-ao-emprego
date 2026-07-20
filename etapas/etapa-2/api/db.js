import pg from 'pg';
const { Pool } = pg;

const pool = new Pool(); // uma vez, no arquivo inteiro

export function query(texto, valores) {
  return pool.query(texto, valores); // repassa e devolve a promessa
}

export { pool }; // exportar o pool também: os testes vão precisar dele para fechar no final
