import { FilledTasks } from './FilledTasks';
import { EmptyTasks } from './EmptyTasks';
import { useEffect, useState } from 'react';
import { type Task, type TaskForm } from '../../../types/task';
import { InputTask } from './InputTask';
import { nextStatus } from '../../../utils/taskRules';
import { createTask, deleteTask, getTasks, updateTask } from '../../../api/tasks';
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
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

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

  const handleAddTask = async (form: TaskForm) => {
    const created = await createTask({
      title: form.title,
      status: form.status,
      term: form.term || null,
    });

    updateTasks((prev) => [...prev, created]);
  };

  const handleEditTask = async (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const updated = await updateTask(id, { title: trimmed });
    updateTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    setEditingId(null);
  };

  const handleChangeTask = async (id: string) => {
    if (pendingIds.has(id)) return; // ← a guarda

    const previous = state;
    const task = state.status === 'success' ? state.tasks.find((t) => t.id === id) : undefined;
    if (!task) return;

    const next = nextStatus[task.status];

    setPendingIds((prev) => new Set(prev).add(id));
    updateTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: next } : t)));

    try {
      await updateTask(id, { status: next });
    } catch {
      setState(previous);
    } finally {
      setPendingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (pendingIds.has(id)) return;
    if (!window.confirm('Apagar esta tarefa?')) return;

    setPendingIds((prev) => new Set(prev).add(id));

    try {
      await deleteTask(id);
      updateTasks((prev) => prev.filter((task) => task.id !== id));
    } finally {
      setPendingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
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
