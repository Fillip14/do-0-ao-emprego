import { FilledTasks } from './FilledTasks';
import { mockTasks } from '../../../data/mockTasks';
// import { empty } from '../../../data/mockTasks';
import { EmptyTasks } from './EmptyTasks';

export const Content = () => {
  const tasks = mockTasks;
  return (
    <main className="flex flex-wrap justify-center gap-1">
      {tasks.length === 0 ? <EmptyTasks /> : <FilledTasks tasks={tasks} />}
    </main>
  );
};
