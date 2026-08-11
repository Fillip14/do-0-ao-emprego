import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Todos os arquivos de teste compartilham o pool único exportado por
    // db.ts (é o mesmo processo). Rodar arquivos em paralelo faria o
    // TRUNCATE de um arquivo apagar linhas que outro acabou de inserir —
    // serializar é a escolha simples e correta aqui (Tema 5, tópico 15).
    fileParallelism: false,
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      exclude: ['dist/**', 'src/**/*.test.ts', 'src/test/**', 'vitest.config.ts'],
    },
  },
});
