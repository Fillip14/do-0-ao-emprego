import type { Task } from '../../../types/task';
import { ItemTask } from './ItemTask';

type ListTasksProps = {
  list: Task[];
  onChangeTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export const ListTasks = ({ list, onChangeTask, onDeleteTask }: ListTasksProps) => {
  return (
    <ul role="list" className="flex flex-col gap-2 mt-3">
      {list.map((task) => (
        <ItemTask
          key={task.id}
          task={task}
          onChangeTask={onChangeTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
};
