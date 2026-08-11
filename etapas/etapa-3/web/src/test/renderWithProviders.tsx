import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ToastProvider } from '../contexts/ToastContext';
import { Toast } from '../components/Toast';

type Options = { route?: string };

// A TasksPage não monta crua, e cada peça aqui paga uma dívida específica:
// - MemoryRouter: a página usa useSearchParams e o ItemTask usa <Link> — os dois
//   estouram fora de um roteador. "Memory" porque não há barra de endereço em teste;
//   o histórico vive num array.
// - ToastProvider: o useTasks chama useToastActions, e o hook guardião do T12 lança
//   erro de propósito quando não acha o Provider.
// - Toast: o Provider guarda a mensagem, mas quem a coloca na tela é este componente.
//   Sem ele não existe role="status" para o teste encontrar. É o que o AppLayout faz.
export const renderWithProviders = (ui: ReactNode, { route = '/tasks' }: Options = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <ToastProvider>
        <Toast />
        {ui}
      </ToastProvider>
    </MemoryRouter>,
  );
