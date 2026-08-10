import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { Content } from './pages/home/content/Content';
import { NotFoundPage } from './pages/notFound/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<Content />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
