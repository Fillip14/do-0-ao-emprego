import { FilledTasks } from './FilledTasks';
import { EmptyTasks } from './EmptyTasks';
import { useEffect, useState } from 'react';
import { type Task, type TaskForm } from '../../../types/task';
import { InputTask } from './InputTask';
import { loadTasks, saveTasks } from '../../../utils/taskStorage';
import { nextStatus } from '../../../utils/taskRules';

export const Content = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleEditTask = (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, title: trimmed } : task)));
    setEditingId(null);
  };

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
            editingId={editingId}
            onEditingChange={setEditingId}
            onEditTask={handleEditTask}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>
      <InputTask onAddTask={handleAddTask} />
    </>
  );
};
