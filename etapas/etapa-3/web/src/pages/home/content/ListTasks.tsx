import type { Task } from '../../../types/task';
import { ItemTask } from './ItemTask';

type ListTasksProps = { list: Task[] };

export const ListTasks = ({ list }: ListTasksProps) => {
  return (
    <ul role="list" className="flex flex-col gap-2 mt-3">
      {list.map((task) => (
        <ItemTask key={task.id} task={task} />
      ))}
    </ul>
  );
};
