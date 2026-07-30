import { FilledTasks } from './FilledTasks';
import { EmptyTasks } from './EmptyTasks';
import { type Task } from '../../types/task';
import { Card } from '../ui/Card';

export type TaskSectionProps = {
  tasks: Task[];
};

export const TaskSection = ({ tasks }: TaskSectionProps) => {
  return <Card>{tasks.length === 0 ? <EmptyTasks /> : <FilledTasks tasks={tasks} />}</Card>;
};
