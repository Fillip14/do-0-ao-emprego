import { Outlet, useLocation } from 'react-router';
import { Header } from './header/Header';
import { Suspense } from 'react';
import { AnimatePresence, LazyMotion, m, MotionConfig } from 'motion/react';
import { ToastProvider } from '../contexts/ToastContext';
import { Toast } from '../components/Toast';
import { duration, easing } from '../utils/motion';

// A lib sai do bundle principal e vira um chunk carregado depois da primeira pintura.
const loadFeatures = () => import('../utils/motionFeatures').then((mod) => mod.default);

export const AppLayout = () => {
  const location = useLocation();

  return (
    // `strict` estoura se sobrar um `motion.*` no lugar de `m.*`.
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div className="flex flex-col font-sans min-h-dvh w-full bg-amber-600">
          <Header />
          {/* O Provider mora aqui, não na raiz: é o menor nó que cobre as duas
              páginas que disparam aviso. O Header fica de fora e não re-renderiza. */}
          <ToastProvider>
            <Toast />
            {/* `mode="wait"`: sem ele as duas páginas ficam montadas ao mesmo tempo.
                A key é o caminho — é ela que diz à lib que a página mudou. */}
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={location.pathname}
                className="flex flex-col grow"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: duration.fast, ease: easing.enter }}
              >
                {/* O Suspense fica DENTRO do bloco animado: na primeira visita à
                    rota `lazy` quem anima é o fallback, e isso é aceito. */}
                <Suspense fallback={<p>Carregando…</p>}>
                  <Outlet />
                </Suspense>
              </m.div>
            </AnimatePresence>
          </ToastProvider>
          <footer></footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
};
