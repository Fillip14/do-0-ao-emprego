import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { TaskPage } from './pages/tasks/TasksPage';
import { NotFoundPage } from './pages/notFound/NotFoundPage';
import { TaskDetailPage } from './pages/taskDetail/TaskDetailPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
