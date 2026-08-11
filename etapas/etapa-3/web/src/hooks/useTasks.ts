import { useEffect, useReducer, useState } from 'react';
import { type Task, type TaskForm } from '../types/task';
import { createTask, deleteTask, getTasks, updateTask } from '../api/tasks';
import { ApiError } from '../api/http';
import { nextStatus } from '../utils/taskRules';
import { isShowcase } from '../utils/environment';
import { useToastActions } from '../contexts/ToastContext';

export type TasksState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; tasks: Task[] };

type Action =
  | { type: 'loaded'; tasks: Task[] }
  | { type: 'failed'; message: string }
  | { type: 'created'; task: Task }
  | { type: 'updated'; task: Task }
  | { type: 'removed'; id: string };

const tasksReducer = (state: TasksState, action: Action): TasksState => {
  switch (action.type) {
    case 'loaded':
      return { status: 'success', tasks: action.tasks };

    case 'failed':
      return { status: 'error', message: action.message };

    case 'created':
      if (state.status !== 'success') return state;
      return { ...state, tasks: [...state.tasks, action.task] };

    case 'updated':
      if (state.status !== 'success') return state;
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)),
      };

    case 'removed':
      if (state.status !== 'success') return state;
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };

    default:
      action satisfies never; // alarme de compilação: action nova sem case
      return state;
  }
};

export const useTasks = () => {
  const { show, dismiss } = useToastActions();
  const [state, dispatch] = useReducer(tasksReducer, { status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isShowcase) return;
    const ac = new AbortController();

    getTasks(ac.signal)
      .then((tasks) => dispatch({ type: 'loaded', tasks }))
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        if (err instanceof ApiError) {
          dispatch({ type: 'failed', message: err.message });
          return;
        }

        console.error(err);
        dispatch({ type: 'failed', message: 'Não conseguimos falar com o servidor.' });
      });

    return () => ac.abort();
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const startPending = (id: string) => setPendingIds((prev) => new Set(prev).add(id));

  const endPending = (id: string) =>
    setPendingIds((prev) => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });

  const handleWriteError = (err: unknown, id: string) => {
    if (err instanceof ApiError && err.status === 404) {
      dispatch({ type: 'removed', id });
      show('Esta tarefa não existe mais.');
      return;
    }

    console.error(err);
    show('Não foi possível salvar. Tente de novo.');
  };

  const addTask = async (form: TaskForm) => {
    const created = await createTask({
      title: form.title,
      status: form.status,
      term: form.term || null,
    });

    dispatch({ type: 'created', task: created });
  };

  // Devolve se salvou: quem decide fechar o campo de edição é a página.
  const editTitle = async (id: string, title: string): Promise<boolean> => {
    const trimmed = title.trim();
    if (!trimmed) return false;

    dismiss();

    try {
      const updated = await updateTask(id, { title: trimmed });
      dispatch({ type: 'updated', task: updated });
      return true;
    } catch (err) {
      handleWriteError(err, id);
      return false;
    }
  };

  const cycleStatus = async (id: string) => {
    if (pendingIds.has(id)) return; // ← a guarda
    dismiss();

    const task = state.status === 'success' ? state.tasks.find((t) => t.id === id) : undefined;
    if (!task) return;

    const next = nextStatus[task.status];

    startPending(id);
    dispatch({ type: 'updated', task: { ...task, status: next } });

    try {
      await updateTask(id, { status: next });
    } catch (err) {
      dispatch({ type: 'updated', task }); // rollback: o mesmo evento com o valor antigo
      handleWriteError(err, id);
    } finally {
      endPending(id);
    }
  };

  const removeTask = async (id: string) => {
    if (pendingIds.has(id)) return;
    dismiss();

    startPending(id);

    try {
      await deleteTask(id);
      dispatch({ type: 'removed', id });
    } catch (err) {
      handleWriteError(err, id);
    } finally {
      endPending(id);
    }
  };

  return { state, pendingIds, reload, addTask, editTitle, cycleStatus, removeTask };
};
