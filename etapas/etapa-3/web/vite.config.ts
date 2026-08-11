import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ filename: 'dist/stats.html' })],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: false,
    // Duas coisas diferentes precisavam de conserto, e eu tinha juntado as duas:
    // 1. o handler tem que CASAR com a URL pedida → resolvido pelo `*/tasks`;
    // 2. o fetch tem que conseguir PARSEAR a URL. O fetch do Node exige endereço
    //    absoluto, e "undefined/tasks" não é — ele estoura antes de o MSW ver
    //    qualquer coisa. Daí esta base falsa: ninguém escuta nesta porta, porque
    //    a requisição é interceptada antes de sair.
    env: { VITE_API_URL: 'http://localhost:3000' },
  },
});
