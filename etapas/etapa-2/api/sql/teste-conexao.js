import pg from 'pg';
const { Pool } = pg;
const pool = new Pool();

const titulo = "'; DROP TABLE alvo; --"; // ← o ataque, como VALOR

// const sql = `SELECT * FROM alvo WHERE title = '${titulo}'`; // ☠️ concatenação

// console.log('SQL que vai para o banco:', sql); // ← olhe isto com atenção

const r = await pool.query('SELECT * FROM alvo WHERE title = $1', [titulo]);
console.log(r.rows);
console.log('linhas:', r.rowCount);

await pool.end();
