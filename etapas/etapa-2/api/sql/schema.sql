CREATE TABLE tasks ( 
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),       -- gerar UUID pelo db é melhor pois ele se torna dono do UUID
    title TEXT NOT NULL CHECK (length(trim(title)) > 0), -- O title nao pode ser nulo e nem vazio, é uma forma a mais de segurança
    done BOOLEAN NOT NULL DEFAULT false,                 -- done nao pode ser null e ja vem com default false
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()        -- created at nao pode ser null e ja vem com default do time de agora
    );

