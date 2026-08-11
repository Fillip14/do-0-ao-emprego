import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { domMax, LazyMotion, MotionConfig } from 'motion/react';
import { ToastProvider } from '../contexts/ToastContext';
import { Toast } from '../components/Toast';

type Options = { route?: string };

// Reproduz o que o AppLayout monta em volta da página: sem isto ela não sobe.
export const renderWithProviders = (ui: ReactNode, { route = '/tasks' }: Options = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      {/* `domMax` direto, sem `import()`: em teste o carregamento assíncrono só
          traria espera. O app usa a versão preguiçosa (AppLayout). */}
      <LazyMotion features={domMax} strict>
        <MotionConfig reducedMotion="user">
          <ToastProvider>
            <Toast />
            {ui}
          </ToastProvider>
        </MotionConfig>
      </LazyMotion>
    </MemoryRouter>,
  );
