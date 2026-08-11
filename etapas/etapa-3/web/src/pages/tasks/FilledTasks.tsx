import { type Task } from '../../types/task';
import { Card } from '../../components/Card';
import { Typography } from '../../components/Typography';
import { ItemTask } from './ItemTask';

export type FilledTasksProps = {
  tasks: Task[];
  hideEmpty: boolean;
  editingId: string | null;
  onEditingChange: (id: string | null) => void;
  onEditTask: (id: string, title: string) => void;
  onChangeTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export const FilledTasks = ({
  tasks,
  hideEmpty,
  editingId,
  onEditingChange,
  onEditTask,
  onChangeTask,
  onDeleteTask,
}: FilledTasksProps) => {
  const todo = tasks.filter((item) => item.status === 'todo');
  const done = tasks.filter((item) => item.status === 'done');
  const doing = tasks.filter((item) => item.status === 'doing');

  const cardsTask = [
    { title: 'Olha o que você tem pronto!', list: done },
    { title: 'Essas estão em andamento ^^', list: doing },
    { title: 'Que tal iniciar essas?', list: todo },
  ];

  const visibleCards = hideEmpty ? cardsTask.filter((item) => item.list.length > 0) : cardsTask;

  return visibleCards.map((item) => (
    <Card key={item.title}>
      <Typography variant="titleTask">{item.title}</Typography>
      {item.list.length > 0 ? (
        <ul role="list" className="flex flex-col gap-2 mt-3">
          {item.list.map((task) => (
            <ItemTask
              key={task.id}
              task={task}
              isEditing={editingId === task.id}
              onEditingChange={onEditingChange}
              onEditTask={onEditTask}
              onChangeTask={onChangeTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Typography variant="descriptionTask">Sem tarefas para exibir aqui.</Typography>
        </div>
      )}
    </Card>
  ));
};
