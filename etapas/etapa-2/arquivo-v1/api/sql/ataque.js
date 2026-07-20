/*
 * Demonstração de SQL injection — Etapa 2 · Semana 3 · Bloco B (20/07/2026)
 *
 * Registro de um experimento rodado contra uma tabela descartável `alvo`
 * (criada com: CREATE TABLE alvo AS SELECT * FROM tasks;).
 *
 * ⚠️ NÃO RODAR COMO ESTÁ APONTANDO PARA UMA TABELA QUE IMPORTA:
 * o ataque 2 APAGA a tabela de verdade. Este arquivo existe para documentar
 * o que foi observado, não para ser executado de novo.
 *
 * Como foi rodado:
 *   PGHOST=/var/run/postgresql PGDATABASE=tasks node sql/ataque.js
 *
 * Compilado pela IA (fase revisor) a pedido do Fillip; o experimento,
 * as execuções e as conclusões são dele.
 */

import pg from '../node_modules/@types/pg';
const { Pool } = pg;
const pool = new Pool();

// O texto abaixo simula o que um estranho digitaria em req.body.title.
// Ele é apenas um VALOR — uma string comum. O perigo não está nele,
// está em como o código o coloca (ou não) dentro do SQL.

const titulo = "' OR 1=1 --";
// const titulo = "'; DROP TABLE alvo; --";
// const titulo = 'oi';   // valor honesto, para comparar

// ---------------------------------------------------------------------------
// VERSÃO VULNERÁVEL — concatenação por template string
// ---------------------------------------------------------------------------
// O valor é costurado DENTRO do texto da query. O banco recebe um texto só e
// precisa descobrir sozinho onde acaba o comando e onde começa o dado — e ele
// decide isso pelas aspas, que vieram do atacante.

const sql = `SELECT * FROM alvo WHERE title = '${titulo}'`;
console.log('SQL que vai para o banco:', sql);

const r = await pool.query(sql);
console.log(r.rows);
console.log('linhas:', r.rowCount);

await pool.end();

/* ---------------------------------------------------------------------------
 * OBSERVADO
 * ---------------------------------------------------------------------------
 *
 * ATAQUE 1 — titulo = "' OR 1=1 --"
 *
 *   SQL que foi para o banco:
 *     SELECT * FROM alvo WHERE title = '' OR 1=1 --'
 *
 *   Como o banco leu:
 *     title = ''   → a aspa do atacante FECHOU a aspa que o código abriu
 *     OR 1=1       → ...ou uma condição sempre verdadeira → casa com toda linha
 *     --'          → comentário: o resto da linha é descartado, inclusive a
 *                    aspa órfã que sobrou
 *
 *   Resultado: voltaram TODAS as linhas da tabela. Uma busca por título
 *   virou um vazamento da tabela inteira.
 *
 *
 * ATAQUE 2 — titulo = "'; DROP TABLE alvo; --"
 *
 *   SQL que foi para o banco:
 *     SELECT * FROM alvo WHERE title = ''; DROP TABLE alvo; --'
 *
 *   O ';' encerrou o SELECT e abriu um SEGUNDO comando, escolhido pelo
 *   atacante.
 *
 *   Resultado: r.rows e r.rowCount vieram `undefined` — quando a query tem
 *   mais de um comando, o `pg` devolve um ARRAY de resultados, um por comando.
 *   Esse `undefined` é a própria prova de que dois comandos rodaram.
 *   Conferido depois no psql com \dt: a tabela `alvo` não existia mais.
 *
 *
 * DEFESA — mesma string de ataque, query parametrizada:
 *
 *     await pool.query('SELECT * FROM alvo WHERE title = $1', [titulo]);
 *
 *   Resultado: [] e 0 linhas. A tabela seguiu intacta (\dt confirmou).
 *
 *   Repare no que NÃO aconteceu:
 *     - não deu erro: o banco não "detectou um ataque";
 *     - nada foi escapado ou limpo: o texto chegou inteiro, do jeito que veio.
 *
 *   O banco simplesmente procurou uma tarefa cujo título é, literalmente,
 *   o texto "'; DROP TABLE alvo; --". Nenhuma tem esse título → 0 linhas.
 *   Ou seja: parametrizado, o ataque vira um 404 comum.
 *
 *
 * POR QUE FUNCIONA — é uma questão de ORDEM
 *
 *   Concatenado: monta-se o texto COM o dado dentro; o banco recebe tudo
 *   junto e a estrutura do comando é decidida DEPOIS que o dado já entrou.
 *
 *   Parametrizado: o texto viaja com buracos ($1) e os valores viajam
 *   separados no protocolo. O banco analisa a query e FECHA a estrutura com
 *   os buracos ainda vazios; só então encaixa os valores. Quando o dado
 *   chega, já é tarde demais para ele virar comando.
 *
 *   Não é escapar aspas. É o valor nunca chegar a ser SQL.
 *
 *
 * DETALHES DE $1
 *   - numera a partir de 1 (não de zero);
 *   - os valores vão sempre em array, mesmo quando é um só;
 *   - $1 marca VALOR, nunca nome de coluna ou tabela: ORDER BY $1 não funciona.
 */
