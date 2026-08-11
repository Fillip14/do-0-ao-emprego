import { FilledTasks } from './FilledTasks';
import { EmptyTasks } from './EmptyTasks';
import { useState } from 'react';
import { InputTask } from './InputTask';
import { ErrorTasks } from './ErrorTasks';
import { LoadingTasks } from './LoadingTasks';
import { Filters } from './Filters';
import { useSearchParams } from 'react-router';
import { isShowcase } from '../../utils/environment';
import { useTasks } from '../../hooks/useTasks';

export const TasksPage = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { state, pendingIds, reload, addTask, editTitle, cycleStatus, removeTask } = useTasks();

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

  const handleEditTask = async (id: string, title: string) => {
    const saved = await editTitle(id, title);
    if (saved) setEditingId(null);
  };

  const handleDeleteTask = async (id: string) => {
    if (pendingIds.has(id)) return;
    if (!window.confirm('Apagar esta tarefa?')) return;
    await removeTask(id);
  };

  return (
    <>
      {isShowcase && <ErrorTasks message="" showcase onRetry={() => {}} />}
      <Filters q={q} status={status} onChange={setParam} />
      <main className="flex flex-wrap justify-center gap-1">
        {state.status === 'loading' && <LoadingTasks />}

        {state.status === 'error' && (
          <ErrorTasks message={state.message} showcase={isShowcase} onRetry={reload} />
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
              onChangeTask={cycleStatus}
              onDeleteTask={handleDeleteTask}
            />
          ))}
      </main>
      <InputTask onAddTask={addTask} />
    </>
  );
};
