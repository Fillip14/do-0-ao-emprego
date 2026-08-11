import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { TasksPage } from './pages/tasks/TasksPage';
import { NotFoundPage } from './pages/notFound/NotFoundPage';
import { RequireAuth } from './routes/RequireAuth';

const TaskDetailPage = lazy(() =>
  import('./pages/taskDetail/TaskDetailPage').then((m) => ({ default: m.TaskDetailPage })),
);

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/tasks" replace />} />

        <Route element={<RequireAuth />}>
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
