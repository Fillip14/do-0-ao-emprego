# API de Tarefas

Uma API desenvolvida para o plano desta etapa a qual faz parte do projeto maior chamado do-0-ao-emprego. Posteriormente ela será utilizada em outras partes.

## Stack

Utiliza node com express. Padrão ESM.

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
| GET | /tasks | Obtém as tarefas salvas em array (não persiste no momento) | Vazio | 200 + array de tarefas |
| POST | /tasks | Salva a tarefa num array (não persiste no momento) | `{"title": "..."}` | 201 + {"id": "<uuid>", "title": "..."}|

## Testando

A pasta bruno/ contém uma collection do Bruno (https://www.usebruno.com) com as requisições prontas — abra no app e dispare