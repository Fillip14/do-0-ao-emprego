CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    status text NOT NULL DEFAULT 'todo',
    term text DEFAULT null,
    created_at timestamp with time zone NOT NULL DEFAULT now(),

    CONSTRAINT tasks_title_check
        CHECK (length(trim(title)) > 0),

    CONSTRAINT tasks_status_check
        CHECK (status IN ('todo', 'doing', 'done')),

    CONSTRAINT tasks_term_check
        CHECK (term IS NULL OR length(trim(term)) > 0)
);