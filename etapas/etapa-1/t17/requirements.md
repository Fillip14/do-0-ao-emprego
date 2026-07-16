# GERENCIADOR DE TAREFAS

## Estrutura:
1. index.html: página web
2. style.css: estilização da página
3. lib.js: funções puras
4. app.js: camada que toca no DOM e storage (controller)
5. tests.js: responsável pelos testes
6. package.json com { "type": "module"}
7. Este requirements

**Formato do dado tarefa**: { id: number, title: string, done: boolean } `id: maior existente + 1`

## lib.js
1. Retorna array novo, nunca muta
2. Não toca no DOM e nem no storage
3. Utilizar padrão ESM
### Functions:
1. `addTask(tasks, title)` > novo array que adiciona tarefa no fim do array. title vazio, só espaços ou não-string >  throw new Error('invalid title').
2. `completeTask(tasks, id)` > novo array com done INVERTIDO na tarefa (toggle). id inexistente → throw new Error('task not found').
3. `removeTask(tasks, id)` > novo array sem a tarefa. id inexistente → throw new Error('task not found').

## app.js
1. `loadTasks()` > lê localStorage.getItem('tasks') e retorna o array (chave inexistente/JSON inválido → []).
2. `saveTasks(tasks)` → localStorage.setItem('tasks', JSON.stringify(tasks)).
### Fluxo:
1. Ação do usuário > função da lib > saveTasks > re-render da lista inteira a partir do array. O array na memória é a única fonte da verdade; o DOM é reflexo dele.
2. Erros da lib capturados com try/catch e mostrados na página (div .error), nunca stack trace no console do usuário.

## tests.js (só sobre o lib.js)
1. Testar as 3 functions;
2. Testar os 2 erros com assert.throws
3. Imutabilidade
4. Id não reaproveitado
5. Toggle duplo

## Outros
1. F5 sobrevive pelo localStorage
2. Commits por funções da lib que passam nos testes + um por comportamento da pagina funcionando

## Bonus
1. tasks.js: interface CLI, usar as mesmas funções da lib, fs para persistir em tasks.json
2. add/list/done/remove, saida: added: 1 - texto, [ ] 1 - texto/[x] 2 - texto, done: 2, removed: 3.