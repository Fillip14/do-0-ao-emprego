import { FilledTasks } from './FilledTasks';
import { EmptyTasks } from './EmptyTasks';
import { useEffect, useState } from 'react';
import { type Task, type TaskForm } from '../../types/task';
import { InputTask } from './InputTask';
import { nextStatus } from '../../utils/taskRules';
import { createTask, deleteTask, getTasks, updateTask } from '../../api/tasks';
import { ApiError } from '../../api/http';
import { ErrorTasks } from './ErrorTasks';
import { LoadingTasks } from './LoadingTasks';
import { AlertCircle } from 'lucide-react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Filters } from './Filters';
import { useSearchParams } from 'react-router';
import { isShowcase } from '../../utils/environment';

type TasksState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; tasks: Task[] };

export const TasksPage = () => {
  const [state, setState] = useState<TasksState>({ status: 'loading' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

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

  const q = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? '';

  const setParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  const visibleTasks =
    state.status === 'success'
      ? state.tasks.filter((task) => {
          const matchQ = task.title.toLowerCase().includes(q.toLowerCase().trim());
          const matchStatus = !status || task.status === status;
          return matchQ && matchStatus;
        })
      : [];

  const updateTasks = (fn: (tasks: Task[]) => Task[]) =>
    setState((prev) =>
      prev.status === 'success' ? { status: 'success', tasks: fn(prev.tasks) } : prev,
    );

  const handleWriteError = (err: unknown, id: string) => {
    if (err instanceof ApiError && err.status === 404) {
      updateTasks((prev) => prev.filter((task) => task.id !== id));
      setNotice('Esta tarefa não existe mais.');
      return;
    }

    console.error(err);
    setNotice('Não foi possível salvar. Tente de novo.');
  };

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

    setNotice(null);

    try {
      const updated = await updateTask(id, { title: trimmed });
      updateTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      setEditingId(null);
    } catch (err) {
      handleWriteError(err, id);
    }
  };

  const handleChangeTask = async (id: string) => {
    if (pendingIds.has(id)) return; // ← a guarda
    setNotice(null);

    const previous = state;
    const task = state.status === 'success' ? state.tasks.find((t) => t.id === id) : undefined;
    if (!task) return;

    const next = nextStatus[task.status];

    setPendingIds((prev) => new Set(prev).add(id));
    updateTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: next } : t)));

    try {
      await updateTask(id, { status: next });
    } catch (err) {
      setState(previous);
      handleWriteError(err, id);
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
    setNotice(null);

    setPendingIds((prev) => new Set(prev).add(id));

    try {
      await deleteTask(id);
      updateTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      handleWriteError(err, id);
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
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 justify-center mb-2"
        >
          <AlertCircle aria-hidden />
          <Typography variant="mediumText">{notice}</Typography>
          <Button onClick={() => setNotice(null)}>Fechar</Button>
        </div>
      )}
      <Filters q={q} status={status} onChange={setParam} />
      <main className="flex flex-wrap justify-center gap-1">
        {state.status === 'loading' && <LoadingTasks />}

        {state.status === 'error' && (
          <ErrorTasks
            message={state.message}
            showcase={isShowcase}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        )}

        {state.status === 'success' &&
          (visibleTasks.length === 0 ? (
            <EmptyTasks
              filtered={Boolean(q || status)}
              onClear={() => setSearchParams({}, { replace: true })}
            />
          ) : (
            <FilledTasks
              hideEmpty={Boolean(q || status)}
              tasks={visibleTasks}
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
