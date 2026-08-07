import { type Task } from '../../../types/task';
import { Card } from '../../../components/Card';
import { ListTasks } from './ListTasks';
import { Typography } from '../../../components/Typography';

export type FilledTasksProps = {
  tasks: Task[];
  onChangeTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export const FilledTasks = ({ tasks, onChangeTask, onDeleteTask }: FilledTasksProps) => {
  const todo = tasks.filter((item) => item.status === 'todo');
  const done = tasks.filter((item) => item.status === 'done');
  const doing = tasks.filter((item) => item.status === 'doing');

  return (
    <>
      <Card>
        <Typography variant="titleTask">Olha o que você tem pronto!</Typography>
        {done.length > 0 ? (
          <ListTasks list={done} onChangeTask={onChangeTask} onDeleteTask={onDeleteTask} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <Typography variant="descriptionTask">Sem tarefas para exibir aqui.</Typography>
          </div>
        )}
      </Card>
      <Card>
        <Typography variant="titleTask">Essas estão em andamento ^^</Typography>
        {doing.length > 0 ? (
          <ListTasks list={doing} onChangeTask={onChangeTask} onDeleteTask={onDeleteTask} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <Typography variant="descriptionTask">Sem tarefas para exibir aqui.</Typography>
          </div>
        )}
      </Card>
      <Card>
        <Typography variant="titleTask">Que tal iniciar essas?</Typography>
        {todo.length > 0 ? (
          <ListTasks list={todo} onChangeTask={onChangeTask} onDeleteTask={onDeleteTask} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <Typography variant="descriptionTask">Sem tarefas para exibir aqui.</Typography>
          </div>
        )}
      </Card>
    </>
  );
};
