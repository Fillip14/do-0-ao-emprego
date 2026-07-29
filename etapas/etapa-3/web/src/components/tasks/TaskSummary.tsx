import type { Task } from '../../types/task';

type TaskSummaryProps = { tasks: Task[] };

export const TaskSummary = ({ tasks }: TaskSummaryProps) => {
  const done = tasks.filter((t) => t.status === 'done').length;
  const doing = tasks.filter((t) => t.status === 'doing').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  return (
    <>
      {done > 0 && <p>Meus parabens, você tem {done} tarefas concluída</p>}
      {doing > 0 && <p>Vamos lá, força guerreiro, {doing} tarefas para terminar!!</p>}
      {todo > 0 && (
        <p>Humm olha, {todo} tarefas sem iniciar ainda, ta... tudo bem? Quer conversar?</p>
      )}
    </>
  );
};
