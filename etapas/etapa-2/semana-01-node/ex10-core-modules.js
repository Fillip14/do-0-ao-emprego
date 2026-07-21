import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile, readFile } from 'node:fs/promises';

// __dirname não existe em ESM — isto é o equivalente
const here = dirname(fileURLToPath(import.meta.url));

const id = crypto.randomUUID();
const task = { id, title: 'estudar node' };

const filePath = join(here, 'task.json');

await writeFile(filePath, JSON.stringify(task));
const file = await readFile(filePath, 'utf-8');
const readTask = JSON.parse(file);

console.log('gravado:', task);
console.log('lido:   ', readTask);
console.log('iguais? ', task.id === readTask.id);

// - path.join monta o caminho com o separador certo de cada sistema (/ no Linux,
//   \ no Windows) e normaliza barras duplicadas. Concatenar string quebra ao trocar de SO.
// - __dirname / import.meta.url = onde o ARQUIVO está.
//   process.cwd() = de onde você RODOU o comando.
//   Rodando de outra pasta (node semana-01-node/ex10-core-modules.js) o cwd muda,
//   mas o task.json continua caindo ao lado do script — porque o caminho é
//   ancorado no arquivo, não no diretório atual.
// - fs/promises com async/await; a versão de callback aninha e fica ilegível.
