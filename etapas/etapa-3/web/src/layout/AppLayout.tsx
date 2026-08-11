import { Outlet } from 'react-router';
import { Header } from './header/Header';
import { Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { ToastProvider } from '../contexts/ToastContext';
import { Toast } from '../components/Toast';

export const AppLayout = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col font-sans min-h-dvh w-full bg-amber-600">
        <Header />
        {/* O Provider mora aqui, não na raiz: é o menor nó que cobre as duas
            páginas que disparam aviso. O Header fica de fora e não re-renderiza. */}
        <ToastProvider>
          <Toast />
          <Suspense fallback={<p>Carregando…</p>}>
            <Outlet />
          </Suspense>
        </ToastProvider>
        <footer></footer>
      </div>
    </MotionConfig>
  );
};
