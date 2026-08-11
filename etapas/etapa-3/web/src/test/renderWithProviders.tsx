import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MotionConfig } from 'motion/react';
import { ToastProvider } from '../contexts/ToastContext';
import { Toast } from '../components/Toast';

type Options = { route?: string };

// Reproduz o que o AppLayout monta em volta da página: sem isto ela não sobe.
export const renderWithProviders = (ui: ReactNode, { route = '/tasks' }: Options = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <Toast />
          {ui}
        </ToastProvider>
      </MotionConfig>
    </MemoryRouter>,
  );
