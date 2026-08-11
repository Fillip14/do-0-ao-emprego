import { Navigate, useLocation, Outlet } from 'react-router';

// TODO(etapa-2/T8): trocar pela leitura real do token/sessão.
// Chumbado em true porque a API ainda não tem autenticação — o guarda
// existe para o dia em que tiver, e para o desenho da rota não mudar depois.
const isAuthenticated = true;

export const RequireAuth = () => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
