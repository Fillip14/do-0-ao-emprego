import { Outlet } from 'react-router';
import { Header } from './header/Header';
import { Suspense } from 'react';

export const AppLayout = () => {
  return (
    <div className="flex flex-col font-sans min-h-dvh w-full bg-amber-600">
      <Header />
      <Suspense fallback={<p>Carregando…</p>}>
        <Outlet />
      </Suspense>
      <footer></footer>
    </div>
  );
};
