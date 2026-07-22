import { type Task } from './ex03.js';

// a que não compila — mantém, é o (a)
const parseTaskStrict = (input: unknown): Task => {
  // @ts-expect-error
  return input.title; // 'input' é do tipo 'unknown'
};

// a preguiçosa — o (b)
const parseTaskLazy = (input: unknown): Task => {
  return input as Task;
};

// const task = parseTaskLazy(JSON.parse('{}'));
// console.log(task.title.trim());

// npx tsx ex06.ts
// /home/fillip/projects/do-0-ao-emprego/etapas/etapa-2/t03-typescript/src/playground/ex06.ts:15
// console.log(task.title.trim());
//                        ^

// TypeError: Cannot read properties of undefined (reading 'trim')
//     at <anonymous> (/home/fillip/projects/do-0-ao-emprego/etapas/etapa-2/t03-typescript/src/playground/ex06.ts:15:24)
//     at ModuleJob.run (node:internal/modules/esm/module_job:439:25)
//     at async node:internal/modules/esm/loader:643:26
//     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

// Node.js v24.18.0

const STATUSES = ['todo', 'doing', 'done'] as const;

const parseTask = (input: unknown): Task => {
  // guarda de objeto (typeof null === 'object')
  if (typeof input !== 'object' || input === null) {
    throw new Error('Invalid input: não é um objeto');
  }

  // author é opcional: só valida se veio
  let author: string | undefined;
  if ('author' in input) {
    if (typeof input.author !== 'string') {
      throw new Error('Invalid input: author deve ser string');
    }
    author = input.author;
  }

  // obrigatórios, forma positiva, return dentro
  if (
    'id' in input &&
    typeof input.id === 'number' &&
    'title' in input &&
    typeof input.title === 'string' &&
    'status' in input &&
    (input.status === 'todo' || input.status === 'doing' || input.status === 'done')
  ) {
    return {
      id: input.id,
      title: input.title,
      status: input.status,
      ...(author !== undefined && { author }),
    };
  }

  throw new Error('Invalid input: campos obrigatórios ausentes ou inválidos');
};

console.log('--- lazy com {} ---');
try {
  const t = parseTaskLazy(JSON.parse('{}'));
  console.log('passou pelo tipo:', t);
  console.log(t.title.trim());
} catch (e) {
  console.log('quebrou em runtime:', (e as Error).message);
}

console.log('--- parseTask com {} ---');
try {
  console.log(parseTask(JSON.parse('{}')));
} catch (e) {
  console.log('rejeitou:', (e as Error).message);
}

console.log('--- parseTask com objeto válido ---');
console.log(parseTask(JSON.parse('{"id":1,"title":"comprar pão","status":"todo"}')));

console.log('--- parseTask com autor ---');
console.log(parseTask(JSON.parse('{"id":2,"title":"estudar","status":"doing","author":"Fillip"}')));
