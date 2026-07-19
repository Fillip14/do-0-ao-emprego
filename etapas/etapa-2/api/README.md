# API de Tarefas

Uma API desenvolvida para o plano desta etapa a qual faz parte do projeto maior chamado do-0-ao-emprego. Posteriormente ela será utilizada em outras partes.

## Stack

Utiliza Node.js com Express. Padrão ESM.

## Como rodar

​```
git clone https://github.com/Fillip14/do-0-ao-emprego.git
cd do-0-ao-emprego/etapas/etapa-2/api
npm install
npm start
​```

A API sobe em `http://localhost:3000`.

## Rotas

| Método | Caminho | O que faz | Body | Resposta |
|---|---|---|---|---|
| GET | /tasks | Obtém as tarefas salvas em array | Vazio | 200 + array de tarefas |
| GET | /tasks/:id | Obtém a tarefa específica pelo id | Vazio | 200 + {"id": "<uuid>", "title": "..."} |
| POST | /tasks | Salva a tarefa num array | `{"title": "..."}` | 201 + {"id": "<uuid>", "title": "..."}|
| PATCH | /tasks/:id | Atualiza o title de uma tarefa | `{"title": "..."}` | 200 + {"id": "<uuid>", "title": "..."}|
| DELETE | /tasks/:id | Deleta uma task pelo id | Vazio | 200 + {message: "Removed"} |

Todos os erros respondem `{"message": "..."}` com o status adequado (400, 404 ou 500). As tarefas ficam em array na memória — reiniciar o servidor limpa a lista (persistência chega com PostgreSQL na semana 3).

## Testando

A pasta bruno/ contém uma collection do Bruno (https://www.usebruno.com) com as requisições prontas — abra no app e dispare, incluindo os casos de erro.

`npm test` roda a suíte com 15 testes (Vitest + supertest), cobrindo sucesso e erro de todas as rotas.