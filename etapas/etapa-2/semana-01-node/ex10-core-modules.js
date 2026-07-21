import { join } from 'node:path';
import { writeFile, readFile } from 'node:fs/promises';

const id = crypto.randomUUID();

const task = { id, title: 'estudar node' };

await writeFile(join('task.json'), JSON.stringify(task));
const file = await readFile('task.json', 'utf-8');
console.log(task);
console.log(JSON.parse(file));

// - path.join monta o caminho com o separador certo de cada sistema (/ no Linux,
//   \ no Windows) e normaliza barras duplicadas. Concatenar string quebra ao trocar de SO.
// - __dirname / import.meta.url = onde o ARQUIVO está.
//   process.cwd() = de onde você RODOU o comando. São diferentes se você
//   rodar de outra pasta — e é por isso que o task.json aparece no lugar errado.
// - fs/promises com async/await; a versão de callback aninha e fica ilegível.
