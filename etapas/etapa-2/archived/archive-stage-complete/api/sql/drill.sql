-- Registro da sessão de SQL puro (S3 · Bloco A). NÃO rodar de ponta a ponta:
-- contém comandos que falharam de propósito e um UPDATE sem WHERE.

INSERT INTO tasks (title) VALUES ('oi') RETURNING *;     -- inserir na table tasks, column title o valor 'oi' e retornar tudo desta linha
INSERT INTO tasks (title) VALUES ('Teste2') RETURNING *; -- inserir na table tasks, column title o valor 'Teste2' e retornar tudo desta linha
INSERT INTO tasks (title) VALUES ('Teste3') RETURNING *; -- inserir na table tasks, column title o valor 'Teste3' e retornar tudo desta linha

SELECT * FROM tasks; -- selecionar tudo da table tasks

-- ❌ ERRO 23514 (check constraint): título vazio é barrado pelo CHECK. Nada foi inserido.
INSERT INTO tasks (title) VALUES ('') RETURNING *;

-- ❌ ERRO 23514: só espaços também cai — o trim() do CHECK esvazia a string antes de medir.
INSERT INTO tasks (title) VALUES ('   ') RETURNING *;

-- ❌ ERRO 23502 (not-null): omitir a coluna não é "não mandar nada" — sem DEFAULT, title virou NULL.
INSERT INTO tasks (done) VALUES (true) RETURNING *;


UPDATE tasks SET done = true WHERE id = 'b57addaa-0382-4a2a-a25b-7ed1c7502c16'; -- atualizar na table tasks done = true quando o id = ao repassado, UPDATE 1 → na API vira 200

-- ⚠️ RODADO DE PROPÓSITO — sem WHERE alcança TODAS as linhas. Resultado: UPDATE 3.
-- Não há como desfazer: o UPDATE não guarda o valor anterior.
-- A forma segura está logo abaixo, com BEGIN/ROLLBACK.
UPDATE tasks SET done = true;                                                   -- atualizar done = true em toda table tasks

-- ❌ ERRO 22P02 (invalid input syntax for uuid): este uuid tem um caractere a menos.
-- O banco parou na conversão do tipo e nem chegou a procurar → na API isso é 400, não 404.
UPDATE tasks SET done = true WHERE id = 'b57addaa-0382-4a2a-a25b-7ed1c7502c6';

BEGIN;                          -- inicia transação
UPDATE tasks SET done = true;   -- olha o n
SELECT * FROM tasks;            -- confere o estrago
ROLLBACK;                       -- desfaz tudo

DELETE from tasks WHERE id = 'd231983f-cfb9-4b7e-9d20-6d1f2aa832fb';   -- deletar da table tasks quando id = ao repassado, DELETE 0 → não é erro, na API vira 404
SELECT * from tasks WHERE id = 'd231983f-cfb9-4b7e-9d20-6d1f2aa832fb'; -- selecionar tudo da table tasks quando id = ao repassado → (0 rows), na API vira 404