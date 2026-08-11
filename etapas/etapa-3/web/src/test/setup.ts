// Roda antes de cada suíte (registrado em `setupFiles` no vite.config.ts).
// Registra os matchers do jest-dom: `toBeVisible`, `toHaveTextContent`, `toBeDisabled`.
// O sufixo `/vitest` é o que estende o `expect` do Vitest — sem ele, os matchers não existem.
import '@testing-library/jest-dom/vitest';

// O ciclo de vida do MSW (server.listen / resetHandlers / close) entra aqui na tarefa 3,
// junto com o src/test/server.ts.
