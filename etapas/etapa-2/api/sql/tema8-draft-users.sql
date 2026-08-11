-- RASCUNHO do Tema 8 — NÃO aplicado a nenhum banco ainda.
-- Eu (IA) não tenho como rodar isto aqui (sem bash/psql nesta pasta).
-- Antes de aplicar:
--   1. Revisar linha a linha — é código que você vai defender no simulado.
--   2. Decidir o que fazer com as tasks já existentes sem owner_id (ficam
--      órfãs? ganham um dono default? isso é decisão sua, não da IA).
--   3. Rodar nos dois bancos (psql -h localhost -U fillip -d tasks_dev -f ... /
--      idem tasks_test), e só então incorporar ao sql/schema.sql — ou à
--      primeira migration, se o Tema 7 (migrations) entrar antes deste.

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),

    CONSTRAINT users_email_check
        CHECK (position('@' in email) > 1)
);

-- Nullable de propósito: tasks que já existem não têm dono. NOT NULL só
-- depois de decidir o que fazer com as órfãs (passo 2 acima).
ALTER TABLE tasks ADD COLUMN owner_id uuid REFERENCES users(id);
