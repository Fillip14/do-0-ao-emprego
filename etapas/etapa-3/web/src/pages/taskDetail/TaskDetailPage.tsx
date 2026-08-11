import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { isUuid } from '../../utils/validationId';
import { getTask } from '../../api/tasks';
import { ApiError } from '../../api/http';
import type { Task } from '../../types/task';

type DetailState =
  | { status: 'loading' }
  | { status: 'error'; id: string; message: string }
  | { status: 'success'; id: string; task: Task };

export const TaskDetailPage = () => {
  const { id } = useParams();
  const validId = id && isUuid(id) ? id : null;

  const [state, setState] = useState<DetailState>({ status: 'loading' });

  useEffect(() => {
    if (!validId) return;

    const ac = new AbortController();

    getTask(validId, ac.signal)
      .then((task) => setState({ status: 'success', id: validId, task }))
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        if (err instanceof ApiError) {
          setState({ status: 'error', id: validId, message: err.message });
          return;
        }

        console.error(err);
        setState({
          status: 'error',
          id: validId,
          message: 'Não conseguimos falar com o servidor.',
        });
      });

    return () => ac.abort();
  }, [validId]);

  if (!validId) {
    return (
      <main>
        <p>Endereço de tarefa inválido.</p>
        <Link to="/tasks">Voltar para as tarefas</Link>
      </main>
    );
  }

  const view =
    state.status !== 'loading' && state.id === validId ? state : { status: 'loading' as const };

  if (view.status === 'loading') return <p>Carregando…</p>;

  if (view.status === 'error') {
    return (
      <main>
        <p>{view.message}</p>
        <Link to="/tasks">Voltar para as tarefas</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>{view.task.title}</h1>
      <p>{view.task.status}</p>
      <Link to="/tasks">Voltar para as tarefas</Link>
    </main>
  );
};
