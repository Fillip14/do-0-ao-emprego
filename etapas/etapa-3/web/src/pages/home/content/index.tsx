import { FilledTasks } from './FilledTasks';
import { mockTasks } from '../../../data/mockTasks';
import { EmptyTasks } from './EmptyTasks';
import { useState } from 'react';
import { type Status } from '../../../types/task';
import { InputTask } from './InputTask';

const nextStatus: Record<Status, Status> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
};

export const Content = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const handleChangeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: nextStatus[task.status] } : task)),
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAddTask = (text: string) => {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: text, status: 'todo', term: null },
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
