import { Outlet } from 'react-router';
import { Header } from './header/Header';

export const AppLayout = () => {
  return (
    <div className="flex flex-col font-sans min-h-dvh w-full bg-amber-600">
      <Header />
      <Outlet />
      <footer></footer>
    </div>
  );
};
