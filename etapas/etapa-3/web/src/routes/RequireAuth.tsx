import { Navigate, useLocation, Outlet } from 'react-router';

// TODO(etapa-2/T8): trocar pela leitura real do token/sessão — a API ainda não tem auth.
const isAuthenticated = true;

export const RequireAuth = () => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
