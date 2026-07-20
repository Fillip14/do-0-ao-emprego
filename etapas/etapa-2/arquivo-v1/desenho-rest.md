| Objetivo | Método | Caminho | O que entra | Sai no sucesso (status + corpo) | Erros possíveis (status + quando) |
|---|---|---|---|---|---|
| listar | GET | /tasks | Vazio | 200 + lista de tarefas | 
| buscar uma | GET | /tasks/:id | Vazio | 200 + tarefa escolhida | 404 not found (quando passar id inexistente) 
| criar | POST | /tasks | {"title": "..."} | 201 + {"id": id gerado, "title": titulo enviado} | 400 bad request quando title for: ausente, não-string, ou string vazia
| atualizar | PATCH | /tasks/:id | {"title": "..."} | 200 + {"id": id do title, "title": title atualizado} | 400 bad request (enviar um dado que não seja umas string/number); 404 not found (quando passar id inexistente) 
| remover | DELETE | /tasks/:id | Vazio | 200 {message: "removido"} | 404 not found (quando passar id inexistente)