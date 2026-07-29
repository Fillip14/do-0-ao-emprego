import { TaskList } from './tasks/TaskList';
import { EmptyTask } from './tasks/EmptyTask';
import { type Task } from '../types/task';

export type ContentProps = {
  tasks: Task[];
};

export const Content = ({ tasks }: ContentProps) => {
  if (tasks.length === 0) return <EmptyTask />;
  return <TaskList tasks={tasks} />;
};
