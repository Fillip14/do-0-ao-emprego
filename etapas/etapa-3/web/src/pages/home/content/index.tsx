import { FilledTasks } from './FilledTasks';
import { EmptyTasks } from './EmptyTasks';
import { useEffect, useState } from 'react';
import { type Status, type Task, type TaskForm } from '../../../types/task';
import { InputTask } from './InputTask';

const STORAGE_KEY = 'do-0-ao-emprego:tasks';

const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
};

const nextStatus: Record<Status, Status> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
};

export const Content = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleChangeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: nextStatus[task.status] } : task)),
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAddTask = (form: TaskForm) => {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: form.title, status: form.status, term: form.term || null },
    ]);
  };

  return (
    <>
      <main className="flex flex-wrap justify-center gap-1">
        {tasks.length === 0 ? (
          <EmptyTasks />
        ) : (
          <FilledTasks
            tasks={tasks}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>
      <InputTask onAddTask={handleAddTask} />
    </>
  );
};
