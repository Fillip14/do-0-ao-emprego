import { FilledTasks } from './FilledTasks';
import { EmptyTasks } from './EmptyTasks';
import { useEffect, useState } from 'react';
import { type Task, type TaskForm } from '../../../types/task';
import { InputTask } from './InputTask';
import { nextStatus } from '../../../utils/taskRules';
import { getTasks } from '../../../api/tasks';
import { ApiError } from '../../../api/http';
import { ErrorTasks } from './ErrorTasks';
import { LoadingTasks } from './LoadingTasks';

type TasksState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; tasks: Task[] };

export const Content = () => {
  const [state, setState] = useState<TasksState>({ status: 'loading' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const ac = new AbortController();

    getTasks(ac.signal)
      .then((tasks) => setState({ status: 'success', tasks }))
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        if (err instanceof ApiError) {
          setState({ status: 'error', message: err.message });
          return;
        }

        console.error(err);
        setState({ status: 'error', message: 'Não conseguimos falar com o servidor.' });
      });

    return () => ac.abort();
  }, [reloadKey]);

  const updateTasks = (fn: (tasks: Task[]) => Task[]) =>
    setState((prev) =>
      prev.status === 'success' ? { status: 'success', tasks: fn(prev.tasks) } : prev,
    );

  const handleEditTask = (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    updateTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: trimmed } : task)),
    );
    setEditingId(null);
  };

  const handleChangeTask = (id: string) => {
    updateTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: nextStatus[task.status] } : task)),
    );
  };

  const handleDeleteTask = (id: string) => {
    updateTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAddTask = (form: TaskForm) => {
    updateTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: form.title, status: form.status, term: form.term || null },
    ]);
  };

  return (
    <>
      <main className="flex flex-wrap justify-center gap-1">
        {state.status === 'loading' && <LoadingTasks />}

        {state.status === 'error' && (
          <ErrorTasks message={state.message} onRetry={() => setReloadKey((k) => k + 1)} />
        )}

        {state.status === 'success' &&
          (state.tasks.length === 0 ? (
            <EmptyTasks />
          ) : (
            <FilledTasks
              tasks={state.tasks}
              editingId={editingId}
              onEditingChange={setEditingId}
              onEditTask={handleEditTask}
              onChangeTask={handleChangeTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
      </main>
      <InputTask onAddTask={handleAddTask} />
    </>
  );
};
